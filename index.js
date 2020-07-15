const express = require('express')
const bodyParser = require('body-parser');
const cors = require('./cors');
const multer=require('multer')
const app=express()
const upload=multer()

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())
app.use(cors.corsWithOptions)
var publicDir = require('path').join(__dirname,'/uploads');
app.use(express.static(__dirname + "/"));
var http = require("http").Server(app);
var io = require("socket.io")(http);
http.listen(8080);
console.log("PORT is 8080");
var fs = require("fs");

// //*********************CACHE*************************//

var cache = {};
var put = function (key, value, expire) {
  var exp = expire * 1000 + Date.now();
  var record = { value: value, expire: exp };
  cache[key] = record;
};

var del = function (key) {
  delete cache[key];
};

//********************ROUTES**************************//

app.get("/", function (req, res) {
  res.sendfile("/index.html");
});

app.post("/upload",upload.single('file'), function (req, res) {
    console.log(req.file)
    console.log(req.body);
    console.log("_________________________________")
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        console.log("Cannot readFile");
        res.send(500, "file Cannot be found");
      } else {
        fs.writeFile(
          __dirname + "/uploads/" + req.file.originalName,
          data,
          function (err, result) {
            if (err) {
              console.log(err);
              res.send(500, "Error in upload");
            } else {
              put(req.file.originalName, 6);
              res.send("File Uploaded");
            }
          }
        );
      }
    });
});

var Sockets = [];
io.sockets.on("connection", function (socket) {
  Sockets.push(socket);
});


var Sockets=[];
io.sockets.on('connection',function (socket){
    Sockets.push(socket);
});
// //*********************LISTENER***********************//
var async = require('async');
function cacheListener(){
if(Object.keys(cache).length!=0){	
    async.each(Object.keys(cache),function(item,iterate){
    	if(cache[item].expire<Date.now())
    		del(item);
    	else
    		iterate();
    },function(err){console.log(err);});
    setTimeout(function(){
        for (var i = Sockets.length - 1; i >= 0; i--) {
            Sockets[i].send(cache);
        };
            cacheListener();
            //console.log('listener working');
        },1000);
}else{
    setTimeout(function(){
        for (var i = Sockets.length - 1; i >= 0; i--) {
            Sockets[i].send(cache);
        };
            cacheListener();
            //console.log('listener working');
        },1000);
}
}
cacheListener();