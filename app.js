const express = require('express');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const jwt = require('jsonwebtoken')
const path = require('path');
const { log } = require('console');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'test.db');
let db = null;

const initializeServerAndDb = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        app.listen(3000, (req, res) => {
            console.log("Server started on port 3000");
        });
    } catch(e) {
        console.log(`DB Error: ${e.message}`);
    }
}



initializeServerAndDb();

const authenticateUser = (req, res, next) => {
    const {authorization} = req.headers;
    const token = authorization.split(" ")[1];
    
    if (token === undefined) {
        res.status(401);
        res.send({status_code: 401, error_msg: 'Invalid User Credentials'});
    } else {
        jwt.verify(token, 'TARUN_SURESH_06', async (error, payload) => {
            if (error) {
                res.status(401);
                res.send({status_code: 401, error_msg: 'Invalid User Credentials'});
            } else {
                req.payload = payload;
                next();
            }
        })
    }
}

app.post('/register', async (req, res) => {
    const { username, password, name } = req.body;
    const insertRegisterDataQuery = `
    INSERT INTO user_details
    (name, username, password) 
    VALUES
    (${name}, ${username}, ${password});
    `;

    await db.run(insertRegisterDataQuery);


})

app.post('/', authenticateUser, (req, res) => {
    res.send("Hello World");
});
