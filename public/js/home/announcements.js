const announcementsSlider = document.querySelector(".announcements")
const slideNumber = document.querySelector(".slide-number")

let announcements = JSON.parse(announcementsSlider.getAttribute("data-announcements"))

announcementsSlider.removeAttribute("data-announcements")
slideNumber.innerText = `1/${announcements.length}`
announcementsSlider.insertAdjacentHTML(
  "beforeend",
  `<div class="announcement" data-id="${announcements[0].id}">
    <h2>${announcements[0].title}</h2>
    <p>${announcements[0].content}</p>
  </div>
  <div class="announcement" data-id="${announcements.length < 2? announcements[0].id : announcements[1].id}">
    <h2>${announcements.length < 2? announcements[0].title : announcements[1].title}</h2>
    <p>${announcements.length < 2? announcements[0].content : announcements[1].content}</p>
  </div>`
)

setInterval(() => {
  const current = announcementsSlider.children[1].getAttribute("data-id")
  const next = announcements.findIndex(announcement => announcement.id === parseInt(current)) + 1
  const nextId = announcements[next] != undefined? announcements[next].id : announcements[0].id
  const nextTitle = announcements[next] != undefined? announcements[next].title : announcements[0].title
  const nextContent = announcements[next] != undefined? announcements[next].content : announcements[0].content
  slideNumber.innerText = `${parseInt(current) + 1}/${announcements.length}`

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
}, 10000)

setInterval(async () => {
  const res = await fetch("/api/announcements", {method: "POST"})
  const data = await res.json()
  announcements = data.announcements
}, (60 * 60 * 1000))