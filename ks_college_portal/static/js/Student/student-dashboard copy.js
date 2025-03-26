document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Set current date
  const currentDateElement = document.getElementById("currentDate")
  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("en-US", options)
  }

  // Add circular chart CSS
  const style = document.createElement("style")
  style.textContent = `
        .circular-chart {
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .circle-bg {
            fill: none;
            stroke: #eee;
            stroke-width: 2;
        }
        
        .circle {
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            animation: progress 1s ease-out forwards;
        }
        
        @keyframes progress {
            0% {
                stroke-dasharray: 0 100;
            }
        }
    `
  document.head.appendChild(style)
})

