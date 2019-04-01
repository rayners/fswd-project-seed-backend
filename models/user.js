'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('password', bcrypt.hashSync(val, 8))
      },
      validate: {
        notIn: [['password']],
        notEmpty: true
      }
    }
  }, {});
  // User.associate = function(models) {
  // };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    delete values.password;
    return values;
  };

  User.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};