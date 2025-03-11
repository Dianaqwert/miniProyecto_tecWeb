import './style.css'
import Phaser from 'phaser'

const sizes = {
    width: 1500,
    height: 800 
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        this.jugador = null;
        this.cursors = null;
    }

    preload() {
        this.load.image("bg", "/assets/background.png");
        this.load.spritesheet("jugador", "assets/jugador.png", { frameWidth: 48, frameHeight: 50 });
        this.load.image("bloques", "assets/bloques.png");
        this.load.tilemapTiledJSON('tilemap', 'assets/nivelRene.json');
    }

    create() {
        var fondo = this.add.image(0, 0, "bg").setOrigin(0.0);
        fondo.setScale(0.85); // Escalar el fondo para que se ajuste al mundo

        this.physics.world.setBounds(0, 0, 8040, 3128); // Establecer límites del mundo del juego
        
        var map = this.make.tilemap({key:"tilemap"});  // Cargar el mapa desde el archivo JSON

        var tileset = map.addTilesetImage("ClaseBase", "bloques"); // Cargar el tileset

        var fondo = map.createLayer("Capa de patrones 1", tileset); // Crear la capa de tiles
        fondo.setCollisionByProperty({ Colision:true })

        // Crear jugador y agregar física
        this.jugador = this.physics.add.sprite(500, 500, "jugador");
        this.jugador.setCollideWorldBounds(true); // Evita que salga de los límites del juego

        // Ajustar cámara para seguir al jugador y establecer límites
        this.cameras.main.setBounds(0, 0, 8040, 3128);
        this.cameras.main.startFollow(this.jugador);

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

        // Habilitar colisiones entre el jugador y el suelo
        this.physics.add.collider(this.jugador, fondo);

        // Capturar teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Reiniciar la velocidad en el eje X antes de asignarla
        this.jugador.setVelocityX(0);
    
        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-200);
            this.jugador.anims.play('left', true);
        } 
        else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(200);
            this.jugador.anims.play('right', true);
        } 
        else {
            this.jugador.anims.play('turn');
        }
    
        // Salto
        if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.jugador.body.touching.down) {
            this.jugador.setVelocityY(-400); // Ajusta la fuerza del salto según sea necesario
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
 
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 }, // Aumentar la gravedad para un efecto más realista
            debug: true // Habilitar debug para ver hitboxes
        }
    },
    scene: [GameScene]
}

const game = new Phaser.Game(config);