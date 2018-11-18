const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');
const ResultController = require('../controllers/result.controller');

const passport = require('passport');
const path = require('path');

require('./../middleware/passport')(passport);

// GET home page. 
router.get('/', function(req, res, next) {
	res.json({status: 'success', message: 'API', data: {'version_number':'v1.0.0'}});
});

router.post('/users', UserController.create); 
router.get('/users', passport.authenticate('jwt', {session: false}), UserController.get);       
router.put('/users', passport.authenticate('jwt', {session: false}), UserController.update);    
router.delete('/users', passport.authenticate('jwt', {session: false}), UserController.remove);   
router.post('/users/login', UserController.login);

router.post('/results', passport.authenticate('jwt', {session: false}), ResultController.create);                 
router.get('/results', passport.authenticate('jwt', {session: false}), ResultController.getAll);                 

module.exports = router;
