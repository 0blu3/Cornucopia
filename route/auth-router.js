'use strict';

const debug = require('debug')('cornucopia:auth-router');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const User = require('./model/user.js');
const basicAuth = require('./lib/basic-auth-middleware.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  // why json parser?
  debug('POST /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
  .then( user => user.save())
  .then( user => user.generateToken())
  // whats goin on with the token
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  // why not json parser?
  debug('GET /api/signin');

  User.findOne({ username: req.auth.username})
  .then( user => user.comparePasswordHash(req.auth.password))
  .then( user => user.generateToken())
  // whats goin on with the token
  .then( token => res.send(token))
  .catch(next);
});
