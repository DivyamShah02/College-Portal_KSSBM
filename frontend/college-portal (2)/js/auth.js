document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const togglePassword = document.getElementById("togglePassword")
  const password = document.getElementById("password")

  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      const type = password.getAttribute("type") === "password" ? "text" : "password"
      password.setAttribute("type", type)
      this.querySelector("i").classList.toggle("bi-eye")
      this.querySelector("i").classList.toggle("bi-eye-slash")
    })
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Mock authentication
      authenticateUser(email, password)
    })
  }
})

// Mock authentication function
function authenticateUser(email, password) {
  // Simulate API call
  setTimeout(() => {
    // For demo purposes, use simple logic to determine user type
    // In a real app, this would be determined by the server
    if (email.includes("teacher")) {
      // Redirect to teacher dashboard
      window.location.href = "teacher/dashboard.html"
    } else if (email.includes("student")) {
      // Redirect to student dashboard
      window.location.href = "student/dashboard.html"
    } else {
      // Show error for invalid credentials
      alert('Invalid email or password. For demo, use an email containing "teacher" or "student".')
    }
  }, 1000)
}

