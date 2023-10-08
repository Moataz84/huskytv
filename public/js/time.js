function updateDate(unix) {
  const d = new Date(unix)
  const day = d.toLocaleString("en-us", {weekday:"long"})
  const month = d.toLocaleString("en-us", {month:"long"})
  const date = d.getDate()
  const year = d.getFullYear()
  const time = d.toLocaleString("en-US", {hour: "numeric", minute: "numeric", hour12: true})
  
  document.querySelector(".date").innerHTML = `<p>${day}</p> ${month} ${date} ${year}`
  document.querySelector(".time").innerText = time
}

function setTimeOfDay(hours) {
  if (hours >= 12) {
    document.querySelector(".greeting").innerText = "Good Afternoon"
    return
  } 
  document.querySelector(".greeting").innerText = "Good Morning"
}

const now = new Date()
const nextMinute = new Date()
nextMinute.setMinutes(now.getMinutes() + 1)
nextMinute.setSeconds(0)

let unix = now.getTime()
updateDate(unix)
setTimeOfDay(now.getHours())

setTimeout(() => {
  unix += nextMinute - now
  updateDate(unix)
  setTimeOfDay(now.getHours())

  setInterval(() => {
    unix+=60000
    updateDate(unix)
    setTimeOfDay(now.getHours())
  }, 60000)
}, nextMinute - now)