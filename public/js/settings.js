function showPassword() {
  const inputs = document.querySelectorAll("input:not([type=checkbox])")
  if (inputs[0].type === "text") {
    inputs.forEach(input => input.type = "password")
    return
  }
  inputs.forEach(input => input.type = "text")
}

function focusInput(e) {
  document.querySelector(".msg").innerText = ""
  return e.target.style.outline = "1px solid #1a73e8"
}

function blurInput(e) {
  document.querySelector(".msg").innerText = ""
  return e.target.style.outline = "1px solid #ccc"
}

async function changePassword(e) {
  e.preventDefault()
  const inputs = document.querySelectorAll("input:not([type=checkbox])")
  const msg = document.querySelector(".msg")
  const currentPassword = inputs[0].value
  const newPassword = inputs[1].value
  const repeatPassword = inputs[2].value

  if (!currentPassword || !newPassword || !repeatPassword) {
    return msg.innerText = "All fields are required"
  }

  if (newPassword.length < 8 || newPassword.includes(" ")) {
    return msg.innerText = "Password must be atleast 8 characters and can not contain spaces"
  }

  if (newPassword !== repeatPassword) {
    return msg.innerText = "Both passwords must match"
  }

  const res = await fetch("/api/change-password", {
    method: "POST",
    body: JSON.stringify({currentPassword, newPassword}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const data = await res.json()

  if (data.msg === "success") {
    return window.location.href = "/"
  }
  msg.innerText = data.msg
}

async function changeSchool(e) {
  e.preventDefault()
  const selected = document.querySelector("select").value
  await fetch("/api/change-school", {
    method: "POST",
    body: JSON.stringify({selected}),
    headers: {
      "Content-Type": "application/json"
    }
  })
  alert("School updated")
}