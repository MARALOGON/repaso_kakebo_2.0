const categorias = { //Creo el objeto categorias en forma de diccionario, si bien las claves no tienen que ir entre comillas, al contrario que en python. No es un diccionario, es un objeto.
    CU: 'Cultura',
    SU: 'Supervivencia',
    OV: 'Ocio-vicio',
    EX: 'Extra'

}

let losMovimientos  //Creo la variable losMvimientos vacia en el ambito global
xhr = new XMLHttpRequest() //Creo el manejador de peticiones 

function recibeRespuesta() { //creo esta función para que se muestre en el navegador, en la tabla de movimientos,las modificaciones de los movimientos realizadas a treves del formulario de detalle de movimiento
    if (this.readyState === 4 && (this.status === 200 || this.status === 201)) { //Aqui dice si el status es igual o (||) es igual a 201, que es el codigo de status para un nuevo objeto creado, que es lo que hacemos con la funcion llamaApiCreaMovimiento. Quiere decir "si todo ha ido bien o has creado un recurso"
        const respuesta = JSON.parse(this.responseText)

        if (respuesta.status !== "success") {
            alert("Se ha producido un error en acceso a servidor" + respuesta.mensaje)
            return
        }

        alert(respuesta.mensaje) //Este alert es para que cuando se haga una modificación con exito salga un mensaje, sale el mismo mensaje que hemos puesto en el archivo views.py cuando se realiza una modificación con exito ("Registro modificado con éxito")

        llamaApiMovimientos() //Este llamaApiMovimientos va a hacer lo mismo que el onload, va a crear la peticion 'GET', `http://localhost:5000/api/v1/movimientos`, la va a lanzar, cuando llegue, muestraMovimientos va a volver a mostrar la lista. Lo que no hace muestraMovimientos es limpiar la lista, asi qeu lo vamos a hacer quitando el const tbody de donde estaba
        
    }
}

function detallaMovimiento(id) { //Creo esta función para que se mnuestre en el formulario de detalle de movimiento los datos de todos los campos que contiene el movimiento seleccionado, sobre el cual pincho, de toda la tabla de movimientos mostrada en el navegador

    //movimiento = losMovimientos.filter(item => item.id == id)[0] Esta es la maera reducida de poner el for de abajo
    let movimiento 
    for (let i=0; i<losMovimientos.length; i++) { //Como en losMovimientos se han guardado todos los registros o ovimemtnos de la base de datos, para JS estos se guardan en un array, tipo 0 (indice): y todos los campos y valores de cada campo
        const item = losMovimientos[i] //Creo la variale item, que a cada vuelta del bucle, se convierte en el indice siguiente del array que le toca recorrer, primero el 0, luego el 1, etc... eso lo conseguimos con el i++ del for
        if (item.id == id) { //Aqui le digo que si el id de item es igual al id del regsitro que yo he pulsado, sobre el que he hecho click
            movimiento = item //Entonces se asigna a la variable movimiento, que he creado antes del bucle 
            break // Y ya me salgp del bucle, no quiero seguir buscando
        }
    }
    if (!movimiento) return 

    document.querySelector("#idmovimiento").value = id //Esto sirve para guardar el id de cada movimiento, se guarda en la funcion detallaMovimiento y se recupera cuando se hace click en ese registro, en caso de que lo hagamos para modificarlo, para pasar los datos al formulaio de detalle de movimiento, aunq el id no se va a mostrar, ya que se ha creado como un campo oculto en el HTML
    document.querySelector("#fecha").value = movimiento.fecha  //Este movmiento.fecha es el valor del item.fecha como se ha definido en el bloque de for arriba
    document.querySelector("#concepto").value = movimiento.concepto
    document.querySelector("#categoria").value = movimiento.categoria
    document.querySelector("#cantidad").value = movimiento.cantidad.toFixed(2) //toFixed es para que le ponga decimales, el numero de decimales se pone entre parentesis
    if(movimiento.esGasto == 1) {
        document.querySelector("#gasto").checked = true
    } else {
        document.querySelector("#ingreso").checked = true
    }
}

function muestraMovimientos() { //Creo esta función para que se muestren todos los registros de la base de datos en la tabla de movmientos que hemos creado para visualilzar la base de datos en el navegador
    if (this.readyState === 4 && this.status === 200) { //Aqui el objeto this se utiliza como equivalente a quien invoca la funcion, que en este caso es xhr.  
        const respuesta = JSON.parse(this.responseText) //JSON es un objeto de Javascript. El método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis. Con esto conseguimos un objeto parecido a un diccionario Python que vamos a poder manejar. 
        
        if (respuesta.status !== "success") {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }

        losMovimientos = respuesta.movimientos //Guardo los movimientos en la variable los mOVIMIENTOS EN LA MEMORIA DE LA PAGINA, al asignarle el vaLor respuesta.movimientos. Ya puedo acceder a ellos desde el forntend desde el id.
        const tbody = document.querySelector(".tabla-movimientos tbody") //Creo la constante tbody, donde se guardan los datos que aparecen en la const dentro. Elijo el punto del DOM donde quiero meter estos datos, que es en el tbody del fichero spa.html. Se separa por un espacio porque es un selector de CSS combinador de descendientes
        //Meto ahora aqui la constante tbody para que limpie la lista de movimientos y la vuelva a cargar cuando hagamos una modifciación de la tabla de movimientos
        tbody.innerHTML = "" 
        for (let i=0; i < respuesta.movimientos.length; i++) { //Recorro todas las respuestas obtenidas con la peticion, mientras la respuesta tenga movimientos que mostrar, es decir, mientras respuesta.movimientos.length
            const movimiento = respuesta.movimientos[i] //Se crea la variable movimiento para guardar cada uno de los movimientos que se muestran como consecuencia de la respuesta de la petición a los movimientos de la base de datos
            
            const fila = document.createElement("tr")
            fila.addEventListener("click", () => detallaMovimiento(movimiento.id)) //Creo un escuchador de eventos en las filas, para que cuando pulse encima de ella, se muestre en el detalle el contenido de los campos que quiero modificar. la función detallaMovimiento se ejecutará cuando se produzca el click.
            //En esta fila de arriba, si pones toda la arrow function en una sola linea, no hace falta poner las llaves {}

            
            
            const dentro = `
                <td>${movimiento.fecha}</td>
                <td>${movimiento.concepto}</td>
                <td>${movimiento.esGasto ? "Gasto" : "Ingreso"}</td> 
                <td>${movimiento.categoria ? categorias[movimiento.categoria] : ""}</td>
                <td>${movimiento.cantidad} €</td>
            `
            fila.innerHTML = dentro //Inyectamos en la fila los datos que correspondan a cada registro segun los hemos indicado en la constante dentro
            
            tbody.appendChild(fila) //Se ubica dentro de cada fila que se crea, de cada <tr>
        
        }
    }
}


function llamaApiMovimientos() { //Esta función abre la llamada a la api de movimientos y la envia
    xhr.open('GET', `http://localhost:5000/api/v1/movimientos`, true) /*Esta funcion lo que hace es crear la url */
    xhr.onload = muestraMovimientos //Cuando se produzca la carga de lo que devulve la petición, se va a ejecutar la funcion muestraMovimientos
    xhr.send()
}

function capturaFormMovimiento() { //Esta función la creo para capturar los datos que se incluyan en los campos del formulario de detalle de movimiento, bien sea para modificar o para crerar, que eran las dos funciones que originalmente contenian este codigo
    //Con esto recupero los datos del formulario para poder enviarlos en un objeto en forma de json al servidor
    const movimiento = {}// Ahira tengo que coger los datos que ha modificado el usuario y transformarlos para enviarlos al servidor. Para ello, creamos una const y laigualamos a un diccionario vacio {}, que es el json que voy a enviar
    movimiento.fecha = document.querySelector("#fecha").value //En la clave de diccionario movimiento.fecha se incluira el nuevo valor introducido, si es que se ha modificado, sino guarda el que esté
    movimiento.concepto = document.querySelector("#concepto").value
    movimiento.categoria = document.querySelector("#categoria").value
    movimiento.cantidad = document.querySelector("#cantidad").value
    if (document.querySelector("#gasto").checked) { //Aqui le digo, si el id gasto (que es el radiobutton), esta checado, 
        movimiento.esGasto = 1  //Entonces, es un gasto, debe guardarse como gasto en la base de datos
    } else {
        movimiento.esGasto = 0 //Y si no esta checado el boton de gasto, esGasto es igaul a 0, es decir, es un ingreso y se guardara asi en la base de datos
    }
    return movimiento //DEvuelvo el objeto movimiento que he creado con los nuevos datos de los campos

}

function validar(movimiento) { //Esta funcion es para validar las peticiones al servidor, principalmnte se van a usar para modificar y crear registros
    if (!movimiento.fecha) { //Este if valida y obliga a introducir la fecha
        alert("Fecha obligatoria")
        return false
    }

    if (movimiento.concepto === "") { //Este if valida y obliga a introducir el concepto
        alert("Concepto obligatorio")
        return false
    }

    if (!document.querySelector("#gasto").checked && !document.querySelector("#ingreso").checked) { //Este if valida y obliga a elegir el checked entre gasto o ingreso
        alert("Elija tipo de movimiento") //En la linea de arriba dice: "si el radio button de gasto no esta checkeado y el de ingreso tampoco, entonces salta el mensaje de validacion de la siguiente linea"
        return false
    }

    if (movimiento.esGasto && !movimiento.categoria) { //Este if valida y obliga a seleccionar una categora de gasto cuando el checked de gasto esta marcado
        alert("Debe seleccionar categoria del gasto")
        return false
    }

    if (!movimiento.esGasto && movimiento.categoria) { //Este if valida e informa de que si esta el boton de checked marcado en ingreso, no se puede seleccionar categoria
        alert("Un ingreso no puede tener categoria")
        return false
    }

    if (movimiento.cantidad <= 0) {  //Este if valida y obliga a introducir una cantidad positiva mayor que 0
        alert("La cantidad ha de ser positiva")
        return false
    }

    return true //Solo es valida la validacion cuando ha superado todas las validacines anteriores
}

function llamaApiModificaMovimientos(ev) { //Esta funcion la creo para poder modificar los movimientos que se meustran en la tabla de movimientos del navegador, despues de haber llamado a la API que muestra lo uqe hya en la base de datos
        ev.preventDefault()   // Con el ev.preventDefault, lo que se consigue es que por defecto, no se relance la pagina, se para ese evento
        
        id = document.querySelector("#idmovimiento").value //Con esto lo que hago es guardar en la memoria del navegador el valor del id que sale al seleccionar un movimiento de la tabla de movimientos, lo guardo en la variable id
        
        if(!id) { //Si el id no esta informado, es decir si no se ha seleccionado movimiento para modificar
            alert("Selecciona un movimiento para modificar") //Salta este mensaje de error
            return
        }   
        
        const movimiento = capturaFormMovimiento() //En esta variable movimiento guardo el objeto que devuelve la funcion capturaFormMovimiento, que son los nuevos datos que he introducido en el formulario para modificar un registro existente
        if (!validar(movimiento)) // Si no se ha validado el movimiento
            return //Salte de la funcion 
         

        xhr.open("PUT", `http://localhost:5000/api/v1/movimiento/${id}`, true)  //Ahora lanzo la peticion con el xhr.open, igual que he hecho antes, pero aqui incluido, para que se haga este envio en caso de que queramos modificar, ya que ya no quiero que vaya a la fucnion muestraMovimientos, como hace el otro xhr.open que tengo mas arriba. Se incluye el id, que se ha guardado en la memoria en la linea anterior
        xhr.onload = recibeRespuesta //Este onload, que es el punto de recuperacion de los datos, es para esta petición de PUT. Se va a la función recibeRespuesta, que es la que va a mostrar la modificación en la tabla de movimientos al ejecutarse 
        
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8") //Esto lo que está diciendo es: voy a mter en la  cabecera un json, para que en el archivo views del servidor sepa lo que esperar. En la cabecera viaja el tipo de informacion que va en el body, que en este caso es un json
        
        xhr.send(JSON.stringify(movimiento))   //El metodo stringify lo que hace en este caso es coger un objeto de javascript y convertirlo en un texto que viaja al servidor, es el contrario a json.pars
}

function llamaApiBorraMovimientos(ev) { //Esta funcion la creo para poder borrar los movimientos que seleccione que se muestran en la tabla de movimientos del navegador, despues de haber llamado a la API que muestra lo que hay en la base de datos, lo hago con el boton borrar
    ev.preventDefault()   // Con el ev.preventDefault, lo que se consigue es que por defecto, no se relance la pagina, se para ese evento
    id = document.querySelector("#idmovimiento").value //Con esto lo que hago es guardar en la memoria del navegador el valor del id que sale al seleccionar un movimiento de la tabla de movimientos, lo guardo en la variable id
    //En este caso de borrar, no hay que hacer todo lo que se hace en la funcion de modificar, porque solo n ecesitamos saber el id del movimiento para borrarlo, nos da igual los datos que contenga, por eso utilizo la linea de arriba, para capturar el id en la memoria del navegador

    if(!id) { //Si el id no esta informado, es decir si no se ha seleccionado movimiento para borrar
        alert("Selecciona un movimiento para borrar") //Salta este mensaje de error
        return
    
    }    
    xhr.open("DELETE", `http://localhost:5000/api/v1/movimiento/${id}`, true)  //Ahora lanzo la peticion DELETE,para borrar el movimiento, con el xhr.open, igual que he hecho antes, pero aqui incluido, para que se haga este envio en caso de que queramos borrar, ya que ya no quiero que vaya a la fucnion muestraMovimientos, como hace el otro xhr.open que tengo mas arriba. Se incluye el id, que se ha guardado en la memoria en la linea anterior para identificar de que movimiento se trata y borrarlo en la base de datos
    xhr.onload = recibeRespuesta //Este onload, que es el punto de recuperacion de los datos, es para esta petición de DELETE. Se va a la función recibeRespuesta, que es la que va a mostrar el mensaje de borrado en la tabla de movimientos al ejecutarse 
    xhr.send() //Hago la llamada al servidor para que borre el movimiento en la base de datos

}

function llamaApiCreaMovimientos(ev) {//Esta funcion la creo para poder crear nuevos movimientos que intorduzca a traves del formualrio de detalle de movimiento, para que se graben en la base de datos y se muestren en la tabla de movimientos del navegador, despues de haber llamado a la API que muestra lo que hay en la base de datos, lo hago con el boton crear
    ev.preventDefault()   // Con el ev.preventDefault, lo que se consigue es que por defecto, no se relance la pagina, se para ese evento
    //En esta funcion no ponemos nada sobre guardar el id, porque cuando se crea el movimiento aun no tiene, quien se lo va a asignar es la base de datos, cuando la peticion viaje al servidor
    
    const movimiento = capturaFormMovimiento() //En esta variable movimiento guardo el objeto que devuelve la funcion capturaFormMovimiento, que son los nuevos datos que he introducido en el formulario para crera un nuevo registro
    if (!validar(movimiento)) // Si no se ha validado el movimiento
            return //Salte de la funcion 
         
    xhr.open("POST", `http://localhost:5000/api/v1/movimiento`, true)  //Ahora lanzo la peticion con el xhr.open, sin id 
    xhr.onload = recibeRespuesta //Este onload, que es el punto de recuperacion de los datos, es para esta petición de PUT. Se va a la función recibeRespuesta, que es la que va a mostrar la modificación en la tabla de movimientos al ejecutarse 
        
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8") //Esto lo que está diciendo es: voy a mter en la  cabecera un json, para que en el archivo views del servidor sepa lo que esperar. En la cabecera viaja el tipo de informacion que va en el body, que en este caso es un json
        
    xhr.send(JSON.stringify(movimiento))   //El metodo stringify lo que hace en este caso es coger un objeto de javascript y convertirlo en un texto que viaja al servidor, es el contrario a json.pars
}

window.onload = function() { /*Lo que haya dentro de esta funcion se va a ejecutar cuando la pagina termina de cargarse, aunque el script que hay en el fichero spa.html que hace referencia al fichero spa.js, este al principio del documento, en el head, y en teoria se ejecutaria de lo primero. Se va a ejecutar cuando la pagina este cargada, cuando este renderizada, entonces empezara a ejecutar lo que este dentro de la funcion */
    llamaApiMovimientos() /*Cuando la ventana este cargada, entonces se llama a la funcionApiMovimientos*/
    
    document.querySelector("#modificar") //Una vez cargada del todo la pagina, ya si puedo utilizar el boton modificar
        .addEventListener("click", llamaApiModificaMovimientos) //Esta linea llama a la funcion llamaApiModificaMovimientos para que procese los cambios cuando se pulsa el boton modificar, segun lo que contiene esta funcion
    
    document.querySelector("#borrar")
        .addEventListener("click", llamaApiBorraMovimientos) //Esta linea llama a la funcion llamaApiBorraMovimientos para que procese los cambios cuando se pulsa el boton borrar, segun lo que contiene esta funcion

        document.querySelector("#crear")
        .addEventListener("click", llamaApiCreaMovimientos) //Esta linea llama a la funcion llamaApiCreaMovimientos para que procese los cambios cuando se pulsa el boton crear, segun lo que contiene esta funcion

}