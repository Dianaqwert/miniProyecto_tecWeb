import Part1 from './Part1.js'; 
import Part2 from './Part2.js';
import PauseScene from './PauseScene.js';

// Obtener el valor del atributo data-scene
const scriptTag = document.getElementById("scene");
const sceneName = scriptTag.getAttribute("data-scene");

const sizes = {
    width: 1500,
    height:800
};

// Crear el juego sin definir una escena inicial
const config = {
    type: Phaser.canvas,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene:[]
};

const game = new Phaser.Game(config);

// Registrar las escenas en Phaser
game.scene.add("Part1", Part1);
game.scene.add("Part2", Part2);
game.scene.add("PauseScene", PauseScene);

game.scene.start(`${sceneName}`);