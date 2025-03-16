var elegido = false;
var personaje = null;

function jugar() {
    desactivarJugadores(); // Primero desactivamos todos los jugadores

    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || []; // Recargamos la lista actualizada

    const nombrePlayer = document.getElementById("nombrePlayer").value.trim();

    if (nombrePlayer.length < 4 || nombrePlayer.length > 8) {
        swal({ title: "Warning", text: "El nombre debe tener entre 4 y 8 caracteres", icon: "warning", button: "Ok" });
        return;
    }

    if (!/^[A-Za-z0-9\s]+$/.test(nombrePlayer)) {
        swal({ title: "Error", text: "El nombre solo puede contener letras y números", icon: "error", button: "Ok" });
        return;
    }

    let jugadorExistente = jugadores.find(jugador => jugador.alias === nombrePlayer);

    if (jugadorExistente) {
        jugadorExistente.fecha = new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
        jugadorExistente.intentos += 1;
        jugadorExistente.activo = true; // Reactivar jugador

        swal({
            title: `Bienvenido de nuevo ${jugadorExistente.alias}`,
            text: `Tu fecha ha sido actualizada. Intentos: ${jugadorExistente.intentos}`,
            icon: "info",
            button: "Ok",
        });
    } else {
        jugadorExistente = {
            alias: nombrePlayer,
            fecha: new Date().toLocaleDateString("es-ES").replace(/\//g, "-"),
            vidas: 3,
            nivelJuego: 1,
            puntuacionNivel1: 0,
            puntuacionNivel2: 0,
            trofeos: 0,
            gameOver: false,
            skin: 0,
            intentos: 1,
            activo: true
        };

        jugadores.push(jugadorExistente);
        swal({ title: "Jugador Registrado!", text: "¡Bienvenido!", icon: "success", button: "Ok" });
    }

    document.querySelector('.datos p').textContent = `Alias: ${jugadorExistente.alias}\nFecha: ${jugadorExistente.fecha}`;

    localStorage.setItem("jugadores", JSON.stringify(jugadores)); // Guardamos los cambios

    console.log("Lista actualizada de jugadores:", jugadores);
    acciones()
}

function desactivarJugadores() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

    if (!Array.isArray(jugadores)) {
        console.error("Error: 'jugadores' no es un array.");
        return;
    }

    let jugadoresActualizados = jugadores.map(jugador => ({
        ...jugador,
        activo: false // Aseguramos que todos los jugadores se desactiven
    }));

    localStorage.setItem("jugadores", JSON.stringify(jugadoresActualizados)); // Guardar correctamente

    console.log("Jugadores desactivados:", JSON.parse(localStorage.getItem("jugadores")));
}

// SELECCIÓN DE SKIN
function acciones() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
    let jugadorExistente = jugadores.find(jugador => jugador.activo === true);

    if (!jugadorExistente) {
        swal({ title: "Error", text: "¡Registra tu nombre antes de seleccionar un skin!", icon: "error", button: "Ok" });
        return;
    }

    const div1 = document.getElementById("div1");
    const div2 = document.getElementById("div2");
    const img1 = document.getElementById("drag1a");
    const img2 = document.getElementById("drag1b");
    const dragSelection = document.getElementById("dragSeleccion");

    const back = document.getElementById('back');
    const next = document.getElementById('next');

    // Asignamos eventos una sola vez
    back.onclick = verificarPersonaje;
    next.onclick = verificarPersonaje;

    img1.ondragstart = drag;
    img2.ondragstart = drag;

    div1.ondragover = allowDrop;
    div2.ondragover = allowDrop;
    dragSelection.ondragover = allowDrop;

    div1.ondrop = drop;
    div2.ondrop = drop;
    dragSelection.ondrop = drop;

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("text");
        let draggedElement = document.getElementById(data);

        if (ev.target.id === "dragSeleccion") {
            elegido = true;
            personaje = data;
            jugadorExistente.skin = data === "drag1a" ? 1 : 0;

            document.querySelector('.datos p').textContent =
                `Alias: ${jugadorExistente.alias}\nFecha: ${jugadorExistente.fecha}\nSkin: ${jugadorExistente.skin}`;

            // Guardamos los cambios en `localStorage`
            jugadores = jugadores.map(jugador => 
                jugador.alias === jugadorExistente.alias ? jugadorExistente : jugador
            );
            localStorage.setItem("jugadores", JSON.stringify(jugadores));
        } else {
            elegido = false;
            personaje = null;
        }

        ev.target.appendChild(draggedElement);
    }
}


function verificarPersonaje() {
    if (elegido && personaje !== null) {
        swal({ title: "Éxito", text: "Registro exitoso", icon: "success", button: "Ok" });
        window.location.href = 'inst_juego_N1.html';
    } else {
        swal({ title: "Error", text: "¡Regístrate y selecciona un personaje antes de continuar!", icon: "warning", button: "Ok" });
    }
}

// FUNCIONALIDADES DE LOS BOTONES
function regresarNormal() {
    history.back();
}

function verificarCampos() {
    const nombrePlayer = document.getElementById("nombrePlayer").value.trim();
    const dragSelection = document.getElementById("dragSeleccion");

    if (!nombrePlayer || dragSelection.children.length === 0) {
        swal({ title: "Error", text: "¡Regístrate y selecciona un jugador antes de continuar!", icon: "error", button: "Ok" });
    }
}
