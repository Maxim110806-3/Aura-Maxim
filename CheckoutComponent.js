import { closeCartModal } from "./CartComponent.js";

function t(key) {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  return (
    (window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]) ||
    key
  );
}

export function renderCheckoutModal() {
  let modal = document.querySelector(".cart-modal");
  let overlay = document.querySelector(".cart-overlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "cart-modal";
    document.body.appendChild(modal);
  }
  modal.classList.add("checkout-modal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    document.body.appendChild(overlay);
    overlay.onclick = closeCartModal;
  }
  overlay.style.display = "block";
  modal.style.display = "block";
  modal.innerHTML = `
    <button class="cart-modal-close" aria-label="Close">&times;</button>
    <form class="checkout-form">
      <h2 class="checkout-title">${t("checkout_title")}</h2>
      <div class="secure-connection">
        <svg width="18" height="18" fill="#4caf50" style="vertical-align:middle;margin-right:6px;" viewBox="0 0 24 24"><path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2zm6-7V7a6 6 0 0 0-12 0v3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-8-3a4 4 0 0 1 8 0v3H6V7z"/></svg>
        <span style="color:#4caf50;font-weight:600;">${t(
          "checkout_secure"
        )}</span>
      </div>
      <label class="checkout-label">
        ${t("checkout_email")}
        <input type="email" class="checkout-input" placeholder="aura@gmail.com" required>
      </label>
      <div class="checkout-label" style="margin-bottom: 0;">
        ${t("checkout_card_info")}
        <div class="checkout-card-row">
          <input type="text" class="checkout-input" placeholder="${t(
            "checkout_card_placeholder"
          )}" maxlength="19" required>
          <span class="checkout-card-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" class="card-logo card-logo-visa">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="card-logo card-logo-mastercard">
          </span>
        </div>
        <div class="checkout-card-row">
          <input type="text" class="checkout-input" placeholder="${t(
            "checkout_expiry_placeholder"
          )}" maxlength="5" style="width:48%;" required>
          <input type="text" class="checkout-input" placeholder="${t(
            "checkout_cvc_placeholder"
          )}" maxlength="3" style="width:48%;" required>
        </div>
      </div>
      <label class="checkout-label">
        ${t("checkout_cardholder")}
        <input type="text" class="checkout-input" placeholder="${t(
          "checkout_cardholder_placeholder"
        )}" required>
      </label>
      <label class="checkout-label">
        ${t("checkout_country")}
        <select class="checkout-input">
          <option>${t("checkout_country_md")}</option>
          <option>${t("checkout_country_ro")}</option>
          <option>${t("checkout_country_fr")}</option>
          <option>${t("checkout_country_it")}</option>
          <option>${t("checkout_country_us")}</option>
        </select>
      </label>
      <label class="checkout-checkbox">
        <input type="checkbox" />
        ${t("checkout_save_payment")}
      </label>
      <div class="save-card-form" style="display:none; margin-top:10px;">
        <label class="checkout-label">
          ${t("checkout_save_card_label")}
          <input type="text" class="checkout-input" placeholder="${t(
            "checkout_save_card_placeholder"
          )}" maxlength="30">
        </label>
      </div>
      <button type="submit" class="cart-modal-checkout" style="margin-top:18px;">${t(
        "checkout_pay"
      )}</button>
    </form>
  `;
  modal.querySelector(".cart-modal-close").onclick = closeCartModal;
  modal.querySelector(".checkout-form").onsubmit = (e) => {
    e.preventDefault();
    alert("Payment not implemented.");
  };

  // --- Card number formatting ---
  const cardInput = modal.querySelector(
    'input[placeholder="1234 1234 1234 1234"]'
  );
  cardInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // doar cifre
    value = value.slice(0, 16); // max 16 cifre
    e.target.value = value.replace(/(.{4})/g, "$1 ").trim(); // grupat 4 câte 4
  });

  // --- Expiry formatting (MM/YY) ---
  const expiryInput = modal.querySelector('input[placeholder="MM/YY"]');
  expiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    e.target.value = value;
  });

  // --- CVC password + eye icon ---
  const cvcInput = modal.querySelector('input[placeholder="CVC"]');
  cvcInput.type = "password";
  cvcInput.maxLength = 3;
  cvcInput.style.paddingRight = "36px";

  // Creează iconița ochi
  const eyeBtn = document.createElement("button");
  eyeBtn.type = "button";
  eyeBtn.tabIndex = -1;
  eyeBtn.style.position = "absolute";
  eyeBtn.style.right = "10px";
  eyeBtn.style.top = "60%";
  eyeBtn.style.transform = "translateY(-50%)";
  eyeBtn.style.background = "none";
  eyeBtn.style.border = "none";
  eyeBtn.style.cursor = "pointer";
  eyeBtn.style.padding = "0";
  eyeBtn.style.margin = "0";
  eyeBtn.innerHTML = `<svg width="18" height="18" fill="#b884af" viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>`;

  // Plasează iconița lângă inputul CVC
  const cvcRow = expiryInput.parentElement;
  cvcRow.style.position = "relative";
  cvcInput.parentElement.style.position = "relative";
  cvcInput.parentElement.appendChild(eyeBtn);

  // Show/hide la apăsare lungă
  eyeBtn.addEventListener("mousedown", () => {
    cvcInput.type = "text";
  });
  eyeBtn.addEventListener("mouseup", () => {
    cvcInput.type = "password";
  });
  eyeBtn.addEventListener("mouseleave", () => {
    cvcInput.type = "password";
  });
  eyeBtn.addEventListener("touchstart", () => {
    cvcInput.type = "text";
  });
  eyeBtn.addEventListener("touchend", () => {
    cvcInput.type = "password";
  });

  cvcInput.addEventListener("input", (e) => {
    // Permite doar cifre
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
  });

  // --- Card logo animation based on prefix ---
  const visaLogo = modal.querySelector(".card-logo-visa");
  const mcLogo = modal.querySelector(".card-logo-mastercard");

  function updateCardLogoAnimation(value) {
    // Prefixe Visa: 4, Mastercard: 51-55, 2221-2720
    const digits = value.replace(/\D/g, "");
    visaLogo.classList.remove("active");
    mcLogo.classList.remove("active");
    visaLogo.classList.remove("hide");
    mcLogo.classList.remove("hide");

    if (/^4/.test(digits)) {
      visaLogo.classList.add("active");
      mcLogo.classList.add("hide");
    } else if (
      /^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7([01]\d|20)))\d*/.test(digits)
    ) {
      mcLogo.classList.add("active");
      visaLogo.classList.add("hide");
    } else if (digits.length === 0) {
      visaLogo.classList.remove("active", "hide");
      mcLogo.classList.remove("active", "hide");
    } else {
      // Dacă nu e recunoscut, arată ambele faded
      visaLogo.classList.remove("active");
      mcLogo.classList.remove("active");
      visaLogo.classList.remove("hide");
      mcLogo.classList.remove("hide");
    }
  }

  cardInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
    updateCardLogoAnimation(value);
  });

  updateCardLogoAnimation(cardInput.value);
}
