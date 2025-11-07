// Componentes reutilizables y utilidades
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
export const el = (t, c, txt) => { const n=document.createElement(t); if(c) n.className=c; if(txt!=null) n.textContent=txt; return n };

export function starRating(val){
  const full=Math.floor(val||0), half=(val-full)>=0.5 ? 1:0, empty=5-full-half;
  return '★'.repeat(full) + (half?'☆':'') + '✩'.repeat(empty);
}
export const fmtLikes = n => new Intl.NumberFormat('es-MX').format(n||0);
export const fmtWords = n => `${new Intl.NumberFormat('es-MX').format(n||0)} palabras`;

// Genera una portada desde web o fallback CSS
export function coverFor(item){
  const div=el('div','cover');
  if(item.cover){
    const img=new Image(); img.alt=`Portada de ${item.titulo}`; img.src=item.cover; img.loading='lazy';
    div.appendChild(img);
  } else {
    div.style.background = `linear-gradient(135deg, hsl(${(item.id*37)%360} 70% 65%), hsl(${(item.id*71)%360} 70% 45%))`;
    const span=el('span','',item.titulo.slice(0,1)); span.style.fontSize='64px'; span.style.fontWeight='900'; span.style.color='rgba(255,255,255,.9)';
    div.appendChild(span);
  }
  return div;
}

export function statBar(item){
  const bar=el('div','statbar');
  bar.innerHTML = `
    <span class="sp">❤ ${fmtLikes(item.likes||0)}</span>
    <span class="sp">⭐ ${Number(item.rating||0).toFixed(1)}</span>
    <span class="sp">🏷 ${item.tags?.slice(0,2).join(', ')||'—'}</span>
    <span class="sp">📝 ${fmtWords(item.words||0)}</span>
  `;
  return bar;
}

export function bookCard(item, onOpen){
  const c=el('div','card-book');
  c.appendChild(coverFor(item));
  const m=el('div','meta');
  m.appendChild(el('div','title',item.titulo));
  m.appendChild(el('div','author',item.autor));
  m.appendChild(statBar(item));
  c.appendChild(m);
  c.addEventListener('click',()=>onOpen(item));
  return c;
}

export function bookTile(item, onOpen){
  const t=el('div','tile');
  t.appendChild(coverFor(item));
  const m=el('div','meta');
  m.appendChild(el('div','title',item.titulo));
  m.appendChild(el('div','author',item.autor));
  m.appendChild(statBar(item));
  t.appendChild(m);
  const badges=el('div','badges');
  (item.tags||[]).slice(0,3).forEach(tag=>badges.appendChild(el('span','chip',tag)));
  t.appendChild(badges);
  t.addEventListener('click',()=>onOpen(item));
  return t;
}

export function injectHeader(root, app){
  const header = root.querySelector('header.top') || el('header','top');
  header.innerHTML = `
  <div class="nav container">
    <a class="brand" href="#home" data-nav="home"><img src="assets/img/logo.svg" alt="Logo"> Smintheia Nook</a>
    <div class="catmenu">
      <form class="searchbar" id="searchForm">
        <input id="q" placeholder="Busca por título, autor o etiqueta…" aria-label="Buscar">
        <button class="btn" type="submit">Buscar</button>
      </form>
      <button class="btn" id="catBtn">Categorías ▾</button>
      <div class="menu-panel" id="catPanel"><div class="badges" id="topCats"></div></div>
    </div>
    <div class="actions" id="headerActions"></div>
  </div>`;
  if(!root.querySelector('header.top')) root.prepend(header);
  // handlers
  header.querySelector('#catBtn').addEventListener('click',()=>{
    header.querySelector('#catPanel').classList.toggle('open');
  });
  header.querySelector('#searchForm').addEventListener('submit',(e)=>{e.preventDefault(); app.search();});
  return header;
}

export function injectFooter(root){
  const footer = root.querySelector('footer') || document.createElement('footer');
  footer.innerHTML = `
  <div class="container foot">
    <div>
      <div class="brand" style="color:#fff"><img src="assets/img/logo.svg" alt="Logo"> Smintheia Nook</div>
      <p class="sub">Un rincón para perderse entre historias. Hecho con amor morado.</p>
    </div>
    <div>
      <h4>Compañía</h4>
      <div class="sub"><a href="pages/legal/contacto.html">Contacto</a></div>
      <div class="sub"><a href="pages/legal/ayuda.html">Ayuda</a></div>
    </div>
    <div>
      <h4>Legal</h4>
      <div class="sub"><a href="pages/legal/terminos.html">Términos</a></div>
      <div class="sub"><a href="pages/legal/privacidad.html">Privacidad</a></div>
      <div class="sub"><a href="pages/legal/derechos-autor.html">Derechos de autor</a></div>
      <div class="sub"><a href="pages/legal/cookies.html">Cookies</a></div>
    </div>
    <div>
      <h4>Creadores</h4>
      <div class="sub"><button class="btn ghost" id="btnInfoCreador">Información para creadores</button></div>
      <div class="sub"><a href="#creador" data-nav="creador">Centro de pagos</a></div>
    </div>
  </div>
  <div class="copy">© 2025 Smintheia Nook</div>`;
  if(!root.querySelector('footer')) root.appendChild(footer);
  return footer;
}
