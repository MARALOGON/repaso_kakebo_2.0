
import sqlite3


class DBmanager():
    def __init__(self, ruta_baseDatos): # En el proceso de instanciacion de la clase se creará un parametro que es la ruta a la base de datos (ruta_baseDatos)
        self.database_path = ruta_baseDatos #Inyecto la ruta_baseDatos como parametro de la instancia y la guardo en la variable database_path. He hecho configurable el acceso a la base de datos para poner la ruta donde quiera

    def __toDict__(self, cur):
        # Obtenemos los datos de la consulta
        claves = cur.description
        filas = cur.fetchall()

        # Procesar los datos para devolver una lista de diccionarios. Un diccionario por fila
        resultado = []
        for fila in filas:
            d = {}
            for tclave, valor in zip(claves, fila):
                d[tclave[0]] = valor
            resultado.append(d)

        return resultado

    def consultaMuchasSQL(self, query, parametros = []): #Con esta función vamos a sacar todo lo referente a las consultas de la función de index para localizarlo aqui. Esta función siempre va a devolver una lista de diccionarios, al pedirle muchas consultas
        conexion = sqlite3.connect(self.database_path) #Abro la conexion con la base de datos. Utilizo self.database_path para que se conecte al fichero /data/movimientos.db, segun he establecido en el fichero config.py
        cur = conexion.cursor() #Creo una instancia del cursor y lo conecto

        #Ejecuto la consulta
        cur.execute(query, parametros) #Este execute queremos que nos devuelva un registro o una lista de registros, de ahi que su parametro sea query        
        resultado = self.__toDict__(cur)
        conexion.close()
        return resultado
    
    def consultaUnaSQL(self, query, parametros = []): #Esta función va a devolver una lista con un registro, ya que solo le solicitamos una busqueda
        resultado = self.consultaMuchasSQL(query, parametros)
        if len(resultado) > 0: #Aqui le dice que si el resultado de la consulta es mayor que 0, es decir, si existe
            return resultado[0] #Lo devuelve el primer elemento como una lista

    def modificaTablaSQL(self, query, parametros = []): #En esta función vamos a incluir todo lo que tenga que ver con las modificaciones de la tabla, el UPDATE, el DELETE, etc.
        conexion = sqlite3.connect(self.database_path) #Abro la conexion con la base de datos. Utilizo self.database_path para que se conecte al fichero movimientos.db, segun he establecido en el fichero config.py
        cur = conexion.cursor()

        cur.execute(query, parametros)


        conexion.commit() #Este commit lo que hace es que el cambio relizado lo fija en la base de datos. Es oblgatorio para que se fije en la base de datos.
        conexion.close()
