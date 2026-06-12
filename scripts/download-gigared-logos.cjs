const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = 'https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina';
const DEST = path.join(__dirname, '..', 'public', 'logos', 'gigared');
fs.mkdirSync(DEST, { recursive: true });

const FILES = [
  // Nacionales
  { src: `${BASE}/america-ar.png`,              dest: 'america.png' },
  { src: `${BASE}/telefe-ar.png`,               dest: 'telefe.png' },
  { src: `${BASE}/television-publica-ar.png`,   dest: 'tv-publica.png' },
  { src: `${BASE}/elnueve-ar.png`,              dest: 'elnueve.png' },
  { src: `${BASE}/la-nacion-mas-ar.png`,        dest: 'ln-mas.png' },
  { src: `${BASE}/c5n-ar.png`,                  dest: 'c5n.png' },
  { src: `${BASE}/cronica-hd-ar.png`,           dest: 'cronica.png' },
  { src: `${BASE}/canal-26-ar.png`,             dest: 'canal26.png' },
  { src: `${BASE}/a24-ar.png`,                  dest: 'a24.png' },
  { src: `${BASE}/cnn-en-espanol-ar.png`,       dest: 'cnn-espanol.png' },
  { src: `${BASE}/net-tv-ar.png`,               dest: 'net-tv.png' },
  // Deportes
  { src: `${BASE}/deportv-ar.png`,              dest: 'deportv.png' },
  { src: `${BASE}/tyc-sports-ar.png`,           dest: 'tyc-sports.png' },
  { src: `${BASE}/espn-ar.png`,                 dest: 'espn.png' },
  { src: `${BASE}/espn-2-ar.png`,               dest: 'espn2.png' },
  { src: `${BASE}/espn-3-ar.png`,               dest: 'espn3.png' },
  { src: `${BASE}/espn-extra-ar.png`,           dest: 'espn4.png' },
  { src: `${BASE}/fox-sports-ar.png`,           dest: 'fox-sports.png' },
  { src: `${BASE}/fox-sports-2-ar.png`,         dest: 'fox-sports2.png' },
  { src: `${BASE}/fox-sports-3-ar.png`,         dest: 'fox-sports3.png' },
  { src: `${BASE}/discovery-turbo-ar.png`,      dest: 'disc-turbo.png' },
  // Infantiles
  { src: `${BASE}/pakapaka-ar.png`,             dest: 'pakapaka.png' },
  { src: `${BASE}/disney-channel-ar.png`,       dest: 'disney-channel.png' },
  { src: `${BASE}/disney-jr-ar.png`,            dest: 'disney-jr.png' },
  { src: `${BASE}/nickelodeon-ar.png`,          dest: 'nickelodeon.png' },
  { src: `${BASE}/discovery-kids-ar.png`,       dest: 'disc-kids.png' },
  { src: `${BASE}/boomerang-ar.png`,            dest: 'boomerang.png' },
  { src: `${BASE}/cartoon-network-ar.png`,      dest: 'cartoon-network.png' },
  // Cine y Series
  { src: `${BASE}/cine-canal-ar.png`,           dest: 'cinecanal.png' },
  { src: `${BASE}/tnt-ar.png`,                  dest: 'tnt.png' },
  { src: `${BASE}/fx-ar.png`,                   dest: 'fx.png' },
  { src: `${BASE}/star-channel-ar.png`,         dest: 'star-channel.png' },
  { src: `${BASE}/sony-channel-ar.png`,         dest: 'sony-channel.png' },
  { src: `${BASE}/universal-tv-ar.png`,         dest: 'universal.png' },
  { src: `${BASE}/axn-ar.png`,                  dest: 'axn.png' },
  { src: `${BASE}/studio-universal-ar.png`,     dest: 'studio-universal.png' },
  { src: `${BASE}/a-and-e-ar.png`,              dest: 'aande.png' },
  { src: `${BASE}/amc-ar.png`,                  dest: 'amc.png' },
  { src: `${BASE}/lifetime-ar.png`,             dest: 'lifetime.png' },
  { src: `${BASE}/tnt-series-ar.png`,           dest: 'tnt-series.png' },
  // Entretenimiento y Variedades
  { src: `${BASE}/id-investigation-discovery-ar.png`, dest: 'discovery-id.png' },
  { src: `${BASE}/comedy-central-ar.png`,       dest: 'comedy-central.png' },
  { src: `${BASE}/el-gourmet-ar.png`,           dest: 'el-gourmet.png' },
  { src: `${BASE}/discovery-home-and-health-ar.png`, dest: 'hh.png' },
  { src: `${BASE}/tlc-ar.png`,                  dest: 'tlc.png' },
  { src: `${BASE}/food-network-ar.png`,         dest: 'food-network.png' },
  { src: `${BASE}/hgtv-ar.png`,                 dest: 'hgtv.png' },
  { src: `${BASE}/kzo-ar.png`,                  dest: 'kzo.png' },
  // Documentales
  { src: `${BASE}/discovery-science-ar.png`,    dest: 'science.png' },
  { src: `${BASE}/national-geographic-ar.png`,  dest: 'natgeo.png' },
  { src: `${BASE}/discovery-channel-ar.png`,    dest: 'discovery.png' },
  { src: `${BASE}/animal-planet-ar.png`,        dest: 'animal-planet.png' },
  { src: `${BASE}/history-channel-ar.png`,      dest: 'history.png' },
  { src: `${BASE}/film-and-arts-ar.png`,        dest: 'film-arts.png' },
  { src: `${BASE}/discovery-world-hd-ar.png`,   dest: 'disc-world.png' },
  // Internacional y Música
  { src: `${BASE}/mtv-ar.png`,                  dest: 'mtv.png' },
  { src: `${BASE}/cm-el-canal-de-la-musica-ar.png`, dest: 'cm.png' },
  { src: `${BASE}/allegro-hd-ar.png`,           dest: 'allegro.png' },
  { src: `${BASE}/quiero-musica-en-mi-idioma-ar.png`, dest: 'quiero-musica.png' },
];

function download(src, destFile) {
  const dest = path.join(DEST, destFile);
  return new Promise((resolve) => {
    const client = src.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = client.get(src, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlink(dest, () => {});
        download(res.headers.location, destFile).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close(); fs.unlink(dest, () => {});
        console.error(`✗ ${destFile}: HTTP ${res.statusCode}`);
        resolve(false); return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`✓ ${destFile}`); resolve(true); });
    });
    req.on('error', (err) => { fs.unlink(dest, () => {}); console.error(`✗ ${destFile}: ${err.message}`); resolve(false); });
    req.setTimeout(15000, () => { req.destroy(); console.error(`✗ ${destFile}: timeout`); resolve(false); });
  });
}

async function main() {
  console.log(`Descargando ${FILES.length} logos de canales GigaredPlay...\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < FILES.length; i += 5) {
    const batch = FILES.slice(i, i + 5);
    const results = await Promise.all(batch.map(f => download(f.src, f.dest)));
    ok += results.filter(Boolean).length;
    fail += results.filter(r => !r).length;
  }
  console.log(`\nListo: ${ok} OK, ${fail} fallidos`);
}

main();
