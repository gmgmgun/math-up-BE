const jwt = require("jsonwebtoken");
const { catchAsync, throwCustomError } = require("./error");

const validateToken = catchAsync(async (req, res, next) => {
  const accessToken = req.headers.authorization;
  const refreshToken = req.headers.authorization;

  if (!accessToken) throwCustomError("NEED_ACCESS_TOKEN", 400);

  const decoded = await jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET_KEY
  );

  if (!decoded) throwCustomError("USER_DOES_NOT_EXIST", 404);

  req.userId = decoded.id;
  next();
});

module.exports = {
  validateToken,
};
