const express = require('express');
const router = express.Router(); //메소드 호출
const { list } = require('../model/board');
const { alertmove } = require('../util/alertmove.js');

router.use('/', (req, res, next) => {
  const { user } = req.session;
  if (user !== undefined) {
    next();
  } else {
    res.send(alertmove('/', '로그인 후 이용 가능합니다.'));
  }
});

router.get('/list', (req, res) => {
  const { user } = req.session;
  res.render('../views/board/list', {
    list,
    user,
  });
  console.log(req.session);
});

router.get('/write', (req, res) => {
  const { user } = req.session;
  res.render('../views/board/write', { user });
});

router.post('/write', (req, res) => {
  list.push(req.body);
  console.log(list);
  res.send(
    alertmove(`/board/view?index=${list.length}`, '글작성이 완료 되었습니다.')
  );
});

router.get('/view', (req, res) => {
  const { user } = req.session;
  const index = req.query.index;
  const view = list[index - 1];
  res.render('../views/board/view', {
    index,
    data: view,
    user,
  });
});

router.post('/delete', (req, res) => {
  const { user } = req.session;
  const index = req.body.index - 1;
  console.log(user.userid, 'user');
  console.log(list[index].userid, 'list');
  console.log(list);
  if (list[index].userid === user.userid) {
    list.splice(index, 1); //인덱스부터 시작해서 1개 제거
    res.send(alertmove('/board/list', '글 삭제가 완료되었습니다.'));
  } else {
    res.send(
      alertmove(
        `/board/view?index=${index + 1}`,
        '본인이 작성한 글만 삭제할 수 있습니다.'
      )
    );
  }
});

router.get('/update', (req, res) => {
  const { user } = req.session;
  const index = req.query.index;
  console.log(list);
  if (list[index - 1].userid === user.userid) {
    const view = list[index - 1]; //현재 보고있는 글정보
    res.render('../views/board/update', {
      index: index,
      data: view,
    });
  } else {
    res.send(
      alertmove(
        `/board/view?index=${req.query.index}`,
        '본인이 작성한 글만 수정 할 수 있습니다.'
      )
    );
  }
});

router.post('/update', (req, res) => {
  const index = req.body.index; //입력받은 내용
  const {
    subject, //
    username,
    content,
    userid,
  } = req.body;

  const item = {
    subject,
    username,
    content,
    userid,
  };

  list[index - 1] = item; //새 객체를 list에 추가
  res.send(
    alertmove(`/board/view?index=${index}`, '글 수정이 완료 되었습니다.')
  );
});

module.exports = router;
