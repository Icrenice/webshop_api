const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../database/connection");
const checkAuth = require("../middleware/cheackAuth");
const checkAdmin = require("../middleware/checkAdmin");
router.get("/", (req, res) => {
    const qry = "select * from landen";
    const params = [];
    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});
router.get("/:id", (req, res, next) => {
    let qry = "select * from landen where id_land = ?";
    let params = [req.params.id];
    db.get(qry, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            user: row
        });
    });
});
router.post("/", checkAuth, checkAdmin, (req, res) => {
    let errors = [];
    let data = [];
    if (req.body.naam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.naam.match(regex);
        if (!valideer) {
            errors.push("Landen moeten alfabetisch zijn en tenminste 2 letters bevatten");
        }
    } else {

        errors.push("Geen land ingevuld");
    }
    if (errors.length) {
        res.status(400).json({ errors });
        return;
        // } else {
        //     res.status(200);
        //     res.json({
        //         data
        //     });

    }


    let params = [
        req.body.naam,


    ];
    let qry = `INSERT INTO "landen"
    (naam)
    VALUES (?)`;
    db.run(qry, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(200);
        res.json({
            id: this.lastID,
        });
    });

});
router.patch("/:id", checkAuth, checkAdmin, (req, res) => {
    let data = [];

    let errors = [];

    if (req.body.naam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.naam.match(regex);
        if (!valideer) {
            errors.push("landen moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    }

    if (errors.length) {
        res.status(400).json({ errors });
        return;
        // } else {
        //     res.status(200);
        //     res.json({
        //         data
        //     });

    }



    console.log(errors.length);

    if (errors.length) {

        res.status(400).json({ errors });

        return;

    }
    let qry = `UPDATE landen set  
    naam = COALESCE(NULLIF(?, ''),naam)
    WHERE id_land = ?`;



    let params = [

        req.body.naam,
        req.params.id,

    ];



    db.run(qry, params, function(err, result) {

        if (err) {

            res.status(400).json({ error: res.message });

            return;

        }

        res.status(200);

        res.json({

            changes: this.changes,

        });

    });

});
router.delete("/:id", checkAuth, checkAdmin, (req, res) => {

    let qry = "DELETE FROM landen WHERE id_land = ?";

    let params = [req.params.id];



    db.run(qry, params, function(err) {

        if (err) {

            res.status(400).json({ error: err.message });

            return;

        }

        if (this.changes === 0) {

            res.status(412);

            res.json({

                message: `Record ${req.params.id} niet gevonden.`,

            });

        } else {

            res.status(200);

            res.json({

                message: `Record ${req.params.id} deleted.`,

            });

        }

    });

});
module.exports = router;