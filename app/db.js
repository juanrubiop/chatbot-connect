const {Sequelize} = require('sequelize');

const DATABASE_HOST_URL = process.env.DATABASE_HOST_URL
const DATABASE_NAME     = process.env.DATABASE_NAME
const DATABASE_USERNAME = process.env.DATABASE_USERNAME
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
console.log('process.env.DATABASE_NAME', process.env.DATABASE_NAME)

const sequelize = new Sequelize(
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD, {
        dialect: 'mysql',
        host: DATABASE_HOST_URL
    }
);
console.log('DATABASE_NAME', DATABASE_NAME)
console.log('DATABASE_USERNAME', DATABASE_USERNAME)
console.log('DATABASE_PASSWORD', DATABASE_PASSWORD)
const connectToDb = async ()=> {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to db");
    }
    catch(error){
        console.log(error);
    }
};


module.exports = {
    sequelize,
    connectToDb
};
