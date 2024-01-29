// modesOfPaymentOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');




const addModesOfPayment = async (modesOfPaymentDetails) => {
    try {
      if (!modesOfPaymentDetails) {
        throw new Error('modesOfPaymentDetails  are required.');
      }
      
      const database = createDatabaseInstance();

      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const modesOfPaymentDoc = await database.get('modesOfPaymentsMaster').catch(() => ({ _id: 'modesOfPaymentsMaster', modesOfPayments: [] }));
  
      const newModesOfPayments = { _id: `modesOfPaymentsMaster${Date.now()}`, ...modesOfPaymentDetails };
  
      // Add the new doctor to the 'doctors' array
      modesOfPaymentDoc.modesOfPayments.push(newModesOfPayments);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(modesOfPaymentDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding modesOfPayment details:', error);
      throw new Error('Error adding modesOfPayment details.');
    }
  };
  

const editModesOfPayment = async (modesOfPaymentId, updatedModesOfPaymentDetails) => {
  try {
    if (!modesOfPaymentId || !updatedModesOfPaymentDetails) {
      throw new Error('modesOfPayment ID and updated details are required.');
    }

    const modesOfPaymentDoc = await pouchDB.get('modesOfPaymentsMaster').catch(() => {
      return { _id: 'modesOfPaymentsMaster', modesOfPaymentsMaster: [] };
    });

    const documentToUpdate = modesOfPaymentDoc.modesOfPayments.find(modesOfPayment => modesOfPayment._id === modesOfPaymentId);

    if (!documentToUpdate) {
      throw new Error('modesOfPayments not found.');
    }

    modesOfPaymentDoc.modesOfPaymentsMaster = modesOfPaymentDoc.modesOfPaymentsMaster.map(modesOfPayment =>
        modesOfPayment._id === modesOfPaymentId ? { ...modesOfPayment, ...updatedModesOfPaymentDetails } : modesOfPayment
    );

    const response = await pouchDB.put(modesOfPaymentDoc);

    return response;
  } catch (error) {
    console.error('Error editing modesOfPayment details:', error);
    throw new Error('Error editing modesOfPayment details.');
  }
};

const deleteModesOfPayment = async (modesOfPaymentId) => {
  try {
    if (!modesOfPaymentId) {
      throw new Error('modesOfPayment ID is required.');
    }

    const modesOfPaymentDoc = await pouchDB.get('modesOfPaymentsMaster').catch(() => {
      return { _id: 'modesOfPaymentsMaster', modesOfPaymentsMaster: [] };
    });

    const existingModesOfPayment = modesOfPaymentDoc.modesOfPayments.find(modesOfPayment => modesOfPayment._id === modesOfPaymentId);

    if (!existingModesOfPayment) {
      throw new Error('modesOfPayment not found.');
    }

    const response = await pouchDB.remove(existingModesOfPayment._id, existingModesOfPayment._rev);

    return response;
  } catch (error) {
    console.error('Error deleting existingModesOfPayment:', error);
    throw new Error('Error deleting existingModesOfPayment.');
  }
};

const getAllModesOfPaymentIds = async () => {
    try {
      const modesOfPaymentDoc = await pouchDB.get('modesOfPaymentsMaster').catch(() => ({ _id: 'modesOfPaymentsMaster', modesOfPaymentsMaster: [] }));
      const modesOfPaymentIds = modesOfPaymentDoc.expenses.map(modesOfPayment => modesOfPayment._id);
      return modesOfPaymentIds;
    } catch (error) {
      console.error('Error getting modesOfPayment IDs:', error);
      throw new Error('Error getting modesOfPayment IDs.');
    }
  };
  
  module.exports = { addModesOfPayment, editModesOfPayment, deleteModesOfPayment, getAllModesOfPaymentIds };
