// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify token with secret key
        const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your secret key
        req.user = decoded; // Attach decoded user data (doctor's info) to request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};


const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized access' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
