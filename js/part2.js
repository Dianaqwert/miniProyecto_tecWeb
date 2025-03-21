
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
    console.log(jugadorActivo.alias)
    return jugadorActivo;
}


export default class Part2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Part2' });
        this.jugador = null;
        this.cursors = null;
        this.vidas = 3;
        this.enemigo = null;
        this.puntaje = 0; // Inicializa el puntaje
        this.intentosSaltoEnemigo = 0; // Contador de intentos de salto del enemigo
        this.direccionEnemigo = 1; // 1 para derecha, -1 para izquierda
        this.suena = true;
        this.btnPausa = document.getElementById('btnPausa');
        this.jugadorActivo = obtenerJugadorActivo();
        this.tesoro=0;

    }

    preload() {
        this.load.audio('musicaFondo', '/assets/pop.mp3');
        this.load.image("bg", "/assets/nivel 2/background.png");
        this.load.spritesheet('jugador', 'assets/rosita2.png', {
            frameWidth: 33, // Ancho de cada frame
            frameHeight: 89 // Altura de cada frame
        });
        this.load.spritesheet('otra-skin', 'assets/rosita.png', {
            frameWidth: 33, // Ancho de cada frame
            frameHeight: 89 // Altura de cada frame
        });
        
        this.load.spritesheet('enemigo', 'assets/nivel 2/shrek2.png', {
            frameWidth: 33, // Ancho de cada frame
            frameHeight: 89 // Altura de cada frame
        });        this.load.image("bloques", "assets/nivel 2/bloques.png");
        this.load.tilemapTiledJSON('tilemap', 'assets/nivel 2/nivelRene.json');
        this.puntaje = 0; // Inicializa el puntaje

    }

    create() {
        btnPausa.addEventListener('click', () => {
            console.log("Pausa");
            this.scene.pause(); // Pausar la escena principal
            this.scene.launch('PauseScene'); // Lanzar la escena de pausa
        });

        
        this.musica = this.sound.add('musicaFondo');
        var fondo = this.add.image(0, 0, "bg").setOrigin(0, 0);
        fondo.setScale(0.85); // Escalar el fondo para que se ajuste al mundo
        // fondo.alpha = .15;
        this.physics.world.setBounds(0, 0, 8040, 3128); // Establecer límites del mundo del juego
    
        // Cargar el mapa y el tileset
        var map = this.make.tilemap({ key: "tilemap" });  // Cargar el mapa desde el archivo JSON
        var tileset = map.addTilesetImage("ClaseBase", "bloques"); // Cargar el tileset
    
        // Crear las capas

        var capa1 = map.createLayer("Capa de patrones 1", tileset); // Crear la primera capa
        var capa2 = map.createLayer("Capa de patrones 2", tileset); // Crear la segunda capa
        var capa3 = map.createLayer("Capa de patrones 3", tileset); // Crear la tercera capa
        var capa4 = map.createLayer("Capa de patrones 4", tileset); // Crear la tercera capa
        var capa5 = map.createLayer("capa diamantes", tileset); // Crear la tercera capa
    
        // Habilitar colisiones en todas las capas que tengan la propiedad "Colision: true"
        capa1.setCollisionByProperty({ Colision: true }, true);
        capa1.setCollisionByProperty({ Muerte : true});
        capa1.setCollisionByProperty({ Fin : true });
        capa2.setCollisionByProperty({ Colision: false });
        capa3.setCollisionByProperty({ Colision: false });
        capa4.setCollisionByProperty({ Colision: false });
        capa5.setCollisionByProperty({ Diamante: true });
        capa5.setCollisionByProperty({ Perla : true });

        
        
    
        // Crear jugador y agregar física
        if (this.jugadorActivo.skin == 1) {
            console.log("Skin 1");
            this.jugador = this.physics.add.sprite(200, 200, "jugador");
            this.crearAnimaciones('jugador'); // Crear animaciones para la skin 1
        } else {
            console.log("Skin 2");
            this.jugador = this.physics.add.sprite(200, 200, "otra-skin");
            this.crearAnimaciones('otra-skin'); // Crear animaciones para la skin 2
        }
        this.enemigo = this.physics.add.sprite(2048, 2931, "enemigo");

        this.enemigo.setCollideWorldBounds(true); // Evita que salga de los límites del juego
        this.enemigo.setVelocityX(100);
        this.enemigo.setGravityY(150); // Reducir la gravedad solo para el enemigo

        this.physics.add.collider(this.jugador, this.enemigo, () => {
            this.jugador.x = 200;
            this.jugador.y = 300;
            this.vidas--;
        });

        // this.jugador.setScale()
        this.jugador.setCollideWorldBounds(true); // Evita que salga de los límites del juego
        this.enemigo.setCollideWorldBounds(true); // Evita que salga de los límites del juego
        
        this.physics.add.collider(this.enemigo, capa1);
        this.physics.add.collider(this.enemigo, capa2);
        this.physics.add.collider(this.enemigo, capa3);
        this.physics.add.collider(this.enemigo, capa4);

        // Ajustar cámara para seguir al jugador y establecer límites
        this.cameras.main.setBounds(0, 0, 8040, 3128);
       this.cameras.main.startFollow(this.jugador);

       this.anims.create({
        key: 'enemigoDerecha',
        frames: this.anims.generateFrameNumbers('enemigo', { start: 0, end: 3 }), // Ajusta los frames
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'enemigoIzquierda',
        frames: this.anims.generateFrameNumbers('enemigo', { start: 4, end: 7 }), // Ajusta los frames
        frameRate: 10,
        repeat: -1
    });
    
    
        // Habilitar colisiones entre el jugador y todas las capas
        this.physics.add.collider(this.jugador, capa2);
        this.physics.add.collider(this.jugador, capa3);
        this.physics.add.collider(this.jugador, capa4);
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

            if (tile?.properties?.Perla) {
                this.puntaje += 50; // Suma 10 puntos por cada diamante
                capa5.removeTileAt(tile.x, tile.y); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y+1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x-1, tile.y-1); // Elimina el diamante del mapa
                capa5.removeTileAt(tile.x+1, tile.y-1); // Elimina el diamante del mapa
                this.musica.play({
                    loop: false,
                    volume:0.4
                });
                this.jugador.x = 3833;
                this.jugador.y = 1170;
                this.tesoro++;
            
            }

        });

        this.physics.add.collider(this.jugador, capa1, (jugador, tile) => {
            if (tile?.properties?.Muerte) {
                this.vidas--;
                this.jugador.x = 200;
                this.jugador.y= 300;

            }
            if(tile?.properties?.Fin){
                document.getElementById("gameCanvas").style.display = "none";
                this.scene.pause(); // Pausar la escena principal

                 // Mostrar el nuevo canvas
                 const canvas = document.getElementById("imagenCanvas");
                 canvas.style.display = "block";
                 const ctx = canvas.getContext("2d");
             
                 // Ajustar tamaño si no se define en CSS
                 canvas.width = 1500; // Ajusta según el tamaño que necesites
                 canvas.height = 800;
             
                 // Ocultar elementos HUD
                 
                 document.getElementById("nombre-container").style.display = "none";
                 document.getElementById("vidas-container").style.display = "none";
                 document.getElementById("btnPausa").style.display = "none";
             
                // Crear y cargar la imagen
                const imagen = new Image();
                imagen.src = "/assets/gano.png"; // Verifica que esta ruta es correcta
                console.log("Cargando imagen desde:", imagen.src);

                const nombre=this.jugadorActivo.alias;

                imagen.onload = function () {
                    console.log("Imagen cargada correctamente");
                    ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
                    // Configuración del texto
                    ctx.font = "100px 'Jersey 10', 'sans-serif'";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    // Dibujar el nombre del jugador en el centro
                    ctx.fillText(nombre, canvas.width / 2,80);

                };
             
                imagen.onerror = function () {
                    console.error("Error al cargar la imagen. Verifica la ruta:", imagen.src);
                };
                 this.guardarInfo();
            }

        });

    
        // Capturar teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla de espacio para saltar
    }

    crearAnimaciones(skin) {
        // Animaciones para la skin seleccionada
        this.anims.create({
            key: 'left-' + skin,
            frames: this.anims.generateFrameNumbers(skin, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn-' + skin,
            frames: [{ key: skin, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right-' + skin,
            frames: this.anims.generateFrameNumbers(skin, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        
        
    }    

    guardarInfo(){
        document.getElementById("puntaje-container").textContent = "Puntuaje final " + this.puntaje;
    
        const guardarJugador = {
            alias: this.jugadorActivo.alias,
            fecha: new Date().toLocaleDateString("es-ES").replace(/\//g, "-"),
            vidas: 3,
            nivelJuego: 2,
            puntuacionNivel1: this.jugadorActivo.puntuacionNivel1,
            puntuacionNivel2: this.puntaje,
            trofeos: this.jugadorActivo.trofeos + this.tesoro,
            skin: this.jugadorActivo.skin,
            intentos: this.jugadorActivo.intentos,
            activo: true
        };
    
        const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
    
        // Buscar al jugador activo
        const jugadorActivoIndex = jugadores.findIndex(jugador => jugador.activo === true);
    
        if (jugadorActivoIndex !== -1) {
            // Obtener el jugador existente
            let jugadorExistente = jugadores[jugadorActivoIndex];
    
            // Comparar y almacenar siempre la puntuación más alta
            guardarJugador.puntuacionNivel1 = Math.max(this.jugadorActivo.puntuacionNivel1);
            guardarJugador.puntuacionNivel2 = Math.max(jugadorExistente.puntuacionNivel2, this.puntaje);
    
            // Actualizar la información del jugador activo
            jugadores[jugadorActivoIndex] = { ...jugadorExistente, ...guardarJugador };
    
            // Guardar los cambios en el localStorage
            localStorage.setItem("jugadores", JSON.stringify(jugadores));
    
            console.log("Información del jugador activo actualizada correctamente:", jugadores[jugadorActivoIndex]);
        } else {
            console.log("No se encontró un jugador activo.");
        }
    }
    

    update() {

        this.moverEnemigo();
        // Reiniciar la velocidad en el eje X antes de asignarla
        if(this.jugador.body.velocity.y < 980 && this.jugador.body.velocity.y > 930){
            console.log("salvado");
        }else if( this.jugador.body.velocity.y > 1200){
            this.vidas--;
            this.jugador.body.velocity.y = 0;
            this.jugador.x = 200;
            this.jugador.y= 300;
        }
        this.jugador.setVelocityX(0);

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-350);
            this.jugador.anims.play('left-' + (this.jugadorActivo.skin == 1 ? 'jugador' : 'otra-skin'), true);
        } 
        else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(350);
            this.jugador.anims.play('right-' + (this.jugadorActivo.skin == 1 ? 'jugador' : 'otra-skin'), true);
        } 
        else {
            this.jugador.anims.play('turn-' + (this.jugadorActivo.skin == 1 ? 'jugador' : 'otra-skin'), true);
        }

        // Salto
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.jugador.body.blocked.down) {
            setTimeout(() => {
                this.jugador.setVelocityY(-450);
            }, 50);
        }
        this.actualizarHUD();
    }

    moverEnemigo() {
        // Mover al enemigo en el eje X
        this.enemigo.setVelocityX(100 * this.direccionEnemigo);

        // Si el enemigo choca con un obstáculo, intenta saltar
        if (this.enemigo.body.blocked.right || this.enemigo.body.blocked.left) {
            if (this.intentosSaltoEnemigo < 3) {
                setTimeout(() => {
                    this.enemigo.setVelocityY(-500); // Saltar en Y
                    this.enemigo.setVelocityX(this.direccionEnemigo * 400); 
                }, 70);
                // Moverse más en X durante el salto
                this.intentosSaltoEnemigo++;
            } else {
                // Si no puede saltar después de 3 intentos, cambiar de dirección
                this.direccionEnemigo *= -1; // Cambiar dirección
                this.intentosSaltoEnemigo = 0; // Reiniciar contador de intentos
            }
        }
    }

    actualizarHUD(){
        if(this.vidas == 0){
            document.getElementById("gameCanvas").style.display = "none";
            this.scene.pause(); // Pausar la escena principal

            const canvas = document.getElementById("imagenPerder");
            canvas.style.display = "block";
            const ctx = canvas.getContext("2d");
        
            // Ajustar el tamaño del canvas si es necesario
            canvas.width = 1500; // Ajusta según el tamaño que necesites
            canvas.height = 700;
        
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
            document.getElementById("Nombre").innerHTML = this.jugadorActivo.alias + "<br>Fecha: " + this.jugadorActivo.fecha;
        }
    }

    moverEnemigo() {
        // Mover al enemigo en el eje X
        this.enemigo.setVelocityX(100 * this.direccionEnemigo);
    
        // Reproducir la animación correcta según la dirección
        if (this.direccionEnemigo > 0) {
            this.enemigo.anims.play('enemigoDerecha', true); // Animación caminando a la derecha
        } else {
            this.enemigo.anims.play('enemigoIzquierda', true); // Animación caminando a la izquierda
        }
    
        // Si el enemigo choca con un obstáculo, intenta saltar
        if (this.enemigo.body.blocked.right || this.enemigo.body.blocked.left) {
            if (this.intentosSaltoEnemigo < 3) {
                setTimeout(() => {
                    this.enemigo.setVelocityY(-500); // Saltar en Y
                    this.enemigo.setVelocityX(this.direccionEnemigo * 400); 
                }, 70);
                this.intentosSaltoEnemigo++;
            } else {
                // Cambiar dirección después de 3 intentos fallidos
                this.direccionEnemigo *= -1;
                this.intentosSaltoEnemigo = 0;
            }
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