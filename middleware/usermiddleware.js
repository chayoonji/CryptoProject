let userlist = require(`../model/user`);
const { alertmove } = require(`../util/alertmove`);

exports.login = (req, res) => {
  res.render(`user/login`);
};

exports.logincheck = (req, res) => {
  let { userid, userpw } = req.body;
  let [item] = userlist.filter((a) => a.userid == userid && a.userpw == userpw);
  // let [item2] = user.filter(b=>(b.item1.pw==userpw))
  if (item != undefined) {
    if (item.userpw != undefined) {
      req.session.user = { ...item };
      res.redirect(`/`);
    } else {
      res.send(alertmove(`/user/login`, `비밀번호가 일치하지 않습니다.`));
    }
  } else {
    res.send(alertmove(`/user/login`, `등록되지 않은 아이디입니다.`));
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    req.session;
  });
  res.send(alertmove(`/`, `로그아웃이 완료되었습니다.`));
};

exports.profile = (req,res)=>{
    const {user} = req.session
    res.render(`user/profile`,{user})
}

exports.join = (req,res)=>{
    const userdata = req.body
    userlist.push(userdata)
    console.log(userdata)
    res.send(alertmove(`/`,`회원가입이 완료되었습니다.`))
}

exports.create = (req,res)=>{
    res.render(`user/join`)
}

exports.quit = (req,res)=>{
    const {user} = req.session
    userlist = userlist.filter((v) => v.userid !== user.userid);
    res.send(alertmove(`/user/logout`,`회원탈퇴가 완료되었습니다.`))
}

exports.profile = (req, res) => {
  const { user } = req.session;
  res.render(`user/profile`, { user });
};

