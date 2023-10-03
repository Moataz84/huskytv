const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Users = require("../Models/Users")

router.post("/login", async (req, res) => {
  const user = await Users.findOne({username: req.body.username})
  if (!user) {
    return res.send({msg: "User does not exist"})
  }
  const result = await bcrypt.compare(req.body.password, user.password)
  if (!result) {
    return res.send({msg: "Incorrect password "})
  }
  const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET)
  res.cookie("JWT-Token", accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 5
  })
  res.send({msg: "success"})
})

router.post("/logout", (req, res) => {
  res.clearCookie("JWT-Token")
  res.end()
})

router.post("/change-password", async (req, res) => {
  const user = await Users.findOne({username: "admin"})
  const result = await bcrypt.compare(req.body.currentPassword, user.password)
  if (!result) return res.send({msg: "The password you enetered is incorrect"})
  const password = await bcrypt.hash(req.body.newPassword, 10)
  await Users.findOneAndUpdate({username: "admin"}, {$set: {password}})
  res.send({msg: "success"})
})

module.exports = router