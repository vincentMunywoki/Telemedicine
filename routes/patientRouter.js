
const express = require('express');
const {
  registerPatient,
  loginPatient,
  getAllPatientsController,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const router = express.Router();

// Route to register a new patient
router.post('/register', registerPatient);

// Route to login 
router.post('/login', loginPatient);

// Route to get all patients (Admin only) with optional search and filter
router.get('/', getAllPatientsController);

// Route to update a patient's profile
router.put('/:id', updatePatient);

// Route to delete a patient's account
router.delete('/:id', deletePatient);

// Route to log out patient
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

module.exports = router;
