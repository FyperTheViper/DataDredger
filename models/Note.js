const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const NoteSchema =  new Schema({
  _titleId: {
    title: String,
    body: String
  },
  date:String,
  noteText: String
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;