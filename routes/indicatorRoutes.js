const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
        req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT * FROM indicator_group WHERE setting_id = ${req.query.settingID} AND visible=1`;
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
        const query = `SELECT * FROM indicator_settings WHERE test_id = ${req.query.id}`;
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
        
        const query = `INSERT INTO indicator_group (group_name, setting_id) values ('${req.body.name}', ${req.body.id})`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: {group_name: req.body.name}});
        }); 
    });
});

router.put('/update', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `UPDATE indicator_settings SET first=${req.body.first}, second=${req.body.second}, third=${req.body.third}, percentage=${req.body.percentage} WHERE id = ${req.body.settingID}`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }
            
            // SHOW CORRECT INFO
            return res.json({
                code:200, 
                result: {
                    first:req.body.first, 
                    second: req.body.second, 
                    third: req.body.third,
                    percentage: req.body.percentage
                }
            });
        }); 
    });
});

router.put('/update/single', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `UPDATE indicator_group SET value='${req.body.values}' WHERE id = ${req.body.id}`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }
            
            // SHOW CORRECT INFO
            return res.json({
                code:200, 
                result: {
                    values:req.body.values
                }
            });
        }); 
    });
});

router.delete('/remove', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});

        const query = `UPDATE indicator_group SET visible=0 WHERE id=${req.body.id}`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: 'Group removed!'});
        }); 
    });
});

module.exports = router;
