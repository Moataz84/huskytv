const ImageKit = require("imagekit")
if (process.env.NODE_ENV !== "production") require("dotenv").config()

const imagekit = new ImageKit({
  publicKey : process.env.PUBLIC_KEY,
  privateKey : process.env.PRIVATE_KEY,
  urlEndpoint : process.env.ENDPOINT
})

module.exports = imagekit