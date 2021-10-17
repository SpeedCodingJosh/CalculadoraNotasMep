const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
        req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT * FROM tests WHERE tests.user_id = ${req.query.userID} AND visible=1`;
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

router.get('/date', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT id, visible, date FROM tests WHERE tests.date = '${req.query.date}' AND visible=1`;
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
        const query = `SELECT date, visible FROM tests WHERE tests.id = '${req.query.id}' AND visible=1`;
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

router.get('/student', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        const query = `SELECT * FROM test_data WHERE group_id = '${req.query.id}' AND visible=1`;
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
        
        const query = `INSERT INTO tests (date, user_id) values ('${req.body.date}', ${req.body.id})`;
        conn.query(query, (err, rows) => {
            if(err) {
                if(err.errno === 1062) // Duplicate entry
                    return res.json({code: 1062, error: err});
                else
                    return res.json({code: 500, error: err});
            }


            const query2 = `INSERT INTO indicator_settings (test_id) values (${rows.insertId})`;
            conn.query(query2, (err, rows) => {
                if(err) {
                    return res.json({code: 500, error: err});
                }
                return res.json({code:200, result: {date: req.body.date, id: req.body.id}});
            });
        }); 
    });
});

router.post('/create/student', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `INSERT INTO test_data (group_id) values (${req.body.id})`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: 'Student created'});
        }); 
    });
});

router.delete('/create/student', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `UPDATE test_data SET visible=0 WHERE id=(${req.body.id})`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: 'Student deleted'});
        }); 
    });
});

module.exports = router;
