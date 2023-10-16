const socket = io("/")


/*
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

function createPostPreview(data) {
  const { postId, title, body } = data

  if (document.querySelectorAll(".post-preview").length === 0) {
    const container = document.querySelector(".posts-container")
    container.innerHTML = null
    container.insertAdjacentHTML("afterbegin", `<h2>Posts</h2><div class="posts"></div>`)
  }

  const post = document.createElement("div")
  post.classList.add("post-preview")
  post.setAttribute("data-post-id", postId)
  post.insertAdjacentHTML(
    "afterbegin", 
    `<a href="/posts/${postId}">
      <h3>${title}</h3>
    </a>
    <div class="text-preview"></div>
    <p class="posted-at">Posted less than a minute ago</p>`
  )
  generatePreview(body, post)
  document.querySelector(".posts").append(post)
}

socket.on("post-created", data => {
  if (window.location.pathname === "/") createPostPreview(data)
})

socket.on("post-updated", data => {
  const isPost = window.location.pathname.replace("/posts/", "") === data.postId
  if (isPost) updatePostPage(data)
  if (window.location.pathname === "/") updatePostsPage(data)
})

socket.on("post-deleted", postId => {
  const pathname = window.location.pathname
  if (pathname === "/") {
    document.querySelector(`[data-post-id="${postId}"]`).remove()
    if (document.querySelectorAll(".post-preview").length === 0) {
      const container = document.querySelector(".posts-container")
      container.innerHTML = null
      container.insertAdjacentHTML("afterbegin", `<h3 class="no-posts">No Posts Available</h3>`)
    }
  }
  if (pathname === `/posts/${postId}`) window.location.href = "/"
})*/