


export default class Part1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Part1' });
        this.jugador = null;
        this.cursors = null;
        this.vidas = 3;
        this.enemigo = null;
        this.puntaje = 0; // Inicializa el puntaje
        this.intentosSaltoEnemigo = 0; // Contador de intentos de salto del enemigo
        this.direccionEnemigo = 1; // 1 para derecha, -1 para izquierda
        this.suena = true;
        this.btnPausa = document.getElementById('btnPausa');
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
        this.puntaje = 0; // Inicializa el puntaje

    }

    create() {
        btnPausa.addEventListener('click', () => {
            console.log("Pausa");
            this.scene.pause(); // Pausar la escena principal
            this.scene.launch('PauseScene'); // Lanzar la escena de pausa
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

        });

        this.physics.add.collider(this.jugador, capa1, (jugador, tile) => {
            if (tile?.properties?.Muerte) {
                this.vidas--;
                this.jugador.x = 200;
                this.jugador.y= 2225;

            }
            if(tile?.properties?.Fin){
                this.scene.restart(); // Reinicia la escena
            }

        });

    
        // Capturar teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla de espacio para saltar
    }

    update() {
        console.log(this.jugador.y);
        

        if( this.jugador.y > 5000){
            this.vidas--;
            this.jugador.setVelocityY(0);
            this.jugador.x = 200;
            this.jugador.y= 3200;
        }
        this.jugador.setVelocityX(0);

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-450);
            this.jugador.anims.play('left', true);
        } 
        else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(450);
            this.jugador.anims.play('right', true);
        } 
        else {
            this.jugador.anims.play('turn');
        }

        // Salto
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.jugador.body.blocked.down) {
            setTimeout(() => {
                this.jugador.setVelocityY(-450);
            }, 50);
        }
        this.actualizarHUD();
    }

    

    actualizarHUD(){
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



