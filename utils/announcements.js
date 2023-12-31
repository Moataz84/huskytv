const axios = require("axios")
const cheerio = require("cheerio")

async function getAnnouncements() {
  const data = [] 
  const res = await axios.get("https://508.commons.hwdsb.on.ca/presentation/announcements/feed/")
  const $ = cheerio.load(res.data, null, false)
  const items = $("item")  

  items.each((index, item) => {
    const title = $(item).find("title").text()
    let content = ""
    const paragraphs = $(item).find("p")
    paragraphs.each((index, paragraph) => {
      const html = $(paragraph).html()
      if (html) content = content + html
    })
    if (!content?.length) content = $(item).find("h1").html()
    data.push({title, content})
  })

  const announcements = data.filter(e => e.content?.length).map((item, index) => ({id: index, ...item}))
  if (!announcements.length) {
    announcements.push({id: 0, title: "No Announcements", content: "<p>There are currently no new announcements available.</p"})
  }
  return announcements
}

module.exports = getAnnouncements