from kakebo import app  
from kakebo.dataccess import DBmanager
from flask import jsonify, render_template
import sqlite3

dbManager = DBmanager(app.config.get('DATABASE')) #La instancia dbManager va a coger del objeto config de la app la ruta de acceso al fichero de la base de datos que esta asignada a DATABASE, es decir '/data/movimientos.db'. La inyectamos en la clase DBManager al instanciarla.

@app.route('/')
def listaMovimientos():  #Creo esta funcion para servir un HTML en el navegador para que muestre los resultados de los movmientos
    return render_template('spa.html') #Esto devuelve en el navegador lo que meteremos en spa.htl y spa.js, es decir, el esqueleto de la pagina, tablas, titulos y demas, y todo lo que se muestre a partir del fichero spa.js


@app.route('/api/v1/movimientos')
def movimientosAPI():
    query = "SELECT * FROM movimientos order by fecha"
   
    try:
        lista = dbManager.consultaMuchasSQL(query) #Aqui va a devolver una lista, si no hay nada la devulve vacia, es una lista de diccionarios. Est ya seria el json 
        return jsonify({'status': 'success', 'movimientos':lista})

    except sqlite3.Error as e:
        return jsonify({'status': 'fail', 'mensaje': str(e)}) #Si se produce un error en la consulta, devuelve un mensaje string con el error