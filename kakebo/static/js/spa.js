const categorias = { //Creo el objeto categorias en forma de diccionario, si bien las claves no tienen que ir entre comillas, al contrario que en python. No es un diccionario, es un objeto.
    CU: 'Cultura',
    SU: 'Supervivencia',
    OV: 'Ocio-vicio',
    EX: 'Extra'

}



function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) { //Aqui el objeto this se utiliza como equivalente a quien invoca la funcion, que en este caso es xhr.  
        const respuesta = JSON.parse(this.responseText) //JSON es un objeto de Javascript. El método JSON.parse() analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis. Con esto conseguimos un objeto parecido a un diccionario Python que vamos a poder manejar. 
        
        if (respuesta.status !== "success") {
            alert("Se ha producido un error en la traducción")
            return
        }
        
        for (let i=0; i < respuesta.movimientos.length; i++) { //Recorro todas las respuestas obtenidas con la peticion, mientras la respuesta tenga movimientos que mostrar, es decir, mientras respuesta.movimientos.length
            const movimiento = respuesta.movimientos[i] //Se crea la variable movimiento para guardar cada uno de los movimientos que se muestran como consecuencia de la respuesta de la petición a los movimientos de la base de datos
            
            const fila = document.createElement("tr")
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