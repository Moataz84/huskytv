const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
const uuid = require("uuid")
const Posts = require("./Models/Posts")
const imagekit = require("./utils/imagekit")
const mainRoutes = require("./routes/main")
const postsRoutes = require("./routes/posts")
const apiRoutes = require("./routes/api")
const { checkLoggedIn } = require("./utils/middleware")

if (process.env.NODE_ENV !== "production") require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e11
})

const port = 5550
const URI = process.env.DB_URI

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: "100mb"}))
app.use(express.static(path.join(__dirname, "/public")))

app.use("/api", apiRoutes)
app.use("/posts", postsRoutes)
app.use("/", mainRoutes)

io.on("connection", socket => {
  socket.on("post-create", async data => {
    const postId = uuid.v4().replace(/-/g, "")
    const { photo, caption, expire } = data

    const { pictureUrl, photoId } = await new Promise(resolve => {
      imagekit.upload({
        file: photo,
        fileName: uuid.v4(),
        folder: "signage"
      }, (e, result) => resolve({pictureUrl: result.url, photoId: result.versionInfo.id}))
    })
  
    const req = {
      cookies: {
        "JWT-Token": socket.handshake.headers.cookie?.split(";")?.
        find(cookie => cookie.includes("JWT-Token"))?.replace("JWT-Token=", "")?.replace(" ", "")
      }
    }
    const loggedIn = checkLoggedIn(req)

    const post = await new Posts({
      postId,
      photo: pictureUrl,
      photoId,
      caption,
      approved: loggedIn,
      expire
    }).save()

    if (loggedIn) io.emit("post-created", post)
    socket.emit("post-id", postId)
  })

  socket.on("post-approve", async postId => {
    let [posts] = await Promise.all([Posts.find(), Posts.findOneAndUpdate({postId}, {$set: {approved: true}})])
    posts = posts.map(post => {
      if (post.postId === postId) post.approved = true
      return post
    }).filter(post => post.approved)
    socket.emit("approved")
    io.emit("post-approved", posts)
  })

  socket.on("post-update", async data => {
    let { postId, photo, photoId, caption } = data

    if (photo.startsWith("data:image")) {
      imagekit.deleteFile(photoId)
      const result = await new Promise(resolve => {
        imagekit.upload({
          file: photo,
          fileName: uuid.v4(),
          folder: "signage"
        }, (e, result) => resolve({photo: result.url, photoId: result.versionInfo.id}))
      })
      photo = result.photo
      photoId = result.photoId
    }
    const post = await Posts.findOneAndUpdate({postId}, {$set: {caption, photo, photoId}}, {new: true})
    io.emit("post-updated", post)
  })

  socket.on("post-delete", async postId => {
    const post = await Posts.findOneAndDelete({postId})
    imagekit.deleteFile(post.photoId)
    socket.emit("deleted")
    io.emit("post-deleted", postId)
  })
})

mongoose.connect(URI).then(() => server.listen(port, () => console.log(`http://localhost:${port}`)))