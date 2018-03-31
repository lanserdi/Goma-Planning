const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const api = require('./api');

app.use('/static/', express.static(__dirname+'/dist/'));
app.use('/resource/', express.static(__dirname+'/resource/'));
app.use(express.static(__dirname+'/demo/'));
app.use('/api/', api);
app.listen(8000);