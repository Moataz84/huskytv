const express = require("express")
const router = express.Router()
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/view", validateJWT, async (req, res) => {
	const posts = await Posts.find({approved: true})
	res.render("view", {posts: JSON.stringify(posts), loggedIn: checkLoggedIn(req)})
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

router.get("/dashboard", validateJWT, async (req, res) => {
	const posts = await Posts.find()
	res.render("dashboard", {loggedIn: checkLoggedIn(req), posts})
})

router.get("/settings", validateJWT, (req, res) => {
	res.render("settings", {loggedIn: checkLoggedIn(req)})
})

module.exports = router