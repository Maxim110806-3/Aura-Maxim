// Subscription Modal Component (modular, CartComponent style)

const SUBSCRIPTION_MODAL_HTML = `
  <div class="subscription-overlay" style="display: none"></div>
  <div class="subscription-modal" style="display: none">
    <button class="subscription-modal-close" aria-label="Close">&times;</button>
    <div class="subscription-modal-content">
      <div class="subscription-card basic">
        <div class="subscription-title" data-i18n="sub_basic_title">Nude Glow (Basic)</div>
        <ul class="subscription-features">
          <li data-i18n="sub_basic_feat1">✔ 3 product samples (skincare or make-up)</li>
          <li data-i18n="sub_basic_feat2">✔ Access to AI Analysis 3 times a day</li>
          <li data-i18n="sub_basic_feat3">✔ 5% discount on all orders</li>
          <li data-i18n="sub_basic_feat4">✔ Discount code -10% if you invite a friend</li>
          <li data-i18n="sub_basic_feat5">✔ Free standard shipping on orders over €150</li>
          <li class="disabled" data-i18n="sub_basic_feat6">✖ Priority access to new product launches</li>
          <li class="disabled" data-i18n="sub_basic_feat7">✖ Access to 1 professional video tutorial/month</li>
          <li class="disabled" data-i18n="sub_basic_feat8">✖ Access to monthly educational articles</li>
          <li class="disabled" data-i18n="sub_basic_feat9">✖ Anniversary birthday gift box (full-size, luxury)</li>
          <li class="disabled" data-i18n="sub_basic_feat10">✖ Badge digital „Diva Elite”</li>
        </ul>
        <div class="subscription-price" data-i18n="sub_basic_price">
          <span id="sub-price-basic"></span>
        </div>
        <button class="subscription-btn" data-plan="basic" data-i18n="sub_btn">Subscribe</button>
      </div>
      <div class="subscription-card gold">
        <div class="subscription-title" data-i18n="sub_gold_title">Rosy Blush (Gold)</div>
        <ul class="subscription-features">
          <li data-i18n="sub_gold_feat1">✔ 3 product deluxe</li>
          <li data-i18n="sub_gold_feat2">✔ Access to AI Analysis 25 times a day</li>
          <li data-i18n="sub_gold_feat3">✔ 15% discount on all orders</li>
          <li data-i18n="sub_gold_feat4">✔ Discount code -20% if you invite a friend</li>
          <li data-i18n="sub_gold_feat5">✔ Free standard shipping on orders over €50</li>
          <li data-i18n="sub_gold_feat6">✔ Priority access to new product launches</li>
          <li data-i18n="sub_gold_feat7">✔ Access to 1 professional video tutorial/month</li>
          <li data-i18n="sub_gold_feat8">✔ Access to monthly educational articles</li>
          <li class="disabled" data-i18n="sub_gold_feat9">✖ Anniversary birthday gift box (full-size, luxury)</li>
          <li class="disabled" data-i18n="sub_gold_feat10">✖ Badge digital „Diva Elite”</li>
        </ul>
        <div class="subscription-price" data-i18n="sub_gold_price">
          <span id="sub-price-gold"></span>
        </div>
        <button class="subscription-btn" data-plan="gold" data-i18n="sub_btn">Subscribe</button>
      </div>
      <div class="subscription-card elite">
        <div class="subscription-title" data-i18n="sub_elite_title">Glam Diva (Elite)</div>
        <ul class="subscription-features">
          <li data-i18n="sub_elite_feat1">✔ 3 product limited edition</li>
          <li data-i18n="sub_elite_feat2">✔ Unlimited access to AI Analysis</li>
          <li data-i18n="sub_elite_feat3">✔ 25% discount on all orders</li>
          <li data-i18n="sub_elite_feat4">✔ Discount code -30% if you invite a friend</li>
          <li data-i18n="sub_elite_feat5">✔ Free standard shipping on orders over €0</li>
          <li data-i18n="sub_elite_feat6">✔ Priority access to new product luxury launches</li>
          <li data-i18n="sub_elite_feat7">✔ Access to 5 professional video tutorial/month</li>
          <li data-i18n="sub_elite_feat8">✔ Access to weekly educational articles</li>
          <li data-i18n="sub_elite_feat9">✔ Anniversary birthday gift box (full-size, luxury)</li>
          <li data-i18n="sub_elite_feat10">✔ Badge digital „Diva Elite”</li>
        </ul>
        <div class="subscription-price" data-i18n="sub_elite_price">
          <span id="sub-price-elite"></span>
        </div>
        <button class="subscription-btn" data-plan="elite" data-i18n="sub_btn">Subscribe</button>
      </div>
    </div>
  </div>
`;

function ensureSubscriptionModal() {
  if (!document.querySelector(".subscription-modal")) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = SUBSCRIPTION_MODAL_HTML;
    // Insert overlay and modal into body
    document.body.appendChild(wrapper.firstElementChild);
    document.body.appendChild(wrapper.lastElementChild);
  }
}

// === Traducere explicită pentru modalul de abonament ===
window.translateSubscriptionModal = function () {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  if (!window.translations || !window.translations[lang]) return;
  const modal = document.querySelector(".subscription-modal");
  if (!modal) return;
  modal.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (window.translations[lang][key]) {
      el.textContent = window.translations[lang][key];
    }
  });
};

async function openSubscriptionModal() {
  ensureSubscriptionModal();
  document.querySelector(".subscription-overlay").style.display = "block";
  document.querySelector(".subscription-modal").style.display = "flex";
  document.body.style.overflow = "hidden";
  window.translateSubscriptionModal();
  await updateSubscriptionPrices();
}

function closeSubscriptionModal() {
  const overlay = document.querySelector(".subscription-overlay");
  const modal = document.querySelector(".subscription-modal");
  if (overlay) overlay.style.display = "none";
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "";
}

function setupSubscriptionModal() {
  ensureSubscriptionModal();
  // Close button
  document.querySelector(".subscription-modal-close").onclick =
    closeSubscriptionModal;
  // Overlay click closes
  document.querySelector(".subscription-overlay").onclick =
    closeSubscriptionModal;
  // Subscribe buttons
  document.querySelectorAll(".subscription-btn").forEach((btn) => {
    btn.onclick = function () {
      closeSubscriptionModal();
      import("./CheckoutComponent.js").then((module) => {
        module.renderCheckoutModal();
      });
    };
  });
  // ESC key closes
  document.addEventListener("keydown", function escListener(e) {
    if (e.key === "Escape") closeSubscriptionModal();
  });
  updateSubscriptionPrices();
}

// Auto-setup for .profile-sub-btn
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    setupSubscriptionModal();
    observeLangAndModalForPrices();
    const btn = document.querySelector(".profile-sub-btn");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openSubscriptionModal();
      });
    }
  });
}

async function updateSubscriptionPrices(forceLang) {
  // 1. Determină limba
  const lang =
    forceLang ||
    window.currentLang ||
    localStorage.getItem("site-lang") ||
    "en";
  // 2. Prețuri de bază în EUR
  const prices = {
    basic: 9.99,
    gold: 19.99,
    elite: 34.99,
  };
  // 3. Găsește span-urile
  const b = document.getElementById("sub-price-basic");
  const g = document.getElementById("sub-price-gold");
  const e = document.getElementById("sub-price-elite");
  if (!(b && g && e)) return;

  // 4. Obține cursul valutar dacă e nevoie
  let mdl = 19.2,
    rub = 95;
  if (lang === "ro" || lang === "ru") {
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=EUR&symbols=MDL,RUB&_t=" +
          Date.now()
      );
      const data = await res.json();
      if (data && data.rates) {
        mdl = Number(data.rates.MDL);
        rub = Number(data.rates.RUB);
      }
    } catch (e) {
      // fallback la valorile implicite
    }
  }

  // 5. Conversie și simbol
  function getPrice(val) {
    if (lang === "ro")
      return `${(val * mdl).toLocaleString("ro-RO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} lei`;
    if (lang === "ru")
      return `${(val * rub).toLocaleString("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ₽`;
    return `${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;
  }

  // 6. Actualizează DOM
  b.textContent = getPrice(prices.basic);
  g.textContent = getPrice(prices.gold);
  e.textContent = getPrice(prices.elite);
}

function observeLangAndModalForPrices() {
  let lastLang =
    window.currentLang || localStorage.getItem("site-lang") || "en";
  let modalVisible = false;
  setInterval(async () => {
    const lang =
      window.currentLang || localStorage.getItem("site-lang") || "en";
    const modal = document.querySelector(".subscription-modal");
    const overlay = document.querySelector(".subscription-overlay");
    const isVisible =
      modal &&
      overlay &&
      modal.style.display === "flex" &&
      overlay.style.display === "block";
    if (lang !== lastLang || isVisible !== modalVisible) {
      lastLang = lang;
      modalVisible = isVisible;
      if (isVisible) {
        // Asigură update și după 100ms pentru a prinde orice latență de DOM
        await updateSubscriptionPrices(lang);
        setTimeout(() => updateSubscriptionPrices(lang), 100);
      }
    }
  }, 200);
}

// Actualizează la încărcare și la schimbarea limbii
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    window.translateSubscriptionModal && window.translateSubscriptionModal();
    await updateSubscriptionPrices();
  });
  window.addEventListener("languagechange", async () => {
    window.translateSubscriptionModal && window.translateSubscriptionModal();
    await updateSubscriptionPrices();
  });
  window.addEventListener("subscription-i18n-updated", async () => {
    window.translateSubscriptionModal && window.translateSubscriptionModal();
    await updateSubscriptionPrices();
  });
}

export {
  openSubscriptionModal,
  closeSubscriptionModal,
  setupSubscriptionModal,
};
