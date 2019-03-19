const express = require('express')
const app = express();
var server = app.listen(3000, () => console.log('Server running on port 3000'));
var io = require('socket.io').listen(server);
var client;

app.get('/', function(req, res) {
  res.send('Hello');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('user connected');
  client = socket;
  setTimeout(function() {
     socket.send('Connection acknowledgement from Server');
  }, 3000);

  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete client;
  });
});

app.get('/dat', function (req, res) {
  console.log("ssssssssssssss");
  var response="";
  if(req.query.intentName == 'SelectCrustIntent'){
    response = `Crust number ${req.query.query2} has been selected, Would you like to continue to Meats?`;
    client.emit('alexaMessage', {intent : req.query.intentName, message: req.query.query2});
  }  
  if(req.query.intentName == 'FlowIntent'){
    console.log(req.query.query2);
    if(req.query.query2 == 1){
      response = `Please select Meats using numbers next to them?`;
    }else if(req.query.query2 == 2){
      response = `Please select Veggies using numbers next to them?`;
    }else if(req.query.query2 == 3){
      response = `Please Review your order and confirm if you would like to Place the order?`;
    }else if(req.query.query2 == 4){
      response = `Thank You for your order, your Pizza is geeting ready!`;
    }
    client.emit('alexaMessage', {intent : req.query.intentName, message: req.query.query2});
  }  
  if(req.query.intentName == 'SelectMeatsIntent'){
    response = `Meats numbered ${req.query.query2} have been selected, Would you like to continue to Veggies?`;
    client.emit('alexaMessage', {intent : req.query.intentName, message: req.query.query2});
  }
  if(req.query.intentName == 'SelectVeggiesIntent'){
    response = `Veggies numbered ${req.query.query2} have been selected, Would you like to continue to Review your order?`;
    client.emit('alexaMessage', {intent : req.query.intentName, message: req.query.query2});
  }
  

  res.header('ciphers', 'DES-CBC3-SHA')
  .header('Access-Control-Allow-Methods','GET')
  .header('Access-Control-Allow-Origin', '*')
  .header('Cache-Control','no-cache, must-revalidate').status(200)
  .send('{ "speakTextWeb" : "'+response+'" }');
});