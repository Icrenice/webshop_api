const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../database/connection");
const checkAuth = require("../middleware/cheackAuth");
const checkAdmin = require("../middleware/checkAdmin");

router.get("/me", checkAuth, (req, res) => {
    const qry = "SELECT gebruiker.id_gebruiker, gebruiker.voornaam, gebruiker.tussenvoegsel, gebruiker.achternaam, gebruiker.straat, gebruiker.huisnummer, gebruiker.postcode, gebruiker.stad, gebruiker.nieuwsbrief, gebruiker.gebruiker_rol, gebruiker.id_land, gebruiker.email, landen.naam, rollen.rol FROM gebruiker INNER JOIN landen ON gebruiker.id_land = landen.id_land INNER JOIN rollen ON gebruiker.gebruiker_rol = rollen.gebruiker_id WHERE gebruiker.email = ?";
    let username = req.gebruiker.email;
    let params = [username];
    db.all(qry, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        let me = [];
        for (let index in rows) {

            me.push({
                    id: rows[index].id_gebruiker,
                    voornaam: rows[index].voornaam,
                    tussenvoegsel: rows[index].tussenvoegsel,
                    achternaam: rows[index].achternaam,
                    straat: rows[index].straat,
                    huisnummer: rows[index].huisnummer,
                    postcode: rows[index].postcode,
                    stad: rows[index].stad,
                    nieuwsbrief: rows[index].nieuwsbrief,
                    email: rows[index].email,
                    gebruiker_rol: [{
                        gebruiker_rol: rows[index].gebruiker_rol,
                        rol: rows[index].rol,
                    }],
                    id_land: [{
                        id_land: rows[index].id_land,
                        landnaam: rows[index].naam,
                    }],
                }

            )
        }
        console.log(me);
        res.status(200);
        res.json({
            me: me,
        });
    });
});

router.get("/", checkAuth, checkAdmin, (req, res) => {
    const qry = "select id_gebruiker, voornaam, tussenvoegsel, achternaam, straat, huisnummer, postcode, stad, nieuwsbrief, gebruiker_rol, id_land, email from gebruiker";
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
// router.get("/:id", (req, res, next) => {
//     let qry = "select id_gebruiker, voornaam, tussenvoegsel, achternaam, straat, huisnummer, postcode, stad, nieuwsbrief, gebruiker_rol, id_land, email from gebruiker where id_gebruiker = ?";
//     let params = [req.params.id];
//     db.get(qry, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.status(200);
//         res.json({
//             user: row
//         });
//     });
// });
router.post("/", (req, res) => {
    let errors = [];

    if (req.body.voornaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.voornaam.match(regex);
        if (!valideer) {
            errors.push("voornaam moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    } else {
        errors.push("Geen voornaam ingevuld")
    }


    if (req.body.achternaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.achternaam.match(regex);
        if (!valideer) {
            errors.push("achternaam moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    } else {
        errors.push("Geen achternaam ingevuld")
    }
    if (req.body.straat) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.straat.match(regex);
        if (!valideer) {
            errors.push("straat moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    } else {
        errors.push("Geen straat ingevuld")
    }
    if (req.body.huisnummer) {
        var regex = /[0-9]/g;
        var valideer = req.body.huisnummer.match(regex);
        if (!valideer) {
            errors.push("huisnummer moet numeriek zijn");
        }

    } else {
        errors.push("Geen huisnummer ingevuld")
    }


    if (req.body.postcode) {
        var regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        var valideer = req.body.postcode.match(regex);
        if (!valideer) {
            errors.push("postcode moet alfabetisch zijn en numeriek dus 1234AS");
        }
    } else {
        errors.push("Geen postcode ingevuld")
    }

    if (req.body.stad) {
        var regex = /[a-zA-Z]/g;
        var valideer = req.body.stad.match(regex);
        if (!valideer) {
            errors.push("stad moet alfabetisch zijn");
        }
    } else {
        errors.push("Geen stad ingevuld")
    }
    if (req.body.nieuwsbrief) {
        var regex = /[0-9]/g;
        var valideer = req.body.nieuwsbrief.match(regex);
        if (!valideer) {
            errors.push("nieuwsbrief moet numeriek zijn");
        }
    } else {
        errors.push("Geen nieuwsbrief ingevuld")
    }

    if (req.body.id_land) {
        var regex = /[0-9]/g;
        var valideer = req.body.id_land.match(regex);
        if (!valideer) {
            errors.push("id_land moet numeriek zijn");
        }
    } else {
        errors.push("Geen id_land ingevuld")
    }

    if (req.body.email) {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var valideer = req.body.email.match(regex);
        if (!valideer) {
            errors.push("email moet tenminste een @ hebben");
        }
    } else {
        errors.push("Geen email ingevuld")
    }
    if (req.body.wachtwoord) {
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        var valideer = req.body.wachtwoord.match(regex);
        if (!valideer) {
            errors.push("wachtwoord moet tenminste letters, 1 nummer en 8 karakters hebben ");
        }
    } else {
        errors.push("Geen wachtwoord ingevuld")
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
        req.body.voornaam,
        req.body.tussenvoegsel,
        req.body.achternaam,
        req.body.straat,
        req.body.huisnummer,
        req.body.postcode,
        req.body.stad,
        req.body.nieuwsbrief,
        req.body.gebruiker_rol = 1,
        req.body.id_land,
        req.body.email,
        bcrypt.hashSync(req.body.wachtwoord, 10),

    ];
    let qry = `INSERT INTO "gebruiker"
    (voornaam, tussenvoegsel, achternaam, straat, huisnummer, postcode, stad, nieuwsbrief, gebruiker_rol, id_land, email, wachtwoord)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
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

    if (req.body.voornaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.voornaam.match(regex);
        if (!valideer) {
            errors.push("voornaam moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    }


    if (req.body.achternaam) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.achternaam.match(regex);
        if (!valideer) {
            errors.push("achternaam moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    }
    if (req.body.straat) {
        var regex = /[a-zA-Z]{2,}$/g;
        var valideer = req.body.straat.match(regex);
        if (!valideer) {
            errors.push("straat moet alfabetisch zijn en tenminste 2 letters bevatten");
        }
    }
    if (req.body.huisnummer) {
        var regex = /[0-9]/g;
        var valideer = req.body.huisnummer.match(regex);
        if (!valideer) {
            errors.push("huisnummer moet numeriek zijn");
        }

    }


    if (req.body.postcode) {
        var regex = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
        var valideer = req.body.postcode.match(regex);
        if (!valideer) {
            errors.push("postcode moet alfabetisch zijn en numeriek dus 1234AS");
        }
    }

    if (req.body.stad) {
        var regex = /[a-zA-Z]/g;
        var valideer = req.body.stad.match(regex);
        if (!valideer) {
            errors.push("stad moet alfabetisch zijn");
        }
    }
    if (req.body.nieuwsbrief) {
        var regex = /[0-9]/g;
        var valideer = req.body.nieuwsbrief.match(regex);
        if (!valideer) {
            errors.push("nieuwsbrief moet numeriek zijn");
        }
    }

    if (req.body.gebruiker_rol) {
        var regex = /[0-9]/g;
        var valideer = req.body.gebruiker_rol.match(regex);
        if (!valideer) {
            errors.push("gebruiker_rol moet numeriek zijn");
        }
    }
    if (req.body.id_land) {
        var regex = /[0-9]/g;
        var valideer = req.body.id_land.match(regex);
        if (!valideer) {
            errors.push("id_land moet numeriek zijn");
        }
    }

    if (req.body.email) {
        var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var valideer = req.body.email.match(regex);
        if (!valideer) {
            errors.push("email moet tenminste een @ hebben");
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
    let qry = `UPDATE gebruiker set  
    voornaam = COALESCE(NULLIF(?, ''),voornaam),
    tussenvoegsel = COALESCE(NULLIF(?, ''),tussenvoegsel),  
    achternaam = COALESCE(NULLIF(?, ''),achternaam), 
    straat = COALESCE(NULLIF(?, ''),straat), 
    huisnummer = COALESCE(NULLIF(?, ''),huisnummer), 
    postcode = COALESCE(NULLIF(?, ''),postcode), 
    stad = COALESCE(NULLIF(?, ''),stad),
    nieuwsbrief = COALESCE(NULLIF(?, ''),nieuwsbrief),  
    gebruiker_rol = COALESCE(NULLIF(?, ''),gebruiker_rol),  
    id_land = COALESCE(NULLIF(?, ''),id_land), 
    email = COALESCE(NULLIF(?, ''),email)
    WHERE id_gebruiker = ?`;



    let params = [

        req.body.voornaam,
        req.body.tussenvoegsel,
        req.body.achternaam,
        req.body.straat,
        req.body.huisnummer,
        req.body.postcode,
        req.body.stad,
        req.body.nieuwsbrief,
        req.body.gebruiker_rol,
        req.body.id_land,
        req.body.email,
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

module.exports = router;