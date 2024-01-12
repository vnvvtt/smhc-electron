const express = require('express');
const PouchDB = require('pouchdb');
const expressPouchDB = require('express-pouchdb');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;


const localDBCredentials = {
    username: 'admin',
    password: 'admin',
  };

// Set your CouchDB credentials
const remoteDBCredentials = {
    username: 'admin',
    password: 'admin',
  };

// Create PouchDB instances
const pouchDB = new PouchDB('localdb');
const remoteDB = new PouchDB(`http://${remoteDBCredentials.username}:${remoteDBCredentials.password}@localhost:5984/ydc`);

// Enable CORS for PouchDB



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use express-pouchdb for endpoints
app.use('/localdb', basicAuth({
    users: { [localDBCredentials.username]: localDBCredentials.password },
    challenge: true, // Set to true to prompt for credentials
    unauthorizedResponse: 'Unauthorized',
  }));
app.use('/remotedb', expressPouchDB(remoteDB));

let replicationStarted = false;



pouchDB.bulkDocs([
    {
      _id: 'item4',
      name: 'Sample Item 99',
      type: 'item',
    },
    {
      _id: 'item5',
      name: 'Sample Item 100',
      type: 'item',
    },
    // {
    //   _id: 'collection1',
    //   name: 'Sample Collection 1',
    //   type: 'collection',
    // },
  ])
    .then(response => {
      console.log('Sample data added to local database:', response);
    })
    .catch(error => {
      console.error('Error adding sample data to local database:', error);
    });


    // Replicate changes from CouchDB to local PouchDB
const replicationFromOptions = {
    live: true,
    retry: true,
    auth: {
      username: localDBCredentials.username,
      password: localDBCredentials.password,
    },
  };

  const remoteCouchDBURL = 'http://admin:admin@localhost:5984/ydc';

  const replicationFromHandler = pouchDB.replicate.from(remoteCouchDBURL, replicationFromOptions);

replicationFromHandler
  .on('change', info => {
    console.log('Replication from CouchDB change:', info);
  })
  .on('paused', info => {
    console.log('Replication from CouchDB paused:', info);
  })
  .on('active', info => {
    console.log('Replication from CouchDB active:', info);
  })
  .on('denied', err => {
    console.error('Replication from CouchDB denied:', err);
  })
  .on('complete', info => {
    console.log('Replication from CouchDB complete:', info);
  })
  .on('error', err => {
    console.error('Replication from CouchDB error:', err);
  });

// Replicate changes from localdb to remotedb
function startReplication() {
  if (!replicationStarted) {
    const replication = pouchDB.replicate.to(remoteDB, { live: true, retry: true });

    replication
      .on('change', info => {
        console.log('Replication change:', info);
      })
      .on('paused', info => {
        console.log('Replication paused:', info);
      })
      .on('active', info => {
        console.log('Replication active:', info);
      })
      .on('denied', err => {
        console.error('Replication denied:', err);
      })
      .on('complete', info => {
        console.log('Replication complete:', info);
      })
      .on('error', err => {
        console.error('Replication error:', err);
      });

    replicationStarted = true;
  }
}



// Ensure replication is started only once
startReplication();

app.get('/viewDocuments', async (req, res) => {
    try {
      const allDocs = await pouchDB.allDocs({ include_docs: true });
      res.json(allDocs);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving documents' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
