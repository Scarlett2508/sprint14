const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { Error } = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), login);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(Error);

app.listen(PORT);
