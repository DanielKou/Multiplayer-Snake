var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cw = 10;
var tempFood = 0;
var rooms = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
  console.log('Server listening to port:3000');
});

app.use(express.static(__dirname + '/'));

io.on('connection', function(socket){
  socket.on('join', function(roomID){
    if (roomID in rooms){
      if (rooms[roomID] < 2)
      {
        rooms[roomID]++;
        this.join(roomID);
        this.roomID = roomID;
        this.emit('success', 2);
      }
      else
      {
        this.emit('fail', "Sorry, that room is full");
      }
    }
    else
      this.emit('fail', "Sorry, that room doesn't exist");

  });

  socket.on('create', function(roomID){
    if (roomID in rooms){
      this.emit('fail', "Sorry, that room already exists");
    }
    else {
      rooms[roomID] = 1;
      this.roomID = roomID;
      this.join(roomID);
      this.emit('success', 1);
    }

  });

  socket.on('movement', function(moveData){
    socket.broadcast.to(this.roomID).emit('movement', moveData);
  });

  socket.on('game over', function(){
    socket.broadcast.to(this.roomID).emit('new game');
    tempFood = 0;
  });

  socket.on('create food', function(food){
      socket.to(this.roomID).emit('create food', food);

  });

  socket.on('disconnect', function(){
    this.leave(this.roomID);
    rooms[this.roomID]--;

    if (rooms[this.roomID] == 0){
      delete rooms[this.roomID];
    }
  });
});
