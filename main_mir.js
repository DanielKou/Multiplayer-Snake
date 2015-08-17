$(document).ready(function(){
 //CANVAS INFO
 var canvas = $("#canvas")[0];
 var ctx = canvas.getContext("2d");
 var w = $("#canvas").width();
 var h = $("#canvas").height();
 var d_queue; //queue the snake movements in case 2 input is pressed in less than 60ms 

    var cw = 10; //cell width
    var d;
    var food;
    var score;
  
 //PaAINT CANVAS
 ctx.fillStyle = "white";
 ctx.fillRect(0, 0, w, h);
 ctx.strokeStyle = "black";
 ctx.strokeRect(0, 0, w, h);
 
 
 var snake_array1;
 var snake_array2;
  
    function init(){
      d1 = "right"; //default direction
      d2 = "left"
      create_snake1();
      create_snake2();
      create_food();
      d_queue = [];
      score = 0;

      if (typeof game_loop != "undefined") clearInterval(game_loop);
      game_loop = setInterval(paint, 60); 
    }
 init();
 
 function create_snake1(){
    var length = 5; 
    snake_array1 = []; 
    for(var i = length-1; i>=0; i--){
      snake_array1.push({x:i, y:0});
    }
  }
  
  function create_snake2(){
    var length = 5; 
    snake_array2 = []; 
    for(var i = length-1; i>=0; i--){
      snake_array2.push({x:44-i, y:44});
    }
  }
  
  
    function create_food(){

      food = {x: Math.round(Math.random()*(w-cw)/cw),
              y: Math.round(Math.random()*(h-cw)/cw),
              num: Math.floor((Math.random() * 100) % 2) + 1};
    }
  
 
    function gamePlay (array, d, player){
      var nx = array[0].x;
      var ny = array[0].y;

      if(d == "right") nx++;
      else if(d == "left") nx--;
      else if(d == "up") ny--;
      else if(d == "down") ny++;

      if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny)){
        init(); //restart
        return;
      }

      //EAT THE FOOD
      if(nx == food.x && ny == food.y){
        if (player == food.num){
          var tail = {x: nx, y:ny};
          score++;
          //CREATE NEW FOOD
          create_food();
        }
        else{
          init();
          return;
        }
      }
      else{
        var tail = array.pop();
        tail.x = nx;
        tail.y = ny;
      }

      array.unshift(tail);

    }

 
 function paint()
 {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "black";
      ctx.strokeRect(0, 0, w, h);
      
      //SNAKE MOVEMENT
      

      var change_d = d_queue.shift();

      if (change_d){
        if (change_d == "37" && d1 != "right"){
          d1 = "left";
          d2 = "right";
        }
        else if (change_d == "38" && d1 != "down"){
          d1 = "up";
          d2 = "down";
        }
        else if (change_d == "39" && d1 != "left"){
          d1 = "right";
          d2 = "left";
        }
        else if (change_d == "40" && d1 != "up"){
          d1 = "down";
          d2 = "up";
        } 
      }

      gamePlay(snake_array1, d1, 1);
      gamePlay(snake_array2, d2, 2);

      
   for(var i = 0; i < snake_array1.length; i++){
      var c = snake_array1[i];
      paint_cell(c.x, c.y, "blue");
    }

    for(var i = 0; i < snake_array2.length; i++){
      var c = snake_array2[i];
      paint_cell(c.x, c.y, "black");
    }
    
    if (food.num == 1) paint_cell(food.x, food.y, "blue");
    else paint_cell(food.x, food.y, "black");
    
      ctx.fillStyle = "red";
      var score_text = "Score: " + score;
      ctx.fillText(score_text, 5, h-5);
  }
    
  function paint_cell(x, y, colour){
    ctx.fillStyle = colour;
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*cw, y*cw, cw, cw);
  }

  //SNAKE BODY COLLISION
  function check_collision(x, y){
    var length1 = snake_array1.length;
    var length2 = snake_array2.length;

    for (var i=0; i<length1; i++){
      if (snake_array1[i].x == x && snake_array1[i].y == y) 
        return true;        
    }

    for (var i=0; i<length2; i++){
      if (snake_array2[i].x == x && snake_array2.y == y)
        return true;
    }
    
    return false;
  }
  
  //SNAKE MOVEMENT LISTENER
  $(document).keydown(function(e){
     var key = e.which;
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

     //ADD MOVEMENT TO QUEUE
      if (key >= "37" && key<= "40") d_queue.push(key);
   })
}) 
