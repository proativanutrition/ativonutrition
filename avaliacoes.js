/* Avaliações de clientes (Mercado Livre e Shopee).
   Os dados ficam em avaliacoes/avaliacoes.json. Para esconder uma avaliação, adicione "oculto": true nela.
   Qualquer elemento com o atributo data-avaliacoes vira a seção "Avaliações de clientes". */
(() => {
  "use strict";
  const DATA_URL = "avaliacoes/avaliacoes.json";
  const PAGE = 12;
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = n => String(n).replace(".", ",");
  const stars = n => `<span class="rv-stars" role="img" aria-label="Nota ${n} de 5">${"★".repeat(n)}<span>${"★".repeat(5 - n)}</span></span>`;
  const mes = d => { const [y, m] = String(d || "").split("-"); return m ? `${MESES[+m - 1]} de ${y}` : ""; };
  const media = r => (r.fotos || []).length + (r.videos || []).length;
  const srcClass = o => /shopee/i.test(o) ? "rv-src--shopee" : "rv-src--ml";
  let dataPromise;
  const load = () => dataPromise ||= fetch(DATA_URL, { cache: "no-cache" }).then(r => r.ok ? r.json() : null).catch(() => null);

  function relevantes(list) {
    return [...list].sort((a, b) => (media(b) > 0) - (media(a) > 0) || b.nota - a.nota || ((b.texto || "").length > 20) - ((a.texto || "").length > 20) || String(b.data).localeCompare(String(a.data)));
  }

  function card(r, i) {
    const thumbs = [
      ...(r.videos || []).map((v, k) => `<button type="button" class="rv-thumb rv-thumb--video" data-rv-open="${i}" data-rv-idx="${k}" aria-label="Ver vídeo do cliente"><img src="${esc(v.poster)}" alt="" loading="lazy" width="96" height="96"><span aria-hidden="true">▶</span></button>`),
      ...(r.fotos || []).map((f, k) => `<button type="button" class="rv-thumb" data-rv-open="${i}" data-rv-idx="${(r.videos || []).length + k}" aria-label="Ver foto do cliente"><img src="${esc(f)}" alt="Foto enviada pelo cliente" loading="lazy" width="96" height="96"></button>`)
    ].join("");
    return `<article class="rv-card">
      <div class="rv-card-top">${stars(r.nota)}<span class="rv-src ${srcClass(r.origem)}">${esc(r.origem)}</span></div>
      ${r.texto ? `<p class="rv-text">${esc(r.texto).replace(/\n/g, "<br>")}</p>` : ""}
      ${thumbs ? `<div class="rv-thumbs">${thumbs}</div>` : ""}
      <p class="rv-meta">Avaliação feita no ${esc(r.origem)}${r.data ? ` · ${mes(r.data)}` : ""}${r.anuncio ? ` · Comprou: ${esc(r.anuncio)}` : ""}</p>
    </article>`;
  }

  function render(el, data) {
    const all = relevantes((data.avaliacoes || []).filter(r => !r.oculto));
    if (!all.length) { el.hidden = true; return; }
    const origens = [...new Set(all.map(r => r.origem))];
    const filtros = [["todas", `Todas (${all.length})`], ["midia", `Com foto ou vídeo (${all.filter(r => media(r)).length})`], ...origens.map(o => [o, `${o} (${all.filter(r => r.origem === o).length})`])];
    const resumo = (data.resumo || []).map(s => `<a class="rv-sum" href="${esc(s.url)}" target="_blank" rel="noopener nofollow">
        <strong>${num(s.nota)}</strong>${stars(Math.round(s.nota))}<span>${s.total} avaliações no ${esc(s.origem)}</span></a>`).join("");
    el.classList.add("rv");
    el.innerHTML = `<div class="rv-head">
        <div><p class="eyebrow">Quem comprou, aprovou</p><h2>Avaliações de clientes</h2></div>
        <div class="rv-sums">${resumo}</div>
      </div>
      <div class="rv-filters" role="group" aria-label="Filtrar avaliações">${filtros.map(([k, t], n) => `<button type="button" data-rv-filter="${esc(k)}" aria-pressed="${n === 0}">${esc(t)}</button>`).join("")}
        <label class="rv-order">Ordenar <select data-rv-order><option value="rel">Mais relevantes</option><option value="rec">Mais recentes</option></select></label></div>
      <div class="rv-grid"></div>
      <button type="button" class="btn rv-more" data-rv-more>Ver mais avaliações</button>
      <p class="small-note rv-note">Avaliações reais de compradores, reproduzidas das nossas lojas no ${origens.join(" e ")}. Fotos e vídeos enviados pelos próprios clientes. Os resultados podem variar de pessoa para pessoa.</p>
      <dialog class="rv-modal"><button type="button" class="rv-close" data-rv-close aria-label="Fechar">×</button><div class="rv-modal-body"></div>
        <div class="rv-nav"><button type="button" data-rv-step="-1" aria-label="Anterior">‹</button><button type="button" data-rv-step="1" aria-label="Próxima">›</button></div></dialog>`;
    const grid = el.querySelector(".rv-grid"), more = el.querySelector("[data-rv-more]"), modal = el.querySelector(".rv-modal"), body = el.querySelector(".rv-modal-body");
    let filtro = "todas", ordem = "rel", shown = PAGE, lista = all, aberto = null;
    const draw = () => {
      lista = all.filter(r => filtro === "todas" || (filtro === "midia" ? media(r) : r.origem === filtro));
      if (ordem === "rec") lista = [...lista].sort((a, b) => String(b.data).localeCompare(String(a.data)));
      grid.innerHTML = lista.slice(0, shown).map(card).join("");
      more.hidden = shown >= lista.length;
    };
    const itens = r => [...(r.videos || []).map(v => ({ v })), ...(r.fotos || []).map(f => ({ f }))];
    const show = (i, k) => {
      const r = lista[i], its = itens(r); k = (k + its.length) % its.length; aberto = [i, k];
      const it = its[k];
      body.innerHTML = (it.v ? `<video src="${esc(it.v.src)}" poster="${esc(it.v.poster)}" controls autoplay playsinline></video>` : `<img src="${esc(it.f)}" alt="Foto enviada pelo cliente">`)
        + `<div class="rv-modal-info">${stars(r.nota)} <span class="rv-src ${srcClass(r.origem)}">${esc(r.origem)}</span>${r.texto ? `<p>${esc(r.texto).replace(/\n/g, "<br>")}</p>` : ""}</div>`;
      el.querySelector(".rv-nav").hidden = its.length < 2;
      if (!modal.open) modal.showModal();
    };
    el.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) { if (e.target === modal) modal.close(); return; }
      if (b.dataset.rvFilter) { filtro = b.dataset.rvFilter; shown = PAGE; el.querySelectorAll("[data-rv-filter]").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); }
      else if (b.hasAttribute("data-rv-more")) { shown += PAGE; draw(); }
      else if (b.dataset.rvOpen) show(+b.dataset.rvOpen, +b.dataset.rvIdx);
      else if (b.dataset.rvStep && aberto) show(aberto[0], aberto[1] + +b.dataset.rvStep);
      else if (b.hasAttribute("data-rv-close")) modal.close();
    });
    el.querySelector("[data-rv-order]").addEventListener("change", e => { ordem = e.target.value; shown = PAGE; draw(); });
    modal.addEventListener("close", () => { body.innerHTML = ""; aberto = null; });
    draw();
  }

  function scan() {
    document.querySelectorAll("[data-avaliacoes]:not([data-rv-ready])").forEach(el => {
      el.setAttribute("data-rv-ready", "");
      load().then(d => d ? render(el, d) : (el.hidden = true));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
