// selecting the canvas

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// creating components for game


// create ball

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "blue git"
}
// create net

const net = {
    x : canvas.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "darkRed"
}


// create user paddle

const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    score : 0,
    color : "white"
    
}

//  create com paddle

const com = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    score : 0,
    color : "white"
    
}


// create the rectangle

function drawRect(x, y, w, h,  color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}


// draw circle

function drawCircle(x, y, r,  color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}


// draw text

function drawText(text, x, y, color){
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}
// draw net
function drawNet(){
    for(let i=0; i<=canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}


// render the game

function render(){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");

    // draw the divider
    drawNet();

    // draw Score
    drawText(user.score, canvas.width/4, canvas.height/5, "Orange");  //user score
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "Orange"); //computer score

    // draw the user and com paddle

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw ball

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control the user panel

canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

// collision detection

function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;


    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}
// reset the ball

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// update 
function update(){
    // ball has a velocity

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI to control com paddle
    let computerLevel = 0.1;
    com.y += (ball.y -(com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
        // wall.Play();
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    if(collision(ball, player)){
        // where the ball hit the player

        let collidePoint = (ball.y - (player.y + player.height/2));
        // normilisation

        collidePoint = collidePoint/(player.height/2);
        // calculate the anglr in  radian

        let angleradian = collidePoint * (Math.PI/4);

        // Xchange direction when ball hit canvas
        let direction  = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;

        // change vel X & Y
        ball.velocityX = direction * ball.speed * Math.cos(angleradian);
        ball.velocityY = ball.speed * Math.sin(angleradian);

        // everytime the ball hit a paddle, we inc the speed
        ball.speed += 0.1;
    }

    // update the score
    if(ball.x - ball.radius < 0){
        com.score++;
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }
}

// game init

function game(){
    render();
    update();
}
//  loop

let framePerSecond = 50;
let loop = setInterval(game, 1000/framePerSecond);