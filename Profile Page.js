document.addEventListener("DOMContentLoaded", function () {
  const btnDelete = document.querySelector(".preferences-btn-delete");
  const modal = document.getElementById("delete-account-modal");
  const btnModalDelete = document.querySelector(".modal-btn-delete");
  const btnModalCancel = document.querySelector(".modal-btn-cancel");
  if (btnDelete && modal && btnModalDelete && btnModalCancel) {
    btnDelete.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "flex";
    });
    btnModalCancel.addEventListener("click", function () {
      modal.style.display = "none";
    });
    btnModalDelete.addEventListener("click", function () {
      const loggedIn = localStorage.getItem("loggedInUser");
      let users = JSON.parse(localStorage.getItem("userProfiles")) || [];
      users = users.filter((u) => u.email !== loggedIn);
      localStorage.setItem("userProfiles", JSON.stringify(users));
      localStorage.removeItem("userProfile");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("skinProfile");
      window.location.href = "SignUp Page.html";
    });
    // Închide modalul dacă dai click pe overlay
    modal
      .querySelector(".modal-overlay")
      .addEventListener("click", function () {
        modal.style.display = "none";
      });
  }
});

// --- FUNCȚIE NOUĂ PENTRU AFIȘARE NUME HEADER PROFILE ---
function renderProfileHeaderName() {
  const usernameSpan = document.querySelector(".profile-username");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("userProfile"));
  } catch {}
  let first = user && user.firstName ? user.firstName : "";
  let last = user && user.lastName ? user.lastName : "";
  let fullName = (first + (last ? " " + last : "")).trim();
  if (usernameSpan) {
    usernameSpan.textContent = fullName || "User";
  }
}
// --- END FUNCȚIE NOUĂ ---

// Ascultă modificări în localStorage (inclusiv din alte taburi)
window.addEventListener("storage", function (e) {
  if (e.key === "userProfile" || e.key === "userProfiles") {
    renderProfileHeaderName();
  }
});

// Apel la inițializare și pe evenimente relevante

document.addEventListener("DOMContentLoaded", function () {
  // Verifică dacă există utilizator logat
  const loggedIn = localStorage.getItem("loggedInUser");
  const user = JSON.parse(localStorage.getItem("userProfile"));
  if (!loggedIn || !user || user.email !== loggedIn) {
    window.location.href = "SignUp Page.html";
    return;
  }
  // Actualizează numele în header IMEDIAT după ce DOM-ul e gata
  renderProfileHeaderName();
  // Imagine profil
  const avatarImg = document.getElementById("profile-avatar-img");
  const avatarSvg = document.getElementById("profile-avatar-svg");
  if (user.profileImage) {
    avatarImg.src = user.profileImage;
    avatarImg.style.display = "block";
    avatarSvg.style.display = "none";
  } else {
    avatarImg.style.display = "none";
    avatarSvg.style.display = "block";
  }
  // Skin Profile (Skin Type & Concerns) - preia EXCLUSIV din localStorage.skinProfile
  let skinProfile = null;
  // Ia skinProfile DOAR din userProfile, nu din userProfiles
  let userProfile = null;
  try {
    userProfile = JSON.parse(localStorage.getItem("userProfile"));
  } catch {}
  if (userProfile && userProfile.skinProfile) {
    skinProfile = userProfile.skinProfile;
  } else {
    try {
      skinProfile = JSON.parse(localStorage.getItem("skinProfile"));
    } catch {}
  }
  let skinType = "None";
  let skinConcerns = "None";
  if (skinProfile) {
    if (skinProfile.type && skinProfile.type !== "") {
      skinType = skinProfile.type;
    }
    if (skinProfile.concerns && skinProfile.concerns.length > 0) {
      if (Array.isArray(skinProfile.concerns)) {
        skinConcerns = skinProfile.concerns.filter(Boolean).join(", ");
      } else if (
        typeof skinProfile.concerns === "string" &&
        skinProfile.concerns !== ""
      ) {
        skinConcerns = skinProfile.concerns;
      }
    }
  }
  // Actualizează valorile în profil (folosește direct span-urile din Skin Profile)
  var skinTypeSpan = document.querySelectorAll(
    ".profile-skin-row .profile-skin-value"
  )[0];
  if (skinTypeSpan) {
    skinTypeSpan.textContent = skinType;
    skinTypeSpan.setAttribute(
      "data-i18n",
      skinType === "None"
        ? "profile_skin_value_none"
        : "profile_skin_value_" + skinType.toLowerCase().replace(/\s+/g, "_")
    );
  }
  var skinConcernsSpan = document.querySelectorAll(
    ".profile-skin-row .profile-skin-value"
  )[1];
  if (skinConcernsSpan) {
    skinConcernsSpan.textContent = skinConcerns;
    if (skinConcerns === "None") {
      skinConcernsSpan.setAttribute("data-i18n", "profile_skin_value_none");
    } else if (skinProfile && Array.isArray(skinProfile.concerns)) {
      // Folosește doar primul concern dacă există mai multe pentru i18n (pentru traducere corectă)
      skinConcernsSpan.setAttribute(
        "data-i18n",
        "profile_skin_value_" +
          skinProfile.concerns[0].toLowerCase().replace(/\s+/g, "_")
      );
    } else {
      // fallback pentru string simplu
      skinConcernsSpan.setAttribute(
        "data-i18n",
        "profile_skin_value_" + skinConcerns.toLowerCase().replace(/\s+/g, "_")
      );
    }
  }
  // Elimină complet rândul pentru Sensitivity
  const skinRows = document.querySelectorAll(".profile-skin-row");
  if (skinRows.length > 2) {
    skinRows[2].remove();
  }
  // Buton schimbare imagine
  const changeBtn = document.getElementById("change-avatar-btn");
  const fileInput = document.getElementById("profile-image-input");
  if (changeBtn && fileInput) {
    changeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      fileInput.click();
    });
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          const dataUrl = evt.target.result;
          // Verifică dacă imaginea a fost încărcată corect
          if (
            !dataUrl ||
            typeof dataUrl !== "string" ||
            !dataUrl.startsWith("data:image/")
          ) {
            alert("Eroare la încărcarea imaginii. Încearcă alt fișier.");
            return;
          }
          let users = JSON.parse(localStorage.getItem("userProfiles")) || [];
          const loggedIn = localStorage.getItem("loggedInUser");
          const idx = users.findIndex((u) => u.email === loggedIn);
          if (idx !== -1) {
            users[idx].profileImage = dataUrl;
            localStorage.setItem("userProfiles", JSON.stringify(users));
            localStorage.setItem("userProfile", JSON.stringify(users[idx]));
            avatarImg.src = dataUrl;
            avatarImg.style.display = "block";
            avatarSvg.style.display = "none";
          } else {
            alert("Nu s-a găsit utilizatorul logat pentru a salva imaginea.");
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Te rugăm să selectezi un fișier imagine valid (jpg, png, etc).");
      }
    });
  }
});
// Apel de siguranță la finalul scriptului, pentru orice eventualitate
renderProfileHeaderName();
// Buton logout
const logoutBtn = document.querySelector(".logout-btn-custom");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("loggedInUser", "");
    window.location.href = "SignUp Page.html";
  });
}
// --- SELECTORI PENTRU SECȚIUNI ȘI BUTOANE ---
const profileSide = document.getElementById("profile-side-main");
const editForm = document.getElementById("profile-edit-form");
const preferencesSection = document.getElementById("profile-preferences-form");
const btnEditProfile = document.querySelectorAll(".profile-settings-btn")[0];
const btnPreferences = document.querySelectorAll(".profile-settings-btn")[1];

// --- EVENIMENT: Edit Profile ---
if (btnEditProfile && profileSide && editForm && preferencesSection) {
  btnEditProfile.addEventListener("click", function (e) {
    e.preventDefault();
    profileSide.style.display = "none";
    preferencesSection.style.display = "none";
    editForm.style.display = "block";
    // Populează formularul cu datele userului
    const user = JSON.parse(localStorage.getItem("userProfile"));
    if (user) {
      editForm.querySelector('[name="firstName"]').value = user.firstName || "";
      editForm.querySelector('[name="lastName"]').value = user.lastName || "";
      editForm.querySelector('[name="email"]').value = user.email || "";
      editForm.querySelector('[name="password"]').value = user.pass || "";
      editForm.querySelector('[name="confirmPassword"]').value =
        user.pass || "";
    }
  });
}
// --- EVENIMENT: Preferences ---
if (btnPreferences && profileSide && editForm && preferencesSection) {
  btnPreferences.addEventListener("click", function (e) {
    e.preventDefault();
    profileSide.style.display = "none";
    editForm.style.display = "none";
    preferencesSection.style.display = "block";
  });
}

function refreshProfileEditLanguage() {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  // Update all [data-i18n] in Edit Profile form
  document.querySelectorAll("#profile-edit-form [data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (
      window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]
    ) {
      // For input fields, update placeholder
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = window.translations[lang][key];
      } else {
        el.textContent = window.translations[lang][key];
      }
    }
  });
}
// Run on languagechange and DOMContentLoaded
window.addEventListener("languagechange", refreshProfileEditLanguage);
document.addEventListener("DOMContentLoaded", refreshProfileEditLanguage);
// --- DARK/LIGHT MODE LOGIC ---
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
// La încărcare, aplică tema din localStorage dacă există
const savedTheme = localStorage.getItem("site-theme");
if (savedTheme) applyTheme(savedTheme);
// Butoane pentru schimbare temă
document.addEventListener("DOMContentLoaded", function () {
  const btnDark = document.querySelector(".preferences-btn-dark");
  const btnLight = document.querySelector(".preferences-btn-light");
  if (btnDark) {
    btnDark.addEventListener("click", function () {
      applyTheme("dark");
      localStorage.setItem("site-theme", "dark");
    });
  }
  if (btnLight) {
    btnLight.addEventListener("click", function () {
      applyTheme("light");
      localStorage.setItem("site-theme", "light");
    });
  }
});
// --- DELETE ACCOUNT BUTTON ---
document.addEventListener("DOMContentLoaded", function () {
  const btnDelete = document.querySelector(".preferences-btn-delete");
  const modal = document.getElementById("delete-account-modal");
  const btnModalDelete = document.querySelector(".modal-btn-delete");
  const btnModalCancel = document.querySelector(".modal-btn-cancel");
  if (btnDelete && modal && btnModalDelete && btnModalCancel) {
    btnDelete.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "flex";
    });
    btnModalCancel.addEventListener("click", function () {
      modal.style.display = "none";
    });
    btnModalDelete.addEventListener("click", function () {
      const loggedIn = localStorage.getItem("loggedInUser");
      let users = JSON.parse(localStorage.getItem("userProfiles")) || [];
      users = users.filter((u) => u.email !== loggedIn);
      localStorage.setItem("userProfiles", JSON.stringify(users));
      localStorage.removeItem("userProfile");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("skinProfile");
      window.location.href = "SignUp Page.html";
    });
    modal
      .querySelector(".modal-overlay")
      .addEventListener("click", function () {
        modal.style.display = "none";
      });
  }
});

(function () {
  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
})();

// Funcție pentru a afișa obiectele favorite din localStorage (favoriteProducts conține doar id-uri)
// și pentru a salva produsele favorite complet în localStorage pentru afișare rapidă
window.renderFavoriteProductsInSavedItems = function () {
  // Ia lista de id-uri favorite
  const favIds = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
  // Ia toate produsele din Products.json (cache sau fetch)
  function getAllProducts(callback) {
    let cached = localStorage.getItem("allProductsCache");
    if (cached) {
      try {
        callback(JSON.parse(cached));
        return;
      } catch {}
    }
    fetch("Products.json")
      .then((r) => r.json())
      .then((data) => {
        localStorage.setItem("allProductsCache", JSON.stringify(data));
        callback(data);
      })
      .catch(() => callback([]));
  }

  getAllProducts(function (allProducts) {
    // Salvează produsele favorite complet în localStorage pentru persistență
    let favProducts = allProducts.filter((p) => favIds.includes(p.id));
    // Sincronizează favoritele complete în localStorage (opțional, pentru persistență)
    localStorage.setItem("favoriteProductsFull", JSON.stringify(favProducts));

    // Afișează favoritele în Saved Items
    const savedSection = document.getElementById("profile-saved-items");
    if (!savedSection) return;
    savedSection.style.display = "block";
    // Ascunde restul dashboard-ului dacă vrei doar Saved Items
    const dashboard = document.querySelector(".profile-dashboard");
    if (dashboard) dashboard.style.display = "none";
    // Stil pentru full page (opțional)
    savedSection.style.position = "absolute";
    savedSection.style.top = "0";
    savedSection.style.left = "0";
    savedSection.style.width = "100vw";
    savedSection.style.minHeight = "100vh";
    savedSection.style.background = "#f3e3ef";
    savedSection.style.zIndex = "100";
    savedSection.style.display = "flex";
    savedSection.style.flexDirection = "column";
    savedSection.style.alignItems = "center";
    savedSection.style.justifyContent = "flex-start";
    savedSection.style.padding = "4vw 0";

    // Buton back (opțional)
    let backBtn = savedSection.querySelector("#back-to-profile-btn");
    if (!backBtn) {
      backBtn = document.createElement("button");
      backBtn.id = "back-to-profile-btn";
      backBtn.textContent = "Back to Profile";
      backBtn.style =
        "margin-bottom:18px;padding:8px 18px;border-radius:8px;background:#d1b3c7;color:#fff;border:none;cursor:pointer;font-size:1rem;";
      savedSection.prepend(backBtn);
    }
    backBtn.style.display = "inline-block";
    backBtn.onclick = function () {
      savedSection.style = "";
      if (dashboard) dashboard.style.display = "";
      savedSection.style.display = "none";
    };

    // Container Saved Items
    const container =
      savedSection.querySelector(".saved-items-list") ||
      document.createElement("div");
    container.className = "saved-items-list";
    if (favProducts.length === 0) {
      container.innerHTML =
        '<div style="text-align:center;color:var(--primary-300);font-size:1.2rem;padding:2vw 0;">No favorite items yet.</div>';
    } else {
      container.style.display = "grid";
      container.style.gridTemplateColumns = "1fr 1fr";
      container.style.gap = "32px";
      container.style.width = "90vw";
      container.style.maxWidth = "900px";
      container.style.margin = "0 auto";
      container.innerHTML = favProducts
        .map(
          (item) => `
      <div class="saved-item-card">
        <img class="saved-item-img" src="${item.image || ""}" alt="${
            item.name || ""
          }" />
        <div class="saved-item-info">
          <div class="saved-item-title" data-i18n="product_${item.id}_name">${
            item.name || ""
          }</div>
          <div class="saved-item-meta">
            <span data-i18n="product_${item.id}_category">${
            item.category || ""
          }</span>
            <span data-i18n="product_${item.id}_brand">${
            item.brand || ""
          }</span>
            <span data-i18n="product_${item.id}_country">${
            item.country || ""
          }</span>
          </div>
          <div class="saved-item-price" data-i18n="product_${item.id}_price">
            ${item.currency_price ? item.currency_price : item.price || ""} 
            <span data-i18n="currency">${item.currency || "lei"}</span>
          </div>
          <div class="saved-item-actions">
            <button class="saved-item-addcart" data-id="${
              item.id
            }" data-i18n="add_to_cart">Add to cart</button>
            <button class="saved-item-heart active" data-id="${
              item.id
            }" title="Remove from favorites">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#f40b0b" viewBox="0 0 256 256"><path d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `
        )
        .join("");
    }
    // Adaugă containerul dacă nu există deja
    if (!savedSection.contains(container)) {
      savedSection.appendChild(container);
    }
    // Event pentru remove from favorites
    container.querySelectorAll(".saved-item-heart").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-id");
        let favs = JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
        favs = favs.filter((fid) => String(fid) !== String(id));
        localStorage.setItem("favoriteProducts", JSON.stringify(favs));
        // Șterge și din favoriteProductsFull pentru consistență
        let favFull = JSON.parse(
          localStorage.getItem("favoriteProductsFull") || "[]"
        );
        favFull = favFull.filter((p) => String(p.id) !== String(id));
        localStorage.setItem("favoriteProductsFull", JSON.stringify(favFull));
        // Reafișează lista
        window.renderFavoriteProductsInSavedItems();
      });
    });
    // Event pentru add to cart (dummy)
    container.querySelectorAll(".saved-item-addcart").forEach((btn) => {
      btn.addEventListener("click", function () {
        alert("Added to cart! (implementare demo)");
      });
    });
  });
};

// --- FUNCȚIE DE TRADUCERE DINAMICĂ PENTRU SAVED ITEMS ---
function translateSavedItemsSection() {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  if (!window.translations || !window.translations[lang]) return;
  const savedSection = document.getElementById("profile-saved-items");
  if (!savedSection) return;
  savedSection.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    let value = window.translations[lang][key];
    // Fallback: dacă nu există cheia, încearcă să extragi tipul (ex: product_123_name)
    if (value === undefined && key && key.startsWith("product_")) {
      // Extrage id și field
      const m = key.match(/^product_(.+?)_([a-z]+)$/);
      if (m) {
        const [, id, field] = m;
        // Încearcă fallback-uri pentru field-uri standard
        if (field === "name" && window.translations[lang][`products_${id}`]) {
          value = window.translations[lang][`products_${id}`];
        } else if (
          field === "category" &&
          window.translations[lang][`products_${id}_category`]
        ) {
          value = window.translations[lang][`products_${id}_category`];
        } else if (
          field === "brand" &&
          window.translations[lang][`products_${id}_brand`]
        ) {
          value = window.translations[lang][`products_${id}_brand`];
        } else if (
          field === "country" &&
          window.translations[lang][`products_${id}_country`]
        ) {
          value = window.translations[lang][`products_${id}_country`];
        } else if (
          field === "price" &&
          window.translations[lang][`products_${id}_price`]
        ) {
          value = window.translations[lang][`products_${id}_price`];
        }
      }
    }
    // Fallback: dacă nu există, lasă textul original
    if (value !== undefined) {
      el.textContent = value;
    }
  });
}
// Rulează la schimbarea limbii și după randarea Saved Items
window.addEventListener("languagechange", translateSavedItemsSection);

// Saved Items: afișare pe mijloc, doar cod minim, afișează favoritele reale din localStorage (obiecte întregi)
document.addEventListener("DOMContentLoaded", function () {
  const btnSavedItems = document.querySelectorAll(".profile-settings-btn")[2];
  const savedItemsSection = document.getElementById("profile-saved-items");
  const dashboard = document.querySelector(".profile-dashboard");

  if (btnSavedItems && savedItemsSection) {
    btnSavedItems.addEventListener("click", async function (e) {
      e.preventDefault();
      if (dashboard) dashboard.style.display = "none";

      // Mută secțiunea în body dacă nu e deja acolo
      if (savedItemsSection.parentElement !== document.body) {
        document.body.insertBefore(
          savedItemsSection,
          document.body.querySelector("footer") || null
        );
      }

      savedItemsSection.classList.add("saved-items-fullpage");
      savedItemsSection.style.display = "flex";

      const title = savedItemsSection.querySelector(".saved-items-title");
      if (title) {
        title.classList.add("saved-items-title-fullpage");
        title.setAttribute("data-i18n", "profile_settings_saved");
      }

      let container = savedItemsSection.querySelector(".saved-items-list");
      if (!container) {
        container = document.createElement("div");
        container.className = "saved-items-list";
        savedItemsSection.appendChild(container);
      }
      container.classList.add("saved-items-list-fullpage");

      // Ia favoritele ca obiecte întregi
      const favProducts = JSON.parse(
        localStorage.getItem("favoriteProducts") || "[]"
      );
      const lang =
        window.currentLang || localStorage.getItem("site-lang") || "en";

      // Conversie prețuri async pentru toate produsele favorite
      let convertedPrices = [];
      if (typeof window.convertPrice === "function") {
        convertedPrices = await Promise.all(
          favProducts.map((item) => window.convertPrice(item.price, lang))
        );
      } else {
        convertedPrices = favProducts.map((item) => ({
          value: item.price,
          symbol: item.currency || "lei",
        }));
      }

      if (favProducts.length === 0) {
        container.innerHTML =
          '<div data-i18n="saved_items_empty" style="grid-column:1/-1;text-align:center;color:#a07a9c;font-size:1.2rem;padding:2vw 0;">No items in this section.</div>';
      } else {
        container.innerHTML = favProducts
          .map((item, idx) => {
            const converted = convertedPrices[idx] || {
              value: item.price,
              symbol: item.currency || "lei",
            };
            return `
              <div class="saved-item-card">
                <img class="saved-item-img" src="${item.image || ""}" alt="${
              window.translateProductField
                ? window.translateProductField(item.name)
                : item.name || ""
            }" />
                <div class="saved-item-info">
                  <div class="saved-item-title" data-i18n="product_${
                    item.id
                  }_name">${
              window.translateProductField
                ? window.translateProductField(item.name)
                : item.name || ""
            }</div>
                  <div class="saved-item-meta">
                    <span data-i18n="product_${item.id}_category">${
              window.translateProductField
                ? window.translateProductField(item.category)
                : item.category || ""
            }</span>
                    <span data-i18n="product_${item.id}_country">${
              window.translateProductField
                ? window.translateProductField(item.country)
                : item.country || ""
            }</span>
                    <span data-i18n="product_${item.id}_brand">${
              window.translateProductField
                ? window.translateProductField(item.brand)
                : item.brand || ""
            }</span>
                  </div>
                  <div class="saved-item-price" data-i18n="product_${
                    item.id
                  }_price">${converted.value} <span data-i18n="currency">${
              converted.symbol
            }</span></div>
                  <div class="saved-item-actions">
                    <button class="saved-item-addcart" data-id="${
                      item.id
                    }" data-i18n="add_to_cart">Add to cart</button>
                    <button class="saved-item-heart active" data-id="${
                      item.id
                    }" title="Remove from favorites">
                      <svg viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 5.6 9.28c-1.5 2.04-.44 5.12 2.54 7.05l.1.07.1-.07c2.98-1.93 4.04-5.01 2.54-7.05-1.5-2.04-4.54-2.68-6.04-.64z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }

      let backBtn = savedItemsSection.querySelector("#back-to-profile-btn");
      if (!backBtn) {
        backBtn = document.createElement("button");
        backBtn.id = "back-to-profile-btn";
        backBtn.textContent = "Back to Profile";
        backBtn.className = "back-to-profile-btn-fullpage";
        backBtn.setAttribute("data-i18n", "back_to_profile");
        savedItemsSection.prepend(backBtn);
      }
      backBtn.style.display = "inline-block";
      backBtn.onclick = function () {
        if (dashboard) dashboard.style.display = "";
        const profileContent = document.querySelector(".profile-content");
        if (
          profileContent &&
          savedItemsSection.parentElement !== profileContent
        ) {
          profileContent.appendChild(savedItemsSection);
        }
        savedItemsSection.classList.remove("saved-items-fullpage");
        if (title) title.classList.remove("saved-items-title-fullpage");
        container.classList.remove("saved-items-list-fullpage");
        backBtn.style.display = "none";
        savedItemsSection.style.display = "none";
      };

      // Remove from favorites direct din Saved Items
      container.querySelectorAll(".saved-item-heart").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = btn.getAttribute("data-id");
          let favs = JSON.parse(
            localStorage.getItem("favoriteProducts") || "[]"
          );
          favs = favs.filter((p) => String(p.id) !== String(id));
          localStorage.setItem("favoriteProducts", JSON.stringify(favs));
          // Reafișează lista
          btn.closest(".saved-item-card").remove();
          if (favs.length === 0) {
            container.innerHTML =
              '<div data-i18n="saved_items_empty" style="grid-column:1/-1;text-align:center;color:#a07a9c;font-size:1.2rem;padding:2vw 0;">No items in this section.</div>';
          }
          if (typeof translateSavedItemsSection === "function")
            translateSavedItemsSection();
        });
      });

      // Apelare traducere după afișare
      if (typeof translateSavedItemsSection === "function")
        translateSavedItemsSection();
    });
  }
});

// --- FUNCȚIE NOUĂ PENTRU AFINARE ȘI ASCUNDERE SECTIUNI ---
function refineAndHideSections() {
  const profileSide = document.getElementById("profile-side-main");
  const editForm = document.getElementById("profile-edit-form");
  const preferencesSection = document.getElementById(
    "profile-preferences-form"
  );
  const savedItemsSection = document.getElementById("profile-saved-items");
  const dashboard = document.querySelector(".profile-dashboard");
  // Ascunde toate secțiunile
  if (profileSide) profileSide.style.display = "none";
  if (editForm) editForm.style.display = "none";
  if (preferencesSection) preferencesSection.style.display = "none";
  if (savedItemsSection) savedItemsSection.style.display = "none";
  // Afișează dashboard-ul (profilul utilizatorului)
  if (dashboard) dashboard.style.display = "flex";
}
// --- END FUNCȚIE NOUĂ ---
