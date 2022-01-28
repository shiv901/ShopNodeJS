const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeshop','root', '', {host: 'localhost', dialect: 'mysql'})

module.exports = sequelize