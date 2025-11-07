// Smintheia Nook – bundle sin ES Modules para compatibilidad file://
(function(){
  // Rutas multipágina (MPA)
  const routeMap = {
    '#home':'index.html',
    '#categorias':'categorias.html',
    '#busqueda':'busqueda.html',
    '#busqueda-avanzada':'busqueda-avanzada.html',
    '#historia':'historia.html',
    '#lector':'lector.html',
    '#apoyo':'apoyo.html',
    '#login':'login.html',
    '#registro':'registro.html',
    '#monedas':'monedas.html',
    '#favoritos':'favoritos.html',
    '#later':'later.html',
    '#perfil':'perfil.html',
    '#config':'config.html',
    '#creador-info':'creador-info.html',
    '#creador-paso1':'creador-paso1.html',
    '#creador-paso2':'creador-paso2.html',
    '#creador-paso3':'creador-paso3.html',
    '#creador-paso4':'creador-paso4.html',
    '#creador-confirmado':'creador-confirmado.html',
    '#creador':'creador.html',
    '#dashboard-autor':'dashboard-autor.html',
    '#cargando':'cargando.html',
    '#error':'error.html'
  };
  // Utilidades
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const el = (t, c, txt) => { const n=document.createElement(t); if(c) n.className=c; if(txt!=null) n.textContent=txt; return n };
  window.$ = $; window.$$ = $$; window.el = el;

  // Formato y componentes simples
  const fmtLikes = n => new Intl.NumberFormat('es-MX').format(n||0);
  const fmtWords = n => `${new Intl.NumberFormat('es-MX').format(n||0)} palabras`;
  // statBar: removed star rating (per request) — keep likes, tags and word count
  function statBar(item){
    const bar=el('div','statbar');
    bar.innerHTML = `
      <span class="sp">❤ ${fmtLikes(item.likes||0)}</span>
      <span class="sp">🏷 ${item.tags?.slice(0,2).join(', ')||'—'}</span>
      <span class="sp">📝 ${fmtWords(item.words||0)}</span>
    `;
    return bar;
  }
  function coverFor(item){
    const div=el('div','cover');
    if(item.cover){
      const img=new Image(); img.alt=`Portada de ${item.titulo}`; img.src=item.cover; img.loading='lazy';
      img.onerror=()=>{ div.innerHTML=''; setFallback(); };
      div.appendChild(img);
    } else { setFallback(); }
    function setFallback(){
      // Use a neutral default cover image (avoid single-letter fallback). If offline, fall back to gradient.
      const defaultCover='https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=60';
      div.style.backgroundImage = `url(${defaultCover})`;
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = 'center';
    }
    return div;
  }
  function bookCard(item, onOpen){ const c=el('div','card-book'); c.appendChild(coverFor(item)); const m=el('div','meta'); m.appendChild(el('div','title',item.titulo)); m.appendChild(el('div','author',item.autor)); m.appendChild(statBar(item)); c.appendChild(m); c.addEventListener('click',()=>onOpen(item)); return c }
  function bookTile(item, onOpen){ const t=el('div','tile'); t.appendChild(coverFor(item)); const m=el('div','meta'); m.appendChild(el('div','title',item.titulo)); m.appendChild(el('div','author',item.autor)); m.appendChild(statBar(item)); t.appendChild(m); const badges=el('div','badges'); (item.tags||[]).slice(0,3).forEach(tag=>badges.appendChild(el('span','chip',tag))); t.appendChild(badges); t.addEventListener('click',()=>onOpen(item)); return t }

  // Toast
  function toast(msg, kind){
    const t=$('#toast'); if(!t) return;
    // Reset classes
    t.className = 'toast';
    if(kind && (kind==='success' || kind==='pay-success')){
      t.classList.add('success');
      t.innerHTML = `<span class="giant"><span class="arrow">⬇️</span><span class="msg">${msg}</span></span>`;
    } else {
      t.textContent = msg;
    }
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2500)
  }
  window.toast=toast;

  // Settings
  const storeKey='sn_settings_v1', userKey='sn_user_v1';
  const settings={ dark:false, fontScale:100, density:'normal', access:{ highContrast:false, dyslexic:false, lineHeight:1.4 }, ...JSON.parse(localStorage.getItem(storeKey)||'{}') };
  function applySettings(){ const r=document.documentElement;
    // Visual modes
    r.classList.toggle('dark', !!settings.dark);
    r.classList.toggle('compact', settings.density==='compact');
    r.classList.remove('fs-90','fs-110'); if(settings.fontScale>=110) r.classList.add('fs-110'); if(settings.fontScale<=90) r.classList.add('fs-90');
    // Accessibility: high contrast
    if(settings.access && settings.access.highContrast){ 
      r.classList.add('high-contrast'); 
      try{ 
        document.body.style.backgroundColor='#000'; 
        document.body.style.color='#ffeb3b'; 
        // Mejorar contraste de elementos clave
        const header = document.querySelector('header.top');
        if(header) header.style.background='#000';
        const buttons = document.querySelectorAll('.btn, .chip');
        buttons.forEach(b=>{ if(!b.classList.contains('purple')){ b.style.background='#222'; b.style.color='#ffeb3b'; b.style.borderColor='#444' } });
      }catch(e){} 
    } else { 
      r.classList.remove('high-contrast'); 
      try{ 
        document.body.style.backgroundColor=''; 
        document.body.style.color=''; 
        const header = document.querySelector('header.top');
        if(header) header.style.background='';
        const buttons = document.querySelectorAll('.btn, .chip');
        buttons.forEach(b=>{ b.style.background=''; b.style.color=''; b.style.borderColor='' });
      }catch(e){} 
    }
    // Accessibility: dyslexic-friendly font (fallback to a readable sans if available)
    if(settings.access && settings.access.dyslexic){ r.classList.add('dyslexic'); try{ document.body.style.fontFamily = "Verdana, 'Segoe UI', Arial, sans-serif"; }catch(e){} } else { r.classList.remove('dyslexic'); try{ document.body.style.fontFamily = ''; }catch(e){} }
    // Accessibility: line height
    if(settings.access && settings.access.lineHeight){ try{ document.body.style.lineHeight = String(settings.access.lineHeight); }catch(e){} }
  }
  function openSettings(){ $('#settingsMask').style.display='flex'; $('#toggleDark').checked=!!settings.dark; $('#fontScale').value=settings.fontScale; $('#density').value=settings.density }
  function closeSettings(){ $('#settingsMask').style.display='none' }
  function saveSettings(){ settings.dark=$('#toggleDark').checked; settings.fontScale=parseInt($('#fontScale').value||'100',10); settings.density=$('#density').value; localStorage.setItem(storeKey,JSON.stringify(settings)); applySettings(); toast('Preferencias guardadas'); closeSettings() }
  window.openSettings=openSettings; window.closeSettings=closeSettings;
  applySettings();

  // App
  const app={
    user: JSON.parse(localStorage.getItem(userKey)||'null'), current:'#home', currentStory:null, chapter:1, pendingCoins:0,
    // catalogo: initial generated set kept as fallback; we will try to load a full JSON catalog at runtime
    catalogo:(()=>{
      // Catálogo con imágenes reales de Unsplash (URLs verificadas)
      return [
        {id:1,titulo:"Sombras en la Biblioteca",autor:"L. Ortega",tags:["Terror","Suspenso"],rating:4.8,words:12000,likes:1540,cover:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80"},
        {id:2,titulo:"Jardín de Cometas",autor:"A. Vega",tags:["Romance","Contemporáneo"],rating:4.6,words:23000,likes:980,cover:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80"},
        {id:3,titulo:"Circuitos y Hechizos",autor:"K. Nova",tags:["Fantasía","Urbana"],rating:4.9,words:45000,likes:2120,cover:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80"},
        {id:4,titulo:"Crónicas del Café Gris",autor:"M. Ruiz",tags:["Slice of life","Poesía"],rating:4.4,words:8000,likes:640,cover:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"},
        {id:5,titulo:"El Archivo de los Gatos",autor:"I. Beltrán",tags:["No ficción","Animales"],rating:4.7,words:5200,likes:1320,cover:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80"},
        {id:6,titulo:"La Ciudad que Cantaba",autor:"N. Sol",tags:["Young Adult","Novela"],rating:4.5,words:33000,likes:1710,cover:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80"},
        {id:7,titulo:"El Último Tren",autor:"R. Martínez",tags:["Misterio","Thriller"],rating:4.7,words:28000,likes:1890,cover:"https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80"},
        {id:8,titulo:"Ecos del Mañana",autor:"S. Chen",tags:["Ciencia ficción","Distopía"],rating:4.8,words:52000,likes:3200,cover:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"},
        {id:9,titulo:"Bajo las Estrellas",autor:"M. Luna",tags:["Romance","Juvenil"],rating:4.5,words:19000,likes:1450,cover:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80"},
        {id:10,titulo:"La Casa del Viento",autor:"P. Torres",tags:["Fantasía","Épica"],rating:4.9,words:67000,likes:4100,cover:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"},
        {id:11,titulo:"Recuerdos de Papel",autor:"A. Soto",tags:["Drama","Familiar"],rating:4.3,words:15000,likes:780,cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"},
        {id:12,titulo:"Cazadores de Sombras",autor:"D. Ríos",tags:["Terror","Fantasmas"],rating:4.6,words:31000,likes:2300,cover:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80"}
      ];
    })(),
    categories: {
      "Terror": ["Suspenso","Psicológico","Fantasmas","Horror cósmico","Gore","Lovecraftiano"],
      "Romance": ["Contemporáneo","Histórico","Juvenil","Paranormal","BL","GL"],
      "Fantasía": ["Épica","Urbana","Oscura","Espada y brujería"],
      "Ciencia ficción": ["Distopía","Ciberpunk","Space opera","Ucronía"],
      "Misterio": ["Detectives","Policiaco","Noir","Thriller"],
      "Young Adult": ["Instituto","Venida de edad","Aventura"],
      "No ficción": ["Biografía","Ensayo","Divulgación","Historia"],
      "Poesía": ["Haiku","Lírica","Épica"],
      "Cuento": ["Microficción","Antología"],
      "Aventura": ["Viajes","Exploración"],
      "Humor": ["Satírico","Costumbrista"]
    },
  chips:[],

    logged(){ return !!this.user },
    navigate(hash){
      const target=hash||location.hash||'#home';
      // Si la sección no existe en esta página, redirigir a archivo correspondiente (MPA)
      if(!$(target) && routeMap[target]){ location.href = routeMap[target] + target; return }
      $$('[data-screen]').forEach(s=>s.classList.add('hidden'));
      const e=$(target)||$('#error');
      if(e) e.classList.remove('hidden');
      this.current=target; history.replaceState({},'',target);
      if(target==="#monedas") this.updateCoinsUI();
      if(target==="#favoritos") this.renderFavs();
      if(target==="#later") this.renderLater();
      if(target==="#perfil") this.renderProfile();
      if(target==="#creador") this.renderCreator();
      if(target==="#dashboard-autor") this.renderAuthorDashboard();
      this.renderHeader();
      if(target==="#home") window.scrollTo({top:0,behavior:'smooth'})
    },

    renderHeader(){
      const box=$('#headerActions'); if(!box) return; box.innerHTML='';
      // Botón de categorías eliminado del header - solo se usa el dropdown
      if(this.logged()){
        // Favoritos
        const favBtn=el('button','btn','❤'); favBtn.title='Favoritos'; favBtn.addEventListener('click',()=>this.navigate('#favoritos')); box.appendChild(favBtn);
        // Leer más tarde
        const laterBtn=el('button','btn','🕑'); laterBtn.title='Leer más tarde'; laterBtn.addEventListener('click',()=>this.navigate('#later')); box.appendChild(laterBtn);
        // Notificaciones: campana con panel desplegable
        const nmenu=el('div','menu','');
        const bell=el('button','btn','🔔'); bell.title='Notificaciones'; bell.style.position='relative';
        const npanel=el('div','menu-panel',''); npanel.style.minWidth='260px';
        const count=(this.user.notifications||[]).filter(n=>!n.read).length;
        if(count>0){ const b=document.createElement('span'); b.textContent=String(count); b.style.cssText='position:absolute;top:-6px;right:-6px;background:#f43f5e;color:#fff;border-radius:999px;padding:0 6px;font-size:11px;line-height:16px;min-width:16px;text-align:center'; bell.appendChild(b) }
        const renderNotif=()=>{
          npanel.innerHTML='';
          const list=(this.user.notifications||[]).slice(-8).reverse();
          if(!list.length){ npanel.innerHTML='<div class="sub">No hay notificaciones</div>'; return }
          list.forEach(n=>{
            const a=document.createElement('a'); a.href=n.href||'#'; a.textContent=n.text; a.addEventListener('click',()=>{ n.read=true; this.persistUser(); this.renderHeader(); }); npanel.appendChild(a);
          });
          const mark=document.createElement('a'); mark.href='#'; mark.textContent='Marcar todas como leídas'; mark.addEventListener('click',(e)=>{ e.preventDefault(); this.user.notifications=(this.user.notifications||[]).map(x=>({...x,read:true})); this.persistUser(); this.renderHeader(); }); npanel.appendChild(mark);
        };
        renderNotif();
        bell.addEventListener('click',()=>{ 
          npanel.classList.toggle('open'); 
          if(npanel.classList.contains('open')){
            let changed=false; (this.user.notifications||[]).forEach(n=>{ if(!n.read){ n.read=true; changed=true } });
            if(changed){ this.persistUser(); const badge=bell.querySelector('span'); if(badge) badge.remove(); renderNotif(); }
          }
        });
        document.addEventListener('click',(e)=>{ if(!nmenu.contains(e.target)) npanel.classList.remove('open') });
        nmenu.appendChild(bell); nmenu.appendChild(npanel); box.appendChild(nmenu);
        // Monedas
        const coin=el('span','coin',''); coin.innerHTML=`🪙 <span id="hdrCoins">${this.user.coins}</span>`; coin.addEventListener('click',()=>this.navigate('#monedas')); box.appendChild(coin);
        const menu=el('div','menu','');
        const trig=el('div','avatar','');
        const unread = (this.user.notifications||[]).some(n=>!n.read);
        const photo = this.user.photo ? `<img src="${this.user.photo}" alt="avatar" style="width:24px;height:24px;border-radius:50%;object-fit:cover;margin-right:6px;vertical-align:middle">` : '';
        trig.innerHTML=`<span class="dot" style="${unread?'background:#f43f5e;opacity:1':''}"></span> ${photo}${this.user.name}`; const panel=el('div','menu-panel','');
        const mk=(txt,href)=>{const a=document.createElement('a');a.href="#";a.textContent=txt;a.addEventListener('click',(e)=>{e.preventDefault();this.navigate(href)});return a};
        panel.appendChild(mk('❤ Mis favoritos','#favoritos'));
        panel.appendChild(mk('🕑 Leer más tarde','#later'));
        panel.appendChild(mk('🪙 Monedas','#monedas'));
  const cfg=document.createElement('a'); cfg.href="#"; cfg.textContent='⚙ Configuración'; cfg.addEventListener('click',(e)=>{e.preventDefault(); this.navigate('#config')}); panel.appendChild(cfg);
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

    // Búsqueda (MPA friendly): guarda query y, si la UI no existe en esta página, redirige a busqueda.html
    search(){
      const q = ($('#q')?.value||'').trim();
      if(!q){ toast('Escribe algo para buscar'); return }
      try{ localStorage.setItem('sn_search_q', q) }catch{}
      const k=$('#kword'); const sg=$('#searchGrid');
      if(k && sg){
        k.textContent = `“${q}”`;
        sg.innerHTML = '';
        this.catalogo.filter(x=>x.titulo.toLowerCase().includes(q.toLowerCase()) || x.autor.toLowerCase().includes(q.toLowerCase()) || (x.tags||[]).some(t=>t.toLowerCase().includes(q.toLowerCase()))).forEach(x=> sg.appendChild(bookTile(x,(it)=>this.openStory(it))));
        if(!sg.children.length){ sg.innerHTML = '<p class="sub">No encontramos resultados.</p>' }
      }
      // Navega a la página de resultados si no está presente en esta vista
      if(!$('#busqueda')){ const dest = '#busqueda'; if(routeMap[dest]){ location.href = routeMap[dest]; return } }
      this.navigate('#busqueda');
    },
    runAdvancedSearch(){
      const t=($('#advTitle')?.value||'').toLowerCase();
      const a=($('#advAuthor')?.value||'').toLowerCase();
      const min=parseInt($('#advMin')?.value||'0',10);
      const max=parseInt($('#advMax')?.value||'999999',10);
      const cats=$$('#advCats .chip.active').map(b=>b.textContent.toLowerCase());
      const out=$('#advResults'); if(!out) return; out.innerHTML='';
      const filtered = this.catalogo.filter(x=>{
        const titleOk = !t || x.titulo.toLowerCase().includes(t);
        const authorOk = !a || x.autor.toLowerCase().includes(a);
        const wordsOk = (x.words>=min && x.words<=max);
        const tags = (x.tags||[]).map(s=>s.toLowerCase());
        const catsOk = cats.length? cats.some(c=> tags.includes(c)) : true;
        return titleOk && authorOk && wordsOk && catsOk;
      });
      filtered.forEach(x=>out.appendChild(bookTile(x,(it)=>this.openStory(it))));
      if(!out.children.length){ out.innerHTML='<p class="sub">Sin coincidencias.</p>' }
    },

    // Historias
  openStory(x){
    this.currentStory=x; this.chapter=1;
    // Guardar historia actual para que persista entre páginas
    try{ localStorage.setItem('sn_current_story', JSON.stringify(x)) }catch{}
    // Si la página de historia no existe, navegar al archivo
    if(!$('#historia')){ 
      const dest = routeMap['#historia']||'historia.html'; 
      location.href = dest; 
      return 
    }
    $('#storyTitle').textContent=x.titulo; $('#storyAuthor').textContent='por '+x.autor; const tagC=$('#storyTags'); tagC.innerHTML=''; (x.tags||[]).forEach(t=>tagC.appendChild(el('span','chip',t))); const ch=$('#chapters'); ch.innerHTML=''; for(let i=1;i<=12;i++){ const b=el('button','chip','Capítulo '+i + (i>3?' 🔒':'')); b.addEventListener('click',()=>{this.chapter=i; this.openReader()}); ch.appendChild(b) } this.renderFavBtn(); this.renderLikeStoryBtn(); this.navigate('#historia'); if(this.user){ this.user.history=this.user.history||[]; this.user.history.push({title:x.titulo, date:new Date().toLocaleString()}); this.persistUser(); }
  },
    renderFavBtn(){ const f=$('#favBtn'); if(!this.logged()){f.textContent='❤ Agregar a favoritos';return} const fav=this.user.favorites.includes(this.currentStory.id); f.textContent=fav?'❤ En favoritos':'❤ Agregar a favoritos' },
    toggleFav(){ if(!this.logged()){toast('Inicia sesión para usar favoritos'); this.navigate('#login'); return} const id=this.currentStory.id; const has=this.user.favorites.includes(id); this.user.favorites=has? this.user.favorites.filter(x=>x!==id) : [...this.user.favorites,id]; this.persistUser(); this.renderFavBtn(); toast('Favoritos actualizado') },
    saveForLater(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para guardar'); return } if(!this.user.later.includes(this.currentStory.id)) this.user.later.push(this.currentStory.id); this.persistUser(); toast('Guardado para leer después') },
    
    // Sistema de likes
    toggleLikeStory(){
      if(!this.logged()){ toast('Inicia sesión para dar me gusta'); this.navigate('#login'); return }
      this.user.likedStories = this.user.likedStories || [];
      const id = this.currentStory.id;
      const hasLiked = this.user.likedStories.includes(id);
      
      if(hasLiked){
        this.user.likedStories = this.user.likedStories.filter(x=>x!==id);
        toast('Me gusta eliminado');
      } else {
        this.user.likedStories.push(id);
        toast('¡Te gustó esta historia! ❤️', 'success');
        // Notificación simulada de nuevo capítulo de la historia que te gustó
        this.notify(`La historia que te gustó "${this.currentStory.titulo}" ha publicado un capítulo nuevo`, routeMap['#lector']||'lector.html');
      }
      
      this.persistUser();
      this.renderLikeStoryBtn();
    },
    
    renderLikeStoryBtn(){
      const btn = $('#likeBtn');
      if(!btn) return;
      if(!this.logged()){ btn.innerHTML='🤍 Me gusta'; return }
      
      this.user.likedStories = this.user.likedStories || [];
      const hasLiked = this.user.likedStories.includes(this.currentStory.id);
      btn.innerHTML = hasLiked ? '❤️ Te gusta' : '🤍 Me gusta';
    },
    
    toggleLikeChapter(){
      if(!this.logged()){ toast('Inicia sesión para dar me gusta'); this.navigate('#login'); return }
      this.user.likedChapters = this.user.likedChapters || [];
      const key = `${this.currentStory.id}_ch${this.chapter}`;
      const hasLiked = this.user.likedChapters.includes(key);
      
      if(hasLiked){
        this.user.likedChapters = this.user.likedChapters.filter(x=>x!==key);
        toast('Me gusta eliminado');
      } else {
        this.user.likedChapters.push(key);
        toast('¡Te gustó este capítulo! ❤️', 'success');
      }
      
      this.persistUser();
      this.renderLikeChapterBtn();
    },
    
    renderLikeChapterBtn(){
      const btn = $('#likeChapterBtn');
      if(!btn) return;
      if(!this.logged()){ btn.innerHTML='🤍 Me gusta este capítulo'; return }
      
      this.user.likedChapters = this.user.likedChapters || [];
      const key = `${this.currentStory.id}_ch${this.chapter}`;
      const hasLiked = this.user.likedChapters.includes(key);
      btn.innerHTML = hasLiked ? '❤️ Te gusta este capítulo' : '🤍 Me gusta este capítulo';
    },

  // Lector
  openReader(){ 
    // Guardar capítulo actual
    try{ localStorage.setItem('sn_current_chapter', String(this.chapter)) }catch{}
    
    // Si la página de lector no existe, navegar al archivo
    if(!$('#lector')){ 
      const dest = routeMap['#lector']||'lector.html'; 
      location.href = dest; 
      return 
    }
    
    const paid=this.chapter>3; const unlocked=this.logged() && this.user.unlocked.includes(this.keyUC()); $('#chapterHeading').textContent=`Capítulo ${this.chapter} · Título provisional`; const text=sampleText(this.chapter); if(paid && !unlocked){ $('#lockNotice').classList.remove('hidden'); $('#unlockBar').classList.remove('hidden'); const ct=$('#chapterText'); ct.textContent=text; ct.classList.add('preview-locked'); } else { $('#lockNotice').classList.add('hidden'); $('#unlockBar').classList.add('hidden'); const ct=$('#chapterText'); ct.classList.remove('preview-locked'); ct.textContent=text; if(this.logged()){ this.user.history=this.user.history||[]; this.user.history.push({title:`${this.currentStory?.titulo||'Historia'} · Cap ${this.chapter}`, date:new Date().toLocaleString()}); this.persistUser(); } } this.renderComments(); this.renderLikeChapterBtn(); this.navigate('#lector') 
  },
    prevChapter(){ this.chapter=Math.max(1,this.chapter-1); this.openReader() },
    nextChapter(){ this.chapter=Math.min(12,this.chapter+1); this.openReader() },
    keyUC(){ return `${this.currentStory?.id||0}-${this.chapter}` },
    unlockChapter(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para usar monedas'); return } if(this.user.coins<20){ this.navigate('#monedas'); toast('Te faltan monedas'); return } this.user.coins-=20; this.user.unlocked.push(this.keyUC()); this.updateCoinsUI(); toast('Capítulo desbloqueado'); this.persistUser(); this.openReader() },

    // Comentarios + Respuestas (incluye comentarios de muestra y CTA de login)
    renderComments(){
      const list=$('#commentList'); const box=$('#commentBox'); const loginMsg=$('#loginToComment'); const sid = `${this.currentStory?.id||0}`;
      // Generador simple de comentarios de ejemplo (determinista por id y capítulo)
      function sampleCommentsFor(id, chapter){
        const names = ['María','Alex','Samir','Lucía','Diego','Ariadna'];
        const texts = ['Me encantó este capítulo.','¿Alguien más notó el detalle en la escena final?','Es perfecto para leer de noche.','Quiero más de este autor 😍','La prosa me recuerda a un clásico moderno.'];
        const n = (id % 3) + (chapter % 2);
        const out = [];
        for(let i=0;i<n;i++) out.push({author: names[(id+i)%names.length], text: texts[(id+i)%texts.length], chapter});
        return out;
      }

      const sample = sampleCommentsFor(this.currentStory?.id||0, this.chapter);
      const userComments = (this.user?.comments?.[sid]||[]).filter(c=>c.chapter===this.chapter);
      const merged = [].concat(userComments, sample);
      list.innerHTML = merged.length ? merged.map(c=>`<div style="margin:6px 0"><strong>${c.author}</strong>: ${c.text}${c.reply?`<div class='sub' style='margin:4px 0 0 8px'>Respuesta del autor: ${c.reply}</div>`:''}</div>`).join('') : '<span class="sub">Sé el primero en comentar</span>';
      if(this.logged()){
        box.classList.remove('hidden'); if(loginMsg) loginMsg.classList.add('hidden');
      } else {
        box.classList.add('hidden');
        if(loginMsg) loginMsg.innerHTML = '<div class="sub">Necesitas <button class="btn purple" id="gotoLoginFromComments">Iniciar sesión</button> para comentar</div>';
        if(loginMsg) loginMsg.classList.remove('hidden');
  setTimeout(function(){ const b=$('#gotoLoginFromComments'); if(b) b.addEventListener('click',()=>{ app.navigate('#login') }) },50);
      }
    },
    addComment(){ const inp=$('#commentInput'); const text=(inp?.value||'').trim(); if(!text) return; const sid=this.currentStory.id.toString(); if(!this.user.comments[sid]) this.user.comments[sid]=[]; this.user.comments[sid].push({chapter:this.chapter,text,author:this.user.name}); inp.value=''; this.persistUser(); this.renderComments(); toast('Comentario publicado') },

    // Dashboard autor
    renderAuthorDashboard(){ const box=$('#authorComments'); if(!box) return; box.innerHTML=''; const entries=[]; const cm=this.user?.comments||{}; for(const sid in cm){ cm[sid].forEach(c=> entries.push({sid, ...c})) } if(!entries.length){ box.innerHTML='<p class="sub">Aún no hay comentarios de tus lectores.</p>'; return } entries.forEach((c)=>{ const row=el('div','tile'); row.innerHTML = `<div class='meta'><div class='title'>Historia #${c.sid} · Capítulo ${c.chapter}</div><div class='author'><strong>${c.author}</strong>: ${c.text}</div></div>`; const wrap=el('div','row'); const f=el('div','field'); const input=el('input'); input.placeholder='Escribe una respuesta como autor'; input.value=c.reply||''; const btn=el('button','btn purple','Responder'); btn.addEventListener('click',()=>{ const v=input.value.trim(); if(!v) return; const list=this.user.comments[c.sid]; const it=list.find(x=>x.chapter===c.chapter && x.text===c.text && x.author===c.author); if(it){ it.reply=v; this.persistUser(); toast('Respuesta guardada'); this.renderAuthorDashboard(); if(this.currentStory && this.current==='#lector') this.renderComments() } }); f.appendChild(input); wrap.appendChild(f); wrap.appendChild(btn); row.appendChild(wrap); box.appendChild(row) }) },

    // Monedas y apoyo
    openSupport(){
      if(!this.logged()){
        toast('Inicia sesión para apoyar a creadores');
        this.navigate('#login');
        return;
      }
      const autorEl = $('#apoyoAutor');
      const historiaEl = $('#apoyoHistoria');
      const balanceEl = $('#apoyoBalance');
      if (!autorEl || !historiaEl || !balanceEl) {
        toast('Error: la página de apoyo no está cargada.');
        // Opcional: redirigir a la página de apoyo
        const dest = routeMap['#apoyo'] || 'apoyo.html';
        location.href = dest;
        return;
      }
      autorEl.textContent = this.currentStory?.autor || 'creador';
      historiaEl.textContent = this.currentStory?.titulo || '—';
      balanceEl.textContent = this.user.coins;
      this.navigate('#apoyo');
    },
    updateCoinsUI(){ const bal=$('#coinBalance'); if(bal) bal.textContent=this.user?this.user.coins:0; const hdr=$('#hdrCoins'); if(hdr) hdr.textContent=this.user?this.user.coins:0 },
    earnFreeCoins(key){
      if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para reclamar'); return }
      this.user.claimedFree = this.user.claimedFree||[];
      if(this.user.claimedFree.includes(key)){ toast('Ya reclamaste esta recompensa'); return }
      this.user.claimedFree.push(key);
      this.user.coins = (this.user.coins||0)+5;
      this.persistUser();
      this.updateCoinsUI();
      toast('Recibiste +5 monedas 🎉','success');
    },
    notify(text, href){
      if(!this.logged()) return;
      const n = {text, href: href||'', time: new Date().toLocaleString(), read:false};
      this.user.notifications = this.user.notifications||[];
      this.user.notifications.push(n);
      this.persistUser();
      this.renderHeader();
      // mostrar un toast corto
      toast(text);
    },
    checkout(amount){ 
      if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión para comprar monedas'); return } 
      $('#orderText').textContent=`Comprando ${amount} monedas`; 
      $('#payMask').style.display='flex'; 
      this.pendingCoins=amount;
      // Pre-llenar con tarjeta guardada si existe
      const card=this.user?.payment?.card;
      if(card){
        const savedBox=$('#savedCardBox');
        const newCardBox=$('#newCardBox');
        if(savedBox && newCardBox){
          savedBox.classList.remove('hidden');
          $('#savedCardInfo').textContent=`${card.brand} •••• ${card.last4}`;
          newCardBox.classList.add('hidden');
        }
      }
    },
    closePay(){ $('#payMask').style.display='none' },
  finishPay(ok, saveCard){
      this.closePay();
      if(ok){
        this.user.coins += (this.pendingCoins||0);
        this.updateCoinsUI();
        this.user.purchases=this.user.purchases||[];
        this.user.purchases.push({type:'Monedas', amount:this.pendingCoins, date:new Date().toLocaleString()});
        
        // Guardar tarjeta si se solicitó
        if(saveCard && saveCard.save){
          this.user.payment = this.user.payment||{}; 
          this.user.payment.card={brand:saveCard.brand, last4:saveCard.last4};
        }
        
        toast('Pago aprobado • ¡Monedas acreditadas!', 'pay-success');
      } else {
        // No navegar a #error que no existe, solo mostrar mensaje
        toast('Pago declinado - intenta de nuevo')
      }
      this.pendingCoins=0; this.persistUser(); renderConfigScreen()
    },
  donate(amount){ 
      if(!this.logged()) { this.navigate('#login'); return } 
      if(this.user.coins<amount){ toast('Te faltan monedas'); return }
      
      // Mostrar formulario de mensaje
      const donateForm = $('#donateFormSection');
      const donateButtons = $('#donateButtons');
      if(donateForm && donateButtons){
        donateButtons.classList.add('hidden');
        donateForm.classList.remove('hidden');
        $('#donateAmount').textContent = amount;
        
        // Guardar el monto pendiente
        this.pendingDonation = amount;
      }
    },
    
    sendDonation(){
      const amount = this.pendingDonation || 0;
      const message = ($('#donateMessage')?.value||'').trim();
      
      if(!message){ toast('Escribe un mensaje para el creador'); return }
      
      this.user.coins -= amount;
      this.updateCoinsUI();
      $('#apoyoBalance').textContent = this.user.coins;
      this.user.purchases = this.user.purchases||[];
      this.user.purchases.push({
        type:'Donación', 
        amount:amount, 
        message:message,
        date:new Date().toLocaleString()
      });
      // Notificación de recibido (simulada para el creador actual)
      this.notify(`Has recibido ${amount} monedas de: Ana Artesana: "${message}"`, routeMap['#perfil']||'perfil.html');
      this.persistUser();
      
      // Ocultar formulario y mostrar botones de nuevo
      const donateForm = $('#donateFormSection');
      const donateButtons = $('#donateButtons');
      if(donateForm && donateButtons){
        donateForm.classList.add('hidden');
        donateButtons.classList.remove('hidden');
        $('#donateMessage').value = '';
      }
      
      toast('¡Tu apoyo ha sido enviado con éxito!', 'pay-success');
      this.pendingDonation = 0;
      renderConfigScreen();
    },

    // Listas
    renderFavs(){
      const fg=$('#favGrid'); if(!fg) return; fg.innerHTML='';
      // A veces app.user puede re-hidratarse después; leer localStorage como fallback
      if(!this.user){ try{ this.user = JSON.parse(localStorage.getItem(userKey)||'null') }catch{} }
      if(!this.logged()){ fg.innerHTML='<p class="sub">Inicia sesión para ver tus favoritos.</p>'; return }
      const favs = (this.user.favorites||[]);
      if(!favs.length){ fg.innerHTML='<p class="sub">Todavía no tienes favoritos.</p>'; return }
      favs.forEach(id=>{ const it=this.catalogo.find(x=>x.id===id); if(it) fg.appendChild(bookTile(it,(a)=>this.openStory(a))) })
    },
    renderLater(){
      const lg=$('#laterGrid'); if(!lg) return; lg.innerHTML='';
      if(!this.user){ try{ this.user = JSON.parse(localStorage.getItem(userKey)||'null') }catch{} }
      if(!this.logged()){ lg.innerHTML='<p class="sub">Inicia sesión para ver tu lista.</p>'; return }
      const later = (this.user.later||[]);
      if(!later.length){ lg.innerHTML='<p class="sub">Aún no has guardado historias.</p>'; return }
      later.forEach(id=>{ const it=this.catalogo.find(x=>x.id===id); if(it) lg.appendChild(bookTile(it,(a)=>this.openStory(a))) })
    },

  // Filtros
  filter(tag, gridId){ try{ localStorage.setItem('sn_filter_tag', tag) }catch{}; const grid=$('#'+gridId); if(grid){ grid.scrollIntoView({behavior:'smooth',block:'start'}) } toast('Filtrando por '+tag) },

    // Perfil & Creador
    renderProfile(){
      if(!this.logged()){ this.navigate('#login'); return }
      $('#profNombre').textContent=this.user.name||'—';
      $('#profEmail').textContent=this.user.email||'—';
      $('#profRol').textContent=this.user.isCreator?'Creador':'Lector';
      const btnIr=$('#btnIrCreador'); if(this.user.isCreator){ btnIr?.classList.remove('hidden') } else { btnIr?.classList.add('hidden') }

      // Notificaciones: ejemplos realistas para creadores (donaciones, comentarios, aprobaciones)
      const notifBox = $('#notifList'); if(notifBox){
        const notifs = [];
        if(this.user.notifications && this.user.notifications.length){ notifs.push(...this.user.notifications.slice(-10).reverse()) }
        if(this.user.isCreator && !notifs.length){ notifs.push({text:`Usuario 'Lectora' donó 20 monedas a "${this.user.posts[0]?.titulo||'tu historia favorita'}".`, time:new Date().toLocaleString()}); notifs.push({text:`Nuevo comentario en "${this.user.posts[0]?.titulo||'tu historia'}".`, time:new Date().toLocaleString()}); notifs.push({text:'Tu solicitud de verificación de creador fue aceptada.', time:new Date().toLocaleString()}); }
        if(!notifs.length) notifBox.innerHTML='<p class="sub">No hay notificaciones nuevas.</p>';
        if(notifs.length){ notifBox.innerHTML = notifs.map(n=>{
          const link = n.href? `<a href="${n.href}">${n.text}</a>` : n.text;
          return `<div style="margin:8px 0"><strong>${link}</strong><div class='sub'>${n.time||''}</div></div>`
        }).join(''); }
        // marcar como leídas al abrir perfil
        if(this.user.notifications && this.user.notifications.length){ this.user.notifications = this.user.notifications.map(n=>({...n,read:true})); this.persistUser(); this.renderHeader(); }
      }

      // Quick links
      const q = $('#quickLinks'); if(q){ q.innerHTML=''; const links=[{t:'❤ Favoritos',h:'#favoritos'},{t:'🕑 Leer más tarde',h:'#later'},{t:'🪙 Monedas',h:'#monedas'},{t:'⚙ Configuración',h:'#config'}]; links.forEach(it=>{ const b=el('button','btn',it.t); b.addEventListener('click',()=>this.navigate(it.h)); q.appendChild(b) }) }
    },
    createCreatorAccount(){ if(!this.logged()){ this.navigate('#login'); toast('Inicia sesión como lector y luego crea tu cuenta de creador'); return } if(this.user.isCreator){ toast('Ya eres creador'); this.navigate('#creador'); return } this.navigate('#creador-paso1') },
    // Flujo de alta de creadores (validaciones por pasos)
    creatorStepNext(step){
      if(!this.logged()){ this.navigate('#login'); return }
      this.user.creatorApplication = this.user.creatorApplication||{};
      if(step===1){
        const name = ($('#step1DisplayName')?.value||'').trim();
        const bio = ($('#step1Bio')?.value||'').trim();
        if(name.length<3){ toast('Escribe un nombre público'); return }
        if(bio.length<30){ toast('Tu bio debe tener al menos 30 caracteres'); return }
        this.user.creatorApplication.profile = {name,bio}; this.persistUser();
        const dest = routeMap['#creador-paso2']||'creador-paso2.html'; location.href = dest; return;
      }
      if(step===2){
        const country = ($('#taxCountry')?.value||'').trim();
        const payout = ($('#payoutEmail')?.value||'').trim();
        if(!country){ toast('Selecciona tu país'); return }
        if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payout)){ toast('Correo para cobros inválido'); return }
        this.user.creatorApplication.payout = {country,payout}; this.persistUser();
        const dest = routeMap['#creador-paso3']||'creador-paso3.html'; location.href = dest; return;
      }
      if(step===3){
        const ok1 = !!$('#agreeRules')?.checked; const ok2 = !!$('#agreePayments')?.checked;
        if(!ok1||!ok2){ toast('Debes aceptar las directrices y términos de pago'); return }
        this.user.creatorApplication.agreements = {rules:ok1,payments:ok2}; this.persistUser();
        const dest = routeMap['#creador-paso4']||'creador-paso4.html'; location.href = dest; return;
      }
      if(step===4){
        this.user.isCreator=true; this.persistUser();
        this.notify('Felicidades, se ha aprobado tu solicitud para convertirte en un creador, ¡comienza a publicar ahora!', routeMap['#creador']||'creador.html');
        this.notify('Tienes un nuevo comentario en tu historia, ¿quieres desactivar tus notificaciones de comentarios? Haz click aquí', routeMap['#dashboard-autor']||'dashboard-autor.html');
        const dest = routeMap['#creador-confirmado']||'creador-confirmado.html'; location.href = dest; toast('¡Tu cuenta de creador está activa!'); return;
      }
    },
  finishCreatorFlow(){ if(!this.logged()){ this.navigate('#login'); return } this.user.isCreator=true; this.persistUser(); this.notify('Felicidades, se ha aprobado tu solicitud para convertirte en un creador, ¡comienza a publicar ahora!', routeMap['#creador']||'creador.html'); this.notify('Tienes un nuevo comentario en tu historia, ¿quieres desactivar tus notificaciones de comentarios? Haz click aquí', routeMap['#dashboard-autor']||'dashboard-autor.html'); this.navigate('#creador-confirmado'); toast('¡Bienvenido al programa de creadores! 🎉') },
    renderCreator(){ if(!this.logged()){ this.navigate('#login'); return } if(!this.user.isCreator){ this.navigate('#creador-info'); toast('Activa tu cuenta de creador'); return } this.renderMyPosts(); this.renderOtherPosts(); this.updateStats() },
    publish(){
      if(!this.logged()){ this.navigate('#login'); return }
      const t=($('#pubTitle')?.value||'').trim()||'Historia sin título';
      const w=parseInt($('#pubWords')?.value||'1200',10);
      const d=($('#pubDesc')?.value||'').trim()||'Sinopsis breve.';
      const cover=($('#pubCoverUrl')?.value||'').trim();
      const tags=$$('#pubTags .chip.active').map(b=>b.textContent);
      const post={id:Date.now(), titulo:t, autor:this.user.name, words:w, desc:d, views:Math.floor(Math.random()*800)+200, likes:Math.floor(Math.random()*200)+20, cover, tags, chapters:[]};
      this.user.posts.push(post);
      this.persistUser(); this.renderMyPosts(); this.updateStats(); toast('Publicado')
      // refrescar selector de capítulos
      this.populateChapterStorySelect();
    },
    addChapter(){
      if(!this.logged()){ this.navigate('#login'); return }
      const sel=$('#chapStory'); const pid = sel? parseInt(sel.value,10):0;
      const title = ($('#chapTitle')?.value||'').trim();
      const body = ($('#chapBody')?.value||'').trim();
      const img = ($('#chapImage')?.value||'').trim();
      const num = parseInt($('#chapNumber')?.value||'1',10);
      if(!pid || !title || !body){ toast('Completa historia, título y contenido'); return }
      const post=this.user.posts.find(p=>p.id===pid); if(!post){ toast('Historia no encontrada'); return }
      post.chapters = post.chapters||[];
      post.chapters.push({number:num,title,body,img,date:new Date().toLocaleString()});
      this.persistUser(); this.renderMyPosts(); toast('Capítulo publicado');
      // Crear notificación a lectores (simulada para el propio usuario)
      this.notify(`Nuevo capítulo en "${post.titulo}": ${title}`, routeMap['#lector']||'lector.html');
    },
    populateChapterStorySelect(){
      const sel=$('#chapStory'); if(!sel) return; sel.innerHTML='';
      (this.user.posts||[]).forEach(p=>{ const o=document.createElement('option'); o.value=String(p.id); o.textContent=p.titulo; sel.appendChild(o) })
    },
    renderMyPosts(){ const mp=$('#myPosts'); if(!mp) return; mp.innerHTML=''; this.user.posts.forEach(p=>{ const card=document.createElement('div'); card.className='tile'; const img=p.cover?`<img src='${p.cover}' alt='' style='width:100%;max-height:140px;object-fit:cover;border-radius:8px;margin-bottom:8px'>`:''; const tags=(p.tags||[]).map(t=>`<span class='chip'>${t}</span>`).join(' '); const chCount=(p.chapters||[]).length; card.innerHTML=`${img}<div class='meta'><div class='title'>${p.titulo}</div><div class='author'>${p.words} palabras · ❤ ${p.likes} · 👁 ${p.views} · 📑 ${chCount} caps.</div><div class='sub'>${p.desc}</div><div class='badges' style='margin-top:8px'>${tags}</div></div>`; mp.appendChild(card) }); if(!mp.children.length){ mp.innerHTML='<p class="sub">Aún no tienes publicaciones.</p>' } },
    renderOtherPosts(){ const op=$('#otherPosts'); op.innerHTML=''; const demos=[{titulo:'La sombra y el faro',autor:'Creador A',words:3000},{titulo:'Ciudad de vapor',autor:'Creador B',words:2100},{titulo:'Rosas eléctricas',autor:'Creador C',words:1800}]; demos.forEach(p=>{ const card=document.createElement('div'); card.className='tile'; card.innerHTML=`<div class='cover'></div><div class='meta'><div class='title'>${p.titulo}</div><div class='author'>${p.autor} · ${p.words} palabras</div></div>`; op.appendChild(card) }) },
    updateStats(){ const s=$('#stats'); const total=this.user.posts.length; const words=this.user.posts.reduce((a,b)=>a+(b.words||0),0); s.textContent=`${total} publicaciones · ${words} palabras totales` },

    // Sesión
  signIn(){ const name=($('#loginName')?.value||'').trim()||'Lectora'; const email=($('#loginEmail')?.value||'').trim(); this.user={name,email,coins:20,favorites:[],later:[],unlocked:[],comments:{},likedStories:[],likedChapters:[],notifications:[],claimedFree:[],creatorSettings:{notifyComments:true},isCreator:false,posts:[],creatorApplication:{}}; this.persistUser(); toast('¡Bienvenido, '+this.user.name+'!'); this.navigate('#home') },
  finishRegister(){ const name=($('#regName')?.value||'').trim()||'Autora'; this.user={name,email:'',coins:0,favorites:[],later:[],unlocked:[],comments:{},likedStories:[],likedChapters:[],notifications:[],claimedFree:[],creatorSettings:{notifyComments:true},isCreator:false,posts:[],creatorApplication:{}}; this.persistUser(); toast('Cuenta de lector creada 🎉'); this.navigate('#home') },
    signOut(){ 
      this.user=null; 
      localStorage.removeItem(userKey); 
      // Restaurar settings a valores por defecto
      const defaultSettings = { dark:false, fontScale:100, density:'normal', access:{ highContrast:false, dyslexic:false, lineHeight:1.4 } };
      localStorage.setItem(storeKey, JSON.stringify(defaultSettings));
      Object.assign(settings, defaultSettings);
      applySettings();
      toast('Sesión cerrada'); 
      this.navigate('#home'); 
    },

    persistUser(){ localStorage.setItem(userKey, JSON.stringify(this.user)) }
  };
  window.app=app;

  // Texto de muestra real para capítulos
  function sampleText(ch){
    const samples = {
      1: `La biblioteca estaba en silencio cuando entré aquella noche de octubre. Las luces parpadeaban débilmente, proyectando sombras alargadas entre los estantes repletos de volúmenes antiguos. Había venido buscando un libro específico, una edición rara que mi profesor mencionó en clase, pero lo que encontré fue mucho más perturbador.

En la sección de textos prohibidos, apenas visible tras una cortina de polvo, había un volumen sin título. Su cubierta de cuero negro parecía absorber la luz a su alrededor. Cuando lo toqué, sentí un frío penetrante que subía por mi brazo. Las páginas se abrieron solas, revelando palabras escritas en una tinta que cambiaba de color según el ángulo de la luz.

"Quien lea estas líneas deberá pagar el precio del conocimiento", decía la primera página. Debí haberlo cerrado en ese momento. Debí haberlo devuelto a su lugar y olvidarlo. Pero la curiosidad es un veneno dulce, y yo ya había bebido demasiado.

Los días siguientes fueron extraños. Empecé a ver figuras en los rincones de mi visión, siluetas que desaparecían cuando giraba la cabeza. Los susurros comenzaron la tercera noche: voces antiguas hablando en lenguas que no reconocía, pero cuyo significado comprendía con claridad aterradora.

El libro había despertado algo. Y ahora, eso que despertó me buscaba.`,
      
      2: `El jardín apareció después de la primera lluvia de primavera. No es que no hubiera estado allí antes; simplemente, nadie lo había notado. Estaba escondido detrás del viejo edificio de apartamentos, un pequeño terreno baldío que ahora florecía con colores imposibles.

Fue Mariana quien lo descubrió primero. Llevaba semanas sintiéndose perdida, atrapada en una rutina que parecía aplastarla un poco más cada día. Ese día, siguiendo un impulso, tomó un camino diferente de regreso a casa y allí estaba: un jardín secreto lleno de flores que parecían brillar con luz propia.

Entre los pétalos púrpuras y las hojas color esmeralda, encontró algo aún más extraordinario: notas. Pequeños papeles atados a las ramas con hilos de seda, cada uno con un mensaje diferente. "Para quien necesite recordar que la belleza existe", decía uno. "El amor es más fuerte de lo que crees", proclamaba otro.

Empezó a visitarlo cada tarde, leyendo los mensajes, dejando algunos propios. No sabía quién más conocía ese lugar hasta la tarde en que encontró la nota que cambiaría todo: "Hay alguien esperando conocerte. Ven al jardín cuando las cometas vuelen".

Y así, bajo un cielo pintado de naranja y rosa, mientras las cometas de papel danzaban en el viento, Mariana conoció a Tomás. Él también había estado buscando algo sin saberlo. El jardín los había encontrado a ambos.`,
      
      3: `El primer circuito mágico que creé casi me cuesta la vida. Nadie me había advertido que mezclar código y hechicería podía crear un bucle de retroalimentación capaz de freír tanto mi laptop como mi sistema nervioso. Pero así soy yo: aprendo a los golpes.

Me llamo Kai Nova, y vivo en una ciudad donde la magia regresó hace veinte años, justo cuando la tecnología alcanzaba su punto máximo. El resultado fue caótico, hermoso y completamente impredecible. Ahora, los hechiceros llevan smartphones, los algoritmos pueden canalizar energía arcana, y yo... yo estoy atrapada en el medio, tratando de sobrevivir como hacker-hechicera freelance.

Mi último cliente quería algo simple: un programa que pudiera localizar objetos perdidos usando una combinación de GPS y adivinación. Simple, ¿verdad? Excepto que el objeto en cuestión estaba protegido por un encantamiento de ocultación nivel corporativo, probablemente de Techromancy Inc., la megacorporación que controla el 60% de la magia comercial en la ciudad.

Tres días después, estaba en el tejado de un rascacielos, con mi laptop parpadeando símbolos runas mientras trataba de hackear un sistema de defensa que combinaba firewalls y barreras místicas. El viento helado me golpeaba el rostro y los drones de seguridad se acercaban. Tenía treinta segundos antes de que me detectaran.

Fue entonces cuando conocí a Raven. Apareció de la nada, envuelto en sombras digitales, y me ofreció una mano. "¿Necesitas ayuda?", preguntó con una sonrisa. No sabía entonces que aceptar su ayuda me llevaría a descubrir el secreto más peligroso de la ciudad: la magia y la tecnología no habían convergido por accidente.`,
      
      4: `El Café Gris huele a café recién molido, pan dulce y secretos compartidos. Es mi lugar favorito en toda la ciudad, un pequeño refugio en la esquina de una calle que la mayoría de la gente pasa de largo sin siquiera notar.

Vengo aquí todos los martes por la tarde, siempre me siento en la misma mesa junto a la ventana, y observo. Observo cómo la vida pasa afuera mientras adentro el tiempo parece moverse más despacio, más gentil. El dueño, el señor Ramírez, me conoce tan bien que ya no necesito pedir; simplemente trae un café con leche y un trozo de pastel de zanahoria.

Hoy escribo sobre Elena, la violinista callejera que toca en la esquina cada jueves. Tiene setenta y tres años y dice que la música la mantiene joven. Sus dedos artríticos vuelan sobre las cuerdas como si tuvieran vida propia, arrancando melodías que hacen llorar a los transeúntes sin que sepan por qué.

También escribo sobre David, el estudiante de arquitectura que dibuja edificios imposibles en servilletas mientras espera su pedido. Sueña con construir casas que respiren, estructuras que cambien con las estaciones, espacios que sanen a quienes los habitan.

Y escribo sobre mí, claro. Sobre cómo este café se ha convertido en mi ancla en un mundo que gira demasiado rápido. Sobre cómo en estos momentos robados al tiempo, encuentro las palabras que de otro modo permanecerían atrapadas en algún lugar profundo de mi pecho.

El Café Gris es más que un lugar. Es un poema que se escribe cada día con los susurros de extraños que, de alguna manera, se vuelven familia.`,
      
      5: `La primera vez que entrevisté a un gato para mi investigación, mi supervisor académico casi se muere de risa. "¿En serio vas a escribir tu tesis sobre la inteligencia felina?", preguntó entre carcajadas. Tres años después, mi trabajo "El Archivo de los Gatos: Comunicación No Verbal en Felis Catus" está siendo citado en journals de todo el mundo.

Todo comenzó con Merlín, un gato callejero que empezó a visitarme mientras trabajaba en mi tesis de maestría. Notaba cómo observaba mi pantalla, cómo reaccionaba a diferentes sonidos, cómo parecía entender cuando le hablaba. No era solo instinto; había algo más profundo, más consciente en sus ojos dorados.

Empecé a documentar todo: sus patrones de comunicación, las sutiles señales de su cola, el lenguaje de sus orejas, las variaciones en sus vocalizaciones. Instalé cámaras, grabé cientos de horas de video, consulté con etólogos, neurocientíficos y, sí, también con personas que trabajaban en refugios.

Lo que descubrí fue asombroso. Los gatos no solo se comunican de manera compleja entre ellos; han desarrollado un "idioma" específico para interactuar con humanos, adaptando su comportamiento según la personalidad de cada persona. Son, en esencia, bilingües por naturaleza.

Merlín, mi colaborador más importante, ahora vive conmigo. Cada mañana, mientras escribo, se sienta en el alféizar de la ventana y observa el mundo exterior. A veces me pregunto qué archivos guarda en su mente, qué secretos felinos conoce que yo apenas estoy comenzando a descubrir.

Este libro es un tributo a todos los gatos que nos han elegido como compañeros, y una invitación a mirarlos con nuevos ojos.`,
      
      6: `La ciudad cantaba, aunque nadie lo notaba. Sus canciones estaban tejidas en el viento que silbaba entre los edificios, en el ritmo de los pasos sobre el pavimento, en el murmullo constante de miles de conversaciones superpuestas. Para la mayoría, era solo ruido. Para mí, era una sinfonía.

Me llamo Noa Sol y tengo diecisiete años. También tengo un secreto: puedo escuchar la música de las ciudades. No es sinestesia ni una metáfora poética. Es real. Cada lugar tiene su propia melodía, su propio tono emocional que vibra en frecuencias que la mayoría de las personas no pueden percibir.

Todo cambió el día que la canción de mi ciudad comenzó a desafinarse. Notas discordantes empezaron a aparecer en la armonía, como si algo estuviera envenenando la música misma. Desperté con dolores de cabeza insoportables, sintiéndome nauseabunda cada vez que salía a la calle.

Mis amigos pensaron que estaba enferma. Mi mamá me llevó a tres doctores diferentes. Pero yo sabía que el problema no era conmigo; era con la ciudad. Algo estaba matando su canción, silenciando su voz poco a poco. Y si no hacía algo, pronto solo quedaría silencio.

Así fue como conocí a los otros Cantantes: un grupo secreto de personas como yo, esparcidas por el mundo, cada una protegiendo la música de su hogar. Me enseñaron que las ciudades son seres vivos, conscientes de maneras que apenas comprendemos. Y cuando una ciudad muere, se lleva consigo parte del alma de todos quienes vivieron en ella.

Ahora tengo una misión: encontrar qué está silenciando la canción de mi ciudad antes de que sea demasiado tarde. Y en el camino, descubriré que la música no es solo sonido. Es memoria, es amor, es la hebra invisible que conecta a cada persona con el lugar que llama hogar.`
    };
    
    // Retornar texto específico del capítulo o el primero por defecto
    return samples[ch] || samples[1];
  }

  // Bootstrap
  window.addEventListener('DOMContentLoaded',()=>{
    // Preparar chips desde categorías (deduplicar para evitar bloques repetidos)
    app.chips = (()=>{
      const list = Object.keys(app.categories).reduce((acc,k)=> acc.concat([k, ...app.categories[k]]), []);
      return Array.from(new Set(list));
    })();
    // Toggle categorías
    $('#catBtn')?.addEventListener('click',()=> $('#catPanel').classList.toggle('open'));
    // Búsqueda header
    $('#searchForm')?.addEventListener('submit',(e)=>{ e.preventDefault(); app.search() });

    // Catalog-dependent rendering encapsulated so we can refresh UI after loading external books.json
    function renderCatalogUI(){
      const carTrack=$('#carousel-populares');
      if(carTrack){ carTrack.innerHTML=''; app.catalogo.forEach(x=>carTrack.appendChild(bookCard(x,(it)=>app.openStory(it)))); $('#carPrev')?.addEventListener('click',()=> carTrack.scrollBy({left:-300,behavior:'smooth'})); $('#carNext')?.addEventListener('click',()=> carTrack.scrollBy({left:300,behavior:'smooth'})); }

      const hgrid=$('#homeGrid'); if(hgrid){ hgrid.innerHTML=''; app.catalogo.concat(app.catalogo).forEach(x=>hgrid.appendChild(bookTile(x,(it)=>app.openStory(it)))) }
      const all=$('#allChips'); if(all && !all.children.length){ app.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>app.filter(n,'catGrid')); all.appendChild(b) }) }
      const cg=$('#catGrid'); if(cg){
        const renderList=(list)=>{ cg.innerHTML=''; list.forEach(x=>cg.appendChild(bookTile(x,(it)=>app.openStory(it)))) };
        // Render initial catalog (use current app.catalogo)
        renderList(app.catalogo.concat(app.catalogo));
      }
    }

    // Grids
  // Render catalog dependent UI now (fallback) — will be called again if we load external data
  renderCatalogUI();

  // Try to load an external books JSON to replace/enrich the catalog. If it loads, refresh UI.
  try{
    fetch('assets/data/books.json').then(r=>{ if(!r.ok) throw new Error('no data'); return r.json() }).then(data=>{
      if(Array.isArray(data) && data.length){ app.catalogo = data; renderCatalogUI(); }
    }).catch(()=>{/* ignore and keep fallback */});
  }catch(e){ /* ignore */ }

    // Avanzada chips
    const adv=$('#advCats'); if(adv && !adv.children.length){ app.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>b.classList.toggle('active')); adv.appendChild(b) }) }

    // Monedas: hidratar balance y acciones gratis
    if($('#monedas')){
      app.updateCoinsUI();
      // Enlazar botones de formas gratis si existen
      $('#free_profile')?.addEventListener('click',()=>app.earnFreeCoins('perfil'));
      $('#free_read')?.addEventListener('click',()=>app.earnFreeCoins('capitulos'));
      $('#free_comments')?.addEventListener('click',()=>app.earnFreeCoins('comentarios'));
      $('#free_streak')?.addEventListener('click',()=>app.earnFreeCoins('racha'));
      // Botón volver: a historia si existe, si no a inicio
      const back=$('#coinsBackBtn');
      if(back){
        back.addEventListener('click',()=>{
          try{ const st=JSON.parse(localStorage.getItem('sn_current_story')||'null'); if(st){ app.navigate('#historia'); return } }catch{}
          app.navigate('#home');
        });
      }
    }

    // Top categories horizontal con subcategorías desplegables
  const tc=$('#topCats'); if(tc){
      tc.innerHTML='';
      Object.keys(app.categories).forEach(cat=>{
        const btn=el('button','cat-main-btn',cat);
        btn.addEventListener('click',(e)=>{
          e.stopPropagation();
          const existing=tc.querySelector('.cat-submenu');
          if(existing && existing.dataset.parent===cat){ existing.remove(); return }
          if(existing) existing.remove();
          const sub=el('div','cat-submenu'); sub.dataset.parent=cat;
          app.categories[cat].forEach(s=>{ const c=el('button','chip',s); c.addEventListener('click',()=>{ $('#catPanel').classList.remove('open');
            try{ localStorage.setItem('sn_filter_tag', s) }catch{}
            location.href = routeMap['#categorias']||'categorias.html';
          }); sub.appendChild(c) });
          btn.after(sub);
        });
        tc.appendChild(btn);
      });
    }

    // Cerrar menú categorías al hacer clic fuera
    document.addEventListener('click',(e)=>{
      const panel=$('#catPanel'); const catBtn=$('#catBtn');
      if(panel && !panel.contains(e.target) && e.target!==catBtn){ panel.classList.remove('open') }
    });

    // Navegación con data-goto (redirige a archivos .html)
    document.addEventListener('click',(e)=>{
      const tgt=e.target.closest('[data-goto]');
      if(!tgt) return;
      e.preventDefault();
      const dest=tgt.getAttribute('data-goto');
      // Restringir centro de creadores a usuarios creadores
      if(dest==='#creador' || dest==='#dashboard-autor'){
        if(!(app.logged() && app.user.isCreator)){
          toast('Activa tu cuenta de creador para acceder');
          const info = routeMap['#creador-info']||'creador-info.html';
          location.href = info; return;
        }
      }
      if(routeMap[dest]){ location.href = routeMap[dest] + dest; }
      else if(dest && dest.startsWith('#')){ location.href = dest.slice(1)+'.html' + dest }
    });

    // Si estamos en resultados de búsqueda (busqueda.html), hidratar desde localStorage
    const searchGrid = $('#searchGrid');
    if(searchGrid){
      let lastQ=null; try{ lastQ = localStorage.getItem('sn_search_q') }catch{}
      if((lastQ||'').trim()){
        const q = lastQ.trim(); const k=$('#kword'); if(k) k.textContent = `"${q}"`;
        searchGrid.innerHTML='';
        app.catalogo.filter(x=>x.titulo.toLowerCase().includes(q.toLowerCase()) || x.autor.toLowerCase().includes(q.toLowerCase()) || (x.tags||[]).some(t=>t.toLowerCase().includes(q.toLowerCase()))).forEach(x=> searchGrid.appendChild(bookTile(x,(it)=>app.openStory(it))));
        if(!searchGrid.children.length){ searchGrid.innerHTML = '<p class="sub">No encontramos resultados.</p>' }
      }
    }

    // Ajustes de autor (dashboard)
    const acb = $('#authorNotifComments');
    if(acb){
      if(app.user){ acb.checked = !!(app.user.creatorSettings?.notifyComments) }
      acb.addEventListener('change',()=>{
        if(!app.user) return; app.user.creatorSettings = app.user.creatorSettings||{};
        app.user.creatorSettings.notifyComments = !!acb.checked;
        app.persistUser();
        toast(acb.checked?'Notificaciones de comentarios activadas':'Notificaciones de comentarios desactivadas');
      });
    }


    // Si estamos en página de historia (historia.html), hidratar desde localStorage
    if($('#historia')){
      let story=null; try{ story = JSON.parse(localStorage.getItem('sn_current_story')||'null') }catch{}
      if(story){
        app.currentStory=story;
        $('#storyTitle').textContent=story.titulo;
        $('#storyAuthor').textContent='por '+story.autor;
        const tagC=$('#storyTags'); tagC.innerHTML='';
        (story.tags||[]).forEach(t=>tagC.appendChild(el('span','chip',t)));
        const ch=$('#chapters'); ch.innerHTML='';
        for(let i=1;i<=12;i++){
          const b=el('button','chip','Capítulo '+i + (i>3?' 🔒':''));
          b.addEventListener('click',()=>{
            app.chapter=i;
            try{ localStorage.setItem('sn_current_chapter', String(i)) }catch{}
            const dest = routeMap['#lector']||'lector.html';
            location.href = dest;
          });
          ch.appendChild(b)
        }
        app.renderFavBtn();
      }
      // Enlazar botón de apoyo a creador si existe
      const supportBtn = $('#supportBtn');
      if(supportBtn) {
        supportBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if(app.openSupport) app.openSupport();
        });
      }
    }

    // Si estamos en creador.html preparar UI de publicación
    if($('#creador')){
      const pt=$('#pubTags'); if(pt && !pt.children.length){ app.chips.forEach(n=>{ const b=el('button','chip',n); b.addEventListener('click',()=>b.classList.toggle('active')); pt.appendChild(b) }) }
      app.populateChapterStorySelect();
      // Comentarios recientes simulados
      const rc = $('#recentComments'); if(rc){ rc.innerHTML = ['Excelente primer capítulo','Me encantó el giro final','¿Cuándo sale el próximo?','Gran ambientación'].slice(0,4).map(t=>`<div>💬 ${t}</div>`).join('') }
    }

    // Si estamos en apoyo.html, mostrar la sección de apoyo si existe el hash o llamada directa
    if($('#apoyo')) {
      if(location.hash === '#apoyo' || location.pathname.endsWith('apoyo.html')) {
        $('#apoyo').classList.remove('hidden');
      }
    }

    // Si estamos en página de lector (lector.html), hidratar desde localStorage
    if($('#lector')){
      let story=null, chapter=1;
      try{ story = JSON.parse(localStorage.getItem('sn_current_story')||'null') }catch{}
      try{ chapter = parseInt(localStorage.getItem('sn_current_chapter')||'1',10) }catch{}
      if(story){
        app.currentStory=story;
        app.chapter=chapter;
        const paid=chapter>3; 
        const unlocked=app.logged() && app.user.unlocked.includes(`${story.id}-${chapter}`);
        $('#chapterHeading').textContent=`Capítulo ${chapter} · Título provisional`;
        const text=sampleText(chapter);
        if(paid && !unlocked){
          $('#lockNotice').classList.remove('hidden');
          $('#unlockBar').classList.remove('hidden');
          const ct=$('#chapterText');
          ct.textContent=text;
          ct.classList.add('preview-locked');
        } else {
          $('#lockNotice').classList.add('hidden');
          $('#unlockBar').classList.add('hidden');
          const ct=$('#chapterText');
          ct.classList.remove('preview-locked');
          ct.textContent=text;
        }
        app.renderComments();
      }
    }

    // Carga directa de páginas de favoritos/later/perfil: renderizar y normalizar hash
    if($('#favoritos')){ if(!location.hash || location.hash!=='#favoritos'){ try{ history.replaceState({},'', '#favoritos') }catch{} } app.renderFavs(); }
    if($('#later')){ if(!location.hash || location.hash!=='#later'){ try{ history.replaceState({},'', '#later') }catch{} } app.renderLater(); }
    if($('#perfil')){ if(!location.hash || location.hash!=='#perfil'){ try{ history.replaceState({},'', '#perfil') }catch{} } app.renderProfile(); }

  // Preferencias (pantalla)
  $$('.openSettingsBtn').forEach(b=> b.addEventListener('click',()=>app.navigate('#config')));
    $('#saveSettingsBtn')?.addEventListener('click',()=>saveSettings());
    $('#closeSettingsBtn')?.addEventListener('click',()=>closeSettings());
    // Aplicar cambios de dark mode al instante desde Config o Preferencias
    $('#cfgDark')?.addEventListener('change',()=>{ settings.dark = !!$('#cfgDark').checked; localStorage.setItem(storeKey, JSON.stringify(settings)); applySettings(); });
    $('#toggleDark')?.addEventListener('change',()=>{ settings.dark = !!$('#toggleDark').checked; localStorage.setItem(storeKey, JSON.stringify(settings)); applySettings(); });

    // Modal Info creador (soporta varios botones)
    $$('#btnInfoCreador, .btnInfoCreador').forEach(b=> b.addEventListener('click',()=> $('#creatorInfoMask').style.display='flex'));
    $('#closeCreatorInfoBtn')?.addEventListener('click',()=> $('#creatorInfoMask').style.display='none');

    // Acordeón de cobros
    $$('.ac-item .ac-head').forEach(head=> head.addEventListener('click',()=> head.parentElement.classList.toggle('open')));

  // Render header inicial + Config
  renderConfigScreen();
    app.renderHeader();
    
    // Ocultar hero de bienvenida si hay sesión iniciada
    if(app.logged()){
      const hero = $('.hero');
      if(hero){ hero.style.display = 'none' }
    }

    // Ajustar enlaces del footer relacionados a creadores según el rol
    if(!(app.user?.isCreator)){
      $$('a[data-goto="#creador"]').forEach(a=>{ a.setAttribute('data-goto','#creador-info'); a.textContent='Conviértete en creador' });
    }

    // Arranque: solo en páginas con múltiples secciones
    const screens=$$('[data-screen]');
    if(screens.length>1){ app.navigate(location.hash||'#home') }
  });

  // Configuración (pantalla)
  function renderConfigScreen(){
    // Cuenta
    if(app.user){ 
      if($('#cfgName')) $('#cfgName').value=app.user.name||''; 
      if($('#cfgEmail')) $('#cfgEmail').value=app.user.email||''; 
      if($('#cfgAvatarPreview')){ 
        if(app.user.photo){ 
          $('#cfgAvatarPreview').src=app.user.photo; 
          $('#cfgAvatarPreview').style.display='block';
          const placeholder = $('#cfgAvatarPlaceholder');
          if(placeholder) placeholder.style.display='none';
        } else { 
          $('#cfgAvatarPreview').removeAttribute('src');
          $('#cfgAvatarPreview').style.display='none';
          const placeholder = $('#cfgAvatarPlaceholder');
          if(placeholder) placeholder.style.display='inline';
        } 
      } 
    }
    // UI
  if($('#cfgDark')) $('#cfgDark').checked=!!settings.dark; if($('#cfgFont')) $('#cfgFont').value=String(settings.fontScale); if($('#cfgDensity')) $('#cfgDensity').value=settings.density;
  // Accessibility UI
  if($('#cfgHighContrast')) $('#cfgHighContrast').checked = !!(settings.access && settings.access.highContrast);
  if($('#cfgDyslexic')) $('#cfgDyslexic').checked = !!(settings.access && settings.access.dyslexic);
  if($('#cfgLineHeight')) $('#cfgLineHeight').value = (settings.access && settings.access.lineHeight) ? String(settings.access.lineHeight) : '1.4';
    // Pago
    const card=app.user?.payment?.card; if($('#cfgCardMasked')) $('#cfgCardMasked').value = card? `${card.brand} •••• ${card.last4}` : 'Sin tarjeta';
    // Compras
    const p=app.user?.purchases||[]; if($('#cfgPurchases')) $('#cfgPurchases').innerHTML = p.length? p.slice(-5).reverse().map(x=>`• ${x.date} · ${x.type} ${x.amount}`).join('<br>') : '—';
    // Historial
    const h=app.user?.history||[]; if($('#cfgHistory')) $('#cfgHistory').innerHTML = h.length? h.slice(-10).reverse().map(x=>`• ${x.date} · ${x.title}`).join('<br>') : '—';
  }

  $('#cfgSaveAccount')?.addEventListener('click',()=>{
    if(!app.user){ toast('Inicia sesión'); app.navigate('#login'); return }
    app.user.name = ($('#cfgName')?.value||app.user.name).trim();
    // Nota: no actualizamos correo desde aquí por petición del usuario. Contacta soporte para cambiar email.
    if(($('#cfgPass')?.value||'').trim()){ toast('Contraseña actualizada'); $('#cfgPass').value='' }
    app.persistUser(); toast('Cambios guardados'); app.renderHeader();
  });
  // Subir foto de perfil y previsualizar
  $('#cfgPhotoFile')?.addEventListener('change',(e)=>{
    const file=e.target.files&&e.target.files[0]; if(!file) return;
    const reader=new FileReader(); 
    reader.onload=()=>{ 
      if(!app.user){ return } 
      app.user.photo = reader.result; 
      app.persistUser(); 
      if($('#cfgAvatarPreview')){
        $('#cfgAvatarPreview').src = app.user.photo;
        $('#cfgAvatarPreview').style.display='block';
        const placeholder = $('#cfgAvatarPlaceholder');
        if(placeholder) placeholder.style.display='none';
      }
      app.renderHeader(); 
      toast('Foto de perfil actualizada','success');
    }; 
    reader.readAsDataURL(file);
  });
  $('#cfgSaveUI')?.addEventListener('click',()=>{
    settings.dark = !!($('#cfgDark')?.checked);
    settings.fontScale = parseInt($('#cfgFont')?.value||'100',10);
    settings.density = $('#cfgDensity')?.value||'normal';
    // Do not overwrite accessibility here (handled separately)
    localStorage.setItem(storeKey, JSON.stringify(settings));
    applySettings(); toast('Apariencia guardada');
  });
  // Accessibility save handler (separate to make intent clear)
  $('#cfgSaveUI_access')?.addEventListener('click',()=>{
    settings.access = settings.access || {};
    settings.access.highContrast = !!($('#cfgHighContrast')?.checked);
    settings.access.dyslexic = !!($('#cfgDyslexic')?.checked);
    settings.access.lineHeight = parseFloat($('#cfgLineHeight')?.value||'1.4');
    localStorage.setItem(storeKey, JSON.stringify(settings));
    applySettings(); toast('Accesibilidad guardada');
  });
  $('#cfgSaveCard')?.addEventListener('click',()=>{
    if(!app.user){ toast('Inicia sesión'); app.navigate('#login'); return }
    const num=(($('#cfgCardNumber')?.value)||'').replace(/\s+/g,'');
    const expiry = ($('#cfgExpiry')?.value||'').trim();
    const cvc = ($('#cfgCVC')?.value||'').trim();
    
    // Validaciones
    if(!num || num.length<13 || num.length>19){ toast('Número de tarjeta inválido'); return }
    if(!/^\d+$/.test(num)){ toast('El número de tarjeta solo debe contener dígitos'); return }
    
    if(expiry){
      if(!/^\d{2}\/\d{2}$/.test(expiry)){ toast('Fecha de vencimiento debe ser MM/AA'); return }
      const [mm,aa] = expiry.split('/').map(x=>parseInt(x,10));
      if(mm<1 || mm>12){ toast('Mes inválido (01-12)'); return }
      const currentYear = new Date().getFullYear()%100;
      const currentMonth = new Date().getMonth()+1;
      if(aa<currentYear || (aa===currentYear && mm<currentMonth)){ toast('Tarjeta vencida'); return }
    }
    
    if(cvc && (cvc.length<3 || cvc.length>4 || !/^\d+$/.test(cvc))){ toast('CVC inválido (3-4 dígitos)'); return }
    
    const brand = num.startsWith('4')? 'Visa' : num.startsWith('5')? 'Mastercard' : 'Tarjeta';
    const last4 = num.slice(-4);
    app.user.payment = app.user.payment||{}; app.user.payment.card={brand,last4}; app.persistUser();
    if($('#cfgCardMasked')) $('#cfgCardMasked').value=`${brand} •••• ${last4}`; 
    $('#cfgCardNumber').value=''; $('#cfgExpiry').value=''; $('#cfgCVC').value='';
    toast('Tarjeta guardada correctamente');
  });
  
  // Formateo automático en config
  $('#cfgCardNumber')?.addEventListener('input',function(e){
    let v = e.target.value.replace(/\s+/g,'').replace(/[^0-9]/g,'');
    let formatted = v.match(/.{1,4}/g)?.join(' ')||v;
    e.target.value = formatted;
  });
  $('#cfgExpiry')?.addEventListener('input',function(e){
    let v = e.target.value.replace(/[^0-9]/g,'');
    if(v.length>=2){ v = v.slice(0,2)+'/'+v.slice(2,4) }
    e.target.value = v;
  });
  $('#cfgCVC')?.addEventListener('input',function(e){
    e.target.value = e.target.value.replace(/[^0-9]/g,'').slice(0,4);
  });

  // Función global de validación de pago
  window.validateAndPay = function(){
    const savedBox=$('#savedCardBox');
    const usingSaved = savedBox && !savedBox.classList.contains('hidden');
    
    if(usingSaved){
      // Usar tarjeta guardada
      app.finishPay(true);
      return;
    }
    
    // Validar nueva tarjeta
    const holder = ($('#payCardHolder')?.value||'').trim();
    const number = ($('#payCardNumber')?.value||'').replace(/\s+/g,'');
    const expiry = ($('#payExpiry')?.value||'').trim();
    const cvc = ($('#payCVC')?.value||'').trim();
    const country = ($('#payCountry')?.value||'').trim();
    const shouldSave = !!$('#paySaveCard')?.checked;
    
    // Validaciones
    if(!holder || holder.length<3){ toast('Ingresa el titular de la tarjeta'); return }
    if(!number || number.length<13 || number.length>19){ toast('Número de tarjeta inválido'); return }
    if(!/^\d+$/.test(number)){ toast('El número de tarjeta solo debe contener dígitos'); return }
    
    // Validar fecha MM/AA
    if(!expiry || !/^\d{2}\/\d{2}$/.test(expiry)){ toast('Fecha de vencimiento debe ser MM/AA'); return }
    const [mm,aa] = expiry.split('/').map(x=>parseInt(x,10));
    if(mm<1 || mm>12){ toast('Mes inválido (01-12)'); return }
    const currentYear = new Date().getFullYear()%100;
    const currentMonth = new Date().getMonth()+1;
    if(aa<currentYear || (aa===currentYear && mm<currentMonth)){ toast('Tarjeta vencida'); return }
    
    if(!cvc || cvc.length<3 || cvc.length>4){ toast('CVC inválido (3-4 dígitos)'); return }
    if(!/^\d+$/.test(cvc)){ toast('CVC solo debe contener dígitos'); return }
    if(!country){ toast('Ingresa tu país'); return }
    
    // Determinar marca
    const brand = number.startsWith('4')? 'Visa' : number.startsWith('5')? 'Mastercard' : 'Tarjeta';
    const last4 = number.slice(-4);
    
    app.finishPay(true, shouldSave? {save:true, brand, last4} : null);
  };

  // Formateo automático de campos
  $('#payCardNumber')?.addEventListener('input',function(e){
    let v = e.target.value.replace(/\s+/g,'').replace(/[^0-9]/g,'');
    let formatted = v.match(/.{1,4}/g)?.join(' ')||v;
    e.target.value = formatted;
  });
  $('#payExpiry')?.addEventListener('input',function(e){
    let v = e.target.value.replace(/[^0-9]/g,'');
    if(v.length>=2){ v = v.slice(0,2)+'/'+v.slice(2,4) }
    e.target.value = v;
  });
  $('#payCVC')?.addEventListener('input',function(e){
    e.target.value = e.target.value.replace(/[^0-9]/g,'').slice(0,4);
  });
})();