var fs = require('fs'), 
	http = require('http') , 
	socketio = require('socket.io');
var session = ['',''];

var server = http.createServer(function(req, res){
	res.writeHead(200, {'Content-type':'text/html'});
	res.end(fs.readFileSync('./index.html'));
}).listen(8000,function(){
	console.log('Listening at : http://127.0.0.1:8000');
});

var sio = socketio.listen(server);

sio.on('connection',function(socket){
	socket.send("hhhhh");
	socket.on('message',function(msg){
		console.log('Message Received :',msg);
		//sio.sockets.emit('message',msg);
		socket.broadcast.emit('message', msg);
	});
});