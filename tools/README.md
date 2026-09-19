# Conversão de imagens

O site já vem com os WebP prontos em `images/`. Este script serve para refazer a otimização a partir dos arquivos antigos.

1. Instale Node.js.
2. Na raiz do site: `npm install sharp`
3. Coloque os arquivos antigos em `images-original/`.
4. Rode: `node tools/convert-images.mjs ./images-original ./images`

O script renomeia e converte os arquivos para WebP, limita banners a 1920/1080 px e produtos/cards a 800 px.
