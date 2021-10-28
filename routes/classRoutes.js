const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT c.id, c.visible, class_name, t.id AS testID, date FROM classes AS c JOIN tests AS t ON c.test_id=t.id WHERE t.date = '${req.query.testDate}' AND c.visible=1`;
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

router.get('/id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT class_name, test_id FROM classes WHERE id = '${req.query.id}' AND visible=1`;
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

router.post('/create', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `INSERT INTO classes (class_name, test_id) values ('${req.body.name}', ${req.body.testID})`;
        conn.query(query, (err, rows) => {
            if(err) 
            {
                if(err.errno === 1062) // Duplicate entry
                    return res.json({code: 1062, error: err});
                else {
                    console.log(err);
                    return res.json({code: 500, error: err});
                }
            }

            return res.json({code:200, result: {class_name: req.body.class_name}});
        }); 
    });
});

module.exports = router;