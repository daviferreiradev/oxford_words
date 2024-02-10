const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

const conn = require("./db/conn");

const Word = require("./models/Word");
const Phrase = require("./models/Phrase");

const wordsRoutes = require("./routes/wordsRoutes");
const phrasesRoutes = require("./routes/phrasesRoutes");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use(express.static("public"));

app.use("/", wordsRoutes);
app.use("/", phrasesRoutes);

conn.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is listening on port 3000");
        });
    })
    .catch((err) => {
        console.log(err);
    });
