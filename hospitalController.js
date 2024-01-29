

// hospitalOperations


const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');




const addHospital = async (hospitalDetails) => {
  try {
   
    if (!hospitalDetails || !hospitalDetails.name || !hospitalDetails.address || !hospitalDetails.region
        || !hospitalDetails.city || !hospitalDetails.state || !hospitalDetails.country
        || !hospitalDetails.createdat || !hospitalDetails.updatedat || !hospitalDetails.email
        || !hospitalDetails.phone || !hospitalDetails.createdby || !hospitalDetails.updatedby
        || !hospitalDetails.hospitalshortname) {
      throw new Error('Incomplete hospital details.');
    }
    
    const database = createDatabaseInstance();

    // Proceed with adding hospital details
    const newHospital = {
      _id: `hospital${Date.now()}`,
      ...hospitalDetails
    };

    const hospitalsDoc = await database.get('hospitalsMaster').catch(() => ({ _id: 'hospitalsMaster', hospitalsMaster: [] }));

    // Add the new hospital details to the 'hospitals' array
    hospitalsDoc.hospitals.push(newHospital);

    // Save the updated 'hospitals' document back to the database
    const response = await pouchDB.put(hospitalsDoc);
    return 'Hospital details added successfully.';
    
  } catch (error) {
    console.error('Error adding hospital details:', error);
    throw new Error('Error adding hospital details.');
  }
};

const editHospital = async (hospitalId, updatedDetails) => {
    try {
      if (!hospitalId) {
        throw new Error('Hospital ID is required.');
      }
  
      // Fetch the existing 'hospitals' document or return an error if it doesn't exist
      const hospitalsDoc = await pouchDB.get('hospitalsMaster').catch(() => {
        return { _id: 'hospitalsMaster', hospitalsMaster: [] };
      });
  
      // Find the hospital with the specified ID in the 'hospitals' array
      const hospitalToUpdate = hospitalsDoc.hospitals.find(hospital => hospital._id === hospitalId);
      
      console.log('Existing hospitalsDoc:', hospitalsDoc);
      
      // If the hospital is not found, return an error
      if (!hospitalToUpdate) {
        return { error: 'Hospital not found.' };
      }
  
      // Update the hospital details in the 'hospitals' array
      hospitalsDoc.hospitals = hospitalsDoc.hospitals.map(hospital =>
        hospital._id === hospitalId ? { ...hospital, ...updatedDetails } : hospital
      );
  
      // Save the updated 'hospitals' document back to the database
      await pouchDB.put(hospitalsDoc);
  
      // Return a success message
      return { success: true, message: 'Hospital details updated successfully.' };
    } catch (error) {
      console.error('Error editing hospital details:', error);
      // Return an error message
      return { error: 'Error editing hospital details.' };
    }
  };

const deleteHospital = async (hospitalId) => {
  try {
    if (!hospitalId) {
      throw new Error('Hospital ID is required.');
    }

    // Fetch the existing 'hospitals' document or return an error if it doesn't exist
    const hospitalsDoc = await pouchDB.get('hospitalsMaster').catch(() => {
      return res.status(404).json({ error: 'Hospitals document not found.' });
    });

    // Find the index of the hospital with the specified ID in the 'hospitals' array
    const hospitalIndex = hospitalsDoc.hospitals.findIndex(hospital => hospital._id === hospitalId);

    // If the hospital is not found, return an error
    // if (hospitalIndex === -1) {
    //   return res.status(404).json({ error: 'Hospital not found.' });
    // }

    // Remove the hospital from the 'hospitals' array
    hospitalsDoc.hospitals.splice(hospitalIndex, 1);

    // Save the updated 'hospitals' document back to the database
    const response = await pouchDB.put(hospitalsDoc);
    // res.json(response);
    return 'Hospital deleted successfully.';
  } catch (error) {
    console.error('Error deleting hospital:', error);
    throw new Error('Error deleting hospital.');
  }
};

const getAllHospitalIds = async () => {
  try {
    const hospitalsDoc = await pouchDB.get('hospitalsMaster').catch(() => ({ _id: 'hospitalsMaster', hospitals: [] }));
    const hospitalIds = hospitalsDoc.hospitals.map(hospital => hospital._id);
    return hospitalIds;
  } catch (error) {
    console.error('Error getting hospital IDs:', error);
    throw new Error('Error getting hospital IDs.');
  }
};

module.exports = { addHospital, editHospital, deleteHospital, getAllHospitalIds };
