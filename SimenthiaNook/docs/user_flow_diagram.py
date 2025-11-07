"""
Script para generar diagrama de flujo de usuario de Smintheia Nook
Muestra todas las acciones y navegación que un usuario puede hacer en la aplicación
"""

import os
import sys

# Intentar importar graphviz, si no está instalado dar instrucciones
try:
    from graphviz import Digraph
except ImportError:
    print("Para ejecutar este script necesitas instalar graphviz:")
    print("pip install graphviz")
    print("\nTambién necesitas el software Graphviz instalado en tu sistema:")
    print("https://graphviz.org/download/")
    exit(1)

# En Windows, intentar añadir rutas comunes de Graphviz al PATH automáticamente
def ensure_graphviz_path():
    if sys.platform.startswith('win'):
        common_paths = [
            r"C:\\Program Files\\Graphviz\\bin",
            r"C:\\Program Files (x86)\\Graphviz\\bin",
        ]
        current_path = os.environ.get('PATH', '')
        for p in common_paths:
            if os.path.isdir(p) and p not in current_path:
                os.environ['PATH'] = p + os.pathsep + current_path

ensure_graphviz_path()

def create_user_flow_diagram():
    """Crea el diagrama de flujo completo de usuario"""
    
    # Crear diagrama con estilo personalizado
    dot = Digraph(comment='Smintheia Nook - Flujo de Usuario')
    dot.attr(rankdir='TB', size='20,20', bgcolor='#f3f4f8')
    dot.attr('node', shape='box', style='rounded,filled', fontname='Arial', fontsize='11')
    dot.attr('edge', fontname='Arial', fontsize='9', color='#6e38ff')
    
    # ==================== PÁGINAS PRINCIPALES ====================
    
    # Inicio (sin sesión)
    dot.node('index', 'INICIO\n(index.html)\n\n• Ver catálogo\n• Carrusel populares\n• Buscar historias', 
             fillcolor='#7b5cff', fontcolor='white', shape='box', style='rounded,filled,bold')
    
    # Login y Registro
    dot.node('login', 'INICIAR SESIÓN\n(login.html)\n\n• Ingresar nombre/email\n• Acceder con cuenta', 
             fillcolor='#e6e7ee', fontcolor='#12131a')
    dot.node('registro', 'REGISTRO\n(registro.html)\n\n• Crear cuenta nueva\n• Recibir 0 monedas iniciales', 
             fillcolor='#e6e7ee', fontcolor='#12131a')
    
    # Búsqueda
    dot.node('busqueda', 'RESULTADOS BÚSQUEDA\n(busqueda.html)\n\n• Ver resultados\n• Abrir historia', 
             fillcolor='#f0f1f5', fontcolor='#12131a')
    dot.node('busqueda_avanzada', 'BÚSQUEDA AVANZADA\n(busqueda-avanzada.html)\n\n• Filtrar por título\n• Filtrar por autor\n• Filtrar por palabras\n• Seleccionar categorías\n• Ver resultados filtrados', 
             fillcolor='#f0f1f5', fontcolor='#12131a')
    
    # Categorías
    dot.node('categorias', 'CATEGORÍAS\n(categorias.html)\n\n• Ver todas las historias\n• Explorar por género\n• Abrir historia', 
             fillcolor='#f0f1f5', fontcolor='#12131a')
    
    # Historia (detalle)
    dot.node('historia', 'DETALLE HISTORIA\n(historia.html)\n\n• Ver sinopsis\n• Ver capítulos (12)\n• ❤ Dar Me gusta\n• ⭐ Agregar a favoritos\n• 🕑 Guardar para después\n• 💰 Apoyar a creador\n• Abrir capítulo', 
             fillcolor='#fff0f4', fontcolor='#12131a', style='rounded,filled,bold')
    
    # Lector
    dot.node('lector', 'LECTOR\n(lector.html)\n\n• Leer capítulo\n• ❤ Me gusta capítulo\n• 💬 Comentar\n• ⬅️ Capítulo anterior\n• ➡️ Capítulo siguiente\n• 🏠 Volver al inicio\n• 🔓 Desbloquear (cap 4-12)', 
             fillcolor='#fff9e6', fontcolor='#12131a', style='rounded,filled,bold')
    
    # ==================== SISTEMA DE MONEDAS ====================
    
    dot.node('monedas', 'MONEDAS\n(monedas.html)\n\n• Ver balance actual\n• 💳 Comprar paquetes:\n  - 100 monedas\n  - 500 monedas\n  - 1000 monedas\n• 🎁 Ganar gratis (+5):\n  - Completar perfil\n  - Leer 5 capítulos\n  - Comentar 3 veces\n  - Racha de 7 días\n• ← Volver', 
             fillcolor='#fef3c7', fontcolor='#12131a', style='rounded,filled,bold')
    
    dot.node('apoyo', 'APOYAR CREADOR\n(apoyo.html)\n\n• Ver historia a apoyar\n• Seleccionar monto:\n  - 20 monedas\n  - 50 monedas\n  - 100 monedas\n• Escribir mensaje\n• Enviar donación', 
             fillcolor='#fef3c7', fontcolor='#12131a')
    
    # ==================== LISTAS PERSONALES ====================
    
    dot.node('favoritos', 'FAVORITOS\n(favoritos.html)\n\n• Ver historias favoritas\n• Abrir historia\n• Eliminar de favoritos', 
             fillcolor='#fce7f3', fontcolor='#12131a')
    
    dot.node('later', 'LEER MÁS TARDE\n(later.html)\n\n• Ver lista guardada\n• Abrir historia\n• Eliminar de lista', 
             fillcolor='#e0e7ff', fontcolor='#12131a')
    
    # ==================== PERFIL Y CONFIGURACIÓN ====================
    
    dot.node('perfil', 'PERFIL\n(perfil.html)\n\n• Ver nombre y email\n• Ver rol (Lector/Creador)\n• 🔔 Ver notificaciones\n• Enlaces rápidos:\n  - Favoritos\n  - Leer más tarde\n  - Monedas\n  - Configuración\n• Ir a creador (si aplica)', 
             fillcolor='#dbeafe', fontcolor='#12131a', style='rounded,filled,bold')
    
    dot.node('config', 'CONFIGURACIÓN\n(config.html)\n\n📝 CUENTA:\n• Cambiar nombre\n• Subir foto perfil\n• Cambiar contraseña\n\n🎨 APARIENCIA:\n• Modo oscuro\n• Tamaño fuente (90-110%)\n• Densidad (normal/compacta)\n\n♿ ACCESIBILIDAD:\n• Alto contraste\n• Fuente dyslexic-friendly\n• Interlineado (1.2-1.6)\n\n💳 PAGO:\n• Guardar tarjeta\n\n📊 HISTORIAL:\n• Ver compras\n• Ver lecturas', 
             fillcolor='#dbeafe', fontcolor='#12131a', style='rounded,filled,bold')
    
    # ==================== FLUJO DE CREADORES ====================
    
    # Onboarding creador
    dot.node('creador_info', 'INFO CREADORES\n(creador-info.html)\n\n• Conocer el programa\n• Solicitar cuenta creador', 
             fillcolor='#e9d5ff', fontcolor='#12131a')
    
    dot.node('creador_paso1', 'PASO 1: PERFIL\n(creador-paso1.html)\n\n• Nombre público\n• Biografía (min 30 char)', 
             fillcolor='#e9d5ff', fontcolor='#12131a')
    
    dot.node('creador_paso2', 'PASO 2: FISCALES\n(creador-paso2.html)\n\n• País\n• Email para cobros', 
             fillcolor='#e9d5ff', fontcolor='#12131a')
    
    dot.node('creador_paso3', 'PASO 3: TÉRMINOS\n(creador-paso3.html)\n\n• Aceptar directrices\n• Aceptar términos pago', 
             fillcolor='#e9d5ff', fontcolor='#12131a')
    
    dot.node('creador_paso4', 'PASO 4: VERIFICACIÓN\n(creador-paso4.html)\n\n• Esperar aprobación\n• Enviar solicitud', 
             fillcolor='#e9d5ff', fontcolor='#12131a')
    
    dot.node('creador_confirmado', 'CONFIRMACIÓN\n(creador-confirmado.html)\n\n• ¡Cuenta activa!\n• Ir a centro creador', 
             fillcolor='#bbf7d0', fontcolor='#12131a')
    
    # Centro de creador
    dot.node('creador', 'CENTRO CREADOR\n(creador.html)\n\n📝 PUBLICAR NUEVO:\n• Título\n• Descripción\n• Palabras\n• 📷 Foto portada\n• 🏷️ Etiquetas\n• Publicar\n\n➕ AÑADIR CAPÍTULO:\n• Seleccionar historia\n• Título capítulo\n• Número\n• 📷 Imagen\n• Contenido\n• Publicar\n\n📊 ESTADÍSTICAS:\n• Publicaciones totales\n• Palabras escritas\n\n💬 VER COMENTARIOS:\n• Ir a dashboard\n\n📚 MIS PUBLICACIONES:\n• Ver historias propias', 
             fillcolor='#c7d2fe', fontcolor='#12131a', style='rounded,filled,bold')
    
    dot.node('dashboard_autor', 'DASHBOARD AUTOR\n(dashboard-autor.html)\n\n• Ver comentarios recibidos\n• Responder comentarios\n• ⚙️ Ajustes:\n  - Activar/desactivar\n    notificaciones comentarios', 
             fillcolor='#c7d2fe', fontcolor='#12131a')
    
    # ==================== NAVEGACIÓN PRINCIPAL ====================
    
    # Desde inicio
    dot.edge('index', 'login', label='Sin sesión\nIniciar sesión')
    dot.edge('index', 'registro', label='Sin sesión\nRegistrarse')
    dot.edge('index', 'busqueda', label='Buscar')
    dot.edge('index', 'busqueda_avanzada', label='Búsqueda\navanzada')
    dot.edge('index', 'categorias', label='Explorar\ncategorías')
    dot.edge('index', 'historia', label='Abrir\nhistoria')
    dot.edge('index', 'creador_info', label='Info\ncreadores')
    
    # Login/Registro
    dot.edge('login', 'index', label='Iniciar sesión\n(20 monedas)')
    dot.edge('registro', 'index', label='Registrarse\n(0 monedas)')
    
    # Búsqueda
    dot.edge('busqueda', 'historia', label='Abrir\nhistoria')
    dot.edge('busqueda_avanzada', 'historia', label='Abrir\nhistoria')
    
    # Categorías
    dot.edge('categorias', 'historia', label='Abrir\nhistoria')
    
    # Historia (hub central)
    dot.edge('historia', 'lector', label='Leer\ncapítulo')
    dot.edge('historia', 'apoyo', label='Apoyar\ncreador')
    dot.edge('historia', 'favoritos', label='Agregar a\nfavoritos')
    dot.edge('historia', 'later', label='Guardar\npara después')
    dot.edge('historia', 'index', label='Volver')
    
    # Lector
    dot.edge('lector', 'lector', label='Nav capítulos\n(◀▶)')
    dot.edge('lector', 'index', label='🏠 Inicio')
    dot.edge('lector', 'monedas', label='Desbloquear\n(20 monedas)')
    
    # Monedas
    dot.edge('monedas', 'historia', label='Volver\n(si hay historia)')
    dot.edge('monedas', 'index', label='Volver')
    
    # Apoyo
    dot.edge('apoyo', 'historia', label='Enviar\ndonación')
    
    # Header siempre disponible (con sesión)
    dot.edge('index', 'favoritos', label='Header\n❤')
    dot.edge('index', 'later', label='Header\n🕑')
    dot.edge('index', 'monedas', label='Header\n🪙')
    dot.edge('index', 'perfil', label='Header\n👤')
    
    # Desde perfil
    dot.edge('perfil', 'favoritos', label='Ver\nfavoritos')
    dot.edge('perfil', 'later', label='Leer más\ntarde')
    dot.edge('perfil', 'monedas', label='Monedas')
    dot.edge('perfil', 'config', label='Configuración')
    dot.edge('perfil', 'creador', label='Centro creador\n(si es creador)')
    
    # Desde config
    dot.edge('config', 'perfil', label='Volver')
    
    # Listas
    dot.edge('favoritos', 'historia', label='Abrir\nhistoria')
    dot.edge('later', 'historia', label='Abrir\nhistoria')
    
    # ==================== FLUJO CREADORES ====================
    
    # Onboarding
    dot.edge('creador_info', 'creador_paso1', label='Solicitar')
    dot.edge('creador_paso1', 'creador_paso2', label='Siguiente')
    dot.edge('creador_paso2', 'creador_paso3', label='Siguiente')
    dot.edge('creador_paso3', 'creador_paso4', label='Siguiente')
    dot.edge('creador_paso4', 'creador_confirmado', label='Aprobar')
    dot.edge('creador_confirmado', 'creador', label='Ir a\ncentro')
    
    # Centro creador
    dot.edge('creador', 'dashboard_autor', label='Ver\ncomentarios')
    dot.edge('creador', 'index', label='Volver')
    dot.edge('dashboard_autor', 'creador', label='Volver')
    
    # Desde cualquier página (con sesión creador)
    dot.edge('perfil', 'dashboard_autor', label='Dashboard\nautor')
    
    # ==================== ACCIONES GLOBALES ====================
    
    # Agregar subgrafos para organizar
    with dot.subgraph(name='cluster_auth') as c:
        c.attr(label='🔐 AUTENTICACIÓN', style='dashed', color='#6e38ff')
        c.node('login')
        c.node('registro')
    
    with dot.subgraph(name='cluster_discover') as c:
        c.attr(label='🔍 DESCUBRIMIENTO', style='dashed', color='#3b82f6')
        c.node('busqueda')
        c.node('busqueda_avanzada')
        c.node('categorias')
    
    with dot.subgraph(name='cluster_read') as c:
        c.attr(label='📖 LECTURA', style='dashed', color='#f59e0b')
        c.node('historia')
        c.node('lector')
    
    with dot.subgraph(name='cluster_economy') as c:
        c.attr(label='💰 ECONOMÍA', style='dashed', color='#eab308')
        c.node('monedas')
        c.node('apoyo')
    
    with dot.subgraph(name='cluster_lists') as c:
        c.attr(label='📚 LISTAS PERSONALES', style='dashed', color='#ec4899')
        c.node('favoritos')
        c.node('later')
    
    with dot.subgraph(name='cluster_profile') as c:
        c.attr(label='👤 PERFIL', style='dashed', color='#3b82f6')
        c.node('perfil')
        c.node('config')
    
    with dot.subgraph(name='cluster_creator') as c:
        c.attr(label='✍️ CREADORES', style='dashed', color='#8b5cf6')
        c.node('creador_info')
        c.node('creador_paso1')
        c.node('creador_paso2')
        c.node('creador_paso3')
        c.node('creador_paso4')
        c.node('creador_confirmado')
        c.node('creador')
        c.node('dashboard_autor')
    
    return dot

def create_simplified_flow():
    """Crea un diagrama simplificado centrado en las acciones principales"""
    
    dot = Digraph(comment='Smintheia Nook - Flujo Simplificado')
    dot.attr(rankdir='LR', size='16,10', bgcolor='#f3f4f8')
    dot.attr('node', shape='ellipse', style='filled', fontname='Arial', fontsize='12', width='2')
    dot.attr('edge', fontname='Arial', fontsize='10', color='#6e38ff')
    
    # Nodos principales
    dot.node('start', 'INICIO', fillcolor='#7b5cff', fontcolor='white', shape='circle', width='1.5')
    dot.node('explore', 'EXPLORAR\nHistorias', fillcolor='#f0f1f5')
    dot.node('read', 'LEER\nCapítulos', fillcolor='#fff9e6')
    dot.node('interact', 'INTERACTUAR\n❤ 💬 ⭐', fillcolor='#fce7f3')
    dot.node('unlock', 'DESBLOQUEAR\nContenido', fillcolor='#fef3c7')
    dot.node('create', 'CREAR\nContenido', fillcolor='#c7d2fe')
    dot.node('earn', 'GANAR\nMonedas', fillcolor='#fef3c7')
    dot.node('customize', 'PERSONALIZAR\nExperiencia', fillcolor='#dbeafe')
    
    # Conexiones principales
    dot.edge('start', 'explore', label='Buscar\nCategorías')
    dot.edge('explore', 'read', label='Abrir historia\nSeleccionar cap.')
    dot.edge('read', 'interact', label='Me gusta\nComentar\nFavs/Later')
    dot.edge('read', 'unlock', label='Cap 4-12\n(20 monedas)')
    dot.edge('unlock', 'earn', label='Necesito\nmonedas')
    dot.edge('earn', 'unlock', label='Comprar\nGanar gratis')
    dot.edge('interact', 'earn', label='Apoyar\ncreador')
    dot.edge('start', 'create', label='Ser creador')
    dot.edge('create', 'earn', label='Recibir\ndonaciones')
    dot.edge('start', 'customize', label='Configurar\nAccesibilidad')
    dot.edge('customize', 'explore', label='Continuar')
    
    return dot

def create_user_actions_list():
    """Crea un diagrama tipo lista de todas las acciones posibles"""
    
    dot = Digraph(comment='Smintheia Nook - Lista de Acciones')
    dot.attr(rankdir='TB', size='12,20', bgcolor='#f3f4f8')
    dot.attr('node', shape='note', style='filled', fontname='Arial', fontsize='10')
    dot.attr('edge', style='invis')
    
    categories = [
        ('🔍 DESCUBRIR', [
            'Buscar por texto',
            'Búsqueda avanzada con filtros',
            'Explorar categorías',
            'Ver carrusel de populares',
            'Ver grid completo de historias',
        ], '#e0f2fe'),
        
        ('📖 LEER', [
            'Abrir historia',
            'Ver sinopsis y detalles',
            'Leer capítulo gratuito (1-3)',
            'Navegar entre capítulos',
            'Desbloquear capítulo premium (4-12)',
        ], '#fef3c7'),
        
        ('❤️ INTERACTUAR', [
            'Dar me gusta a historia',
            'Dar me gusta a capítulo',
            'Comentar capítulo',
            'Agregar a favoritos',
            'Guardar para leer después',
            'Ver historial de lecturas',
        ], '#fce7f3'),
        
        ('💰 ECONOMÍA', [
            'Ver balance de monedas',
            'Comprar paquetes (100/500/1000)',
            'Ganar monedas gratis (+5 cada una)',
            'Desbloquear capítulo (20 monedas)',
            'Donar a creador (20/50/100)',
            'Escribir mensaje con donación',
        ], '#fef3c7'),
        
        ('👤 CUENTA', [
            'Iniciar sesión',
            'Registrarse',
            'Cerrar sesión',
            'Cambiar nombre',
            'Subir foto de perfil',
            'Cambiar contraseña',
            'Ver notificaciones',
            'Guardar tarjeta de pago',
        ], '#dbeafe'),
        
        ('🎨 PERSONALIZACIÓN', [
            'Activar modo oscuro',
            'Cambiar tamaño fuente (90-110%)',
            'Cambiar densidad (normal/compacta)',
            'Alto contraste',
            'Fuente dyslexic-friendly',
            'Ajustar interlineado',
        ], '#e9d5ff'),
        
        ('✍️ CREAR (solo creadores)', [
            'Solicitar cuenta creador',
            'Completar onboarding (4 pasos)',
            'Publicar nueva historia',
            'Añadir foto de portada',
            'Seleccionar etiquetas',
            'Añadir capítulo a historia',
            'Ver estadísticas propias',
            'Ver comentarios recibidos',
            'Responder comentarios',
            'Configurar notificaciones',
        ], '#c7d2fe'),
    ]
    
    prev_node = None
    for i, (title, actions, color) in enumerate(categories):
        node_id = f'cat_{i}'
        label = f'{title}\n\n' + '\n'.join(f'• {a}' for a in actions)
        dot.node(node_id, label, fillcolor=color, fontcolor='#12131a')
        
        if prev_node:
            dot.edge(prev_node, node_id)
        prev_node = node_id
    
    return dot

def main():
    """Genera todos los diagramas"""
    
    print("🎨 Generando diagramas de flujo de usuario de Smintheia Nook...\n")
    
    # Crear directorio de salida
    output_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Diagrama completo
    print("📊 1. Diagrama completo de navegación...")
    flow_complete = create_user_flow_diagram()
    try:
        flow_complete.render(os.path.join(output_dir, 'user_flow_complete'), format='png', cleanup=True)
        flow_complete.render(os.path.join(output_dir, 'user_flow_complete'), format='pdf', cleanup=True)
    except Exception as e:
        print("   ⚠️ No se pudo renderizar el diagrama completo. Asegúrate de tener Graphviz instalado y en PATH.")
        print("   Detalle:", e)
        raise
    print("   ✅ Guardado: user_flow_complete.png / .pdf")
    
    # 2. Diagrama simplificado
    print("📊 2. Diagrama simplificado de acciones...")
    flow_simple = create_simplified_flow()
    try:
        flow_simple.render(os.path.join(output_dir, 'user_flow_simple'), format='png', cleanup=True)
    except Exception as e:
        print("   ⚠️ No se pudo renderizar el diagrama simplificado. Verifica Graphviz en PATH.")
        print("   Detalle:", e)
        raise
    print("   ✅ Guardado: user_flow_simple.png")
    
    # 3. Lista de acciones
    print("📊 3. Lista completa de acciones...")
    actions_list = create_user_actions_list()
    try:
        actions_list.render(os.path.join(output_dir, 'user_actions_list'), format='png', cleanup=True)
    except Exception as e:
        print("   ⚠️ No se pudo renderizar la lista de acciones. Verifica Graphviz en PATH.")
        print("   Detalle:", e)
        raise
    print("   ✅ Guardado: user_actions_list.png")
    
    print("\n✨ ¡Diagramas generados exitosamente!")
    print(f"📁 Ubicación: {output_dir}")
    print("\n🎯 Archivos creados:")
    print("   • user_flow_complete.png/pdf - Diagrama completo con todas las páginas")
    print("   • user_flow_simple.png - Vista simplificada de acciones principales")
    print("   • user_actions_list.png - Lista categorizada de todas las acciones")

if __name__ == '__main__':
    main()
