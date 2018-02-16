var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/form', function(req, res){
	res.render('form');
});

app.get('/form_receiver', function(req, res){
	var title = req.query.title;
	var description = req.query.description;
	res.send(title+','+description);
})

app.post('/form_receiver', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	res.send(title+','+description);
})

app.get('/topic/:id', function(req, res){
	var topics = [
		'Javascript is...',
		'Nodejs is...',
		'Express is...'
	];
	var output = `
		<a href="/topic/0">JavaScript</a><br>
		<a href="/topic/1">Nodejs</a><br>
		<a href="/topic/2">Express</a><br><br>
		${topics[req.params.id]}
	`
	res.send(output);
});

app.get('/template', function(req, res){
	res.render('temp', {time:Date(), _title:'pug'});
});

app.get('/', function(req, res){
	res.send('Hello home page');
});

app.get('/dynamic', function(req, res){
	var lis = '';
	for(var i=0; i<5; i++){
		lis = lis + '<li>coding</li>';
	};
	var time = Date();
	var output = `<!doctype html>
	<html>
	<head>
	  <meta charset="utf-8">
	  <title></title>
	</head>
	<body>
	  Hello, static!
	  <ul>
		  ${lis}
	  </ul>
	  ${time};
	  </body>
	</html>`;
	res.send(output);
})

app.get('/chengha', function(req, res){
	res.send('Hello chengha, <img src="/chengha.jpg">');
});

app.get('/login', function(req, res){
	res.send('Login please');
});

app.listen(3000, function(){
	console.log('connected 3000 port!');
});
