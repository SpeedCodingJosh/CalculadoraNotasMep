const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/class/:testDate', (req, res) => {
    res.render('class', {
        testDate: req.params.testDate
    });
});

router.get('/test', (req, res) => {
    res.render('test');
});

router.get('/indicators', (req, res) => {
    res.render('indicators');
});

module.exports = router;