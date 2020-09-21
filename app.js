const express = require('express');
const app = express();
const morgan = require('morgan'); // Middleware for logs
const bodyParser = require('body-parser');

// Routes
const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');


// Run logging middleware before other routes
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}) ); // see docs
app.use(bodyParser.json());

// Routes which should handle requests
app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);


// Handle errors. If no routes found, then the following line is reached
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;