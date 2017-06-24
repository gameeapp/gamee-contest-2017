var express = require('express')
var app = express()

app.use('/', express.static(__dirname + '/www'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/dist', express.static(__dirname + '/dist'));

app.listen(3000, function () {
    console.log('Examples listening on port 3000!')
});