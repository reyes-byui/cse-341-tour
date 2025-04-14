function ensureAuthenticated(req, res, next) {
    console.log('Session:', req.session); // Debug log for session
    console.log('User:', req.session.user); // Debug log for user

    if (req.session.user && req.session.user.username === 'reyes-byui') {
        return next(); 
    }
    res.status(403).json({ message: 'Access denied. Only reyes-byui is allowed.' });
}

module.exports = { ensureAuthenticated };