// // patientModel.js
// const db = require('../config/db');
// const bcrypt = require('bcryptjs');
// // const { findPatientByEmail } = require('./models/patientModel');

// // Function to check if a patient exists by email
// const findPatientByEmail = async (email) => {
//   const [result] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
//   return result;
// };

// // Function to find a patient by ID
// const findPatientById = async (id) => {
//   const [result] = await db.execute('SELECT * FROM patients WHERE id = ?', [id]);
//   return result;
// };

// // Function to register a new patient
// const insertPatient = async (patientData) => {
//   const { first_name, last_name, email, password_hash, phone, date_of_birth, gender, address } = patientData;
//   await db.execute(
//     'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//     [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address]
//   );
// };

// // Function to get all patients with optional search and filtering
// const getAllPatients = async (query, params) => {
//   const [result] = await db.execute(query, params);
//   return result;
// };

// // Function to update a patient record
// const updatePatientById = async (id, patientData) => {
//   const { first_name, last_name, email, phone, date_of_birth, gender, address } = patientData;
//   await db.execute(
//     'UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
//     [first_name, last_name, email, phone, date_of_birth, gender, address, id]
//   );
// };

// // Function to delete a patient by ID
// const deletePatientById = async (id) => {
//   await db.execute('DELETE FROM patients WHERE id = ?', [id]);
// };

// module.exports = {
//   findPatientByEmail,
//   findPatientById,
//   insertPatient,
//   getAllPatients,
//   updatePatientById,
//   deletePatientById,,
// };
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Function to check if a patient exists by email
const findPatientByEmail = async (email) => {
  const [result] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
  // If no patient is found, return null
  return result.length > 0 ? result[0] : null;
};

// Function to find a patient by ID
const findPatientById = async (id) => {
  const [result] = await db.execute('SELECT * FROM patients WHERE id = ?', [id]);
  // Return null if no patient is found
  return result.length > 0 ? result[0] : null;
};

// Function to register a new patient
const insertPatient = async (patientData) => {
  const { first_name, last_name, email, password_hash, phone, date_of_birth, gender, address } = patientData;
  await db.execute(
    'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address]
  );
};

// Function to get all patients with optional search and filtering
const getAllPatients = async (query, params) => {
  const [result] = await db.execute(query, params);
  return result;
};

// Function to update a patient record
const updatePatientById = async (id, patientData) => {
  const { first_name, last_name, email, phone, date_of_birth, gender, address } = patientData;
  await db.execute(
    'UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
    [first_name, last_name, email, phone, date_of_birth, gender, address, id]
  );
};

// Function to delete a patient by ID
const deletePatientById = async (id) => {
  await db.execute('DELETE FROM patients WHERE id = ?', [id]);
};

// Optional: Function to check if the provided password matches the hashed password in the database
const validatePassword = async (inputPassword, storedPasswordHash) => {
  return bcrypt.compare(inputPassword, storedPasswordHash);
};

module.exports = {
  findPatientByEmail,
  findPatientById,
  insertPatient,
  getAllPatients,
  updatePatientById,
  deletePatientById,
  validatePassword, // Exported for use in login
};
