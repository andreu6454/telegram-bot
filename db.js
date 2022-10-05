const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'telegram_bd',
    'root',
    '2639',
    {
        host: '46.148.239.195',
        port: '6432',
        dialect: 'postgres'
    }
)