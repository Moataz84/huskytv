function checkSingular(d) {
  if (d[d.length - 1] !== "s") return d
  if (parseInt(d) === 1) return d.substring(0, d.length - 1)
  return d
}

function checkTimeAgo(unix) {
  const current = new Date()
  unix = parseInt(unix)
  const difference = Math.round((current - unix) / 1000)

  if (difference < 60) return "less than a minute ago"
  if (difference < 3600) {
    const minutes = Math.round(difference / 60)
    return `${minutes} minutes ago`
  }
  if (difference < 86400) {
    const hours = Math.round(difference / 3600)
    return `${hours} hours ago`
  } 
  if (difference < 604800) {
    const days = Math.round(difference / 86400)
    return `${days} days ago`
  }
  const d = new Date(unix)
  return `on ${d.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"})}`
}

function formatDate(unix) {
  const ago = checkTimeAgo(unix)
  return checkSingular(ago)
}

module.exports = formatDate