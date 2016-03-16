const http = require('http');
const path = require('path');
const express = require('express');


const app = express();


app.use(express.static(path.join(__dirname, 'build')));


app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/dashboard', function(request, response) {
  response.sendFile(path.join(__dirname, 'build', 'dashboard.html'));
});


app.get('/screen', function(request, response) {
  response.sendFile(path.join(__dirname, 'build', 'screen.html'));
});


http.createServer(app).listen(process.env.PORT || 8000);
