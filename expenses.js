// expensesOperations

const PouchDB = require('pouchdb');

const pouchDB = new PouchDB('localdb');

const { createDatabaseInstance } = require('./database');



const addExpense = async (expensesDetails) => {
    try {
      if (!expensesDetails) {
        throw new Error('expense details are required.');
      }

      const database = createDatabaseInstance();
  
      // Fetch the existing 'doctors' document or create a new one if it doesn't exist
      const expensesDoc = await database.get('expensesMaster').catch(() => ({ _id: 'expensesMaster', expenses: [] }));
  
      const newExpense = { _id: `expensesMaster${Date.now()}`, ...expensesDetails };
  
      // Add the new doctor to the 'doctors' array
      expensesDoc.expenses.push(newExpense);
  
      // Save the updated 'doctors' document back to the database
      const response = await pouchDB.put(expensesDoc);
  
      return response;
    } catch (error) {
      console.error('Error adding expense details:', error);
      throw new Error('Error adding expense details.');
    }
  };
  

const editExpense = async (expenseId, updatedExpenseDetails) => {
  try {
    if (!expenseId || !updatedExpenseDetails) {
      throw new Error('Region ID and updated details are required.');
    }

    const expensesDoc = await pouchDB.get('expensesMaster').catch(() => {
      return { _id: 'expensesMaster', expensesMaster: [] };
    });

    const documentToUpdate = expensesDoc.expenses.find(expense => expense._id === expenseId);

    if (!documentToUpdate) {
      throw new Error('expense not found.');
    }

    expensesDoc.expensesMaster = expensesDoc.expensesMaster.map(expense =>
      expense._id === expenseId ? { ...expense, ...updatedExpenseDetails } : expense
    );

    const response = await pouchDB.put(expensesDoc);

    return response;
  } catch (error) {
    console.error('Error editing expense details:', error);
    throw new Error('Error editing expense details.');
  }
};

const deleteExpense = async (expenseId) => {
  try {
    if (!expenseId) {
      throw new Error('expense ID is required.');
    }

    const expensesDoc = await pouchDB.get('expensesMaster').catch(() => {
      return { _id: 'expensesMaster', expensesMaster: [] };
    });

    const existingExpense = expensesDoc.expenses.find(expense => expense._id === expenseId);

    if (!existingExpense) {
      throw new Error('expense not found.');
    }

    const response = await pouchDB.remove(existingExpense._id, existingExpense._rev);

    return response;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Error deleting expense.');
  }
};

const getAllExpenseIds = async () => {
    try {
      const expensesDoc = await pouchDB.get('expensesMaster').catch(() => ({ _id: 'expensesMaster', expensesMaster: [] }));
      const expenseIds = expensesDoc.expenses.map(expense => expense._id);
      return expenseIds;
    } catch (error) {
      console.error('Error getting expense IDs:', error);
      throw new Error('Error getting expense IDs.');
    }
  };
  
  module.exports = { addExpense, editExpense, deleteExpense, getAllExpenseIds };
