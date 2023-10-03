const express = require("express")
const router = express.Router()
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")
const formatDate = require("../utils/formatDate")

router.get("/:id", validateJWT, async (req, res) => {
	const post = await Posts.findOne({postId: req.params.id})
	if (!post) res.sendStatus(404)
	res.render("post", {post, loggedIn: checkLoggedIn(req), formatDate})
})

router.get("/:id/edit", validateJWT, async (req, res) => {
	const post = await Posts.findOne({postId: req.params.id})
	if (!post) res.sendStatus(404)
	res.render("edit-post", {post, loggedIn: checkLoggedIn(req), formatDate})
})

module.exports = router