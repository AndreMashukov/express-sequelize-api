const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Result', {
    data: DataTypes.JSON,
  });

  Model.associate = function(models) {
    this.Users = this.belongsToMany(models.User, {through: 'UserResult'});
  };

  Model.prototype.toWeb = function(pw) {
    const json = this.toJSON();
    return json;
  };

  return Model;
};
