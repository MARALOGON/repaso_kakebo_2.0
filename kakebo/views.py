from kakebo import app  
from kakebo.dataccess import DBmanager
from flask import jsonify, render_template, request
import sqlite3
from http import HTTPStatus

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


@app.route('/api/v1/movimiento/<int:id>', methods=['GET', 'PUT', 'DELETE']) #Esta ruta es para obtener movimientos, modificar (put) o borrar, utilizando el id 
@app.route('/api/v1/movimiento', methods=['POST']) #Esta ruta es para crear nuevo movimiento, por lo que no requiere id, ya que este se le asigna la base de datos automaticante cuando se crea nuevo movimiento
def detalleMovimiento(id=None):
    try: #Le meto aqui el try para validacion de errores, delante de todos los request, asi pilla a todos 
        if request.method in ('GET', 'PUT', 'DELETE'):
            movimiento = dbManager.consultaUnaSQL("SELECT * FROM movimientos WHERE id = ?", [id]) #Aqui le digo que me seleccione todos los movimientos cuando el id sea el valor de entrada del id, pero los metes en una lista [id]

        if request.method == 'GET':
            if movimiento:
                return jsonify({
                "status": "success", 
                "movimiento": movimiento
            })
            else: 
                return jsonify({"status": "fail", "mensaje": "movimiento no encomtrado"}), 404 #Cuando creamos una api, Es importante poner el codigo 404 o en su defecto el HTTPStatus.NOT_FOUND si importamos previamente la libreria http y el modulo HTTPStatus cuando la petición no se encuentra 

        if request.method == 'PUT':
            dbManager.modificaTablaSQL("""
            UPDATE movimientos 
            SET fecha=:fecha, concepto=:concepto, esGasto=:esGasto, categoria=:categoria, cantidad=:cantidad
            WHERE id = {}""".format(id), request.json) #Aqui lo actualizo con un diccionario, que es un json, que cuando python lo traduzca a un lenguaje que entienda, es un diccionario, con lo cual losparametros de entrada los voy a volcar igual 
            #El valor con 2 puntos (:) es el valor del campo de entrada, lo que viene en el json y el primer fecha es el nombre del campo en  la base de datos. Se utiliza esta sintaxis porque es la forma de un diccionario, que es lo qeu necesitamos para enviarlo a la base de datos
            #Los parametros de entrada van a ser request.json

            return jsonify({"status":"success", "mensaje": "Registro modificado"})
        
    except sqlite3.Error as e:
        return jsonify({"status":"fail", "mensaje": "Error en base de datos: {}".format(e)}), HTTPStatus.BAD_REQUEST
