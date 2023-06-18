const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const userRouter = require('./routes/userRouter');
const boardRouter = require('./routes/boardRouter');
// const https = require('https')
// const path = require('path')
// const fs = require('fs')



const app = express();

const maxAge = 1000 * 60 * 5;

const sessionObj = {
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
    res.render('index.html', { user });
  } else {
    res.render('index.html');
  }
});

app.use('/user', userRouter);
app.use('/board', boardRouter);

app.listen(3000)

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'certificate', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'certificate', 'cert.pem')),
   
//   }, app
// )

// sslServer.listen(3000, ()=> console.log('SSL SERVER'))

