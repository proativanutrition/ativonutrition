#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDir = path.resolve(process.argv[2] || './images-original');
const outDir = path.resolve(process.argv[3] || './images');

const jobs = [
  // banners
  ['capa desk(2).png', 'banner-cupom-desktop.webp', 1920, 76],
  ['capa mobile(2).png', 'banner-cupom-mobile.webp', 1080, 76],
  ['capa-kit-casal-desktop.png', 'banner-kit-casal-desktop.webp', 1920, 76],
  ['capa-kit-casal-mobile.png', 'banner-kit-casal-mobile.webp', 1080, 76],

  // novos produtos / kit casal
  ['ativo-alpha.png', 'ativo-alpha.webp', 800, 80],
  ['ativo-femme.png', 'ativo-femme.webp', 800, 80],
  ['kit-casal-alpha-femme.png', 'kit-casal-alpha-femme.webp', 800, 80],

  // cards
  ['card-loira(2).png', 'card-vitaminas.webp', 800, 76],
  ['card-morena(2).png', 'card-performance.webp', 800, 76],
  ['card-japonesa(2).png', 'card-beauty.webp', 800, 76],

  // catálogo
  ['Triplo Magnésio.png', 'triplo-magnesio.webp', 800, 80],
  ['nac tivo.png', 'nac-600mg.webp', 800, 80],
  ['Coenzima Q10.png', 'coenzima-q10.webp', 800, 80],
  ['Selênio + IODO.png', 'selenio-iodo.webp', 800, 80],
  ['Beauty Complex.png', 'beauty-complex.webp', 800, 80],
  ['Detox Complex.png', 'detox-complex.webp', 800, 80],
  ['Magnésio +B6.png', 'magnesio-b6.webp', 800, 80],
  ['Zinco Quelato.png', 'zinco-quelato.webp', 800, 80],
  ['Vitamina D3.png', 'vitamina-d3.webp', 800, 80],
  ['Vitamina D3+K2.png', 'vitamina-d3-k2.webp', 800, 80],
  ['Vitamina C.png', 'vitamina-c.webp', 800, 80],
  ['CoQ10+PQQ.png', 'coq10-pqq.webp', 800, 80],
  ['Cafeína.png', 'cafeina.webp', 800, 80],
  ['Cafeína+Taurina.png', 'cafeina-taurina.webp', 800, 80],
  ['L-Carnitina.png', 'l-carnitina.webp', 800, 80],
  ['L-Citrulina.png', 'l-citrulina.webp', 800, 80],
  ['Beta-Alanina.png', 'beta-alanina.webp', 800, 80],
  ['Colágeno Complex.png', 'colageno-complex.webp', 800, 80],
  ['Hair Complex.png', 'hair-complex.webp', 800, 80],
  ['Skin Complex.png', 'skin-complex.webp', 800, 80],
  ['NAC+VITAMINA C.png', 'nac-vitamina-c.webp', 800, 80],
  ['Resveratrol.png', 'resveratrol.webp', 800, 80],
  ['Astaxantina.png', 'astaxantina.webp', 800, 80],
  ['Multivitaminico + minerais.png', 'multivitaminico-minerais.webp', 800, 80],
  ['Omega 3.png', 'omega-3.webp', 800, 80],
  ['creatina.webp', 'creatina.webp', 800, 80],
];

await fs.mkdir(outDir, { recursive: true });
let converted = 0;
let skipped = 0;
for (const [from, to, width, quality] of jobs) {
  const input = path.join(sourceDir, from);
  const output = path.join(outDir, to);
  try {
    await fs.access(input);
  } catch {
    console.warn(`SKIP: não encontrado: ${from}`);
    skipped++;
    continue;
  }
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);
  const st = await fs.stat(output);
  console.log(`OK: ${from} -> ${to} (${Math.round(st.size / 1024)} KB)`);
  converted++;
}
console.log(`\nConcluído: ${converted} convertido(s), ${skipped} ignorado(s).`);
