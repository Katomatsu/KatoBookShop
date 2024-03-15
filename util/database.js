const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('katomarket', 'root', 'ado567##', {
	dialect: 'mysql',
	host: 'localhost'
});

module.exports = sequelize