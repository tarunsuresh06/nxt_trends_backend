const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')
const app = express()

const dbPath = path.join(__dirname, 'test.db')
let database = null

const initializeServerAndDb = async () => {
    try {
        database = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        app.listen(3000, (req, res) => {
            console.log("Server started on port 3000");
        })
    } catch(e) {
        console.log(`DB Error: ${e.message}`);
    }
}

initializeServerAndDb()

app.get('/', (req, res) => {
    res.send("Hello World")
});
