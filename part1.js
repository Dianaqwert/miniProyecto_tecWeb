
//objetos y variables globales
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: { //se mandaron a llamar a las funciones
        preload: preload,
        create: create,
        update: update
    }
};

//variables
var player;
var stars;
var bombs;
var platforms;
var cursors;
//puntuaciones
var score=0;
var scoreText;
var gameOver = false;

//objeto Phaser.Game
var game = new Phaser.Game(config);


//______________________________FUNCIONES__________________________________________________________________
//funcion que se utiliza para cargar los recursos para el video juego

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    //fotogramas del jugador
    this.load.spritesheet('dude', 'assets/rf1_resized.png', { frameWidth: 32, frameHeight: 80 });
}

//Se ejecuta al inicio del juego y coloca objetos en pantalla.
// OJO: cuidado con agregar varias imagenes , van en cascada como en CSS
function create ()
{
    //add.image : crea un nuevo elemento de juego de tipo imagen y los añade a la lista de objetos en escena , se vera siempre y cuando este dentro de la region que se definio en la configuración
    this.add.image(400, 300, 'sky');

    //se utiliza un sistema de fisicas arcade, esto se hace con el objetivo de que phaser sepa que el juego lo requiere.Es un nuevo grupo de elementos estaticos que se asignan a la variable plataforms
    platforms = this.physics.add.staticGroup();
   
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // posiciones en : x,y,'nombre de imagen que se utiliza-viene de la funcion de preload()'
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    //agregamos el jugador que pertenece al grupo de fisica ya que este sera un objeto que se movera
    player = this.physics.add.sprite(100, 450, 'dude');

    //rebote del jugador
    player.setBounce(0.2);
    //colisiona con los limites del juego
    player.setCollideWorldBounds(true);
    // cuando aterrice después de saltar, rebotará ligeramente.

    //En este código se están haciendo dos cosas: la creación de un Sprite con físicas y algunas animaciones.

    //corre hacia la izquierda
    this.anims.create({
        key: 'left',
        //se utilizan los fotogramas 0,1,2,3 
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        //se ejecuta a una velocidad de 10 fotogramas por segundo
        frameRate: 10,
        repeat: -1//indica que la animacion debe de empezar cuando termine
        // ciclo de ejecución estándar y se repetirá para correr en la dirección opuesta, usando la tecla 'derecha' y una final para 'girar'.
    });

    //queda viendo de forma estatica
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    //corre hacia la derecha 
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    //crea el objeto 'cursors' con cuatro propiedades: up, down, left, right (arriba, abajo, izquierda, derecha). -> se ejecuta update en un bucle
    cursors = this.input.keyboard.createCursorKeys();

    //caida de estrellas
    //creamos un grupo de física dinámica en lugar de uno estático. , es un objeto JSON
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        //se usa para establecer la posición de los 12 elementos que forman el grupo.
        setXY: { x: 12, y: 0, stepX: 70 }
        //stepX:una manera realmente útil de separar los elementos de un grupo durante su creación.
    });

    //ecorre todos los elementos del grupo y le da a cada uno un valor de rebote de Y aleatorio entre 0,4 y 0,8.
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });

    bombs = this.physics.add.group();

    //PUNTUACION
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //permite que el personaje colisione con las plataformas hay que crear un objeto Collider. Este supervisa si dos objetos físicos (que pueden incluir grupos) colisionan o se superponen entre ellos.
    this.physics.add.collider(player, platforms);
    //para que las estrellas no se pierdan y colisonen con las plataformas
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //comprobar si el personaje se superpone con alguna estrella,se ejecuta la función 'collectStar' pasándole los dos objetos implicados.
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    
}


//se ejeuca constantemente - controla la lógica del juego
function update ()
{   
    //verificar si la tecla izquierda está presionada.
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    //sprite del personaje se moverá solo cuando una tecla se mantenga pulsada y se detendrá inmediatamente cuando se suelte.

    //se verifica que se detecten las teclas y verifica si el personaje está tocando el suelo, ya que de lo contrario podría saltar mientras está en el aire.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}