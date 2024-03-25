const throwCustomError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;

  throw err;
};

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.error("globalErrorHandler: ", err);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "UNKNOWN_ERROR" });
};

module.exports = {
  globalErrorHandler,
  throwCustomError,
  catchAsync,
};
