const ThrowError = (err, req, res, next) => {
  let { statusCode = 500, message } = err;
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Этот адрес уже был зарегистрирован';
  }

  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = { ThrowError };
