const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")
const getAnnouncements = require("../utils/announcements")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/view", validateJWT, async (req, res) => {
  const schools = JSON.parse(fs.readFileSync(path.join(__dirname, "../schools.json"), "utf-8"))
  let selected = schools.find(school => school.selected)
  if (!selected) selected = schools.find(school => school.id === "husky")
	const [posts, announcements] = await Promise.all([Posts.find({approved: true}), getAnnouncements()])
	res.render("view", {
    selected,
    posts: JSON.stringify(posts), 
    announcements: JSON.stringify(announcements), 
    loggedIn: checkLoggedIn(req)
  })
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

router.get("/dashboard", validateJWT, async (req, res) => {
	const data = await Posts.find()
	const posts = data.map(post => ({
		...post._doc,
		createdAt: new Date(new Date(post._doc.createdAt).getTime() + 604800000).getTime()
	}))
	res.render("dashboard", {loggedIn: checkLoggedIn(req), posts})
})

router.get("/settings", validateJWT, (req, res) => {
	res.render("settings", {loggedIn: checkLoggedIn(req)})
})

module.exports = router