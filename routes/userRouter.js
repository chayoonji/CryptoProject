const express = require(`express`);
const router = express.Router();
const userController = require(`../middleware/usermiddleware`);

router.get(`/login`, userController.login);

router.post(`/login`, userController.logincheck);

router.get(`/profile`, userController.profile);

router.get(`/logout`, userController.logout);

router.get(`/join`, userController.create);

router.post('/join', userController.join);

router.get('/quit', userController.quit);

module.exports = router;
