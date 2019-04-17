const {Result} = require('../models');
const {to, ReE, ReS} = require('../services/util.service');

const create = async function(req, res) {
  const user = req.user;
  const resultInfo = req.body;

  [err, result] = await to(Result.create(resultInfo));
  if (err) return ReE(res, err, 422);

  result.addUser(user, {through: {status: 'started'}})
  
  [err, result] = await to(result.save());
  if (err) return ReE(res, err, 422);

  const resultJson = result.toWeb();
  resultJson.users = [{user: user.id}];

  return ReS(res, {result: resultJson}, 201);
};
module.exports.create = create;

const getAll = async function(req, res) {
  const user = req.user;
  [err, results] = await to(user.getResults({include: [{association: Result.Users}]}));

  const resultsJson =[];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const users = result.Users;
    const resultInfo = result.toWeb();
    const usersInfo = [];
    for (let j = 0; j < users.length; j++) {
      const user = users[j];
      usersInfo.push({user: user.id});
    }
    resultInfo.users = usersInfo;
    resultsJson.push(resultInfo);
  }

  console.log('r t', resultsJson);
  return ReS(res, {results: resultsJson});
};
module.exports.getAll = getAll;
