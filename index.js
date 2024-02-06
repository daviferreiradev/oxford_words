const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const conn = require('./db/conn');

const Word = require('./models/Word');

const wordsRoutes = require('./routes/wordsRoutes');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
        extended: true
    })
);

// req
app.use(express.json());

app.use(express.static('public'));

app.use("/", wordsRoutes);



conn.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}).catch((err) => {
    console.log(err);
});
