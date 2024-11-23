
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.createDoctor = async (req, res) => {
    try {
        const doctorId = await Doctor.create(req.body);
        res.status(201).json({ message: 'Doctor created successfully', doctorId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating doctor' });
    }
};

exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
        const doctor = await Doctor.findByEmail(email);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

        const isValidPassword = await Doctor.validatePassword(password, doctor.password);
        if (!isValidPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: doctor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Add a new doctor (Admin only)
exports.addDoctor = async (req, res) => {
    const { first_name, last_name, email, phone,specialization, schedule, password } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !phone || !specialization || !schedule || !password) {
        return res.status(400).json({ message: 'All fields are required: first_name, last_name, email, phone ,specialization, schedule, password ' });
    }

    try {
        // Insert new doctor into the database
        await db.execute(
            'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, schedule, password]
        );
        res.status(201).json({ message: 'Doctor added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding doctor', error: error.message });
    }
};

//Get all doctors with specialization and availability
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.execute('SELECT * FROM doctors');
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
    }
};
// doctorController.js
// exports.getAllDoctors = async (req, res) => {
//     try {
//         const [doctors] = await db.execute('SELECT id, first_name, last_name, specialization FROM doctors');
//         res.status(200).json(doctors);
//     } catch (error) {
//         console.error('Error retrieving doctors:', error);
//         res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
//     }
// };


// Update doctor's profile or schedule
exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, specialization, schedule } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required: first_name, last_name, email, phone' });
    }

    try {
        // Check if the doctor exists
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE id = ?', [id]);
        if (!doctor || doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Update doctor's profile
        await db.execute(
            'UPDATE doctors SET first_name = ?, last_name = ?, email = ?, phone = ?, specialization = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, email, phone, specialization, schedule, id]
        );
        res.status(200).json({ message: 'Doctor profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
    }
};

// Delete doctor (Admin only)
exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the doctor exists
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE id = ?', [id]);
        if (!doctor || doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Delete the doctor from the database
        await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
        res.status(200).json({ message: 'Doctor profile deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting doctor profile', error: error.message });
    }
};

// In doctorController.js

// Get appointments for the logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
    const doctorId = req.user.id; // Assuming you're using JWT authentication middleware

    try {
        const [appointments] = await db.execute('SELECT * FROM appointments WHERE doctor_id = ?', [doctorId]);
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
    }
};

// In doctorController.js

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params; // The appointment ID to delete

    try {
        await db.execute('DELETE FROM appointments WHERE id = ?', [appointmentId]);
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting appointment', error: error.message });
    }
};
