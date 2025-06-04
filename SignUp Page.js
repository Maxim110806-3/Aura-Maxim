function showSignUpToast(success = true, callback) {
  const toast = document.getElementById("signup-success-toast");
  if (!toast) return;
  toast.textContent = success
    ? "Account created successfully! Redirecting to login..."
    : typeof success === "string"
    ? success
    : "Sign up failed!";
  toast.style.background = success === true ? "#1ed760" : "#e74c3c";
  toast.style.display = "block";
  toast.classList.remove("hide");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.style.display = "none";
      toast.classList.remove("hide");
      if (typeof callback === "function") callback();
    }, 600);
  }, 2000);
}

document.querySelector(".signup-form").onsubmit = function (e) {
  e.preventDefault();
  const firstName = this.firstName.value.trim();
  const lastName = this.lastName.value.trim();
  const email = this.email.value.trim();
  const pass = this.password.value;
  const confirmPass = this.confirmPassword.value;
  const error = this.querySelector(".signup-error");
  error.style.display = "none";
  error.style.color = "#e74c3c";
  if (!firstName || !lastName || !email || !pass || !confirmPass) {
    showSignUpToast("All fields are required!");
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    showSignUpToast("Invalid email address!");
    return;
  }
  if (pass.length < 6) {
    showSignUpToast("Password must be at least 8 characters!");
    return;
  }
  if (pass !== confirmPass) {
    showSignUpToast("Passwords do not match!");
    return;
  }
  // Permite mai multe conturi
  let users = JSON.parse(localStorage.getItem("userProfiles")) || [];
  if (users.some((u) => u.email === email)) {
    showSignUpToast("An account with this email already exists!");
    return;
  }
  users.push({ firstName, lastName, email, pass });
  localStorage.setItem("userProfiles", JSON.stringify(users));
  showSignUpToast(true, function () {
    window.location.href = "Login Page.html";
  });
};

// Updated password toggle functionality using mousedown events
document.querySelectorAll(".toggle-password").forEach((icon) => {
  const targetId = icon.getAttribute("data-target");
  const input = document.getElementById(targetId);
  if (input) {
    icon.addEventListener("mousedown", () => {
      input.type = "text";
    });
    icon.addEventListener("mouseup", () => {
      input.type = "password";
    });
    icon.addEventListener("mouseleave", () => {
      input.type = "password";
    });
  }
});
