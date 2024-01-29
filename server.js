const express = require('express');
const PouchDB = require('pouchdb');
const expressPouchDB = require('express-pouchdb');
const basicAuth = require('express-basic-auth');
const cors = require('cors'); // Add this line to use the 'cors' middleware
const app = express();
const port = 3000;
const patientOperations = require('./patientController');
const billingOperations = require('./diagnosticBillingInfo');
const hospitalOperations = require('./hospitalController');
const doctorOperations = require('./doctorsController');
const DiagLabTypeOperations = require('./diagMasterLabType');
const DiagLabTypeCaOperations = require('./diagMasterLabTypeCa');
const RegionOperations = require('./region');
const ExpenseOperations = require('./expenses');
const ModesOfPaymentOperations = require('./modesOfPayment');

// const localDBCredentials = {
//     username: 'admin',
//     password: 'admin',
//   };

// Set your CouchDB credentials
const remoteDBCredentials = {
    username: 'admin',
    password: 'yds2024',
  };

// Create PouchDB instances
const pouchDB = new PouchDB('localdb');
const remoteDB = new PouchDB(`http://${remoteDBCredentials.username}:${remoteDBCredentials.password}@ec2-44-201-160-122.compute-1.amazonaws.com:5984/ydc`);


// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Enable CORS for PouchDB
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Use express-pouchdb for endpoints
app.use('/localdb', expressPouchDB(PouchDB));

app.use('/remotedb', expressPouchDB(remoteDB));



let replicationStarted = false;

app.post('/addPatient', async (req, res) => {
  try {
    const { name, age , orgid, salutation, firstname, lastname, middlename, email, phone, aadhar_number,
      whatsappno, workphone, address, region, city, state, country, dateofbirth, doctorid, 
      assigneddoctorid, secondarydoctorids, gender, maritalStatus, preferredmethodofContact, 
      inoutpatient, pre_existing_conditions, allergies, emergencycontactname, emergencycontactphone, 
      emergencycontactrelationship, admissiondate, bloodgroup, referredby, createdat, updatedat } = req.body;

      if (!name || !age || !orgid || !salutation || !firstname || !lastname || !middlename || !email 
        || !phone || !aadhar_number || !whatsappno || !workphone || !address || !region || !city || !state || !country 
        || !dateofbirth || !doctorid || !assigneddoctorid || !secondarydoctorids || !gender 
        || !maritalStatus || !preferredmethodofContact || !inoutpatient || !pre_existing_conditions 
        || !allergies || !emergencycontactname || !emergencycontactphone || !emergencycontactrelationship
        || !admissiondate || !bloodgroup || !referredby || !createdat || !updatedat) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      
        const patientDetails = req.body;
        const response = await patientOperations.addPatient(patientDetails);
        res.json(response);
      } catch (error) {
        console.error('Error adding patient details:', error);
        res.status(500).json({ error: 'Error adding patient details.' });
      }
    });


    

      // const patientDetails = req.body;

      

//     const newPatient = {
//       _id: `patient${Date.now()}`,
//       name,
//       age,
//       orgid,
//       salutation,
//       firstname,
//       lastname,
//       middlename,
//       email,
//       phone,
//       whatsappno,
//       workphone,
//       address,
//       region,
//       city,
//       state,
//       country,
//       dateofbirth,
//       doctorid,
//       assigneddoctorid,
//       secondarydoctorids,
//       gender,
//       maritalStatus,
//       preferredmethodofContact,
//       inoutpatient,
//       pre_existing_conditions,
//       allergies,
//       emergencycontactname,
//       emergencycontactphone,
//       emergencycontactrelationship,
//       admissiondate,
//       bloodgroup,
//       referredby,
//       createdat,
//       updatedat
//     };

//     // const response = await pouchDB.put(newPatient);

    

    

//     const patientsDoc = await pouchDB.get('patients').catch(() => ({ _id: 'patients', patients: [] }));

    
//     // Add the new patient details to the 'patients' array
//     // patientsDoc.patients.push(patientDetails);

//     patientsDoc.patients.push(newPatient);

//     // Save the updated 'patients' document back to the database
//     const response = await pouchDB.put(patientsDoc);

//     res.json(response);
//   } catch (error) {
//     console.error('Error adding patient details:', error);
//     res.status(500).json({ error: 'Error adding patient details.' });
//   }
// });




// pouchDB.bulkDocs([
//   patients =
//     {
//       _id: 'patientid3',
//       name: 'johnny doe',
//       age: '32',
//     },
//     {
//       _id: 'patient4',
//       name: 'jannny doe',
//       age: '32',
//     },
//     // {
//     //   _id: 'collection1',
//     //   name: 'Sample Collection 1',
//     //   type: 'collection',
//     // },
//   ])
//     .then(response => {
//       console.log('Sample data added to local database:', response);
//     })
//     .catch(error => {
//       console.error('Error adding sample data to local database:', error);
//     });


    // Replicate changes from CouchDB to local PouchDB
// const replicationFromOptions = {
//     live: true,
//     retry: true,
//     // auth: {
//     //   username: 'admin',
//     //   password: 'admin',
//     // },
//   };

function shouldReplicate(doc) {
  // Replace this logic with your custom criteria
  return doc && doc.YDC && doc.YDC.orgid === '1';
}

// const replicationFromOptions = {
//   live: true,
//   retry: true,
//   filter: function (doc) {
//     // Replace "billingInfoMasterSchema" with the specific _id you want to exclude
//     return doc._id !== "hospital1705766257490";
//   },
//   query_params: { key: 'value' } // Optional parameters for the filter function
// };

// const replicationFromOptions = {
//   live: true,
//   retry: true,
//   filter: function(doc, req) {
//     // if (doc.YDC && doc.YDC.orgid === '1') {
//     //   log('Document replicated:', doc._id);
//     //   return true;
//     // } else {
//     //   log('Document not replicated:', doc._id);
//     //   return false;
//     // }
    

//     return doc._id === 'regionsMaster'
    
//   }
//   // .toString(),
//   // query_params: { id: 'Hospital0' } // Optional parameters for the filter function
// };

const replicationFromOptions = {
  live: true,
  retry: true,
  filter: (doc) => shouldReplicate(doc)
};





  const remoteCouchDBURL = 'http://admin:yds2024@ec2-44-201-160-122.compute-1.amazonaws.com:5984/ydc';

  const replicationFromHandler = pouchDB.replicate.from(remoteCouchDBURL, replicationFromOptions);

replicationFromHandler
  .on('change', info => {
    console.log('Replication from CouchDB change:', info);
  })
  .on('paused', info => {
    console.log('Replication from CouchDB paused:', info);
  })
  .on('active', info => {
    console.log('Replication from CouchDB active:', info);
  })
  .on('denied', err => {
    console.error('Replication from CouchDB denied:', err);
  })
  .on('complete', info => {
    console.log('Replication from CouchDB complete:', info);
  })
  .on('error', err => {
    console.error('Replication from CouchDB error:', err);
  });

// Replicate changes from localdb to remotedb
// function startReplication() {
//   if (!replicationStarted) {
//     const replication = pouchDB.replicate.to(remoteDB, { live: true, retry: true });

//     replication
//       .on('change', info => {
//         console.log('Replication change:', info);
//       })
//       .on('paused', info => {
//         console.log('Replication paused:', info);
//       })
//       .on('active', info => {
//         console.log('Replication active:', info);
//       })
//       .on('denied', err => {
//         console.error('Replication denied:', err);
//       })
//       .on('complete', info => {
//         console.log('Replication complete:', info);
//       })
//       .on('error', err => {
//         console.error('Replication error:', err);
//       });

//     replicationStarted = true;
//   }
// }

// Endpoint to edit patient details
app.put('/editPatient/:patientId', async (req, res) => {
  try {
    const { name, age , orgid, salutation, firstname, lastname, middlename, email, phone, aadhar_number,
      whatsappno, workphone, address, region, city, state, country, dateofbirth, doctorid, 
      assigneddoctorid, secondarydoctorids, gender, maritalStatus, preferredmethodofContact, 
      inoutpatient, pre_existing_conditions, allergies, emergencycontactname, emergencycontactphone, 
      emergencycontactrelationship, admissiondate, bloodgroup, referredby, createdat, updatedat} = req.body;
    
      const { patientId } = req.params;

    if (!name || !age || !orgid || !salutation || !firstname || !lastname || !middlename || !email 
        || !phone || !aadhar_number || !whatsappno || !workphone || !address || !region || !city || !state || !country 
        || !dateofbirth || !doctorid || !assigneddoctorid || !secondarydoctorids || !gender 
        || !maritalStatus || !preferredmethodofContact || !inoutpatient || !pre_existing_conditions 
        || !allergies || !emergencycontactname || !emergencycontactphone || !emergencycontactrelationship
        || !admissiondate || !bloodgroup || !referredby || !createdat || !updatedat ) {
      return res.status(400).json({ error: 'Name and age are required fields.' });
    }

    
    // Fetch the existing patient details from the database
    // const existingPatient = await pouchDB.get(patientId);

    // Update the patient details
    // const updatedPatient = {
    //   // ...existingPatient,
    //   name,
    //   age,
    //   orgid,
    //   salutation,
    //   firstname,
    //   lastname,
    //   middlename,
    //   email,
    //   phone,
    //   whatsappno,
    //   workphone,
    //   address,
    //   region,
    //   city,
    //   state,
    //   country,
    //   dateofbirth,
    //   doctorid,
    //   assigneddoctorid,
    //   secondarydoctorids,
    //   gender,
    //   maritalStatus,
    //   preferredmethodofContact,
    //   inoutpatient,
    //   pre_existing_conditions,
    //   allergies,
    //   emergencycontactname,
    //   emergencycontactphone,
    //   emergencycontactrelationship,
    //   admissiondate,
    //   bloodgroup,
    //   referredby,
    //   createdat,
    //   updatedat

    // };

    const updatedPatientDetails = req.body;
    const response = await patientOperations.editPatient(patientId, updatedPatientDetails);
    res.json(response);
  } catch (error) {
    console.error('Error editing patient details:', error);
    res.status(500).json({ error: 'Error editing patient details.' });
  }
});

    
//     // Fetch the existing 'patients' document or return an error if it doesn't exist
//     const patientsDoc = await pouchDB.get('patients').catch(() => {
//       return res.status(404).json({ error: 'Patients document not found.' });
//     });

//     //  Find the patient with the specified ID in the 'patients' array
//     const patientToUpdate = patientsDoc.patients.find(patient => patient._id === patientId);

//     // If the patient is not found, return an error
//     if (!patientToUpdate) {
//       return res.status(404).json({ error: 'Patient not found.' });
//     }

//     // Update the patient details in the 'patients' array
//     patientsDoc.patients = patientsDoc.patients.map(patient =>
//       patient._id === patientId ? { ...patient, ...updatedPatient } : patient
//     );

//     // Save the updated 'patients' document back to the database
//     // const response = await pouchDB.put(patientsDoc);


//     // Save the updated 'patients' document back to the database
//     const response = await pouchDB.put(patientsDoc);

//     res.json(response);
//   } catch (error) {
//     console.error('Error editing patient details:', error);
//     res.status(500).json({ error: 'Error editing patient details.' });
//   }
// });

// Endpoint to delete a patient
app.delete('/deletePatient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const response = await patientOperations.deletePatient(patientId);
    res.json(response);
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Error deleting patient.' });
  }
});

// BilligInfo

app.post('/addBillingInfo', async (req, res) => {
  try {
    const billingInfo = req.body;
    const response = await billingOperations.addBillingInfo(billingInfo);
    res.json(response);
  } catch (error) {
    console.error('Error adding billing information:', error);
    res.status(500).json({ error: 'Error adding billing information.' });
  }
});

// HospitalInfo

app.post('/addHospital', async (req, res) => {
  try {
    const { name, address, region, city, state, country, createdat, updatedat, email, phone, createdby, updatedby, hospitalshortname } = req.body;

    // console.log('Received hospital details:', req.body);

   

    const hospitalDetails = req.body;
    const response = await hospitalOperations.addHospital(hospitalDetails);
    res.json(response);
  } catch (error) {
    console.error('Error adding hospital details:', error);
    res.status(500).json({ error: 'Error adding hospital details.' }); // Ensure res is defined here
  }
});

app.put('/editHospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { name, address, region, city, state, country, createdat, updatedat, email, phone, createdby,
      updatedby, hospitalshortname } = req.body;
    const updatedDetails = req.body;
    const response = await hospitalOperations.editHospital(hospitalId, updatedDetails);

    if (response.error) {
      return res.status(404).json({ error: response.error });
    }

    res.json({ success: true, message: response.message });
  } catch (error) {
    console.error('Error editing hospital details:', error);
    res.status(500).json({ error: 'Error editing hospital details.' });
  }
});

app.delete('/deleteHospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const response = await hospitalOperations.deleteHospital(hospitalId);
    res.json(response);
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ error: 'Error deleting hospital.' });
  }
});


// DoctorsInfo

app.post('/addDoctor', async (req, res) => {
  try {
    const { name, nickname, specialization , contact_number, countrycode, hospital_id, email, address, 
      region, city, state, country, registrationid, createdat, createdby, updatedat, updatedby } = req.body;

      // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
      //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
      //   || !createdby || !updatedat || !updatedby) {
      //   return res.status(400).json({ error: 'All fields are required.' });
      // }

      
        const doctorDetails = req.body;
        const response = await doctorOperations.addDoctor(doctorDetails);
        res.json(response);
      } catch (error) {
        console.error('Error adding doctor details:', error);
        res.status(500).json({ error: 'Error adding doctor details.' });
      }
    });

    // DiagnosticLabTypeInfo


    app.post('/addDiagLabType', async (req, res) => {
      try {
        const { dept, labtype, show_in_ui } = req.body;
    
          // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
          //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
          //   || !createdby || !updatedat || !updatedby) {
          //   return res.status(400).json({ error: 'All fields are required.' });
          // }
    
          
            const DiagLabTypeDetails = req.body;
            const response = await DiagLabTypeOperations.addDiagLabType(DiagLabTypeDetails);
            res.json(response);
          } catch (error) {
            console.error('Error adding DiagLabType details:', error);
            res.status(500).json({ error: 'Error adding DiagLabType details.' });
          }
        });

    // DiagnosticLabTypeCategoriesInfo

        app.post('/addDiagLabTypeCa', async (req, res) => {
          try {
            const { diagnostic_lab_type_id, code, name , rate, currrencytype, doctor_commission_in_percentage,
               doctor_commission_in_currency, show_in_ui, createdat, createdby, updatedat, updatedby } = req.body;
        
              // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
              //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
              //   || !createdby || !updatedat || !updatedby) {
              //   return res.status(400).json({ error: 'All fields are required.' });
              // }
        
              
                const DiagLabTypeCaDetails = req.body;
                const response = await DiagLabTypeCaOperations.addDiagLabTypeCa(DiagLabTypeCaDetails);
                res.json(response);
              } catch (error) {
                console.error('Error adding DiagLabTypeCa details:', error);
                res.status(500).json({ error: 'Error adding DiagLabTypeCa details.' });
              }
            });


    // Regions


        app.post('/addRegion', async (req, res) => {
          try {
            const { region_name, region_shortname,  createdat, createdby, updatedat, updatedby } = req.body;
        
              // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
              //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
              //   || !createdby || !updatedat || !updatedby) {
              //   return res.status(400).json({ error: 'All fields are required.' });
              // }
        
              
                const regionDetails = req.body;
                const response = await RegionOperations.addRegion(regionDetails);
                res.json(response);
              } catch (error) {
                console.error('Error adding region details:', error);
                res.status(500).json({ error: 'Error adding region details.' });
              }
            });

    // Expenses

            app.post('/addExpense', async (req, res) => {
              try {
                const { categoryname } = req.body;
            
                  // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
                  //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
                  //   || !createdby || !updatedat || !updatedby) {
                  //   return res.status(400).json({ error: 'All fields are required.' });
                  // }
            
                  
                    const expenseDetails = req.body;
                    const response = await ExpenseOperations.addExpense(expenseDetails);
                    res.json(response);
                  } catch (error) {
                    console.error('Error adding expens details:', error);
                    res.status(500).json({ error: 'Error adding expense details.' });
                  }
                });


    // ModesOfPayment

            app.post('/addModesOfPayment', async (req, res) => {
              try {
                const { paymentmode } = req.body;
            
                  // if (!name || !nickname || !specialization || !contact_number || !countrycode || !hospital_id || !email 
                  //   || !address || !region || !city || !state || !country || !registrationid || !createdat 
                  //   || !createdby || !updatedat || !updatedby) {
                  //   return res.status(400).json({ error: 'All fields are required.' });
                  // }
            
                  
                    const modesOfPaymentDetails = req.body;
                    const response = await ModesOfPaymentOperations.addModesOfPayment(modesOfPaymentDetails);
                    res.json(response);
                  } catch (error) {
                    console.error('Error adding modesOfPayment details:', error);
                    res.status(500).json({ error: 'Error adding modesOfPayment details.' });
                  }
                });
            



// Ensure replication is started only once
// startReplication();

app.get('/viewDocuments', async (req, res) => {
    try {
      const allDocs = await pouchDB.allDocs({ include_docs: true });
      res.json(allDocs);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving documents' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
