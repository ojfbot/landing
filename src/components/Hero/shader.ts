/**
 * Elevator Visual — GLSL fragment shader by Matthias Hurrle (@atzedent)
 * Adapted for jim.software landing page backdrop.
 */

export const FRAGMENT_SOURCE = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define MN min(R.x,R.y)
#define T (PI*8.+time)
#define S smoothstep
#define SE(v,s) S(s+1./MN,s-1./MN,v)
#define hue(a) (.5+.5*cos(PI*(a)-vec3(1,.5,.5)*PI))
#define PI radians(180.)
float box(vec2 p, float s, float r) {
  p=abs(p)-s+r;
  return length(max(p,.0))+min(.0,max(p.x,p.y))-r;
}
vec3 pattern(vec2 uv, float tc, float ta) {
  vec2 o=vec2(2.5,1.5);
  vec2 p=uv*1.5, id=clamp(.5+round(p/.25-.5),-o,o);
  p-=clamp(.5+round(p/.25-.5),-o,o)*.25;
  float d=box(p,.1,.003);
  vec3 col=vec3(0);
  id=vec2(-id.x,-id.y);
  float k=3., t=mod(ta*k,20.);
  float e=SE(d,.0);
  col+=hue(PI/2.+floor(tc))*e;
  if (t > 5. && t <= 15.) {
    float tt=floor(mod((ta*k-5.)*3.5,35.));
    vec2 q=abs(id);
    col*=tt>=floor(q.x+q.y)?1.:.125;
  } else if (t > 15.) {
    float tt=floor(mod((ta*k-20.)*5.,25.));
    vec2 q=abs(id);
    col*=tt>=floor(q.x+q.y)?.125:1.;
  } else {
    float tt=floor(mod(ta*k*6.,30.));
    vec2 q=id+o+.5;
    col*=tt>=floor(q.x+q.y*(R.x>R.y?6.:4.))?1.:.125;
  }
  return col;
}
void divide(inout vec2 p) {
  p.x=mod(p.x*2.+.5,2.)-1.;
  p.y-=clamp(round(p.y),.0,6.);
}
void main() {
  vec2 uv=(FC-.5*R)/MN;
  if (R.y<R.x) {
    uv=uv.yx;
  }
  vec3 col=vec3(0);
  float
  g=R.y<R.x?abs(uv.y)*.25:.0, k=clamp(dot(g,g),.0,1.),
  f=.2, t=f*T, tt=T*.5;
  uv*=.5;
  vec2
  p=vec2(uv.x-k,0.75)/abs(uv.y)-vec2(0.0+t*1.00,-1.),
  q=vec2(uv.x-k,1.25)/abs(uv.y)-vec2(1.0+t*0.50,+1.),
  r=vec2(uv.x-k,1.50)/abs(uv.y)-vec2(2.0+t*0.25,+1.);
  divide(p); divide(q); divide(r);
  col+=pattern(p,t,tt);
  col+=pattern(q,t+(PI/2.)*f,tt+.2);
  col+=pattern(r,t+PI*f,tt+.4);
  col/=1.+exp(-col);
  col=pow(col,vec3(.4545));
  col=mix(vec3(0),col,min(time*.3,1.));
  uv=FC/R;
  float vig=uv.x*uv.y*(1.-uv.x)*(1.-uv.y);
  col=mix(col,col*col*.1,S(1.,.0,pow(vig*25.,.3)));
  O=vec4(col,1);
}`;

const VERTEX_SOURCE =
  "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}";

const VERTICES = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

export class ShaderRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private locs: {
    resolution: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
  } = { resolution: null, time: null };
  private frameId = 0;
  private destroyed = false;

  constructor(private canvas: HTMLCanvasElement, private scale: number) {
    const gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
  }

  start() {
    this.resize();
    this.setup();
    this.loop(0);
  }

  resize() {
    const { canvas, gl, scale } = this;
    canvas.width = canvas.clientWidth * scale;
    canvas.height = canvas.clientHeight * scale;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const { gl } = this;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    }
  }

  private setup() {
    const { gl } = this;
    this.vs = gl.createShader(gl.VERTEX_SHADER)!;
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    this.compile(this.vs, VERTEX_SOURCE);
    this.compile(this.fs, FRAGMENT_SOURCE);

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(this.program));
    }

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    this.locs.resolution = gl.getUniformLocation(this.program, "resolution");
    this.locs.time = gl.getUniformLocation(this.program, "time");
  }

  private loop = (now: number) => {
    if (this.destroyed) return;
    const { gl, program, canvas } = this;
    if (!program) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.uniform2f(this.locs.resolution, canvas.width, canvas.height);
    gl.uniform1f(this.locs.time, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.frameId = requestAnimationFrame(this.loop);
  };

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frameId);
    const { gl, program, vs, fs, buffer } = this;
    if (program) {
      if (vs) {
        gl.detachShader(program, vs);
        gl.deleteShader(vs);
      }
      if (fs) {
        gl.detachShader(program, fs);
        gl.deleteShader(fs);
      }
      gl.deleteProgram(program);
    }
    if (buffer) gl.deleteBuffer(buffer);
  }
}
