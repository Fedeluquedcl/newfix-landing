import React, { useState, useRef, useEffect } from 'react';
import { Clock, Shield, MapPin, Wifi, CheckCircle2, ChevronDown, ChevronUp, Mail, Instagram, Facebook, Menu, X } from 'lucide-react';
import { NewFixPricingSection, type NewFixPlanProps } from '@/components/ui/animated-glassy-pricing';

// ── WebGL Fiber Optic Hero Canvas ──
const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMouseMove);

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertSrc = `attribute vec2 aPos; void main(){gl_Position=vec4(aPos,0,1);}`;

    const fragSrc = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iRes;
      uniform vec2 iMouse;

      float hash(float n){ return fract(sin(n)*43758.5453); }

      void main(){
        vec2 uv = gl_FragCoord.xy / iRes;
        float asp = iRes.x / iRes.y;

        vec2 p = vec2((uv.x*2.0-1.0)*asp, uv.y*2.0-1.0);
        vec2 m = vec2((iMouse.x/iRes.x*2.0-1.0)*asp, 1.0-iMouse.y/iRes.y*2.0);

        // dark base matching plans section
        vec3 col = vec3(0.04, 0.04, 0.04);

        // very subtle ambient mouse glow
        float md = length(p - m);
        col += vec3(0.0, 0.08, 0.22) * exp(-md*md*4.0) * 0.18;

        for(int i=0; i<28; i++){
          float fi = float(i)/27.0;
          float seed = fi*7.39+1.0;
          float speed = 0.12 + hash(fi*3.7)*0.14;
          float t = iTime * speed;

          float yc = fi*2.0-1.0;
          float x = p.x;

          float y = yc
            + sin(x*1.6 + t + seed)        * 0.07
            + sin(x*3.3 - t*1.2 + seed*2.0) * 0.03
            + sin(x*7.1 + t*0.8 + seed*3.5) * 0.012;

          // subtle mouse pull
          float mxInfl = exp(-(m.x-x)*(m.x-x)*1.2);
          float yAtMx = yc
            + sin(m.x*1.6 + t + seed)        * 0.07
            + sin(m.x*3.3 - t*1.2 + seed*2.0) * 0.03
            + sin(m.x*7.1 + t*0.8 + seed*3.5) * 0.012;
          y += (m.y - yAtMx) * mxInfl * 0.22;

          float dist = abs(p.y - y);

          // hair-thin core only — no wide glow
          float core  = 0.00022/(dist*dist+0.000028);
          float halo  = 0.00055/(dist*dist+0.00055);
          float strand = min(core + halo, 1.8);

          // traveling pulse dimmer overall
          float pspeed = 1.2 + hash(fi*1.9)*1.4;
          float pulse = 0.15 + 0.85*pow(max(0.0,sin(x*3.0-t*pspeed+fi*6.28)),4.0);
          strand *= pulse;

          // plans-section palette: deep cyan → blue
          float hv = hash(fi*2.3)*0.2;
          vec3 fc = mix(
            vec3(0.05, 0.7+hv*0.2, 0.9),
            vec3(0.1+hv*0.2, 0.3, 0.9),
            fi*0.65+hv*0.25
          );
          col += fc * strand * 0.55;
        }

        // tiny cursor dot
        col += vec3(0.1,0.5,1.0)*0.018/(md*md+0.018);

        // vignette keeps edges dark like plans section
        float vig = 1.0 - dot(uv*2.0-1.0, uv*2.0-1.0)*0.35;
        col *= vig;

        gl_FragColor = vec4(clamp(col,0.0,1.0),1.0);
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

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, 'iTime');
    const uRes   = gl.getUniformLocation(prog, 'iRes');
    const uMouse = gl.getUniformLocation(prog, 'iMouse');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    const render = (t: number) => {
      gl.uniform1f(uTime,  t * 0.001);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
};

const HOGAR_PLANS: NewFixPlanProps[] = [
  {
    planName: 'Premium',
    description: 'Velocidad superior para el uso diario',
    speed: '200 MB',
    price: '$21.000',
    priceNote: 'Precio sin impuesto: $17.355',
    features: ['Velocidad superior', 'Soporte técnico', 'Instalación express'],
    buttonText: 'Contratar',
    buttonHref: 'https://forms.gle/uXXEkfX1bP393zuH8',
    buttonVariant: 'secondary',
    isPopular: false,
  },
  {
    planName: '⚡ Fibra 500 Megas',
    description: 'Máxima velocidad para tu hogar',
    speed: '500 Mbps',
    price: '$27.000',
    priceNote: 'Precio sin impuesto: $22.314',
    features: ['Máxima velocidad', 'Atención personalizada', 'Instalación express'],
    buttonText: '¡Contratar Ahora!',
    buttonHref: 'https://forms.gle/uXXEkfX1bP393zuH8',
    buttonVariant: 'primary',
    isPopular: true,
    popularLabel: 'TOP',
  },
  {
    planName: 'Family',
    description: 'Ideal para familias y múltiples dispositivos',
    speed: '300 MB',
    price: '$23.000',
    priceNote: 'Precio sin impuesto: $19.008',
    features: ['Ideal para familias', 'Múltiples dispositivos', 'Instalación express'],
    buttonText: 'Contratar',
    buttonHref: 'https://forms.gle/uXXEkfX1bP393zuH8',
    buttonVariant: 'secondary',
    isPopular: false,
  },
];

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-lg font-medium text-white/90">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-cyan-400 flex-shrink-0" />}
      </button>
      {isOpen && <div className="mt-3"><p className="text-white/60 leading-relaxed">{answer}</p></div>}
    </div>
  );
}

function SpeedTest() {
  const tests = [
    { name: 'Test NewFix', desc: 'Test oficial de NewFix', url: 'https://newfix.speedtestcustom.com/' },
    { name: 'WIFIMAN', desc: 'Herramienta de diagnóstico WiFi', url: 'http://wifiman.com/' },
    { name: 'SPEEDTEST', desc: 'Test de velocidad Ookla', url: 'https://www.speedtest.net/' },
    { name: 'FAST', desc: 'Test de velocidad de Netflix', url: 'https://fast.com/es/' },
  ];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tests.map(t => (
        <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
          className="backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-cyan-400/30 transition-all hover:scale-105 group">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">{t.name}</h3>
          <p className="text-white/60 mb-4 text-sm">{t.desc}</p>
          <span className="inline-block mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
            Iniciar Test
          </span>
        </a>
      ))}
    </div>
  );
}

const whatsappSvg = (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const faqs = [
    { question: '¿Cuánto demora la instalación?', answer: 'La instalación se realiza en un plazo máximo de 24 horas hábiles desde la contratación del servicio.' },
    { question: '¿Qué necesito para contratar el servicio?', answer: 'Solo necesitas un documento de identidad válido y estar en nuestra zona de cobertura. Nuestro equipo técnico se encarga de toda la instalación.' },
    { question: '¿El servicio incluye WiFi?', answer: 'Sí, todos nuestros planes incluyen un router WiFi de última generación para que puedas conectar todos tus dispositivos.' },
    { question: '¿Tienen permanencia mínima?', answer: 'No exigimos permanencia mínima. Nuestro compromiso es brindarte el mejor servicio para que elijas quedarte con nosotros.' },
    { question: '¿Cómo realizo el pago mensual?', answer: 'Ofrecemos múltiples métodos de pago: transferencia bancaria, efectivo en puntos autorizados y pago con tarjeta a través de nuestra web.' },
  ];

  const navLinks = [
    ['#', 'Inicio'],
    ['#nosotros', 'Nosotros'],
    ['#planes', 'Planes'],
    ['#ventajas', 'Ventajas'],
    ['#cobertura', 'Cobertura'],
    ['#test', 'Test'],
    ['#contacto', 'Contacto'],
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── NAVBAR ── */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 fixed w-full z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-xl tracking-widest">NEWFIX</span>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(([href, label]) => (
                <a key={label} href={href} className="text-white/70 hover:text-cyan-400 transition-colors text-sm font-medium">{label}</a>
              ))}
              <a href="https://clientes.newfix.net/" target="_blank" rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all">
                Portal Cliente
              </a>
            </div>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-white/70" /> : <Menu className="h-6 w-6 text-white/70" />}
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map(([href, label]) => (
                  <a key={label} href={href} className="text-white/70 hover:text-cyan-400 transition-colors" onClick={() => setIsMenuOpen(false)}>{label}</a>
                ))}
                <a href="https://clientes.newfix.net/" target="_blank" rel="noopener noreferrer"
                  className="text-white/70 hover:text-cyan-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Portal Cliente</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen">
        <HeroCanvas />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">NEWFIX Fibra</h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10">Conexión estable y veloz para tu hogar o negocio</p>
            <a href="#planes" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105">
              Ver Planes
            </a>
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Quiénes somos
            </span>
            <h2 className="text-4xl font-bold text-white">Sobre Nosotros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h3 className="text-3xl font-semibold mb-6 text-white">Conectando hogares y empresas</h3>
              <p className="text-white/60 mb-6 text-lg leading-relaxed">
                En NewFix, nos dedicamos a proporcionar servicios de internet de alta calidad, garantizando una conexión estable y velocidades óptimas para satisfacer todas tus necesidades digitales.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                Con años de experiencia en el sector, nuestro equipo de profesionales trabaja constantemente para asegurar que recibas el mejor servicio posible.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 transition-all">
                <h4 className="text-4xl font-bold text-cyan-400 mb-3">99.9%</h4>
                <p className="text-white/60 font-medium">Tiempo Activo</p>
              </div>
              <div className="text-center p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 transition-all">
                <h4 className="text-4xl font-bold text-blue-400 mb-3">+10</h4>
                <p className="text-white/60 font-medium">Años de Experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VENTAJAS ── */}
      <section id="ventajas" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Nuestras ventajas
            </span>
            <h2 className="text-4xl font-bold text-white">¿Por Qué Elegirnos?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <Clock className="h-10 w-10 text-cyan-400" />, title: 'Instalación Rápida', desc: 'Conexión en 24 horas' },
              { icon: <Shield className="h-10 w-10 text-blue-400" />, title: 'Servicio Garantizado', desc: 'Soporte técnico permanente' },
              { icon: <Wifi className="h-10 w-10 text-cyan-400" />, title: 'Conexión Estable', desc: 'Alta disponibilidad garantizada' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 hover:bg-white/8 transition-all hover:scale-105">
                <div className="bg-cyan-500/10 border border-cyan-400/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
                <p className="text-white/60 text-lg">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES HOGAR ── */}
      <NewFixPricingSection
        title={<>El plan ideal para <span className="text-cyan-300">cada necesidad</span></>}
        subtitle="Instalación gratuita y soporte técnico local incluidos en todos los planes."
        plans={HOGAR_PLANS}
        showBackground={true}
      />

      {/* ── PLANES COMERCIO & DEDICADO ── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Soluciones empresariales
            </span>
            <h2 className="text-4xl font-bold text-white">Soluciones para Empresas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Comercio */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-cyan-400/30 transition-all duration-300 hover:scale-105">
              <h3 className="text-2xl font-bold text-white mb-4">Internet para tu Comercio</h3>
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">Beneficios destacados</h4>
              <ul className="space-y-2 mb-6">
                {['Atención online priorizada', 'Soporte técnico priorizado', 'IP pública/fija opcional'].map(f => (
                  <li key={f} className="flex items-center"><CheckCircle2 className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" /><span className="text-white/70">{f}</span></li>
                ))}
              </ul>
              <div className="w-full h-px bg-white/10 mb-6" />
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">Planes disponibles</h4>
              <ul className="space-y-2 mb-8">
                <li className="text-white/70">100 MEGAS – <span className="font-bold text-cyan-400">$29.500</span></li>
                <li className="text-white/70">300 MEGAS – <span className="font-bold text-cyan-400">$40.000</span></li>
                <li className="text-white/70">500 MEGAS – <span className="font-bold text-cyan-400">$55.000</span></li>
              </ul>
              <a href="https://forms.gle/uXXEkfX1bP393zuH8" target="_blank" rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all text-center font-semibold shadow-lg">
                ¡Contratá ahora!
              </a>
            </div>

            {/* Dedicado */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-cyan-400/30 transition-all duration-300 hover:scale-105">
              <h3 className="text-2xl font-bold text-white mb-2">Dedicado</h3>
              <p className="text-white/60 mb-6">Servicio ideal para tu ISP o Empresa.</p>
              <ul className="space-y-3 mb-8">
                {['Apto reventa', 'Asesoría al ISP', 'IP Pública', 'Conexión 1G/10G', 'Soporte prioritario', 'Instalación express'].map(f => (
                  <li key={f} className="flex items-center"><CheckCircle2 className="h-5 w-5 text-cyan-400 mr-2 flex-shrink-0" /><span className="text-white/70">{f}</span></li>
                ))}
              </ul>
              <a href="https://wa.me/5401123241875" target="_blank" rel="noopener noreferrer"
                className="block w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-all text-center font-semibold">
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── COBERTURA ── */}
      <section id="cobertura" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Dónde estamos
            </span>
            <h2 className="text-4xl font-bold text-white">Zona de Cobertura</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-cyan-400/20 p-8 rounded-2xl hover:border-cyan-400/40 transition-all">
              <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center"><MapPin className="h-5 w-5 mr-2" />Florencio Varela</h3>
              <ul className="space-y-2 text-white/60">
                {['San Jorge 1, 2','Villa Argentina','La Paloma','La Esperanza','Defensa','Las Casitas 1,2','Santa Rosa','Barrio Lujan','La Colorada','Los Pilares','Alpino'].map(b => (
                  <li key={b} className="flex items-start"><span className="text-cyan-400 mr-2">•</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-blue-400/20 p-8 rounded-2xl hover:border-blue-400/40 transition-all">
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center"><MapPin className="h-5 w-5 mr-2" />Almirante Brown</h3>
              <ul className="space-y-2 text-white/60">
                {['Barrio Lujan','Santa Intes','La 160'].map(b => (
                  <li key={b} className="flex items-start"><span className="text-blue-400 mr-2">•</span><span>{b}</span></li>
                ))}
              </ul>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center"><MapPin className="h-5 w-5 mr-2 text-cyan-400" />Berazategui</h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-start"><span className="text-white/40 mr-2">•</span><span>El Pato</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEST DE VELOCIDAD ── */}
      <section id="test" className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Medí tu conexión
            </span>
            <h2 className="text-4xl font-bold text-white">Test de Velocidad</h2>
          </div>
          <div className="max-w-6xl mx-auto"><SpeedTest /></div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section id="faqs" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Dudas frecuentes
            </span>
            <h2 className="text-4xl font-bold text-white">Preguntas Frecuentes</h2>
          </div>
          <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
            {faqs.map((faq, i) => <FAQ key={i} question={faq.question} answer={faq.answer} />)}
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Hablemos
            </span>
            <h2 className="text-4xl font-bold text-white">Contáctanos</h2>
          </div>
          <div className="max-w-2xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-cyan-400 mr-3 flex-shrink-0" />
              <span className="text-white/70">Florencio Varela, Buenos Aires, Argentina</span>
            </div>
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-cyan-400 mr-3 flex-shrink-0 mt-1" />
              <div className="text-white/70 space-y-1">
                <p className="text-white/50 text-sm uppercase tracking-widest font-semibold">Horario de atención</p>
                <p>Lunes a Viernes: 9:00 - 18:00</p>
                <p>Sábados: 9:00 - 13:00</p>
                <p>Domingos y feriados: Cerrado</p>
              </div>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div className="flex flex-col space-y-4">
              <a href="https://wa.me/5401123241875" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-400 transition-colors group">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="text-white/70 group-hover:text-green-400 transition-colors">+54 011 2324-1875</span>
              </a>
              <a href="mailto:contacto@newfix.net" className="flex items-center group transition-colors">
                <Mail className="h-6 w-6 text-cyan-400 mr-3 flex-shrink-0" />
                <span className="text-white/70 group-hover:text-cyan-400 transition-colors">contacto@newfix.net</span>
              </a>
              <a href="https://www.instagram.com/newfixinternet/" target="_blank" rel="noopener noreferrer" className="flex items-center group transition-colors">
                <Instagram className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0" />
                <span className="text-white/70 group-hover:text-pink-400 transition-colors">@newfixinternet</span>
              </a>
              <a href="https://www.facebook.com/NewfixInternet" target="_blank" rel="noopener noreferrer" className="flex items-center group transition-colors">
                <Facebook className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-white/70 group-hover:text-blue-400 transition-colors">Newfix Internet</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060606] border-t border-white/10 text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="https://cwezyzfvuzfqaivihoxe.supabase.co/storage/v1/object/public/logonoeliminar/newfix/lgo%20web%20nuevo%20.PNG"
              alt="NewFix Logo" className="h-12 w-auto opacity-80"
            />
            <p className="text-white/40 text-sm">&copy; 2025 NewFix. Todos los derechos reservados.</p>
            <img src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="Data Fiscal AFIP" className="w-16 opacity-60" />
          </div>
        </div>
      </footer>

      {/* ── WhatsApp flotante ── */}
      <a href="https://wa.me/5401123241875" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 flex items-center justify-center"
        aria-label="Contactar por WhatsApp">
        {whatsappSvg}
      </a>

    </div>
  );
}

export default App;
