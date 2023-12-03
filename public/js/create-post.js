const quill = new Quill(".editor", {
  theme: "snow",
  formats: [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
  ],
  modules: {
    toolbar: {
      container: [
        [{"header": [1, 2, false]}, "bold", "italic", "underline", "strike"]
      ]
    }
  }
})

const getLength = () => {
  const tempElement = document.createElement("div")
  tempElement.innerHTML = quill.container.innerHTML
  return tempElement.textContent.length
}

quill.on("text-change", () => {
  document.querySelector(".post-preview > div").innerHTML = document.querySelector(".ql-editor").innerHTML
  const remaining = document.querySelector(".remaining")
  const length = 250 - getLength()
  if (length === 1) return remaining.innerText = "1 Character Remaining"
  if (length > 0) return remaining.innerText = `${length} Characters Remaining`
  remaining.innerText = ""
})

document.querySelector(".ql-editor").addEventListener("focus", () => document.querySelector(".msg").innerText = "")

const clearInput = () => document.querySelector(".post-form .msg").innerText = ""

const imageUploaded = e => {
  const files = e.target.files
  const text = document.querySelector(".post-form p")
  const imgPreview = document.querySelector(".post-preview img")
  if (files.length === 0) {
    imgPreview.src = ""
    return text.innerText = "Upload Image"
  }
  if (!files[0].type.includes("image")) return
  text.innerText = files[0].name
  const reader = new FileReader()
  reader.readAsDataURL(files[0])
  reader.onload = e => {
    imgPreview.src = e.target.result
  }
}

const dragOverHandeler = e => {
  e.preventDefault()
  if (e.dataTransfer.items[0].kind === "file") 
    document.querySelector(".post-form label").classList.add("dragging")
}

const dragLeaveHandeler = e => {
  e.preventDefault()
  document.querySelector(".post-form label").classList.remove("dragging")
}

const dropHandler = e => {
  e.preventDefault()
  clearInput(e)
  const item = e.dataTransfer.items[0]
  if (item.kind === "file") {
    dragLeaveHandeler(e)
    const file = item.getAsFile()
    const list = new DataTransfer()
    list.items.add(file)
    const parent = document.querySelector(".post-form")
    parent.querySelector("input").files = list.files
    parent.querySelector("p").innerText = file.name
  }
}

function post(e) {
  e.preventDefault()

  const msg = document.querySelector(".msg")
  const input = document.querySelector("#upload-image")
  const textarea = document.querySelector(".ql-editor")
  const button = document.querySelector(".post-form > button")
  const expire = document.querySelector(".check input").checked
  input.disabled = button.disabled = true
  textarea.contentEditable = false

  const files = input.files
  if (!files.length || !getLength()) {
    input.disabled = button.disabled = false
    textarea.contentEditable = true
    return msg.innerText = "Both fields are required"
  }

  if (getLength() >= 250) {
    input.disabled = button.disabled = false
    textarea.contentEditable = true
    return msg.innerText = "Caption can not exceed 250 characters"
  }
  
  msg.style.color = "#000"
  msg.innerText = "Creating post, please wait"

  const photo = document.querySelector(".post-preview img").src
  const caption = document.querySelector(".ql-editor").innerHTML
  socket.emit("post-create", {photo, caption, expire})
  socket.on("post-id", postId => window.location.href = `/posts/${postId}`)
}

function editPost(e) {
  e.preventDefault()

  const msg = document.querySelector(".msg")
  const input = document.querySelector("#upload-image")
  const textarea = document.querySelector(".ql-editor")
  const button = document.querySelector(".post-form > button")
  input.disabled = button.disabled = true
  textarea.contentEditable = false

  const files = input.files
  if (!files.length || !getLength()) {
    input.disabled = button.disabled = false
    textarea.contentEditable = true
    return msg.innerText = "Both fields are required"
  }

  if (getLength() >= 250) {
    input.disabled = button.disabled = false
    textarea.contentEditable = true
    return msg.innerText = "Caption can not exceed 250 characters"
  }

  msg.style.color = "#000"
  msg.innerText = "Saving post, please wait"
  
  const postId = window.location.pathname.replace("/posts/", "").replace("/edit", "")
  const img = document.querySelector(".post-preview img")
  const photo = img.src
  const photoId = img.getAttribute("data-photo-id")
  const caption = document.querySelector(".ql-editor").innerHTML
  socket.emit("post-update", {postId, photo, photoId, caption})
  window.location.href = `/posts/${postId}`
}