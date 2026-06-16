"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type GLSLHillsProps = {
  width?: string;
  height?: string;
  cameraZ?: number;
  planeSize?: number;
  speed?: number;
  /** RGB 0..1 line color. Defaults follow light/dark theme. */
  color?: [number, number, number];
};

const GLSLHills = ({
  width = "100vw",
  height = "100vh",
  cameraZ = 125,
  planeSize = 256,
  speed = 0.5,
  color,
}: GLSLHillsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Persist the animation clock ACROSS remounts (React Strict Mode double-mount
  // in dev, fast-refresh, theme effect re-runs). Without this the scene rebuilds
  // from time 0 and the terrain visibly "restarts". This ref keeps it continuous.
  const persistTime = useRef(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    let raf = 0;
    let ro: ResizeObserver | null = null;

    const isDark = () => document.documentElement.classList.contains("dark");
    // Theme-aware: a bright gray glow on the dark page; on cream we need a
    // genuinely dark ink so the ridge lines actually read against the paper.
    // Off-white ridge lines on pitch-black in dark; near-black lines on
    // off-white in light. Neutral grays (no warm tint) to match the new scheme.
    const themeColor = (): [number, number, number] =>
      color ?? (isDark() ? [0.88, 0.88, 0.9] : [0.12, 0.12, 0.14]);
    // Wireframe ridge lines — these don't fill, so opacity can be higher
    // without ever forming a slab. Light needs a bit more to show on cream.
    const themeOpacity = (): number => (isDark() ? 0.5 : 0.5);

    // Plane class
    class Plane {
      uniforms: {
        time: { type: string; value: number };
        uColor: { value: THREE.Vector3 };
        uOpacity: { value: number };
      };
      mesh: THREE.Mesh;
      time: number;

      constructor() {
        this.uniforms = {
          time: { type: "f", value: persistTime.current },
          uColor: { value: new THREE.Vector3(...themeColor()) },
          uOpacity: { value: themeOpacity() },
        };
        this.mesh = this.createMesh();
        this.time = speed;
      }

      createMesh() {
        return new THREE.Mesh(
          new THREE.PlaneGeometry(planeSize, planeSize, planeSize, planeSize),
          new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
              #define GLSLIFY 1
              attribute vec3 position;
              uniform mat4 projectionMatrix;
              uniform mat4 modelViewMatrix;
              uniform float time;
              varying vec3 vPosition;

              mat4 rotateMatrixX(float radian) {
                return mat4(
                  1.0, 0.0, 0.0, 0.0,
                  0.0, cos(radian), -sin(radian), 0.0,
                  0.0, sin(radian), cos(radian), 0.0,
                  0.0, 0.0, 0.0, 1.0
                );
              }

              vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
              vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
              vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

              float cnoise(vec3 P) {
                vec3 Pi0 = floor(P);
                vec3 Pi1 = Pi0 + vec3(1.0);
                Pi0 = mod289(Pi0);
                Pi1 = mod289(Pi1);
                vec3 Pf0 = fract(P);
                vec3 Pf1 = Pf0 - vec3(1.0);
                vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                vec4 iy = vec4(Pi0.yy, Pi1.yy);
                vec4 iz0 = Pi0.zzzz;
                vec4 iz1 = Pi1.zzzz;

                vec4 ixy = permute(permute(ix) + iy);
                vec4 ixy0 = permute(ixy + iz0);
                vec4 ixy1 = permute(ixy + iz1);

                vec4 gx0 = ixy0 * (1.0 / 7.0);
                vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
                gx0 = fract(gx0);
                vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                vec4 sz0 = step(gz0, vec4(0.0));
                gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                vec4 gx1 = ixy1 * (1.0 / 7.0);
                vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
                gx1 = fract(gx1);
                vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                vec4 sz1 = step(gz1, vec4(0.0));
                gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                g000 *= norm0.x;
                g010 *= norm0.y;
                g100 *= norm0.z;
                g110 *= norm0.w;
                vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                g001 *= norm1.x;
                g011 *= norm1.y;
                g101 *= norm1.z;
                g111 *= norm1.w;

                float n000 = dot(g000, Pf0);
                float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
                float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                float n111 = dot(g111, Pf1);

                vec3 fade_xyz = fade(Pf0);
                vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
                return 2.2 * n_xyz;
              }

              void main(void) {
                vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;
                float sin1 = sin(radians(updatePosition.x / 128.0 * 90.0));
                vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -30.0);
                float noise1 = cnoise(noisePosition * 0.08);
                float noise2 = cnoise(noisePosition * 0.06);
                float noise3 = cnoise(noisePosition * 0.4);
                vec3 lastPosition = updatePosition + vec3(0.0,
                  noise1 * sin1 * 8.0
                  + noise2 * sin1 * 8.0
                  + noise3 * (abs(sin1) * 2.0 + 0.5)
                  + pow(sin1, 2.0) * 40.0, 0.0);

                vPosition = lastPosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);
              }
            `,
            fragmentShader: `
              precision highp float;
              #define GLSLIFY 1
              varying vec3 vPosition;
              uniform vec3 uColor;
              uniform float uOpacity;

              void main(void) {
                // Fade lines out with distance so the far edge dissolves softly
                // and the near ridges read clearly. Wireframe means no fill, so
                // we can run a healthy opacity without a black slab forming.
                float d = length(vPosition);
                // Fade is RADIAL (distance from world origin). Camera-facing near
                // ridges have length <~90; the far horizon convergence sits at
                // ~110-145 where many rows pack into a few pixels and overdraw
                // into a dark mass. Fade ONLY that far band: full opacity for
                // d<=90 (all near/mid ridges survive), dissolved by ~150.
                float fade = smoothstep(150.0, 90.0, d);
                gl_FragColor = vec4(uColor, fade * uOpacity);
              }
            `,
            transparent: true,
            wireframe: true,
            depthWrite: false,
          }),
        );
      }

      render(time: number) {
        this.uniforms.time.value += time * this.time;
        // Keep `time` bounded so the noise sampled at `time * -30` never grows
        // large enough to lose float precision. For the wrap to be INVISIBLE,
        // the z-offset (time * 30) must advance by a whole number of perlin
        // lattice periods (289) at EVERY sampled scale (0.08, 0.06, 0.4).
        // gcd(scales) = 0.02, so we need 30 * WRAP * 0.02 = k * 289, i.e.
        // WRAP = 289 * k / 0.6. k = 6 → WRAP = 2890 (a few minutes between wraps),
        // and 2890*30*0.08=6936=24·289, *0.06=5202=18·289, *0.4=34680=120·289 —
        // all exact integer multiples, so the terrain is seamless across the wrap.
        const WRAP = (289.0 * 6.0) / 0.6;
        if (this.uniforms.time.value > WRAP) {
          this.uniforms.time.value -= WRAP;
        }
        // Stash the clock so a remount resumes from here instead of from 0.
        persistTime.current = this.uniforms.time.value;
      }
    }

    // Three.js setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: false });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    const plane = new Plane();
    // Self-contained clock via performance.now() — never stalls (THREE.Clock is
    // deprecated and can return 0/garbage deltas, which would freeze the scroll).
    let lastT = performance.now();

    // Size to the CONTAINER (the hero box), not the window — otherwise on a
    // portrait phone the canvas renders at the full viewport height, overflows
    // the ~72vh hero, gets clipped, and the perspective squeezes the terrain.
    const resize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return; // pre-layout tick — avoid NaN aspect
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false); // updateStyle=false → keep CSS inset:0
      camera.aspect = w / h;
      // HORIZONTAL-FOV LOCK: PerspectiveCamera's `fov` is the VERTICAL fov, so a
      // wide-short hero box (aspect ~3:1) would crop the terrain vertically and
      // look zoomed-in. Instead, hold a constant horizontal field of view and
      // DERIVE the vertical fov from the current aspect — wide boxes then show
      // MORE terrain top-to-bottom (zoomed out) instead of cropping. Clamp so
      // tall/portrait phones don't blow it out.
      const HFOV = 70; // degrees of horizontal field of view to keep constant
      const hfovRad = (HFOV * Math.PI) / 180;
      const vfovRad = 2 * Math.atan(Math.tan(hfovRad / 2) / camera.aspect);
      camera.fov = THREE.MathUtils.clamp(
        (vfovRad * 180) / Math.PI,
        38,
        90,
      );
      camera.updateProjectionMatrix();
    };

    let disposed = false;

    const render = () => {
      const now = performance.now();
      // Delta in seconds. Clamp so a backgrounded tab (huge delta) or a stalled
      // timer (zero/negative delta) can never freeze OR jump the animation —
      // we always advance by at least a sane frame so it scrolls forever.
      let delta = (now - lastT) / 1000;
      lastT = now;
      if (!(delta > 0) || delta > 0.05) delta = 0.016;
      plane.render(delta);
      renderer.render(scene, camera);
    };

    const renderLoop = () => {
      if (disposed) return; // orphaned loop (Strict Mode double-mount) stops here
      render();
      raf = requestAnimationFrame(renderLoop);
    };

    const init = () => {
      renderer.setClearColor(0x000000, 0);
      camera.position.set(0, 22, cameraZ);
      camera.lookAt(new THREE.Vector3(0, 18, 0));
      scene.add(plane.mesh);
      window.addEventListener("resize", resize);
      ro = new ResizeObserver(resize);
      if (containerRef.current) ro.observe(containerRef.current);
      resize();
      lastT = performance.now();
      renderLoop();
    };

    init();

    // Recolor live when the theme (.dark class) toggles.
    const themeObserver = new MutationObserver(() => {
      plane.uniforms.uColor.value.set(...themeColor());
      plane.uniforms.uOpacity.value = themeOpacity();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      disposed = true;
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ro?.disconnect();
      plane.mesh.geometry.dispose();
      (plane.mesh.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [cameraZ, planeSize, speed, color]);

  return (
    <div ref={containerRef} style={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "block",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export { GLSLHills };
