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

function confirmDelete(e) {
  const post = e.target
  const postId = post.getAttribute("data-post-id")
  const title = post.getAttribute("data-post-title")
  const confirmed = confirm(`Are you sure you want to delete "${title}"? This action is irreversible.`)
  if (!confirmed) return
  socket.emit("post-delete", postId)
  window.location.reload()
}