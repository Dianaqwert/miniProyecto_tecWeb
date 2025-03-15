
//variables globales
var personaje;
var elegido=false;


document.addEventListener("DOMContentLoaded", acciones);

function acciones() {

    //obtenemos los datos
    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const img1 = document.getElementById("drag1a");
    const img2 = document.getElementById("drag1b");
    const dragSelection = document.getElementById("dragSeleccion");
    const botonListo=document.getElementById('botonListo');

    const back=document.getElementById('back');
    const next=document.getElementById('next');

    back.addEventListener("click", verificarPersonaje);
    next.addEventListener("click", verificarPersonaje);

    if (back && next) {
        back.addEventListener("click", verificarPersonaje);
        next.addEventListener("click", verificarPersonaje);
    } else {
        alert("Error: No se encontró el botón 'back' o 'next' en el DOM.");
    }

    // 1) eventos al objeto -> asignar eventos al elemento arrastrable (imagen)
    img1.addEventListener("dragstart", drag);
    img1.addEventListener("drag", dragging);
    img1.addEventListener("dragend", dragEnd);
    img2.addEventListener("dragstart", drag);
    img2.addEventListener("drag", dragging);
    img2.addEventListener("dragend", dragEnd);

    //2) eventos al contenedor -> asignar eventos al contenedor destino (div1)
    div1.addEventListener("dragover", allowDrop);
    div1.addEventListener("drop", drop);
    div1.addEventListener("dragenter", dragEnter);
    div1.addEventListener("dragleave", dragLeave);
 
     //3) eventos al contenedor de destino ->  (div2)
     div2.addEventListener("dragover", allowDrop);
     div2.addEventListener("drop", drop);
     div2.addEventListener("dragenter", dragEnter);
     div2.addEventListener("dragleave", dragLeave);

    //4) Asignar eventos al contenedor de destino (dragSeleccion)
    dragSelection.addEventListener("dragover", allowDrop);
    dragSelection.addEventListener("drop", drop);
    dragSelection.addEventListener("dragenter", dragEnter);
    dragSelection.addEventListener("dragleave", dragLeave);



    //__________________________________________4) ACCIONES DE LAS FUNCIONES __________________________________________

/*OJO :ev -  es el objeto del evento que ocurre al arrastrar o soltar un elemento.
ev.dataTransfer  - es una propiedad que almacena la información transferida durante la operación de arrastre.
getData("text") - es un método de dataTransfer que recupera los datos almacenados.

setData("text", ev.target.id) → Método que almacena datos para recuperarlos después con getData("text").
*/

    // Evento cuando se arrastra
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    // Permitir soltar elementos
    function allowDrop(ev) {
        ev.preventDefault();
    }

    // Cuando se suelta el elemento
    function drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text"); // Obtenemos el id del elemento arrastrado
        let draggedElement = document.getElementById(data);
        
        // Verificar si se soltó en dragSeleccion
        if (ev.target.id === "dragSeleccion") {
            elegido = true;
            personaje = data;
            console.log("Seleccionado: " + data);
        } else {
            // Si se suelta en otro contenedor, se puede marcar como no seleccionado
            elegido = false;
            personaje = null;
            console.log("No se seleccionó en dragSeleccion");
        }
        
        ev.target.appendChild(draggedElement);
        
        // (Opcional) asignar el evento al botón 'botonListo'
        botonListo.addEventListener("click", verificarPersonaje);
    }

    // Evento cuando el elemento arrastrado entra en el área de destino
    function dragEnter(ev) {
        ev.preventDefault();
    }

    // Evento cuando el elemento arrastrado sale del área de destino
    function dragLeave(ev) {
        ev.preventDefault();
    }

    // Evento cuando se está arrastrando
    function dragging(ev) {
        ev.preventDefault();
    }

    // Evento cuando se termina el arrastre
    function dragEnd(ev) {
        ev.preventDefault();
    }
}

function verificarPersonaje(){
    if(elegido && personaje!=null){
        localStorage.setItem('personaje', JSON.stringify(personaje)); // Almacena el objeto como cadena JSON
        console.log("Personaje guardado en localStorage:", personaje);
        alert('Personaje guardado en localStorage'+personaje);
        if (next) next.disabled = false;
        
    }else{
        console.log("no se ha seleccionado");
        alert('no se ha seleccionado');
        if (next) next.disabled = true;
    }
}


