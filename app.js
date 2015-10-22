var fs = require('fs'), 
	http = require('http') , 
	socketio = require('socket.io'),
	stat = require('node-static'),
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

//console(socket.request.headers.cookie);
sio.on('connection',function(socket){
	console.log('connection');
	socket.on('start', function(msg){
		console.log('Start Received :',msg);
		if(!flag){
			flag = true;
			socket.emit('start', 'qagan');
		}else{
			socket.emit('start', 'har');
		}
	});
	socket.on('sendM',function(msg){
		console.log('Message Received :',msg);
		//sio.sockets.emit('message',msg);
		socket.broadcast.emit('sendM', msg);
	});
	socket.on('message',function(msg){
		console.log('Message Received :',msg);
		//sio.sockets.emit('message',msg);
		socket.broadcast.emit('message', msg);
	});
});