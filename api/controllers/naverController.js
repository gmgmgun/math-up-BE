const naverService = require("../services/naverService");
const cryptoJS = require("crypto-js");

const naverLogin = async (req, res) => {
  const { code } = req.query;
  const token = await naverService.naverLogin(code);
  return res.status(200).json({ token });
};

const sendVerifyCode = async (req, res) => {
  const { name, phoneNumber } = req.body;
  const verifyCode = (
    Math.floor(Math.random() * (999999 - 100000)) + 100000
  ).toString();

  const date = Date.now().toString();
  const secretKey = process.env.NAVER_SECRET_KEY;
  const accessKey = process.env.NAVER_ACCESS_KEY;
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`;
  const message = cryptoJS.algo.HMAC.create(cryptoJS.algo.SHA256, secretKey);

  message.update(method);
  message.update(space);
  message.update(url);
  message.update(newLine);
  message.update(date);
  message.update(newLine);
  message.update(accessKey);

  const hash = message.finalize();
  const signature = hash.toString(cryptoJS.enc.Base64);
  await naverService.sendVerifyCode(
    phoneNumber,
    signature,
    verifyCode,
    date,
    name
  );

  return res.status(201).json({ message: "전송완료" });
};

module.exports = { naverLogin, sendVerifyCode };
