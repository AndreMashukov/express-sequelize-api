const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
	var Model = sequelize.define('Result', {
		data: DataTypes.JSON
	});

	Model.associate = function(models){
		this.Users = this.belongsToMany(models.User, {through: 'UserResult'});
	};

	Model.prototype.toWeb = function (pw) {
		let json = this.toJSON();
		return json;
	};

	return Model;
};