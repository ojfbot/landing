import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  LineSegments,
  LineBasicMaterial,
} from "three";

const PARTICLE_COUNT = 200;
const GRID_LINES = 24;

/**
 * Decorative Three.js scene rendered behind portfolio cards.
 * Particles drift with scroll, wireframe grid distorts subtly.
 */
export class ScrollScene {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer | null = null;
  private particles: Points | null = null;
  private gridLines: LineSegments | null = null;
  private scrollProgress = 0;
  private frameId = 0;
  private destroyed = false;
  private startTime = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.z = 5;
  }

  init() {
    try {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x000000, 0);
    } catch {
      return; // No WebGL — degrade
    }

    this.resize();
    this.createParticles();
    this.createGrid();
    this.startTime = performance.now();
    this.loop();
  }

  private createParticles() {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i] = Math.random() * 3 + 1;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
    geo.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));

    const mat = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: [0.486, 0.416, 0.969] }, // accent purple
      },
      vertexShader: `
        attribute float aSize;
        attribute float aSpeed;
        uniform float uTime;
        uniform float uScroll;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          // Drift with time + scroll
          pos.y += sin(uTime * aSpeed + position.x * 0.5) * 0.3;
          pos.x += cos(uTime * aSpeed * 0.7 + position.z) * 0.2;
          pos.z += uScroll * aSpeed * 4.0;

          // Wrap z
          pos.z = mod(pos.z + 3.0, 6.0) - 3.0;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (3.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;

          // Fade with depth
          vAlpha = smoothstep(0.0, 2.0, -mvPos.z) * smoothstep(8.0, 4.0, -mvPos.z);
          vAlpha *= 0.4;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          // Soft circle
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new Points(geo, mat);
    this.scene.add(this.particles);
  }

  private createGrid() {
    const positions: number[] = [];
    const span = 8;
    const step = span / GRID_LINES;

    // Horizontal lines
    for (let i = 0; i <= GRID_LINES; i++) {
      const y = -span / 2 + i * step;
      positions.push(-span / 2, y, 0, span / 2, y, 0);
    }
    // Vertical lines
    for (let i = 0; i <= GRID_LINES; i++) {
      const x = -span / 2 + i * step;
      positions.push(x, -span / 2, 0, x, span / 2, 0);
    }

    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(positions), 3),
    );

    const mat = new LineBasicMaterial({
      color: 0x7c6af7,
      transparent: true,
      opacity: 0.04,
    });

    this.gridLines = new LineSegments(geo, mat);
    this.gridLines.position.z = -2;
    this.scene.add(this.gridLines);
  }

  setScrollProgress(value: number) {
    this.scrollProgress = value;
  }

  resize() {
    if (!this.renderer) return;
    const { canvas } = this;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;

    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    if (this.destroyed) return;
    this.frameId = requestAnimationFrame(this.loop);

    if (!this.renderer) return;

    const elapsed = (performance.now() - this.startTime) * 0.001;

    // Update particle uniforms
    if (this.particles) {
      const mat = this.particles.material as ShaderMaterial;
      mat.uniforms.uTime!.value = elapsed;
      mat.uniforms.uScroll!.value = this.scrollProgress;
    }

    // Subtle grid distortion on scroll
    if (this.gridLines) {
      this.gridLines.rotation.z = Math.sin(elapsed * 0.2) * 0.02;
      this.gridLines.position.z = -2 + this.scrollProgress * 0.5;
      (this.gridLines.material as LineBasicMaterial).opacity =
        0.03 + this.scrollProgress * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frameId);

    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as ShaderMaterial).dispose();
      this.scene.remove(this.particles);
    }
    if (this.gridLines) {
      this.gridLines.geometry.dispose();
      (this.gridLines.material as LineBasicMaterial).dispose();
      this.scene.remove(this.gridLines);
    }

    this.renderer?.dispose();
  }
}
