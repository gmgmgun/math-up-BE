const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userDao = require("../models/userDao");
const verification = require("../utils/verification");
const { throwCustomError } = require("../utils/error");
const generateToken = require("../utils/token");

const signUp = async (id, password, name, phoneNumber) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return userDao.signUp(id, hashPassword, name, phoneNumber);
};

const signIn = async (id, password) => {
  const user = await userDao.findUserDataById(id);
  if (!user) {
    throwCustomError("INVALID_USER", 409);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throwCustomError("INVALIDE_PASSWORD", 409);
  }

  const accessToken = generateToken(user._id, "1h");

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: "14d" }
  );

  const time = moment().add(12, "hour");
  const expireTime = time.format("YYYY.MM.DD HH:mm:ss");

  await userDao.postToken(refreshToken, user._id);

  const tokens = [
    { accessToken: accessToken, expirationTime: expireTime },
    { refreshToken: refreshToken },
  ];

  return tokens;
};

const getAccessToken = (id, secretKey, options) => {
  const accessToken = jwt.sign(id, secretKey, options);
  return accessToken;
};

const verifyCode = async (phoneNumber, code, userName) => {
  if (!code) throwCustomError("인증번호를 입력해주세요", 409);
  const verificationCode = await verification.verificationCode(
    phoneNumber,
    code,
    userName
  );

  if (!verificationCode) throwCustomError("인증번호가 틀립니다", 409);
  const findUserId = await userDao.findUserIdbyPhoneNumber(
    phoneNumber,
    userName
  );

  if (!findUserId) throwCustomError("일치하는 정보가 없습니다.", 409);
  return findUserId;
};

const patchPassword = async (password, id) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return await userDao.patchPassword(hashPassword, id);
};

const checkDuplicateId = async (id) => {
  if (!id) throwCustomError("아이디를 입력해주세요", 409);

  const result = await userDao.findUserDataById(id);
  if (!result) {
    return "사용가능한 아이디입니다.";
  } else {
    throwCustomError("중복되거나 탈퇴한 아이디입니다.", 409);
  }
};

module.exports = {
  signUp,
  signIn,
  verifyCode,
  patchPassword,
  checkDuplicateId,
};
