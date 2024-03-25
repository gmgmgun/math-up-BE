const { throwCustomError } = require('../utils/error');
const client = require('./database');
const users = client.db().collection("users");

const signUp = async (id, hashPassword, name, phoneNumber) => {
  objectId = await users.findOne({ id: id });
  if (objectId) {
    throwCustomError('USER_ID_IS_ALREADY_EXIST', 409);
  }

  return users.insertMany([{
    id: id,
    password: hashPassword,
    phoneNumber: phoneNumber,
    name: name,
  },
  ]);
};

const findUserData = async (email) => {
  return users.findOne({ email: email });
};

const postUserNaverData = async (userData) => {
  return users.insertMany([{
    name: userData.name,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
  },
  ]);
};

const findUserDataById = async (id) => {
  return users.findOne({ id: id });
};

const findUserIdbyPhoneNumber = async (phoneNumber, userName) => {
  const user = await users.findOne({
    phoneNumber: phoneNumber,
    name: userName,
  });
  if (user) {
    return user.id;
  } else {
    return null;
  }
};

const sendVerifyCode = async (phoneNumber, verifyCode, name) => {
  const verification = client.db().collection("verification");
  const verificationExpiration = new Date();
  verificationExpiration.setMinutes(verificationExpiration.getMinutes() + 3);

  const verificationData = {
    phoneNumber: phoneNumber,
    verifyCode: verifyCode,
    name: name,
    expiration: verificationExpiration,
  };

  const result = await verification.insertMany([verificationData]);

  setTimeout(async () => {
    await verification.deleteOne(verificationData);
  }, 3 * 60 * 1000);

  return result;
};

const patchPassword = async (hashPassword, id) => {
  return users.update(
    { id: id },
    { $set: { password: hashPassword } },
    false,
    true
  );
};

const postToken = async (refreshToken, userId) => {
  const tokens = client.db().collection("tokens");
  return tokens.insertMany([
    {
      id: userId,
      refreshToken: refreshToken,
    },
  ]);
};

module.exports = {
  signUp,
  postUserNaverData,
  findUserData,
  findUserDataById,
  sendVerifyCode,
  findUserIdbyPhoneNumber,
  patchPassword,
  postToken,
};
