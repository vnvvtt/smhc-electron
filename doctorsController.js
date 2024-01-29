// doctorOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');


const { createDatabaseInstance } = require('./database');


const addDoctor = async (doctorDetails) => {
    try {
      if (!doctorDetails) {
        throw new Error('Doctor details are required.');
      }
      
      const database = createDatabaseInstance();
      
      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const doctorsDoc = await database.get('doctorsMaster').catch(() => ({ _id: 'doctorsMaster', doctors: [] }));
  
      const newDoctor = { _id: `doctorsMaster${Date.now()}`, ...doctorDetails };
  
      // Add the new doctor to the 'doctors' array
      doctorsDoc.doctors.push(newDoctor);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(doctorsDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding doctor details:', error);
      throw new Error('Error adding doctor details.');
    }
  };
  

const editDoctor = async (doctorId, updatedDoctorDetails) => {
  try {
    if (!doctorId || !updatedDoctorDetails) {
      throw new Error('Doctor ID and updated details are required.');
    }

    const doctorsDoc = await pouchDB.get('doctorsMaster').catch(() => {
      return { _id: 'doctorsMaster', doctorsMaster: [] };
    });

    const documentToUpdate = doctorsDoc.doctors.find(doctor => doctor._id === doctorId);

    if (!documentToUpdate) {
      throw new Error('Doctor not found.');
    }

    doctorsDoc.doctors = doctorsDoc.doctors.map(doctor =>
      doctor._id === doctorId ? { ...doctor, ...updatedDoctorDetails } : doctor
    );

    const response = await pouchDB.put(doctorsDoc);

    return response;
  } catch (error) {
    console.error('Error editing doctor details:', error);
    throw new Error('Error editing doctor details.');
  }
};

const deleteDoctor = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error('Doctor ID is required.');
    }

    const doctorsDoc = await pouchDB.get('doctorsMaster').catch(() => {
      return { _id: 'doctorsMaster', doctorsMaster: [] };
    });

    const existingDoctor = doctorsDoc.doctors.find(doctor => doctor._id === doctorId);

    if (!existingDoctor) {
      throw new Error('Doctor not found.');
    }

    const response = await pouchDB.remove(existingDoctor._id, existingDoctor._rev);

    return response;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw new Error('Error deleting doctor.');
  }
};

const getAllDoctorIds = async () => {
    try {
      const doctorsDoc = await pouchDB.get('doctorsMaster').catch(() => ({ _id: 'doctorsMaster', doctorsMaster: [] }));
      const doctorIds = doctorsDoc.doctors.map(doctor => doctor._id);
      return doctorIds;
    } catch (error) {
      console.error('Error getting doctor IDs:', error);
      throw new Error('Error getting doctor IDs.');
    }
  };
  
  module.exports = { addDoctor, editDoctor, deleteDoctor, getAllDoctorIds };
