var fs = require('fs'), 
	http = require('http') , 
	socketio = require('socket.io'),
	stat = require('node-static'),
	cookie = require('cookie'),
	//session = require('cookie-session'),
	util = require('util'),
	port=8000;

var flag = false;

var file = new stat.Server('.');

var server = http.createServer(function(req, res){
	
	req.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(req, res);
    }).resume();
	//res.writeHead(200, {'Content-type':'text/html'});
	//res.end(fs.readFileSync('./index.html'));
}).listen(port,function(){
	console.log('Listening at : http://127.0.0.1:' + port);
});

var sio = socketio.listen(server);
var sessionData;

//console(socket.request.headers.cookie);
sio.on('connection',function(socket){
	console.log('connection');
	sessionData = cookie.parse(socket.request.headers.cookie);
	console.log(sessionData);
	socket.on('start', function(msg){
		console.log('Start Received :',msg);
		if(!flag){
			flag = true;
			socket.emit('start', 'qagan');
		}else{
			socket.emit('start', 'har');
		}
	});
	socket.on('message',function(msg){
		console.log('Message Received :',msg);
		console.log(sessionData);
		//sio.sockets.emit('message',msg);
		socket.broadcast.emit('message', msg);
	});
});