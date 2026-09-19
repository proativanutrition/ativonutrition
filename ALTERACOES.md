# Ativo Nutrition — alterações entregues

## Arquivos principais
- `index.html`: remoção completa da IronPay; carrinho/WhatsApp; Kit Seleção com combinações independentes; SEO; dados legais; textos; referências WebP.
- `style.css`: verde oficial da marca; remoção dos tons laranja antigos; correção do Kit Seleção desktop/mobile sem imagens gigantes; proteção contra overflow horizontal.
- `tools/convert-images.mjs`: conversão e renomeio automático das imagens para WebP com Sharp.
- `tools/README.md`: instruções do conversor.

## Imagens renomeadas/otimizadas
- `capa desk(2).png` -> `banner-cupom-desktop.webp`
- `capa mobile(2).png` -> `banner-cupom-mobile.webp`
- `capa-kit-casal-desktop.png` -> `banner-kit-casal-desktop.webp`
- `capa-kit-casal-mobile.png` -> `banner-kit-casal-mobile.webp`
- `ativo-alpha.png` -> `ativo-alpha.webp`
- `ativo-femme.png` -> `ativo-femme.webp`
- `kit-casal-alpha-femme.png` -> `kit-casal-alpha-femme.webp`
- `card-loira(2).png` -> `card-vitaminas.webp`
- `card-morena(2).png` -> `card-performance.webp`
- `card-japonesa(2).png` -> `card-beauty.webp`
- `Triplo Magnésio.png` -> `triplo-magnesio.webp`
- `nac tivo.png` -> `nac-600mg.webp`
- `Coenzima Q10.png` -> `coenzima-q10.webp`
- `Selênio + IODO.png` -> `selenio-iodo.webp`
- `Beauty Complex.png` -> `beauty-complex.webp`
- `Detox Complex.png` -> `detox-complex.webp`
- `Magnésio +B6.png` -> `magnesio-b6.webp`
- Demais produtos também foram normalizados para minúsculas/sem espaços/acentos.

## Verificações executadas
- 0 ocorrências de `ironpay` em `index.html` e `style.css`.
- 0 ocorrências de `checkoutEndpoint`, `firstPurchaseOnly` e `ativo-first-purchase-coupon-used`.
- JavaScript dos scripts inline passou no `node --check`.
- Kit Seleção testado com 28 opções: imagens 150x145 px no desktop e 92x92 px em 390 px.
- Dois Kits Seleção com combinações diferentes permanecem separados no carrinho.
- Componentes dos dois kits aparecem no carrinho e na mensagem do WhatsApp.
- Cupom ATIVO10, remoção de item e frete grátis após descontos testados.
- Teste em viewport 390 px: sem rolagem horizontal e WhatsApp flutuante sem sobrepor “Ver todas as categorias”.
- Teste de execução: 0 erros de JavaScript/console no fluxo testado.
- Pasta `images/` otimizada: aproximadamente 2,02 MB.

## Antes de publicar
Preencha em `store`: `legalName`, `cnpj`, `address` e troque `siteUrl` de `https://SEU-DOMINIO.com.br` para o domínio real. Atualize também as URLs absolutas do `<head>` com o domínio real.
