# ¿Qué es Blood on the clocktower?

Es uno de los mejores juegos de mesa de roles ocultos, el problema que tiene es que cuesta aproximadamente 150$ aparte que está descatalogado.

![Imagen juego](Frontend/imagenes/ReadmeFoto.png)

# Objetivo

Este proyecto lo hice para poder jugar con mis amigos al juego de mesa sin tenerlo, lo he llegado a jugar con más de 12 personas y salio todo perfecto.

![Imagen juego](Frontend/imagenes/foto1.png)

# Proyecto 

Es una página web que se divide en un backend y un Frontend que cuenta con 2 HTML, uno es la ventana que van a ver los jugadores y la otra ventana será la que verá el administrador de la partida.
La web cuenta con el uso de ngrok que sirve para hacer un enlace público para que todos los jugadores puedan conectarse al servidor del dispositivo del administrador.

![Imagen juego](Frontend/imagenes/foto2.png)

Los jugadores verán los roles posibles en la partida y verá la mesa con todos los jugadores de la partida.
Además de tener un chat entre los jugadores con el administrador y un sistema de llamadas que no funciona tengo pendiente que funcione.
En cambio el administrador verá la mesa con los jugadores y podrá gestionar como trascurre la partida.

Este proyecto lo hice por puro ocio porque cuando tengo ganas en hacer algo estoy horas enganchado.

# Manual de uso

Descargamos ngrok, luego ejecutamos el backend que es app.py, luego copiamos la ruta de nuestro explorador de archivos donde tenemos ngrok descargado, entramos en la terminal y pegamos esa misma ruta y le ponemos al final http 5000
Este comando generará el enlace público lo copiamos y se lo mandamos a todos los jugadores.
Y por ultimo el administrador copiará ese mismo enlace nuevo pero le añadirá juego.html al final para entrar en la ventana de administrador.

![Imagen juego](Frontend/imagenes/foto3.png)

*Recomiendo jugarlo en discord.*

<img src="frontend/imagenes/foto4.png" alt="discord" width="350">
