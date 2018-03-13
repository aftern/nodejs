//express 템플릿 이용
var express = require('express');
var app = express();

//session 모듈 이용
var session = require('express-session');
//session 모듈에 의존하여 파일로 데이터 저장
var FileStore = require('session-file-store')(session);
//app이 session을 사용할 수 있도록 붙여줌
app.use(session({
    secret: '30303',  //session id 복호화 키값
    resave: false,  //접속때마나 session id 를 발급x
    saveUninitialized: true,    //session id를 session을 실제로 사용하기 전까지 발급x
    //session-file-store을 이용하기 위해 추가
    store: new FileStore()
//    cookie: { secure: true }
  }));

//post 방식을 처리해 주는 모듈
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//3003번 포트 잘 열리는지 로그 확인
app.listen(3003, function(){
    console.log('Connected 3003 port!!!');
})

app.get('/auth/login', function(req, res){
    //action: input의 data를 어디로 보낼 것인지
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post"> 
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
})
app.post('/auth/login', function(req, res){
    var user = {
        identification:'hongs',
        password:'1111',
        nickname:"Hongs"
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if(uname === user.identification && pwd === user.password){
        req.session.displayName = user.nickname;
        res.redirect('/welcome');
    } else{
        res.send('Who are u <br><a href="/auth/login">login</a>');
    }
});
app.get('/auth/logout', function(req, res){
    delete req.session.displayName;
    res.redirect('/welcome');
})
app.get('/welcome', function(req, res){
    if(req.session.displayName){
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `)
    } else{
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">login</a>
        `)
    }
})

app.get('/count', function(req, res){
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
})