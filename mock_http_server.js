var express = require('express');

var app = express();


app.get('/api/profile', function(req, res){
	res.send({data: {}});
});

app.use(express.static('public'));


app.get('*', function(req, res){
	res.sendStatus(500);
});

app.post('*', function(req, res){
	res.sendStatus(500);
});

app.listen(3000);