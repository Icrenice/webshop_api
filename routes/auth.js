const express = require("express");
require("dotenv").config();
const router = express.Router();

const db = require("../database/connection");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


router.post("/", (req, res) => {
    const qry = 'select email ,wachtwoord, gebruiker_rol from gebruiker Where email = ?'
    let params = [req.body.email];


    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const data = rows[0]



        if (!data) {
            res.status(401).json({ error: 'invalid credentials' });
            return;
        }


        const paswordDB = data.wachtwoord


        const isValid = bcrypt.compareSync(req.body.wachtwoord, paswordDB)





        if (isValid) {

            const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
                //       console.log(isValid);
            res.status(200);
            res.json({
                "token": token
            });

        } else {
            res.status(401).json({ error: 'invalid credentials' })
        }

    });
});








module.exports = router;