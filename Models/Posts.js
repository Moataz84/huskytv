const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    postId: String,
    body: String,
    approved: Boolean
  })
  
const Posts = mongoose.model("posts", schema)
module.exports = Posts