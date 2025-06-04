// Toast pentru update profil, identic structură cu showSignUpToast
export function showProfileToast(success = true, callback) {
  const toast = document.getElementById("profile-success-toast");
  if (!toast) return;
  let lang = localStorage.getItem("site-lang") || "en";
  let msg = {
    en: "Profile updated!",
    ro: "Profil actualizat!",
    ru: "Профиль обновлен!",
  };
  toast.textContent =
    success === true
      ? msg[lang] || msg.en
      : typeof success === "string"
      ? success
      : msg[lang] || msg.en;
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
