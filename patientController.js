// patientOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');




const addPatient = async (patientDetails) => {
  try {
    if (!patientDetails) {
      throw new Error('Patient details are required.');
    }

    const database = createDatabaseInstance();

    const patientsDoc = await database.get('patientsMaster').catch(() => ({ _id: 'patientsMaster', patients: [] }));

    const newPatient = { _id: `patientsMaster${Date.now()}`, ...patientDetails };

    patientsDoc.patients.push(newPatient);

    const response = await pouchDB.put(patientsDoc);

    return response;
  } catch (error) {
    console.error('Error adding patient details:', error);
    throw new Error('Error adding patient details.');
  }
};

const editPatient = async (patientId, updatedPatientDetails) => {
  try {
    if (!patientId || !updatedPatientDetails) {
      throw new Error('Patient ID and updated details are required.');
    }

    const patientsDoc = await pouchDB.get('patientsMaster').catch(() => {
      return { _id: 'patientsMaster', patientsMaster: [] };
    });

    const patientToUpdate = patientsDoc.patients.find(patient => patient._id === patientId);

    if (!patientToUpdate) {
      throw new Error('Patient not found.');
    }

    patientsDoc.patients = patientsDoc.patients.map(patient =>
      patient._id === patientId ? { ...patient, ...updatedPatientDetails } : patient
    );

    const response = await pouchDB.put(patientsDoc);

    return response;
  } catch (error) {
    console.error('Error editing patient details:', error);
    throw new Error('Error editing patient details.');
  }
};

const deletePatient = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required.');
    }

    const patientsDoc = await pouchDB.get('patientsMaster').catch(() => {
      return { _id: 'patientsMaster', patientsMaster: [] };
    });

    const existingPatient = patientsDoc.patients.find(patient => patient._id === patientId);

    if (!existingPatient) {
      throw new Error('Patient not found.');
    }

    const response = await pouchDB.remove(existingPatient._id, existingPatient._rev);

    return response;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw new Error('Error deleting patient.');
  }
};

const getAllPatientIds = async () => {
    try {
      const patientsDoc = await pouchDB.get('patientsMaster').catch(() => ({ _id: 'patientsMaster', patientsMaster: [] }));
      const patientIds = patientsDoc.patientsMaster.map(patient => patient._id);
      return patientIds;
    } catch (error) {
      console.error('Error getting patient IDs:', error);
      throw new Error('Error getting patient IDs.');
    }
  };
  
  module.exports = { addPatient, editPatient, deletePatient, getAllPatientIds };
