import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        console.log('Authorization Header Missing');
        return res.status(401).json({ message: 'Access denied: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('Token Missing or Malformed:', authHeader);
        return res.status(401).json({ message: 'Access denied: Token not provided or invalid format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        console.log('Decoded User:', decoded);
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.log('Token Verification Error:', error.message);
        return res.status(403).json({ message: 'Access denied: Invalid token' });
    }
};

export default authMiddleware;
