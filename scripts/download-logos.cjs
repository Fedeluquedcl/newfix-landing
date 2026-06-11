const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://dgo.nubenet.com.ar/static';
const OUT_DIR = path.join(__dirname, '..', 'public', 'canales');
const LOGOS_DIR = path.join(__dirname, '..', 'public', 'logos');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(LOGOS_DIR, { recursive: true });

const FILES = [
  // DGO logo principal
  { src: `${BASE_URL}/logos/dgo.png`, dest: path.join(LOGOS_DIR, 'dgo.png') },
  // Canales — con su extensión exacta
  { src: `${BASE_URL}/canales/l200.svg`, dest: path.join(OUT_DIR, 'l200.svg') },
  { src: `${BASE_URL}/canales/l201.png`, dest: path.join(OUT_DIR, 'l201.png') },
  { src: `${BASE_URL}/canales/l0.png`,   dest: path.join(OUT_DIR, 'l0.png') },
  { src: `${BASE_URL}/canales/l1.png`,   dest: path.join(OUT_DIR, 'l1.png') },
  { src: `${BASE_URL}/canales/l2.png`,   dest: path.join(OUT_DIR, 'l2.png') },
  { src: `${BASE_URL}/canales/l3.png`,   dest: path.join(OUT_DIR, 'l3.png') },
  { src: `${BASE_URL}/canales/l4.png`,   dest: path.join(OUT_DIR, 'l4.png') },
  { src: `${BASE_URL}/canales/l5.png`,   dest: path.join(OUT_DIR, 'l5.png') },
  { src: `${BASE_URL}/canales/l6.png`,   dest: path.join(OUT_DIR, 'l6.png') },
  { src: `${BASE_URL}/canales/l7.png`,   dest: path.join(OUT_DIR, 'l7.png') },
  { src: `${BASE_URL}/canales/l8.png`,   dest: path.join(OUT_DIR, 'l8.png') },
  { src: `${BASE_URL}/canales/l9.png`,   dest: path.join(OUT_DIR, 'l9.png') },
  { src: `${BASE_URL}/canales/l10.png`,  dest: path.join(OUT_DIR, 'l10.png') },
  { src: `${BASE_URL}/canales/l11.png`,  dest: path.join(OUT_DIR, 'l11.png') },
  { src: `${BASE_URL}/canales/l12.png`,  dest: path.join(OUT_DIR, 'l12.png') },
  { src: `${BASE_URL}/canales/l13.png`,  dest: path.join(OUT_DIR, 'l13.png') },
  { src: `${BASE_URL}/canales/l14.png`,  dest: path.join(OUT_DIR, 'l14.png') },
  { src: `${BASE_URL}/canales/l15.jpg`,  dest: path.join(OUT_DIR, 'l15.jpg') },
  { src: `${BASE_URL}/canales/l16.png`,  dest: path.join(OUT_DIR, 'l16.png') },
  { src: `${BASE_URL}/canales/l17.png`,  dest: path.join(OUT_DIR, 'l17.png') },
  { src: `${BASE_URL}/canales/l18.png`,  dest: path.join(OUT_DIR, 'l18.png') },
  { src: `${BASE_URL}/canales/l19.png`,  dest: path.join(OUT_DIR, 'l19.png') },
  { src: `${BASE_URL}/canales/l20.png`,  dest: path.join(OUT_DIR, 'l20.png') },
  { src: `${BASE_URL}/canales/l21.png`,  dest: path.join(OUT_DIR, 'l21.png') },
  { src: `${BASE_URL}/canales/l22.png`,  dest: path.join(OUT_DIR, 'l22.png') },
  { src: `${BASE_URL}/canales/l23.png`,  dest: path.join(OUT_DIR, 'l23.png') },
  { src: `${BASE_URL}/canales/l24.png`,  dest: path.join(OUT_DIR, 'l24.png') },
  { src: `${BASE_URL}/canales/l25.png`,  dest: path.join(OUT_DIR, 'l25.png') },
  { src: `${BASE_URL}/canales/l26.png`,  dest: path.join(OUT_DIR, 'l26.png') },
  { src: `${BASE_URL}/canales/l27.png`,  dest: path.join(OUT_DIR, 'l27.png') },
  { src: `${BASE_URL}/canales/l28.png`,  dest: path.join(OUT_DIR, 'l28.png') },
  { src: `${BASE_URL}/canales/l29.png`,  dest: path.join(OUT_DIR, 'l29.png') },
  { src: `${BASE_URL}/canales/l30.png`,  dest: path.join(OUT_DIR, 'l30.png') },
  { src: `${BASE_URL}/canales/l31.png`,  dest: path.join(OUT_DIR, 'l31.png') },
  { src: `${BASE_URL}/canales/l32.png`,  dest: path.join(OUT_DIR, 'l32.png') },
  { src: `${BASE_URL}/canales/l33.png`,  dest: path.join(OUT_DIR, 'l33.png') },
  { src: `${BASE_URL}/canales/l34.png`,  dest: path.join(OUT_DIR, 'l34.png') },
  { src: `${BASE_URL}/canales/l35.png`,  dest: path.join(OUT_DIR, 'l35.png') },
  { src: `${BASE_URL}/canales/l36.png`,  dest: path.join(OUT_DIR, 'l36.png') },
  { src: `${BASE_URL}/canales/l37.png`,  dest: path.join(OUT_DIR, 'l37.png') },
  { src: `${BASE_URL}/canales/l38.png`,  dest: path.join(OUT_DIR, 'l38.png') },
  { src: `${BASE_URL}/canales/l39.png`,  dest: path.join(OUT_DIR, 'l39.png') },
  { src: `${BASE_URL}/canales/l40.png`,  dest: path.join(OUT_DIR, 'l40.png') },
  { src: `${BASE_URL}/canales/l41.jpg`,  dest: path.join(OUT_DIR, 'l41.jpg') },
  { src: `${BASE_URL}/canales/l42.png`,  dest: path.join(OUT_DIR, 'l42.png') },
  { src: `${BASE_URL}/canales/l43.png`,  dest: path.join(OUT_DIR, 'l43.png') },
  { src: `${BASE_URL}/canales/l44.png`,  dest: path.join(OUT_DIR, 'l44.png') },
  { src: `${BASE_URL}/canales/l45.png`,  dest: path.join(OUT_DIR, 'l45.png') },
  { src: `${BASE_URL}/canales/l46.png`,  dest: path.join(OUT_DIR, 'l46.png') },
  { src: `${BASE_URL}/canales/l47.png`,  dest: path.join(OUT_DIR, 'l47.png') },
  { src: `${BASE_URL}/canales/l48.png`,  dest: path.join(OUT_DIR, 'l48.png') },
  { src: `${BASE_URL}/canales/l49.png`,  dest: path.join(OUT_DIR, 'l49.png') },
  { src: `${BASE_URL}/canales/l50.png`,  dest: path.join(OUT_DIR, 'l50.png') },
  { src: `${BASE_URL}/canales/l51.png`,  dest: path.join(OUT_DIR, 'l51.png') },
  { src: `${BASE_URL}/canales/l52.png`,  dest: path.join(OUT_DIR, 'l52.png') },
  { src: `${BASE_URL}/canales/l53.png`,  dest: path.join(OUT_DIR, 'l53.png') },
  { src: `${BASE_URL}/canales/l54.png`,  dest: path.join(OUT_DIR, 'l54.png') },
  { src: `${BASE_URL}/canales/l55.png`,  dest: path.join(OUT_DIR, 'l55.png') },
  { src: `${BASE_URL}/canales/l56.png`,  dest: path.join(OUT_DIR, 'l56.png') },
  { src: `${BASE_URL}/canales/l57.png`,  dest: path.join(OUT_DIR, 'l57.png') },
  { src: `${BASE_URL}/canales/l58.png`,  dest: path.join(OUT_DIR, 'l58.png') },
  { src: `${BASE_URL}/canales/l59.png`,  dest: path.join(OUT_DIR, 'l59.png') },
  { src: `${BASE_URL}/canales/l60.png`,  dest: path.join(OUT_DIR, 'l60.png') },
  { src: `${BASE_URL}/canales/l61.png`,  dest: path.join(OUT_DIR, 'l61.png') },
  { src: `${BASE_URL}/canales/l62.png`,  dest: path.join(OUT_DIR, 'l62.png') },
  { src: `${BASE_URL}/canales/l63.png`,  dest: path.join(OUT_DIR, 'l63.png') },
  { src: `${BASE_URL}/canales/l64.png`,  dest: path.join(OUT_DIR, 'l64.png') },
  { src: `${BASE_URL}/canales/l65.png`,  dest: path.join(OUT_DIR, 'l65.png') },
  { src: `${BASE_URL}/canales/l66.png`,  dest: path.join(OUT_DIR, 'l66.png') },
  { src: `${BASE_URL}/canales/l67.png`,  dest: path.join(OUT_DIR, 'l67.png') },
  { src: `${BASE_URL}/canales/l68.png`,  dest: path.join(OUT_DIR, 'l68.png') },
  { src: `${BASE_URL}/canales/l69.png`,  dest: path.join(OUT_DIR, 'l69.png') },
  { src: `${BASE_URL}/canales/l70.png`,  dest: path.join(OUT_DIR, 'l70.png') },
  { src: `${BASE_URL}/canales/l71.png`,  dest: path.join(OUT_DIR, 'l71.png') },
  { src: `${BASE_URL}/canales/l72.jpg`,  dest: path.join(OUT_DIR, 'l72.jpg') },
  { src: `${BASE_URL}/canales/l73.png`,  dest: path.join(OUT_DIR, 'l73.png') },
  { src: `${BASE_URL}/canales/l74.png`,  dest: path.join(OUT_DIR, 'l74.png') },
  { src: `${BASE_URL}/canales/l75.png`,  dest: path.join(OUT_DIR, 'l75.png') },
  { src: `${BASE_URL}/canales/l76.png`,  dest: path.join(OUT_DIR, 'l76.png') },
  { src: `${BASE_URL}/canales/l77.png`,  dest: path.join(OUT_DIR, 'l77.png') },
  { src: `${BASE_URL}/canales/l78.png`,  dest: path.join(OUT_DIR, 'l78.png') },
  { src: `${BASE_URL}/canales/l79.png`,  dest: path.join(OUT_DIR, 'l79.png') },
  { src: `${BASE_URL}/canales/l80.png`,  dest: path.join(OUT_DIR, 'l80.png') },
  { src: `${BASE_URL}/canales/l81.png`,  dest: path.join(OUT_DIR, 'l81.png') },
  { src: `${BASE_URL}/canales/l82.png`,  dest: path.join(OUT_DIR, 'l82.png') },
  { src: `${BASE_URL}/canales/l83.png`,  dest: path.join(OUT_DIR, 'l83.png') },
  { src: `${BASE_URL}/canales/l84.png`,  dest: path.join(OUT_DIR, 'l84.png') },
  { src: `${BASE_URL}/canales/l85.png`,  dest: path.join(OUT_DIR, 'l85.png') },
  { src: `${BASE_URL}/canales/l86.png`,  dest: path.join(OUT_DIR, 'l86.png') },
  { src: `${BASE_URL}/canales/l87.png`,  dest: path.join(OUT_DIR, 'l87.png') },
  { src: `${BASE_URL}/canales/l88.png`,  dest: path.join(OUT_DIR, 'l88.png') },
  { src: `${BASE_URL}/canales/l89.png`,  dest: path.join(OUT_DIR, 'l89.png') },
  { src: `${BASE_URL}/canales/l90.png`,  dest: path.join(OUT_DIR, 'l90.png') },
  { src: `${BASE_URL}/canales/l91.png`,  dest: path.join(OUT_DIR, 'l91.png') },
  { src: `${BASE_URL}/canales/l92.png`,  dest: path.join(OUT_DIR, 'l92.png') },
  { src: `${BASE_URL}/canales/l93.png`,  dest: path.join(OUT_DIR, 'l93.png') },
  { src: `${BASE_URL}/canales/l94.png`,  dest: path.join(OUT_DIR, 'l94.png') },
  { src: `${BASE_URL}/canales/l95.png`,  dest: path.join(OUT_DIR, 'l95.png') },
  { src: `${BASE_URL}/canales/l96.png`,  dest: path.join(OUT_DIR, 'l96.png') },
  { src: `${BASE_URL}/canales/l97.png`,  dest: path.join(OUT_DIR, 'l97.png') },
  { src: `${BASE_URL}/canales/l98.png`,  dest: path.join(OUT_DIR, 'l98.png') },
  { src: `${BASE_URL}/canales/l99.png`,  dest: path.join(OUT_DIR, 'l99.png') },
  { src: `${BASE_URL}/canales/l100.png`, dest: path.join(OUT_DIR, 'l100.png') },
  { src: `${BASE_URL}/canales/l101.png`, dest: path.join(OUT_DIR, 'l101.png') },
  { src: `${BASE_URL}/canales/l102.png`, dest: path.join(OUT_DIR, 'l102.png') },
  { src: `${BASE_URL}/canales/l103.png`, dest: path.join(OUT_DIR, 'l103.png') },
  { src: `${BASE_URL}/canales/l104.png`, dest: path.join(OUT_DIR, 'l104.png') },
  { src: `${BASE_URL}/canales/l105.png`, dest: path.join(OUT_DIR, 'l105.png') },
  { src: `${BASE_URL}/canales/l106.png`, dest: path.join(OUT_DIR, 'l106.png') },
  { src: `${BASE_URL}/canales/l107.png`, dest: path.join(OUT_DIR, 'l107.png') },
  { src: `${BASE_URL}/canales/l108.png`, dest: path.join(OUT_DIR, 'l108.png') },
  { src: `${BASE_URL}/canales/l109.png`, dest: path.join(OUT_DIR, 'l109.png') },
  { src: `${BASE_URL}/canales/l110.png`, dest: path.join(OUT_DIR, 'l110.png') },
  { src: `${BASE_URL}/canales/l111.png`, dest: path.join(OUT_DIR, 'l111.png') },
  // Logos GigaredPlay
  { src: 'https://gigaredplay.com.ar/wp-content/uploads/2025/09/Logo-Gigared-blanco.svg', dest: path.join(LOGOS_DIR, 'gigaredplay.svg') },
  { src: 'https://gigaredplay.com.ar/wp-content/uploads/2025/09/Logo-Gigared1.svg', dest: path.join(LOGOS_DIR, 'gigaredplay-color.svg') },
];

function download(src, dest) {
  return new Promise((resolve) => {
    const client = src.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = client.get(src, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ ${path.basename(dest)}`);
        resolve(true);
      });
    });
    req.on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`✗ ${path.basename(dest)}: ${err.message}`);
      resolve(false);
    });
    req.setTimeout(15000, () => {
      req.destroy();
      console.error(`✗ ${path.basename(dest)}: timeout`);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Descargando ${FILES.length} archivos...\n`);
  let ok = 0, fail = 0;
  // Descarga de a 5 en paralelo
  for (let i = 0; i < FILES.length; i += 5) {
    const batch = FILES.slice(i, i + 5);
    const results = await Promise.all(batch.map(f => download(f.src, f.dest)));
    ok += results.filter(Boolean).length;
    fail += results.filter(r => !r).length;
  }
  console.log(`\nListo: ${ok} OK, ${fail} fallidos`);
}

main();
