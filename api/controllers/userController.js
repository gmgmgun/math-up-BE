const userService = require("../services/userService");
const { catchAsync } = require("../utils/error");

//회원가입
const signUp = catchAsync(async (req, res) => {
  const { id, password, name, phoneNumber } = req.body;
  await userService.signUp(id, password, name, phoneNumber);
  return res.status(201).json({ message: "SIGNUP_SUCCESS" });
});

// 로그인
const signIn = async (req, res) => {
  const { id, password } = req.body;
  const token = await userService.signIn(id, password);
  return res.status(200).json({ token });
};

// 문자인증 (완료, 혹은 아이디찾기))
const verifyCode = catchAsync(async (req, res) => {
  const { phoneNumber, code, userName } = req.query;
  const result = await userService.verifyCode(phoneNumber, code, userName);
  return res.status(200).json({ message: result });
});

//비밀번호 찾기 후 변경
const patchPassword = catchAsync(async (req, res) => {
  const { id, password } = req.body;
  await userService.patchPassword(password, id);
  return res.status(201).json({ message: "비밀번호 변경완료" });
});

// 이메일 중복체크
const checkDuplicateId = catchAsync(async (req, res) => {
  const { id } = req.query;
  const result = await userService.checkDuplicateId(id);
  return res.status(200).json({ message: result });
});

module.exports = {
  signUp,
  signIn,
  verifyCode,
  patchPassword,
  checkDuplicateId,
};
