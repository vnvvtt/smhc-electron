// usersOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');


const createDatabaseInstance = () => {
    const dbName = process.env.NODE_ENV === 'development' ? 'localdb' : 'http://admin:yds2024@ec2-44-201-160-122.compute-1.amazonaws.com:5984/ydc';
    return new PouchDB(dbName);
  };

const addRegion = async (regionDetails) => {
    try {
      if (!regionDetails) {
        throw new Error('Region details are required.');
      }

      const database = createDatabaseInstance();
  
      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const regionsDoc = await database.get('regionsMaster').catch(() => ({ _id: 'regionsMaster', regions: [] }));
  
      const newRegion = { _id: `regionsMaster${Date.now()}`, ...regionDetails };
  
      // Add the new doctor to the 'doctors' array
      regionsDoc.regions.push(newRegion);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(regionsDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding region details:', error);
      throw new Error('Error adding region details.');
    }
  };
  

const editRegion = async (regionId, updatedRegionDetails) => {
  try {
    if (!regionId || !updatedRegionDetails) {
      throw new Error('Region ID and updated details are required.');
    }

    const regionsDoc = await pouchDB.get('regionsMaster').catch(() => {
      return { _id: 'region', regionsMaster: [] };
    });

    const documentToUpdate = regionsDoc.regions.find(region => region._id === regionId);

    if (!documentToUpdate) {
      throw new Error('Region not found.');
    }

    regionsDoc.regionsMaster = regionsDoc.regionsMaster.map(region =>
      region._id === regionId ? { ...region, ...updatedRegionDetails } : region
    );

    const response = await pouchDB.put(regionsDoc);

    return response;
  } catch (error) {
    console.error('Error editing region details:', error);
    throw new Error('Error editing region details.');
  }
};

const deleteRegion = async (regionId) => {
  try {
    if (!regionId) {
      throw new Error('Region ID is required.');
    }

    const regionsDoc = await pouchDB.get('regionsMaster').catch(() => {
      return { _id: 'regionsMaster', regionsMaster: [] };
    });

    const existingRegion = regionsDoc.regions.find(region => region._id === regionId);

    if (!existingRegion) {
      throw new Error('Region not found.');
    }

    const response = await pouchDB.remove(existingRegion._id, existingRegion._rev);

    return response;
  } catch (error) {
    console.error('Error deleting region:', error);
    throw new Error('Error deleting region.');
  }
};

const getAllRegionIds = async () => {
    try {
      const regionsDoc = await pouchDB.get('regionsMaster').catch(() => ({ _id: 'regionsMaster', regionsMaster: [] }));
      const regionIds = regionsDoc.regions.map(region => region._id);
      return regionIds;
    } catch (error) {
      console.error('Error getting region IDs:', error);
      throw new Error('Error getting region IDs.');
    }
  };
  
  module.exports = { addRegion, editRegion, deleteRegion, getAllRegionIds };
