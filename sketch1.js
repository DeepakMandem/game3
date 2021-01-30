var player1;
var player2;
var ball;
var goal1,goal2;
var p1Score,p2Score;
var car10,ballimg;
var ground,ground2;
var database;
var position;

function preload(){
    car1 = loadImage("car10.png");
    ballimg = loadImage("Ball.png")
    backroundimg = loadImage("backround.jpg");
    goalimg = loadImage("goal.png")
    // wall_hitSound = loadSound('wall_hit.mp3');
    // hitSound = loadSound('hit.mp3');
  }
  
function setup() {    
  createCanvas(displayWidth-20,displayHeight-30);

  database = firebase.database();

  
  
  goal1 = createSprite(50,displayHeight-220,50,50)
  goal1.addImage(goalimg)
  goal1.mirrorX(goal1.mirrorX() * (-1));
  goal1.scale=0.2
  
  goal2 = createSprite(displayWidth-50,displayHeight-220,50,50)
  goal2.addImage(goalimg)
  goal2.scale=0.2
  

  //create a user paddle sprite
  player1 = createSprite(displayWidth-100,displayHeight-120,10,70);
  player1.addImage(car1);
  player1.scale = 0.1;
  player1.setCollider("rectangle",0,0,1000,500)


  player1.debug = true;
      
  //create a computer paddle sprite
  player2 = createSprite(90,displayHeight-120,10,70);
  player2.addImage(car1);
  player2.scale = 0.1;
  player2.mirrorX(player2.mirrorX() * (-1));

  player2.setCollider("rectangle",0,0,1000,500);
  
  //create the pong balls
  ball = createSprite(displayWidth/2,displayHeight-140,12,12);
  ball.addImage(ballimg);
  ball.scale = 0.035;

  // var ballPosition = database.ref('ball/position');
  // ballPosition.on("value",readPosition,showError);

  ground = createSprite(displayWidth/2,displayHeight -120,displayWidth,10)
  ground.visible = false;

  ground2 = createSprite(displayWidth/2,displayHeight/2,displayWidth,10)
  ground2.visible = false;

  p2Score = 0;
  p1Score = 0;
  gameState = "serve";

}
  
function draw() {  
    
    background(backroundimg);

    player1.velocityX = 0;
    player1.velocityY = 0;

    player2.velocityX = 0;
    player2.velocityY = 0;
    
    edges = createEdgeSprites();

    
    
    //display Scores
    textSize(20)
    stroke("white")
    text(p2Score,displayWidth/2-50,20);
    text(p1Score, displayWidth/2+50,20);
    
    player1.collide(ground)
    player2.collide(ground)

    player1.bounce(player2)

    
    //ball.bounceOff(edges);
    

    //draw dotted lines
    for (var i = 0; i < displayHeight; i+=20) {
       line(displayWidth/2,i,displayWidth/2,i+10);
    }
  
    if (gameState === "serve") {
      text("Press Space to Serve",displayWidth/2-100,displayHeight/2-50);
    }
  
    if (gameState === "over" ) {
      text("Game Over!",displayWidth/2-100,displayHeight/2-100);
      text("Press 'R' to Restart",displayWidth/2-100,displayHeight/2-50);
    }
  
    if (keyDown("r")) {
      gameState = "serve";
      p2Score = 0;
      p1Score = 0;
    }
  
  
    //give velocity to the ball when the user presses play
    //assign random velocities later for fun
    if(gameState === "play"){
      if (player2.isTouching(ball) || player1.isTouching(ball)) {
        ball.velocityX = random(10,-10);
        ball.velocityY = random(-5,-10)
        
      }
    }

    if (keyDown("space") && gameState == "serve") {
      ball.velocityX = random(10,-10);
      ball.velocityY = random(-5,5)
      gameState = "play";
    }
  
    //make the    player1 move with the mouse
    if(keyDown("RIGHT_ARROW")){
      player1.velocityX = 5;
    }

    if(keyDown("LEFT_ARROW")){
      player1.velocityX = -5;
    }

    if(keyDown("UP_ARROW") && player1.y > displayHeight- 300){
      player1.velocityY = -40;
    }
    
    //Adding gravity to player1
    player1.velocityY = player1.velocityY + 10;

    if(keyDown("D")){
      player2.velocityX = 5;
    }

    if(keyDown("A")){
      player2.velocityX = -5;
    }

    if(keyDown("W") && player2.y > displayHeight- 300){
      player2.velocityY = -40;
    }
  
    //Adding gravity to player1
    player2.velocityY = player2.velocityY + 10;
  
    //make the ball bounce off the user paddle
    if(ball.isTouching(player1)){
      //hitSound.play();
      ball.x = ball.x - 5;
      ball.velocityX = -ball.velocityX;
    }
  
    //make the ball bounce off the computer paddle
    if(ball.isTouching(player2)){
      //hitSound.play();
      ball.x = ball.x + 5;
      ball.velocityX = -ball.velocityX;
    }
  
    //place the ball back in the centre if it crosses the screen
    if(ball.x > displayWidth || ball.x < 0){
      //scoreSound.play();
  
    if (ball.isTouching(goal2)) {
        p2Score++;
      }
      else if(ball.isTouching(goal1)) {
        p1Score++;
      }
  
      ball.x = displayWidth/2;
      ball.y = displayHeight-150;
      ball.velocityX = 0;
      ball.velocityY = 0;
      player1.x = displayWidth-100;
      player1.y = displayHeight-150;

      player2.x = 90;
      player2.y = displayHeight-150;

      gameState = "serve";
  
      if (p2Score=== 5 || p1Score === 5){
        gameState = "over";
      }
    }
  
    //make the ball bounce off the top and bottom walls
    if (ball.isTouching(ground2) || ball.isTouching(ground)) {
      ball.bounceOff(ground2);
      ball.bounceOff(ground);
     // wall_hitSound.play();
    }
  
    //add AI to the computer paddle so that it always hits the ball
    
    //updateposition(ball.x,ball.y)
    
    drawSprites();
  }

  
// function updateposition(x,y){
//   database.ref('ball/position').update({
//        x:position.x +x,
//        y:position.y +y
//   })
// }

// function readPosition(data){
// position = data.val()
// ball.x = position.x,
// ball.y = position.y

// }

// function showError(){
// console.log("error reading values from the database");


// }
  
  