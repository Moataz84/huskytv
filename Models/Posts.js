const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    postId: String,
    title: String,
    body: String,
    createdAt: Number
  })
  
const Posts = mongoose.model("posts", schema)
module.exports = Posts