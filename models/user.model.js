'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const {TE, to} = require('../services/util.service');
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    policy_code: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    email: {type: DataTypes.STRING, allowNull: true, unique: true, validate: {isEmail: {msg: 'Phone number invalid.'}}},
    password: DataTypes.STRING,
  });

  Model.associate = function(models) {
    this.Results = this.belongsToMany(models.Result, {through: 'UserResult'});
  };

  Model.beforeSave(async (user, options) => {
    let err;
    if (user.changed('password')) {
      let salt; let hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) TE(err.message, true);

      user.password = hash;
    }
  });

  Model.prototype.comparePassword = async function(pw) {
    let err; let pass;
    if (!this.password) TE('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('invalid password');

    return this;
  };

  Model.prototype.getJWT = function() {
    const expirationTime = parseInt(CONFIG.jwt_expiration);
    return 'Bearer '+ jwt.sign({user_id: this.id}, CONFIG.jwt_encryption, {expiresIn: expirationTime});
  };

  Model.prototype.toWeb = function(pw) {
    const json = this.toJSON();
    return json;
  };

  return Model;
};
