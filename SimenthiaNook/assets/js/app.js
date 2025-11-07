// Lógica principal de la app (SPA simple)
import { $, $$, el, bookCard, bookTile, injectHeader, injectFooter } from './components.js';

const storeKey = 'sn_settings_v1';
const userKey = 'sn_user_v1';

const settings = {
  dark: false,
  fontScale: 100,
  density: 'normal',
  ...JSON.parse(localStorage.getItem(storeKey)||'{}')
};

applySettings();

const app = {
  user: JSON.parse(localStorage.getItem(userKey)||'null'),
  current:'#home', currentStory:null, chapter:1, pendingCoins:0,
  catalogo:[
    {id:1,titulo:"Sombras en la Biblioteca",autor:"L. Ortega",tags:["Misterio","Suspenso"],rating:4.8,words:12000,likes:1540,cover:"https://source.unsplash.com/featured/400x600?library,shadow"},
    {id:2,titulo:"Jardín de Cometas",autor:"A. Vega",tags:["Romance","Drama"],rating:4.6,words:23000,likes:980,cover:"https://source.unsplash.com/featured/400x600?kite,garden"},
    {id:3,titulo:"Circuitos y Hechizos",autor:"K. Nova",tags:["Fantasía","Ciencia ficción"],rating:4.9,words:45000,likes:2120,cover:"https://source.unsplash.com/featured/400x600?magic,circuit"},
    {id:4,titulo:"Crónicas del Café Gris",autor:"M. Ruiz",tags:["Slice of life","Poesía"],rating:4.4,words:8000,likes:640,cover:"https://source.unsplash.com/featured/400x600?coffee,city"},
    {id:5,titulo:"El Archivo de los Gatos",autor:"I. Beltrán",tags:["Clásicos y hits","No ficción"],rating:4.7,words:5200,likes:1320,cover:"https://source.unsplash.com/featured/400x600?cat,archive"},
    {id:6,titulo:"La Ciudad que Cantaba",autor:"N. Sol",tags:["Young Adult","Novela"],rating:4.5,words:33000,likes:1710,cover:"https://source.unsplash.com/featured/400x600?city,music"}
  ],
  chips:["Terror","Misterio","Romance","Historias cortas","Fantasía","Ciencia ficción","Drama","Young adult","Novelas","Selección del autor","No ficción","Poesía","Clásicos y hits"],

  navigate(hash){
    const target = hash || location.hash || '#home';
    $$('[data-screen]').forEach(s=>s.classList.add('hidden'));
    const el = $(target) || $('#error');
    el.classList.remove('hidden');
    this.current=target; history.replaceState({},'',target);
    if(target==="#monedas") this.updateCoinsUI();
    if(target==="#favoritos") this.renderFavs();
    if(target==="#later") this.renderLater();
    if(target==="#perfil") this.renderProfile();
    if(target==="#creador") this.renderCreator();
    if(target==="#dashboard-autor") this.renderAuthorDashboard();
    this.renderHeader();
    if(target==="#home") window.scrollTo({top:0,behavior:'smooth'});
  },

  renderHeader(){
    const topC=$('#topCats'); if(topC && !topC.children.length){
      this.chips.slice(0,10).forEach(n=>{ const c=el('button','chip',n); c.addEventListener('click',()=>{this.navigate('#categorias'); toast('Filtrando: '+n)}); topC.appendChild(c) })
    }
    const box=$('#headerActions'); if(!box) return; box.innerHTML='';
    const catBtn=el('button','btn','Categorías'); catBtn.addEventListener('click',()=>this.navigate('#categorias')); box.appendChild(catBtn);

    if(this.logged()){
      const coin=el('span','coin',''); coin.innerHTML=`🪙 <span id="hdrCoins">${this.user.coins}</span>`; coin.addEventListener('click',()=>this.navigate('#monedas')); box.appendChild(coin);
      const menu=el('div','menu','');
      const trig=el('div','avatar',''); trig.innerHTML=`<span class="dot"></span> ${this.user.name}`; const panel=el('div','menu-panel','');
      const mk=(txt,href)=>{const a=document.createElement('a');a.href="#";a.textContent=txt;a.addEventListener('click',(e)=>{e.preventDefault();this.navigate(href)});return a};
      panel.appendChild(mk('❤ Mis favoritos','#favoritos'));
      panel.appendChild(mk('🕑 Leer más tarde','#later'));
  panel.appendChild(mk('🪙 Monedas','#monedas'));
  const cfg=document.createElement('a'); cfg.href="#"; cfg.textContent='⚙ Configuración'; cfg.addEventListener('click',(e)=>{e.preventDefault(); openSettings()}); panel.appendChild(cfg);
      if(this.user.isCreator){ panel.appendChild(mk('✍ Perfil de creador','#creador')); panel.appendChild(mk('💬 Responder comentarios','#dashboard-autor')) }
      const exit=document.createElement('a'); exit.href="#"; exit.textContent='Salir'; exit.addEventListener('click',(e)=>{e.preventDefault(); this.signOut()}); panel.appendChild(exit);
      trig.addEventListener('click',()=>panel.classList.toggle('open'));
      menu.appendChild(trig); menu.appendChild(panel); box.appendChild(menu);
      document.addEventListener('click',e=>{ if(!menu.contains(e.target)) panel.classList.remove('open') });
    } else {
      const login=el('button','btn purple','Iniciar sesión'); login.addEventListener('click',()=>this.navigate('#login')); box.appendChild(login);
      const reg=el('button','btn','Registrarse'); reg.addEventListener('click',()=>this.navigate('#registro')); box.appendChild(reg);
    }
  },

  logged(){ return !!this.user },

  mount(){
    // inyectar header / footer
    const header=injectHeader(document.body, this);
    injectFooter(document.body);
    // chips arriba del header
    const tc=$('#topCats'); if(tc){ this.chips.slice(0,10).forEach(n=>{ const c=el('button','chip',n); c.addEventListener('click',()=>{this.navigate('#categorias'); toast('Filtrando: '+n)}); tc.appendChild(c) }) }

    // carrousel home
    const carTrack=$('#carousel-populares');
    this.catalogo.forEach(x=>carTrack.appendChild(bookCard(x,(it)=>this.openStory(it))));
    setupCarousel('#carousel');

    // grids
    const hgrid=$('#homeGrid'); this.catalogo.concat(this.catalogo).forEach(x=>hgrid.appendChild(bookTile(x,(it)=>this.openStory(it))));
    const allChips=$('#allChips'); this.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>this.filter(n,'catGrid')); allChips.appendChild(b) });
    const cg=$('#catGrid'); this.catalogo.concat(this.catalogo).forEach(x=>cg.appendChild(bookTile(x,(it)=>this.openStory(it))));

    // ajustes iniciales UI
    applySettings();

    // listeners globales
    $('#btnInfoCreador')?.addEventListener('click',()=>openCreatorInfo());

    // go
    this.navigate(location.hash||'#home');
  },

  // Acciones
  search(){
    const q=($('#q')?.value||'').trim(); if(!q){toast('Escribe algo para buscar');return}
    $('#kword').textContent = `“${q}”`;
    const sg=$('#searchGrid'); sg.innerHTML='';
    this.catalogo.filter(x=>x.titulo.toLowerCase().includes(q.toLowerCase())).forEach(x=>sg.appendChild(bookTile(x,(it)=>this.openStory(it))));
    if(!sg.children.length){sg.innerHTML='<p class="sub">No encontramos resultados.</p>'}
    this.navigate('#busqueda');
  },
  runAdvancedSearch(){
    const t=($('#advTitle')?.value||'').toLowerCase();
    const a=($('#advAuthor')?.value||'').toLowerCase();
    const min=parseInt($('#advMin')?.value||'0',10);
    const max=parseInt($('#advMax')?.value||'999999',10);
    const cats=$$('#advCats .chip.active').map(b=>b.textContent);
    const out=$('#advResults'); out.innerHTML='';
    this.catalogo.filter(x=> (!t||x.titulo.toLowerCase().includes(t)) && (!a||x.autor.toLowerCase().includes(a)) && (x.words>=min && x.words<=max) && (cats.length? cats.some(c=>x.tags.includes(c)) : true)).forEach(x=>out.appendChild(bookTile(x,(it)=>this.openStory(it))));
    if(!out.children.length){out.innerHTML='<p class="sub">Sin coincidencias.</p>'}
  },

  // Historias
  openStory(x){
    this.currentStory=x; this.chapter=1;
    $('#storyTitle').textContent=x.titulo;
    $('#storyAuthor').textContent='por '+x.autor;
    const tagC=$('#storyTags'); tagC.innerHTML=''; (x.tags||[]).forEach(t=>tagC.appendChild(el('span','chip',t)));
    const ch=$('#chapters'); ch.innerHTML='';
    for(let i=1;i<=8;i++){ const b=el('button','chip', 'Capítulo '+i + (i>3?' 🔒':'')); b.addEventListener('click',()=>{this.chapter=i; this.openReader()}); ch.appendChild(b) }
    this.renderFavBtn();
    this.navigate('#historia');
  },
  renderFavBtn(){const f=$('#favBtn'); if(!this.logged()){f.textContent='❤ Agregar a favoritos';return} const fav=this.user.favorites.includes(this.currentStory.id); f.textContent=fav?'❤ En favoritos':'❤ Agregar a favoritos';},
  toggleFav(){ if(!this.logged()){toast('Inicia sesión para usar favoritos'); this.navigate('#login'); return} const id=this.currentStory.id; const has=this.user.favorites.includes(id); this.user.favorites = has? this.user.favorites.filter(x=>x!==id) : [...this.user.favorites,id]; this.persistUser(); this.renderFavBtn(); toast('Favoritos actualizado'); },
  saveForLater(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para guardar'); return } if(!this.user.later.includes(this.currentStory.id)) this.user.later.push(this.currentStory.id); this.persistUser(); toast('Guardado para leer después'); },

  // Lector
  openReader(){
    const paid=this.chapter>3; const unlocked=this.logged() && this.user.unlocked.includes(this.keyUC());
    $('#chapterHeading').textContent=`Capítulo ${this.chapter} · Título provisional`;
    if(paid && !unlocked){ $('#lockNotice').classList.remove('hidden'); $('#unlockBar').classList.remove('hidden'); }
    else{ $('#lockNotice').classList.add('hidden'); $('#unlockBar').classList.add('hidden'); $('#chapterText').textContent=`Capítulo ${this.chapter}: texto de muestra.` }
    this.renderComments();
    this.navigate('#lector');
  },
  prevChapter(){ this.chapter=Math.max(1,this.chapter-1); this.openReader() },
  nextChapter(){ this.chapter=Math.min(12,this.chapter+1); this.openReader() },
  keyUC(){ return `${this.currentStory?.id||0}-${this.chapter}` },
  unlockChapter(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para usar monedas'); return } if(this.user.coins<20){ this.navigate('#monedas'); toast('Te faltan monedas'); return } this.user.coins-=20; this.user.unlocked.push(this.keyUC()); this.updateCoinsUI(); toast('Capítulo desbloqueado'); this.persistUser(); this.openReader(); },

  // Comentarios + Respuestas del autor
  renderComments(){
    const list=$('#commentList'); const box=$('#commentBox'); const loginMsg=$('#loginToComment');
    const key=`${this.currentStory?.id||0}`; const arr=(this.user?.comments[key]||[]).filter(c=>c.chapter===this.chapter);
    list.innerHTML = arr.length? arr.map(c=>`<div style="margin:6px 0"><strong>${c.author}</strong>: ${c.text}${c.reply?`<div class='sub' style='margin:4px 0 0 8px'>Respuesta del autor: ${c.reply}</div>`:''}</div>`).join('') : '<span class="sub">Sé el primero en comentar</span>';
    if(this.logged()){ box.classList.remove('hidden'); loginMsg.classList.add('hidden') } else { box.classList.add('hidden'); loginMsg.classList.remove('hidden') }
  },
  addComment(){ const inp=$('#commentInput'); const text=(inp?.value||'').trim(); if(!text) return; const sid=this.currentStory.id.toString(); if(!this.user.comments[sid]) this.user.comments[sid]=[]; this.user.comments[sid].push({chapter:this.chapter,text,author:this.user.name}); inp.value=''; this.persistUser(); this.renderComments(); toast('Comentario publicado'); },

  // Dashboard de autor: responder
  renderAuthorDashboard(){
    const box=$('#authorComments'); if(!box) return; box.innerHTML='';
    const entries=[]; const cm=this.user?.comments||{}; for(const sid in cm){ cm[sid].forEach(c=> entries.push({sid, ...c})) }
    if(!entries.length){ box.innerHTML='<p class="sub">Aún no hay comentarios de tus lectores.</p>'; return }
    entries.forEach((c,idx)=>{
      const row=el('div','tile');
      row.innerHTML = `<div class='meta'>
        <div class='title'>Historia #${c.sid} · Capítulo ${c.chapter}</div>
        <div class='author'><strong>${c.author}</strong>: ${c.text}</div>
      </div>`;
      const replyWrap=el('div','row');
      const f=el('div','field');
      const input=el('input'); input.placeholder='Escribe una respuesta como autor'; input.value=c.reply||'';
      const btn=el('button','btn purple','Responder');
      btn.addEventListener('click',()=>{
        const v=input.value.trim(); if(!v) return;
        const list=this.user.comments[c.sid]; const it=list.find(x=>x.chapter===c.chapter && x.text===c.text && x.author===c.author);
        if(it){ it.reply=v; this.persistUser(); toast('Respuesta guardada'); this.renderAuthorDashboard(); if(this.currentStory && this.current==='#lector') this.renderComments(); }
      });
      f.appendChild(input); replyWrap.appendChild(f); replyWrap.appendChild(btn); row.appendChild(replyWrap); box.appendChild(row);
    });
  },

  // Filtros
  filter(tag,gridId){ const grid=$('#'+gridId); if(grid) grid.scrollIntoView({behavior:'smooth',block:'start'}); toast('Filtrando por '+tag) },

  // Monedas y apoyo
  openSupport(){ if(!this.logged()){ toast('Inicia sesión para apoyar a creadores'); this.navigate('#login'); return } $('#apoyoAutor').textContent=this.currentStory?.autor||'creador'; $('#apoyoHistoria').textContent=this.currentStory?.titulo||'—'; $('#apoyoBalance').textContent=this.user.coins; this.navigate('#apoyo') },
  updateCoinsUI(){ $('#coinBalance').textContent=this.user?this.user.coins:0; const hdr=$('#hdrCoins'); if(hdr) hdr.textContent=this.user.coins },
  checkout(amount){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para comprar monedas'); return } $('#orderText').textContent=`Comprando ${amount} monedas`; $('#payMask').style.display='flex'; this.pendingCoins=amount; },
  closePay(){ $('#payMask').style.display='none' },
  finishPay(ok){ this.closePay(); if(ok){ this.user.coins += (this.pendingCoins||0); this.updateCoinsUI(); toast('Pago aprobado • ¡Monedas acreditadas!') } else { this.navigate('#error'); toast('Pago declinado') } this.pendingCoins=0; this.persistUser(); },
  donate(amount){ if(!this.logged()) { this.navigate('#login'); return } if(this.user.coins<amount){ toast('Te faltan monedas'); return } this.user.coins-=amount; this.updateCoinsUI(); $('#apoyoBalance').textContent=this.user.coins; this.persistUser(); toast('¡Gracias por apoyar!'); },

  // Listas
  renderFavs(){ const fg=$('#favGrid'); fg.innerHTML=''; if(!this.logged()){ fg.innerHTML='<p class="sub">Inicia sesión para ver tus favoritos.</p>'; return } if(!this.user.favorites.length){ fg.innerHTML='<p class="sub">Todavía no tienes favoritos.</p>'; return } this.user.favorites.forEach(id=>{ const it=this.catalogo.find(x=>x.id===id); if(it) fg.appendChild(bookTile(it,(a)=>this.openStory(a))) }); },
  renderLater(){ const lg=$('#laterGrid'); lg.innerHTML=''; if(!this.logged()){ lg.innerHTML='<p class="sub">Inicia sesión para ver tu lista.</p>'; return } if(!this.user.later.length){ lg.innerHTML='<p class="sub">Aún no has guardado historias.</p>'; return } this.user.later.forEach(id=>{ const it=this.catalogo.find(x=>x.id===id); if(it) lg.appendChild(bookTile(it,(a)=>this.openStory(a))) }); },

  // Perfil & Creador
  renderProfile(){ if(!this.logged()){ this.navigate('#login'); return } $('#profNombre').textContent=this.user.name||'—'; $('#profEmail').textContent=this.user.email||'—'; $('#profRol').textContent=this.user.isCreator?'Creador':'Lector'; const btnIr=$('#btnIrCreador'); if(this.user.isCreator){ btnIr?.classList.remove('hidden') } else { btnIr?.classList.add('hidden') } },
  createCreatorAccount(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión como lector y luego crea tu cuenta de creador'); return } if(this.user.isCreator){ toast('Ya eres creador'); this.navigate('#creador'); return } this.user.isCreator=true; this.persistUser(); toast('Cuenta de creador creada ✨'); this.navigate('#creador'); },
  renderCreator(){ if(!this.logged()){ this.navigate('#login'); return } if(!this.user.isCreator){ this.navigate('#creador-info'); toast('Activa tu cuenta de creador'); return } this.renderMyPosts(); this.renderOtherPosts(); this.updateStats(); },
  publish(){ const t=($('#pubTitle')?.value||'').trim()||'Historia sin título'; const w=parseInt($('#pubWords')?.value||'1200',10); const d=($('#pubDesc')?.value||'').trim()||'Sinopsis breve.'; this.user.posts.push({titulo:t,autor:this.user.name,words:w,desc:d,views:Math.floor(Math.random()*800)+200,likes:Math.floor(Math.random()*200)+20}); this.persistUser(); this.renderMyPosts(); this.updateStats(); toast('Publicado'); },
  renderMyPosts(){ const mp=$('#myPosts'); mp.innerHTML=''; this.user.posts.forEach(p=>{ const card=document.createElement('div'); card.className='tile'; card.innerHTML=`<div class='cover'></div><div class='meta'><div class='title'>${p.titulo}</div><div class='author'>${p.words} palabras · ❤ ${p.likes} · 👁 ${p.views}</div><div class='sub'>${p.desc}</div></div>`; mp.appendChild(card) }); if(!mp.children.length){ mp.innerHTML='<p class="sub">Aún no tienes publicaciones.</p>' } },
  renderOtherPosts(){ const op=$('#otherPosts'); op.innerHTML=''; const demos=[{titulo:'La sombra y el faro',autor:'Creador A',words:3000},{titulo:'Ciudad de vapor',autor:'Creador B',words:2100},{titulo:'Rosas eléctricas',autor:'Creador C',words:1800}]; demos.forEach(p=>{ const card=document.createElement('div'); card.className='tile'; card.innerHTML=`<div class='cover'></div><div class='meta'><div class='title'>${p.titulo}</div><div class='author'>${p.autor} · ${p.words} palabras</div></div>`; op.appendChild(card) }); },
  updateStats(){ const s=$('#stats'); const total=this.user.posts.length; const words=this.user.posts.reduce((a,b)=>a+(b.words||0),0); s.textContent=`${total} publicaciones · ${words} palabras totales`; },

  // Sesión
  signIn(){ const name=($('#loginName')?.value||'').trim()||'Lectora'; const email=($('#loginEmail')?.value||'').trim(); this.user={name,email,coins:20,favorites:[],later:[],unlocked:[],comments:{},isCreator:false,posts:[]}; this.persistUser(); toast('¡Bienvenido, '+this.user.name+'!'); this.navigate('#home'); },
  finishRegister(){ const name=($('#regName')?.value||'').trim()||'Autora'; this.user={name,email:'',coins:0,favorites:[],later:[],unlocked:[],comments:{},isCreator:false,posts:[]}; this.persistUser(); toast('Cuenta de lector creada 🎉'); this.navigate('#home'); },
  signOut(){ this.user=null; localStorage.removeItem(userKey); toast('Sesión cerrada'); this.navigate('#home'); },

  // Persistencia
  persistUser(){ localStorage.setItem(userKey, JSON.stringify(this.user)) }
};

// Carousel simple
function setupCarousel(rootSel){
  const root = $(rootSel);
  const track = $('.carousel-track', root?.parentElement || document) || root;
  // flechas
  const prev=$('#carPrev'), next=$('#carNext');
  prev?.addEventListener('click',()=> track.scrollBy({left:-300,behavior:'smooth'}));
  next?.addEventListener('click',()=> track.scrollBy({left:300,behavior:'smooth'}));
}

// Toast global
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200) }
window.toast=toast;

// Configuración
function openSettings(){
  $('#settingsMask').style.display='flex';
  $('#toggleDark').checked = !!settings.dark;
  $('#fontScale').value = settings.fontScale;
  $('#density').value = settings.density;
}
function closeSettings(){ $('#settingsMask').style.display='none' }
function saveSettings(){
  settings.dark = $('#toggleDark').checked;
  settings.fontScale = parseInt($('#fontScale').value||'100',10);
  settings.density = $('#density').value;
  localStorage.setItem(storeKey, JSON.stringify(settings));
  applySettings();
  toast('Preferencias guardadas');
  closeSettings();
}
window.openSettings=openSettings;

function applySettings(){
  const r=document.documentElement; r.classList.toggle('dark', !!settings.dark);
  r.classList.toggle('compact', settings.density==='compact');
  r.classList.remove('fs-90','fs-110');
  if(settings.fontScale>=110) r.classList.add('fs-110');
  if(settings.fontScale<=90) r.classList.add('fs-90');
}

// Info creadores en modal
function openCreatorInfo(){ $('#creatorInfoMask').style.display='flex' }
function closeCreatorInfo(){ $('#creatorInfoMask').style.display='none' }
window.openCreatorInfo=openCreatorInfo; window.closeCreatorInfo=closeCreatorInfo;

// Exponer app para handlers inline mínimos
window.app = app;

// Bootstrap
window.addEventListener('DOMContentLoaded',()=>{
  injectHeader(document.body, app);
  injectFooter(document.body);
  // Categorías en menú superior
  const tc=document.querySelector('#topCats'); if(tc){ app.chips.slice(0,10).forEach(n=>{ const c=el('button','chip',n); c.addEventListener('click',()=>{app.navigate('#categorias'); toast('Filtrando: '+n)}); tc.appendChild(c) }) }
  // Chips de búsqueda avanzada
  const adv=$('#advCats'); if(adv){ app.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>b.classList.toggle('active')); adv.appendChild(b) }) }

  // Carrusel Popular
  const carTrack=$('#carousel-populares'); app.catalogo.forEach(x=>carTrack.appendChild(bookCard(x,(it)=>app.openStory(it))));
  // Controles de carrusel
  $('#carPrev')?.addEventListener('click',()=> carTrack.scrollBy({left:-300,behavior:'smooth'}));
  $('#carNext')?.addEventListener('click',()=> carTrack.scrollBy({left:300,behavior:'smooth'}));

  // Grids
  const hgrid=$('#homeGrid'); app.catalogo.concat(app.catalogo).forEach(x=>hgrid.appendChild(bookTile(x,(it)=>app.openStory(it))));
  const all=document.getElementById('allChips'); app.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>app.filter(n,'catGrid')); all.appendChild(b) });
  const cg=document.getElementById('catGrid'); app.catalogo.concat(app.catalogo).forEach(x=>cg.appendChild(bookTile(x,(it)=>app.openStory(it))));

  // Botones de navegación de secciones
  $$('[data-goto]').forEach(b=> b.addEventListener('click',()=> app.navigate(b.getAttribute('data-goto'))));

  // Botones Config
  $$('.openSettingsBtn').forEach(b=> b.addEventListener('click',()=>openSettings()));
  $('#saveSettingsBtn')?.addEventListener('click',()=>saveSettings());
  $('#closeSettingsBtn')?.addEventListener('click',()=>closeSettings());

  // Modal creador info
  $('#closeCreatorInfoBtn')?.addEventListener('click',()=>closeCreatorInfo());

  // Acordeón de cobros
  $$('.ac-item .ac-head').forEach(head=>{
    head.addEventListener('click',()=> head.parentElement.classList.toggle('open'))
  });

  // Inicio
  app.navigate(location.hash||'#home');
});
