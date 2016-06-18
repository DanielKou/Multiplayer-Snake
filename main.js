var socket = io();
var playerNum;

var startGame = function(){
	//CANVAS INFO
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
  var d_queue1;
  var d_queue2;

	var cw = 10;     //cell width
  var d1;
  var d2;
  var food;
  var score1;
  var score2;
	var pause;

	//PaAINT CANVAS
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);


	var snake_array1;
  var snake_array2;

  function init(){
    d1 = "right"; //default direction
    d2 = "left";
		var pause = false;
    create_snake1();
    create_snake2();
    food = {x:10, y:10};
    d_queue1 = [];
    d_queue2 = [];
    score1 = 0;
    score2 = 0;

    if (typeof game_loop != "undefined") clearInterval(game_loop);
      game_loop = setInterval(paint, 60);
  }
	init();

	function create_snake1()
	{
		var length = 5;
		snake_array1 = [];
		for(var i = length-1; i>=0; i--){
		  snake_array1.push({x:i, y:0});
		}
	}

  function create_snake2()
  {
    var length = 5;
    snake_array2 = [];
    for(var i = length-1; i>=0; i--){
      snake_array2.push({x:44-i, y:44});
    }
  }



	function paint()
	{
    ctx.fillStyle = "white";
	  ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //SNAKE MOVEMENT
    gamePlay(snake_array1, d1, 1, d_queue1.shift());
    gamePlay(snake_array2, d2, 2, d_queue2.shift());


		for(var i = 0; i < snake_array1.length; i++)
		{
			var c = snake_array1[i];
			paint_cell(c.x, c.y, "blue");
		}

    for(var i = 0; i < snake_array2.length; i++)
		{
      var c = snake_array2[i];
      paint_cell(c.x, c.y, "black");
    }

    paint_cell(food.x, food.y, "red");

    var score1_text = "Player 1 score: " + score1;
    var score2_text = "Player 2 score: " + score2;
    ctx.fillText(score1_text, 5, h-5);
    ctx.fillText(score2_text, 370, h-5);
	}


  function gamePlay(array, d, player, change_d)
	{
    var nx = array[0].x;
    var ny = array[0].y;

    if (change_d)
		{
      if (player == 1)
			{
        if (change_d == "37" && d != "right") d = d1 = "left";
        else if (change_d == "38" && d != "down") d = d1 = "up";
        else if (change_d == "39" && d != "left") d = d1 = "right";
        else if (change_d == "40" && d != "up")d = d1 = "down";
      }
      else
			{
				if (change_d == "37" && d != "right") d = d2 = "left";
        else if (change_d == "38" && d != "down") d = d2 = "up";
        else if (change_d == "39" && d != "left") d = d2 = "right";
        else if (change_d == "40" && d != "up")d = d2 = "down";
      }
    }

    //SNAKE MOVEMENT
    if(d == "right") nx++;
    else if(d == "left") nx--;
    else if(d == "up") ny--;
    else if(d == "down") ny++;

    //GAME OVER CHECK
    if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny))
		{
			socket.emit('game over');
			init(); //restart
      return;
    }

    //IF FOOD IS EATEN
    if(nx == food.x && ny == food.y)
		{
      var tail = {x: nx, y:ny};

      if (player == 1) score1++;
      else score2++;

			if (player == playerNum){
				food = {
	        x: Math.round(Math.random()*(45)),
	        y: Math.round(Math.random()*(45))
	      };
				socket.emit('create food', food);

			}

      //CREATE NEW FOOD
    }
    else
		{
      var tail = array.pop();
      tail.x = nx;
      tail.y = ny;
    }

    array.unshift(tail);
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

    for (var i=0; i<length1; i++)
		{
      if (snake_array1[i].x == x && snake_array1[i].y == y)
        return true;
    }

    for (var i=0; i<length2; i++)
		{
      if (snake_array2[i].x == x && snake_array2.y == y)
        return true;
    }

    return false;
  }

	//SNAKE MOVEMENT LISTENER
	$(document).keydown(function(e){
		 var key = e.which;

		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
		{
			e.preventDefault();
		}

		if (key >= "37" && key<= "40")
		{
			if (playerNum == 1)
				d_queue1.push(key);
			else
					d_queue2.push(key);

			socket.emit('movement', {
				player: playerNum,
				move: key
			});
		}

		return true;
		// else if (key == "32"){
		// 	socket.emit('pause');
		// }
	})

	socket.on('movement', function(moveData){
		if (moveData.player == 1){
			d_queue1.push(moveData.move);
		}
		else{
			d_queue2.push(moveData.move);
		}
	});

	socket.on('new game', function(){
		init();
	});

	socket.on('create food', function(coordinates){
		food = coordinates;
	});
}


socket.on('success', function(player){
	$(".room.page").hide();
	$(".game.page").show();
	playerNum = player;
	var playerTxt = $(".player");
	if (playerNum == 1)
		playerTxt.css('color', 'blue');
	else
		playerTxt.css('color', 'black');
	playerTxt.append(playerNum);
	startGame();
})
socket.on('fail', function(error){
	$(".error").text(error);
	$(".error").show();
})


//BUTTON CLICK LISTENERS
$("#join").click(function(){
	var roomID = $(".usernameInput").val();
	socket.emit('join', roomID);
});

$("#create").click(function(){

	var roomID = $(".usernameInput").val();
	socket.emit('create', roomID);
});

$(document).ready(function(){
	$('.usernameInput').focus();
});
