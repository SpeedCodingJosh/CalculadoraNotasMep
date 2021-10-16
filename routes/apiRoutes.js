const express = require('express');
const router = express.Router();

router.get('/tests', (req, res) => {
        req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT * FROM tests WHERE tests.user_id = ${req.query.userID}`;
        conn.query(query, (err, rows) => {
            if(err) 
                return res.json({code: 500, error: err});

            if(rows.length > 0)
                return res.json({code:200, rows});
            else 
                return res.json({code:404, desc: 'No results found'});
        }); 
    });
});

router.post('/tests/create', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `INSERT INTO tests (date, user_id) values ('${req.body.date}', ${req.body.id})`;
        conn.query(query, (err, rows) => {
            if(err) 
            {
                if(err.errno === 1062) // Duplicate entry
                    return res.json({code: 1062, error: err});
                else
                    return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: {date: req.body.date, id: req.body.id}});
        }); 
    });
});

module.exports = router;