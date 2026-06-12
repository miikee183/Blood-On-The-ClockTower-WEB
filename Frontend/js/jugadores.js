const socket = io();
        const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        
        let miNombre = "";
        let miEstado = "Vivo";
        let miTipoRol = "";
        let miNombreDeRol = ""; 
        let historialMensajes = [];
        let peerConnectionJugador;
        let localStreamJugador;
        let llamadaPendingData = null;
        let muted = false;
        let votoFantasmalUsado = false;

        async function actualizarListaMicros() {
            const selector = document.getElementById('selector-microfono');
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const dispositivos = await navigator.mediaDevices.enumerateDevices();
                const micros = dispositivos.filter(d => d.kind === 'audioinput');
                selector.innerHTML = '';
                micros.forEach((m, i) => {
                    const opt = document.createElement('option');
                    opt.value = m.deviceId;
                    opt.textContent = m.label || `Micrófono ${i + 1}`;
                    selector.appendChild(opt);
                });
            } catch (err) { selector.innerHTML = '<option>Sin micro</option>'; }
        }

        function ajustarVolumen(valor) {
            document.getElementById('audio-gm').volume = valor;
        }

        function toggleMute() {
            if (localStreamJugador) {
                muted = !muted;
                localStreamJugador.getAudioTracks()[0].enabled = !muted;
                const btn = document.getElementById('btn-mute-jugador');
                btn.textContent = muted ? "🔇" : "🎙️";
                btn.style.background = muted ? "#333" : "#620b0b";
            }
        }

        actualizarListaMicros();

        function registrarUsuario() {
            const input = document.getElementById('input-usuario');
            const nombre = input.value.trim();
            if (nombre === "") return;
            socket.emit('registro-nombre', nombre, (success) => {
                if (success) {
                    miNombre = nombre;
                    document.getElementById('login-overlay').style.display = 'none';
                    actualizarListaMicros();
                } else { alert("Nombre en uso."); }
            });
        }

        function toggleChatJugador() {
            const chat = document.getElementById('chat-privado');
            chat.style.display = (chat.style.display === 'flex') ? 'none' : 'flex';
        }

        function enviarMensajeAlGM() {
            const input = document.getElementById('input-msg-privado');
            const texto = input.value.trim();
            if(!texto || !miNombre) return;
            const msgData = { remitente: miNombre, destino: "GM", texto: texto };
            socket.emit('enviar-mensaje', msgData);
            historialMensajes.push(msgData);
            renderizarMensajesPrivados();
            input.value = "";
        }

        socket.on('recibir-mensaje', (data) => {
            if(data.destino === miNombre) {
                historialMensajes.push(data);
                renderizarMensajesPrivados();
            }
        });

        function renderizarMensajesPrivados() {
            const contenedor = document.getElementById('mensajes-privados');
            contenedor.innerHTML = "";
            historialMensajes.forEach(m => {
                const div = document.createElement('div');
                div.innerHTML = `<span class="msg-nombre">${m.remitente}</span><span class="msg-texto">${m.texto}</span>`;
                contenedor.appendChild(div);
            });
            contenedor.scrollTop = contenedor.scrollHeight;
        }

        socket.on('recibir-rol', (data) => {
            if (data.target === miNombre) {
                miTipoRol = data.tipo;
                miNombreDeRol = data.nombre;
                const catMap = { "demonio": "Demonio", "esbirro": "Esbirro", "pueblerino": "Pueblo", "forastero": "Forastero" };
                document.getElementById('privado-categoria').textContent = catMap[data.tipo] || "";
                document.getElementById('card-inner').className = `card-rol-asignado ${data.tipo}`;
                document.getElementById('privado-emoji').textContent = data.emoji;
                document.getElementById('privado-nombre').textContent = data.nombre;
                document.getElementById('privado-info').textContent = data.info;
                document.getElementById('modal-rol-privado').style.display = 'block';
                const sticky = document.getElementById('sticky-rol-info');
                sticky.innerHTML = `Tu Rol: ${data.emoji} ${data.nombre}`;
                sticky.style.display = 'block';
            }
        });

        // 1. ESCUCHAR MALDAD REAL
socket.on('recibir-maldad', (data) => {
    // Si soy el Lunático, ignoro la maldad real para que no se pise con el engaño
    if (miNombreDeRol === "Lunático") return;

    const cuerpo = document.getElementById('cuerpo-maldad');
    if (!cuerpo) return;

    let contenido = "";

    if (miNombre === data.demonio) {
        // Vista del Demonio Real
        contenido = `
            <div class="maldad-seccion">
                <strong class="maldad-titulo">Tus Esbirros:</strong>
                <div class="maldad-lista">${(data.esbirros && data.esbirros.length > 0) ? data.esbirros.join(', ') : 'Ninguno'}</div>
            </div>
        `;
    } else if (data.esbirros && data.esbirros.includes(miNombre)) {
        // Vista del Esbirro Real
        contenido = `
            <div class="maldad-seccion">
                <strong class="maldad-titulo">Tu Demonio:</strong>
                <div class="maldad-lista">${data.demonio}</div>
            </div>
            <div class="maldad-seccion">
                <strong class="maldad-titulo">Esbirros:</strong>
                <div class="maldad-lista">${data.esbirros.join(', ')}</div>
            </div>
        `;
    }

    if (contenido !== "") {
        cuerpo.innerHTML = contenido;
        document.getElementById('modal-info-maldad').style.display = 'block';
    }
});

// 2. ESCUCHAR MALDAD FALSA (Solo para el Lunático)
socket.on('info-falsa-lunatico', (data) => {
    // Solo si el mensaje va dirigido a mí
    if (miNombre === data.target) {
        const cuerpo = document.getElementById('cuerpo-maldad');
        if (!cuerpo) return;

        const listaNombres = data.esbirrosFalsos || [];
        
        // Usamos EXACTAMENTE la misma estructura que la del Demonio Real
        cuerpo.innerHTML = `
            <div class="maldad-seccion">
                <strong class="maldad-titulo">Tus Esbirros:</strong>
                <div class="maldad-lista">${listaNombres.length > 0 ? listaNombres.join(', ') : 'Ninguno'}</div>
            </div>
        `;
        
        document.getElementById('modal-info-maldad').style.display = 'block';
    }
});

        socket.on('ver-roles-fuera', (rolesFuera) => {
            if (miTipoRol === 'demonio') {
                const contenedorPadre = document.getElementById('contenedor-roles-fuera');
                const listaVisual = document.getElementById('lista-roles-fuera');
                const barra = document.getElementById('barra-progreso');
                const txtContador = document.getElementById('txt-cuenta-atras');
                listaVisual.innerHTML = '';
                contenedorPadre.style.display = 'block'; 
                rolesFuera.forEach(rol => {
                    const divRol = document.createElement('div');
                    divRol.className = `mini-card-rol ${rol.tipo}`; 
                    divRol.innerHTML = `<span>${rol.emoji || ''}</span> <strong>${rol.nombre}</strong>`;
                    listaVisual.appendChild(divRol);
                });
                let seg = 10;
                txtContador.textContent = seg + "s";
                barra.style.width = "100%";
                barra.style.transition = "width 10s linear";
                setTimeout(() => barra.style.width = "0%", 100);
                let t = setInterval(() => {
                    seg--; txtContador.textContent = seg + "s";
                    if (seg <= 0) { clearInterval(t); contenedorPadre.style.display = 'none'; }
                }, 1000);
            }
        });

        function ejecutarVoto() {
            const btn = document.getElementById('btn-votar');
            if (miEstado !== "Vivo") votoFantasmalUsado = true;
            socket.emit('registrar-voto', miNombre);
            btn.disabled = true; btn.textContent = "VOTO ENVIADO"; btn.style.filter = "grayscale(1)";
        }

        socket.on('votacion-iniciada', () => {
            const container = document.getElementById('voto-btn-container');
            const btn = document.getElementById('btn-votar');
            if (miEstado !== "Vivo" && votoFantasmalUsado) {
                btn.disabled = true; btn.textContent = "VOTO USADO";
            } else {
                btn.disabled = false; btn.textContent = "VOTAR"; btn.style.filter = "none";
            }
            container.style.display = 'block';
        });

        socket.on('votacion-finalizada', () => {
            document.getElementById('voto-btn-container').style.display = 'none';
            document.querySelectorAll('.jugador-publico').forEach(el => el.classList.remove('ha-votado'));
        });

        socket.on('nuevo-voto-recibido', (nombre) => {
            document.querySelectorAll('.jugador-publico').forEach(card => {
                if (card.querySelector('.nombre-publico').textContent === nombre) {
                    card.classList.add('ha-votado');
                }
            });
        });

        socket.on('recibir-oferta-llamada', (data) => {
            if (data.target === miNombre) {
                llamadaPendingData = data.offer;
                document.getElementById('btn-llamada-jugador').classList.add('recibiendo-llamada');
            }
        });

        async function aceptarLlamada() {
            if (!llamadaPendingData) return;
            const btnLlamada = document.getElementById('btn-llamada-jugador');
            const microId = document.getElementById('selector-microfono').value;

            try {
                localStreamJugador = await navigator.mediaDevices.getUserMedia({ 
                    audio: { 
                        deviceId: microId ? { exact: microId } : undefined,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    } 
                });

                peerConnectionJugador = new RTCPeerConnection(config);
                localStreamJugador.getTracks().forEach(track => peerConnectionJugador.addTrack(track, localStreamJugador));

                peerConnectionJugador.onicecandidate = event => {
                    if (event.candidate) socket.emit('webrtc-candidate', { target: "GM", candidate: event.candidate });
                };

                peerConnectionJugador.ontrack = event => {
                    document.getElementById('audio-gm').srcObject = event.streams[0];
                };

                await peerConnectionJugador.setRemoteDescription(new RTCSessionDescription(llamadaPendingData));
                const answer = await peerConnectionJugador.createAnswer();
                await peerConnectionJugador.setLocalDescription(answer);
                
                socket.emit('webrtc-answer', { target: "GM", answer: answer });
                
                btnLlamada.classList.remove('recibiendo-llamada');
                btnLlamada.classList.add('en-llamada');
            } catch (err) { alert("Error al conectar audio."); }
        }

        socket.on('webrtc-candidate', async (data) => {
            if (peerConnectionJugador) await peerConnectionJugador.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        socket.on('llamada-finalizada-remoto', () => {
            if (peerConnectionJugador) { peerConnectionJugador.close(); peerConnectionJugador = null; }
            if (localStreamJugador) { localStreamJugador.getTracks().forEach(t => t.stop()); }
            document.getElementById('btn-llamada-jugador').classList.remove('en-llamada', 'recibiendo-llamada');
            llamadaPendingData = null;
        });

        socket.on('partida-reseteada', () => location.reload());

        function actualizarMesaVisual(datos) {
            const contenedor = document.getElementById('grimorio-publico');
            if (!datos || !datos.lista || datos.lista.length === 0) return;
            contenedor.innerHTML = ""; 
            datos.lista.forEach(jug => {
                if (jug.nombre === miNombre) miEstado = jug.estado;
                const div = document.createElement('div');
                // Se aplican las clases de estado (vivo, muerto, ejecutado)
                div.className = `jugador-publico ${jug.estado.toLowerCase()} ${jug.escala || ''}`;
                div.style.left = jug.x; div.style.top = jug.y;
                const esPropio = jug.nombre === miNombre ? "nombre-propio" : "";
                div.innerHTML = `<div class="nombre-publico ${esPropio}">${jug.nombre}</div>
                                 <span class="estado-etiqueta">${jug.estado.toUpperCase()}</span>`;
                contenedor.appendChild(div);
            });
        }

        function renderizarRoles(rolesData) {
    const contenedor = document.getElementById('lista-roles-jugadores');
    if (!rolesData || rolesData.length === 0) return;
    contenedor.innerHTML = "";
    
    const titulos = { 
        "demonio": "Demonios", 
        "esbirro": "Esbirros", 
        "pueblerino": "Pueblo", 
        "forastero": "Forasteros" 
    };

    ["demonio", "esbirro", "pueblerino", "forastero"].forEach(tipo => {
        const filtrados = rolesData.filter(r => r.tipo === tipo);
        if (filtrados.length > 0) {
            const t = document.createElement('div');
            t.className = 'seccion-rol-titulo'; 
            t.textContent = titulos[tipo];
            contenedor.appendChild(t);

            filtrados.forEach(rol => {
                const d = document.createElement('div');
                // IMPORTANTE: rol.tipo debe ser "demonio", "esbirro", etc.
                d.className = `rol-info-card ${rol.tipo}`;
                d.innerHTML = `<strong>${rol.nombre} ${rol.emoji}</strong><br>${rol.info}`;
                contenedor.appendChild(d);
            });
        }
    });
}

        socket.on('actualizar-todo', (estado) => {
            renderizarRoles(estado.rolesReferencia);
            actualizarMesaVisual(estado.estadosJugadores);
        });
        socket.on('actualizar-roles', renderizarRoles);
        socket.on('actualizar-estados-jugadores', actualizarMesaVisual);
        function toggleInstrucciones() {
            const p = document.getElementById('panel-instrucciones');
            p.style.display = p.style.display === 'block' ? 'none' : 'block';
        }