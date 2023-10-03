const socket = io("/")

function generatePreview(body, parent) {
  const tempElement = document.createElement("div")
  tempElement.innerHTML = body
  parent.querySelector(".text-preview").textContent = 
  `${tempElement.textContent.substring(0, 200)} ...`
}

function updatePostPage(data) {
  const preview = document.querySelector(".preview")
  const { title, body } = data
  document.querySelector("title").innerText = `Posts - ${title}`
  preview.querySelector("h2").innerText = title
  preview.querySelector(".ql-editor").innerHTML = body
}

function updatePostsPage(data) {
  const { postId, title, body } = data
  const post = document.querySelector(`[data-post-id="${postId}"]`)
  post.querySelector("a > h3").innerText = title
  generatePreview(body, post)
}

socket.on("post-updated", data => {
  const isPost = window.location.pathname.replace("/posts/", "") === data.postId
  if (isPost) updatePostPage(data)
  if (window.location.pathname === "/") updatePostsPage(data)
})

function createPostPreview(data) {
  const { postId, title, body } = data
  const post = document.querySelector(".post-preview").cloneNode(true)
  post.setAttribute("data-post-id", postId)
  post.querySelector("a").setAttribute("href", `/posts/${postId}`)
  post.querySelector("a > h3").innerText = title
  generatePreview(body, post)
  post.querySelector(".posted-at").innerText = "Posted less than a minute ago"
  document.querySelector(".posts").append(post)
}

socket.on("post-created", data => {
  if (window.location.pathname === "/") createPostPreview(data)
})