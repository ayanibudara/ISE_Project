// utils/user.util.js
const User = require('../Models/User.js');

/**
 * Get all admin emails from the database
 * @returns {Promise<string[]>} Array of admin emails
 */
const getAdminEmails = async () => {
    try {
        const admins = await User.find({ role: 'admin' }).select('email').lean();
        return admins
            .map(admin => admin.email)
            .filter(email => !!email); // Ensure only valid strings
    } catch (error) {
        console.error('Error fetching admin emails:', error);
        throw new Error('Failed to fetch admin emails');
    }
};

module.exports = {
    getAdminEmails
};
