
document.addEventListener("DOMContentLoaded", function (){
    const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Imagen de fondo
  let background = new Image();
  background.src = "/assets/Fondo_1.png";

  background.onload = function () {
    drawScene();
  };

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

  drawScene();
});

function grabarJugador(){
  //ingresamos el nombre de la persona - alias
  window.location.href = 'introducirJugador.html';
}

function creditos(){
  window.location.href = 'creditos.html';
}