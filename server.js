const express = require("express");
const app = express();

app.use(express.json());
require("dotenv").config();
const gebruikerRouter = require("./routes/gebruikers");
const categoriesRouter = require("./routes/categories");
const productenRouter = require("./routes/producten");
const landenRouter = require("./routes/landen");
const authRouter = require("./routes/auth");




// root path
app.get("/", (req, res) => {
    res.json({ message: "welkom bij de webshop-api" });
});

// Start server
app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server running on port ${process.env.HTTP_PORT}`);
});
app.use(express.json());
app.use("/api/gebruikers", gebruikerRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/producten", productenRouter);
app.use("/api/landen", landenRouter);
app.use("/api/auth", authRouter);