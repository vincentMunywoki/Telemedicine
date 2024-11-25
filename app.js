
// const express = require('express');
// const path = require('path');
// const db = require('./config/db');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const cors = require('cors');
// const jsonwebtoken= require("jsonwebtoken");
// const bcrypt = require('bcrypt');

// // Import routers
// const patientRouter = require('./routes/patientRouter');

// // Initialization
// const app = express();
// dotenv.config();

// // Middleware setup
// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session configuration
// const sessionStore = new MySQLStore({}, db);
// app.use(session({
//     secret: 'gdy3uey3yey833y8ueeye',
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {secure: false }
            
// }));

// // Serve the main page
// app.get('/index.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// let patients = [];



// app.post('/telemedicine/api/patients/create', (req, res) => {
//     const { first_name, last_name, email, phone, password, date_of_birth, gender, address } = req.body;

//     // Check if all required fields are provided
//     if (!first_name || !last_name || !email || !password || !date_of_birth || !gender || !address) {
//         return res.status(400).json({ error: 'Required fields are missing' });
//     }

//     // Check if a patient already exists with the same email
//     const existingPatient = patients.find(patient => patient.email === email);
//     if (existingPatient) {
//         return res.status(400).json({ error: 'Patient with this email already exists' });
//     }

//     // Create a new patient
//     const newPatient = {
//         firstName: first_name,
//         lastName: last_name,
//         email,
//         phone,
//         password, // NOTE: Make sure to hash the password in a real-world application
//         dateOfBirth: date_of_birth,
//         gender,
//         address,
//     };

    // Save new patient to the "database" (here, it's just an array in memory)
    patients.push(newPatient);

    // Optionally, set a session to mock user authentication
    req.session.patient = { firstName: first_name, lastName: last_name, email };

    // Respond with success and the newly created patient data
    res.status(201).json({
        message: 'Patient created successfully',
        patient: {
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            dateOfBirth: date_of_birth,
            gender,
            address
        }
//     });
// });


// app.post('/telemedicine/api/patients/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const existingPatient = await findPatientByEmail(email);
//     if (!existingPatient) {
//         return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     const passwordMatch = await bcrypt.compare(password, existingPatient.password_hash);
//     if (!passwordMatch) {
//         return res.status(400).json({ error: 'Invalid email or password' });
//     }

//     req.session.patient = { email };
//     res.status(200).json({ message: 'Login successful', patient: existingPatient });
// });



// // Endpoint to handle patient profile updates
// app.put('/telemedicine/api/patients/update', (req, res) => {
//     const { first_name, last_name, email, phone, dateOfBirth, gender, address, password } = req.body;

//     // Mock response to simulate database update logic
//     const patientIndex = patients.findIndex(patient => patient.email === email);

//     if (patientIndex === -1) {
//         return res.status(404).json({ message: 'Patient not found' });
//     }

//     // Update patient data
//     const updatedPatient = { ...patients[patientIndex], firstName, lastName, email, phone, dateOfBirth, gender, address, password };

//     patients[patientIndex] = updatedPatient;

//     // Log for debugging
//     console.log('Patient updated:', updatedPatient);

//     // Respond with success message
//     res.status(200).json({ message: 'Patient profile updated successfully', patient: updatedPatient });
// });

// // Patient logout route
// app.post('/telemedicine/api/patients/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to log out' });
//         }
//         res.status(200).json({ message: 'Logout successful' });
//     });
// });

// // Use existing routers for other functionalities
// app.use('/telemedicine/api/patients', patientRouter);

// // Serve additional HTML pages
// app.get('/patient.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'patient.html')));

// // Define a port
// const PORT = 2022;

// // Launch the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://127.0.0.1:${PORT}`);
// });
const express = require('express');
const path = require('path');
const db = require('./config/db');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Import routers
const patientRouter = require('./routes/patientRouter');
const doctorRouter = require('./routes/doctorRouter');
const appointmentRouter = require('./routes/appointmentRouter');

// Initialization
const app = express();
dotenv.config();

// Middleware setup
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionStore = new MySQLStore({}, db);
app.use(session({
    secret: 'gdy3uey3yey833y8ueeye',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve the main page
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/doctor.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor.html'));
});

// Assume the 'patients' array is a placeholder for a DB in this demo
let patients = [];

// Helper function to find a patient by email (you should replace this with a DB query)
async function findPatientByEmail(email) {
    return patients.find(patient => patient.email === email); // Replace with DB query
}

// Patient Registration Route
app.post('/telemedicine/api/patients/create', async (req, res) => {
    const { first_name, last_name, email, phone, password, date_of_birth, gender, address } = req.body;

    // Check if all required fields are provided
    if (!first_name || !last_name || !email || !password || !date_of_birth || !gender || !address) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Check if a patient already exists with the same email
    const existingPatient = await findPatientByEmail(email);
    if (existingPatient) {
        return res.status(400).json({ error: 'Patient with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new patient object
    const newPatient = {
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
        password: hashedPassword, // Store hashed password
        dateOfBirth: date_of_birth,
        gender,
        address,
    };

    // Save new patient to the "database" (here, it's just an array in memory)
    patients.push(newPatient);

    // Optionally, set a session to mock user authentication
    req.session.patient = { email };

    // Respond with success and the newly created patient data
    res.status(201).json({
        message: 'Patient created successfully',
        patient: {
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            dateOfBirth: date_of_birth,
            gender,
            address
        }
    });
});

// Patient Login Route
app.post('/telemedicine/api/patients/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingPatient = await findPatientByEmail(email);
    if (!existingPatient) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, existingPatient.password);
    if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    req.session.patient = { email };
    res.status(200).json({ message: 'Login successful', patient: existingPatient });
});

// Endpoint to handle patient profile updates
app.put('/telemedicine/api/patients/update', (req, res) => {
    const { first_name, last_name, email, phone, dateOfBirth, gender, address, password } = req.body;

    // Mock response to simulate database update logic
    const patientIndex = patients.findIndex(patient => patient.email === email);

    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Patient not found' });
    }

    // Update patient data
    const updatedPatient = { 
        ...patients[patientIndex], 
        firstName: first_name, 
        lastName: last_name, 
        email, 
        phone, 
        dateOfBirth, 
        gender, 
        address, 
        password 
    };

    // If the password is being updated, hash it
    if (password) {
        updatedPatient.password = bcrypt.hashSync(password, 10);
    }

    patients[patientIndex] = updatedPatient;

    // Log for debugging
    console.log('Patient updated:', updatedPatient);

    // Respond with success message
    res.status(200).json({ message: 'Patient profile updated successfully', patient: updatedPatient });
});

// Patient Logout Route
app.post('/telemedicine/api/patients/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Doctor registration route
app.post('/telemedicine/api/doctors/register', (req, res) => {
    const { first_name, last_name, email, phone, specialization, schedule, password } = req.body;

    if (!first_name || !last_name || !email || !phone || !specialization || !schedule || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Simulating doctor registration (store in an array or database)
    const newDoctor = {
        first_name,
        last_name,
        email,
        phone,
        specialization,
        schedule,
        password // In a real app, use hashing for password
    };

    // Save the new doctor to the database or in-memory store
    doctors.push(newDoctor); // Assume doctors is your in-memory array or database model

    res.status(201).json({ message: 'Doctor created successfully', doctor: newDoctor });
});

// Doctor login route
app.post('/telemedicine/api/doctors/login', (req, res) => {
    const { email, password } = req.body;

    // Find the doctor by email
    const doctor = doctors.find(d => d.email === email);

    if (!doctor) {
        return res.status(400).json({ error: 'Doctor not found' });
    }

    // Check if the password matches
    if (doctor.password !== password) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    // If successful, send back the doctor info
    res.status(200).json({ message: 'Login successful', doctor });
});

// Route for fetching doctors
app.get('/telemedicine/api/doctors', (req, res) => {
    const doctors = [
        { id: 1, name: 'Dr. John Doe', specialization: 'Dermatologist' },
        { id: 2, name: 'Dr. Joy Muthoni', specialization: 'Cardiologist' },
        { id: 3, name: 'Dr. Sharon Shay ', specialization: 'cardiologist' },
   
    ];  // Simulated doctor data (In a real app, this will come from a database)

    res.json(doctors);  // Send back the list of doctors as JSON
});

//backend route to get doctors for patients
app.get('/telemedicine/api/doctors', (req, res) => {
    // Return a list of doctors with their id, name, and specialization
    const doctorList = doctors.map(d => ({
        id: d.email,  // Use email as doctor ID (or create a unique id for doctors)
        name: `${d.first_name} ${d.last_name}`,
        specialization: d.specialization
    }));
    res.status(200).json(doctorList);
});


let appointments = [];

// Example endpoint to get doctors for the dropdown
app.get('/telemedicine/api/doctors', (req, res) => {
    res.json(doctors);
});


//Delete Appointment
app.delete('/telemedicine/api/appointments/:id', (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const index = appointments.findIndex(appointment => appointment.id === appointmentId);
    
    if (index !== -1) {
        appointments.splice(index, 1);
        return res.status(200).json({ message: 'Appointment deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Appointment not found' });
    }
});

// 3. Reschedule Appointment
app.put('/telemedicine/api/appointments/:id', (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const { appointment_date, appointment_time } = req.body;
    
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (appointment) {
        appointment.appointment_date = appointment_date;
        appointment.appointment_time = appointment_time;
        return res.status(200).json(appointment);
    } else {
        return res.status(404).json({ message: 'Appointment not found' });
    }
});

// Route for doctor to get their appointments
app.get('/telemedicine/api/doctors/:email/appointments', (req, res) => {
    const { email } = req.params;

    // Filter appointments for the doctor
    const doctorAppointments = appointments.filter(a => a.doctor_id === email);
    
    res.status(200).json({ appointments: doctorAppointments });
});

// Use existing routers for other functionalities
app.use('/telemedicine/api/patients', patientRouter);
app.use('/telemedicine/api/doctors', doctorRouter);
app.use('/telemedicine/api/', appointmentRouter);

// Serve additional HTML pages
app.get('/patient.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'patient.html')));
app.get('/doctor.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'doctor.html')));
app.get('/appointment.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'appointment.html')));

// Define a port
const PORT = 2022;

// Launch the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
