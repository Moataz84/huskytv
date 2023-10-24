const announcementsSlider = document.querySelector(".announcements")

const announcements = JSON.parse(announcementsSlider.getAttribute("data-announcements"))

announcementsSlider.removeAttribute("data-posts")
announcementsSlider.insertAdjacentHTML(
  "beforeend",
  `<div class="announcement" data-id="${announcements[0].id}">
    <h2>${announcements[0].title}</h2>
    <p>${announcements[0].content}</p>
  </div>
  <div class="announcement" data-id="${announcements[1].id}">
    <h2>${announcements[1].title}</h2>
    <p>${announcements[1].content}</p>
  </div>`
)

setInterval(() => {
  const current = announcementsSlider.children[1].getAttribute("data-id")
  const next = announcements.findIndex(announcement => announcement.id === parseInt(current)) + 1
  const nextId = announcements[next] != undefined? announcements[next].id : announcements[0].id
  const nextTitle = announcements[next] != undefined? announcements[next].title : announcements[0].title
  const nextContent = announcements[next] != undefined? announcements[next].content : announcements[0].content

  announcementsSlider.style.animation = "move 1s ease-in-out forwards"
  const timeout = setTimeout(() => {
    announcementsSlider.style.animation = ""
    announcementsSlider.children[0].remove()
    announcementsSlider.insertAdjacentHTML(
      "beforeend", 
      `<div class="announcement" data-id="${nextId}">
        <h2>${nextTitle}</h2>
        <p>${nextContent}</p>
      </div>`
      )
    clearTimeout(timeout)
  }, 1000)
}, 5000)