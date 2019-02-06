const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema =  new Schema({
  title: {
    type: String,
    Required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  }

});

const Article =  mongoose.model('Article', ArticleSchema);

module.exports = Article;