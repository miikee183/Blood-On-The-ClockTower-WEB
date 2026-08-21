const socket = io();

// Catálogo de roles (se carga dinámicamente desde ediciones.json)
let EDICIONES = {};

async function cargarEdiciones() {
    try {
        const response = await fetch('/data/ediciones.json');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        EDICIONES = await response.json();
        console.log('✅ Ediciones cargadas correctamente desde JSON.');
    } catch (error) {
        console.error('❌ Error al cargar ediciones.json:', error);
        alert('Error crítico: No se pudieron cargar los roles. Recarga la página.');
    }
}

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

window.onload = async function() {
    await cargarEdiciones();
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

    