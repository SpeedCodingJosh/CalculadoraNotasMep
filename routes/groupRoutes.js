const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});
        
        const query = `SELECT id, group_name, class_id FROM class_group WHERE class_id = ${req.query.classID} AND visible=1`;
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
        
        const query = `INSERT INTO class_group (group_name, class_id) values ('${req.body.name}', ${req.body.classID})`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: {group_name: req.body.name}});
        }); 
    });
});

router.delete('/remove', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) 
            return res.json({code: 500, error: err});

        const query = `UPDATE class_group SET visible=0 WHERE id=${req.body.id}`;
        conn.query(query, (err, rows) => {
            if(err) {
                return res.json({code: 500, error: err});
            }

            return res.json({code:200, result: 'Group removed!'});
        }); 
    });
});

module.exports = router;