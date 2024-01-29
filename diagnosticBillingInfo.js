// DiagnosticbillingOperations


const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');
const patientOperations = require('./patientController'); // Adjust the path accordingly

const createDatabaseInstance = () => {
  const dbName = process.env.NODE_ENV === 'development' ? 'localdb' : 'http://admin:yds2024@ec2-44-201-160-122.compute-1.amazonaws.com:5984/ydc';
  return new PouchDB(dbName);
};

const addBillingInfo = async (billingInfo) => {
  try {
    if (!billingInfo || !billingInfo.patientid) {
      throw new Error('Billing information is incomplete.');
    }

    const database = createDatabaseInstance();

    // Fetch all patient IDs from the patients collection
    const patientIds = await patientOperations.getAllPatientIds();

    // Check if the provided patient ID exists in the patients collection
    if (!patientIds.includes(billingInfo.patientid)) {
      throw new Error('Patient ID not found.');
    }

    // Proceed with adding billing information
    // ...

    return 'Billing information added successfully.';
  } catch (error) {
    console.error('Error adding billing information:', error);
    throw new Error('Error adding billing information.');
  }
};

module.exports = { addBillingInfo };
