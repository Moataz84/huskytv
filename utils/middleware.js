const jwt = require("jsonwebtoken")
const url = require("url")
if (process.env.NODE_ENV !== "production") require("dotenv").config()

const protected = ["/dashboard", "/settings", "/:id/edit"]
function validateJWT(req, res, next) {
  const cookie = req.cookies["JWT-Token"]
  if (!cookie && protected.includes(req.route.path)) return res.redirect("/login")
  try {
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET)
    if (req.url === "/login") return res.redirect("/")
    next()
  } catch {
    if (protected.includes(req.url)) return res.redirect("/login")
    next()
  }
}

function checkLoggedIn(req) {
  try {
    const cookie = req.cookies["JWT-Token"]
    jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET)
    return true
  } catch {
    return false
  }
}

function checkOrigin(req, res, next) {
  try {
    const origin = new url.URL(req.headers.origin).host
    if (origin !== req.headers.host) return res.sendStatus(403)
    next()
  } catch {
    res.sendStatus(403)
  }
}

module.exports = { validateJWT, checkLoggedIn, checkOrigin }