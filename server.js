const express = require('express');
// const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

let PORT = process.env.PORT || 3000;

const app = express();

const router = express.Router();

require('./config/routes')(router);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

app.use(router);

mongoose.connect(MONGODB_URI, err => {
  if(err) {
    console.log(err);
  }
  else {
    app.listen(PORT, () => {
      console.log('Mongoose is connected');
      console.log("Listening carefully on " + PORT + "!");
      });
  }
});

module.exports = app;