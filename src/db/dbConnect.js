import Sequelize from 'sequelize'

require('dotenv').config({ silent: true });

const args = process.argv.slice(2);

// NOTE: process.env.USE_SSL is a String
const useSSL = !(process.env.USE_SSL === 'false');


const getRemoteDB = (databaseUrl, ssl) => {
  console.log('getRemoteDB: ssl', ssl)
  return new Sequelize(databaseUrl, {
    dialect: 'postgres',
    protocol: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    dialectOptions: {
      ssl,
    },
    //logging: false,
  })
};

let pgdb;
if (process.env.DATABASE_URL) {
  pgdb = getRemoteDB(process.env.DATABASE_URL, useSSL);
  console.log('Using DATABASE_URL', process.env.DATABASE_URL.split('@')[1])
} else {
  pgdb = getRemoteDB(process.env.LOCAL_DATABASE_URL, false);
  console.log('Using LOCAL DATABASE')
}

const db = pgdb;
export default db
