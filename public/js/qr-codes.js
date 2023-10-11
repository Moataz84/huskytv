const qrCodes = document.querySelector(".qr-codes")
const codes = [
  {
    name: "Guidance",
    image: "/imgs/qr-codes/guidance.png"
  },
  {
    name: "Instagram",
    image: "/imgs/qr-codes/instagram.png"
  },
]

setInterval(() => {
  const current = qrCodes.children[1].querySelector("img").getAttribute("src")
  const next = codes.findIndex(code => code.image === current) + 1
  const nextImage = codes[next] != undefined? codes[next].image : codes[0].image
  const nextTitle = codes[next] != undefined? codes[next].name : codes[0].name
    
  qrCodes.style.animation = "move 1s linear forwards"
  const timeout = setTimeout(() => {
    qrCodes.style.animation = ""
    qrCodes.children[0].remove()
    qrCodes.insertAdjacentHTML(
      "beforeend", 
      `<div class="qr-code">
        <h3 data-size="20px">${nextTitle}</h3>
        <img src="${nextImage}">
      </div>`
      )
    clearTimeout(timeout)
  }, 1000)
  scaleFontSize(".qr-codes-wrapper", 280)
}, 5000)