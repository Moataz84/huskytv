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
    io.emit("post-created", {postId, ...data})

    let { title, body, createdAt } = data
    const images = new Set([...body.matchAll(/<img[^>]+src="([^">]+)"/g)].map(match => match[1]))
  
    const imageUrls = await Promise.all(
      [...images].map(image => {
        return new Promise(resolve => {
          imagekit.upload({
            file: image,
            fileName: uuid.v4(),
            folder: `signage/${postId}`
          }, (e, result) => resolve({image, url: result.url}))
        })
      })
    )
    imageUrls.forEach(img => body = body.replaceAll(img.image, img.url))
  
    await new Posts({
      postId,
      title,
      body,
      createdAt
    }).save()
    
    socket.emit("post-id", postId)
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
    await Posts.findOneAndDelete({postId})
    io.emit("post-deleted", postId)
    try {
      await imagekit.deleteFolder(`signage/${postId}`)
    } catch {}
  })
})

mongoose.connect(URI).then(() => server.listen(port, () => console.log(`http://localhost:${port}`)))