import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from '@/components/ui/multi-type-ripple-buttons';

// --- Internal: Animated WebGL Background ---
const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const [backgroundColor] = useState([0.04, 0.04, 0.04]); // dark bg always

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const vertSrc = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragSrc = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){
        return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0;
      }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff=center-uv;
        float len=length(diff);
        len+=variation(diff,vec2(0.,1.),5.,2.);
        len-=variation(diff,vec2(1.,0.),5.,2.);
        float circle=smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        uv.x*=1.5; uv.x-=0.25;
        float mask=0.0;
        float radius=.35;
        vec2 center=vec2(.5);
        mask+=paintCircle(uv,center,radius,.035).r;
        mask+=paintCircle(uv,center,radius-.018,.01).r;
        mask+=paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        // NewFix cyan/blue palette
        vec3 fg=vec3(v.x*0.2+0.05, v.y*0.5+0.3, 0.9-v.y*v.x*0.3);
        vec3 color=mix(uBackgroundColor,fg,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    glProgramRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(prog, 'iTime');
    const iResLoc = gl.getUniformLocation(prog, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(prog, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let raf: number;
    const render = (t: number) => {
      gl.uniform1f(iTimeLoc, t * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ background: '#0a0a0a' }}
    />
  );
};

// --- Internal: Check icon ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// --- Exported Types ---
export interface NewFixPlanProps {
  planName: string;
  description: string;
  speed: string;        // e.g. "200 MB" or "500 Mbps"
  price: string;        // e.g. "$19.441"
  priceNote?: string;   // e.g. "Precio sin impuesto: $16.066"
  features: string[];
  buttonText: string;
  buttonHref?: string;
  isPopular?: boolean;
  popularLabel?: string;
  buttonVariant?: 'primary' | 'secondary';
}

// --- Exported: Individual Glassy Pricing Card ---
export const NewFixPricingCard = ({
  planName, description, speed, price, priceNote,
  features, buttonText, buttonHref = '#contacto',
  isPopular = false, popularLabel = 'TOP',
  buttonVariant = 'primary',
}: NewFixPlanProps) => {
  const cardClass = [
    'backdrop-blur-[14px] rounded-2xl shadow-xl flex-1 px-7 py-8 flex flex-col transition-all duration-300 relative',
    'bg-gradient-to-br from-white/10 to-white/5 border border-white/10',
    isPopular
      ? 'scale-105 ring-2 ring-cyan-400/30 border-cyan-400/30 from-white/20 to-white/10 shadow-2xl'
      : '',
  ].join(' ');

  const btnClass = [
    'mt-auto w-full py-3 rounded-xl font-semibold text-sm transition font-sans',
    buttonVariant === 'primary'
      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg'
      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  ].join(' ');

  return (
    <div className={cardClass}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-4 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white uppercase tracking-wide shadow-lg">
          {popularLabel}
        </div>
      )}

      {/* Plan name */}
      <h2 className="text-3xl font-extralight tracking-tight text-white mb-1"
        style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
        {planName}
      </h2>
      <p className="text-sm text-white/60 mb-4">{description}</p>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-4xl font-extralight text-white tracking-tight"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
          {price}
        </span>
        <span className="text-sm text-white/50">/mes</span>
      </div>
      {priceNote && <p className="text-xs text-white/40 mb-2">{priceNote}</p>}

      {/* Speed badge */}
      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 w-fit mb-5">
        <span className="text-cyan-300 font-bold text-sm">{speed}</span>
      </div>

      {/* Divider */}
      <div className="w-full mb-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Features */}
      <ul className="flex flex-col gap-2 text-sm text-white/85 mb-6 font-sans flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <CheckIcon />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <RippleButton
        className={btnClass}
        onClick={() => { window.open(buttonHref, buttonHref.startsWith('http') ? '_blank' : '_self'); }}
        rippleColor="rgba(255,255,255,0.25)"
      >
        {buttonText}
      </RippleButton>
    </div>
  );
};

// --- Exported: Full animated pricing section ---
interface NewFixPricingSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  plans: NewFixPlanProps[];
  showBackground?: boolean;
}

export const NewFixPricingSection = ({
  title = <>El plan ideal para <span className="text-cyan-300">cada necesidad</span></>,
  subtitle = 'Todos los planes incluyen instalación gratuita y soporte técnico local.',
  plans,
  showBackground = true,
}: NewFixPricingSectionProps) => {
  return (
    <section id="planes" className="relative overflow-hidden min-h-screen flex flex-col justify-center py-24">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* WebGL animated canvas */}
      {showBackground && (
        <div className="absolute inset-0">
          <ShaderCanvas />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
            ✦ Nuestros planes
          </span>
          <h2
            className="text-5xl md:text-6xl font-extralight tracking-tight mb-4"
            style={{
              fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <NewFixPricingCard key={plan.planName} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};
