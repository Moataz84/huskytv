const express = require("express")
const router = express.Router()
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")

router.get("/:id", validateJWT, async (req, res) => {
	const post = await Posts.findOne({postId: req.params.id})
	if (!post) return res.sendStatus(404)
	res.render("post", {post, loggedIn: checkLoggedIn(req)})
})

router.get("/:id/edit", validateJWT, async (req, res) => {
	const post = await Posts.findOne({postId: req.params.id})
	if (!post) return res.sendStatus(404)
	res.render("edit-post", {post, loggedIn: checkLoggedIn(req)})
})

module.exports = router