const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
const Users = require("../Models/Users")
const getAnnouncements = require("../utils/announcements")

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
  const id = jwt.verify(req.cookies["JWT-Token"], process.env.ACCESS_TOKEN_SECRET).id
  const user = await Users.findOne({_id: id})
  const result = await bcrypt.compare(req.body.currentPassword, user.password)
  if (!result) return res.send({msg: "The password you enetered is incorrect"})
  const password = await bcrypt.hash(req.body.newPassword, 10)
  await Users.findOneAndUpdate({_id: id}, {$set: {password}})
  res.send({msg: "success"})
})

router.post("/announcements", async (req, res) => {
	const announcements = await getAnnouncements()
  res.send({announcements})
})

router.post("/change-school", (req, res) => {
  const file = path.join(__dirname, "../schools.json")
  const schools = JSON.parse(fs.readFileSync(file, "utf-8"))
  const newArray = schools.map(school => {
    if (school.id === parseInt(req.body.selected)) return {...school, selected: true}
    return {...school, selected: false}
  })
  fs.writeFileSync(file, JSON.stringify([...newArray], null, 2))
  res.send("done")
})

module.exports = router