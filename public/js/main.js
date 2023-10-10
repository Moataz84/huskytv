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

function generatePreviews() {
  const posts = document.querySelectorAll(".post-preview");
  [...posts].forEach(post => {
    const textPreview = post.querySelector(".text-preview")
    const tempElement = document.createElement("div")
    tempElement.innerHTML = textPreview.getAttribute("data-post-body")
    textPreview.textContent = `${tempElement.textContent.substring(0, 200)} ...`
    textPreview.removeAttribute("data-post-body")
  })
}

function setPostData() {
  const body = document.querySelector(".post-form").getAttribute("data-body")
  quill.container.firstChild.innerHTML = body
}

function confirmDelete(e) {
  const post = e.target
  const postId = post.getAttribute("data-post-id")
  const title = post.getAttribute("data-post-title")
  const confirmed = confirm(`Are you sure you want to delete "${title}"? This action is irreversible.`)
  if (!confirmed) return
  socket.emit("post-delete", postId)
  window.location.reload()
}

function scaleText() {
  document.querySelectorAll(".layout *").forEach(elem => {
    const originalSize = window.getComputedStyle(elem).getPropertyValue("font-size")
    elem.setAttribute("data-size", originalSize)
  })

  const resizeObserver = new ResizeObserver(e => {
    const width = e[0].contentRect.width
    const factor = width / 1100
    document.querySelectorAll(".layout *").forEach(elem => {
      const fontSize = parseInt(elem.getAttribute("data-size")) * factor
      elem.style.fontSize = `${fontSize}px`
    })
  })
  
  resizeObserver.observe(document.querySelector(".layout"))
}