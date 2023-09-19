const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../database/connection");
const checkAuth = require("../middleware/cheackAuth");
const checkAdmin = require("../middleware/checkAdmin");
router.get("/:id", (req, res, next) => {

    let qry = `select id_product, code, titel, beschrijving, prijs, aantal, id_categorie  ,prijs*1.21 AS "prijs_vat " FROM product where id_product = ?`;
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
router.get("/", (req, res) => {

            let params = [req.params.id];
            if (req.query.q) {
                params = req.query.q.split(" ").map((zoekwoord) => `%${zoekwoord}%`);
                qry = `
     select Product.id_product,Product.code,Product.titel ,Product.beschrijving, Product.prijs, Product.aantal,Product.id_categorie  ,Product.prijs*1.21 AS "price_vat", titel ||''|| beschrijving as search
      from product
      where ${params.map((zoekwoord)=> `search LIKE ?`).join(" AND ")}
     `;
     console.log(req.query.q);
    
    }else{
       qry = 'select id_product, code, titel, beschrijving, prijs, aantal, id_categorie  ,prijs*1.21 AS "prijs_vat " FROM product';
       console.log(req.query.q);
    }
    
      
        db.all(qry, params, (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message });
      
            return;
          }
      
          res.status(200);
      
          res.json({
            Products: row,
          });
        });
      });
router.post("/", checkAuth, checkAdmin, (req, res) => {
    let errors = [];
    let data = [];
    if (req.body.code) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.code.match(regex);
        if (!valideer) {
            errors.push("code bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        } 
    } else {

        errors.push("Geen code ingevuld");
    }
    if (req.body.titel) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.titel.match(regex);
        if (!valideer) {
            errors.push("titels bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        } 
    } else {

        errors.push("Geen titel ingevuld");
    }
    if (req.body.beschrijving) {
        var regex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;
        var valideer = req.body.beschrijving.match(regex);
        if (!valideer) {
            errors.push("beschrijving bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    } else {

        errors.push("Geen beschrijving ingevuld");
    }
    if (req.body.prijs) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.prijs.match(regex);
        if (!valideer) {
            errors.push("prijzen bevatten alleen cijfers.");
        }
    } else {

        errors.push("Geen prijs ingevuld");
    }
    if (req.body.aantal) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.aantal.match(regex);
        if (!valideer) {
            errors.push("aantallen bevatten alleen cijfers.");
        } 
    } else {

        errors.push("Geen aantal ingevuld");
    }
    if (req.body.id_categorie) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.id_categorie.match(regex);
        if (!valideer) {
            errors.push("categorie IDs bevatten alleen cijfers.");
        } 
    } else {

        errors.push("Geen categorie ID ingevuld");
    }
    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }
    // else {
    //     res.status(200);
    //     res.json({
    //         data
    //     });

    // }


    let params = [
        req.body.code,
        req.body.titel,
        req.body.beschrijving,
        req.body.prijs,
        req.body.aantal,
        req.body.id_categorie
    ];
    let qry = `INSERT INTO "product"
    (code, titel, beschrijving, prijs, aantal, id_categorie)
    VALUES (?,?,?,?,?,?)`;
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

    if (req.body.code) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.code.match(regex);
        if (!valideer) {
            errors.push("code bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    }
    if (req.body.titel) {
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var valideer = req.body.titel.match(regex);
        if (!valideer) {
            errors.push("titels bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    }
    if (req.body.beschrijving) {
        var regex = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;
        var valideer = req.body.beschrijving.match(regex);
        if (!valideer) {
            errors.push("beschrijving bevatten alleen letters, cijfers, witruimtes en dashes(-).");
        }
    }
    if (req.body.prijs) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.prijs.match(regex);
        if (!valideer) {
            errors.push("prijzen bevatten alleen cijfers.");
        }
    }
    if (req.body.aantal) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.aantal.match(regex);
        if (!valideer) {
            errors.push("aantallen bevatten alleen cijfers.");
        }
    }
    if (req.body.id_categorie) {
        var regex = /^[0-9]+$/;
        var valideer = req.body.id_categorie.match(regex);
        if (!valideer) {
            errors.push("categorie IDs bevatten alleen cijfers.");
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
    let qry = `UPDATE product set  
    code = COALESCE(NULLIF(?, ''),code),
    titel = COALESCE(NULLIF(?, ''),titel),
    beschrijving = COALESCE(NULLIF(?, ''),beschrijving),
    prijs = COALESCE(NULLIF(?, ''),prijs),
    aantal = COALESCE(NULLIF(?, ''),aantal),
    id_categorie = COALESCE(NULLIF(?, ''),id_categorie)
    WHERE id_product = ?`;



    let params = [

        req.body.code,
        req.body.titel,
        req.body.beschrijving,
        req.body.prijs,
        req.body.aantal,
        req.body.id_categorie,
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

    let qry = "DELETE FROM product WHERE id_product = ?";

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