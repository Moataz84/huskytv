const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  postId: String,
  photo: String,
  photoId: String,
  caption: String,
  approved: Boolean
}, {timestamps: true})
schema.index({createdAt: 1}, {expireAfterSeconds: 604800})

const Posts = mongoose.model("posts", schema)
module.exports = Posts