var express = require('express');
var cors = require('cors');

var router = require('./paciente/routes/routes');

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use('/api', router); 


module.exports = app;