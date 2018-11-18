const { Result } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
	let err, result;
	let user = req.user;
	let result_info = req.body;

	[err, result] = await to(Result.create(result_info));
	if(err) return ReE(res, err, 422);

	result.addUser(user, { through: { status: 'started' }})

	[err, result] = await to(result.save());
	if(err) return ReE(res, err, 422);

	let result_json = result.toWeb();
	result_json.users = [{user:user.id}];

	return ReS(res, {result:result_json}, 201);
};
module.exports.create = create;

const getAll = async function(req, res){
	let user = req.user;
	let err, results;

	[err, results] = await to(user.getResults({include: [ {association: Result.Users} ] }));

	let results_json =[];
	for( let i in results){
		let result = results[i];
		let users =  result.Users;
		let result_info = result.toWeb();
		let users_info = [];
		for (let i in users){
			let user = users[i];
			users_info.push({user: user.id});
		}
		result_info.users = users_info;
		results_json.push(result_info);
	}

	console.log('r t', results_json);
	return ReS(res, {results: results_json});
};
module.exports.getAll = getAll;
