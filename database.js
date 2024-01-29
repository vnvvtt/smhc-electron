
const PouchDB = require('pouchdb');


const createDatabaseInstance = () => {
  const dbName = process.env.NODE_ENV === 'development' ? 'localdb' : 'http://admin:yds2024@ec2-44-201-160-122.compute-1.amazonaws.com:5984/ydc';
  return new PouchDB(dbName);
};

module.exports = { createDatabaseInstance };
