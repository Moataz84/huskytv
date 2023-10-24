const axios = require("axios")
const cheerio = require("cheerio")

async function getAnnouncements() {
  const data = [] 
  const res = await axios.get("https://508.commons.hwdsb.on.ca/presentation/announcements/feed/")
  const $ = cheerio.load(res.data, null, false)
  const items = $("item");
  [...items].forEach(item => {
    const title = $(".wp-block-heading", item).text()
    const content = $("p", item).html()
    data.push({title, content})
  })
  return data.filter(item => item.content).map((item, index) => ({id: index, ...item}))
}

module.exports = getAnnouncements