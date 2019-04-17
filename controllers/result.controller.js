const {Result} = require('../models');
const {to, ReE, ReS} = require('../services/util.service');

const create = async function(req, res) {
  let err; let result;
  const user = req.user;
  const result_info = req.body;

  [err, result] = await to(Result.create(result_info));
  if (err) return ReE(res, err, 422);

  result.addUser(user, {through: {status: 'started'}})

      [err, result] = await to(result.save());
  if (err) return ReE(res, err, 422);

  const result_json = result.toWeb();
  result_json.users = [{user: user.id}];

  return ReS(res, {result: result_json}, 201);
};
module.exports.create = create;

const getAll = async function(req, res) {
  const user = req.user;
  let err; let results;

  [err, results] = await to(user.getResults({include: [{association: Result.Users}]}));

  const results_json =[];
  for (const i in results) {
    const result = results[i];
    const users = result.Users;
    const result_info = result.toWeb();
    const users_info = [];
    for (const i in users) {
      const user = users[i];
      users_info.push({user: user.id});
    }
    result_info.users = users_info;
    results_json.push(result_info);
  }

  console.log('r t', results_json);
  return ReS(res, {results: results_json});
};
module.exports.getAll = getAll;
