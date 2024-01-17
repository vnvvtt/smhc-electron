// patientOperations.js
const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const addPatient = async (patientDetails) => {
  try {
    if (!patientDetails) {
      throw new Error('Patient details are required.');
    }

    const patientsDoc = await pouchDB.get('patients').catch(() => ({ _id: 'patients', patients: [] }));

    const newPatient = { _id: `patient${Date.now()}`, ...patientDetails };

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

    const patientsDoc = await pouchDB.get('patients').catch(() => {
      return { _id: 'patients', patients: [] };
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

    const patientsDoc = await pouchDB.get('patients').catch(() => {
      return { _id: 'patients', patients: [] };
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

module.exports = { addPatient, editPatient, deletePatient };
