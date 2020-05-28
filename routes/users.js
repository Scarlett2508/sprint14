const routes = require('express').Router();

const { getUser, createUser, getUsers } = require('../controllers/users');


routes.get('/users/:id', getUser);
routes.post('/users', createUser);
routes.get('/users', getUsers);

module.exports = routes;
