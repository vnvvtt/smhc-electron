// diagnosticLabTypeCaOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');


const addDiagLabTypeCa = async (DiagLabTypeCaDetails) => {
    try {
      if (!DiagLabTypeCaDetails) {
        throw new Error('addDiagLabType details are required.');
      }

      const database = createDatabaseInstance();
  
      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const DiagLabTypesCaDoc = await database.get('diagLabTypesCaMaster').catch(() => ({ _id: 'diagLabTypesCaMaster', diagLabTypesCa: [] }));
  
      const newDiagLabTypeCa = { _id: `diagLabTypeCa${Date.now()}`, ...DiagLabTypeCaDetails };
  
      // Add the new doctor to the 'doctors' array
      DiagLabTypesCaDoc.diagLabTypesCa.push(newDiagLabTypeCa);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(DiagLabTypesCaDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding DiagLabTypeCa details:', error);
      throw new Error('Error adding DiagLabTypeCa details.');
    }
  };
  

const editDiagLabTypeCa = async (DiagLabTypeCaId, updatedDiagLabTypeCaDetails) => {
  try {
    if (!DiagLabTypeCaId || !updatedDiagLabTypeCaDetails) {
      throw new Error('DiagLabTypeCa Id and other details are required.');
    }

    const DiagLabTypesCaDoc = await pouchDB.get('diagLabTypesCaMaster').catch(() => {
      return { _id: 'diagLabTypeCaMaster', diagLabTypesCaMaster: [] };
    });

    const documentToUpdate = DiagLabTypesCaDoc.diagLabTypesCa.find(diagLabTypeCa => diagLabTypeCa._id === DiagLabTypeCaId);

    if (!documentToUpdate) {
      throw new Error('DiagLabTypeCa not found.');
    }

    DiagLabTypesCaDoc.diagLabTypesCa = DiagLabTypesCaDoc.diagLabTypesCa.map(diagLabTypeCa =>
        diagLabTypeCa._id === DiagLabTypeCaId ? { ...diagLabTypeCa, ...updatedDiagLabTypeCaDetails } : diagLabTypeCa
    );

    const response = await pouchDB.put(DiagLabTypesCaDoc);

    return response;
  } catch (error) {
    console.error('Error editing DiagLabTypeCa details:', error);
    throw new Error('Error editing DiagLabTypeCa details.');
  }
};

const deleteDiagLabTypeCa = async (DiagLabTypeCaId) => {
  try {
    if (!DiagLabTypeCaId) {
      throw new Error('DiagLabTypeCa ID is required.');
    }

    const DiagLabTypesCaDoc = await pouchDB.get('diagLabTypesCaMaster').catch(() => {
      return { _id: 'diagLabTypesCaMaster', diagLabTypesCaMaster: [] };
    });

    const existingDiagLabTypeCa = DiagLabTypesCaDoc.diagLabTypesCa.find(diagLabTypeCa => diagLabTypeCa._id === DiagLabTypeCaId);

    if (!existingDiagLabTypeCa) {
      throw new Error('DiagLabTypeCa not found.');
    }

    const response = await pouchDB.remove(existingDiagLabTypeCa._id, existingDiagLabTypeCa._rev);

    return response;
  } catch (error) {
    console.error('Error deleting DiagLabTypeCa:', error);
    throw new Error('Error deleting DiagLabTypeCa.');
  }
};

const getAllDiagLabTypeCaIds = async () => {
    try {
      const DiagLabTypesCaDoc = await pouchDB.get('diagLabTypesCaMaster').catch(() => ({ _id: 'diagLabTypesCaMaster', diagLabTypesCaMaster: [] }));
      const DiagLabTypeCaIds = DiagLabTypesCaDoc.diagLabTypesCa.map(diagLabTypeCa => diagLabTypeCa._id);
      return DiagLabTypeCaIds;
    } catch (error) {
      console.error('Error getting DiagLabTypeCa IDs:', error);
      throw new Error('Error getting DiagLabTypeCa IDs.');
    }
  };
  
  module.exports = { addDiagLabTypeCa, editDiagLabTypeCa, deleteDiagLabTypeCa, getAllDiagLabTypeCaIds};
