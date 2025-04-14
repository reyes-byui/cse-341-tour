const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Tour Management API",
        description: "API for Managing Staff, Packages, Bookings and Promotions"
    },
    host: "localhost:3001", 
    basePath: "/", 
    schemes: ["http"]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js', './routes/staff.js', './routes/packages.js', './routes/bookings.js', './routes/promotions.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);