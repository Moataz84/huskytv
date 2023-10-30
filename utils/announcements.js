const axios = require("axios")
const cheerio = require("cheerio")

async function getAnnouncements() {
  const data = [] 
  const res = await axios.get("https://508.commons.hwdsb.on.ca/presentation/announcements/feed/")
  const $ = cheerio.load(res.data, null, false)
  const items = $("item")

  for (const item of items) {
    const title = $("title", item).text()
    let content = $("p", item).text()
    if (!content?.length) content = $("h1", item).html()
    data.push({title, content})
  }
  return data.filter((v, i) => i > 0).map((item, index) => ({id: index, ...item}))
}

module.exports = getAnnouncements