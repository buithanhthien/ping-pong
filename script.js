var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickColumnCount = 5;
var brickRowCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetLeft = 30;
var brickOffsetTop = 30;
var bricks = [];
var score = 0;
var lives = 3;

for(var c = 0; c < brickColumnCount; ++c){
    bricks[c] = [];

    for(var r = 0; r < brickRowCount; ++r){
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function drawBricks(){
    for(var c = 0; c < brickColumnCount; ++c){
        for(var r = 0; r < brickRowCount; ++r){
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop; 
            
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            if(bricks[c][r].status == 1){
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
        rightPressed = false;
    else if(e.key == "Left" || e.key == "ArrowLeft")
        leftPressed = false;
}

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
        rightPressed = true;
    else if(e.key == "Left" || e.key == "ArrowLeft")
        leftPressed = true;

}

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;

    if(relativeX > 0 && relativeX < canvas.move);
        paddleX = relativeX - paddleWidth/2;
}

function drawScore(){
    ctx.font = "17px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives(){
    ctx.font = "17px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function collusionDetection(){
    for(var c = 0; c < brickColumnCount; ++c)
        for(var r = 0; r < brickRowCount; ++r){
            var b = bricks[c][r];

            if(b.status == 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;

                    if(score == brickColumnCount * brickRowCount){
                        alert("You Win! - Score: " + score);
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collusionDetection();

    if(rightPressed){
        paddleX += 7;

        if(paddleX + paddleWidth > canvas.width)
            paddleX = canvas.width - paddleWidth;
    }
    else if(leftPressed){
        paddleX -= 7;
        
        if(paddleX < 0)
            paddleX = 0;
    }

    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius)
        dx = -dx;
    if(y + dy < ballRadius)
        dy = -dy;
    else if(y + dy > canvas.height - ballRadius){
        if(x > paddleX && x < paddleX + paddleWidth)
            dy = -dy;
        else{
            if(!lives){
                alert("Game Over!");
                document.location.reload();
                clearInterval(interval);
            }else{
                lives--;
                x = canvas.width/2;
                y = canvas.height - 30;
                
                dx = 2;
                dy = -2;

                paddleX = (canvas.width - paddleWidth) /2;
            }
        }
    }

    x += dx;
    y += dy;
}

var interval = setInterval(draw, 10);