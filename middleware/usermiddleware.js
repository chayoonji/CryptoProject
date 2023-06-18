let userlist = require(`../model/user`);
const { alertmove } = require(`../util/alertmove`);

exports.login = (req, res) => {
  res.render(`user/login`); // 로그인 시도 시 user/login 페이지를 보여준다
};

exports.logincheck = (req, res) => {
  let { userid, userpw } = req.body; // 회원가입 시 입력받은 userid, userpw 데이터를 body에 담음
  let [item] = userlist.filter((a) => a.userid == userid && a.userpw == userpw);

  if (item != undefined) {
    // id와 pw 값이 올바른 경우
    if (item.userpw != undefined) {
      // pw 값이 올바르지 않은 경우
      req.session.user = { ...item };
      res.redirect(`/`); // 메인 페이지로 이동
    } else {
      res.send(alertmove(`/user/login`, `비밀번호가 일치하지 않습니다.`)); // 비밀번호가 일치하지 않습니다 알림
    }
  } else {
    res.send(alertmove(`/user/login`, `등록되지 않은 아이디입니다.`)); // id 값이 올바르지 않은 경우 등록되지 않은 아이디입니다 알림
  }
};

exports.logout = (req, res) => {
  // 로그아웃
  req.session.destroy(() => {
    //session에 저장되어 있는 정보 삭제
    req.session;
  });
  res.send(alertmove(`/`, `로그아웃이 완료되었습니다.`)); // 로그아웃이 완료되었습니다 알림 후 메인 페이지로 이동
};

exports.profile = (req, res) => {
  // 프로필
  const { user } = req.session; // session에 저장된 유저 정보
  res.render(`user/profile`, { user }); // user/profile에 user 값 포함해서 페이지 보여주기
};

exports.join = (req, res) => {
  // 회원가입
  const userdata = req.body; // userid, userpw, username 데이터  body에 저장
  userlist.push(userdata);
  console.log(userdata); // 콘솔에 입력받은 userdata 값 출력
  res.send(alertmove(`/`, `회원가입이 완료되었습니다.`)); // 회원가입이 완료되었습니다 알림 후 메인 페이지 이동
};

exports.create = (req, res) => {
  // 회원가입을 진행할 경우 user/join 페이지 보여주기
  res.render(`user/join`);
};

exports.quit = (req, res) => {
  // 회원 탈퇴
  const { user } = req.session; // 세션에 저장되어 있는 user 정보
  userlist = userlist.filter((v) => v.userid !== user.userid); // label에 있는 유저값과 세션에 저장되어 있는 유저값이 같은경우
  res.send(alertmove(`/user/logout`, `회원탈퇴가 완료되었습니다.`)); // 회원탈퇴가 완료되었습니다 알림 후 logut
};

exports.profile = (req, res) => {
  // 프로필
  const { user } = req.session; // 세션에 저장되어 있는 user 정보
  res.render(`user/profile`, { user }); // user/profile에 user 정보 넣어서 페이지 보여주기
};
