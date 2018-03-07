var express = require('express')
var bodyParser = require('body-parser')
var app = express()
// requires my dependancies
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var mysql = require('mysql')


//store the contents of the db
var messages =[];
// connects to local host database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat_service'
});
// connect if error throw  back exception
connection.connect();
// orders data in descending 


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// tells how many users are connected 
io.on('connection', (socket) => {
    connection.query('SELECT * FROM messages', function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        messages = results;
        socket.emit('messages', messages);
      });

    
    console.log('a user connected');

    socket.on('post message', function(message){
        // Sql Statement to insert name + Username into the database table
        var sql = "INSERT INTO `messages` (`name`, `message`) VALUES ('"+ message.name+"', '"+message.message +"');";
        // throws exception error if there is an error
        connection.query(sql, function (error, results, fields){
            if(error) throw error;
        });
        // emits socket to prevent the need for a refresh
        io.emit('message', message);
    });
})
// tells what port number the service is operating on
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})