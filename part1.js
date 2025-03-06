

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky');
}

function update ()
{
}

/*mostrar el juego , dimensiones y escena predeterminada 
//variable de tipo json

//variable de configuración 
//.AUTO = significa que utiliza a WebGL pero si el mismo navegador no lo permite  utilizara canvas
var config={
    type:Phaser.AUTO, //.CANVAS .WEBGL .AUTO -> ¿Que usar para mostrar el juego?
    width:800,
    height:600,
    scene:{
        preload:preload,
        crate:createImageBitmap,
        update:update
    }
};

//objeto Phaser.Game
var game = new Phaser.Game(config);


//funcion que se utiliza para cargar los recursos para el video juego
//DUDA ¿como es que vamos a utilizar nuestras propias imagenes? -> recursos 
function preload(){ //clave del recurso , src
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', //grupo de imagenes 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

//mostrar una imagen
function create ()
{
    this.add.image(400, 300, 'sky');
}


function update(){

}*/