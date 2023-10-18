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
const io = require("socket.io")(server)

const port = process.env.PORT || 5000
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
    const { photo, caption } = data

    const imageUrl = await new Promise(resolve => {
      imagekit.upload({
        file: photo,
        fileName: uuid.v4(),
        folder: `signage/${postId}`
      }, (e, result) => resolve(result.url))
    })
  
    const req = {
      cookies: {
        "JWT-Token": socket.handshake.headers.cookie?.replace("JWT-Token=", "")
      }
    }
    const loggedIn = checkLoggedIn(req)

    const post = await new Posts({
      postId,
      photo: imageUrl,
      caption: caption,
      approved: loggedIn
    }).save()

    if (loggedIn) io.emit("post-created", post)
    socket.emit("post-id", postId)
  })

  socket.on("post-approve", async postId => {
    let posts = await Posts.find()
    posts = posts.map(post => {
      if (post.postId === postId) post.approved = true
      return post
    }).filter(post => post.approved)
    io.emit("post-approved", posts)
    await Posts.findOneAndUpdate({postId}, {$set: {approved: true}}, {new: true})
  })

  socket.on("post-update", async data => {
    io.emit("post-updated", data)
    let { postId, title, body } = data
    const pattern = /<img[^>]+src="([^">]+)"/g
    const images = new Set([...body.matchAll(pattern)].map(match => match[1]))
  
    const imageUrls = await Promise.all(
      [...images].map(image => {
        if (image.includes("https://ik.imagekit.io/pk4i4h8ea/")) return
        return new Promise(resolve => {
          imagekit.upload({
            file: image,
            fileName: uuid.v4(),
            folder: `signage/${postId}`
          }, (e, result) => resolve({image, url: result.url}))
        })
      })
    )
    imageUrls.filter(img => img !== undefined).forEach(img => body = body.replaceAll(img.image, img.url))
    await Posts.findOneAndUpdate({postId: postId}, {$set: {body, title}})
  
    const usedImages = [...body.matchAll(pattern)].map(match => match[1])
    imagekit.listFiles({
      path: `signage/${postId}`
    }, async (e, result) => {
      const unusedIds = result.filter(image => !usedImages.includes(image.url)).map(image => image.versionInfo.id)
      if (unusedIds.length) await imagekit.bulkDeleteFiles(unusedIds)
    })
  })

  socket.on("post-delete", async postId => {
    io.emit("post-deleted", postId)
    await Posts.findOneAndDelete({postId})
    try {
      await imagekit.deleteFolder(`signage/${postId}`)
    } catch {}
  })
})

mongoose.connect(URI).then(() => server.listen(port, () => console.log(`http://localhost:${port}`)))