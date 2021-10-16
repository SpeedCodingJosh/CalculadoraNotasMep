require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

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

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/class/:examen', (req, res) => {
    console.log(req);
    res.render('class', {
        data: req.params.examen
    });
});

app.get('/test', (req, res) => {
    res.render('test');
});

app.get('/indicators', (req, res) => {
    res.render('indicators');
});

// Data handling
app.get('/api/tests', (req, res) => {
    const file = fs.readFileSync('./data/database.json', { encoding: 'utf-8'});
    const data = JSON.parse(file);

    res.json(data);
});

app.post('/api/save', (req, res) => {
    // const file = fs.writeFileSync('./data/database.json', { encoding: 'utf-8'});
    res.json({req});
});

app.get('*', (req, res) => {
    res.render('404');
});

// START SERVER
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
})