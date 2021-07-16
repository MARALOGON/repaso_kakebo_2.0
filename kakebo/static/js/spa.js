const categorias = { //Creo el objeto categorias en forma de diccionario, si bien las claves no tienen que ir entre comillas, al contrario que en python. No es un diccionario, es un objeto.
    CU: 'Cultura',
    SU: 'Supervivencia',
    OV: 'Ocio-vicio',
    EX: 'Extra'

}

let losMovimientos  //Creo la variable losMvimientos vacia en el ambito global



function detallaMovimiento(id) {

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

function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) { //Aqui el objeto this se utiliza como equivalente a quien invoca la funcion, que en este caso es xhr.  
        const respuesta = JSON.parse(this.responseText) //JSON es un objeto de Javascript. El método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis. Con esto conseguimos un objeto parecido a un diccionario Python que vamos a poder manejar. 
        
        if (respuesta.status !== "success") {
            alert("Se ha producido un error en la traducción")
            return
        }

        losMovimientos = respuesta.movimientos //Guardo los movimientos en la variable los mOVIMIENTOS EN LA MEMORIA DE LA PAGINA, al asignarle el vaLor respuesta.movimientos. Ya puedo acceder a ellos desde el forntend desde el id.
        
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
            const tbody = document.querySelector(".tabla-movimientos tbody") //Creo la constante tbody, donde se guardan los datos que aparecen en la const dentro. Elijo el punto del DOM donde quiero meter estos datos, que es en el tbody del fichero spa.html. Se separa por un espacio porque es un selector de CSS combinador de descendientes
            tbody.appendChild(fila) //Se ubica dentro de cada fila que se crea, de cada <tr>
        
        }
    }
}

xhr = new XMLHttpRequest() //Creo el manejador de peticiones 
xhr.onload = muestraMovimientos //Cuando se produzca la carga de lo que devulve la petición, se va a ejecutar la funcion muestraMovimientos

function llamaApiMovimientos() { //Esta función abre la llamada a la api de movimientos y la envia
    xhr.open('GET', `http://localhost:5000/api/v1/movimientos`, true) /*Esta funcion lo que hace es crear la url */
    xhr.send()
}

window.onload = function() { /*Lo que haya dentro de esta funcion se va a ejecutar cuando la pagina termina de cargarse, aunque el script que hay en el fichero spa.html que hace referencia al fichero spa.js, este al principio del documento, en el head, y en teoria se ejecutaria de lo primero. Se va a ejecutar cuando la pagina este cargada, cuando este renderizada, entonces empezara a ejecutar lo que este dentro de la funcion */
    llamaApiMovimientos() /*Cuando la ventana este cargada, entonces se llama a la funcionApiMovimientos*/
    
   
}