#!/usr/bin/env python3
"""Gera páginas estáticas de produto (<id>.html na raiz), sitemap.xml e robots.txt
a partir da lista de produtos do index.html. Rode na raiz do site sempre que mudar produtos:

    python3 tools/gerar-seo.py
"""
import json, re, html, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://proativanutrition.github.io/ativonutrition"
src = (ROOT / "index.html").read_text(encoding="utf-8")

store = json.loads(re.search(r"^store: (\{.*\}),\s*$", src, re.M).group(1))
block = src[src.index("products: [") : src.index("].map(p => ({")]
products = [json.loads(l.rstrip().rstrip(",")) for l in block.splitlines() if l.startswith('{"id"')]
byid = {p["id"]: p for p in products}
kit_off = store.get("kitDiscount", 0.1)
# Rótulos (modo de uso, ingredientes, advertências, FAQ) definidos em window.ATIVO_ROTULOS no index.html
rotulos = json.loads(re.search(r"^window\.ATIVO_ROTULOS = (\{.*\});?\s*$", src, re.M).group(1))
for k, v in re.findall(r'^window\.ATIVO_ROTULOS\["([^"]+)"\] = (\{.*\});\s*$', src, re.M):
    rotulos[k] = json.loads(v)
# Produtos que mostram a seção "Avaliações de clientes" (avaliacoes.js + avaliacoes/avaliacoes.json)
COM_AVALIACOES = lambda pid: "drenalinf" in pid
pix = store.get("pixDiscount", 0.03)
today = datetime.date.today().isoformat()
esc = lambda s: html.escape(str(s), quote=True)
brl = lambda v: f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def price(p):
    if p.get("customizable"):
        return None
    if p.get("kit"):
        comps = p["components"] if p.get("repeat") else list(dict.fromkeys(p["components"]))
        return round(sum(byid[c]["price"] for c in comps) * (1 - kit_off), 2)
    return p.get("price")


def image(p):
    if p.get("imageFiles"):
        return f"{SITE}/images/{p['imageFiles'][0]}"
    if p.get("images"):
        return f"{SITE}/{p['images'][0]}"
    if p.get("kit") and p.get("components"):
        return image(byid[p["components"][0]])
    return f"{SITE}/{store['socialImage']}"


def description(p):
    if p.get("description"):
        return p["description"]
    if p.get("kit"):
        names = [byid[c]["name"] for c in p["components"]]
        return f"Kit Ativo Nutrition com {', '.join(names)}, com {round(kit_off*100)}% de desconto em relação à compra avulsa."
    return f"{p['name']} da Ativo Nutrition."


PAGE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="product">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Ativo Nutrition">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="product:price:amount" content="{price_raw}">
<meta property="product:price:currency" content="BRL">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#169447">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="stylesheet" href="style.css">{extra_head}
<script type="application/ld+json">{schema}</script>
<script type="application/ld+json">{crumbs}</script>
<style>
.seo-product{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:center;padding:48px 32px}}
.seo-product img{{width:100%;max-width:520px;aspect-ratio:1;object-fit:contain;background:#f7f7f5;border-radius:24px}}
.seo-product .price{{font-size:32px;font-weight:700;color:#292621;margin:16px 0 4px}}
.seo-product .pix{{color:#169447;font-weight:600;margin-bottom:24px}}
.seo-product .desc{{margin:20px 0}}
.seo-crumbs{{font-size:13px;padding:24px 32px 0}}
.seo-crumbs a{{text-decoration:underline}}
.seo-list{{padding:0 32px 64px}}
.seo-list ul{{display:flex;flex-wrap:wrap;gap:8px 20px;padding:0;list-style:none}}
.seo-list a{{text-decoration:underline;font-size:14px}}
@media (max-width:720px){{.seo-product{{grid-template-columns:1fr;gap:24px;padding:24px 16px}}.seo-crumbs,.seo-list{{padding-left:16px;padding-right:16px}}}}
</style>
</head>
<body>
<header class="container" style="padding-top:20px"><a href="./"><img src="images/logo-ativo.svg" alt="Ativo Nutrition" width="140" height="48"></a></header>
<nav class="container seo-crumbs" aria-label="Navegação"><a href="./">Início</a> / <a href="./#/produtos">Produtos</a> / {name}</nav>
<main class="container seo-product">
<img src="{img}" alt="{name} — Ativo Nutrition" width="800" height="800">
<div>
<p class="eyebrow">{category}</p>
<h1>{name}</h1>
{qty}
<p class="price">{price}</p>
{pixline}
<p class="desc">{desc}</p>
<a class="btn" href="{buy}" rel="nofollow">COMPRAR AGORA</a>
<p class="small-note" style="margin-top:16px">Frete grátis acima de {frete} · Atendimento pelo <a href="https://wa.me/{whats}" rel="noopener">WhatsApp</a></p>
</div>
</main>{extra}
<section class="container seo-list"><h2>Veja também</h2><ul>{others}</ul></section>
</body>
</html>
"""

def rotulo_completo(p):
    """Rótulo com FAQ do produto (ou do único produto de um kit). Só esses ganham a seção de informações."""
    ids = list(dict.fromkeys(p.get("components", []))) if p.get("kit") else [p["id"]]
    if len(ids) == 1 and rotulos.get(ids[0], {}).get("faq"):
        return rotulos[ids[0]]
    return None


def extras(p):
    r, head, body = rotulo_completo(p), "", ""
    if r:
        faq = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in r["faq"])
        badges = "".join(f"<li>{esc(d)}</li>" for d in r.get("destaques", []))
        body += ('\n<section class="container product-details seo-info">'
                 f'<details open><summary>Modo de uso</summary><p>{esc(r["uso"])}</p></details>'
                 f'<details open><summary>Ingredientes</summary><p>{esc(r["ingredientes"])}</p>'
                 + (f'<ul class="pdp-badges">{badges}</ul>' if badges else "") + '</details>'
                 f'<details><summary>Advertências</summary><p>{esc(r["advertencias"])}</p></details>'
                 f'<h2 class="seo-faq-title">Perguntas frequentes</h2><div class="seo-faq">{faq}</div></section>')
        faq_schema = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in r["faq"]]}
        head += f'\n<script type="application/ld+json">{json.dumps(faq_schema, ensure_ascii=False)}</script>'
        head += '\n<style>.seo-info{padding-bottom:8px}.seo-info details p{font-size:14px}.seo-faq-title{font-size:24px;margin:40px 0 4px}.seo-faq details{border-bottom:1px solid #e9e5df;padding:16px 0}</style>'
    if COM_AVALIACOES(p["id"]):
        body += '\n<section class="container" data-avaliacoes></section>'
        head += '\n<script src="avaliacoes.js" defer></script>'
    return head, body


urls = [(f"{SITE}/", "1.0")]
for p in products:
    pr = price(p)
    url = f"{SITE}/{p['id']}.html"
    name, desc, img = p["name"], description(p), image(p)
    offer = {"@type": "Offer", "url": url, "priceCurrency": "BRL", "availability": "https://schema.org/InStock",
             "itemCondition": "https://schema.org/NewCondition", "seller": {"@type": "Organization", "name": "Ativo Nutrition"}}
    if pr is not None:
        offer["price"] = f"{pr:.2f}"
    schema = {"@context": "https://schema.org", "@type": "Product", "name": name, "description": desc, "image": [img],
              "sku": p["id"], "brand": {"@type": "Brand", "name": "Ativo Nutrition"}, "category": p.get("category"), "offers": offer}
    crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Início", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": p.get("category", "Produtos"), "item": f"{SITE}/#/produtos"},
        {"@type": "ListItem", "position": 3, "name": name, "item": url}]}
    others = "".join(f'<li><a href="{o["id"]}.html">{esc(o["name"])}</a></li>' for o in products if o is not p)
    qty = p.get("quantity") or ("" if p.get("kit") else "")
    extra_head, extra = extras(p)
    page = PAGE.format(extra_head=extra_head, extra=extra,
        title=esc(f"{name} | Ativo Nutrition"), desc=esc(desc[:300]), url=url, img=img, name=esc(name), id=p["id"],
        category=esc(p.get("category", "")), qty=f'<p class="quantity">{esc(qty)}</p>' if qty else "",
        price=brl(pr) if pr is not None else "Monte o seu kit", price_raw=f"{pr:.2f}" if pr is not None else "",
        pixline=f'<p class="pix">{brl(round(pr*(1-pix),2))} no Pix ou {store["installments"]}x sem juros</p>' if pr else "",
        frete=brl(store["freeShippingFrom"]), buy=(store["checkoutUrl"]+store["checkoutTokens"][p["id"]]+":1") if (store.get("checkoutEnabled") and p["id"] in store.get("checkoutTokens",{})) else f"./#/produto/{p['id']}", whats=store["whatsapp"], others=others,
        schema=json.dumps(schema, ensure_ascii=False), crumbs=json.dumps(crumbs, ensure_ascii=False))
    out = ROOT / f"{p['id']}.html"
    out.write_text(page, encoding="utf-8")
    urls.append((url, "0.8"))

(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"<url><loc>{u}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>\n" for u, pr in urls)
    + "</urlset>\n", encoding="utf-8")
(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
print(f"{len(products)} páginas de produto, sitemap com {len(urls)} URLs")

# Links estáticos no rodapé do index.html (ajuda o Google a achar as páginas de produto)
links = "".join(f'<a href="{p["id"]}.html">{esc(p["name"])}</a>' for p in products)
footer = ('<!-- SEO-LINKS:INICIO --><nav class="container seo-footer-links" aria-label="Todos os produtos">'
          '<h3>Nossos produtos</h3><div>' + links + '</div></nav>'
          '<style>.seo-footer-links{padding-top:24px;padding-bottom:8px}.seo-footer-links h3{font-size:14px;margin-bottom:10px}'
          '.seo-footer-links div{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px}'
          '.seo-footer-links a{color:var(--muted)}.seo-footer-links a:hover{color:var(--brand-dark)}</style><!-- SEO-LINKS:FIM -->')
src2 = re.sub(r"<!-- SEO-LINKS:INICIO -->.*?<!-- SEO-LINKS:FIM -->", lambda m: footer, src, flags=re.S)
(ROOT / "index.html").write_text(src2, encoding="utf-8")
print("rodapé atualizado")
