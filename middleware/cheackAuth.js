const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token, process.env.ACCESS_TOKEN_SECRET);
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, gebruiker) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.gebruiker = gebruiker;

        next();


    });

};