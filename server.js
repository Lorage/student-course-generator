var path = require('path');
var express = require('express');
var compression = require('compression');

var app = express();

app.listen(8080);

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

console.log("App running on port: 8080");

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;