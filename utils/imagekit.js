const ImageKit = require("imagekit")
if (process.env.NODE_ENV !== "production") require("dotenv").config()

const imagekit = new ImageKit({
  publicKey : process.env.PUBLIC_KEY,
  privateKey : process.env.PRIVATE_KEY,
  urlEndpoint : "https://ik.imagekit.io/pk4i4h8ea/"
})

module.exports = imagekit