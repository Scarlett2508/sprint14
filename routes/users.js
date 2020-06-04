const routes = require('express').Router();

const { getUser, getUsers } = require('../controllers/users');


routes.get('/users/:id', getUser);
routes.get('/users', getUsers);

module.exports = routes;
