const scriptTag = document.getElementById("scene");
const sceneName = scriptTag.getAttribute("data-scene");


export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
        
    }

    create() {
        // Recuperar el nombre de la escena en pausa
        this.escena = sceneName;


        // Fondo semitransparente
        const background = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width * 0.8, 
            this.cameras.main.height * 0.8, 
            0x000000, 
            0.8 
        ).setOrigin(0.5);

        // Texto de pausa
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'Juego en Pausa',
            { fontSize: '48px', fill: '#fff' }
        ).setOrigin(0.5);

        // Botón para reanudar
        const resumeButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Reanudar',
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setInteractive();

        resumeButton.on('pointerdown', () => {
            if (this.escena) {
                this.scene.resume(this.escena); // Reanudar la escena original
            }
            this.scene.stop('PauseScene'); // Cerrar la escena de pausa
        });

        // Botón para reiniciar
        const restartButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Reiniciar',
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            if (this.escena) {
                this.scene.start(this.escena);
            }
            this.scene.stop('PauseScene');
        });

        // Botón para salir
        const quitButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Salir',
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setInteractive();

        quitButton.on('pointerdown', () => {
            this.scene.stop(this.escena);
            this.scene.stop('PauseScene');
            window.location.href = 'seleccion-nivel.html';
        });
    }
}
