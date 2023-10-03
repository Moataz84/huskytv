const jwt = require("jsonwebtoken")
if (process.env.NODE_ENV !== "production") require("dotenv").config()

const protected = ["/dashboard", "/post", "/settings", "/:id/edit"]
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

module.exports = { validateJWT, checkLoggedIn }