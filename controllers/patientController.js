
// const bcrypt = require('bcryptjs');
// const {
//   findPatientByEmail,
  
//   insertPatient,
//   getAllPatients,
//   updatePatientById,
//   deletePatientById,
// } = require('../models/patientModel');

// // Register a new patient (CREATE)
// const registerPatient = async (req, res) => {
//   const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

//   try {
//     // Validate input fields
//     if (!first_name || !last_name || !email || !password || !phone) {
//       return res.status(400).json({ success: false, message: 'All required fields must be provided' });
//     }

//     // Check if the patient already exists
//     const existingPatient = await findPatientByEmail(email);
//     if (existingPatient.length > 0) {
//       return res.status(400).json({ success: false, message: 'Patient already exists!' });
//     }

//     // Hash password
//     const password_hash = await bcrypt.hash(password, 10);

//     // Insert the patient record into the database
//     await insertPatient({ first_name, last_name, email, password_hash, phone, date_of_birth, gender, address });

//     res.status(201).json({ success: true, message: 'Patient registered successfully!' });
//   } catch (error) {
//     console.error('Error registering patient:', error);
//     res.status(500).json({ success: false, message: 'Error registering patient', error: error.message });
//   }
// };

// // Get all patients with search and filter options (READ - Admin only)
// const getAllPatientsController = async (req, res) => {
//   const { search, gender } = req.query; // Query parameters for search and filtering
//   let query = 'SELECT * FROM patients WHERE 1=1'; // Base query
//   const params = [];

//   if (search) {
//     query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
//     params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//   }

//   if (gender) {
//     query += ' AND gender = ?';
//     params.push(gender);
//   }

//   try {
//     const patients = await getAllPatients(query, params);
//     res.status(200).json({ success: true, message: 'Patients retrieved successfully', data: patients });
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//     res.status(500).json({ success: false, message: 'Error fetching patients', error: error.message });
//   }
// };

// // Update patient profile (UPDATE)
// const updatePatient = async (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, email, phone, date_of_birth, gender, address, password } = req.body;

//   try {
//     const existingPatient = await findPatientById(id);
//     if (existingPatient.length === 0) {
//       return res.status(404).json({ success: false, message: 'Patient not found!' });
//     }

//     let updatedFields = { first_name, last_name, email, phone, date_of_birth, gender, address };

//     // If a new password is provided, hash it before updating
//     if (password) {
//       const password_hash = await bcrypt.hash(password, 10);
//       updatedFields.password_hash = password_hash;
//     }

//     await updatePatientById(id, updatedFields);

//     res.status(200).json({ success: true, message: 'Patient profile updated successfully!' });
//   } catch (error) {
//     console.error('Error updating patient:', error);
//     res.status(500).json({ success: false, message: 'Error updating patient', error: error.message });
//   }
// };

// // Delete patient account (DELETE)
// const deletePatient = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const existingPatient = await findPatientById(id);
//     if (existingPatient.length === 0) {
//       return res.status(404).json({ success: false, message: 'Patient not found!' });
//     }

//     await deletePatientById(id);
//     res.status(200).json({ success: true, message: 'Patient account deleted successfully!' });
//   } catch (error) {
//     console.error('Error deleting patient:', error);
//     res.status(500).json({ success: false, message: 'Error deleting patient', error: error.message });
//   }
// };

// module.exports = {
//   registerPatient,
//   getAllPatientsController,
//   updatePatient,
//   deletePatient,
// };
const bcrypt = require('bcryptjs');
const {
  findPatientByEmail,
  findPatientById,
  insertPatient,
  getAllPatients,
  updatePatientById,
  deletePatientById,
} = require('../models/patientModel');

// Register a new patient (CREATE)
const registerPatient = async (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

  try {
    // Validate input fields
    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // Check if the patient already exists
    const existingPatient = await findPatientByEmail(email);
    if (existingPatient.length > 0) {
      return res.status(400).json({ success: false, message: 'Patient already exists!' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert the patient record into the database
    await insertPatient({ first_name, last_name, email, password_hash, phone, date_of_birth, gender, address });

    res.status(201).json({ success: true, message: 'Patient registered successfully!' });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ success: false, message: 'Error registering patient', error: error.message });
  }
};

// Login a patient (LOGIN)
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const existingPatient = await findPatientByEmail(email);
    if (!existingPatient || existingPatient.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingPatient[0].password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Store patient information in the session
    req.session.patient = {
      id: existingPatient[0].id,
      email: existingPatient[0].email,
      name: existingPatient[0].first_name + ' ' + existingPatient[0].last_name,
    };

    res.status(200).json({ success: true, message: 'Login successful', patient: existingPatient[0] });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Error during login', error: error.message });
  }
};

// Get all patients with search and filter options (READ - Admin only)
const getAllPatientsController = async (req, res) => {
  const { search, gender } = req.query; // Query parameters for search and filtering
  let query = 'SELECT * FROM patients WHERE 1=1'; // Base query
  const params = [];

  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (gender) {
    query += ' AND gender = ?';
    params.push(gender);
  }

  try {
    const patients = await getAllPatients(query, params);
    res.status(200).json({ success: true, message: 'Patients retrieved successfully', data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Error fetching patients', error: error.message });
  }
};

// Update patient profile (UPDATE)
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, date_of_birth, gender, address, password } = req.body;

  try {
    const existingPatient = await findPatientById(id);
    if (existingPatient.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found!' });
    }

    let updatedFields = { first_name, last_name, email, phone, date_of_birth, gender, address };

    // If a new password is provided, hash it before updating
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      updatedFields.password_hash = password_hash;
    }

    await updatePatientById(id, updatedFields);

    res.status(200).json({ success: true, message: 'Patient profile updated successfully!' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ success: false, message: 'Error updating patient', error: error.message });
  }
};

// Delete patient account (DELETE)
const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPatient = await findPatientById(id);
    if (existingPatient.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found!' });
    }

    await deletePatientById(id);
    res.status(200).json({ success: true, message: 'Patient account deleted successfully!' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ success: false, message: 'Error deleting patient', error: error.message });
  }
};

module.exports = {
  registerPatient,
  loginPatient,  // Added loginPatient function
  getAllPatientsController,
  updatePatient,
  deletePatient,
};
