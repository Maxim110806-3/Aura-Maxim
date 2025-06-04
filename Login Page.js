// Login Page.js

function showToast(message, isSuccess = false, callback) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = isSuccess ? "toast-success" : "toast-error";
  toast.style.display = "block";
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => {
      toast.style.display = "none";
      toast.classList.remove("toast-hide");
      if (typeof callback === "function") callback();
    }, 350); // animatia de dispare mai rapida
  }, 1200);
}

function showLoginToast(success = true, callback) {
  const toast = document.getElementById("login-success-toast");
  if (!toast) return;
  toast.textContent = success
    ? "Login successful!"
    : "Invalid email or password!";
  toast.style.background = success ? "#1ed760" : "#e74c3c";
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

document.querySelector(".login-form").onsubmit = function (e) {
  e.preventDefault();
  const email = this.email.value.trim();
  const pass = this.password.value;
  let error = this.querySelector(".login-error");
  if (!error) {
    error = document.createElement("div");
    error.className = "login-error";
    error.style.display = "none";
    this.insertBefore(error, this.querySelector(".login-signup-link"));
  }
  error.style.display = "none";
  error.style.color = "#e74c3c";
  if (!email || !pass) {
    showLoginToast(false);
    return;
  }
  // Modificat: caută userul în lista userProfiles
  const users = JSON.parse(localStorage.getItem("userProfiles")) || [];
  const user = users.find((u) => u.email === email && u.pass === pass);
  if (!user) {
    showLoginToast(false);
    return;
  }
  // Login reușit
  localStorage.setItem("loggedInUser", user.email);
  // Salvează și datele userului curent pentru profil
  localStorage.setItem("userProfile", JSON.stringify(user));
  showLoginToast(true, function () {
    window.location.href = "Profile Page.html";
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

// Toast styles
const toastStyle = document.createElement("style");
toastStyle.innerHTML = `
#custom-toast {
  position: fixed;
  z-index: 9999;
  right: 40px;
  bottom: 40px;
  min-width: 240px;
  max-width: 340px;
  padding: 16px 28px;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.13);
  opacity: 0.98;
  pointer-events: none;
  transform: translateY(60px) scale(0.98);
  transition: opacity 0.4s cubic-bezier(.4,2,.6,1), transform 0.45s cubic-bezier(.4,2,.6,1);
}
.toast-success {
  background: #1ed760;
  right: 40px;
  bottom: 40px;
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-error {
  background: #e74c3c;
  right: 40px;
  bottom: 40px;
  opacity: 1;
  transform: translateY(0) scale(1);
}
#custom-toast.toast-hide {
  opacity: 0;
  transform: translateY(-40px) scale(0.95);
  transition: opacity 0.4s cubic-bezier(.4,2,.6,1), transform 0.45s cubic-bezier(.4,2,.6,1);
}
`;
document.head.appendChild(toastStyle);
