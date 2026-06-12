from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, emit
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '../Fontend')
HTML_DIR = os.path.join(FRONTEND_DIR, 'html')

app = Flask(__name__, static_folder=FRONTEND_DIR)
app.config['SECRET_KEY'] = 'botc_secret'

usuarios_conectados = {} # sid: nombre
roles_asignados = {} 

socketio = SocketIO(app, 
                    cors_allowed_origins="*", 
                    max_http_buffer_size=20 * 1024 * 1024,
                    async_mode='threading')

estado_partida = {
    "rolesReferencia": [],
    "estadosJugadores": {"lista": []},
    "nombres_conectados": [],
    "votacion_activa": False,
    "votos_actuales": []
}

@app.route('/')
def index():
    return send_from_directory(HTML_DIR, 'jugadores.html')

@app.route('/gm')
@app.route('/Juego.html')
def gm_panel():
    return send_from_directory(HTML_DIR, 'Juego.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)

@socketio.on('connect')
def handle_connect():
    emit('actualizar-todo', estado_partida)
    emit('lista-nombres-actualizada', estado_partida["nombres_conectados"])

@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in usuarios_conectados:
        nombre = usuarios_conectados[request.sid]
        if nombre in estado_partida["nombres_conectados"]:
            estado_partida["nombres_conectados"].remove(nombre)
        if nombre in roles_asignados:
            del roles_asignados[nombre]
        del usuarios_conectados[request.sid]
        emit('lista-nombres-actualizada', estado_partida["nombres_conectados"], broadcast=True)

@socketio.on('registro-nombre')
def handle_registro(nombre):
    if nombre not in estado_partida["nombres_conectados"]:
        estado_partida["nombres_conectados"].append(nombre)
        usuarios_conectados[request.sid] = nombre
        emit('lista-nombres-actualizada', estado_partida["nombres_conectados"], broadcast=True)
        return True
    return False

# --- LÓGICA DE CHAT PRIVADO ---
@socketio.on('enviar-mensaje')
def handle_mensaje(data):
    # Simplemente retransmitimos; el cliente filtrará si es para él o el GM
    emit('recibir-mensaje', data, broadcast=True)

@socketio.on('cambio-roles')
def handle_roles(nuevos_roles):
    estado_partida["rolesReferencia"] = nuevos_roles
    emit('actualizar-roles', nuevos_roles, broadcast=True, include_self=False)

@socketio.on('actualizar-estados-servidor')
def handle_estados(datos):
    estado_partida["estadosJugadores"] = datos
    emit('actualizar-estados-jugadores', datos, broadcast=True, include_self=False)

@socketio.on('enviar-rol-privado')
def handle_rol_privado(data):
    roles_asignados[data['target']] = data['tipo']
    emit('recibir-rol', data, broadcast=True)

@socketio.on('revelar-maldad-equipo')
def handle_maldad(data):
    emit('recibir-maldad', data, broadcast=True)

@socketio.on('enviar-maldad-falsa-lunatico')
def handle_lunatico_falso(data):
    emit('info-falsa-lunatico', data, broadcast=True)

@socketio.on('notificar-roles-fuera-demonio')
def handle_roles_fuera(roles):
    emit('ver-roles-fuera', roles, broadcast=True)

@socketio.on('iniciar-votacion-global')
def handle_iniciar_voto():
    estado_partida["votacion_activa"] = True
    estado_partida["votos_actuales"] = []
    emit('votacion-iniciada', broadcast=True)

@socketio.on('registrar-voto')
def handle_voto(nombre):
    if estado_partida["votacion_activa"] and nombre not in estado_partida["votos_actuales"]:
        estado_partida["votos_actuales"].append(nombre)
        emit('nuevo-voto-recibido', nombre, broadcast=True)

@socketio.on('finalizar-votacion-global')
def handle_finalizar_voto():
    estado_partida["votacion_activa"] = False
    estado_partida["votos_actuales"] = []
    emit('votacion-finalizada', broadcast=True)

@socketio.on('resetear-partida-completa')
def handle_reset():
    global estado_partida, roles_asignados
    estado_partida["rolesReferencia"] = []
    estado_partida["estadosJugadores"] = {"lista": []}
    estado_partida["votacion_activa"] = False
    estado_partida["votos_actuales"] = []
    roles_asignados = {}
    emit('partida-reseteada', broadcast=True)

@socketio.on('webrtc-offer')
def handle_webrtc_offer(data):
    # data contiene { target: "Nombre", offer: ... }
    emit('recibir-oferta-llamada', data, broadcast=True)

@socketio.on('webrtc-answer')
def handle_webrtc_answer(data):
    # data contiene { target: "GM" o "Nombre", answer: ... }
    emit('webrtc-answer', data, broadcast=True)

@socketio.on('webrtc-candidate')
def handle_webrtc_candidate(data):
    emit('webrtc-candidate', data, broadcast=True)

@socketio.on('finalizar-llamada-global')
def handle_hangup():
    emit('llamada-finalizada-remoto', broadcast=True)



if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)