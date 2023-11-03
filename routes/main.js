const express = require("express")
const router = express.Router()
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")
const getAnnouncements = require("../utils/announcements")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/view", validateJWT, async (req, res) => {
	const [posts, announcements] = await Promise.all([Posts.find({approved: true}), getAnnouncements()])
	res.render("view", {posts: JSON.stringify(posts), announcements: JSON.stringify(announcements), loggedIn: checkLoggedIn(req)})
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

router.get("/dashboard", validateJWT, async (req, res) => {
	const data = await Posts.find()
	const posts = data.map(post => ({
		...post._doc,
		timestamp: new Date(new Date(post._doc.timestamp).getTime() + 604800000).getTime()
	}))
	res.render("dashboard", {loggedIn: checkLoggedIn(req), posts})
})

router.get("/settings", validateJWT, (req, res) => {
	res.render("settings", {loggedIn: checkLoggedIn(req)})
})

module.exports = router