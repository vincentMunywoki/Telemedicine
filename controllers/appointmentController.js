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
    const [result] = await db.execute('INSERT INTO appointments (patient_name, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)', 
                                       [patient_name, doctor_id, appointment_date, appointment_time, status]);

    // Respond with success message and appointment details
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: result.insertId,
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
  try {
    const { appointment_id } = req.params;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ message: 'Both new date and time are required' });
    }

    // Check if the appointment exists
    const [existingAppointment] = await db.execute('SELECT * FROM appointments WHERE id = ?', [appointment_id]);
    if (existingAppointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment
    const query = 'UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?';
    await db.execute(query, [newDate, newTime, appointment_id]);

    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Error rescheduling appointment', error });
  }
};


exports.cancelAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    // Check if the appointment exists
    const [existingAppointment] = await db.execute('SELECT * FROM appointments WHERE id = ?', [appointment_id]);
    if (existingAppointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Delete the appointment
    const query = 'DELETE FROM appointments WHERE id = ?';
    await db.execute(query, [appointment_id]);

    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Error canceling appointment', error });
  }
};
