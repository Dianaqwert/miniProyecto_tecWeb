
const jugadores = JSON.parse(localStorage.getItem("jugadores")) || []; //localstorage
var elegido = false;
var personaje = null;
//PARTE DE LAS VALIDACIONES DEL NOMBRE Y REGISTROS 
// Verifica si hay jugadores en el localStorage, si no, inicializa como un array vacío
function jugar() {
    // Obtener el nombre ingresado y eliminar espacios extra
    const nombrePlayer = document.getElementById("nombrePlayer").value.trim();

    // Verificar si el nombre cumple con la longitud requerida
    if (nombrePlayer.length < 4 || nombrePlayer.length > 8) {
        swal({
            title: "Warning",
            text: "El nombre debe tener entre 4 y 8 caracteres",
            icon: "warning",
            button: "Ok",
        });
        return; // Salir de la función si el nombre no es válido
    }
    //validamos el nombre respecto a digitos y letras , no caracteres
    /*A-Z (mayúsculas).
    a-z (minúsculas).
    0-9 (dígitos).
    \s (espacios).*/
    if( !/^[A-Za-z0-9\s]+$/.test(nombrePlayer)){
        swal({
            title: "Error",
            text: "El nombre solo puede contener letras y números",
            icon: "error",
            button: "Ok",
        });
        return;
    }

    // Buscar si el jugador ya está registrado
    let jugadorExistente=null; //objeto
    
    for(let i=0;i<jugadores.length;i++){
        if(jugadores[i].alias===nombrePlayer){
            jugadorExistente=jugadores[i];
            break;
        }
    }

    if (jugadorExistente) { //si tiene elementos 
        // Si el jugador ya existe, actualizar su fecha e intentos
        var fechaAct=new Date();
        jugadorExistente.fecha=fechaAct.toLocaleDateString("es-ES").replace(/\//g,"-");
        jugadorExistente.intentos += 1;
        swal({
            title: `Bienvenido de nuevo ${jugadorExistente.alias}`,
            text: `Tu fecha ha sido actualizada. Intentos: ${jugadorExistente.intentos}`,
            icon: "info",
            button: "Ok",
        });

        // Inserta o actualiza el h3 vacío debajo del botón con el alias del jugador
        document.querySelector('.datos p').textContent = `Alias: ${jugadorExistente.alias}\nFecha: ${jugadorExistente.fecha}`;
        acciones(jugadorExistente);


    } else {
        // Si el jugador no existe, crear un nuevo registro
        const nuevoJugador = {
            alias: nombrePlayer,
            fecha: new Date().toLocaleDateString("es-ES").replace(/\//g, "-"),
            vidas: 3,
            nivelJuego: 1,
            puntuacionNivel: 0,
            puntuacionTotalintento: 0,
            puntuacionAnteriorIntento: 0,
            puntuacionObtenidaActual: 0,
            premiosN1: 0,
            gameOver: false,
            skin:0,
            intentos: 1
        };

        // Guardarlo en la lista de jugadores
        jugadores.push(nuevoJugador);
        swal({
            title: "Jugador Registrado!",
            text: "¡Bienvenido!",
            icon: "success",
            button: "Ok",
        });
        
        // Inserta o actualiza el h3 vacío con el alias del nuevo jugador
        document.querySelector('.datos p').textContent = `Alias: ${nuevoJugador.alias}\nFecha: ${nuevoJugador.fecha}`;
        acciones(nuevoJugador);
    }

    // Guardar la lista actualizada de jugadores en `localStorage`
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    console.log("Lista actualizada de jugadores:", jugadores);

}

//SELECCION DE SKIN
function acciones(jugadorExistente) {

    //obtenemos los datos
    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const img1 = document.getElementById("drag1a");
    const img2 = document.getElementById("drag1b");
    const dragSelection = document.getElementById("dragSeleccion");

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
        //advertencia de seleccion
        if(!jugadorExistente){
            swal({
                title: "Error",
                text: "¡Primero debes registrar tu nombre antes de seleccionar un skin!",
                icon: "error",
                button: "Ok",
            });
            return; 
        }

        // Verificar si se soltó en dragSeleccion
        if (ev.target.id === "dragSeleccion") {
            elegido = true;
            personaje = data;
            if(data==="drag1a"){
                jugadorExistente.skin=1;
                document.querySelector('.datos p').textContent = `Alias: ${jugadorExistente.alias} Fecha: ${jugadorExistente.fecha}\nSkin:${jugadorExistente.skin}`;
                
            }else if(data==="drag1b"){
                jugadorExistente.skin=2;
                document.querySelector('.datos p').textContent = `Alias: ${jugadorExistente.alias}\nFecha: ${jugadorExistente.fecha}\nSkin:${jugadorExistente.skin}`;
            }
            console.log("Seleccionado: " + data);
            // Guardar los cambios en localStorage
            localStorage.setItem("jugadores", JSON.stringify(jugadores));
        } else {
            // Si se suelta en otro contenedor, se puede marcar como no seleccionado
            elegido = false;
            personaje = null;
        }
        
        ev.target.appendChild(draggedElement);
        
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
        swal({
            title:"Exito",
            text: "Registro exitoso",
            icon: "success",
            button: "Ok",
        });
        window.location.href = 'instruccionesN1.html'; //otro index
    }else{
        swal({
            title:"Error",
            text: "No puedes pasar al siguiente paso sin antes registrarte y seleccionar tu personaje!!",
            icon: "warning",
            button: "Ok",
        });
    }
}


//FUNCIONALIDADES DE LOS BOTONES
function regresarNormal(){
    //history.back() para retroceder una página en el historial
    history.back();
}

function verificarCampos(){
    // Obtener el nombre ingresado y eliminar espacios extra
    const nombrePlayer = document.getElementById("nombrePlayer").value.trim();
    const dragSelection = document.getElementById("dragSeleccion");
    if(!nombrePlayer ||  dragSelection.children.length === 0){
        swal({
            title: "Error",
            text: "No puedes pasar al siguiente paso sin antes registrarte y sin seleccionar jugador !!",
            icon: "error",
            button: "Ok",
        });
    }
}
