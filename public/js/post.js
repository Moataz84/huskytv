function getLength() {
  const tempElement = document.createElement("div")
  tempElement.innerHTML = quill.container.innerHTML
  return tempElement.textContent.length
}

const icons = Quill.import("ui/icons")
icons["code-block"] = `<svg strokeWidth="0" viewBox="0 0 16 16" height="15" width="15" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708z"></path></svg>`

function image() {
  const input = document.createElement("input")
  input.setAttribute("type", "file")
  input.setAttribute("accept", "image/*")
  input.click()

  input.onchange = () => {
    const width = 1000
    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      const image = document.createElement("img")
      image.src = e.target.result
      image.onload = e => {
        const canvas = document.createElement("canvas")
        const ratio = e.target.width / e.target.height
        if (e.target.width > width) canvas.width = width
        if (e.target.width <= width) canvas.width = e.target.width
        canvas.height = canvas.width / ratio
        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const newImage = context.canvas.toDataURL("image/jpeg", 0.9)
        const editor = this.quill
        const range = editor.getSelection()
        editor.insertEmbed(range.index, "image", newImage, Quill.sources.USER)
        editor.setSelection(range.index + 1, Quill.sources.SILENT)
      }
    }
  }
}

const quill = new Quill(".editor", {
  theme: "snow",
  formats: [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "image",
    "code",
    "code-block",
    "list",
  ],
  modules: {
    toolbar: {
      container: [
        [{"header": [1, 2, false]}, "bold", "italic", "underline", "strike"],
        ["blockquote", "link", "image", "code", "code-block"],
        [{"list": "ordered"}, {"list": "bullet"}]
      ],
      handlers: {
        image
      }
    }
  }
});

[...document.querySelectorAll(".ql-editor, .post-form > input")].
forEach(element => element.addEventListener("focus", () => document.querySelector(".msg").innerText = ""))

document.querySelector(".editor").addEventListener("drop", e => {
  e.preventDefault()
  const text = e.dataTransfer.getData("text/plain")
  quill.clipboard.dangerouslyPasteHTML(0, text)
})

quill.clipboard.addMatcher("img", () => {
  const Delta =  Quill.import("delta")
  return new Delta()
})

quill.on("text-change", () => {
  const remaining = document.querySelector(".remaining")
  const length = 250 - getLength()
  if (length === 1) return remaining.innerText = "1 Character Required"
  if (length > 0) return remaining.innerText = `${length} Characters Required`
  remaining.innerText = ""
})

function post(e) {
  e.preventDefault()

  const title = document.querySelector(".post-form > input").value
  const body = document.querySelector(".ql-editor").innerHTML

  const titleLength = title.length
  const bodyLength = getLength()
  const msg = document.querySelector(".msg")
  
  if (!titleLength || !bodyLength) {
    return msg.innerText = "All fields are required"
  }

  if (bodyLength < 250) {
    return msg.innerText = "Post body must be atleast 250 characters"
  }

  socket.emit("post-create", {title, body, createdAt: new Date().getTime()})
  socket.on("post-id", postId => window.location.href = `/posts/${postId}`)
}

function editPost(e) {
  e.preventDefault()
  const postId = e.target.getAttribute("data-post-id")
  const title = document.querySelector(".post-form > input").value
  const body = document.querySelector(".ql-editor").innerHTML

  const titleLength = title.length
  const bodyLength = getLength()
  const msg = document.querySelector(".msg")
  
  if (!titleLength || !bodyLength) {
    return msg.innerText = "All fields are required"
  }

  if (bodyLength < 250) {
    return msg.innerText = "Post body must be atleast 250 characters"
  }

  socket.emit("post-update", {postId, title, body})
  window.location.href = `/posts/${postId}`
}