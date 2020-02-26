const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//canvas.width = 200;
//canvas.height = 300;

//wysokość i szerokość canvas
const cw = canvas.width;
const ch = canvas.height;

//linia na środku boiska 
const lineWidth =10;
const lineHeight = 2;

//wielkość piłki
const ballSize = 6;
let ballX = cw / 2 - ballSize / 2;  //wielkość okna / 2 - wielkość piłki / 2
let ballY = ch / 2 - ballSize / 2;

//wielkość paletek
const paddleHeight = 6;
const paddleWidth = 30;

//pozycja paletek na osi X (porusza się na boki)
let playerX = 20;
let aiPlayerX = cw - paddleWidth - 20;

//pozycja paletek na osi y (stała wielkość)
const playerY = ch - 30;
const aiPlayerY = 30;

//szybkość piłki
let ballSpeedX = -1; 
let ballSpeedY = 1;

//punkty
let pointAi = 0;
let pointPlayer = 0;
document.getElementById('computerPoints').innerHTML = 'AI: ' + pointAi;
document.getElementById('playerPoints').innerHTML = 'You: ' + pointPlayer;

function table(){
    ctx.fillStyle = '#2E363E';
    ctx.fillRect(0, 0, cw, ch);

    //linia na środku boiska 
    for (let linePosition = 5; linePosition < cw; linePosition += 30) {
        ctx.fillStyle = "gray"
        ctx.fillRect(linePosition, ch / 2 - lineHeight / 2, lineWidth, lineHeight)
      }
}

function ball(){
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX,ballY,ballSize,ballSize);

    //Zmiana pozycji piłki po każdym wywołaniu funkcji 
    if (pointPlayer + pointAi % 2 == 0){
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }else{
        ballX -= ballSpeedX;
        ballY -= ballSpeedY;
    }
    //Rozpoznajemy uderzenie w którąś z krawędzie lewa prawa.
    if (ballX + ballSize >= cw || ballX <= 0) {
      ballSpeedX = -ballSpeedX;

      speedUp();
    }
}

//reset piłki po zdobysiu punktów
function resetBall(){
    ballX = cw / 2 - ballSize / 2;  
    ballY = ch / 2 - ballSize / 2;
    ballSpeedX = -1; 
    ballSpeedY = 1;  
}

    //wywoływana gdy nastąpi zderzenie ze ścianą lub rakietką
function speedUp() {
    
    if (ballSpeedX > 0 && ballSpeedX < 3.5) {
        ballSpeedX += .1;
  
    } else if (ballSpeedX < 0 && ballSpeedX > -3.5) {
        ballSpeedX -= .1;
    }

    if (ballSpeedY > 0 && ballSpeedY < 5) {
        ballSpeedY += .2;   //.2 by piłka latała bardziej po długości stołu po odbiciu
    } else if (ballSpeedY < 0 && ballSpeedY < -5) {
        ballSpeedY -= .2;
    }
}
function player(){
    ctx.fillStyle = '#CC6666';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
}

function playerInCanvas(){
    //gdy próbuje wyjachać rakietka po prawo poza canvas
    if (playerX >= cw - paddleWidth) {
        playerX = cw - paddleWidth
      }
     //gdy próbuje wyjachać rakietka po lewo poza canvas
    if (playerX <= 0) {
        playerX = 0;
      }
}
leftCanvas = canvas.offsetLeft; // odkąd jest liczony canvas
//pozycja gracza
window.addEventListener('mousemove', function(e) {
    //console.log("pozycja myszy: " + (e.clientX - leftCanvas));
    playerX = e.clientX - leftCanvas - paddleWidth / 2; //żeby była myszka na środku
    playerInCanvas()    
});   

//sterowanie klawiszami
//TODO poprawić mało dokładne sterowanie strzałkami paletką
window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: // Left
        playerX -= (paddleWidth - 1);
      break;
   
      case 39: // Right
        playerX += (paddleWidth - 1);
      break;

      case 32: // pause
        alert("Press Ok or Space to continue!");
      break;  

      case 27: // f5
        alert("");
      break;  
    }
    playerInCanvas()
  }, false);

    //tymczasowo komputer

    //aiPlayerX = playerX;



function aiPlayer(){
    ctx.fillStyle = '#8D8D8D';
    ctx.fillRect(aiPlayerX, aiPlayerY, paddleWidth, paddleHeight);
}

//TODO ustawić parametry by dało się wygrać
function aiPlayerPosition(){
    //środek piłki i paletki komputera
    const midPaddle = aiPlayerX + paddleWidth / 2;
    const midBall = ballX + ballSize / 2;
//te wartości mogą służyć do ustawienia poziomu trudności
    //odległość dalej paletki
    if(ballY >= 150){
        if(midPaddle - midBall > 50){
            aiPlayerX -= 20;
        }else if(midPaddle - midBall < -50){
            aiPlayerX += 20;
        }
    }
    //odległość blizej paletki
    if(ballY < 150){
        if(midPaddle - midBall > 20){
            aiPlayerX -= 10;            
        }else if(midPaddle - midBall > 10){
            aiPlayerX -=5;            
        }else if(midPaddle - midBall < -20){
            aiPlayerX += 10;            
        }else if(midPaddle - midBall < -10){
            aiPlayerX += 5;
        }
    } 
}

//zdobywanie punktów
function collisionWallPoints() {
    //gorna ściana
    if(ballY < 0){
        console.log("punkt dla gracza");
        resetBall() 
        document.getElementById('playerPoints').innerHTML = 'You: ' + ++pointPlayer;
    //dolna sciana           
    }else if(ballY + ballSize > ch){
        console.log("punkt dla komputera");
        resetBall()
        document.getElementById('computerPoints').innerHTML = 'AI: ' + ++pointAi;
    }
}

//odbicie paletkami
 function strike(){ //TODO dziwne slizganie piłki przy uderzeniu krawędzią
    //gracz
    if(ballX < playerX + paddleWidth && ballX + ballSize > playerX){
        if (ballY + ballSize > playerY && ballY < playerY){
        ballSpeedY = -ballSpeedY;
        speedUp()
        }
    }  
    //komputer
    if(ballX < aiPlayerX + paddleWidth && ballX + ballSize > aiPlayerX){
        if (ballY < aiPlayerY + paddleHeight && ballY > aiPlayerY){
        ballSpeedY = -ballSpeedY;
        speedUp()
        }
    } 
 }

function draw(){    //funkcja główna do wywołania gry
    table()
    ball() 
    player()  
    aiPlayer() 
    aiPlayerPosition()
    collisionWallPoints()
    strike()
    
}

setInterval(draw, 1000 / 60)
