const express=require('express');
const http=require('http')
const bodyParser = require('body-parser');
const socketio=require('socket.io');

const app=express();

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: false }));


server.listen(3000)