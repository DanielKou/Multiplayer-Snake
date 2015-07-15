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
 
 
 var snake_array;
  
    function init(){
      d = "right"; //default direction 
      create_snake();
      create_food();
      d_queue = [];
      score = 0;
      
      if (typeof game_loop != "undefined") clearInterval(game_loop);
      game_loop = setInterval(paint, 60); 
    }
 init();
 
 function create_snake()
 {
   var length = 5; 
   snake_array = []; 
   for(var i = length-1; i>=0; i--)
   {
     snake_array.push({x: i, y:0});
   }
 }
  
  
    function create_food(){
      food = {x: Math.round(Math.random()*(w-cw)/cw),
              y: Math.round(Math.random()*(h-cw)/cw)};
      
    }
  
 
 
 function paint()
 {
      ctx.fillStyle = "white";
     ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "black";
      ctx.strokeRect(0, 0, w, h);
      
      //SNAKE MOVEMENT
      var nx = snake_array[0].x;
      var ny = snake_array[0].y;

      var change_d = d_queue.shift();

      if (change_d){
        if (change_d == "37" && d != "right") d = "left";
        else if (change_d == "38" && d != "down") d = "up";
        else if (change_d == "39" && d != "left") d = "right";
        else if (change_d == "40" && d != "up") d = "down";
      }
      
      if(d == "right") nx++;
      else if(d == "left") nx--;
      else if(d == "up") ny--;
      else if(d == "down") ny++;
      
      
      //WALL COLLISIONS -> RESTART GAME
      if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)){
        init(); //restart
        return;
      }
      
      
      //EAT THE FOOD
      if(nx == food.x && ny == food.y){
        var tail = {x: nx, y:ny};
        score++;
        //CREATE NEW FOOD
        create_food();
      }
      else{
        var tail = snake_array.pop();
        tail.x = nx;
        tail.y = ny;
        
      }
      
      snake_array.unshift(tail);
      
      
   for(var i = 0; i < snake_array.length; i++){
     var c = snake_array[i];
     
     paint_cell(c.x, c.y, "black");
   }
      
    paint_cell(food.x, food.y, "red");
      
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
  function check_collision(x, y, array){
    for (var i=0; i<array.length; i++){
      if (array[i].x == x && array[i].y == y)
        return true;        
    }
    return false;
  }
  
  //SNAKE MOVEMENT LISTENER
  $(document).keydown(function(e){
     var key = e.which;
     //ADD MOVEMENT TO QUEUE
     if (key >= "37" && key<= "40") d_queue.push(key);
   })
}) 
