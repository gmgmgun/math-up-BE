const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env.JWT_ACCESS_SECRET_KEY

const generateToken = (payload, expiresIn) => {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(
        payload,
        jwtSecretKey,
        {
          expiresIn: expiresIn,
        }, (err, token) => {
          if (err) reject(err);
          resolve(token)
        })
    })
}

module.exports = generateToken