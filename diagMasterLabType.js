// diagnosticLabTypeOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');


const addDiagLabType = async (DiagLabTypeDetails) => {
    try {
      if (!DiagLabTypeDetails) {
        throw new Error('addDiagLabType details are required.');
      }

      const database = createDatabaseInstance();
  
      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const DiagLabTypesDoc = await database.get('diagLabTypesMaster').catch(() => ({ _id: 'diagLabTypesMaster', diagLabTypes: [] }));
  
      const newDiagLabType = { _id: `diagLabTypesMaster${Date.now()}`, ...DiagLabTypeDetails };
  
      // Add the new doctor to the 'doctors' array
      DiagLabTypesDoc.diagLabTypes.push(newDiagLabType);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(DiagLabTypesDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding DiagLabType details:', error);
      throw new Error('Error adding DiagLabType details.');
    }
  };
  

const editDiagLabType = async (DiagLabTypeId, updatedDiagLabTypeDetails) => {
  try {
    if (!DiagLabTypeId || !updatedDiagLabTypeDetails) {
      throw new Error('DiagLabType ID and updated details are required.');
    }

    const DiagLabTypesDoc = await pouchDB.get('diagLabTypesMaster').catch(() => {
      return { _id: 'diagLabTypeMaster', diagLabTypesMaster: [] };
    });

    const documentToUpdate = DiagLabTypesDoc.diagLabTypes.find(diagLabType => diagLabType._id === DiagLabTypeId);

    if (!documentToUpdate) {
      throw new Error('DiagLabType not found.');
    }

    DiagLabTypesDoc.diagLabTypes = DiagLabTypesDoc.diagLabTypes.map(diagLabType =>
        diagLabType._id === DiagLabTypeId ? { ...diagLabType, ...updatedDiagLabTypeDetails } : diagLabType
    );

    const response = await pouchDB.put(DiagLabTypesDoc);

    return response;
  } catch (error) {
    console.error('Error editing DiagLabType details:', error);
    throw new Error('Error editing DiagLabType details.');
  }
};

const deleteDiagLabType = async (DiagLabTypeId) => {
  try {
    if (!DiagLabTypeId) {
      throw new Error('DiagLabType ID is required.');
    }

    const DiagLabTypesDoc = await pouchDB.get('diagLabTypesMaster').catch(() => {
      return { _id: 'diagLabTypesMaster', diagLabTypesMaster: [] };
    });

    const existingDiagLabType = DiagLabTypesDoc.diagLabTypes.find(diagLabType => diagLabType._id === DiagLabTypeId);

    if (!existingDiagLabType) {
      throw new Error('DiagLabType not found.');
    }

    const response = await pouchDB.remove(existingDiagLabType._id, existingDiagLabType._rev);

    return response;
  } catch (error) {
    console.error('Error deleting DiagLabType:', error);
    throw new Error('Error deleting DiagLabType.');
  }
};

const getAllDiagLabTypeIds = async () => {
    try {
      const DiagLabTypesDoc = await pouchDB.get('diagLabTypesMaster').catch(() => ({ _id: 'diagLabTypesMaster', diagLabTypesMaster: [] }));
      const DiagLabTypeIds = DiagLabTypesDoc.diagLabTypes.map(diagLabType => diagLabType._id);
      return DiagLabTypeIds;
    } catch (error) {
      console.error('Error getting DiagLabType IDs:', error);
      throw new Error('Error getting DiagLabType IDs.');
    }
  };
  
  module.exports = { addDiagLabType, editDiagLabType, deleteDiagLabType, getAllDiagLabTypeIds};
