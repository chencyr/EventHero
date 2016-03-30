var express     = require('express');
var path        = require("path");
var app         = express();

var router = express.Router();
var port = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, 'html')));
app.listen(port);
console.log('Service on port: ' + port);