document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const input = document.getElementById("nicknameInput");
    const errorMsg = document.getElementById("errorMsg");

    let background = new Image();
    background.src = "/assets/fondoI.png";

    let currentScreen = "menu"; // Estado actual de la pantalla

    const buttons = {
        menu: [
            { x: 300, y: 600, width: 200, height: 50, text: "Jugar", action: "play" },
            { x: 530, y: 600, width: 200, height: 50, text: "Instrucciones", action: "instructions" },
            { x: 750, y: 600, width: 200, height: 50, text: "Records", action: "records" },
            { x: 980, y: 600, width: 200, height: 50, text: "Créditos", action: "credits" }
        ],
        instructions: [
            { x: 600, y: 500, width: 200, height: 50, text: "Volver", action: "menu" }
        ]
    };

    background.onload = function () {
        drawScene();
    };

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";

        if (currentScreen === "menu") {
            ctx.fillText("Menú Principal", canvas.width / 2, 100);
        } else if (currentScreen === "instructions") {
            ctx.fillText("Instrucciones", canvas.width / 2, 100);
            ctx.font = "20px Arial";
            ctx.fillText("Aquí van las instrucciones del juego.", canvas.width / 2, 200);
        }

        buttons[currentScreen].forEach(button => {
            ctx.fillStyle = "#000";
            ctx.fillRect(button.x, button.y, button.width, button.height);

            ctx.fillStyle = "#fff";
            ctx.font = "20px Arial";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
        });
    }

    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let button of buttons[currentScreen]) {
            if (
                mouseX >= button.x &&
                mouseX <= button.x + button.width &&
                mouseY >= button.y &&
                mouseY <= button.y + button.height
            ) {
                currentScreen = button.action;
                drawScene();
            }
        }
    });

    drawScene();
});
