const { User } = require('../models');
const authService = require('../services/auth.service');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
	const body = req.body;

	if(!body.unique_key && !body.email){
		return ReE(res, 'Please enter a valid email');
	} else if(!body.password){
		return ReE(res, 'Please enter a password to register.');
	}else{
		let err, user;

		[err, user] = await to(authService.createUser(body));

		if(err) return ReE(res, err, 422);
		return ReS(res, {message: 'Successfully created new user.', user:user.toWeb(), token: user.getJWT()}, 201);
	}
};
module.exports.create = create;

const get = async function(req, res){	
	const {id, email, firstname, lastname, phone, dob, policy_code} = req.user;
	let user = {
		id,
		firstname,
		lastname,
		email,
		phone,
		dob,
		policy_code
	};
	return ReS(res, {user: user});
};
module.exports.get = get;

const update = async function(req, res){
	let err, user, data;
	user = req.user;
	data = req.body;
	user.set(data);

	[err, user] = await to(user.save());
	if(err){
		if(err.message == 'Validation error') err = 'The email address is already in use';
		return ReE(res, err);
	}
	return ReS(res, {message: 'Updated User: ' + user.email});
};
module.exports.update = update;

const remove = async function(req, res){
	let user, err;
	user = req.user;

	[err, user] = await to(user.destroy());
	if(err) return ReE(res, 'error occured trying to delete user');

	return ReS(res, {message: 'Deleted User'}, 204);
};
module.exports.remove = remove;


const login = async function(req, res){
	const body = req.body;
	let err, user;

	[err, user] = await to(authService.authUser(req.body));
	if(err) return ReE(res, err, 422);

	return ReS(res, {token: user.getJWT()});
};
module.exports.login = login;