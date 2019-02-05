const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
// const axios = require('axios');
const logger = require("morgan");

const routes = require('./routes');


const app = express();
app.engine('handlebars',
  exphbs({
    defaultLayout: 'main',
  }));

app.set('view engine', 'handlebars');

// Parse request body as JSON:
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.use(routes);


app.listen(PORT, () => {
  console.log(`Listening very carefully at : http://localhost:` + PORT);
});

module.exports = app;