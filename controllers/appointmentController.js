const db = require('../config/db');

exports.createAppointment = async (req, res) => {
  try {
    const { patient_name, doctor_id, appointment_date, appointment_time, status } = req.body;

    // Ensure all required fields are provided
    if (!patient_name || !doctor_id || !appointment_date || !appointment_time || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure the doctor exists
    const [doctor] = await db.execute('SELECT * FROM doctors WHERE id = ?', [doctor_id]);
    if (doctor.length === 0) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    // Insert the new appointment into the database
    const [result] = await db.execute('INSERT INTO appointments (patient_name, doctor_id, appointment_date, appointment_time, status) VALUES ( ?, ?, ?, ?, ?)', 
                                       [ patient_name, doctor_id, appointment_date, appointment_time, status]);

    // Respond with success message and appointment details
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: result.insertId,
        // patient_id,
        patient_name,
        doctor_id,
        appointment_date,
        appointment_time,
        status
      }
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const { patient_name } = req.body; // Assuming patient_name is passed in the body

    if (!patient_name) {
      return res.status(400).json({ message: 'Patient name is required' });
    }

    // Get appointments for the patient based on patient_name
    const query = 'SELECT * FROM appointments WHERE patient_name = ?';
    const [appointments] = await db.execute(query, [patient_name]);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};


exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const query = 'SELECT * FROM appointments WHERE doctor_id = ?';
    const [appointments] = await db.execute(query, [doctor_id]);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};


exports.updateAppointment = async (req, res) => {
    const appointmentId = req.params.appointment_id;
    const { appointment_date, appointment_time } = req.body;

    if (!appointmentId || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update the appointment details
        appointment.appointment_date = appointment_date;
        appointment.appointment_time = appointment_time;

        // Save the updated appointment
        await appointment.save();

        res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error while updating appointment' });
    }
};


// In appointmentController.js
exports.cancelAppointment = async (req, res) => {
    const appointmentId = req.params.appointment_id; // Get the appointment ID from the URL parameter

    if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }

    try {
        // Using MySQL to delete the appointment
        const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);

        // Check if the appointment was found and deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        return res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({ message: 'Failed to delete appointment' });
    }
};


// Create a new appointment
// exports.createAppointment = (req, res) => {
//     const { patient_name, doctor_id, appointment_date, appointment_time } = req.body;

//     if (!patient_name || !doctor_id || !appointment_date || !appointment_time) {
//         return res.status(400).json({ message: 'All fields are required!' });
//     }

//     const query = 'INSERT INTO appointments (patient_name, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, "scheduled")';
//     db.execute(query, [patient_name, doctor_id, appointment_date, appointment_time], (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error creating appointment', error });
//         }
//         res.status(201).json({ message: 'Appointment booked successfully', appointment: results.insertId });
//     });
// };

// // Get appointments by patient
// exports.getAppointmentsByPatient = (req, res) => {
//     const patient_id = req.query.patient_id; // Assuming patient_id is passed in query params

//     const query = 'SELECT * FROM appointments WHERE patient_id = ?';
//     db.execute(query, [patient_id], (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error fetching appointments', error });
//         }
//         res.status(200).json({ appointments: results });
//     });
// };

// // Get appointments by doctor
// exports.getAppointmentsByDoctor = (req, res) => {
//     const doctor_id = req.params.doctor_id;

//     const query = 'SELECT * FROM appointments WHERE doctor_id = ?';
//     db.execute(query, [doctor_id], (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error fetching appointments', error });
//         }
//         res.status(200).json({ appointments: results });
//     });
// };

// // Update an appointment (reschedule)
// exports.updateAppointment = (req, res) => {
//     const { appointment_id } = req.params;
//     const { appointment_date, appointment_time } = req.body;

//     if (!appointment_date || !appointment_time) {
//         return res.status(400).json({ message: 'Appointment date and time are required' });
//     }

//     const query = 'UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?';
//     db.execute(query, [appointment_date, appointment_time, appointment_id], (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error updating appointment', error });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: 'Appointment not found' });
//         }
//         res.status(200).json({ message: 'Appointment rescheduled successfully' });
//     });
// };

// // Cancel an appointment (delete)
// exports.cancelAppointment = (req, res) => {
//     const { appointment_id } = req.params;

//     const query = 'DELETE FROM appointments WHERE id = ?';
//     db.execute(query, [appointment_id], (error, results) => {
//         if (error) {
//             return res.status(500).json({ message: 'Error deleting appointment', error });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: 'Appointment not found' });
//         }
//         res.status(200).json({ message: 'Appointment deleted successfully' });
//     });
// };