import { renderCheckoutModal } from "./CheckoutComponent.js";
let cart = [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function loadCart() {
  const data = localStorage.getItem("cart");
  cart = data ? JSON.parse(data) : [];
}
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function updateCartBadge() {
  const count = getCartCount();
  document
    .querySelectorAll('.icon-button[aria-label="Shopping bag"]')
    .forEach((bagBtn) => {
      let badge = bagBtn.querySelector(".cart-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        bagBtn.appendChild(badge);
      }
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = "flex"; // asigură afișarea
      } else {
        badge.textContent = "";
        badge.style.display = "none";
      }
    });
}
function addToCart(product) {
  // Always store only string keys in cart, never objects
  const getKey = (val) =>
    val && typeof val === "object" && "key" in val ? val.key : val;
  const idx = cart.findIndex((item) => item.id === product.id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({
      ...product,
      name: getKey(product.name),
      category: getKey(product.category),
      brand: getKey(product.brand),
      country: getKey(product.country),
      qty: 1,
    });
  }
  saveCart();
  updateCartBadge();
}
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCartModal();
}
function changeCartQty(id, delta) {
  const idx = cart.findIndex((item) => item.id === id);
  if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) cart[idx].qty = 1;
    saveCart();
    updateCartBadge();
    renderCartModal();
  }
}

function closeCartModal() {
  const modal = document.querySelector(".cart-modal");
  const overlay = document.querySelector(".cart-overlay");
  if (modal) modal.style.display = "none";
  if (overlay) overlay.style.display = "none";
}

function t(key) {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  return (
    (window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]) ||
    key
  );
}

function renderCartModal() {
  let modal = document.querySelector(".cart-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "cart-modal";
    document.body.appendChild(modal);
  }
  let overlay = document.querySelector(".cart-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    document.body.appendChild(overlay);
    overlay.onclick = closeCartModal;
  }
  overlay.style.display = "block";
  modal.style.display = "block";
  modal.classList.remove("checkout-modal");

  if (cart.length === 0) {
    modal.innerHTML = `
      <button class="cart-modal-close" aria-label="Close">&times;</button>
      <div class="cart-empty">${t("cart_empty")}</div>
    `;
    modal.querySelector(".cart-modal-close").onclick = closeCartModal;
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Calculează subtotalul convertit
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  const convertedTotal =
    typeof window.convertPrice === "function"
      ? window.convertPrice(total, lang)
      : { value: total.toFixed(2), symbol: "lei" };

  modal.innerHTML = `
    <button class="cart-modal-close" aria-label="Close">&times;</button>
    <div class="cart-modal-title">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#63435e" viewBox="0 0 256 256" style="vertical-align:middle;margin-right:8px;">
        <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V72H40V56Zm0,144H40V88H216V200Zm-40-88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
      </svg>
      ${t("cart_title")}
    </div>
    <div class="cart-modal-content">
      <div class="cart-modal-list">
        ${cart
          .map((item) => {
            const itemConverted =
              typeof window.convertPrice === "function"
                ? window.convertPrice(item.price * item.qty, lang)
                : { value: (item.price * item.qty).toFixed(2), symbol: "lei" };
            // In renderCartModal, always use window.translateProductField(item[field]) for display
            const getField = (item, field) => {
              if (window.translateProductField && item && item[field]) {
                return (
                  window.translateProductField(item[field]) || item[field] || ""
                );
              }
              return item && item[field] ? item[field] : "";
            };
            return `
          <div class="cart-modal-item">
            <img src="${item.image}" alt="${getField(item, "name")}" />
            <div class="cart-modal-item-info">
              <div class="cart-modal-item-title">${getField(item, "name")}</div>
              <div class="cart-modal-item-tags">${getField(
                item,
                "category"
              )} ${getField(item, "country")} ${getField(item, "brand")}</div>
              <div class="cart-modal-item-qty">
                <button class="cart-qty-btn" data-id="${
                  item.id
                }" data-delta="-1">-</button>
                <span>${item.qty}</span>
                <button class="cart-qty-btn" data-id="${
                  item.id
                }" data-delta="1">+</button>
              </div>
            </div>
            <div class="cart-modal-item-price">${itemConverted.value} ${
              itemConverted.symbol
            }</div>
            <button class="cart-remove-btn" data-id="${
              item.id
            }" aria-label="${t("cart_remove")}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#b884af" viewBox="0 0 256 256">
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
              </svg>
            </button>
          </div>
        `;
          })
          .join("")}
      </div>
      <div class="cart-modal-summary">
        <div class="cart-modal-summary-title">${t("cart_order_summary")}</div>
        <div class="cart-modal-summary-row">
          <span>${t("cart_subtotal")}</span>
          <span>${convertedTotal.value} ${convertedTotal.symbol}</span>
        </div>
        <div class="cart-modal-summary-row">
          <span>${t("cart_shipping")}</span>
          <span>${t("cart_shipping_free")}</span>
        </div>
        <div class="cart-modal-summary-total">
          <span>${t("cart_total")}</span>
          <span>${convertedTotal.value} ${convertedTotal.symbol}</span>
        </div>
        <button class="cart-modal-checkout">${t("cart_checkout")}</button>
      </div>
    </div>
  `;
  modal.querySelector(".cart-modal-close").onclick = closeCartModal;
  modal.querySelectorAll(".cart-remove-btn").forEach((btn) => {
    btn.onclick = () => removeFromCart(Number(btn.dataset.id));
  });
  modal.querySelectorAll(".cart-qty-btn").forEach((btn) => {
    btn.onclick = () =>
      changeCartQty(Number(btn.dataset.id), Number(btn.dataset.delta));
  });
  modal.querySelector(".cart-modal-checkout").onclick = (e) => {
    e.preventDefault();
    renderCheckoutModal();
  };
}

// Asigură funcția de conversie pe window dacă nu există deja
if (typeof window.convertPrice !== "function") {
  window.convertPrice = function (price, lang) {
    if (typeof price !== "number" || isNaN(price))
      return { value: "0.00", symbol: "lei" };
    if (lang === "en") {
      return { value: (price * 0.052).toFixed(2), symbol: "€" };
    } else if (lang === "ru") {
      return { value: (price * 4.9).toFixed(2), symbol: "₽" };
    } else {
      return { value: price.toFixed(2), symbol: "lei" };
    }
  };
}

function setupCartIcon() {
  document
    .querySelectorAll('.icon-button[aria-label="Shopping bag"]')
    .forEach((bagBtn) => {
      bagBtn.onclick = () => {
        renderCartModal();
      };
    });
}

export {
  addToCart,
  updateCartBadge,
  setupCartIcon,
  loadCart,
  renderCartModal,
  closeCartModal,
};
