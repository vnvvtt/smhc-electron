const express = require('express');
const PouchDB = require('pouchdb');
const expressPouchDB = require('express-pouchdb');

const app = express();
const port = 3000;

// Create PouchDB instances
const pouchDB = new PouchDB('localdb');
// const remoteDB = new PouchDB('http://localhost:5984/mydb'); // Change the URL to your CouchDB instance

// Enable CORS for PouchDB
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use express-pouchdb for endpoints
app.use('/localdb', expressPouchDB(pouchDB));
// app.use('/remotedb', expressPouchDB(remoteDB));

// let replicationStarted = false;


pouchDB.bulkDocs([
    {
      _id: 'item1',
      name: 'Sample Item 1',
      type: 'item',
    },
    {
      _id: 'item2',
      name: 'Sample Item 2',
      type: 'item',
    },
    {
      _id: 'collection1',
      name: 'Sample Collection 1',
      type: 'collection',
    },
  ])
    .then(response => {
      console.log('Sample data added to local database:', response);
    })
    .catch(error => {
      console.error('Error adding sample data to local database:', error);
    });

// Replicate changes from localdb to remotedb
// function startReplication() {
//   if (!replicationStarted) {
//     const replication = pouchDB.replicate.to(remoteDB, { live: true, retry: true });

//     replication
//       .on('change', info => {
//         console.log('Replication change:', info);
//       })
//       .on('paused', info => {
//         console.log('Replication paused:', info);
//       })
//       .on('active', info => {
//         console.log('Replication active:', info);
//       })
//       .on('denied', err => {
//         console.error('Replication denied:', err);
//       })
//       .on('complete', info => {
//         console.log('Replication complete:', info);
//       })
//       .on('error', err => {
//         console.error('Replication error:', err);
//       });

//     replicationStarted = true;
//   }
// }

// Ensure replication is started only once
// startReplication();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
