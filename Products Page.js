import { addToCart } from "./CartComponent.js";

let products = [];
let filteredProducts = [];
const PRODUCTS_PER_PAGE = 9;
let currentPage = 1;
let currentCategory = "All Products";
let currentBrand = "All brands";
let currentCountry = "All Countries";
let searchTerm = "";

const FILTER_ALL_PRODUCTS = "all_products";
const FILTER_ALL_BRANDS = "all_brands";
const FILTER_ALL_COUNTRIES = "all_countries";

async function loadProducts() {
  try {
    const response = await fetch("Products.json");
    products = await response.json();
    filteredProducts = products;
    renderProducts();
    renderPagination();
    setupSidebarFilters();
    setupLiveSearch();
  } catch (e) {
    console.error("Eroare la încărcarea produselor:", e);
    const container = document.querySelector(".products-list");
    if (container) {
      container.innerHTML =
        "<div style='color:red'>Nu s-au putut încărca produsele.</div>";
    }
  }
}

function filterProducts() {
  filteredProducts = products.filter((p) => {
    // Normalizează și compară pentru search
    const matchSearch =
      !searchTerm ||
      window
        .translateProductField(p.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      window
        .translateProductField(p.category)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      window
        .translateProductField(p.brand)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      window
        .translateProductField(p.country)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Pentru filtre, compară cu cheia tradusă
    const matchCategory =
      currentCategory === "All Products" ||
      window.translateProductField(p.category) === currentCategory;
    const matchBrand =
      currentBrand === "All brands" ||
      window.translateProductField(p.brand) === currentBrand;
    const matchCountry =
      currentCountry === "All Countries" ||
      window.translateProductField(p.country) === currentCountry;

    return matchCategory && matchBrand && matchCountry && matchSearch;
  });
}

// 1. Funcție de traducere universală pentru produse
window.translateProductField = function (key) {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  if (!key) return "";
  if (
    window.translations &&
    window.translations[lang] &&
    window.translations[lang][key]
  ) {
    return window.translations[lang][key];
  }
  let normKey = key
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[+]/g, "plus")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!normKey.startsWith("products_")) {
    normKey = "products_" + normKey;
  }
  if (
    window.translations &&
    window.translations[lang] &&
    window.translations[lang][normKey]
  ) {
    return window.translations[lang][normKey];
  }
  return key;
};

// 2. Modifică renderProducts să folosească traducerea pentru name, category, brand, country
// Currency conversion utility - LIVE API
async function convertPrice(price, lang) {
  if (typeof price !== "number" || isNaN(price))
    return { value: 0, symbol: "" };
  if (lang === "en") {
    // EUR
    return { value: (price * 0.052).toFixed(2), symbol: "€" };
  } else if (lang === "ru") {
    // RUB
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=MDL&symbols=RUB&_t=" +
          Date.now()
      );
      const data = await res.json();
      const rubRate =
        data && data.rates && data.rates.RUB ? data.rates.RUB : 4.9;
      return { value: (price * rubRate).toFixed(2), symbol: "₽" };
    } catch {
      return { value: (price * 4.9).toFixed(2), symbol: "₽" };
    }
  } else {
    // MDL (lei)
    return { value: price.toFixed(2), symbol: "lei" };
  }
}

// Modifică renderProducts să fie async și să folosească conversia live
async function renderProducts() {
  filterProducts();
  const container = document.querySelector(".products-list");
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, end);
  const langForPrice =
    window.currentLang || localStorage.getItem("site-lang") || "en";

  // Afișează loader până se fac conversiile
  container.innerHTML =
    '<div style="text-align:center;padding:40px;">Loading...</div>';

  // Conversie live pentru fiecare produs
  const convertedPrices = await Promise.all(
    pageProducts.map((product) => convertPrice(product.price, langForPrice))
  );

  container.innerHTML = pageProducts
    .filter((product) => product)
    .map((product, idx) => {
      const converted = convertedPrices[idx];
      return `
    <div class="product-card">
      <div class="product-image" style="position:relative;">
        <img src="${product.image || ""}" alt="${
        window.translateProductField(product.name) || ""
      }" />
        <button class="product-info-btn" aria-label="Product info" data-product-id="${
          product.id
        }">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2" fill="none"/>
            <text x="12" y="12" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial" dy="0">i</text>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-title">${
          window.translateProductField(product.name) || ""
        }</div>
        <div class="product-tags">
          ${window.translateProductField(product.category) || ""} 
          ${window.translateProductField(product.country) || ""} 
          ${window.translateProductField(product.brand) || ""}
        </div>
        <div class="product-bottom">
          <div class="product-price">
            ${converted.value} ${converted.symbol}
          </div>
          <button class="product-info-btn" aria-label="Product info" data-product-id="${
            product.id
          }">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2" fill="none"/>
              <text x="12" y="16" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial" dy=".3em">i</text>
            </svg>
          </button>
          <button class="product-fav" aria-label="Add to favorites">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#63435e" viewBox="0 0 256 256">
              <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
            </svg>
          </button>
          <button class="product-cart" aria-label="Add to cart">${window.translateProductField(
            "add_to_cart"
          )}</button>
        </div>
      </div>
    </div>
  `;
    })
    .join("");

  // Adaugă eveniment pentru Add to cart
  document.querySelectorAll(".product-cart").forEach((btn, idx) => {
    btn.onclick = () => {
      const product =
        filteredProducts[(currentPage - 1) * PRODUCTS_PER_PAGE + idx];
      addToCart(product);
    };
  });

  document.querySelectorAll(".product-info-btn").forEach((btn) => {
    btn.onclick = () => {
      const productId = btn.getAttribute("data-product-id");
      const product = filteredProducts.find(
        (p) => String(p.id) === String(productId)
      );
      if (product) showProductInfoModal(product);
    };
  });

  // Adaugă inimă la carduri după randare
  if (window.addHeartToProductCards) window.addHeartToProductCards();
}

function renderPagination() {
  let pagination = document.querySelector(".products-pagination");
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.className = "products-pagination";
    const productsContent = document.querySelector(".products-content");
    productsContent.appendChild(pagination);
  }

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  let html = "";

  html += `<button class="pagination-btn arrow-btn" data-page="${
    currentPage > 1 ? currentPage - 1 : 1
  }" ${currentPage === 1 ? "disabled" : ""}>&lt;</button>`;

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination-btn${
        i === currentPage ? " active" : ""
      }" data-page="${i}">${i}</button>`;
    }
  } else {
    html += `<button class="pagination-btn${
      currentPage === 1 ? " active" : ""
    }" data-page="1">1</button>`;

    if (currentPage <= 3) {
      for (let i = 2; i <= 3; i++) {
        html += `<button class="pagination-btn${
          i === currentPage ? " active" : ""
        }" data-page="${i}">${i}</button>`;
      }
      html += `<span class="pagination-ellipsis">...</span>`;
    } else if (currentPage >= totalPages - 2) {
      html += `<span class="pagination-ellipsis">...</span>`;
      for (let i = totalPages - 2; i < totalPages; i++) {
        html += `<button class="pagination-btn${
          i === currentPage ? " active" : ""
        }" data-page="${i}">${i}</button>`;
      }
    } else {
      html += `<span class="pagination-ellipsis">...</span>`;
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        html += `<button class="pagination-btn${
          i === currentPage ? " active" : ""
        }" data-page="${i}">${i}</button>`;
      }
      html += `<span class="pagination-ellipsis">...</span>`;
    }

    html += `<button class="pagination-btn${
      currentPage === totalPages ? " active" : ""
    }" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="pagination-btn arrow-btn" data-page="${
    currentPage < totalPages ? currentPage + 1 : totalPages
  }" ${currentPage === totalPages ? "disabled" : ""}>&gt;</button>`;

  pagination.innerHTML = html;

  pagination.querySelectorAll(".pagination-btn").forEach((btn) => {
    if (btn.disabled) return;
    btn.onclick = () => {
      const page = Number(btn.dataset.page);
      if (page !== currentPage) {
        currentPage = page;
        renderProducts();
        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  });
}

function setupSidebarFilters() {
  const categoryLinks = document.querySelectorAll(
    ".sidebar-section:nth-child(2) .sidebar-list li a"
  );
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = link.textContent.trim();
      currentPage = 1;
      renderProducts();
      renderPagination();
      categoryLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const brandLinks = document.querySelectorAll(
    ".sidebar-section:nth-child(3) .sidebar-list li a"
  );
  brandLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentBrand = link.textContent.trim();
      currentPage = 1;
      renderProducts();
      renderPagination();
      brandLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const countryLinks = document.querySelectorAll(
    ".sidebar-section:nth-child(4) .sidebar-list li a"
  );
  countryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentCountry = link.textContent.trim();
      currentPage = 1;
      renderProducts();
      renderPagination();
      countryLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Reset All button
  const resetBtn = document.querySelector(".sidebar-reset-btn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      currentCategory = "All Products";
      currentBrand = "All brands";
      currentCountry = "All Countries";
      searchTerm = "";
      currentPage = 1;

      // Resetează inputul de search
      const searchInput = document.querySelector(
        '.sidebar-search input[type="search"]'
      );
      if (searchInput) searchInput.value = "";

      // Scoate clasa .active de pe toate filtrele
      document
        .querySelectorAll(".sidebar-list li a")
        .forEach((l) => l.classList.remove("active"));

      // Pune .active pe All Products, All brands, All countries (primul link din fiecare secțiune)
      document
        .querySelectorAll(".sidebar-section:nth-child(2) .sidebar-list li a")[0]
        ?.classList.add("active");
      document
        .querySelectorAll(".sidebar-section:nth-child(3) .sidebar-list li a")[0]
        ?.classList.add("active");
      document
        .querySelectorAll(".sidebar-section:nth-child(4) .sidebar-list li a")[0]
        ?.classList.add("active");

      renderProducts();
      renderPagination();
    };
  }
}

function setupLiveSearch() {
  const searchInput = document.querySelector(
    '.sidebar-search input[type="search"]'
  );
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    renderProducts();
    renderPagination();
  });
}

function renderCheckoutModal() {
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
      <h2 class="checkout-title">Pay with card</h2>
      <div class="secure-connection">
        <svg width="18" height="18" fill="#4caf50" style="vertical-align:middle;margin-right:6px;" viewBox="0 0 24 24"><path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2zm6-7V7a6 6 0 0 0-12 0v3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-8-3a4 4 0 0 1 8 0v3H6V7z"/></svg>
        <span style="color:#4caf50;font-weight:600;">Secure connection</span>
      </div>
      <label class="checkout-label">
        Email
        <input type="email" class="checkout-input" placeholder="aura@gmail.com" required>
      </label>
      <div class="checkout-label" style="margin-bottom: 0;">
        Card Information
        <div class="checkout-card-row">
          <input type="text" class="checkout-input" placeholder="1234 1234 1234 1234" maxlength="19" required>
          <span class="checkout-card-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" class="card-logo card-logo-visa">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="card-logo card-logo-mastercard">
          </span>
        </div>
        <div class="checkout-card-row">
          <input type="text" class="checkout-input" placeholder="MM/YY" maxlength="5" style="width:48%;" required>
          <input type="text" class="checkout-input" placeholder="CVC" maxlength="4" style="width:48%;" required>
        </div>
      </div>
      <label class="checkout-label">
        Cardholder name
        <input type="text" class="checkout-input" placeholder="Full name on card" required>
      </label>
      <label class="checkout-label">
        Country or region
        <select class="checkout-input">
          <option>Moldova</option>
          <option>Romania</option>
          <option>France</option>
          <option>Italy</option>
          <option>USA</option>
        </select>
      </label>
      <label class="checkout-checkbox">
        <input type="checkbox" />
        Save my payment information for future purchases
      </label>
      <div class="save-card-form" style="display:none; margin-top:10px;">
        <label class="checkout-label">
          Set a name for this card
          <input type="text" class="checkout-input" placeholder="e.g. My Visa" maxlength="30">
        </label>
      </div>
      <button type="submit" class="cart-modal-checkout" style="margin-top:18px;">Pay</button>
    </form>
  `;
  modal.querySelector(".cart-modal-close").onclick = closeCartModal;
  modal.querySelector(".checkout-form").onsubmit = (e) => {
    e.preventDefault();
    alert("Payment not implemented.");
  };

  const cardInput = modal.querySelector(
    'input[placeholder="1234 1234 1234 1234"]'
  );
  const visaLogo = modal.querySelector(".card-logo-visa");
  const mcLogo = modal.querySelector(".card-logo-mastercard");

  function resetLogos() {
    [visaLogo, mcLogo].forEach((logo) => {
      logo.classList.remove("hide", "active");
    });
  }

  cardInput.addEventListener("input", function () {
    const value = cardInput.value.replace(/\s+/g, "");
    const firstFour = parseInt(value.slice(0, 4), 10);

    resetLogos();

    if (/^5[1-5]/.test(value) || (firstFour >= 2221 && firstFour <= 2720)) {
      visaLogo.classList.add("hide");
      mcLogo.classList.add("active");
    } else if (/^4/.test(value)) {
      mcLogo.classList.add("hide");
      visaLogo.classList.add("active");
    } else {
      resetLogos();
    }
  });

  const expInput = modal.querySelector('input[placeholder="MM/YY"]');
  const cvcInput = modal.querySelector('input[placeholder="CVC"]');

  cardInput.addEventListener("input", function (e) {
    let value = cardInput.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    cardInput.value = value;
  });

  expInput.addEventListener("input", function (e) {
    let value = expInput.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    expInput.value = value;
  });

  cvcInput.addEventListener("input", function (e) {
    cvcInput.value = cvcInput.value.replace(/\D/g, "").slice(0, 4);
  });

  cvcInput.type = "password";
  cvcInput.maxLength = 3;

  const eyeBtn = document.createElement("button");
  eyeBtn.type = "button";
  eyeBtn.tabIndex = -1;
  eyeBtn.style.background = "none";
  eyeBtn.style.border = "none";
  eyeBtn.style.position = "absolute";
  eyeBtn.style.right = "16px";
  eyeBtn.style.top = "50%";
  eyeBtn.style.transform = "translateY(-50%)";
  eyeBtn.style.cursor = "pointer";
  eyeBtn.style.padding = "0";
  eyeBtn.style.display = "flex";
  eyeBtn.style.alignItems = "center";
  eyeBtn.innerHTML = `
    <svg class="cvc-eye-icon" width="22" height="22" fill="#b884af" viewBox="0 0 24 24">
      <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"/>
    </svg>
  `;

  const cvcRow = cvcInput.parentElement;
  cvcRow.style.position = "relative";
  cvcRow.appendChild(eyeBtn);

  cvcInput.addEventListener("input", function () {
    cvcInput.value = cvcInput.value.replace(/\D/g, "").slice(0, 3);
  });

  eyeBtn.addEventListener("mousedown", function (e) {
    e.preventDefault();
    cvcInput.type = "text";
  });
  eyeBtn.addEventListener("mouseup", function (e) {
    e.preventDefault();
    cvcInput.type = "password";
  });
  eyeBtn.addEventListener("mouseleave", function () {
    cvcInput.type = "password";
  });

  const saveCheckbox = modal.querySelector(
    '.checkout-checkbox input[type="checkbox"]'
  );
  const saveCardForm = modal.querySelector(".save-card-form");
  if (saveCheckbox && saveCardForm) {
    saveCheckbox.addEventListener("change", function () {
      saveCardForm.style.display = this.checked ? "block" : "none";
    });
  }
}

// Currency conversion utility
// function convertPrice(price, lang) {
//   // Hardcoded rates for demo: 1 MDL = 0.052 EUR, 1 MDL = 4.9 RUB, 1 MDL = 1 MDL
//   if (typeof price !== "number" || isNaN(price)) return 0;
//   if (lang === "en") {
//     // EUR
//     return { value: (price * 0.052).toFixed(2), symbol: "€" };
//   } else if (lang === "ru") {
//     // RUB
//     return { value: (price * 4.9).toFixed(2), symbol: "₽" };
//   } else {
//     // MDL (lei)
//     return { value: price.toFixed(2), symbol: "lei" };
//   }
// }

// Modificare: showProductInfoModal devine async pentru a afișa prețul convertit corect
async function showProductInfoModal(product) {
  let overlay = document.createElement("div");
  overlay.className = "product-info-overlay";
  let modal = document.createElement("div");
  modal.className = "product-info-modal";

  const langForPrice =
    window.currentLang || localStorage.getItem("site-lang") || "en";
  const converted = await convertPrice(product.price, langForPrice);

  modal.innerHTML = `
  <button class="product-info-close" aria-label="Close">&times;</button>
  <div class="product-info-header">
    <img src="${product.image || ""}" alt="${
    window.translateProductField(product.name) || ""
  }" />
    <div>
      <h2>${window.translateProductField(product.name) || ""}</h2>
      <div class="product-info-tags">
        ${window.translateProductField(product.category) || ""} 
        ${window.translateProductField(product.country) || ""} 
        ${window.translateProductField(product.brand) || ""}
      </div>
      <div class="product-info-price">
        ${converted.value} ${converted.symbol}
      </div>
    </div>
  </div>
  <div class="product-info-details dt-18" data-i18n="product_details">
    ${window.translateProductField("product_details")}
  </div>
  <div class="product-info-description">
    <p data-i18n="${product.description}">
      ${window.translateProductField(product.description) || ""}
    </p>
  </div>
  <div class="product-rating-section">
    <div class="rating-label dt-18" data-i18n="product_rating_label">Your rating:</div>
    <div class="product-rating-stars">
      ${[1, 2, 3, 4, 5]
        .map((i) => `<span class="star" data-star="${i}">&#9734;</span>`)
        .join("")}
    </div>
    <textarea class="product-review-text dt-18" data-i18n-placeholder="product_review_placeholder" placeholder="${window.translateProductField(
      "product_review_placeholder"
    )}"></textarea>
    <button class="product-review-send dt-18" data-i18n="product_review_send">Send</button>
  </div>
`;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Traducere DOAR în modal (rapid și sigur)
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  modal.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (
      window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]
    ) {
      if (
        el.placeholder !== undefined &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA")
      ) {
        el.placeholder = window.translations[lang][key];
      } else {
        el.innerText = window.translations[lang][key];
      }
    }
  });
  modal.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (
      window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]
    ) {
      el.placeholder = window.translations[lang][key];
    }
  });

  // Închide modalul
  modal.querySelector(".product-info-close").onclick = () => {
    modal.remove();
    overlay.remove();
  };
  overlay.onclick = () => {
    modal.remove();
    overlay.remove();
  };

  // Rating logic
  let selectedRating = 0;
  modal.querySelectorAll(".star").forEach((star) => {
    star.onclick = () => {
      selectedRating = Number(star.dataset.star);
      modal.querySelectorAll(".star").forEach((s, idx) => {
        s.innerHTML = idx < selectedRating ? "&#9733;" : "&#9734;";
      });
    };
  });

  // Send review
  modal.querySelector(".product-review-send").onclick = () => {
    const comment = modal.querySelector(".product-review-text").value.trim();
    if (!selectedRating || !comment) {
      alert("Please select a rating and write a comment.");
      return;
    }
    // Salvează review-ul în localStorage sau trimite pe Review Page
    let reviews = JSON.parse(localStorage.getItem("productReviews") || "[]");
    reviews.push({
      productId: product.id,
      name: window.translateProductField(product.name),
      rating: selectedRating,
      comment,
      date: new Date().toISOString(),
    });
    localStorage.setItem("productReviews", JSON.stringify(reviews));
    // Redirectează către Reviews Page
    window.location.href = "Reviews Page.html";
  };
}

function setupSidebarDropdownAnimations() {
  // Pentru fiecare secțiune de sidebar (Categories, Brands, Countries)
  document.querySelectorAll(".sidebar-section").forEach((section) => {
    const btn = section.querySelector(".sidebar-section-title");
    const list = section.querySelector(".sidebar-list");
    const arrow = btn?.querySelector(".sidebar-arrow svg");
    if (!btn || !list || !arrow) return;

    // Inițial ascuns
    list.style.maxHeight = "0";
    list.style.overflow = "hidden";
    list.style.transition = "max-height 0.35s cubic-bezier(0.4,0,0.2,1)";

    btn.addEventListener("click", () => {
      const isOpen =
        list.style.maxHeight !== "0px" && list.style.maxHeight !== "0";
      if (isOpen) {
        list.style.maxHeight = "0";
        arrow.style.transform = "rotate(0deg)";
      } else {
        list.style.maxHeight = list.scrollHeight + "px";
        arrow.style.transform = "rotate(90deg)";
      }
    });
  });
}

// Utility pentru favorite în localStorage (salvează obiecte întregi, nu doar id-uri)
function getFavoriteProducts() {
  return JSON.parse(localStorage.getItem("favoriteProducts") || "[]");
}
function setFavoriteProducts(products) {
  localStorage.setItem("favoriteProducts", JSON.stringify(products));
}

// Adaugă inimă colorată la cardurile de produs și logica de favorite (salvează obiectul întreg)
window.addHeartToProductCards = function () {
  // Ia favoritele ca obiecte
  const favProducts = getFavoriteProducts();
  const favIds = favProducts.map((p) => p.id);

  document.querySelectorAll(".product-card").forEach((card, idx) => {
    const btn = card.querySelector(".product-fav");
    if (!btn) return;
    // Obține produsul din filteredProducts
    const product =
      filteredProducts[(currentPage - 1) * PRODUCTS_PER_PAGE + idx];
    if (!product) return;

    // Definește iconiţele original și pentru favorit
    const originalIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#63435e" viewBox="0 0 256 256"><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>';
    const favIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#f40b0b" viewBox="0 0 256 256"><path d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z"></path></svg>';

    // Setează butonul cu iconul corespunzător
    btn.innerHTML = favIds.includes(product.id) ? favIcon : originalIcon;

    // Click pe inimă
    btn.onclick = (e) => {
      e.stopPropagation();
      let favs = getFavoriteProducts();
      let ids = favs.map((p) => p.id);
      if (ids.includes(product.id)) {
        favs = favs.filter((p) => p.id !== product.id);
        btn.innerHTML = originalIcon;
      } else {
        favs.push(product);
        btn.innerHTML = favIcon;
      }
      setFavoriteProducts(favs);
    };
  });
};

// Înlocuiește orice altă funcție de dropdown cu aceasta și apeleaz-o la load:
window.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupSidebarDropdownAnimations();
  // La încărcare, colorează inimile favorite
  window.addHeartToProductCards();
});

window.refreshProductsLanguage = function () {
  // Actualizează placeholderul la search
  const searchInput = document.querySelector(
    '.sidebar-search input[type="search"]'
  );
  if (searchInput) {
    searchInput.placeholder = window.translateProductField(
      "products_search_placeholder"
    );
  }

  // Actualizează sidebar-ul (filtrele) și orice element cu data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (
      window.translations &&
      window.translations[window.currentLang] &&
      window.translations[window.currentLang][key]
    ) {
      // Pentru input/textarea, traduce placeholder
      if (
        el.placeholder !== undefined &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA")
      ) {
        el.placeholder = window.translations[window.currentLang][key];
      }
      // Pentru butoane, folosește innerText (nu textContent, ca să nu strici SVG-ul)
      else if (el.tagName === "BUTTON") {
        el.innerText = window.translations[window.currentLang][key];
      }
      // Pentru orice altceva (div, span etc)
      else {
        el.innerText = window.translations[window.currentLang][key];
      }
    }
  });

  // Pentru textarea cu data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (
      window.translations &&
      window.translations[window.currentLang] &&
      window.translations[window.currentLang][key]
    ) {
      el.placeholder = window.translations[window.currentLang][key];
    }
  });

  // Reafișează produsele și paginarea
  if (typeof renderProducts === "function") renderProducts();
  if (typeof renderPagination === "function") renderPagination();
  if (typeof setupSidebarFilters === "function") setupSidebarFilters();
};
