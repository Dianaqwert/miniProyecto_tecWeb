const jugadores = JSON.parse(localStorage.getItem("jugadores")) || []; //localstorage



// Función para encontrar al jugador activo
function obtenerJugadorActivo() {
    // Obtener los jugadores del localStorage
    const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

    // Buscar al jugador con el campo "activo" en true
    const jugadorActivo = jugadores.find(jugador => jugador.activo === true);

    // Verificar si se encontró un jugador activo
    if (jugadorActivo) {
        console.log("Jugador activo encontrado:", jugadorActivo);
    } else {
        console.log("No hay jugadores activos.");
    }

    return jugadorActivo;
}

// Llamada a la función


export default class Part1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Part1' });
        this.jugador = null;
        this.cursors = null;
        this.vidas = 3;
        this.enemigo = null;
        this.puntaje = 0; // Inicializa el puntaje
        this.tesoro = 0;
        this.intentosSaltoEnemigo = 0; // Contador de intentos de salto del enemigo
        this.direccionEnemigo = 1; // 1 para derecha, -1 para izquierda
        this.suena = true;
        this.btnPausa = document.getElementById('btnPausa');
        this.btnFinal = document.getElementById('btnOcultarHUD');
        this.jugadorActivo = obtenerJugadorActivo();
    }

    preload() {
        this.load.image("background", "assets/nivel 1/background.png"); // Precargar la imagen
        this.load.audio('musicaFondo', '/assets/pop.mp3');
        this.load.spritesheet('jugador', 'assets/nivel 2/shrek2.png', {
            frameWidth: 33, // Ancho de cada frame
            frameHeight: 89 // Altura de cada frame
        });
        
        this.load.image("bloques", "assets/nivel 2/bloques.png");
        this.load.tilemapTiledJSON('tilemap', 'assets/nivel 1/mapa-1.json');

    }

    create() {
        this.btnPausa.addEventListener('click', () => {
            console.log("Pausa");
            this.scene.pause(); // Pausar la escena principal
            this.scene.launch('PauseScene'); // Lanzar la escena de pausa
        });
        this.btnFinal.addEventListener('click', () => {
            console.log("Pausa");
            window.location.href = 'nivel2.html';
        });
        this.musica = this.sound.add('musicaFondo');
        // fondo.alpha = .15;
        this.physics.world.setBounds(0, 0, 9000, 5200); // Establecer límites del mundo del juego
    
        // Cargar el mapa y el tileset
        var map = this.make.tilemap({ key: "tilemap" });  // Cargar el mapa desde el archivo JSON
        var tileset = map.addTilesetImage("ClaseBase", "bloques"); // Cargar el tileset
    
        // Crear las capas

 
        var capaImagen = this.add.image(0, 0, "background").setOrigin(0, 0);

        if (capaImagen) {
            this.add.image(capaImagen.x, capaImagen.y, "background")
                .setOrigin(0, 0) // Alinear con la posición de Tiled
                .setAlpha(capaImagen.opacity || 1) // Aplicar opacidad de Tiled
                .setDepth(-1); // Poner la imagen detrás de las capas de tiles
        }

        var capa1 = map.createLayer("Capa de patrones 1", tileset); // Crear la primera capa
        var capa2 = map.createLayer("inferior", tileset); // Crear la segunda capa
        var capa5 = map.createLayer("diamantes", tileset); // Crear la tercera capa
       
    
        // Habilitar colisiones en todas las capas que tengan la propiedad "Colision: true"
        capa1.setCollisionByProperty({ Colision: true }, true);
        capa1.setCollisionByProperty({ Muerte : true});
        capa1.setCollisionByProperty({ Fin : true });
        capa2.setCollisionByProperty({ Colision: false });
        capa5.setCollisionByProperty({ Diamante: true });
        capa5.setCollisionByProperty({ Perla : true });
        
       
    
        // Crear jugador y agregar física
        this.jugador = this.physics.add.sprite(200, 3331, "jugador");

        // this.jugador.setScale()
        this.jugador.setCollideWorldBounds(true); // Evita que salga de los límites del juego
        

        // Ajustar cámara para seguir al jugador y establecer límites
        this.cameras.main.setBounds(0, 0, 9000, 5000);
        this.cameras.main.startFollow(this.jugador);
        this.cameras.main.setZoom(0.8); // Reduce el zoom de la cámara
        
        // Crear animaciones del jugador
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'jugador', frame: 4 }],
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('jugador', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    
        // Habilitar colisiones entre el jugador y todas las capas
        this.physics.add.collider(this.jugador, capa2);
        this.physics.add.collider(this.jugador, capa5, (jugador, tile) => {
            if (tile?.properties?.Diamante) {
                this.puntaje += 10; // Suma 10 puntos por cada diamante
                capa5.removeTileAt(tile.x, tile.y); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y+1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x-1, tile.y-1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y-1); // Elimina el diamante del mapa
                this.musica.play({
                    loop: false,
                    volume:0.4
                });
                console.log("puntaje:", this.puntaje); // Muestra el puntaje en la consola
            
            }
            if (tile?.properties?.Diamante) {
                this.puntaje += 10; // Suma 10 puntos por cada diamante
                capa5.removeTileAt(tile.x, tile.y); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y+1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x-1, tile.y-1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y-1); // Elimina el diamante del mapa
                this.musica.play({
                    loop: false,
                    volume:0.4
                });
                console.log("puntaje:", this.puntaje); // Muestra el puntaje en la consola
            }
            if (tile?.properties?.Perla) {
                this.puntaje += 10; // Suma 10 puntos por cada diamante
                capa5.removeTileAt(tile.x, tile.y); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y+1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x-1, tile.y-1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y-1); // Elimina el diamante del mapa
                this.musica.play({
                    loop: false,
                    volume:0.4
                });
                this.jugador.x = 4429;
                this.jugador.y = 3215;
                this.tesoro++;
            }

        });

        this.physics.add.collider(this.jugador, capa1, (jugador, tile) => {
            if (tile?.properties?.Fin) {
                console.log("AQUIIII")
                 // Obtener el elemento canvas y su contexto 2D
                 document.getElementById("gameCanvas").style.display = "none";
                this.scene.pause(); // Pausar la escena principal

                 // Mostrar el nuevo canvas
                 const canvas = document.getElementById("imagenCanvas");
                 canvas.style.display = "block";
                 const ctx = canvas.getContext("2d");
             
                 // Ajustar tamaño si no se define en CSS
                 canvas.width = 800; // Ajusta según el tamaño que necesites
                 canvas.height = 600;
             
                 // Ocultar elementos HUD
                 document.getElementById("nombre-container").style.display = "none";
                 document.getElementById("vidas-container").style.display = "none";
                 document.getElementById("btnPausa").style.display = "none";
                 document.getElementById("btnOcultarHUD").style.display = "block"; // Se oculta el botón para evitar doble clic
             
                 // Crear y cargar la imagen
                 const imagen = new Image();
                 imagen.src = "/assets/passNivel.png"; // Verifica que esta ruta es correcta
                 console.log("Cargando imagen desde:", imagen.src);
             
                 imagen.onload = function () {
                     console.log("Imagen cargada correctamente");
                     ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
                 };
             
                 imagen.onerror = function () {
                     console.error("Error al cargar la imagen. Verifica la ruta:", imagen.src);
                 };
                 this.guardarInfo();
            }
            if (tile?.properties?.Muerte) {
                this.vidas--;
                this.jugador.x = 200;
                this.jugador.y= 2225;

            }
        });

    
        // Capturar teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla de espacio para saltar
    }

    update() {

        if( this.jugador.y > 5000){
            this.vidas--;
            this.jugador.setVelocityY(0);
            this.jugador.x = 200;
            this.jugador.y= 3200;
        }
        this.jugador.setVelocityX(0);

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-1500);
            this.jugador.anims.play('left', true);
        } 
        else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(1500);
            this.jugador.anims.play('right', true);
        } 
        else {
            this.jugador.anims.play('turn');
        }

        // Salto
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.jugador.body.blocked.down) {
            setTimeout(() => {
                this.jugador.setVelocityY(-1500);
            }, 50);
        }
        this.actualizarHUD();
    }

    

    actualizarHUD(){
        console.log(this.vidas);
        if(this.vidas == 0){
            document.getElementById("gameCanvas").style.display = "none";
            this.scene.pause(); // Pausar la escena principal

            const canvas = document.getElementById("imagenPerder");
            canvas.style.display = "block";
            const ctx = canvas.getContext("2d");
        
            // Ajustar el tamaño del canvas si es necesario
            canvas.width = 1500; // Ajusta según el tamaño que necesites
            canvas.height = 800;
        
            // Ocultar los elementos del HUD
            document.getElementById("puntaje-container").style.display = "none";
            document.getElementById("nombre-container").style.display = "none";
            document.getElementById("vidas-container").style.display = "none";
            document.getElementById("btnPausa").style.display = "none";
            // Cargar y dibujar la imagen
            const imagen = new Image();
            imagen.src = "/assets/gameover.png"; // Ruta de la imagen
            imagen.onload = function () {
                ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
            };
        }else{
            const vidasContainer = document.getElementById("vidas-container");
            let text = document.createElement("h1");
            text.textContent="Vidas";
            vidasContainer.innerHTML = ""; // Limpiar contenido anterior
            vidasContainer.appendChild(text);
            for (let i = 0; i < this.vidas; i++) {
                let corazon = document.createElement("img");
                corazon.src = "/assets/corazon.png";
                vidasContainer.appendChild(corazon);
            }
            // Actualizar puntaje
            document.getElementById("Puntaje").textContent = this.puntaje;
            document.getElementById("Nombre").textContent = this.jugadorActivo.alias;
        }
        
    }

    guardarInfo(){
        document.getElementById("puntaje-container").textContent ="Puntuaje final "+this.puntaje;

        const guardarJugador = {
            alias: this.jugadorActivo ,
            fecha: new Date().toLocaleDateString("es-ES").replace(/\//g, "-"),
            vidas: 3,
            nivelJuego: 2,
            puntuacionNivel1: this.jugadorActivo.puntuacionNivel1,
            puntuacionNivel2:this.puntaje,
            trofeos: this.jugadorActivo.trofeos +this.trofeos,
            skin: this.jugadorActivo.skin,
            intentos: this.jugadorActivo.intentos,
            activo: true
        };
        const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

    // Buscar al jugador activo
        const jugadorActivoIndex = jugadores.findIndex(jugador => jugador.activo === true);

        if (jugadorActivoIndex !== -1) {
            // Actualizar la información del jugador activo
            jugadores[jugadorActivoIndex] = { ...jugadores[jugadorActivoIndex], ...guardarJugador };

            // Guardar los cambios en el localStorage
            localStorage.setItem("jugadores", JSON.stringify(jugadores));

            console.log("Información del jugador activo actualizada correctamente:", jugadores[jugadorActivoIndex]);
        } else {
            console.log("No se encontró un jugador activo.");
        }
    }
}



const musica = document.getElementById('musica');
const imagenMusica = document.getElementById('btnMusica');
let estaSonando = false;
console.log(imagenMusica);

imagenMusica.addEventListener('click', () => {
    if (estaSonando) {
        musica.pause(); // Pausar la música
        estaSonando = false;
        console.log("Música pausada");
    } else {
        musica.play(); // Reproducir la música
        estaSonando = true;
        console.log("Música reproduciéndose");
    }
});



// Obtener el elemento canvas y su contexto 2D
