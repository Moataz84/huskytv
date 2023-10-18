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
}

function confirmDelete(e) {
  const postId = e.target.getAttribute("data-post-id")
  const confirmed = confirm("Are you sure you want to delete this post? This action is irreversible.")
  if (!confirmed) return
  socket.emit("post-delete", postId)
  window.location.reload()
}

function approvePost(e) {
  const postId = e.target.getAttribute("data-post-id")
  const confirmed = confirm("Are you sure you want to approve this post?")
  if (!confirmed) return
  socket.emit("post-approve", postId)
  window.location.reload()
}