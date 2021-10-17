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

router.get('/test/:classID', (req, res) => {
    res.render('test', {
        classID: req.params.classID
    });
});

router.get('/indicators/:classID/:settingID', (req, res) => {
    res.render('indicators', { 
        settingID: req.params.settingID,
        classID: req.params.classID
    });
});

module.exports = router;