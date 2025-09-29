const User = require('../models/User');
const { verifyToken, generateToken } = require('../utils/jwtUtils');

// JWT authentication middleware
exports.requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      // parse cookie header manually to avoid adding cookie-parser
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      const jwtCookie = cookies.find(c => c.startsWith('jwt='));
      if (jwtCookie) {
        token = decodeURIComponent(jwtCookie.split('=')[1]);
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = verifyToken(token);
  // Check if user exists
  const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to restrict access based on user role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};
// Add this line to create alias
exports.authorizeRoles = exports.restrictTo;

// Middleware to attach a fresh JWT to the response headers for authenticated requests
exports.attachToken = (req, res, next) => {
  try {
    if (!req.user) return next();

    // Generate a new token (short-lived refresh on each response)
    const token = generateToken(req.user);

    // Set HttpOnly cookie with the token for browser clients
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    };
    res.cookie('jwt', token, cookieOptions);

    // Also expose a non-HttpOnly header for API clients that read headers (optional)
    res.setHeader('Authorization', `Bearer ${token}`);
    // Expose Authorization header for browsers
    const exposed = res.getHeader('Access-Control-Expose-Headers') || '';
    const headers = new Set(exposed.split(',').map(s => s.trim()).filter(Boolean));
    headers.add('Authorization');
    res.setHeader('Access-Control-Expose-Headers', Array.from(headers).join(','));

    next();
  } catch (err) {
    console.error('attachToken error:', err);
    next();
  }
};