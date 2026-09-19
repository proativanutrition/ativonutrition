/* ATIVO NUTRITION — HTML + CSS + JavaScript comuns, sem compilação. */
(() => {
  'use strict';
  const { store, products, articles, objectives = [], pages = {} } = window.ATIVO_DATA;
  const MODO_DEMONSTRACAO = store.demo === true;
  const INSTAGRAM_URL = store.instagram ? `https://www.instagram.com/${store.instagram.replace(/^@/, '')}/` : '';
  const categories = [...new Set(['Todos', ...(window.ATIVO_DATA.categories || []), ...products.map(p => p.category)])];
  const round = value => Math.round((value + Number.EPSILON) * 100) / 100;
  // Kits não duplicam a regra de preço: seguem os componentes e a única taxa em store.
  products.filter(p => p.kit).forEach(kit => {
    const parts = kit.components.map(id => products.find(p => p.id === id));
    kit.tags = [...new Set(parts.filter(Boolean).flatMap(p => p.tags || []))];
    if (parts.length && parts.every(p => p && Number.isFinite(p.price))) {
      kit.oldPrice = round(parts.reduce((sum, p) => sum + p.price, 0));
      kit.price = round(kit.oldPrice * (1 - store.kitDiscount));
    } else { kit.price = null; }
  });
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => Number(value).toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
  const contact = message => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
  const findProduct = id => products.find(p => p.id === id);
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const demoAttrs = `data-demo${MODO_DEMONSTRACAO ? '' : ' hidden'}`;
  const mark = MODO_DEMONSTRACAO ? '*' : '';
  const pixTotal = value => round(value * (1 - store.pixDiscount));
  const installmentText = value => `ou ${store.installments}x de ${money(value / store.installments)} sem juros${mark}`;
  const kitBadge = () => `${Math.round(store.kitDiscount * 100)}% OFF${mark}`;
  const categoryUrl = category => '#/produtos?' + new URLSearchParams({categoria:category}).toString();
  const objectiveUrl = id => '#/produtos?' + new URLSearchParams({objetivo:id}).toString();
  const main = $('#conteudo');
  const homeHTML = main.innerHTML; // Preserva as alterações que você fizer na home do index.html.
  const cartDialog = $('#cart-dialog');
  let cart = [];
  let appliedCoupon = false;
  let couponMessage = '';
  let activeProduct = null;
  let heroIndex = 0;
  let heroPaused = false;
  let heroTimer = null;
  let catalogState = {format:'Todos',sort:'destaques',budget:500};
  let toastTimer;
  let announcementIndex = 0;
  const modalOrigins = new Map();
  try {
    const saved = JSON.parse(localStorage.getItem('ativo-html-cart') || '[]');
    if (Array.isArray(saved)) cart = saved.filter(x => x && typeof x.id === 'string' && Number.isInteger(x.qty) && x.qty > 0 && x.qty <= 99 && findProduct(x.id)?.price !== null && findProduct(x.id));
  } catch { /* O carrinho continua disponível caso o navegador bloqueie o armazenamento. */ }
  const icon = (type='arrow',size=20) => {
    const paths = {
      arrow:'<path d="M7 17 17 7M7 7h10v10"/>',leaf:'<path d="M20 4c-9-1-15 3-15 9 0 4 3 6 6 5 6-1 9-7 9-14Z"/><path d="m4 21 11-11"/>',
      bag:'<path d="M4 7h16l-1 14H5L4 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',package:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5M12 12v10M7 4l10 6"/>',
      heart:'<path d="M20 4a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-5 5 1 11 8 16 7-5 13-11 8-16Z"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
      chat:'<path d="M21 11a9 9 0 0 1-13 8l-5 2 1-5a9 9 0 1 1 17-5Z"/>',spark:'<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>',
      truck:'<path d="M2 5h12v12H2zM14 9h4l4 4v4h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
      close:'<path d="m6 6 12 12M6 18 18 6"/>',trash:'<path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type] || paths.arrow}</svg>`;
  };
  const visual = product => product.images.length
    ? `<div class="product-visual ${product.kit?'kit-visual':''}">${(product.kit?product.images:product.images.slice(0,1)).map((image,i)=>`<img src="${escape(image)}" alt="${escape(product.kit ? findProduct(product.components[i])?.name || product.name : product.name)}" loading="lazy" width="600" height="660">`).join('')}</div>`
    : `<div class="product-visual"><div class="upcoming-art">${icon('leaf',30)}<span>ATIVO<small>NUTRITION</small></span><strong>${escape(product.name)}</strong><small>Lançamento em preparação</small></div></div>`;
  const card = p => {
    const price = p.price === null ? '<strong class="coming-price">Novidades a caminho</strong>' : `${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}<strong>${money(p.price)}</strong><small>${money(pixTotal(p.price))} no Pix${mark}</small><small>${installmentText(p.price)}</small>`;
    return `<article class="product-card"><div class="card-link" data-card-url="#/produto/${escape(p.slug)}"><div class="product-top"><span>${escape(p.category)}</span>${p.kit?`<span class="discount">${kitBadge()}</span>`:p.status==='em-breve'?'<span class="coming">Em breve</span>':''}</div>${visual(p)}<div class="product-info"><p class="quantity">${icon('package',13)}${escape(p.quantity)}</p><h3><a href="#/produto/${escape(p.slug)}">${escape(p.name)}</a></h3><p class="product-desc">${escape(p.description)}</p><div class="price-area">${price}</div><button type="button" class="btn ${p.price===null?'btn-outline':''}" style="pointer-events:auto" ${p.price===null?`data-card-view="${escape(p.slug)}"`:`data-card-add="${escape(p.id)}"`}>${p.price===null?'Ver novidade':'Escolher'}${icon('arrow',17)}</button></div></div></article>`;
  };
  const heading = (title,to='#/produtos',eyebrow='ATIVO NUTRITION') => `<div class="section-heading"><div><p class="eyebrow">${escape(eyebrow)}</p><h2>${escape(title)}</h2></div><a href="${to}" class="text-link">Ver todos${icon('arrow',18)}</a></div>`;
  const quantity = (qty, id='pdp') => `<div class="quantity-control"><button data-qty="-1" data-id="${escape(id)}" aria-label="Diminuir quantidade" ${qty<=1?'disabled':''}>−</button><span data-quantity="${escape(id)}" aria-live="polite">${qty}</span><button data-qty="1" data-id="${escape(id)}" aria-label="Aumentar quantidade" ${qty>=99?'disabled':''}>+</button></div>`;
  const articleCards = () => `<div class="blog-grid">${articles.map((a,i)=>`<a href="#/blog/${escape(a.slug)}" class="blog-card"><div class="editorial-art ${escape(a.color)}"><span class="article-number">0${i+1}</span>${icon(['leaf','heart','package'][i],72)}<span>DIÁRIO ATIVO</span></div><div><span class="eyebrow">${escape(a.category)} <small>• ${escape(a.time)}</small></span><h3>${escape(a.title)}</h3><span class="text-link">Continuar lendo${icon('arrow',17)}</span></div></a>`).join('')}</div>`;
  function setTitle(title, description='Conheça a linha de suplementos Ativo Nutrition.') {
    document.title = `${title} | Ativo Nutrition`;
    $('meta[name="description"]').setAttribute('content', description);
    $('meta[property="og:title"]')?.setAttribute('content', document.title);
    $('meta[property="og:description"]')?.setAttribute('content', description);
    updateSeo(activeProduct);
  }
  function saveCart() {
    try { localStorage.setItem('ativo-html-cart',JSON.stringify(cart)); } catch {}
    const count = cart.reduce((sum,x)=>sum+x.qty,0);
    $('#cart-count').textContent = count;
    $('[data-action="open-cart"]').setAttribute('aria-label', `Abrir carrinho com ${count} itens`);
  }
  function addCart(id, qty=1, showDrawer=true) {
    const p = findProduct(id);
    if (!p || p.price === null || !Number.isInteger(qty) || qty < 1 || qty > 99) return;
    const existing = cart.find(x=>x.id===id);
    if(existing)existing.qty=Math.min(99,existing.qty+qty);else cart.push({id,qty});
    saveCart();if(showDrawer)openCart();else if(cartDialog.open)renderCart();
  }
  function renderCart() {
    const count=cart.reduce((sum,x)=>sum+x.qty,0);
    const subtotal=cart.reduce((sum,x)=>sum+findProduct(x.id).price*x.qty,0);
    const discount=appliedCoupon?round(subtotal*store.coupon.discount):0;
    const total=round(subtotal-discount);
    const totalPix = pixTotal(store.couponStacksWithPix || !appliedCoupon ? total : subtotal);
    $('#cart-title').textContent=`Sua seleção (${count})`;
    if(!cart.length){$('#cart-body').innerHTML=`<div class="empty">${icon('bag',40)}<h3>Sua próxima escolha começa aqui.</h3><p>Explore a linha e selecione seus produtos.</p><button class="btn" data-action="close-cart">Continuar explorando</button></div>`;return;}
    const summary=`Olá! Quero finalizar minha seleção Ativo Nutrition:\n${cart.map(x=>`${x.qty}x ${findProduct(x.id).name} — unitário ${money(findProduct(x.id).price)} — subtotal ${money(findProduct(x.id).price*x.qty)}`).join('\n')}\nSubtotal: ${money(subtotal)}${appliedCoupon?'\nCupom: '+store.coupon.code+' — desconto '+money(discount):''}\nTotal: ${money(total)}\nTotal no Pix: ${money(totalPix)}${appliedCoupon&&!store.couponStacksWithPix?' (desconto Pix alternativo ao cupom)':''}\nFrete: a confirmar\n\nNome: [informe seu nome]\nCEP: [informe seu CEP]${MODO_DEMONSTRACAO?'\n\nValores de demonstração; confirme os preços antes de pagar.':''}`;
    $('#cart-body').innerHTML=`<div class="cart-items">${cart.map(x=>{const p=findProduct(x.id);return `<div class="cart-item">${visual(p)}<div><a href="#/produto/${escape(p.slug)}" data-action="cart-link">${escape(p.name)}</a><strong>${money(p.price*x.qty)}</strong>${quantity(x.qty,x.id)}</div><button class="icon-button" data-remove="${escape(x.id)}" aria-label="Remover ${escape(p.name)}">${icon('trash',17)}</button></div>`}).join('')}</div>${store.freeShippingFrom!==null?`<div class="free-progress"><p>${subtotal>=store.freeShippingFrom?'Meta de frete grátis atingida.':`Faltam ${money(store.freeShippingFrom-subtotal)} para frete grátis.`}</p><progress value="${subtotal}" max="${store.freeShippingFrom}"></progress></div>`:''}<form class="coupon" id="coupon-form"><input name="coupon" aria-label="Cupom de desconto" placeholder="Cupom de desconto" value="${appliedCoupon?escape(store.coupon.code):''}"><button>Aplicar</button></form><p class="small-note" role="status">${escape(couponMessage)}</p><div class="cart-summary"><div><span>Subtotal</span><span>${money(subtotal)}</span></div>${appliedCoupon?`<div><span>Desconto</span><span>− ${money(discount)}</span></div>`:''}<div><span>Frete</span><span>A consultar</span></div><div class="total"><strong>Total</strong><strong>${money(total)}</strong></div><div><span>Total no Pix${appliedCoupon&&!store.couponStacksWithPix?' (alternativo ao cupom)':''}</span><span>${money(totalPix)}</span></div><a class="btn" href="${contact(summary)}" target="_blank" rel="noopener noreferrer">Finalizar pelo WhatsApp${icon('arrow',18)}</a><p class="small-note">A seleção será enviada para consulta. O pedido e o pagamento são confirmados com o atendimento.</p></div><div class="cart-upsell"><h3>Conheça também</h3>${products.filter(p=>p.featured&&!cart.some(x=>x.id===p.id)).slice(0,2).map(p=>`<button data-add="${escape(p.id)}"><img src="${escape(p.images[0])}" alt="" width="50" height="55"><span>${escape(p.name)}<small>${money(p.price)}</small></span>+</button>`).join('')}</div>`;
    if(cartDialog.open&&!cartDialog.contains(document.activeElement))focusables(cartDialog)[0]?.focus();
  }
  function showModal(dialog, origin = document.activeElement) {
    if(dialog.open)return;
    modalOrigins.set(dialog,origin);
    dialog.showModal();
    document.body.style.overflow='hidden';
    $('#whatsapp-float').hidden=true;
    (focusables(dialog)[0] || dialog).focus();
  }
  function closeModal(dialog) {
    if(dialog.open)dialog.close();
    const origin=modalOrigins.get(dialog);modalOrigins.delete(dialog);
    const another=$('dialog[open]');
    document.body.style.overflow=another?'hidden':'';$('#whatsapp-float').hidden=!!another;
    if(origin?.isConnected&&origin!==document.body)origin.focus({preventScroll:true});else main.focus({preventScroll:true});
  }
  function focusables(dialog){return $$('button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]',dialog).filter(el=>!el.hidden&&!el.closest('[hidden]'));}
  function openCart(){renderCart();showModal(cartDialog);}
  function closeCart(){closeModal(cartDialog);}
  $$('dialog').forEach(dialog=>{
    dialog.addEventListener('cancel',e=>{e.preventDefault();closeModal(dialog);});
    dialog.addEventListener('click',e=>{if(e.target===dialog)closeModal(dialog);});
  });
  document.addEventListener('keydown',e=>{
    const dialog=$('dialog[open]');
    if(dialog&&e.key==='Escape'){e.preventDefault();closeModal(dialog);return;}
    if(dialog&&e.key==='Tab'){
      const items=focusables(dialog);const first=items[0],last=items[items.length-1];
      if(!first){e.preventDefault();dialog.focus();}
      else if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus();}
    }
    if(!dialog&&e.key==='Escape')closeDetails();
  });
  function closeDetails(except=null){$$('details.mega-menu').forEach(d=>{if(d!==except)d.open=false;});}
  function toast(message){
    const output=$('#selection-toast');clearTimeout(toastTimer);output.textContent=message;output.hidden=false;
    try{output.showPopover?.();}catch{}
    toastTimer=setTimeout(()=>{try{output.hidePopover?.();}catch{}output.hidden=true;},2200);
  }
  function renderCatalog(params) {
    const category=params.get('categoria')||'Todos';
    const q=params.get('q')||'';
    const objective=objectives.find(o=>o.id===params.get('objetivo'));
    main.innerHTML=`<section class="section container"><p class="breadcrumbs"><a href="#/">Início</a> / Produtos</p><div class="section-heading"><div><p class="eyebrow">ENCONTRE SUA ESCOLHA</p><h1>${escape(objective?.name || (category==='Todos'?'Seu próximo Ativo.':category))}</h1></div></div><div class="catalog-layout"><aside class="filters"><h3>${icon('search',18)}Filtrar produtos</h3><fieldset><legend>Por categoria</legend>${categories.map(c=>`<label><input type="radio" name="category" value="${escape(c)}" ${category===c?'checked':''}>${escape(c)}</label>`).join('')}</fieldset><fieldset><legend>Formato</legend><select id="format-filter" aria-label="Formato">${['Todos',...new Set(products.map(p=>p.format))].map(f=>`<option ${f===catalogState.format?'selected':''}>${f}</option>`).join('')}</select></fieldset><fieldset><legend id="budget-label">Preço até ${money(catalogState.budget)}</legend><input type="range" min="30" max="500" step="10" value="${catalogState.budget}" id="budget-filter" aria-label="Preço máximo"></fieldset><button class="text-link" data-action="clear-filters">Limpar filtros${icon('close',15)}</button></aside><div><div class="catalog-toolbar"><span id="catalog-count"></span><select id="sort-filter" aria-label="Ordenar produtos"><option value="destaques">Destaques</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="nome">Nome: A–Z</option></select></div><div class="filter-chips">${q?`<button data-clear="q">Busca: ${escape(q)}${icon('close',14)}</button>`:''}${category!=='Todos'?`<button data-clear="categoria">${escape(category)}${icon('close',14)}</button>`:''}${params.get('destaques')?'<button data-clear="destaques">Destaques ×</button>':''}${params.get('novidades')?'<button data-clear="novidades">Lançamentos ×</button>':''}${objective?`<button data-clear="objetivo">${escape(objective.name)} ×</button>`:''}</div><div class="catalog-grid" id="catalog-grid"></div></div></div><p class="small-note" ${demoAttrs}>Preços de demonstração. Confira as condições reais com o atendimento.</p></section>`;
    $('#sort-filter').value=catalogState.sort;
    updateCatalog(params);
    setTitle(objective?.name || (category==='Todos'?'Produtos':category));
  }
  function routeParts(){const raw=location.hash.startsWith('#/')?location.hash.slice(1):'/';const separator=raw.indexOf('?');return {path:separator<0?raw:raw.slice(0,separator),params:new URLSearchParams(separator<0?'':raw.slice(separator+1))};}
  function decodePath(value){try{return decodeURIComponent(value)}catch{return null}}
  function updateCatalog(params=routeParts().params){
    const category=params.get('categoria')||'Todos';const q=normalize(params.get('q'));const objective=params.get('objetivo');
    const filtered=products.filter(p=>(category==='Todos'||p.category===category)&&normalize([p.name,p.category,p.description].join(' ')).includes(q)&&(catalogState.format==='Todos'||p.format===catalogState.format)&&(p.price===null||p.price<=catalogState.budget)&&(!params.get('destaques')||p.featured)&&(!params.get('novidades')||p.status==='em-breve'||p.new)&&(!objective||(p.tags||[]).includes(objective)));
    filtered.sort((a,b)=>catalogState.sort==='menor'?(a.price??Infinity)-(b.price??Infinity):catalogState.sort==='maior'?(b.price??-Infinity)-(a.price??-Infinity):catalogState.sort==='nome'?a.name.localeCompare(b.name):Number(b.featured)-Number(a.featured));
    $('#catalog-count').textContent=`${filtered.length} produtos encontrados`;
    $('#catalog-grid').innerHTML=filtered.length?filtered.map(card).join(''):`<div class="empty">${icon('search',36)}<h3>Nenhum produto encontrado</h3><p>Tente outro nome ou limpe os filtros.</p><button class="btn" data-action="clear-filters">Ver todos os produtos</button></div>`;
    $('#budget-label').textContent=`Preço até ${money(catalogState.budget)}`;
  }
  function renderProduct(slug){
    const p=products.find(x=>x.slug===slug);if(!p){renderMissing();return;}activeProduct=p;
    const details=[['Sobre o produto',`${p.name}. ${p.description} `],['Como consumir','Siga a recomendação do rótulo atualizado. Não exceda a quantidade diária indicada. Em caso de dúvidas, procure orientação de um profissional de saúde.'],['Ingredientes e tabela nutricional','Solicite uma foto legível do rótulo atualizado ao atendimento para conferir ingredientes, porção, tabela nutricional e advertências. As fotos fornecidas não mostram o verso completo da embalagem.'],['Qualidade e documentos','Consulte o atendimento sobre os documentos disponíveis para este produto e seu lote.'],['Perguntas frequentes','Converse com um profissional de saúde antes de combinar suplementos. Solicite informações de embalagem, lote e validade antes de comprar.']];
    main.innerHTML=`<section class="container section"><p class="breadcrumbs"><a href="#/">Início</a> / <a href="#/produtos">Produtos</a> / ${escape(p.name)}</p><div class="pdp"><div><div class="pdp-image">${p.kit||!p.images.length?visual(p):`<img id="pdp-main-image" src="${escape(p.images[0])}" alt="${escape(p.name)}" width="600" height="660">`}</div>${!p.kit&&p.images.length>1?`<div class="thumbnails">${p.images.map((src,i)=>`<button data-image="${i}" aria-label="Ver apresentação ${i+1}" aria-pressed="${i===0}"><img src="${escape(src)}" alt="" width="80" height="88"></button>`).join('')}<p class="small-note">Fotos de duas versões de rótulo fornecidas. Confirme a versão disponível.</p></div>`:''}</div><div class="pdp-info"><p class="eyebrow">${escape(p.category)}</p><h1>${escape(p.name)}</h1><p>${escape(p.description)}</p><span class="pdp-quantity">${icon('package',16)}${escape(p.quantity)}</span>${p.price!==null?`${pdpPrice(p,1)}<p class="small-note" ${demoAttrs}>*Valores e condições ilustrativos. Confirme antes de comprar.</p><div class="buy-row">${quantity(1)}<button class="btn" data-action="choose-product">Escolher${icon('bag',18)}</button></div><a class="text-link" href="${contact('Olá! Quero informações sobre '+p.name+', '+p.quantity+'.')}" target="_blank" rel="noopener noreferrer">Tirar uma dúvida sobre este produto${icon('chat',16)}</a><div class="shipping-box">${icon('truck',22)}<div><strong>Consulte a entrega para sua região</strong><p>Prazo e valor confirmados pelo atendimento.</p></div></div><form class="shipping-form" id="shipping-form"><input name="cep" aria-label="CEP" inputmode="numeric" placeholder="Seu CEP" maxlength="9" required><button>Consultar</button></form><div id="shipping-result" role="status"></div>`:`<div class="launch-info">${icon('spark')}<h3>Em breve na linha Ativo.</h3><p>A apresentação e a disponibilidade serão confirmadas pela marca.</p><a class="btn" href="${contact('Olá! Quero saber sobre o lançamento '+p.name+'.')}" target="_blank" rel="noopener noreferrer">Quero saber mais${icon('arrow',18)}</a></div>`}</div></div><div class="product-details">${details.map(([title,text],i)=>`<details ${i===0?'open':''}><summary>${escape(title)}<span>+</span></summary><p>${escape(text)}${p.kit&&i===0?' Este kit reúne: '+p.components.map(id=>{const part=findProduct(id);return part?`<a class="text-link" href="#/produto/${escape(part.slug)}">${escape(part.name)}</a>`:''}).join(', ')+'.':''}</p></details>`).join('')}</div><section class="section">${heading('Combine suas escolhas')}<div class="related-grid">${products.filter(x=>x.id!==p.id&&x.status!=='em-breve'&&!x.kit).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)).slice(0,4).map(card).join('')}</div></section></section>`;
    setTitle(p.name,p.description);
  }
  const information=pages;
  function pdpPrice(product,qty){const total=round(product.price*qty);return `<div class="pdp-price" id="pdp-price">${product.oldPrice?`<del>${money(product.oldPrice*qty)}</del>`:''}<strong aria-label="Total para ${qty} unidade(s)">${money(total)}</strong><span>${money(pixTotal(total))} no Pix${mark}</span><small>${qty>1?'Total para '+qty+' unidades • ':''}${installmentText(total)}</small></div>`;}
  function renderInfo(path){const p=information[path];main.innerHTML=`<section class="section container narrow"><p class="eyebrow">ATIVO NUTRITION</p><h1>${escape(p.title)}</h1>${p.text.map(t=>`<p>${escape(t)}</p>`).join('')}${p.demoText?`<p ${demoAttrs}>${escape(p.demoText)}</p>`:''}<a class="btn" href="${contact('Olá! Gostaria de mais informações.')}" target="_blank" rel="noopener noreferrer">Fale com a Ativo${icon('chat',18)}</a></section>`;setTitle(p.title,p.text[0]);}
  function renderProfessionals(){main.innerHTML=`<section class="section container narrow"><p class="eyebrow">VAMOS CONVERSAR</p><h1>Mais Ativo na sua rotina profissional.</h1><p>Você é profissional da saúde, lojista ou creator? Apresente seu interesse à nossa equipe.</p><form class="contact-form" id="professionals-form"><label>Seu nome<input name="name" required autocomplete="name"></label><label>Seu perfil<select name="role"><option>Lojista</option><option>Profissional de saúde</option><option>Creator</option><option>Outro</option></select></label><label>Como podemos ajudar?<textarea name="message" rows="4" required></textarea></label><button class="btn">Continuar no WhatsApp${icon('arrow',18)}</button></form></section>`;setTitle('Profissionais e lojistas');}
  function renderTracking(){main.innerHTML=`<section class="section container narrow"><p class="eyebrow">ACOMPANHE SUA COMPRA</p><h1>Vamos consultar seu pedido?</h1><p>Informe o número do pedido para solicitar o código de rastreio ao atendimento.</p><form class="contact-form" id="tracking-form"><label>Número do pedido<input name="order" required></label><button class="btn">Consultar pelo WhatsApp${icon('truck',18)}</button></form></section>`;setTitle('Consultar pedido');}
  function renderBlog(slug){if(!slug){main.innerHTML=`<section class="section container">${heading('Diário Ativo','#/produtos','INFORMAÇÃO E ROTINA')}${articleCards()}</section>`;setTitle('Diário Ativo');return;}const a=articles.find(x=>x.slug===slug);if(!a){renderMissing();return;}main.innerHTML=`<section class="section container narrow"><a href="#/blog" class="text-link">← Diário Ativo</a><p class="eyebrow">${escape(a.category)} • ${escape(a.time)}</p><h1>${escape(a.title)}</h1>${a.body.map(t=>`<p>${escape(t)}</p>`).join('')}<a href="#/produtos" class="btn">Explore a linha${icon('arrow',18)}</a></section>`;setTitle(a.title,a.body[0]);}
  function renderMissing(){main.innerHTML='<section class="section container narrow"><h1>Página não encontrada.</h1><p>Continue explorando a linha Ativo Nutrition.</p><a class="btn" href="#/produtos">Ver produtos →</a></section>';setTitle('Página não encontrada');}
  let slides=[];
  function setupHero(){
    const firstTitle=$('#hero-title').innerHTML;const firstTag=$('#hero-tag').textContent;const firstDescription=$('#hero-description').textContent;const firstCTA=$('#hero-link span').textContent;
    slides=[{title:firstTitle,tag:firstTag,description:firstDescription,cta:firstCTA,link:'#/produtos',ids:['nac-600mg','creatina','triplo-magnesio'],color:'peach'},{title:'Pequenos hábitos.<br><em>Novas possibilidades.</em>',tag:'SUA ROTINA, SUA ESCOLHA',description:'Conheça nossa linha de vitaminas e minerais em cápsulas.',cta:'Conhecer a linha',link:categoryUrl('Vitaminas e minerais'),ids:['selenio-iodo','triplo-magnesio','coenzima-q10'],color:'sage'},{title:'Combinações para<br><em>o seu dia a dia.</em>',tag:'SELEÇÕES ATIVO',description:'Explore os kits e encontre a seleção que faz sentido para você.',cta:'Explorar os kits',link:categoryUrl('Kits'),ids:['beauty-complex','nac-600mg','detox-complex'],color:'lilac'}];
    heroIndex=0;showSlide(0);heroPaused=matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#hero').addEventListener('mouseenter',()=>heroPaused=true);
    $('#hero').addEventListener('focusin',()=>{heroPaused=true;const b=$('[data-action="pause-hero"]');b.textContent='▶';b.setAttribute('aria-label','Reproduzir carrossel');});
    $('#hero').addEventListener('mouseleave',()=>{ /* Use o botão de reprodução para retomar. */ });
    heroTimer=setInterval(()=>{if(!heroPaused&&$('#hero'))showSlide(heroIndex+1)},6000);
    $$('[data-brand-social]').forEach(a=>{if(INSTAGRAM_URL)a.href=INSTAGRAM_URL;});
  }
  function showSlide(i){heroIndex=(i+slides.length)%slides.length;const s=slides[heroIndex];$('#hero').className=`hero ${s.color}`;$('#hero-title').innerHTML=s.title;$('#hero-tag').textContent=s.tag;$('#hero-description').textContent=s.description;$('#hero-link').href=s.link;$('#hero-link span').textContent=s.cta;$$('.pedestal img').forEach((img,j)=>{const p=findProduct(s.ids[j]);if(p?.images[0]){img.src=p.images[0];img.alt=p.name;}if(j===0){img.setAttribute('fetchpriority','high');img.removeAttribute('loading');}else{img.setAttribute('loading','lazy');img.removeAttribute('fetchpriority');}});$$('[data-slide]').forEach(b=>{const active=Number(b.dataset.slide)===heroIndex;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
  function route(initial=false){
    if(location.hash && !location.hash.startsWith('#/'))return;
    clearInterval(heroTimer);activeProduct=null;
    const {path,params}=routeParts();
    if(path==='/'){if(!initial)main.innerHTML=homeHTML;$$('[data-products]',main).forEach(track=>{track.innerHTML=products.filter(p=>track.dataset.products==='kits'?p.kit:p.featured&&!p.kit).map(card).join('');});setupHero();setTitle('Sua evolução começa aqui');}
    else if(path==='/produtos')renderCatalog(params);
    else if(path.startsWith('/produto/'))renderProduct(decodePath(path.slice(9)));
    else if(information[path])renderInfo(path);
    else if(path==='/profissionais')renderProfessionals();
    else if(path==='/rastrear')renderTracking();
    else if(path==='/blog')renderBlog();
    else if(path.startsWith('/blog/'))renderBlog(decodePath(path.slice(6)));
    else renderMissing();
    $('#main-nav').classList.remove('is-open');$('[data-action="mobile-menu"]').setAttribute('aria-expanded','false');$$('details.mega-menu').forEach(d=>d.open=false);
    setupMenus();applyDemoMode();setupCarousels();if(!initial){if(cartDialog.open)closeCart();if($('#coupon-dialog').open)closeModal($('#coupon-dialog'));window.scrollTo(0,0);main.focus({preventScroll:true});}
  }
  document.addEventListener('click',e=>{
    closeDetails(e.target.closest('details.mega-menu'));
    const target=e.target.closest('button,a');
    if(!target){const box=e.target.closest('[data-card-url]');if(box)location.hash=box.dataset.cardUrl.slice(1);return;}
    if(target.dataset.cardAdd){e.preventDefault();addCart(target.dataset.cardAdd,1,false);toast('Adicionado à sua seleção');return;}
    if(target.dataset.cardView){e.preventDefault();location.hash='/produto/'+target.dataset.cardView;return;}
    const action=target.dataset.action;
    if(action==='open-cart')openCart();
    else if(action==='close-cart'||action==='cart-link')closeCart();
    else if(action==='mobile-menu'){const expanded=$('#main-nav').classList.toggle('is-open');target.setAttribute('aria-expanded',String(expanded));}
    else if(action==='choose-product')addCart(activeProduct.id,Number($('[data-quantity="pdp"]').textContent));
    else if(action==='announcement')showAnnouncement(announcementIndex+Number(target.dataset.step || 1));
    else if(action==='next-hero')showSlide(heroIndex+1);
    else if(action==='prev-hero')showSlide(heroIndex-1);
    else if(action==='pause-hero'){heroPaused=!heroPaused;target.textContent=heroPaused?'▶':'Ⅱ';target.setAttribute('aria-label',heroPaused?'Reproduzir carrossel':'Pausar carrossel');}
    else if(action==='clear-filters'){catalogState={format:'Todos',sort:'destaques',budget:500};if(location.hash==='#/produtos')renderCatalog(new URLSearchParams());else location.hash='/produtos';}
    else if(action==='close-coupon')closeModal($('#coupon-dialog'));
    if(target.dataset.slide!==undefined)showSlide(Number(target.dataset.slide));
    if(target.dataset.carousel){const viewport=$('.carousel-viewport',target.closest('.carousel'));viewport.scrollBy({left:viewport.clientWidth*.8*Number(target.dataset.carousel),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
    if(target.dataset.qty){const id=target.dataset.id;if(id==='pdp'){const span=$('[data-quantity="pdp"]');const qty=Math.max(1,Math.min(99,Number(span.textContent)+Number(target.dataset.qty)));span.closest('.quantity-control').outerHTML=quantity(qty);$('#pdp-price').outerHTML=pdpPrice(activeProduct,qty);}else{const item=cart.find(x=>x.id===id);if(item){item.qty=Math.max(1,Math.min(99,item.qty+Number(target.dataset.qty)));saveCart();renderCart();}}}
    if(target.dataset.remove){cart=cart.filter(x=>x.id!==target.dataset.remove);saveCart();renderCart();}
    if(target.dataset.add)addCart(target.dataset.add);
    if(target.dataset.image!==undefined){const i=Number(target.dataset.image);$('#pdp-main-image').src=activeProduct.images[i];$$('[data-image]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.image)===i)));}
    if(target.dataset.clear){const params=routeParts().params;params.delete(target.dataset.clear);location.hash='/produtos'+(params.size?'?'+params.toString():'');}
  });
  document.addEventListener('change',e=>{
    if(e.target.name==='category'){const params=routeParts().params;if(e.target.value==='Todos')params.delete('categoria');else params.set('categoria',e.target.value);location.hash='/produtos'+(params.size?'?'+params.toString():'');}
    if(e.target.id==='format-filter'){catalogState.format=e.target.value;updateCatalog();}
    if(e.target.id==='sort-filter'){catalogState.sort=e.target.value;updateCatalog();}
  });
  document.addEventListener('input',e=>{if(e.target.id==='budget-filter'){catalogState.budget=Number(e.target.value);updateCatalog();}});
  document.addEventListener('submit',e=>{
    const form=e.target;if(!['search-form','coupon-form','shipping-form','newsletter-form','professionals-form','tracking-form'].includes(form.id))return;e.preventDefault();
    if(form.id==='search-form'){location.hash='/produtos?q='+encodeURIComponent($('#search-input').value.trim());return;}
    if(form.id==='coupon-form'){appliedCoupon=store.coupon.enabled&&form.elements.coupon.value.trim().toUpperCase()===store.coupon.code;couponMessage=appliedCoupon?(MODO_DEMONSTRACAO?'Cupom aplicado aos valores de demonstração.':'Cupom aplicado.'): 'Cupom não encontrado.';renderCart();return;}
    if(form.id==='shipping-form'){const cep=form.elements.cep.value.replace(/\D/g,'');const qty=Number($('[data-quantity="pdp"]').textContent);$('#shipping-result').innerHTML=cep.length===8?`<p class="small-note">CEP válido. Solicite a cotação pelo WhatsApp.</p><a class="text-link" href="${contact(`Olá! Pode cotar frete para ${activeProduct.name}, ${qty} unidade(s), CEP ${cep}?`)}" target="_blank" rel="noopener noreferrer">Solicitar cotação${icon('arrow',15)}</a>`:'<p class="small-note">Informe um CEP com 8 números.</p>';return;}
    let message='';
    if(form.id==='newsletter-form'){if(!form.checkValidity())return;message=`Quero receber novidades, meu e-mail é ${form.elements.email.value}`;}
    if(form.id==='professionals-form')message=`Olá! Sou ${form.elements.name.value}, ${form.elements.role.value}. ${form.elements.message.value}`;
    if(form.id==='tracking-form')message=`Olá! Quero consultar o pedido ${form.elements.order.value}. Podem informar o rastreio?`;
    window.open(contact(message),'_blank','noopener,noreferrer');
  });
  function applyDemoMode(){ $$('[data-demo]').forEach(el=>el.hidden=!MODO_DEMONSTRACAO); }
  function setupMenus(){
    $('[data-menu="categories"]').innerHTML=categories.filter(c=>c!=='Todos').map(c=>`<a href="${categoryUrl(c)}">${escape(c)}</a>`).join('');
    $('[data-menu="objectives"]').innerHTML=objectives.map(o=>`<a href="${objectiveUrl(o.id)}">${escape(o.name)}</a>`).join('');
    // Normaliza também os links escritos no HTML, inclusive os tiles existentes.
    $$('a[href^="#/produtos?"]').forEach(a=>{const params=new URLSearchParams(a.getAttribute('href').split('?').slice(1).join('?'));a.setAttribute('href','#/produtos?'+params.toString());});
  }
  function showAnnouncement(index){
    const messages=(store.announcementMessages || ['Sua evolução começa aqui.','Conheça nossa linha.','Fale com nosso atendimento.']).map(t=>t.replace('{pix}',String(store.pixDiscount*100)).replace('{parcelas}',String(store.installments)));
    if(MODO_DEMONSTRACAO)messages.unshift('Loja de demonstração • Valores ilustrativos');
    announcementIndex=(index+messages.length)%messages.length;$('#announcement-text').textContent=messages[announcementIndex];
  }
  function setupCarousels(){
    $$('.carousel').forEach(carousel=>{
      const viewport=$('.carousel-viewport',carousel),prev=$('[data-carousel="-1"]',carousel),next=$('[data-carousel="1"]',carousel);
      const update=()=>{const max=Math.max(0,viewport.scrollWidth-viewport.clientWidth);prev.disabled=viewport.scrollLeft<=1;next.disabled=viewport.scrollLeft>=max-1;};
      viewport.addEventListener('scroll',update,{passive:true});viewport.addEventListener('load',update,true);
      // O overflow existente já oferece arraste nativo por toque. Mouse/pen recebem arraste adicional.
      let start=null,moved=false;
      viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0||e.target.closest('button'))return;start={x:e.clientX,scroll:viewport.scrollLeft};moved=false;});
      viewport.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x;if(Math.abs(dx)>6)moved=true;if(moved){e.preventDefault();viewport.scrollLeft=start.scroll-dx;update();}});
      const stop=()=>start=null;viewport.addEventListener('pointerup',stop);viewport.addEventListener('pointercancel',stop);viewport.addEventListener('pointerleave',stop);
      viewport.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
      update();
    });
  }
  window.addEventListener('resize',()=>$$('.carousel-viewport').forEach(v=>v.dispatchEvent(new Event('scroll'))));
  function assetUrl(path){const base=store.siteUrl || location.href.split('#')[0];try{return new URL(path,base).href}catch{return path}}
  function updateSeo(product){
    const base=store.siteUrl?store.siteUrl.replace(/\/$/,'')+'/':'';
    const organization={'@context':'https://schema.org','@type':'Organization',name:store.name,logo:assetUrl(store.logo),contactPoint:{'@type':'ContactPoint',telephone:'+'+store.whatsapp,contactType:'customer service',availableLanguage:'Portuguese'}};
    if(base)organization.url=base;if(INSTAGRAM_URL)organization.sameAs=[INSTAGRAM_URL];
    $('#organization-schema').textContent=JSON.stringify(organization);
    const data=product?{'@context':'https://schema.org','@type':'Product',name:product.name,description:product.description,sku:product.id,category:product.category,brand:{'@type':'Brand',name:store.name},image:product.images.map(assetUrl)}:null;
    // Preços fictícios e disponibilidade apenas sob consulta não viram ofertas públicas.
    if(data&&product.status==='disponivel'&&Number.isFinite(product.price)&&!MODO_DEMONSTRACAO){data.offers={'@type':'Offer',priceCurrency:'BRL',price:product.price,availability:'https://schema.org/InStock'};if(base)data.offers.url=base+'#/produto/'+encodeURIComponent(product.slug);}
    $('#product-schema').textContent=data?JSON.stringify(data):'{}';
    $('meta[property="og:image"]').setAttribute('content',assetUrl(product?.images[0] || store.socialImage));
    $('meta[property="og:type"]').setAttribute('content',product?'product':'website');
  }
  window.addEventListener('hashchange',()=>route());
  $$('a[href^="https://wa.me/"]').forEach(a=>{a.href=a.href.replace(/wa\.me\/\d+/,`wa.me/${store.whatsapp}`);});
  $('#year').textContent=new Date().getFullYear();$('#whatsapp-float').href=contact('Olá, Ativo Nutrition!');
  $('#popup-code').textContent=store.coupon.code;$('#popup-description').textContent=MODO_DEMONSTRACAO?`${store.coupon.discount*100}% nos valores ilustrativos. Condições reais a confirmar.`:`${store.coupon.discount*100}% de desconto. Consulte condições.`;
  let popupSeen=false;try{popupSeen=!!localStorage.getItem('ativo-html-popup-seen')}catch{}
  document.addEventListener('mouseleave',e=>{if(e.clientY<=0&&!popupSeen&&store.coupon.enabled&&!cartDialog.open){popupSeen=true;try{localStorage.setItem('ativo-html-popup-seen','1')}catch{}showModal($('#coupon-dialog'));}});
  if(store.campaignEnd){const update=()=>{const left=new Date(store.campaignEnd).getTime()-Date.now();const el=$('#campaign-countdown');el.hidden=!(left>0);if(left>0)el.textContent=[Math.floor(left/3600000),Math.floor(left/60000)%60,Math.floor(left/1000)%60].map(n=>String(n).padStart(2,'0')).join(':');};update();setInterval(update,1000);}
  setupMenus();showAnnouncement(0);setInterval(()=>showAnnouncement(announcementIndex+1),7000);
  saveCart();route(true);
  // Integração opcional com agentes, sem envio de pedido ou pagamento.
  const context=document.modelContext;
  if(context?.registerTool){const lifecycle=new AbortController();const tools=[{name:'read_ativo_catalog',description:'Consulta produtos, preços ilustrativos e disponibilidade deste catálogo.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>products.map(p=>({id:p.id,name:p.name,price:p.price,status:p.status}))},{name:'read_ativo_cart',description:'Lê a seleção local. Nenhum pedido é enviado.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({items:cart.map(x=>({...x})),subtotal:cart.reduce((s,x)=>s+findProduct(x.id).price*x.qty,0)})},{name:'stage_ativo_cart_item',description:'Prepara um item no carrinho local visível. Não envia pedidos nem processa pagamentos.',inputSchema:{type:'object',properties:{id:{type:'string'},quantity:{type:'integer',minimum:1,maximum:99}},required:['id','quantity'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||typeof input.id!=='string'||!Number.isInteger(input.quantity)||input.quantity<1||input.quantity>99||!findProduct(input.id)||findProduct(input.id).price===null)throw new Error('Produto ou quantidade inválidos.');addCart(input.id,input.quantity);return{items:cart.map(x=>({...x})),status:'staged'};}}];for(const tool of tools){try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
})();
