// Configuración del juego
var config = {
    type: Phaser.AUTO,
    width: 1500, //ancho 
    height: 700, //altura
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//variables
var player;
var stars;
var platforms;
var cursors;
//puntuaciones
var scoreWin=1000;
var score=0;
var scorext;
var textLives;
var gameOver = false;
//premios
var prizes;
var prizeTimer;
var nextPrizeX = 500; // Valor inicial (ajusta según tu nivel)
var prizeOffset = 800; // Distancia entre la aparición de premios
//game over
var lives = 3;
var livesIcons = [];
var gameOver = false;

//regeneracion deplataformas:
var nextPlatformX = 800;


//objeto Phaser.Game
var game = new Phaser.Game(config);

// Posiciones iniciales de las plataformas
var platformPositions = [
    { x: 400, y: 520 },
    { x: 700, y: 400 },
    { x: 50, y: 250 },
    { x: 750, y:99}
];


//______________________________FUNCIONES__________________________________________________________________
//funcion que se utiliza para cargar los recursos para el video juego

function preload ()
{
    this.load.image('sky', 'assets/AA.png');
    this.load.image('ground', 'assets/fondo_3.jpg');
    this.load.image('star', 'assets/fresa.png');
    this.load.image('naranjas','assets/naranjas.png');
    this.load.spritesheet('bouns','assets/26bb.png',{ frameWidth: 32, frameHeight: 32 });
    //fotogramas del jugador
    this.load.spritesheet('dude', 'assets/rf1_resized.png', { frameWidth: 32, frameHeight: 80 });
}

function create ()
{
    
    var fondo=this.add.image(0, 0, 'sky').setOrigin(0, 0).setScrollFactor(1);
    fondo = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'sky')
    .setOrigin(0, 0)
    .setScrollFactor(0);

    //camaras y mundo que se mueve
    this.physics.world.setBounds(0, 0, 20000, 600); // mundo extenso
    this.cameras.main.setBounds(0, 0, 20000, 600);
    
    //valores de level , lives y score
    this.data.set('lives', lives);
    this.data.set('level', 1);  // Puedes cambiar este valor a medida que avances en el juego
    this.data.set('score', score);

    //se utiliza un sistema de fisicas arcade, esto se hace con el objetivo de que phaser sepa que el juego lo requiere.Es un nuevo grupo de elementos estaticos que se asignan a la variable plataforms
    platforms = this.physics.add.staticGroup();
   

    platforms.create(400, 668, 'ground').setScale(2).refreshBody();
    // Crear plataformas en posiciones predefinidas
    platformPositions.forEach(pos => {
        platforms.create(pos.x, pos.y, 'ground');
    });
    
    //agregamos el jugador que pertenece al grupo de fisica ya que este sera un objeto que se movera
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setScale(1.1);
    //rebote del jugador
    player.setBounce(0.2);
    //colisiona con los limites del juego
    player.setCollideWorldBounds(false);// Para que pueda salir de los límites y perder vidas
    // cuando aterrice después de saltar, rebotará ligeramente.

    //se crean las vidas
    for (let i = 0; i < lives; i++) {
        let heart = this.add.image(1320 + i * 40,40, 'star').setScale(2.5).setScrollFactor(0);
        livesIcons.push(heart);
    }

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
        key: 'naranjas',
        repeat: 11,
        //se usa para establecer la posición de los 12 elementos que forman el grupo.
        setXY: { x: 12, y: 0, stepX: 70 }
        //stepX:una manera realmente útil de separar los elementos de un grupo durante su creación.
    });

    //rcorre todos los elementos del grupo y le da a cada uno un valor de rebote de Y aleatorio entre 0,4 y 0,8.
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));//no rebote
        child.setVelocityY(0); // Detener el movimiento vertical
    });

    //PUNTUACION
    scoreText = this.add.text(20,20, 'score: 0\nLevel:1', { fontSize: '32px', fill: '#000',fontFamily: 'Yuji Mai'}).setScrollFactor(0);
    textLives=this.add.text(1200,20,"Vidas:3",{fontSize: '32px', fill: '#000',fontFamily: 'Yuji Mai'}).setScrollFactor(0);

    //permite que el personaje colisione con las plataformas hay que crear un objeto Collider. Este supervisa si dos objetos físicos (que pueden incluir grupos) colisionan o se superponen entre ellos.
    this.physics.add.collider(player, platforms);
    //para que las estrellas no se pierdan y colisonen con las plataformas
    this.physics.add.collider(stars, platforms);
    //comprobar si el personaje se superpone con alguna estrella,se ejecuta la función 'collectStar' pasándole los dos objetos implicados.
    this.physics.add.overlap(player, stars, collectStar, null, this);
    //premios

    prizes=this.physics.add.group();
    this.physics.add.collider(prizes,platforms);
    this.physics.add.overlap(player,prizes,collectPrize,null,this);
    //animacion 


    //camaras
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    cursors = this.input.keyboard.createCursorKeys();
    
}

//se ejeuca constantemente - controla la lógica del juego
function update ()
{   
    
    //verificar si la tecla izquierda está presionada.
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    //sprite del personaje se moverá solo cuando una tecla se mantenga pulsada y se detendrá inmediatamente cuando se suelte.
    //se verifica que se detecten las teclas y verifica si el personaje está tocando el suelo, ya que de lo contrario podría saltar mientras está en el aire.
    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
    }

    //score
    if(score>=scoreWin && gameOver===false){
        guardarDatosWin();
    }

    // Regenerar plataformas y estrellas al avanzar
    if (player.x > nextPlatformX-400) {// -400 para anticipar un poco la generación
        regeneratePlatforms();
        nextPlatformX += 800;
    }


    if (player.x > nextPrizeX) {
        spawnPrize();
        nextPrizeX += prizeOffset; // Actualiza el umbral para el siguiente premio
    }

    //si llega a tocar los limites
    if (gameOver){
        guardarDatosLoser();
        return;
    }

    // Verificar si el jugador cae fuera de los límites del mundo
    if (player.y >750) {
        perderVida();
    }
}

function regeneratePlatforms() {
    platformPositions.forEach(pos => {
        platforms.create(pos.x + nextPlatformX, pos.y, 'ground');
    });

    //estrellas:
    // Generar estrellas en la nueva sección 
    //enerar cinco estrellas en la nueva sección del juego.
    for (let i = 0; i <12; i++) { 
        let starX = Phaser.Math.Between(nextPlatformX, nextPlatformX + 800); // Dentro de la nueva sección
        let starY = Phaser.Math.Between(100, 400); // Altura aleatoria
        let star = stars.create(starX, starY, 'naranjas');
        star.setCollideWorldBounds(false);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score+'\nLevel:1');

    if (stars.countActive(true) === 0){
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
}

// Función para recoger premios
function collectPrize(player,prize) {
    prize.disableBody(true, true);
    score += 50; // Mayor puntaje que las estrellas
}

// Función para generar premios aleatorios
function spawnPrize() {
    var x = Phaser.Math.Between(nextPrizeX - 200, nextPrizeX + 200);
    var y = Phaser.Math.Between(50, 400);
    var prize = prizes.create(x, y, 'bouns').setScale(1.5);
    prize.setBounce(0.8);
    prize.setAngularVelocity(Phaser.Math.Between(-200, 200));
    prize.setCollideWorldBounds(false);
}



function perderVida() {
    textLives.setText('Vidas: ' +lives);
    if(gameOver===false){
        lives--;
        console.log("aaaaaa"+lives);

        if(lives>=0){
            livesIcons[lives].setVisible(false);
            textLives.setText('Vidas: ' +lives);
            console.log("AAA");
            player.setX(100); // Reiniciar posición
            player.setY(450);
            console.log(lives);

        }else if(lives<0){
            gameOver=true;
            console.log("cero");
        }
        
    }
    if(gameOver===true){
        alert('perdio');
        console.log(lives);
    }
}

function guardarDatosWin(){
    console.log(score);
    alert('gano!!!');
    gameOver=true;
    player.physics.pause();
    return 0;
}

function guardarDatosLoser(){
    console.log(score);
    alert('perdisto todo');
    gameOver=true;
    player.physics.pause();
    return 0;

}