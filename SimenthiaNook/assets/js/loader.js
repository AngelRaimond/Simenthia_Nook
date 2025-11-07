// Sistema de carga de pantallas modulares
(function(){
  const screens = {
    home: 'pages/screens/home.html',
    categorias: 'pages/screens/categorias.html',
    busqueda: 'pages/screens/busqueda.html',
    'busqueda-avanzada': 'pages/screens/busqueda-avanzada.html',
    historia: 'pages/screens/historia.html',
    apoyo: 'pages/screens/apoyo.html',
    lector: 'pages/screens/lector.html',
    login: 'pages/screens/login.html',
    registro: 'pages/screens/registro.html',
    monedas: 'pages/screens/monedas.html',
    favoritos: 'pages/screens/favoritos.html',
    later: 'pages/screens/later.html',
    perfil: 'pages/screens/perfil.html',
    config: 'pages/screens/config.html',
    'creador-info': 'pages/screens/creador-info.html',
    'creador-paso1': 'pages/screens/creador-paso1.html',
    'creador-paso2': 'pages/screens/creador-paso2.html',
    'creador-paso3': 'pages/screens/creador-paso3.html',
    'creador-paso4': 'pages/screens/creador-paso4.html',
    'creador-confirmado': 'pages/screens/creador-confirmado.html',
    creador: 'pages/screens/creador.html',
    'dashboard-autor': 'pages/screens/dashboard-autor.html',
    cargando: 'pages/screens/cargando.html',
    error: 'pages/screens/error.html'
  };

  const cache = {};
  
  async function loadScreen(screenId) {
    if (cache[screenId]) return cache[screenId];
    
    const path = screens[screenId];
    if (!path) return null;
    
    try {
      const response = await fetch(path);
      const html = await response.text();
      cache[screenId] = html;
      return html;
    } catch (error) {
      console.error(`Error cargando pantalla ${screenId}:`, error);
      return null;
    }
  }

  window.screenLoader = { loadScreen, screens };
})();
