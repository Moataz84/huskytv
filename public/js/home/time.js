function updateDate(unix) {
  const d = new Date(unix)
  const day = d.toLocaleString("en-US", {weekday: "long"})
  const month = d.toLocaleString("en-US", {month: "long"})
  const date = d.getDate()
  const year = d.getFullYear()
  const time = d.toLocaleString("en-US", {hour: "numeric", minute: "numeric", hour12: true}).split(" ")
  
  document.querySelector(".date > span").innerText = day
  document.querySelector(".date > span:last-of-type").innerText = `${month} ${date} ${year}`

  document.querySelector(".time > span").innerText = time[0]
  document.querySelector(".time > span:last-of-type").innerText = time[1]

  setHeight()
}

function setTimeOfDay(unix) {
  const d = new Date(unix)
  const hours = d.getHours()
  if (hours >= 12) {
    return document.querySelector(".greeting").innerText = "Good Afternoon!"
  } 
  document.querySelector(".greeting").innerText = "Good Morning!"
}

const now = new Date()
const nextMinute = new Date()
nextMinute.setMinutes(now.getMinutes() + 1)
nextMinute.setSeconds(0)

let unix = now.getTime()
updateDate(unix)
setTimeOfDay(unix)

setTimeout(() => {
  unix += nextMinute - now
  updateDate(unix)
  setTimeOfDay(unix)

  setInterval(() => {
    unix+=60000
    updateDate(unix)
    setTimeOfDay(unix)
  }, 60000)
}, nextMinute - now)