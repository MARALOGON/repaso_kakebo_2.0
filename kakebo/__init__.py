from flask import Flask

app = Flask(__name__, instance_relative_config=True) #Este segundo parametro significa que la configuración va a ir externa, no la vamos a meter en el codigo (va en el fcihero config.py)
app.config.from_object("config") #Ahora app tiene un atributo config., que es la configuración, una especie de diccionario de pares clave-valor. Le decimos en  este config que lo cree del objeto config y le incluimos la ruta. En este caso, que lo cree a partir de la extension config.py, que tiene la variable DATABASE asignada a la ruta /data/movimientos.db
#En este caso, nos creraá 2 parametros de configuracion, el SECRET_KEY y el DATABASE_PATH, que es lo que va a hcer que WTF funcione

from kakebo.views import *