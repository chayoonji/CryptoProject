const express = require('express');
const router = express.Router(); //메소드 호출
const { list } = require('../model/board');
const { alertmove } = require('../util/alertmove.js');

router.use('/', (req, res, next) => {
  // 메인 페이지
  const { user } = req.session; // 세션에 저장되어 있는 유저 데이터
  if (user !== undefined) {
    // user 데이터가 있는 경우 게시판 확인 가능
    next();
  } else {
    res.send(alertmove('/', '로그인 후 이용 가능합니다.')); // user data 없는 경우 로그인 후 이용 가능합니다 알림 후 메인 페이지 이동
  }
});

router.get('/list', (req, res) => {
  // 게시판
  const { user } = req.session;
  res.render('../views/board/list', {
    // views/board/list 페이지 글목록, 유저 데이터 포함해서 보여주기
    list,
    user,
  });
  console.log(req.session);
});

router.get('/write', (req, res) => {
  // 글쓰기
  const { user } = req.session;
  res.render('../views/board/write', { user }); // 작성자의 username, userid
});

router.post('/write', (req, res) => {
  // 글쓰기
  list.push(req.body);
  console.log(list); // 새로 작성한 글 내용 포함해서 콘솔에 글 목록 출력
  res.send(
    alertmove(`/board/view?index=${list.length}`, '글작성이 완료 되었습니다.') // 글작성이 완료 되었습니다 알림
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
  // 글 삭제
  const { user } = req.session;
  const index = req.body.index - 1;
  console.log(user.userid, 'user'); // 콘솔에 user 데이터 출력
  console.log(list[index].userid, 'list');
  console.log(list);
  if (list[index].userid === user.userid) {
    // id 같은 경우
    list.splice(index, 1); //인덱스부터 시작해서 1개 제거
    res.send(alertmove('/board/list', '글 삭제가 완료되었습니다.')); // 글 삭제가 완료되었습니다 알림 후 게시판 페이지 보여주기
  } else {
    res.send(
      alertmove(
        // id 다른 경우 본인이 작성한 글만 삭제 할 수 있습니다 알림 후 view 페이지 보여주기 (view 는 게시물을 클릭했을 때 나오는 화면)
        `/board/view?index=${index + 1}`,
        '본인이 작성한 글만 삭제할 수 있습니다.'
      )
    );
  }
});

router.get('/update', (req, res) => {
  // 수정
  const { user } = req.session;
  const index = req.query.index;
  console.log(list);
  if (list[index - 1].userid === user.userid) {
    // 유저 아이디 같은 경우 수정
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
