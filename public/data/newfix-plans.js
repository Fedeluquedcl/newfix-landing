/**
 * NEWFIX — Fuente única de verdad para planes, precios y cobertura.
 *
 * Cómo actualizar precios:
 *  1. Editar los valores en este archivo (NEWFIX_DATA.plans.*).
 *  2. Guardar y hacer git push → Netlify redeploya automáticamente.
 *  3. Las 3 landings (/internet-florencio-varela/, /internet-tv-florencio-varela/,
 *     /internet-empresas-florencio-varela/) se actualizan sin tocar ningún otro archivo.
 *
 * NOTA: src/App.tsx (home) tiene sus propios datos hardcodeados.
 * Si actualizás precios aquí, actualizá también src/App.tsx para mantener la home sincronizada.
 *
 * Versión de precios: 2026-10
 */

var NEWFIX_DATA = {

  wa: '5491123241875',

  // ── Planes de internet para hogar ──────────────────────────────────
  plans: {
    hogar: [
      {
        id: 'family-300',
        name: 'Family',
        emoji: '',
        speed: '300 MB',
        price: '$24.999',
        sinIva: '$20.660',
        router: 'Dual Band',
        popular: false,
        features: [
          'Velocidad simétrica 300 Mbps',
          'Ideal para familias y múltiples dispositivos',
          'Router WiFi Dual Band incluido',
          'Sin límite de datos',
          'Instalación gratuita',
        ],
      },
      {
        id: 'fibra-500',
        name: 'Fibra 500 Megas',
        emoji: '⚡',
        speed: '500 Mbps',
        price: '$28.999',
        sinIva: '$23.967',
        router: 'Dual Band',
        popular: true,
        popularLabel: 'MÁS ELEGIDO',
        features: [
          'Velocidad simétrica 500 Mbps',
          'Alta velocidad para streaming y teletrabajo',
          'Router WiFi Dual Band incluido',
          'Sin límite de datos',
          'Instalación gratuita',
        ],
      },
      {
        id: 'fibra-800',
        name: 'Fibra 800 Mbps',
        emoji: '🚀',
        speed: '800 Mbps',
        price: '$35.999',
        sinIva: '$29.751',
        router: 'WiFi 6 (XGPON)',
        popular: false,
        features: [
          'Velocidad simétrica 800 Mbps',
          'Tecnología XGPON de última generación',
          'Router WiFi 6 incluido',
          'Sin límite de datos',
          'Instalación gratuita',
        ],
      },
    ],

    // ── Internet + GigaredPlay TV ──────────────────────────────────────
    tv: [
      {
        id: 'tv-300',
        name: 'Internet + TV 300 Mbps',
        emoji: '',
        speed: '300 Mbps',
        price: '$32.999',
        sinIva: '$27.273',
        router: 'Dual Band',
        popular: false,
        tvBadge: 'GigaredPlay',
        features: [
          'Velocidad simétrica 300 Mbps',
          'GigaredPlay incluido: +80 canales en vivo',
          'Sin decodificador ni antena',
          'Router WiFi Dual Band incluido',
          'Sin límite de datos',
        ],
      },
      {
        id: 'tv-500',
        name: 'Internet + TV 500 Mbps',
        emoji: '⚡',
        speed: '500 Mbps',
        price: '$39.999',
        sinIva: '$33.057',
        router: 'Dual Band',
        popular: true,
        popularLabel: 'MÁS ELEGIDO',
        tvBadge: 'GigaredPlay',
        features: [
          'Velocidad simétrica 500 Mbps',
          'GigaredPlay incluido: +80 canales en vivo',
          'Sin decodificador ni antena',
          'Router WiFi Dual Band incluido',
          'Sin límite de datos',
        ],
      },
      {
        id: 'tv-800',
        name: 'Internet + TV 800 Mbps',
        emoji: '🚀',
        speed: '800 Mbps',
        price: '$47.999',
        sinIva: '$39.669',
        router: 'WiFi 6 (XGPON)',
        popular: false,
        tvBadge: 'GigaredPlay',
        features: [
          'Velocidad simétrica 800 Mbps',
          'GigaredPlay incluido: +80 canales en vivo',
          'Sin decodificador ni antena',
          'Router WiFi 6 (XGPON) incluido',
          'Sin límite de datos',
        ],
      },
    ],

    // ── Internet + GigaredPlay + Pack Fútbol ──────────────────────────
    tvFutbol: [
      {
        id: 'futbol-300',
        name: 'Internet + TV + Fútbol 300 Mbps',
        emoji: '⚽',
        speed: '300 Mbps',
        price: '$54.999',
        sinIva: '$45.454',
        router: 'Dual Band',
        popular: false,
        tvBadge: 'GigaredPlay + Pack Fútbol',
        features: [
          'Velocidad simétrica 300 Mbps',
          'GigaredPlay: +80 canales en vivo',
          'ESPN Premium incluido',
          'TNT Sports incluido',
          'Router WiFi Dual Band incluido',
        ],
      },
      {
        id: 'futbol-500',
        name: 'Internet + TV + Fútbol 500 Mbps',
        emoji: '⚡⚽',
        speed: '500 Mbps',
        price: '$61.999',
        sinIva: '$51.239',
        router: 'Dual Band',
        popular: true,
        popularLabel: 'MÁS ELEGIDO',
        tvBadge: 'GigaredPlay + Pack Fútbol',
        features: [
          'Velocidad simétrica 500 Mbps',
          'GigaredPlay: +80 canales en vivo',
          'ESPN Premium incluido',
          'TNT Sports incluido',
          'Router WiFi Dual Band incluido',
        ],
      },
      {
        id: 'futbol-800',
        name: 'Internet + TV + Fútbol 800 Mbps',
        emoji: '🚀⚽',
        speed: '800 Mbps',
        price: '$69.999',
        sinIva: '$57.851',
        router: 'WiFi 6 (XGPON)',
        popular: false,
        tvBadge: 'GigaredPlay + Pack Fútbol',
        features: [
          'Velocidad simétrica 800 Mbps',
          'GigaredPlay: +80 canales en vivo',
          'ESPN Premium incluido',
          'TNT Sports incluido',
          'Router WiFi 6 (XGPON) incluido',
        ],
      },
    ],
  },

  // ── Planes Internet + DGO ─────────────────────────────────────────
  // Fuente: src/App.tsx → dgoPlans / dgoTabs
  // Para actualizar precios DGO: editar también src/App.tsx (home).
  dgo: {
    tabs: [
      { key: 'lite',   label: 'Lite',             desc: '30 canales · 2 pantallas' },
      { key: 'plus',   label: 'Plus',             desc: 'DSports · 30 canales · 2 pantallas' },
      { key: 'total',  label: 'Total',            desc: 'DSports · 30 canales · 2 pantallas', defaultTab: true },
      { key: 'full',   label: 'Full',             desc: 'DSports · 80 canales · 4 pantallas' },
      { key: 'futbol', label: '⚽ Fútbol Total',  desc: 'DSports + ESPN + TNT · 80 canales · 4 pantallas',
        note: 'Plan temporal, vigente únicamente durante el Mundial de Fútbol.' },
    ],
    plans: {
      lite: [
        { speed:'300 Mbps', price:'$40.599', sinIva:'$33.554', router:'Dual Band', popular:false,
          features:['Internet simétrico 300 Mbps','+30 canales en vivo DGO','2 pantallas en simultáneo','Instalación gratuita'], includes:[] },
        { speed:'500 Mbps', price:'$44.599', sinIva:'$36.860', router:'Dual Band', popular:true,
          features:['Internet simétrico 500 Mbps','+30 canales en vivo DGO','2 pantallas en simultáneo','Instalación gratuita'], includes:[] },
        { speed:'800 Mbps', price:'$51.599', sinIva:'$42.645', router:'WiFi 6',    popular:false,
          features:['Internet simétrico 800 Mbps','+30 canales en vivo DGO','2 pantallas en simultáneo','Instalación gratuita'], includes:[] },
      ],
      plus: [
        { speed:'300 Mbps', price:'$43.881', sinIva:'$36.265', router:'Dual Band', popular:false,
          features:['Internet simétrico 300 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'500 Mbps', price:'$47.881', sinIva:'$39.571', router:'Dual Band', popular:true,
          features:['Internet simétrico 500 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'800 Mbps', price:'$54.881', sinIva:'$45.355', router:'WiFi 6',    popular:false,
          features:['Internet simétrico 800 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
      ],
      total: [
        { speed:'300 Mbps', price:'$50.881', sinIva:'$42.050', router:'Dual Band', popular:false,
          features:['Internet simétrico 300 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'500 Mbps', price:'$55.881', sinIva:'$46.183', router:'Dual Band', popular:true,
          features:['Internet simétrico 500 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'800 Mbps', price:'$62.881', sinIva:'$51.968', router:'WiFi 6',    popular:false,
          features:['Internet simétrico 800 Mbps','+30 canales en vivo DGO','DSports: deportes internacionales, NBA, MotoGP','2 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
      ],
      full: [
        { speed:'300 Mbps', price:'$55.299', sinIva:'$45.702', router:'Dual Band', popular:false,
          features:['Internet simétrico 300 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'500 Mbps', price:'$59.299', sinIva:'$49.007', router:'Dual Band', popular:true,
          features:['Internet simétrico 500 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
        { speed:'800 Mbps', price:'$66.299', sinIva:'$54.793', router:'WiFi 6',    popular:false,
          features:['Internet simétrico 800 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports'] },
      ],
      futbol: [
        { speed:'300 Mbps', price:'$56.899', sinIva:'$47.024', router:'Dual Band', popular:false,
          features:['Internet simétrico 300 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports','ESPN','TNT Sports'] },
        { speed:'500 Mbps', price:'$60.899', sinIva:'$50.330', router:'Dual Band', popular:true,
          features:['Internet simétrico 500 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports','ESPN','TNT Sports'] },
        { speed:'800 Mbps', price:'$67.899', sinIva:'$56.115', router:'WiFi 6',    popular:false,
          features:['Internet simétrico 800 Mbps','+80 canales en vivo y +10.000 títulos VOD','DSports: deportes internacionales, NBA, MotoGP','ESPN PREMIUM: fútbol argentino','TNT Sports incluido','4 pantallas en simultáneo','Instalación gratuita'], includes:['DSports','ESPN','TNT Sports'] },
      ],
    },
    addons: [
      { name: 'Atresplayer', price: '$9.300' },
      { name: 'Paramount+',  price: '$6.750' },
      { name: 'Pack Fútbol', price: '$20.970' },
      { name: 'Universal+',  price: '$11.800' },
    ],
  },

  // ── Zonas de cobertura ─────────────────────────────────────────────
  coverage: {
    florencioVarela: [
      'San Jorge 1 y 2', 'Villa Argentina', 'La Paloma',
      'La Esperanza', 'Defensa', 'Las Casitas 1 y 2',
      'Santa Rosa', 'Barrio Luján', 'La Colorada',
      'Los Pilares', 'Alpino',
    ],
    almiranteBrown: ['Barrio Luján', 'Santa Inés', 'La 160'],
    berazategui: ['El Pato'],
  },

  // ── Contacto ───────────────────────────────────────────────────────
  contact: {
    phone: '+54 9 11 2324-1875',
    email: 'contacto@newfix.net',
    address: 'C550 N829, Florencio Varela, Buenos Aires',
  },
};

// ── WA URL helper ─────────────────────────────────────────────────────
function newfix_waUrl(message) {
  return 'https://wa.me/' + NEWFIX_DATA.wa + '?text=' + encodeURIComponent(message);
}

// ── Event tracker (gtag + dataLayer) ─────────────────────────────────
function newfix_trackEvent(eventName, label, extra) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        event_category: 'landing_nfx',
        event_label: label || '',
      });
    }
    if (window.dataLayer) {
      window.dataLayer.push(Object.assign({
        event: eventName,
        label: label || '',
        page: window.location.pathname,
      }, extra || {}));
    }
  } catch (e) {}
}

// ── UTM passthrough ───────────────────────────────────────────────────
function newfix_applyUtms() {
  try {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var pairs = keys.filter(function(k) { return params.has(k); })
      .map(function(k) { return k + '=' + encodeURIComponent(params.get(k)); });
    if (!pairs.length) return;
    var suffix = '&' + pairs.join('&');
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(a) {
      if (!a.href.includes('utm_source')) a.href += suffix;
    });
  } catch (e) {}
}

// ── Plan card renderer ────────────────────────────────────────────────
function newfix_renderPlans(containerId, planKey, waMessagePrefix, eventName, ctaLabel) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var plans = NEWFIX_DATA.plans[planKey];
  if (!plans) return;

  var html = '<div class="plans-grid">';
  plans.forEach(function(p, i) {
    var waMsg = waMessagePrefix + (p.speed || p.name);
    var waHref = newfix_waUrl(waMsg);
    var isPopular = !!p.popular;
    var delay = (i * 0.1).toFixed(1) + 's';

    html += '<div class="card' + (isPopular ? ' card-popular' : '') + '" style="animation-delay:' + delay + '">';
    if (isPopular) {
      html += '<div class="popular-badge">⚡ ' + (p.popularLabel || 'MÁS ELEGIDO') + '</div>';
    }
    if (p.tvBadge) {
      html += '<div class="tv-badge">' + p.tvBadge + '</div>';
    }
    html += '<div class="plan-name">' + (p.emoji ? p.emoji + ' ' : '') + p.name + '</div>';
    html += '<div class="plan-divider"></div>';
    html += '<div class="plan-speed">' + p.speed + '</div>';
    html += '<div class="plan-price">' + p.price + '</div>';
    html += '<div class="plan-price-note">Sin impuesto: ' + p.sinIva + '</div>';
    html += '<ul class="plan-features">';
    (p.features || []).forEach(function(f) {
      html += '<li><svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' + f + '</li>';
    });
    html += '</ul>';
    html += '<a href="' + waHref + '" target="_blank" rel="noopener noreferrer"';
    html += ' class="' + (isPopular ? 'btn-primary' : 'btn-secondary') + ' plan-btn"';
    html += ' data-event="' + eventName + '" data-plan="' + p.speed + '">';
    html += (ctaLabel || 'Consultar cobertura') + '</a>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;

  el.querySelectorAll('[data-event]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      newfix_trackEvent(
        this.getAttribute('data-event'),
        this.getAttribute('data-plan'),
        { plan_id: this.closest('[data-plan-id]') ? this.closest('[data-plan-id]').dataset.planId : '' }
      );
    });
  });
}

// ── Coverage renderer ─────────────────────────────────────────────────
function newfix_renderCoverage(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var cov = NEWFIX_DATA.coverage;
  var zones = [
    { name: 'Florencio Varela', items: cov.florencioVarela, color: 'cyan' },
    { name: 'Almirante Brown', items: cov.almiranteBrown, color: 'blue' },
    { name: 'Berazategui', items: cov.berazategui, color: 'white' },
  ];
  var html = '<div class="coverage-grid">';
  zones.forEach(function(z) {
    html += '<div class="coverage-card coverage-' + z.color + '">';
    html += '<div class="coverage-title"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + z.name + '</div>';
    html += '<ul class="coverage-list">';
    z.items.forEach(function(b) { html += '<li>' + b + '</li>'; });
    html += '</ul></div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ── Init on DOMContentLoaded ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  newfix_applyUtms();
  // Pages call newfix_renderPlans / newfix_renderCoverage themselves
  // after this script loads, so nothing else needed here.
});
