module.exports = (req, res, next) => {

    const { gebruiker_gebruiker_rol } = req.gebruiker;

    if (req.gebruiker.gebruiker_rol !== 2) {
        return res.sendStatus(401)

    }
    next();
};