const express = require('express'); //node js 프레임 워크
const nunjucks = require('nunjucks'); // html 과 db 를 분리하기 위한 템플릿 엔진
const session = require('express-session'); // express-session 모듈 로드, express-session 사용할 경우 request.session 생성
const MemoryStore = require('memorystore')(session); // memorystore 모듈 로드, 인자로 session 넘기기, express용 세션 저장소
const userRouter = require('./routes/userRouter');
const boardRouter = require('./routes/boardRouter');
// const https = require('https') // ssl
// const path = require('path')   // 관련
// const fs = require('fs')      // 모듈

const app = express();

const maxAge = 1000 * 60 * 5;

const sessionObj = {
  //session obj 정보 객체로 저장
  secret: 'kong',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: maxAge }),
  cookie: {
    maxAge,
  },
};

app.use(session(sessionObj));

app.set('view engine', 'html');
nunjucks.configure('views', { express: app });

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  const { user } = req.session;
  if (user !== undefined) {
    res.render('index.html', { user }); //req.session에 있는 유저값이 있으면 게시판 포함되어 있는 페이지 보여주기
  } else {
    res.render('index.html'); // 게시판 기능 없는 페이지 보여주기
  }
});

app.use('/user', userRouter);
app.use('/board', boardRouter);

app.listen(3000); //3000번 포트 실행

// const sslServer = https.createServer(     // server 객체 생성
//   {
//     key: fs.readFileSync(path.join(__dirname, 'certificate', 'key.pem')),   // key는 certificate 폴더에 있는 key.pem 파일 가져오기
//     cert: fs.readFileSync(path.join(__dirname, 'certificate', 'cert.pem')), // cert는 certificate 폴더에 있는 cert.pem 파일 가져오기

//   }, app
// )

// sslServer.listen(3000, () => console.log('SSL SERVER'))   // 3000번 포트 실행하고 콘솔에 SSL SERVER 출력
