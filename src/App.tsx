import React, { useState, useRef, useEffect } from 'react';
import { Clock, Shield, MapPin, Wifi, CheckCircle2, ChevronDown, Mail, Instagram, Facebook, Menu, X, Network, Globe, Zap } from 'lucide-react';
import { NewFixPricingSection, type NewFixPlanProps } from '@/components/ui/animated-glassy-pricing';

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

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

        vec3 col = vec3(0.02, 0.03, 0.06);

        float md = length(p - m);
        col += vec3(0.0, 0.06, 0.18) * exp(-md*md*3.0) * 0.2;

        for(int i=0; i<12; i++){
          float fi = float(i)/11.0;
          float seed = fi*7.39+1.0;

          float speed = 0.28 + hash(fi*3.7)*0.35;
          float t = iTime * speed;

          float yc = (fi*2.2-1.1) + (hash(fi*5.1)-0.5)*0.15;
          float x = p.x;

          float y = yc
            + sin(x*1.2 + t + seed)         * 0.09
            + sin(x*2.8 - t*1.3 + seed*2.0) * 0.045
            + sin(x*5.5 + t*0.7 + seed*3.5) * 0.018;

          float mxInfl = exp(-(m.x-x)*(m.x-x)*0.8);
          float yAtMx = yc
            + sin(m.x*1.2 + t + seed)         * 0.09
            + sin(m.x*2.8 - t*1.3 + seed*2.0) * 0.045
            + sin(m.x*5.5 + t*0.7 + seed*3.5) * 0.018;
          y += (m.y - yAtMx) * mxInfl * 0.18;

          float dist = abs(p.y - y);

          float core  = 0.00018/(dist*dist+0.000018);
          float halo  = 0.0006/(dist*dist+0.0008);
          float strand = min(core + halo * 0.5, 2.2);

          float pspeed = 0.9 + hash(fi*1.9)*1.2;
          float pulse = 0.3 + 0.7*pow(max(0.0,sin(x*2.5-t*pspeed*2.5+fi*6.28)),3.0);
          strand *= pulse;

          float hv = hash(fi*2.3)*0.2;
          vec3 fc = mix(
            vec3(0.05, 0.75+hv*0.2, 1.0),
            vec3(0.1+hv*0.15, 0.25, 0.95),
            fi*0.7+hv*0.2
          );
          col += fc * strand * 0.7;
        }

        col += vec3(0.1,0.5,1.0)*0.015/(md*md+0.015);

        float vig = 1.0 - dot(uv*2.0-1.0, uv*2.0-1.0)*0.32;
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
  {
    planName: '🚀 Fibra 800 Mbps',
    description: 'Máxima potencia con WiFi 6',
    speed: '800 Mbps',
    price: '$34.000',
    priceNote: 'Precio sin impuesto: $28.099',
    features: ['Tecnología XGPON', 'Router WiFi 6 Incluido', 'Instalación express'],
    buttonText: 'Contratar',
    buttonHref: 'https://forms.gle/uXXEkfX1bP393zuH8',
    buttonVariant: 'secondary',
    isPopular: false,
  },
];

const faqCategories = [
  {
    id: 'contacto', label: 'Contacto', emoji: '💬',
    faqs: [
      { question: '¿Cómo me contacto con Newfix?', answer: 'Podés escribirnos por WhatsApp +54 9 11 2324-1875.' },
      { question: '¿Cuál es el horario de atención?', answer: 'Por WhatsApp: Lunes a Viernes de 9 a 17 hs y Sábados de 9 a 13 hs. Oficina (C550 N829, Florencio Varela): Lunes a Viernes de 9 a 13 y de 14 a 16 hs, Sábados de 9 a 13 hs.' },
      { question: '¿Dónde queda la Suc. Pago?', answer: 'En C 550 N829, Florencio Varela (Buenos Aires).' },
      { question: '¿Atienden por redes sociales?', answer: 'No. Estamos en Instagram @newfixinternet y Facebook, pero el canal más rápido es el WhatsApp.' },
      { question: '¿Qué hago si tengo una urgencia fuera del horario?', answer: 'Dejanos el mensaje por WhatsApp: monitoreamos la red de forma permanente y, ante un corte masivo, te informamos el estado.' },
    ],
  },
  {
    id: 'cuenta', label: 'Mi cuenta', emoji: '👤',
    faqs: [
      { question: '¿Cómo accedo a mi cuenta de cliente?', answer: 'Ingresá al portal: https://clientes.newfix.net/' },
      { question: '¿Qué puedo hacer desde el portal?', answer: 'Ver tus facturas y vencimientos, consultar el estado de cuenta, pagar el servicio y actualizar tus datos de contacto.' },
      { question: 'Olvidé la contraseña del portal, ¿cómo la recupero?', answer: 'Escribinos por WhatsApp y te ayudamos a restablecerla.' },
      { question: '¿Cómo actualizo mis datos?', answer: 'Pedinos el cambio por WhatsApp.' },
    ],
  },
  {
    id: 'facturacion', label: 'Facturación', emoji: '🧾',
    faqs: [
      { question: '¿Qué medios de pago aceptan?', answer: 'Transferencia bancaria (alias propio por cliente), efectivo en C550 N829 Florencio Varela, o tarjeta/Mercado Pago mediante link de pago.' },
      { question: '¿Cuándo vence mi factura?', answer: 'Tu factura tiene un primer vencimiento. Podés verlo en el portal o consultarlo por WhatsApp.' },
      { question: '¿La facturación es por mes adelantado?', answer: 'Sí. Se factura el mes en curso a comienzos de cada mes.' },
      { question: '¿Los precios son una promoción que después aumenta?', answer: 'No. Todos nuestros precios son precios reales de lista. Pagás siempre lo que ves publicado.' },
      { question: 'Me suspendieron el servicio por falta de pago, ¿cómo lo reactivo?', answer: 'Regularizá la deuda por transferencia, Mercado Pago o efectivo. Una vez acreditado, el servicio se reactiva.' },
    ],
  },
  {
    id: 'planes', label: 'Planes', emoji: '🌐',
    faqs: [
      { question: '¿Qué planes de internet tienen?', answer: 'Ofrecemos planes de 300, 500 y 800 Mbps según la localidad. Mirá las velocidades y precios en newfix.net.' },
      { question: '¿La velocidad es simétrica?', answer: 'Sí, todos nuestros planes son simétricos: misma velocidad de bajada y de subida.' },
      { question: '¿Tienen límite de datos?', answer: 'No. Navegás sin límite de datos.' },
      { question: '¿Incluye el router/WiFi?', answer: 'Sí, el router WiFi viene incluido. En los planes de 300 y 500 Mbps es Dual Band; en el de 800 Mbps es WiFi 6 con tecnología XGPON.' },
      { question: '¿La instalación tiene costo?', answer: 'La instalación es gratuita.' },
      { question: '¿Puedo cambiar de plan?', answer: 'Sí. Escribinos por WhatsApp y gestionamos el cambio.' },
      { question: '¿Tienen planes para empresas?', answer: 'Sí. Contamos con planes corporativos con IP pública, soporte prioritario y atención personalizada.' },
    ],
  },
  {
    id: 'soporte', label: 'Soporte', emoji: '🛠️',
    faqs: [
      { question: 'Me quedé sin internet, ¿qué hago?', answer: '1) Mirá las luces del equipo. 2) Reiniciá el equipo: desenchufalo, esperá 30 segundos y volvé a enchufarlo. 3) Revisá que los cables estén bien conectados. Si seguís sin servicio, escribinos por WhatsApp.' },
      { question: 'El equipo tiene la luz "LOS" en rojo, ¿qué significa?', answer: 'Indica falta de señal de fibra. Revisá que el cable no esté doblado o desconectado. Si la luz no se apaga, probablemente haga falta una visita técnica.' },
      { question: 'Tengo internet pero anda lento, ¿qué reviso?', answer: 'Conectá por cable para comparar, acercate al router, cerrá descargas activas. Si por cable también está lento, escribinos.' },
    ],
  },
  {
    id: 'wifi', label: 'WiFi', emoji: '📶',
    faqs: [
      { question: '¿Cómo mejoro la señal del WiFi?', answer: 'Ubicá el router en un lugar central y alto. Evitá paredes gruesas, metales y el microondas cerca. Para casas grandes consultanos por repetidores o sistemas mesh.' },
      { question: '¿Cómo cambio el nombre o la clave del WiFi?', answer: 'Te lo gestionamos desde soporte. Escribinos por WhatsApp y coordinamos el cambio.' },
      { question: '¿Conviene usar cable o WiFi?', answer: 'Para juegos online, streaming 4K o teletrabajo, el cable ofrece menor latencia. El WiFi es ideal para movilidad y uso general.' },
    ],
  },
  {
    id: 'gigared', label: 'GIGARED TV', emoji: '📺',
    faqs: [
      { question: '¿Qué es GIGARED?', answer: 'Es televisión por streaming: canales en vivo, deportes, series y películas, sin antena ni decodificador.' },
      { question: '¿Qué combos hay?', answer: 'Consultá disponibilidad por WhatsApp. Accedés a más de 80 canales.' },
      { question: '¿En qué dispositivos puedo ver GIGARED Play?', answer: 'Smart TV, celular, tablet, notebook, Apple TV, Roku, Fire TV y Google TV.' },
    ],
  },
  {
    id: 'contratar', label: 'Contratar', emoji: '🚀',
    faqs: [
      { question: '¿Cómo contrato el servicio?', answer: 'Mirá los planes en la web o escribinos directamente por WhatsApp.' },
      { question: '¿Tienen cobertura en mi domicilio?', answer: 'Pasanos tu dirección por WhatsApp y verificamos la factibilidad.' },
      { question: '¿Cuánto tarda la instalación?', answer: 'Coordinamos una visita técnica y te avisamos la fecha al momento de contratar. La instalación es gratuita.' },
    ],
  },
];

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('contacto');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentCategory = faqCategories.find(c => c.id === activeCategory)!;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <section id="faqs" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
            ✦ Dudas frecuentes
          </span>
          <h2 className="text-4xl font-bold text-white" data-animate>Preguntas Frecuentes</h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto" data-animate data-animate-delay="1">Encontrá respuestas sobre internet, facturación, soporte técnico y más.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 scrollbar-hide justify-start md:justify-center">
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {currentCategory.faqs.map((faq, i) => (
            <div key={`${activeCategory}-${i}`} className="border-b border-white/10">
              <button
                className="flex justify-between items-center w-full text-left py-5 gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-base font-medium text-white/90">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="text-white/60 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-white/50 mb-4">¿No encontraste lo que buscabas?</p>
          <a
            href="https://wa.me/5491123241875"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function SpeedTest() {
  const tests = [
    {
      name: 'Test NewFix',
      desc: 'Test oficial de NewFix',
      detail: 'El más preciso para verificar la velocidad real de tu plan. Medí bajada, subida y latencia en nuestra red.',
      url: 'https://newfix.speedtestcustom.com/',
      isMain: true,
    },
    {
      name: 'WIFIMAN',
      desc: 'Herramienta de diagnóstico WiFi',
      detail: 'Analizá la cobertura y calidad de tu red WiFi en cada rincón del hogar.',
      url: 'http://wifiman.com/',
      isMain: false,
    },
    {
      name: 'SPEEDTEST',
      desc: 'Test de velocidad Ookla',
      detail: 'El test más usado a nivel global. Útil para comparar con otros resultados.',
      url: 'https://www.speedtest.net/',
      isMain: false,
    },
    {
      name: 'FAST',
      desc: 'Test de velocidad de Netflix',
      detail: 'Medí tu velocidad de descarga real en condiciones de streaming.',
      url: 'https://fast.com/es/',
      isMain: false,
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-5">
      {tests.map(t => (
        <a
          key={t.name}
          href={t.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:scale-105 group ${
            t.isMain
              ? 'bg-cyan-500/10 border-cyan-400/50 hover:border-cyan-400 shadow-lg shadow-cyan-500/10'
              : 'backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-400/30'
          }`}
        >
          {t.isMain && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Oficial NewFix
            </span>
          )}
          <h3 className={`text-lg font-bold mb-1 ${t.isMain ? 'text-cyan-300' : 'text-cyan-400'}`}>{t.name}</h3>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-3">{t.desc}</p>
          <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">{t.detail}</p>
          <span className={`inline-block text-center py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            t.isMain
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white group-hover:from-cyan-400 group-hover:to-blue-500'
              : 'bg-white/10 text-white group-hover:bg-white/20'
          }`}>
            Iniciar Test
          </span>
        </a>
      ))}
    </div>
  );
}

type PlanCard = {
  speed: string; router: string; price: string; sinImpuesto: string;
  popular: boolean; features: string[]; includes: string[];
};

function DGOSection() {
  const [activeTab, setActiveTab] = useState(2);

  const dgoTabs = [
    { label: 'Lite',              desc: '30 canales · 2 pantallas' },
    { label: 'Plus',              desc: 'DSPORTS · 30 canales · 2 pantallas' },
    { label: 'Total',             desc: 'DSPORTS + Prime · 30 canales · 2 pantallas' },
    { label: 'Full',              desc: 'DSPORTS + Prime · 80 canales · 4 pantallas' },
    { label: '⚽ Fútbol Total *', desc: 'DSPORTS + Prime + ESPN + TNT · 80 canales · 4 pantallas' },
  ];

  const dgoPlans: Record<number, PlanCard[]> = {
    0: [
      { speed:'300 Mbps', router:'Dual Band', price:'$38.600', sinImpuesto:'$31.900', popular:false,
        features:['+30 canales en vivo','2 pantallas en simultáneo'], includes:[] },
      { speed:'500 Mbps', router:'Dual Band', price:'$42.600', sinImpuesto:'$35.207', popular:true,
        features:['+30 canales en vivo','2 pantallas en simultáneo'], includes:[] },
      { speed:'800 Mbps', router:'WiFi 6',    price:'$49.600', sinImpuesto:'$40.992', popular:false,
        features:['+30 canales en vivo','2 pantallas en simultáneo'], includes:[] },
    ],
    1: [
      { speed:'300 Mbps', router:'Dual Band', price:'$41.882', sinImpuesto:'$34.613', popular:false,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo'], includes:['DSports'] },
      { speed:'500 Mbps', router:'Dual Band', price:'$45.882', sinImpuesto:'$37.919', popular:true,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo'], includes:['DSports'] },
      { speed:'800 Mbps', router:'WiFi 6',    price:'$52.882', sinImpuesto:'$43.704', popular:false,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo'], includes:['DSports'] },
    ],
    2: [
      { speed:'300 Mbps', router:'Dual Band', price:'$48.882', sinImpuesto:'$40.398', popular:false,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','2 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
      { speed:'500 Mbps', router:'Dual Band', price:'$53.882', sinImpuesto:'$44.530', popular:true,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','2 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
      { speed:'800 Mbps', router:'WiFi 6',    price:'$60.882', sinImpuesto:'$50.315', popular:false,
        features:['+30 canales en vivo','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','2 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
    ],
    3: [
      { speed:'300 Mbps', router:'Dual Band', price:'$53.300', sinImpuesto:'$44.050', popular:false,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
      { speed:'500 Mbps', router:'Dual Band', price:'$57.300', sinImpuesto:'$47.355', popular:true,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
      { speed:'800 Mbps', router:'WiFi 6',    price:'$64.300', sinImpuesto:'$53.140', popular:false,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','Amazon Prime Video incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video'] },
    ],
    4: [
      { speed:'300 Mbps', router:'Dual Band', price:'$54.900', sinImpuesto:'$45.372', popular:false,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports + Amazon Prime Video','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video','ESPN','TNT Sports'] },
      { speed:'500 Mbps', router:'Dual Band', price:'$58.900', sinImpuesto:'$48.677', popular:true,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports + Amazon Prime Video','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video','ESPN','TNT Sports'] },
      { speed:'800 Mbps', router:'WiFi 6',    price:'$65.900', sinImpuesto:'$54.462', popular:false,
        features:['+80 canales en vivo y +10.000 títulos VOD','DSports + Amazon Prime Video','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo'], includes:['DSports','Prime Video','ESPN','TNT Sports'] },
    ],
  };

  const includeBadges: Record<string, { bg: string; text: string; label: string }> = {
    'DSports':     { bg: 'bg-blue-600',  text: 'text-white', label: 'D SPORTS' },
    'Prime Video': { bg: 'bg-[#00A8E1]', text: 'text-white', label: 'prime video' },
    'ESPN':        { bg: 'bg-red-600',   text: 'text-white', label: 'ESPN' },
    'TNT Sports':  { bg: 'bg-[#B2027A]', text: 'text-white', label: 'TNT Sports' },
  };

  return (
    <section id="dgo" className="pb-20 bg-[#060d1f]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center pt-8 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
            ✦ Internet + TV
          </span>
          <h2 className="text-4xl font-bold text-white">
            Internet + <span className="text-cyan-400">DGO</span>
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Somos partners oficiales de DGO. Sumá televisión en vivo, deportes y on demand a tu plan de fibra.
          </p>
        </div>

        {/* DGO Tab buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {dgoTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeTab === i
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {dgoPlans[activeTab].map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#0d1f3c] to-[#091528] border-cyan-400/50 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  MÁS ELEGIDO
                </div>
              )}

              {/* DGO Logo badge */}
              <div className="flex items-center gap-1 mb-4">
                <span className="text-2xl font-black text-orange-500">D</span>
                <span className={`text-2xl font-black ${activeTab >= 3 ? 'text-cyan-400' : 'text-cyan-300'}`}>GO</span>
                <span className={`text-xs font-bold ml-1 px-1.5 py-0.5 rounded ${activeTab >= 3 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 text-white/70'}`}>
                  {activeTab >= 3 ? 'FULL' : 'TV'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{dgoTabs[activeTab].label}</h3>

              {/* Internet speed chip */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 mb-5 w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
                <span className="text-white/80 text-sm font-medium">Internet {plan.speed} · {plan.router}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-white/50 text-sm ml-1">/mes</span>
              </div>
              <p className="text-white/35 text-xs mb-5">Sin impuestos: {plan.sinImpuesto}</p>

              {/* Include badges */}
              {plan.includes.length > 0 && (
                <div className="mb-5">
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-2">Incluye también</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.includes.map(inc => (
                      <span key={inc} className={`text-xs font-bold px-2.5 py-1 rounded ${includeBadges[inc].bg} ${includeBadges[inc].text}`}>
                        {includeBadges[inc].label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <a
                href={`https://wa.me/5491123241875?text=Hola!%20Quiero%20contratar%20${encodeURIComponent(plan.speed)}%20con%20DGO%20${encodeURIComponent(dgoTabs[activeTab].label)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg'
                    : 'bg-white/10 border border-white/15 text-white hover:bg-white/20'
                }`}
              >
                Empezar →
              </a>
            </div>
          ))}
        </div>

        {activeTab === 4 && (
          <p className="text-center text-amber-400/80 text-xs mt-4 flex items-center justify-center gap-1.5">
            <span>⚠️</span>
            <span>(*) Plan temporal, vigente únicamente durante el Mundial de Fútbol.</span>
          </p>
        )}

        {/* ── ADICIONALES ── */}
        <div className="max-w-5xl mx-auto mt-14">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white">Opcionales para sumar a tu plan</h3>
            <p className="text-white/40 text-sm mt-1">Agregá cualquiera de estos servicios a tu suscripción DGO</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Atresplayer',
                price: '$9.300',
                bg: 'from-red-900/40 to-red-800/20',
                border: 'border-red-500/30',
                logo: (
                  <svg viewBox="0 0 60 40" className="h-8 w-auto mx-auto mb-3">
                    <polygon points="30,4 54,36 6,36" fill="none" stroke="#e63946" strokeWidth="4" strokeLinejoin="round"/>
                    <polygon points="30,14 46,36 14,36" fill="#e63946"/>
                  </svg>
                ),
              },
              {
                name: 'Paramount+',
                price: '$6.750',
                bg: 'from-blue-900/40 to-blue-800/20',
                border: 'border-blue-400/30',
                logo: (
                  <div className="text-center mb-3">
                    <span className="text-2xl font-black text-blue-300 tracking-tight">P+</span>
                  </div>
                ),
              },
              {
                name: 'Pack Fútbol',
                price: '$20.970',
                bg: 'from-green-900/40 to-emerald-800/20',
                border: 'border-green-500/30',
                logo: (
                  <div className="text-center mb-3 flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-white bg-red-600 px-1.5 py-0.5 rounded">ESPN</span>
                    <span className="text-xs font-black text-white bg-[#B2027A] px-1.5 py-0.5 rounded">TNT</span>
                  </div>
                ),
              },
              {
                name: 'Universal+',
                price: '$11.800',
                bg: 'from-purple-900/40 to-purple-800/20',
                border: 'border-purple-400/30',
                logo: (
                  <div className="text-center mb-3">
                    <span className="text-xl font-black text-white tracking-widest border border-white/60 px-2 py-0.5 rounded">UNIVERSAL+</span>
                  </div>
                ),
              },
            ].map((addon) => (
              <div
                key={addon.name}
                className={`relative flex flex-col items-center text-center rounded-xl border p-5 bg-gradient-to-b ${addon.bg} ${addon.border}`}
              >
                {addon.logo}
                <p className="text-white/60 text-xs mb-1">{addon.name}</p>
                <p className="text-2xl font-bold text-white">{addon.price}</p>
                <p className="text-white/40 text-xs">/mes</p>
                <a
                  href={`https://wa.me/5491123241875?text=Hola!%20Quiero%20agregar%20${encodeURIComponent(addon.name)}%20a%20mi%20plan%20DGO`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
                >
                  Consultar →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── DISPOSITIVOS ── */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-bold text-white mb-1">Miralo cómo y cuando quieras</h3>
          <p className="text-white/40 text-sm mb-6">Disponible en celular, smart TV y cualquier dispositivo con internet</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Google Play',     icon: '▶', color: 'text-green-400' },
              { label: 'App Store',       icon: '', color: 'text-white' },
              { label: 'Web',             icon: '🌐', color: 'text-cyan-400' },
              { label: 'Android TV',      icon: '📺', color: 'text-green-300' },
              { label: 'Apple TV',        icon: '', color: 'text-white' },
              { label: 'Roku',            icon: '📡', color: 'text-purple-400' },
              { label: 'Samsung Smart TV',icon: '🖥', color: 'text-blue-400' },
              { label: 'LG',              icon: '🖥', color: 'text-red-400' },
              { label: 'Fire TV',         icon: '🔥', color: 'text-orange-400' },
              { label: 'ELSYS',           icon: '📦', color: 'text-gray-400' },
            ].map((device) => (
              <div
                key={device.label}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
              >
                <span className={device.color}>{device.icon}</span>
                <span className="text-white/70 font-medium">{device.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canales link */}
        <div className="text-center mt-10">
          <a
            href="/canales.html"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            📺 Ver lista completa de canales →
          </a>
        </div>
      </div>
    </section>
  );
}

function GigaredSection() {
  const [activeTab, setActiveTab] = useState<'tv' | 'futbol'>('tv');

  const plans = {
    tv: [
      { speed: '300 Mbps', router: 'Dual Band', price: '$31.000', sinImpuesto: '$25.620', popular: false },
      { speed: '500 Mbps', router: 'Dual Band', price: '$38.000', sinImpuesto: '$31.404', popular: true },
      { speed: '800 Mbps', router: 'WiFi 6',    price: '$46.000', sinImpuesto: '$38.016', popular: false },
    ],
    futbol: [
      { speed: '300 Mbps', router: 'Dual Band', price: '$53.000', sinImpuesto: '$43.802', popular: false },
      { speed: '500 Mbps', router: 'Dual Band', price: '$60.000', sinImpuesto: '$49.587', popular: true },
      { speed: '800 Mbps', router: 'WiFi 6',    price: '$68.000', sinImpuesto: '$56.198', popular: false },
    ],
  };

  const baseFeatures = [
    'Más de 70 canales en vivo',
    'Señales nacionales e internacionales',
    'Cine, series, infantiles y documentales',
    'App disponible en celular y smart TV',
  ];

  const futbolFeatures = [
    ...baseFeatures,
    'TyC Sports, DEPORTV',
    'ESPN, ESPN 2, ESPN 3, ESPN 4',
    'FOX SPORTS, FOX SPORTS 2, FOX SPORTS 3',
  ];

  return (
    <div>
      {/* Header */}
      <div className="text-center pt-8 mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/25 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-5">
          ✦ Internet + TV cable
        </span>
        <div className="flex items-center justify-center gap-3 mb-3">
          <h2 className="text-4xl font-bold text-white">Internet +</h2>
          <img src="/logos/gigaredplay.svg" alt="GigaredPlay" className="h-9 object-contain" />
        </div>
        <p className="text-white/50 mt-2 max-w-xl mx-auto text-sm">
          Televisión por cable con señales nacionales, internacionales, cine, series y deportes.
          {' '}<a href="/canales.html#gigared" className="text-pink-400 hover:text-pink-300 underline underline-offset-2">Ver lista de canales →</a>
        </p>
      </div>

      {/* TV / TV + Pack Fútbol tabs */}
      <div className="flex justify-center mb-10 gap-3">
        <button
          onClick={() => setActiveTab('tv')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'tv'
              ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-400/50 text-white'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
        >
          📺 TV
          <span className="block text-xs font-normal opacity-60 mt-0.5">+70 canales en vivo</span>
        </button>
        <button
          onClick={() => setActiveTab('futbol')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${
            activeTab === 'futbol'
              ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-400/50 text-white'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
        >
          ⚽ TV + Pack Fútbol
          <span className="block text-xs font-normal opacity-60 mt-0.5">ESPN · FOX · TyC Sports</span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans[activeTab].map((plan, i) => (
          <div
            key={i}
            className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
              plan.popular
                ? 'bg-gradient-to-b from-[#1a0d2e] to-[#0f0820] border-pink-400/40 shadow-xl shadow-pink-500/10 scale-[1.02]'
                : 'bg-white/5 border-white/10'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                MÁS ELEGIDO
              </div>
            )}

            <div className="mb-4">
              <img src="/logos/gigaredplay.svg" alt="GigaredPlay" className="h-7 object-contain" />
            </div>

            <h3 className="text-sm font-semibold text-white/60 mb-4">
              {activeTab === 'tv' ? 'TV Cable' : 'TV + Pack Fútbol'}
            </h3>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0" />
              <span className="text-white/80 text-sm font-medium">{plan.speed} · {plan.router}</span>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {(activeTab === 'tv' ? baseFeatures : futbolFeatures).map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-white/70">
                  <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${j >= baseFeatures.length ? 'text-yellow-400' : 'text-pink-400'}`} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mb-1">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-white/50 text-sm ml-1">/mes</span>
            </div>
            <p className="text-white/35 text-xs mb-5">Sin impuestos: {plan.sinImpuesto}</p>

            <a
              href={`https://wa.me/5491123241875?text=Hola!%20Quiero%20info%20sobre%20${encodeURIComponent(plan.speed)}%20con%20GigaredPlay%20${activeTab === 'futbol' ? 'Pack%20F%C3%BAtbol' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 shadow-lg'
                  : 'bg-white/10 border border-white/15 text-white hover:bg-white/20'
              }`}
            >
              Empezar →
            </a>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="/canales.html#gigared"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          📺 Ver grilla completa de canales →
        </a>
      </div>
    </div>
  );
}

const whatsappSvg = (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function App() {
  useScrollAnimation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePlansTab, setActivePlansTab] = useState<'gigared' | 'internet' | 'dgo'>('dgo');

  const navLinks = [
    ['#', 'Inicio'],
    ['#nosotros', 'Nosotros'],
    ['#planes', 'Planes'],
    ['#dgo', 'DGO TV'],
    ['#ventajas', 'Ventajas'],
    ['#cobertura', 'Cobertura'],
    ['#test', 'Test'],
    ['#faqs', 'FAQ'],
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
            <a href="#planes" className="btn-shine inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105">
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
            <h2 className="text-4xl font-bold text-white" data-animate>Sobre Nosotros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">

            {/* Texto */}
            <div>
              <h3 className="text-3xl font-semibold mb-6 text-white leading-tight" data-animate data-animate-delay="1">
                Conectando la zona con<br />
                <span className="text-cyan-400">internet de verdad</span>
              </h3>
              <p className="text-white/60 mb-4 text-lg leading-relaxed" data-animate data-animate-delay="2">
                NewFix no nació como una empresa gigante. Nació como un proyecto local, con trabajo técnico, esfuerzo diario y una idea clara: brindar internet confiable donde muchas veces las grandes empresas no llegan bien o no responden como deberían.
              </p>
              <p className="text-white/60 mb-8 text-lg leading-relaxed" data-animate data-animate-delay="3">
                Hoy seguimos creciendo con fibra óptica, soluciones inalámbricas y enlaces dedicados para hogares, comercios, empresas e ISPs. Invertimos en infraestructura, monitoreo y soporte técnico porque entendemos que detrás de cada conexión hay una casa, un trabajo, una familia o un negocio que necesita estar conectado.
              </p>
              <div className="space-y-3">
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">Lo que nos representa</p>
                {[
                  '+10 años trabajando en conectividad',
                  'Infraestructura propia pensada para seguir creciendo',
                  'Atención cercana sin vueltas ni respuestas genéricas',
                  'Equipo técnico local con conocimiento real de la red',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '99.9%', label: 'Tiempo Activo', color: 'text-cyan-400' },
                { value: '+10', label: 'Años en la zona', color: 'text-blue-400' },
                { value: '3', label: 'Municipios conectados', color: 'text-cyan-400' },
                { value: '24/7', label: 'Monitoreo de red', color: 'text-blue-400' },
              ].map(({ value, label, color }, idx) => (
                <div key={label} data-animate="scale" data-animate-delay={String(idx + 1)} className="text-center p-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/30 transition-all">
                  <h4 className={`text-4xl font-bold mb-3 ${color}`}>{value}</h4>
                  <p className="text-white/60 font-medium text-sm">{label}</p>
                </div>
              ))}
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
            <h2 className="text-4xl font-bold text-white" data-animate>¿Por Qué Elegirnos?</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto" data-animate data-animate-delay="1">Somos un ISP local con infraestructura propia. Sin intermediarios, sin excusas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Network className="h-9 w-9 text-cyan-400" />,
                title: 'ISP Local con ASN Propio',
                desc: 'Tenemos nuestro propio Número de Sistema Autónomo. Eso significa rutas más directas, menor latencia y mayor estabilidad que los revendedores.',
                highlight: true,
              },
              {
                icon: <Globe className="h-9 w-9 text-blue-400" />,
                title: 'DNS con Filtrado',
                desc: 'Nuestros servidores DNS propios permiten filtrar contenido malicioso, phishing y publicidad invasiva antes de que llegue a tu red.',
                highlight: false,
              },
              {
                icon: <Zap className="h-9 w-9 text-cyan-400" />,
                title: 'Velocidad Simétrica',
                desc: 'Misma velocidad de subida y bajada en todos los planes. Ideal para videollamadas, trabajo remoto y streaming sin cortes.',
                highlight: false,
              },
              {
                icon: <Clock className="h-9 w-9 text-cyan-400" />,
                title: 'Instalación Rápida',
                desc: 'Coordinamos la visita técnica y dejamos tu conexión funcionando. Instalación gratuita en todos los planes.',
                highlight: false,
              },
              {
                icon: <Shield className="h-9 w-9 text-blue-400" />,
                title: 'Soporte Permanente',
                desc: 'Monitoreamos la red las 24 hs. Si hay un corte, ya lo sabemos antes de que nos escribas.',
                highlight: false,
              },
              {
                icon: <Wifi className="h-9 w-9 text-cyan-400" />,
                title: 'Sin Límite de Datos',
                desc: 'Navegás sin tope de GB ni throttling. Todos los planes incluyen datos ilimitados y router WiFi.',
                highlight: false,
              },
            ].map(({ icon, title, desc, highlight }, idx) => (
              <div
                key={title}
                data-animate="scale"
                data-animate-delay={String(idx + 1)}
                className={`group text-center p-8 backdrop-blur-sm border rounded-2xl transition-all hover:scale-105 ${
                  highlight
                    ? 'bg-cyan-500/10 border-cyan-400/40 hover:border-cyan-400/60'
                    : 'bg-white/5 border-white/10 hover:border-cyan-400/30 hover:bg-white/8'
                }`}
              >
                <div
                  className={`p-4 rounded-full mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                    highlight ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-cyan-500/10 border border-cyan-400/20'
                  }`}
                  style={{ width: '72px', height: '72px' }}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES (toggle) ── */}
      <section id="planes" className="pt-20 pb-0 bg-[#060d1f]">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-2xl bg-white/5 border border-white/10 p-1.5 gap-1 flex-wrap justify-center">
              <button
                onClick={() => setActivePlansTab('gigared')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activePlansTab === 'gigared'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <img src="/logos/gigaredplay.svg" alt="GigaredPlay" className="h-4 object-contain brightness-[10]" />
              </button>
              <button
                onClick={() => setActivePlansTab('internet')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activePlansTab === 'internet'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                🌐 Solo Internet
              </button>
              <button
                onClick={() => setActivePlansTab('dgo')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activePlansTab === 'dgo'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <img src="/logos/dgo.png" alt="DGO" className="h-5 object-contain" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {activePlansTab === 'internet' && (
        <div className="bg-[#060d1f]">
          <NewFixPricingSection plans={HOGAR_PLANS} title={<>Planes de <span className="text-cyan-300">Internet</span></>} />
        </div>
      )}
      {activePlansTab === 'dgo' && <DGOSection />}
      {activePlansTab === 'gigared' && (
        <div className="pb-20 bg-[#060d1f]">
          <div className="container mx-auto px-6">
            <GigaredSection />
          </div>
        </div>
      )}

      {/* ── PLANES COMERCIO & DEDICADO ── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Soluciones empresariales
            </span>
            <h2 className="text-4xl font-bold text-white" data-animate>Soluciones para Empresas</h2>
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
                className="btn-shine block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all text-center font-semibold shadow-lg">
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
            <h2 className="text-4xl font-bold text-white" data-animate>Zona de Cobertura</h2>
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
            <h2 className="text-4xl font-bold text-white" data-animate>Test de Velocidad</h2>
          </div>
          <div className="max-w-6xl mx-auto"><SpeedTest /></div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <FAQSection />

      {/* ── CONTACTO ── */}
      <section id="contacto" className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✦ Hablemos
            </span>
            <h2 className="text-4xl font-bold text-white" data-animate>Contáctanos</h2>
            <p className="text-white/50 mt-3" data-animate data-animate-delay="1">Estamos para ayudarte. Elegí el canal que prefieras.</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6" data-animate="scale" data-animate-delay="2">

            {/* Info */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/10 border border-cyan-400/20 p-3 rounded-xl flex-shrink-0">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Ubicación</p>
                  <p className="text-white/80">Florencio Varela, Buenos Aires</p>
                  <p className="text-white/50 text-sm mt-1">Suc. Pago: C550 N829, Florencio Varela</p>
                </div>
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/10 border border-cyan-400/20 p-3 rounded-xl flex-shrink-0">
                  <Clock className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Horario de atención</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-8">
                      <span className="text-white/70">Lunes a Viernes</span>
                      <span className="text-white font-medium">9:00 – 17:00</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-white/70">Sábados</span>
                      <span className="text-white font-medium">9:00 – 13:00</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-white/70">Domingos y feriados</span>
                      <span className="text-white/40 font-medium">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-white/10" />

              <a
                href="https://maps.google.com/?q=C550+N829+Florencio+Varela+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-medium"
              >
                <MapPin className="h-4 w-4 text-cyan-400" />
                Ver en Google Maps
              </a>
            </div>

            {/* Canales */}
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/5491123241875"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/15 transition-all group"
              >
                <div className="bg-green-500/20 p-3 rounded-xl flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-400" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">WhatsApp</p>
                  <p className="text-white/50 text-sm">+54 9 11 2324-1875 · Canal más rápido</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/30 -rotate-90 group-hover:text-white/60 transition-colors" />
              </a>

              <a
                href="mailto:contacto@newfix.net"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/8 transition-all group"
              >
                <div className="bg-cyan-500/10 border border-cyan-400/20 p-3 rounded-xl flex-shrink-0">
                  <Mail className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Email</p>
                  <p className="text-white/50 text-sm">contacto@newfix.net</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/30 -rotate-90 group-hover:text-white/60 transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/newfixinternet/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400/30 hover:bg-white/8 transition-all group"
              >
                <div className="bg-pink-500/10 border border-pink-400/20 p-3 rounded-xl flex-shrink-0">
                  <Instagram className="h-6 w-6 text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Instagram</p>
                  <p className="text-white/50 text-sm">@newfixinternet</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/30 -rotate-90 group-hover:text-white/60 transition-colors" />
              </a>

              <a
                href="https://www.facebook.com/NewfixInternet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/30 hover:bg-white/8 transition-all group"
              >
                <div className="bg-blue-500/10 border border-blue-400/20 p-3 rounded-xl flex-shrink-0">
                  <Facebook className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Facebook</p>
                  <p className="text-white/50 text-sm">Newfix Internet</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/30 -rotate-90 group-hover:text-white/60 transition-colors" />
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
            <p className="text-white/20 text-xs">Desarrollado por <a href="https://velkora.ar" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">velkora.ar</a></p>
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
