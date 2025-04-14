const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const mongodb = require('./data/database');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const { ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS Headers Globally
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Session Configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ensure secure is false for non-HTTPS environments
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        console.log('GitHub Profile:', profile);
        profile.displayName = profile.displayName || profile.username || profile.id;
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user);
    done(null, user);
});

// Middleware to Protect Routes
function ensureAuthenticated(req, res, next) {
    console.log('Session:', req.session); // Debug log for session
    console.log('User:', req.user); // Debug log for user
    console.log('Is Authenticated:', req.isAuthenticated()); // Debug log for authentication status

    if (req.isAuthenticated() && req.user.username === 'reyes-byui') {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized access. Please log in with the correct GitHub account.' });
}

// Root Route
app.get('/', (req, res) => {
    if (req.isAuthenticated() && req.user.username === 'reyes-byui') {
        res.send(`
            <h1>Welcome, ${req.user.displayName}!</h1>
            <p>You are now logged in. You can access the API documentation and perform CRUD operations.</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Logged Out!</h1>
            <a href="/login">Login with GitHub</a>
        `);
    }
});

// GitHub Login Route
app.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        console.log('GitHub Login Successful:', req.user);
        req.session.user = req.user;
        console.log('Session after login:', req.session);
        res.redirect('/');
    }
);

// Logout Route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.redirect('/');
    });
});

// Swagger UI Route (Protected)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example Protected CRUD Routes
app.post('/data/:collection', ensureAuthenticated, async (req, res) => {
    try {
        const collectionName = req.params.collection; // Dynamically get the collection name
        console.log(`POST /data/${collectionName} called by user:`, req.user);

        const db = mongodb.getDatabase().db('final');
        const result = await db.collection(collectionName).insertOne(req.body);

        res.status(201).json({ message: 'POST request successful', data: result });
    } catch (err) {
        console.error('POST Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

app.put('/data/:collection', ensureAuthenticated, async (req, res) => {
    try {
        const collectionName = req.params.collection;
        if (!req.body._id) {
            return res.status(400).json({ error: '_id is required for PUT operation.' });
        }

        const db = mongodb.getDatabase().db('final');
        const result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No document found with the provided _id.' });
        }

        res.status(200).json({ message: 'PUT request successful', data: result });
    } catch (err) {
        console.error('PUT Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Protected GET route for staff
app.get('/data/staff', ensureAuthenticated, async (req, res) => {
    try {
        const db = mongodb.getDatabase().db('final');
        const data = await db.collection('staff').find().toArray();
        res.status(200).json({ message: 'GET request successful', data });
    } catch (err) {
        console.error('GET Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Protected GET route for bookings
app.get('/data/bookings', ensureAuthenticated, async (req, res) => {
    try {
        const db = mongodb.getDatabase().db('final');
        const data = await db.collection('bookings').find().toArray();
        res.status(200).json({ message: 'GET request successful', data });
    } catch (err) {
        console.error('GET Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Public GET route for packages
app.get('/data/packages', async (req, res) => {
    try {
        const db = mongodb.getDatabase().db('final');
        const data = await db.collection('packages').find().toArray();
        res.status(200).json({ message: 'GET request successful', data });
    } catch (err) {
        console.error('GET Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Protected GET route for other collections
app.get('/data/:collection', ensureAuthenticated, async (req, res) => {
    try {
        const collectionName = req.params.collection;
        const db = mongodb.getDatabase().db('final');
        const data = await db.collection(collectionName).find().toArray();
        res.status(200).json({ message: 'GET request successful', data });
    } catch (err) {
        console.error('GET Error:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Require Routes
app.use('/', require('./routes'));

// Error Handling for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal server error occurred.' });
});

// Initialize MongoDB Connection and Start Server
mongodb.initDb((err) => {
    if (err) {
        console.error('Database connection error:', err); // Debug log for database connection
    } else {
        console.log('Database connected successfully'); // Debug log for successful connection
        app.listen(PORT, () => {
            console.log(`Node.js server is running on port ${PORT}`);
        });
    }
});