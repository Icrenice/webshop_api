const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "./database/webshop.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log(`Connected to the SQlite database "webshop".`);
    }
});

module.exports = db;