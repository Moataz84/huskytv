function scaleFontSize(parent, defaultWidth) {
  const element = document.querySelector(parent)
  const paddingRight = parseInt(window.getComputedStyle(element).getPropertyValue("padding-right"))
  const paddingLeft = parseInt(window.getComputedStyle(element).getPropertyValue("padding-right"))
    
  const width = element.getBoundingClientRect().width - paddingRight - paddingLeft
  const factor = width / defaultWidth
  document.querySelectorAll(`${parent} *`).forEach(elem => {
    const fontSize = parseInt(elem.getAttribute("data-size")) * factor
    elem.style.fontSize = `${fontSize}px`
  })
}

document.querySelectorAll(".layout *").forEach(elem => {
  const originalSize = window.getComputedStyle(elem).getPropertyValue("font-size")
  elem.setAttribute("data-size", originalSize)
})

const resizeObserver = new ResizeObserver(() => {
  // Default Page Size 1269
  scaleFontSize(".banner", 985)
  scaleFontSize(".date-bubble", 240)
  scaleFontSize(".qr-codes-wrapper", 280)
  scaleFontSize(".announcements-wrapper", 320) // Default 280 --> 320
})

resizeObserver.observe(document.querySelector(".layout"))