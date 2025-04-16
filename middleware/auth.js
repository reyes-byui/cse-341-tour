function ensureAuthenticated(req, res, next) {
    console.log('Session:', req.session);
    console.log('User:', req.session?.user);

    if (req.session?.user && req.session.user.username === 'reyes-byui') {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized access. Please log in with the correct GitHub account.' });
}

module.exports = { ensureAuthenticated };