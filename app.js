require('dotenv').config();

// Requires
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const myconn = require('express-myconnection');

// Routes require
const mainRoutes = require('./routes/mainroutes');
const apiRoutes = require('./routes/apiroutes');

// Data
const app = express();
const port = process.env.PORT || 3000;

const databaseOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const hbs = require('hbs');
const fs = require('fs');
const { json } = require('express');

// HANDLEBARS
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(myconn(mysql, databaseOptions, 'single'));

// ROUTES

// Main routes
app.use('/', mainRoutes);

// API routes
app.use('/api', apiRoutes);

// Unknown route
app.get('*', (req, res) => {
    res.render('404');
});

// START SERVER
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
})