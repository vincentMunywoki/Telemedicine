
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

//     // Save new patient to the "database" (here, it's just an array in memory)
//     patients.push(newPatient);

//     // Optionally, set a session to mock user authentication
//     req.session.patient = { firstName: first_name, lastName: last_name, email };

//     // Respond with success and the newly created patient data
//     res.status(201).json({
//         message: 'Patient created successfully',
//         patient: {
//             firstName: first_name,
//             lastName: last_name,
//             email,
//             phone,
//             dateOfBirth: date_of_birth,
//             gender,
//             address
//         }
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

// Use existing routers for other functionalities
app.use('/telemedicine/api/patients', patientRouter);

// Serve additional HTML pages
app.get('/patient.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'patient.html')));

// Define a port
const PORT = 2022;

// Launch the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
