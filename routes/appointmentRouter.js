const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to book an appointment
router.post('/appointments', appointmentController.createAppointment);

// Route to get all appointments for a specific patient
router.get('/appointments', appointmentController.getAppointmentsByPatient);

// Route to get all appointments for a specific doctor
router.get('/appointments/:doctor_id', appointmentController.getAppointmentsByDoctor);

// Route to update an appointment (reschedule)
router.put('/appointments/:appointment_id', appointmentController.updateAppointment);

// Route to cancel an appointment
router.delete('/appointments/:appointment_id', appointmentController.cancelAppointment);


module.exports = router;
// const express = require('express');
// const router = express.Router();
// const appointmentController = require('../controllers/appointmentController');

// // Route to book an appointment
// router.post('/appointments', appointmentController.createAppointment);

// // Route to get all appointments for a specific patient
// router.get('/appointments', appointmentController.getAppointmentsByPatient);

// // Route to get all appointments for a specific doctor
// router.get('/appointments/:doctor_id', appointmentController.getAppointmentsByDoctor);

// // Route to update an appointment (reschedule)
// router.put('/appointments/:appointment_id', appointmentController.updateAppointment);

// // Route to cancel an appointment (delete)
// router.delete('/appointments/:appointment_id', appointmentController.cancelAppointment);

// module.exports = router;
