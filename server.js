const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

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

app.get('/', (req, res) => {
  db.Article.find({})
      .then(data => {
        const hbsObject = {
          articles: data
        };
        res.render("index", hbsObject);
      });
  });
  
  app.get('/notes', (req, res) => {
  db.Note.find({})
      .then(data => {
        const hbsObject = {
          notes: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
      });
  });

  app.get("/scrape", (req, res) => {
    axios.get("https://www.sfchronicle.com/").then(response => {
      const $ = cheerio.load(response.data);
      $(".prem-hl-item ").each((i, element) => {
        let result = {};
  
        result.title = $(element).find("h2.headline").find("a").text();
        result.link = $(element).find("a").attr("href");
        result.summary = $(element).find("p").text();
  
        db.Article.create(result)
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(err => {
            console.log(err);
          });
      });
      res.redirect("../");
    });
  
  });
  
  app.get("/articles", res => {
    db.Article.find({})
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
  app.get("/clearall", (req, res) => {

    db.Article.remove({}, (error, response) => {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(response);
        res.redirect("../");
      }
    });
  });
  
  app.get("/removeone/:id", (req, res) => {
  
    db.Article.remove({_id: req.params.id }, (error, response) => {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(response);
        res.redirect("../");
      }
    });
  });
  
  app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
  app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
      .then(dbNote => {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
  app.get("/deletenote/:id", (req, res) => {
  
    db.Note.remove({_id: req.params.id }, (error, response) => {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(response);
        res.redirect("../notes");
      }
    });
  });

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
  