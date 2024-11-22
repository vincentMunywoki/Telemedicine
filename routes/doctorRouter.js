const express = require('express');
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const router = express.Router();
const { deleteDoctor, getDoctorAppointments } = require('../controllers/doctorController');


router.post('/create', doctorController.addDoctor);

router.post('/login', doctorController.loginDoctor);

router.get('/appointments', authMiddleware.verifyToken, doctorController.getDoctorAppointments);

router.delete('/api/doctor/:id', deleteDoctor);

router.get('/:id/appointments', getDoctorAppointments);

// Add a new doctor (Admin only)
router.post('/add', doctorController.addDoctor);

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Update doctor profile or schedule
router.put('/:id', doctorController.updateDoctor);

// Delete doctor (Admin only)
router.delete('/:id', doctorController.deleteDoctor);

// Get appointments (requires authentication)
router.get('/appointments', authMiddleware.verifyToken, doctorController.getDoctorAppointments);

router.delete('/appointments/:appointmentId', authMiddleware.verifyToken, doctorController.deleteAppointment);

module.exports = router;