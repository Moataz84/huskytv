const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    postId: String,
    photo: String,
    photoId: String,
    caption: String,
    approved: Boolean,
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 604800
    }
  })
  
const Posts = mongoose.model("posts", schema)
module.exports = Posts