require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express
const swaggerDocument = require('./swagger.json'); // Import Swagger document
const app = express();

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const promotionsRoutes = require('./routes/promotions'); // Import promotions routes

// Swagger UI Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/promotions', promotionsRoutes); // Register promotions routes

app.use('/', require('./routes/index'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Database is listening and Node.js server is running on port ${PORT}`);
        });
    }
});

