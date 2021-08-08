const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'], //list of possible values
  },
  user: { //a user connected to each story 
    type: mongoose.Schema.Types.ObjectId, //special type of id
    ref: 'User', //to connect to user model 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Story', StorySchema)