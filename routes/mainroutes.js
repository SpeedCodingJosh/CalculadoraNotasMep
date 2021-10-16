const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/class/:examen', (req, res) => {
    res.render('class', {
        data: req.params.examen
    });
});

router.get('/test', (req, res) => {
    res.render('test');
});

router.get('/indicators', (req, res) => {
    res.render('indicators');
});

module.exports = router;