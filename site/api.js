const express = require('express');
const api = express.Router();
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const mysql_options = config.mysql_options;
const mysqlQuery = (sqlStr, callback) => {
	var con = mysql.createConnection(mysql_options);
	con.query(sqlStr, (err, result, field) => {
		if (err) {
			callback(err);
			return;
		}
		callback(null, result);
	});
	con.end();
}
api.get('/get_task/', (req, res)=>{
    let query = req.query.q,
        sql;
    const MAXDATE = 60 * 60 * 24 * 30 * 1000;
    const DATE = (new Date()).getTime();
    const STEP = DATE - MAXDATE;
    switch(query){
        case 'JIHUA':
            sql = `select id,create_timestamp,title from task where is_finished = 0 and create_timestamp > '${STEP}' order by create_timestamp DESC`;
            break;
        case 'HUAKAI':
            sql = `select id,create_timestamp,title from task where is_finished = 1 order by create_timestamp DESC`;
            break;
        case 'CHENFENG':
            sql = `select id,create_timestamp,title from task where create_timestamp <= '${STEP}'  order by create_timestamp DESC`;
            break;
    }
    mysqlQuery(sql, (e, r)=>{
        if(e){
            res.json({
                flag: false
            });
            return;
        }
        res.json({
            flag: true,
            result: r
        });
    });
})
api.post('/add_task/', multer().array(), (req, res)=>{
    let create_timestamp = new Date().getTime(),
        task_title = req.body.task_title,
        sql = `insert into task (create_timestamp, title) values ('${create_timestamp}','${task_title}')`;
    if(task_title == 0 || task_title >= 24){
        res.json({ flag: false, info: 'string length' })
        return
    }
    mysqlQuery(sql, (e, r)=>{
        if(e){
            res.json({ flag: false, info: 'db error' })
            return
        }
        res.json({
            flag: true,
            result: { id: r.insertId, create_timestamp: create_timestamp, title: task_title, }
        })
    })
});
api.put('/update_task/:id/:op', (req, res)=>{
    let op = req.params.op,
        id = req.params.id,
        sql,
        date = (new Date()).getTime();
    switch(op){
        case 'go_huakai':
            sql = `update task set is_finished = 1 where id = ${id}`;
            break;
        case 'go_jihua':
            sql = `update task set create_timestamp = '${date}', finish_timestamp = NULL where id = ${id}`;
            break;
    }
    mysqlQuery(sql, (e, r)=>{
        if(e){
            res.json({ flag: false, result: 'db error' })
            return;
        }
        if(op == 'go_huakai'){
            sql = `update task set finish_timestamp = '${date}' where id = ${id}`;
            mysqlQuery(sql, (e, r)=>{
                if(e){
                    res.json({ flag: false, result: 'db error' })
                    return;
                }
                res.json({ flag: true, result: id })
            });
        }else{
            res.json({ flag: true, result: id })
        }
    });
});
api.post('/upload_cag/', multer().array(), (req, res)=>{
    let b64 = req.body.b64.replace(/^data:image\/\w+;base64,/, ''),
        width = req.body.width,
        height = req.body.height,
        step = req.body.step,
        buf = Buffer.from(b64, 'base64'),
        fileName = `${(new Date()).getTime()}_${width}-${height}-${step}`,
        filePath = path.join(__dirname,'resource',`${fileName}.png`);
    fs.writeFile(filePath, buf, e => {
        if(e){
            res.json({
                flag: false,
                info: e
            })
            return;
        }
        res.json({
            flag: true,
            result: `${req.hostname}:8000/resource/${fileName}.png`
        });
    });
});
module.exports = api;