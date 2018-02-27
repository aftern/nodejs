var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

//mysql 기본문
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'o2'
});
conn.connect();

var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage: _storage});
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
/*
Express가 템플리트를 렌더링하려면 다음과 같은 애플리케이션 설정이 필요합니다.
views, 템플리트가 있는 디렉토리. 예: app.set('views', './views')
view engine, 사용할 템플리트 엔진. 예: app.set('view engine', 'pug')
*/
app.set('views', './views_mysql');
app.set('view engine', 'pug');
app.listen(3333, function(){
    console.log('conneted, 3333 port!');
});

app.get('/upload', function(req, res){
	res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file);
    res.send('uploaded : '+ req.file.filename);
})

app.get('/topic/add', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {topics:topics});
    });
});
app.post('/topic/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
        //    console.log(result.insertId);
        //    console.log(res.location());
            res.redirect('/topic/'+result.insertId);
        }
    })
});

app.get(['/topic', '/topic/:id'], function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
     //   res.send(topics);
        var id = req.params.id;
    //    console.log(id);
        if(id){
            var sql = 'SELECT * FROM topic WHERE id=?';
            conn.query(sql, [id], function(err, topic, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }else{
                //    console.log(id);
                //    console.log(topic);
                    res.render('view', {topics:topics, topic:topic[0]});
                }
            })
        }else{
            res.render('view', {topics:topics});
        }
    });
});
app.get('/topic/:id/edit', function(req, res){
    var sql = 'SELECT * FROM topic';
//    console.log(sql);
    conn.query(sql, function(err, topics, fields){
        var id = req.params.id;
        if(id){
            var sql = 'SELECT * FROM topic WHERE id=?';
            conn.query(sql, [id], function(err, topic, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }else{
                    res.render('edit', {topics:topics, topic:topic[0]});
                }
            })
        }else{
            console.log('There is no id.');
            res.status(500).send('Internal Server Error');
        }
    })
})
app.post('/topic/:id/edit', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    conn.query(sql, [title, description, author, id], function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
            res.redirect('/topic/'+id);
        }
    })
});
app.get('/topic/:id/delete', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
        var id = req.params.id;
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }else{
                if(topic.length === 0){
                    console.log('There is no record');
                    res.status(500).send('Internal Server Error');
                } else{
                    res.render('delete', {topics:topics, topic:topic[0]});
                }
            }
        })
    })
})
app.post('/topic/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
            res.redirect('/topic/');
        }
    })
});

app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
       res.redirect('topic/'+title);
    })
});