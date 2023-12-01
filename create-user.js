const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Users = require("./Models/Users")
require("dotenv").config()

async function createUser(username, password) {
  await mongoose.connect(process.env.DB_URI)
  const userCheck = await Users.findOne({username})
  if (userCheck) {
    console.log("User already exists")
    return mongoose.connection.close()
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  await Users({username, password: hashedPassword}).save()
  console.log("User created")
  mongoose.connection.close()
}