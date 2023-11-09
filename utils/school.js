const fs = require("fs")
const path = require("path")

function getSelected() {
	const schools = JSON.parse(fs.readFileSync(path.join(__dirname, "../schools.json"), "utf-8"))
  let selected = schools.find(school => school.selected)
  if (!selected) selected = schools.find(school => school.id === "husky")
	return selected
}

module.exports = getSelected