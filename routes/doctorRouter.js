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
// const express = require('express');
// const doctorController = require('../controllers/doctorController');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// // Import specific functions if not using `doctorController` directly
// const { deleteDoctor, getDoctorAppointments } = doctorController;

// // Doctor registration and login
// router.post('/create', doctorController.addDoctor);
// router.post('/login', doctorController.loginDoctor);

// // Get all doctors - used for populating dropdown in appointments
// router.get('/', async (req, res) => {
//     try {
//         const doctors = await doctorController.getAllDoctors();
//         res.json(doctors);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch doctors' });
//     }
// });

// // Doctor-specific routes
// router.put('/:id', doctorController.updateDoctor);                // Update doctor profile or schedule
// router.delete('/:id', authMiddleware.verifyToken, deleteDoctor);  // Delete doctor (Admin only)

// // Get doctor appointments (requires authentication)
// router.get('/:id/appointments', authMiddleware.verifyToken, getDoctorAppointments);

// // Delete an appointment (requires authentication)
// router.delete('/appointments/:appointmentId', authMiddleware.verifyToken, doctorController.deleteAppointment);

// module.exports = router;
