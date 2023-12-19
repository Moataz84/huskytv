const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  postId: String,
  photo: String,
  photoId: String,
  caption: String,
  approved: Boolean,
  expire: Boolean,
  createdAt: Number
})

const Posts = mongoose.model("posts", schema)
module.exports = Posts