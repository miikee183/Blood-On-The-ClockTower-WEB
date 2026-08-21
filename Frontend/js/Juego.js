const socket = io();

// Catálogos de roles
const EDICIONES = {
    TB: [
        { nombre: "Diablillo", tipo: "demonio", efecto: "none", info: "Puede matar a un jugador todas las noches, sé puede matar así mismo para que uno de sus esbirros se convierta en el demonio.", emoji: "🔱" },
        { nombre: "Envenenador", tipo: "esbirro", efecto: "Envenenado", info: "Todas las noches podrá envenenar a un jugador, este jugador puede recibir información falsa.", emoji: "🧪" },
        { nombre: "Espía", tipo: "esbirro", efecto: "none", info: "Podrá ver todas las noches el grimorio. (Ve los roles de cada uno) es percibido como pueblo para los demás jugadores", emoji: "👁️" },
        { nombre: "Mujer Escarlata", tipo: "esbirro", efecto: "none", info: "Si el demonio es eliminado, pasa a ser el demonio si al menos hay 5 jugadores vivos.", emoji: "💋" },
        { nombre: "Barón", tipo: "esbirro", efecto: "none", info: "Si hay un barón en la partida le toca al narrador añadir 2 Forasteros en la partida en vez de 2 roles del Pueblo.", emoji: "🎩" },
        { nombre: "Lavandera", tipo: "pueblerino", efecto: "Lavandera-Info", info: "En la primera noche sabrá un rol de pueblo que tiene 1 entre 2 jugadores.", emoji: "👖" },
        { nombre: "Bibliotecario", tipo: "pueblerino", efecto: "Bibliotecario-Info", info: "En la primera noche sabrá un rol de forastero que tiene 1 entre 2 jugadores.", emoji: "📖" },
        { nombre: "Investigador", tipo: "pueblerino", efecto: "Investigador-Info", info: "En la primera noche sabrá un rol de esbirro que tiene 1 entre 2 jugadores.", emoji: "🔍" },
        { nombre: "Chef", tipo: "pueblerino", efecto: "none", info: "En la primera noche sabrá si hay roles malos juntos en la mesa (si hay 2 juntos se le dirá 1 si hay 3 se le dirá 2 y si hay 2 parejas separadas se le dirá igual 2).", emoji: "🧑‍🍳" },
        { nombre: "Empático", tipo: "pueblerino", efecto: "none", info: "Todas las noches sabrá el número de jugadores malvados que hay a su lado.", emoji: "💗" },
        { nombre: "Pitonisa", tipo: "pueblerino", efecto: "Pitonisa-Falsa", info: "Elige 2 jugadores, sabrás si uno es el demonio, pero un jugador bueno será identificado como demonio también por ti.", emoji: "🔮" },
        { nombre: "Enterrador", tipo: "pueblerino", efecto: "Visto-Hoy", info: "Si se ejecuta a alguien se enterá esa noche del rol del ejecutado.", emoji: "⚰️" },
        { nombre: "Monje", tipo: "pueblerino", efecto: "Protegido", info: "Todas las noches elige a un jugador, ese jugador es inmune a ataques de demonio (No puede elegirse así mismo).", emoji: "✝️" },
        { nombre: "Guardián de cuervos", tipo: "pueblerino", efecto: "none", info: "Si muere por el demonio, esa misma noche elige a alguien y sabrá su rol.", emoji: "🐦‍⬛" },
        { nombre: "Virgen", tipo: "pueblerino", efecto: "none", info: "Si uno del pueblo la nomina, este es ejecutado instantaneamente.", emoji: "💍" },
        { nombre: "Exterminador", tipo: "pueblerino", efecto: "Gastado", info: "Si elige al demonio públicamente por el día, lo elimina, pero solo tiene una oportunidad ya que solo tiene una bala.", emoji: "🏹" },
        { nombre: "Soldado", tipo: "pueblerino", efecto: "none", info: "Es inmune a los ataques del demonio.", emoji: "🛡️" },
        { nombre: "Alcalde", tipo: "pueblerino", efecto: "none", info: "Si por la noche el demonio intenta matar al alcalde el narrador puede cambiar a la víctima del asesinato. Cuando quedan 3 jugadores si uno es el alcalde en la fase de ejecución si no se ejecuta a nadie gana el pueblo.", emoji: "🏦" },
        { nombre: "Mayordomo", tipo: "forastero", efecto: "Patrón", info: "Todas las noches elige a su maestro, el mayordomo solo podrá votar en ejecuciones si su maestro está votando en ese momento.", emoji: "🛎️" },
        { nombre: "Santo", tipo: "forastero", efecto: "none", info: "Si es ejecutado, ganan los malos.", emoji: "🪽" },
        { nombre: "Recluso", tipo: "forastero", efecto: "none", info: "Puede ser identificado tanto como demonio, esbirro, forastero o pueblo para todos los jugadores.", emoji: "🕯️" },
        { nombre: "Borracho", tipo: "forastero", efecto: "none", info: "Este rol es un segundo rol que tendrá un jugador (no lo pueden tener los demonios), hace que su primer rol no funcione. (El jugador sabrá cual es su primer rol pero nunca sabrá si es el borracho).", emoji: "🍺" }
    ],
    BMR: [
        { nombre: "Zombuul", tipo: "demonio", efecto: "Muerto-Una-Vez", info: "Si lo ejecutan no muere (seguirá atacando) pero todos pensaran que sí, solo morirá si lo ejecutan por segunda vez.", emoji: "🧟" },
        { nombre: "Pukka", tipo: "demonio", efecto: "Picadura", info: "Cada noche envenena mortalmente a un jugador, la noche siguiente muere es jugador envenenado.", emoji: "🔱" },
        { nombre: "Shabaloth", tipo: "demonio", efecto: "none", info: "Puede comerse a 2 jugadores cada noche pero el narrador puede elegir si resucitar a uno de los 2 (vomitar).", emoji: "👅" },
        { nombre: "Po", tipo: "demonio", efecto: "Tres-Ataques", info: "Puede matar a 3 en una noche si la noche anterior no mata a nadie.", emoji: "🩸" },
        { nombre: "Padrino", tipo: "esbirro", efecto: "Padrino-Info", info: "Sabe que forasteros están en juego si uno de ellos muere, el Padrino podrá matar.", emoji: "🌹" },
        { nombre: "Asesino", tipo: "esbirro", efecto: "Asesino-Gastado", info: "Podrá matar a alguien por partida, está muerte es inevitable el jugador muere si o si.", emoji: "🔪" },
        { nombre: "Mente Maestra", tipo: "esbirro", efecto: "none", info: "Si se ejecuta al demonio nadie lo sabe, al día siguiente si se intenta ejecutar a un jugador bueno el mal ganá si no se intenta ejecutar a nadie o a un esbirro el bien gana.", emoji: "🎩" },
        { nombre: "Abogado del diablo", tipo: "esbirro", efecto: "Defendido", info: "Cada noche elige alguien, hará inmune a las ejecuciones a ese jugador.", emoji: "⚖️" },
        { nombre: "Abuela", tipo: "pueblerino", efecto: "Nieto", info: "La abuela sabrá quien es su nieto y su rol que será uno de los buenos pero el nieto no sabe que tiene abuela, si el nieto es asesinado por un demonio la abuela morirá pero por otro tipo de muerte no pasa nada.", emoji: "👵" },
        { nombre: "Camarera", tipo: "pueblerino", efecto: "CamareraInfo", info: "Elige a 2 jugadores y sabrá si ellos se levantaron la misma noche que ella.", emoji: "🧹" },
        { nombre: "Marinero", tipo: "pueblerino", efecto: "Embriaguez", info: "Elige a un jugador, él o el jugador elegido se emborrachara si el emborrachado es el marinero será inmortal mientras esté borracho.", emoji: "⚓" },
        { nombre: "Exorcista", tipo: "pueblerino", efecto: "Elegido", info: "Elige un jugador si es el demonio esa noche no despertará, pero sabrá que eres el Exorcista.", emoji: "✝️" },
        { nombre: "Posadero", tipo: "pueblerino", efecto: "Hospedado", info: "Elige 2 jugadores los protegerás esa noche pero uno de ellos se emborracha un día.", emoji: "🍺" },
        { nombre: "Apostador", tipo: "pueblerino", efecto: "none", info: "Todas las noches puede elegir a un jugador si adivina su rol no pasa nada, si lo falla el mismo muere.", emoji: "🎲" },
        { nombre: "Chismoso", tipo: "pueblerino", efecto: "none", info: "Puede decir un anuncio públicamente por el día si es cierto el narrador podrá eliminar a alguien la próxima noche.", emoji: "👂" },
        { nombre: "Cortesana", tipo: "pueblerino", efecto: "Abstemia", info: "Solo una vez en la partida podrá elegir un rol, si ese rol está en juego el jugador del rol quedará borracho durante 3 días.", emoji: "🍷" },
        { nombre: "Profesor", tipo: "pueblerino", efecto: "Sin-Carga", info: "Solo una vez en la partida podrá elegir a un muerto para resucitarlo, solo resucitará si es del pueblo ese jugador recuperará su habilidad.", emoji: "💉" },
        { nombre: "Trovador", tipo: "pueblerino", efecto: "Melodía", info: "Si un esbirro muere por el día, los demás jugadores excepto el trovador, quedan borrachos durante la noche y el próximo día.", emoji: "👼" },
        { nombre: "Señora del té", tipo: "pueblerino", efecto: "Servido-Té", info: "Si los jugadores que están al lado suya son buenos, son inmortales, pero tienen que ser los 2, si es uno no será inmortal.", emoji: "🫖" },
        { nombre: "Pacifista", tipo: "pueblerino", efecto: "none", info: "Si hay un pacifista en partida, el narrador puede perdonar una ejecución a un jugador bueno.", emoji: "🕊️" },
        { nombre: "Bufón", tipo: "pueblerino", efecto: "none", info: "Si el bufón debería de morir por cualquier razón no muere la primera vez.", emoji: "🎭" },
        { nombre: "Matón", tipo: "forastero", efecto: "Matón-Borracho", info: "Es inmortal a todo, pero si alguien le elige con su habilidad lo emborracha un día además el matón pasa al bando del jugador emborrachado", emoji: "👊" },
        { nombre: "Lunático", tipo: "forastero", efecto: "none", info: "Cree que es el demonio, el narrador le da nombres de esbirros falsos y cree que está matando ya que el diablo sabe a quien elige el lunático.", emoji: "🌀" },
        { nombre: "Hija de la luna", tipo: "forastero", efecto: "Sentenciado", info: "Si es ejecutada elige a un jugador si es bueno, esa misma noche el jugador elegido morirá.", emoji: "🌙" },
        { nombre: "Chatarrero", tipo: "forastero", efecto: "none", info: "Puede morir en cualquier momento si el narrador quiere.", emoji: "🚚" }
    ],
    SV: [
        { nombre: "Vortox", tipo: "demonio", efecto: "none", info: "Toda la información que recibe los buenos es falsa, si no se ejecuta a nadie un día los malos ganan,", emoji: "🌪️" },
        { nombre: "Fang Gu", tipo: "demonio", efecto: "Infectado", info: "Salta a un forastero.", emoji: "🫴" },
        { nombre: "Vigormortis", tipo: "demonio", efecto: "Necrosis", info: "Mata esbirros para darles poder.", emoji: "💀" },
        { nombre: "No Dashii", tipo: "demonio", efecto: "Aturdimiento", info: "Su jugador de la derecha y de la izquierda quedan envenenados permanentemente.", emoji: "🐙" },
        { nombre: "Madrasta del foso", tipo: "esbirro", efecto: "none", info: "Cambia roles.", emoji: "🔮" },
        { nombre: "Cerenovus", tipo: "esbirro", efecto: "Locura", info: "Fuerza a fingir rol.", emoji: "🧠" },
        { nombre: "Gemelo Malvado", tipo: "esbirro", efecto: "Gemelo", info: "El bien no gana si ambos viven.", emoji: "👥" },
        { nombre: "Bruja", tipo: "esbirro", efecto: "Maldecido", info: "Maldito muere si nomina.", emoji: "🧹" },
        { nombre: "Relojero", tipo: "pueblerino", efecto: "Encantado", info: "Distancia al esbirro.", emoji: "🕰️" },
        { nombre: "Encantador de serpientes", tipo: "pueblerino", efecto: "Encantado", info: "Intercambia rol con demonio.", emoji: "🐍" },
        { nombre: "Erudito", tipo: "pueblerino", efecto: "none", info: "Dato real y falso.", emoji: "🧑‍🦽‍➡️" },
        { nombre: "Costurera", tipo: "pueblerino", efecto: "Costura-Hecha", info: "Sabe bando de 2.", emoji: "🧶" },
        { nombre: "Florista", tipo: "pueblerino", efecto: "Votó-Demonio", info: "Votó el demonio?", emoji: "💐" },
        { nombre: "Pregonero", tipo: "pueblerino", efecto: "Nominó-Esbirro", info: "Nominó esbirro?", emoji: "🔔" },
        { nombre: "Oráculo", tipo: "pueblerino", efecto: "none", info: "Sabe malos muertos.", emoji: "👁️" },
        { nombre: "Soñador", tipo: "pueblerino", efecto: "none", info: "Ve 2 roles (1 real).", emoji: "💫" },
        { nombre: "Artista", tipo: "pueblerino", efecto: "Preguntado", info: "Pregunta Sí/No.", emoji: "🖌️" },
        { nombre: "Malabarista", tipo: "pueblerino", efecto: "Malabares", info: "Adivina roles día 1.", emoji: "🎳" },
        { nombre: "Sabio", tipo: "pueblerino", efecto: "none", info: "Sabe quién le mató.", emoji: "🕯️" },
        { nombre: "Matemático", tipo: "pueblerino", efecto: "none", info: "Sabe cuántos fallos de info hubo.", emoji: "📐" },
        { nombre: "Filósofo", tipo: "pueblerino", efecto: "Copiando", info: "Copia un poder.", emoji: "📖" },
        { nombre: "Patoso", tipo: "forastero", efecto: "none", info: "Si elige mal al morir, pierden.", emoji: "🍌" },
        { nombre: "Barbero", tipo: "forastero", efecto: "Corte-Pelo", info: "Demonio cambia roles al morir barbero.", emoji: "✂️" },
        { nombre: "Cariño", tipo: "forastero", efecto: "Duelo", info: "Al morir, un bueno se emborracha.", emoji: "🎀" },
        { nombre: "Mutante", tipo: "forastero", efecto: "none", info: "No puede decir que es forastero.", emoji: "🎪" }
    ]
};

let ROLES_TOTALES_CATALOGO = []; 
let ROLES_ACTUALES_DISPONIBLES = []; 
let rolesEnPartida = [];
let edicionSeleccionada = "";
let nombresDisponibles = [];

const ESTADOS_BASE = ["Vivo", "Muerto", "Ejecutado"];
const TABLA_COMPOSICION = {
    5: { p: 3, f: 1, e: 0, d: 1 }, 6: { p: 4, f: 0, e: 1, d: 1 }, 7: { p: 4, f: 1, e: 1, d: 1 }, 8: { p: 5, f: 1, e: 1, d: 1 },
    9: { p: 5, f: 2, e: 1, d: 1 }, 10: { p: 7, f: 0, e: 2, d: 1 }, 11: { p: 7, f: 1, e: 2, d: 1 }, 12: { p: 7, f: 2, e: 2, d: 1 },
    13: { p: 9, f: 0, e: 3, d: 1 }, 14: { p: 9, f: 1, e: 3, d: 1 }, 15: { p: 9, f: 2, e: 3, d: 1 },
};

window.onload = function() {
    limpiarDatosJugadores();
};

socket.on('lista-nombres-actualizada', (lista) => {
    nombresDisponibles = lista;
    actualizarSelectsNombres();
});

socket.on('nuevo-voto-recibido', (nombre) => {
    document.querySelectorAll('.jugador-container').forEach(c => {
        if(c.querySelector('.nombre-jugador').value === nombre) {
            c.classList.add('ha-votado-gm');
        }
    });
});

socket.on('votacion-finalizada', () => {
    document.querySelectorAll('.jugador-container').forEach(c => c.classList.remove('ha-votado-gm'));
});

function limpiarDatosJugadores() {
    socket.emit('cambio-roles', []); 
    socket.emit('actualizar-estados-servidor', { lista: [] });
}

function iniciarEdicion(tipo) {
    edicionSeleccionada = tipo;
    const selector = document.getElementById('edition-selector');
    if(selector) selector.style.display = 'none';

    if (tipo === 'TB') ROLES_TOTALES_CATALOGO = [...EDICIONES.TB];
    else if (tipo === 'BMR') ROLES_TOTALES_CATALOGO = [...EDICIONES.BMR];
    else if (tipo === 'SV') ROLES_TOTALES_CATALOGO = [...EDICIONES.SV];
    else {
        ROLES_TOTALES_CATALOGO = [...EDICIONES.TB, ...EDICIONES.BMR, ...EDICIONES.SV];
        ROLES_TOTALES_CATALOGO = ROLES_TOTALES_CATALOGO.filter((v,i,a)=>a.findIndex(t=>(t.nombre===v.nombre))===i);
    }

    if (tipo === 'CUSTOM') mostrarMenuFiltroCustom();
    else {
        ROLES_ACTUALES_DISPONIBLES = [...ROLES_TOTALES_CATALOGO];
        socket.emit('cambio-roles', ROLES_ACTUALES_DISPONIBLES);
        mostrarConfiguracionPartida();
    }
}

function renderizarRolesPorSecciones(roles, contenedorId, contadorId, callbackOnToggle) {
    const contenedor = document.getElementById(contenedorId);
    if(!contenedor) return;
    contenedor.innerHTML = '';
    const ordenCategorias = [
        { id: "demonio", titulo: "Demonios" }, { id: "esbirro", titulo: "Esbirros" },
        { id: "pueblerino", titulo: "Pueblo" }, { id: "forastero", titulo: "Forasteros" }
    ];
    ordenCategorias.forEach(cat => {
        const rolesFiltrados = roles.filter(r => r.tipo === cat.id);
        if (rolesFiltrados.length > 0) {
            const tituloSeccion = document.createElement('div');
            tituloSeccion.className = 'seccion-rol-titulo';
            tituloSeccion.textContent = cat.titulo;
            contenedor.appendChild(tituloSeccion);
            rolesFiltrados.forEach(rolObj => {
                const btn = document.createElement('button');
                btn.className = `btn-rol-selector ${rolObj.tipo} ${rolObj.nombre === "Borracho" ? "borracho-btn" : ""}`;
                btn.textContent = rolObj.nombre;
                btn.onclick = () => {
                    btn.classList.toggle('selected');
                    const num = document.querySelectorAll(`#${contenedorId} .btn-rol-selector.selected`).length;
                    const cElement = document.getElementById(contadorId);
                    if(cElement) cElement.textContent = `Seleccionados: ${num}`;
                    if (callbackOnToggle) callbackOnToggle();
                };
                contenedor.appendChild(btn);
            });
        }
    });
}

function mostrarMenuFiltroCustom() {
    const panel = document.getElementById('custom-filter-panel');
    if(panel) panel.style.display = 'flex';
    renderizarRolesPorSecciones(ROLES_TOTALES_CATALOGO, 'lista-filtro-custom', 'contador-filtro-custom', null);
}

function confirmarFiltroCustom() {
    const seleccionados = Array.from(document.querySelectorAll('#lista-filtro-custom .btn-rol-selector.selected')).map(btn => btn.textContent);
    if (seleccionados.length < 5) { alert("Selecciona al menos 5 roles."); return; }
    ROLES_ACTUALES_DISPONIBLES = ROLES_TOTALES_CATALOGO.filter(r => seleccionados.includes(r.nombre));
    socket.emit('cambio-roles', ROLES_ACTUALES_DISPONIBLES);
    const panel = document.getElementById('custom-filter-panel');
    if(panel) panel.style.display = 'none';
    mostrarConfiguracionPartida();
}

function mostrarConfiguracionPartida() {
    const setupPanel = document.getElementById('setup-panel');
    if(setupPanel) setupPanel.style.display = 'flex';
    const titulo = document.getElementById('titulo-edicion');
    if(titulo) titulo.textContent = edicionSeleccionada === 'CUSTOM' ? "Configuración (Custom)" : "Configuración";
    const selectBorracho = document.getElementById('rol-falso-borracho');
    if(selectBorracho) {
        selectBorracho.innerHTML = '';
        ROLES_ACTUALES_DISPONIBLES.forEach(rolObj => {
            if (rolObj.nombre !== "Borracho") {
                const opt = document.createElement('option');
                opt.value = rolObj.nombre; opt.textContent = rolObj.nombre;
                selectBorracho.appendChild(opt);
            }
        });
    }
    renderizarRolesPorSecciones(ROLES_ACTUALES_DISPONIBLES, 'lista-roles-seleccion', 'contador-roles-seleccion', actualizarConfiguracion);
    actualizarSugerencia();
}

function actualizarConfiguracion() {
    const seleccionados = Array.from(document.querySelectorAll('#lista-roles-seleccion .btn-rol-selector.selected')).map(btn => btn.textContent);
    const configBorracho = document.getElementById('config-borracho');
    if(configBorracho) configBorracho.style.display = seleccionados.includes("Borracho") ? "block" : "none";
    rolesEnPartida = seleccionados;
}

function actualizarSugerencia() {
    const n = parseInt(document.getElementById('numJugadores').value);
    const sug = document.getElementById('sugerencia-composicion');
    if (TABLA_COMPOSICION[n] && sug) {
        const c = TABLA_COMPOSICION[n];
        sug.textContent = `Sugerido: ${c.p} Pueblerinos, ${c.f} Forasteros, ${c.e} Esbirros, 1 Demonio.`;
    }
}

function cambiarJugadores(valor) {
    const input = document.getElementById('numJugadores');
    let nuevoValor = parseInt(input.value) + valor;
    if (nuevoValor >= parseInt(input.min) && nuevoValor <= parseInt(input.max)) {
        input.value = nuevoValor;
        actualizarSugerencia();
    }
}

function generarGrimorio() {
    const numJugadores = parseInt(document.getElementById('numJugadores').value);
    const tieneBorracho = rolesEnPartida.includes("Borracho");
    const totalEsperado = tieneBorracho ? numJugadores + 1 : numJugadores;
    
    if (rolesEnPartida.length !== totalEsperado) {
        alert(`Faltan o sobran roles: Debes elegir ${totalEsperado} para ${numJugadores} jugadores.`);
        return;
    }

    document.getElementById('setup-panel').style.display = 'none';
    document.getElementById('game-controls').style.display = 'flex';
    document.getElementById('main-container').style.display = 'block';

    const contenedor = document.getElementById('grimorio');
    contenedor.innerHTML = '';
    const width = document.getElementById('main-container').clientWidth;
    const height = document.getElementById('main-container').clientHeight;

    if (numJugadores >= 10) distribuirRectangulo(numJugadores, width, height, contenedor);
    else distribuirElipse(numJugadores, width/2, height/2, width, height, contenedor);
    
    actualizarSelectsNombres();
    enviarEstados();
}

function distribuirElipse(num, centroX, centroY, width, height, contenedor) {
    const radioX = (width / 2) - 140;
    const radioY = (height / 2) - 120;
    for (let i = 0; i < num; i++) {
        let angulo = (i * 2 * Math.PI / num) - (Math.PI / 2);
        crearElementoJugador(centroX + radioX * Math.cos(angulo), centroY + radioY * Math.sin(angulo), i, contenedor, num);
    }
}

function distribuirRectangulo(num, width, height, contenedor) {
    const margin = 100;
    const usableW = width - (margin * 2);
    const usableH = height - (margin * 2);
    const perimetro = 2 * (usableW + usableH);
    const step = perimetro / num;
    for (let i = 0; i < num; i++) {
        let d = i * step;
        let x, y;
        if (d < usableW) { x = margin + d; y = margin; }
        else if (d < usableW + usableH) { x = width - margin; y = margin + (d - usableW); }
        else if (d < (usableW * 2) + usableH) { x = width - margin - (d - (usableW + usableH)); y = height - margin; }
        else { x = margin; y = height - margin - (d - (usableW * 2 + usableH)); }
        crearElementoJugador(x, y, i, contenedor, num);
    }
}

function crearElementoJugador(x, y, i, contenedor, totalJugadores) {
    const divJugador = document.createElement('div');
    divJugador.className = 'jugador-container';
    if (totalJugadores >= 19) divJugador.classList.add('escala-minima');
    else if (totalJugadores > 16) divJugador.classList.add('escala-pequena');
    divJugador.style.left = `${x}px`;
    divJugador.style.top = `${y}px`;
    const optionsEstado = ESTADOS_BASE.map(e => `<option value="${e}">${e}</option>`).join('');
    
    divJugador.innerHTML = `
        <input type="text" class="rol-display bg-morado" value="???" readonly>
        <div class="circulo-jugador">
            <select class="nombre-jugador" onchange="actualizarSelectsNombres(); enviarEstados();">
                <option value="">- Seleccionar -</option>
            </select>
            <button class="btn-falso-lunatico" onclick="this.classList.toggle('activo'); enviarEstados();" title="Esbirro Falso para Lunático">💀</button>
        </div>
        <select class="estado-jugador" onchange="verificarMuerteYSonido(this); enviarEstados();">${optionsEstado}</select>
        <div class="contenedor-efectos-doble">
            <select class="estado-jugador secundario"><option value="">- Efecto 1 -</option></select>
            <select class="estado-jugador secundario"><option value="">- Efecto 2 -</option></select>
        </div>
    `;
    contenedor.appendChild(divJugador);
}

function actualizarSelectsNombres() {
    const selects = document.querySelectorAll('.nombre-jugador');
    const seleccionados = Array.from(selects).map(s => s.value).filter(v => v !== "");
    selects.forEach(select => {
        const valorActual = select.value;
        select.innerHTML = '<option value="">- Seleccionar -</option>';
        nombresDisponibles.forEach(nombre => {
            const isUsed = seleccionados.includes(nombre) && nombre !== valorActual;
            const opt = document.createElement('option');
            opt.value = nombre; opt.textContent = nombre;
            if (isUsed) opt.disabled = true;
            select.appendChild(opt);
        });
        select.value = valorActual;
    });
}

function verificarMuerteYSonido(select) {
    const container = select.closest('.jugador-container');
    container.classList.remove('muerto', 'ejecutado');
    if (select.value === "Muerto") container.classList.add('muerto');
    else if (select.value === "Ejecutado") container.classList.add('ejecutado');
}

function enviarEstados() {
    const contenedorRaiz = document.getElementById('main-container');
    if(!contenedorRaiz) return;
    const widthTotal = contenedorRaiz.clientWidth;
    const heightTotal = contenedorRaiz.clientHeight;
    const containers = document.querySelectorAll('.jugador-container');
    const datosPartida = { lista: [] }; // Esta es tu variable de datos

    containers.forEach(c => {
        const selectNombre = c.querySelector('.nombre-jugador');
        const nombre = selectNombre.value || "";
        const estado = c.querySelector('.estado-jugador').value;
        
        // Detectamos si el botón de la calavera está activo
        const esbirroFalso = c.querySelector('.btn-falso-lunatico').classList.contains('activo');
        
        const xPct = (parseFloat(c.style.left) / widthTotal) * 100;
        const yPct = (parseFloat(c.style.top) / heightTotal) * 100;
        const escala = c.classList.contains('escala-minima') ? 'escala-minima' : (c.classList.contains('escala-pequena') ? 'escala-pequena' : '');

        datosPartida.lista.push({ 
            nombre, 
            estado, 
            esbirroFalso, // <--- Guardamos el estado aquí
            x: xPct + "%", 
            y: yPct + "%", 
            escala 
        });
    });
    socket.emit('actualizar-estados-servidor', datosPartida);
}

function asignarRolesAleatorios() {
    const containers = document.querySelectorAll('.jugador-container');
    const numJugadores = containers.length;
    const contenedorGrimorio = document.getElementById('main-container');

    if (rolesEnPartida.includes("Lunático")) {
        contenedorGrimorio.classList.add('hay-lunatico');
    } else {
        contenedorGrimorio.classList.remove('hay-lunatico');
    }

    let asientosSinNombre = 0;
    containers.forEach(c => { if(!c.querySelector('.nombre-jugador').value) asientosSinNombre++; });
    
    if(asientosSinNombre > 0) {
        alert(`¡Error! Hay ${asientosSinNombre} asientos sin nombre asignado. Primero selecciona qué jugador se sienta en cada sitio.`);
        return;
    }

    const btn = document.getElementById('btn-asignar');
    if(btn) btn.disabled = true;

    let rolesParaAsignar = [...rolesEnPartida];
    const rolFalso = document.getElementById('rol-falso-borracho').value;
    let final = new Array(numJugadores);

    // Identificar el Demonio real para que el Lunático lo vea
    const nombreDemonioReal = rolesParaAsignar.find(r => {
        const d = ROLES_TOTALES_CATALOGO.find(cat => cat.nombre === r);
        return d && d.tipo === "demonio";
    });
    const infoDemonioReal = ROLES_TOTALES_CATALOGO.find(r => r.nombre === nombreDemonioReal);

    if (rolesParaAsignar.includes("Borracho")) {
        rolesParaAsignar = rolesParaAsignar.filter(r => r !== "Borracho" && r !== rolFalso);
        const posB = Math.floor(Math.random() * numJugadores);
        final[posB] = { rol: rolFalso, esBorrachoReal: true };
        rolesParaAsignar.sort(() => Math.random() - 0.5);
        let idx = 0;
        for (let i = 0; i < numJugadores; i++) if (i !== posB) final[i] = { rol: rolesParaAsignar[idx++], esBorrachoReal: false };
    } else {
        rolesParaAsignar.sort(() => Math.random() - 0.5);
        for (let i = 0; i < numJugadores; i++) final[i] = { rol: rolesParaAsignar[i], esBorrachoReal: false };
    }

    const efectosDisponibles = new Set();
    rolesEnPartida.forEach(nombre => {
        const rData = ROLES_TOTALES_CATALOGO.find(r => r.nombre === nombre);
        if (rData && rData.efecto !== "none") efectosDisponibles.add(rData.efecto);
    });

    final.forEach((data, i) => {
        const c = containers[i];
        const display = c.querySelector('.rol-display');
        const nombreJug = c.querySelector('.nombre-jugador').value;
        const infoRolReal = ROLES_TOTALES_CATALOGO.find(r => r.nombre === data.rol);
        
        display.value = data.rol;
        display.classList.remove('bg-morado', 'bg-azul', 'bg-cobalto', 'bg-rojo', 'bg-carmesí', 'bg-cerveza', 'bg-lunatico');

        if (data.esBorrachoReal) {
            display.classList.add('bg-cerveza');
        } else {
            if (infoRolReal.nombre === "Lunático") display.classList.add('bg-lunatico');
            else if (infoRolReal.tipo === "demonio") display.classList.add('bg-carmesí');
            else if (infoRolReal.tipo === "esbirro") display.classList.add('bg-rojo');
            else if (infoRolReal.tipo === "forastero") display.classList.add('bg-cobalto');
            else display.classList.add('bg-azul');
        }

        // LÓGICA DE ENVÍO PRIVADO (LUNÁTICO VE AL DEMONIO)
        let rolAEnviar = infoRolReal;
        if (infoRolReal.nombre === "Lunático" && infoDemonioReal) {
            rolAEnviar = infoDemonioReal;
        }

        socket.emit('enviar-rol-privado', {
            target: nombreJug,
            nombre: rolAEnviar.nombre,
            info: rolAEnviar.info,
            tipo: rolAEnviar.tipo, 
            emoji: rolAEnviar.emoji
        });

        const selectsEfectos = c.querySelectorAll('.estado-jugador.secundario');
        selectsEfectos.forEach((sel, idx) => {
            sel.innerHTML = `<option value="">- Efecto ${idx + 1} -</option>`;
            efectosDisponibles.forEach(ef => {
                const opt = document.createElement('option');
                opt.value = ef; opt.textContent = ef;
                sel.appendChild(opt);
            });
        });
    });
    enviarEstados();
    alert("¡Roles asignados y enviados correctamente!");
}

function empezarVotacion() {
    socket.emit('iniciar-votacion-global');
    document.getElementById('btn-voto-inicio').style.display = 'none';
    document.getElementById('btn-voto-fin').style.display = 'inline-block';
}

function acabarVotacion() {
    socket.emit('finalizar-votacion-global');
    document.getElementById('btn-voto-inicio').style.display = 'inline-block';
    document.getElementById('btn-voto-fin').style.display = 'none';
}

function mostrarRolesFuera() {
    const fuera = ROLES_ACTUALES_DISPONIBLES.filter(r => 
        !rolesEnPartida.includes(r.nombre) && 
        r.tipo !== "demonio" && 
        r.tipo !== "esbirro"
    );
    socket.emit('notificar-roles-fuera-demonio', fuera);
}

function cerrarModal() {
    document.getElementById('grimorio').style.opacity = "1";
    document.getElementById('modal-roles').style.display = "none";
}

function volverAlMenu() { 
    if(confirm("¿Seguro? Se borrará la partida actual.")) { 
        socket.emit('resetear-partida-completa');
        setTimeout(() => { location.reload(); }, 200);
    } 
}

function mostrarMaldad() {
    const containers = document.querySelectorAll('.jugador-container');
    let demonioReal = null;
    let esbirrosReales = [];
    let lunaticoNombre = null;
    let esbirrosFalsos = []; // Lista para el Lunático

    containers.forEach(c => {
        const nombreInput = c.querySelector('.nombre-jugador');
        const rolInput = c.querySelector('.rol-display');
        const btnFalso = c.querySelector('.btn-falso-lunatico');
        
        if (nombreInput && rolInput) {
            const nombre = nombreInput.value.trim();
            const rolActual = rolInput.value;
            
            if (nombre !== "") {
                // Si el botón de calavera está activo, lo añadimos a la lista del engaño
                if (btnFalso && btnFalso.classList.contains('activo')) {
                    esbirrosFalsos.push(nombre);
                }

                const infoRol = ROLES_TOTALES_CATALOGO.find(r => r.nombre === rolActual);
                if (infoRol) {
                    if (infoRol.tipo === 'demonio') demonioReal = nombre;
                    else if (infoRol.tipo === 'esbirro') esbirrosReales.push(nombre);
                }
                
                if (rolActual === "Lunático") lunaticoNombre = nombre;
            }
        }
    });

    // Enviar a los Malvados Reales
    if (demonioReal || esbirrosReales.length > 0) {
        socket.emit('revelar-maldad-equipo', { 
            demonio: demonioReal, 
            esbirros: esbirrosReales 
        });
    }

    // Enviar al Lunático (EL ENGAÑO)
    if (lunaticoNombre) {
        socket.emit('enviar-maldad-falsa-lunatico', {
            target: lunaticoNombre,
            demonio: lunaticoNombre, 
            esbirrosFalsos: esbirrosFalsos // La lista que acabamos de llenar
        });
    }

    alert("Maldad enviada. Los malvados conocen a sus aliados y el Lunático ha sido engañado.");
}

let chatActivoCon = "";
        let historialChats = {}; // { nombreJugador: [mensajes] }

        function toggleMenuChats() {
            const selector = document.getElementById('selector-chat-gm');
            const ventana = document.getElementById('chat-gm');
            
            if (selector.style.display === 'block' || ventana.style.display === 'flex') {
                selector.style.display = 'none';
                ventana.style.display = 'none';
            } else {
                selector.innerHTML = '<option value="">-- Selecciona Jugador --</option>';
                nombresDisponibles.forEach(n => {
                    const opt = document.createElement('option');
                    opt.value = n; opt.textContent = n;
                    selector.appendChild(opt);
                });
                selector.style.display = 'block';
            }
        }

        function abrirChatConJugador(nombre) {
            if(!nombre) return;
            chatActivoCon = nombre;
            document.getElementById('chat-con-titulo').textContent = `Chat con: ${nombre}`;
            document.getElementById('selector-chat-gm').style.display = 'none';
            document.getElementById('chat-gm').style.display = 'flex';
            renderizarMensajesGM();
        }

        function cerrarChatGM() {
            document.getElementById('chat-gm').style.display = 'none';
            chatActivoCon = "";
        }

        function enviarMensajeGM() {
            const input = document.getElementById('input-msg-gm');
            const texto = input.value.trim();
            if(!texto || !chatActivoCon) return;

            const msgData = { remitente: "GM", destino: chatActivoCon, texto: texto };
            socket.emit('enviar-mensaje', msgData);
            
            if(!historialChats[chatActivoCon]) historialChats[chatActivoCon] = [];
            historialChats[chatActivoCon].push(msgData);
            
            renderizarMensajesGM();
            input.value = "";
        }

        socket.on('recibir-mensaje', (data) => {
            // El GM recibe todos los mensajes, pero solo le interesan los dirigidos a él
            if(data.destino === "GM") {
                const jug = data.remitente;
                if(!historialChats[jug]) historialChats[jug] = [];
                historialChats[jug].push(data);
                if(chatActivoCon === jug) renderizarMensajesGM();
                else alert(`Nuevo mensaje de ${jug}`);
            }
        });

        function renderizarMensajesGM() {
            const contenedor = document.getElementById('mensajes-gm');
            contenedor.innerHTML = "";
            const msgs = historialChats[chatActivoCon] || [];
            msgs.forEach(m => {
                const div = document.createElement('div');
                div.innerHTML = `<span class="msg-nombre">${m.remitente}:</span><span class="msg-texto">${m.texto}</span>`;
                contenedor.appendChild(div);
            });
            contenedor.scrollTop = contenedor.scrollHeight;
        }

        let localStream;
    let peerConnection;
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

    function toggleMenuLlamadas() {
        const selector = document.getElementById('selector-llamada-gm');
        if (selector.style.display === 'block') {
            selector.style.display = 'none';
        } else {
            selector.innerHTML = '<option value="">-- Llamar a... --</option>';
            nombresDisponibles.forEach(n => {
                const opt = document.createElement('option');
                opt.value = n; opt.textContent = n;
                selector.appendChild(opt);
            });
            selector.style.display = 'block';
        }
    }

    async function iniciarLlamada(nombreDestino) {
        if(!nombreDestino) return;
        document.getElementById('selector-llamada-gm').style.display = 'none';
        
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        peerConnection = new RTCPeerConnection(config);
        
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('webrtc-candidate', { target: nombreDestino, candidate: event.candidate });
            }
        };

        peerConnection.ontrack = event => {
            document.getElementById('audio-remoto').srcObject = event.streams[0];
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket.emit('webrtc-offer', { target: nombreDestino, offer: offer });
        document.getElementById('btn-colgar-gm').style.display = 'block';
    }

    socket.on('webrtc-answer', async (data) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('webrtc-candidate', async (data) => {
        if (peerConnection) await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    function finalizarLlamada() {
        socket.emit('finalizar-llamada-global');
        cerrarConexion();
    }

    socket.on('llamada-finalizada-remoto', cerrarConexion);

    function cerrarConexion() {
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        document.getElementById('btn-colgar-gm').style.display = 'none';
    }

    