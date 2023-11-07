const socket = io("/")

async function logout() {
  await fetch("/api/logout", {method: "POST"})
  window.location.href = "/"
}

function getPost() {
  new Quill(".editor", {
    theme: "snow",
    modules: {
      toolbar: []
    }
  })
}

function setPostData() {
  const caption = document.querySelector(".post-form").getAttribute("data-caption")
  quill.container.firstChild.innerHTML = caption

  const src = document.querySelector("img").src
  const img = document.createElement("img")
  img.crossOrigin = "Anonymous"
  img.src = src
  img.onload = async () => {
    const canvas = document.createElement("canvas")
    canvas.height = img.naturalHeight
    canvas.width = img.naturalWidth
    const context = canvas.getContext("2d")
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataURL = context.canvas.toDataURL("image/jpeg")
    const res = await fetch(dataURL)
    const data = await res.blob()
    const file = new File([data], "file.jpeg")
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    document.querySelector("#upload-image").files = dataTransfer.files
    document.querySelector("label > p").innerText = "Image.jpg"
  }  
}

function confirmDelete(e) {
  const postId = e.target.getAttribute("data-post-id")
  const confirmed = confirm("Are you sure you want to delete this post? This action is irreversible.")
  if (!confirmed) return
  socket.emit("post-delete", postId)
  socket.on("deleted", () => window.location.reload())
}

function approvePost(e) {
  const postId = e.target.getAttribute("data-post-id")
  const confirmed = confirm("Are you sure you want to approve this post?")
  if (!confirmed) return
  socket.emit("post-approve", postId)
  socket.on("approved", () => window.location.reload())
}