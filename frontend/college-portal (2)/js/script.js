// Set current date
const currentDateElement = document.getElementById("currentDate")
if (currentDateElement) {
const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
const today = new Date()
currentDateElement.textContent = today.toLocaleDateString("en-US", options)
}
