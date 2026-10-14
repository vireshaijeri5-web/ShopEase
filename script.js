"use strict";

// ============================================
// 1. PRODUCT DATA
// ============================================

const products = [
  {
    id: 1,
    name: "Studio Headphones",
    price: 1499,
    category: "Electronics",
    badge: "THE DAILY EDIT",
    description: "Your own little world, beautifully tuned.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    name: "Timeless Watch",
    price: 1999,
    category: "Accessories",
    badge: "FOREVER FAVOURITE",
    description: "A little detail that goes a long way.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    name: "Everyday Sneakers",
    price: 2499,
    category: "Fashion",
    badge: "ON THE MOVE",
    description: "Made for wherever today takes you.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    name: "Weekend Backpack",
    price: 1299,
    category: "Accessories",
    badge: "READY WHEN YOU ARE",
    description: "Room for the things that matter.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    name: "Everyday Camera",
    price: 3499,
    category: "Electronics",
    badge: "CAPTURE A MOMENT",
    description: "Keep a little piece of the everyday.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    name: "Sculpted Sunglasses",
    price: 899,
    category: "Accessories",
    badge: "SUNNY SIDE",
    description: "A considered finishing touch.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    name: "Daily Carry Tote",
    price: 799,
    category: "Fashion",
    badge: "MADE FOR EVERYDAY",
    description: "The one you reach for again and again.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    name: "Quiet Moments Speaker",
    price: 1799,
    category: "Electronics",
    badge: "SET THE MOOD",
    description: "Good sound for slower moments.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85"
  }
];

// ============================================
// 2. PAGE ELEMENTS
// ============================================

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const resultsCount = document.getElementById("results-count");

const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartFooter = document.querySelector(".cart-footer");
const continueShoppingButton = document.getElementById("continue-shopping");
const checkoutButton = document.getElementById("checkout-button");
const checkoutMessage = document.getElementById("checkout-message");
const toast = document.getElementById("toast");

// Product detail modal elements
const productModal = document.getElementById("product-modal");
const productModalOverlay = document.getElementById("product-modal-overlay");
const productModalClose = document.getElementById("product-modal-close");
const detailImage = document.getElementById("detail-image");
const detailCategory = document.getElementById("detail-category");
const detailName = document.getElementById("detail-name");
const detailPrice = document.getElementById("detail-price");
const detailDescription = document.getElementById("detail-description");
const detailQuantity = document.getElementById("detail-quantity");
const detailDecrease = document.getElementById("detail-decrease");
const detailIncrease = document.getElementById("detail-increase");
const detailAdd = document.getElementById("detail-add");

// ============================================
// 3. STORAGE HELPERS
// ============================================

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.warn(`Unable to read ${key}:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to save ${key}:`, error);
    showToast("Browser storage is unavailable. Changes may not persist.");
    return false;
  }
}

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

let cart = loadCart();
let wishlist = loadWishlist();
let toastTimer;

function loadCart() {
  const saved = readStorage("shopease-cart", []);

  if (!Array.isArray(saved)) return [];

  return saved
    .filter(item =>
      item &&
      Number.isInteger(item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      products.some(product => product.id === item.id)
    )
    .map(item => ({
      ...products.find(product => product.id === item.id),
      quantity: item.quantity
    }));
}

function loadWishlist() {
  const saved = readStorage("shopease-wishlist", []);

  if (!Array.isArray(saved)) return [];

  return saved.filter(id =>
    Number.isInteger(id) &&
    products.some(product => product.id === id)
  );
}

// ============================================
// 4. TOAST NOTIFICATIONS
// ============================================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

// ============================================
// 5. PRODUCT LIST AND FILTERING
// ============================================

function displayProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  resultsCount.textContent =
    `${filtered.length} thoughtfully chosen object${filtered.length === 1 ? "" : "s"}`;

  if (filtered.length === 0) {
    productList.innerHTML = `
      <div class="empty-results">
        Nothing here just yet. Try another search.
      </div>
    `;
    return;
  }

  productList.innerHTML = filtered.map(product => {
    const saved = wishlist.includes(product.id);

    return `
      <article class="product-card">
        <div class="product-visual">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-image"
            loading="lazy"
          >

          <span class="product-badge">${product.badge}</span>

          <button
            type="button"
            class="wishlist-button ${saved ? "active" : ""}"
            data-action="wishlist"
            data-product-id="${product.id}"
            aria-label="${saved ? "Remove from" : "Add to"} wishlist: ${product.name}"
            aria-pressed="${saved}"
          >${saved ? "♥" : "♡"}</button>
        </div>

        <div class="product-info">
          <p class="product-category">${product.category}</p>

          <div class="product-name-row">
            <h3>${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
          </div>

          <p class="product-description">${product.description}</p>

          <button
            type="button"
            class="add-cart-button"
            data-action="add"
            data-product-id="${product.id}"
          >
            <span>Add to your bag</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    `;
  }).join("");
}

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);

document.querySelectorAll("[data-collection]").forEach(link => {
  link.addEventListener("click", () => {
    categoryFilter.value = link.dataset.collection;
    displayProducts();
  });
});

// ============================================
// 6. WISHLIST
// ============================================

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast("Removed from your wishlist.");
  } else {
    wishlist.push(productId);
    showToast("Saved to your wishlist ♥");
  }

  writeStorage("shopease-wishlist", wishlist);
  displayProducts();
}

// ============================================
// 7. CART OPERATIONS
// ============================================

function saveCart() {
  return writeStorage(
    "shopease-cart",
    cart.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))
  );
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = count;
  cartButton.setAttribute(
    "aria-label",
    `Open shopping bag with ${count} items`
  );

  saveCart();
}

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);

  if (!product || !Number.isInteger(quantity) || quantity < 1) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  updateCartCount();
  renderCart();
  showToast(`${product.name} added to your bag.`);
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-symbol">✳</div>
        <h3>Room for something lovely.</h3>
        <p>Your bag is waiting for its first favourite.</p>
      </div>
    `;

    cartTotalElement.textContent = formatPrice(0);
    checkoutButton.disabled = true;
    checkoutMessage.textContent = "";
    return;
  }

  checkoutButton.disabled = false;

  cartItemsContainer.innerHTML = cart.map(item => `
    <article class="cart-item">
      <img
        src="${item.image}"
        alt="${item.name}"
        class="cart-item-image"
      >

      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="cart-item-price">${formatPrice(item.price * item.quantity)}</p>

        <div class="cart-item-actions">
          <div class="quantity-control">
            <button
              type="button"
              data-cart-action="decrease"
              data-product-id="${item.id}"
              aria-label="Decrease ${item.name} quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-cart-action="increase"
              data-product-id="${item.id}"
              aria-label="Increase ${item.name} quantity"
            >+</button>
          </div>

          <button
            type="button"
            class="remove-item"
            data-cart-action="remove"
            data-product-id="${item.id}"
          >Remove</button>
        </div>
      </div>
    </article>
  `).join("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotalElement.textContent = formatPrice(subtotal);
}

productList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const productId = Number(button.dataset.productId);

  if (button.dataset.action === "add") {
    addToCart(productId);
  } else if (button.dataset.action === "wishlist") {
    toggleWishlist(productId);
  }
});

cartItemsContainer.addEventListener("click", event => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  const productId = Number(button.dataset.productId);
  const item = cart.find(product => product.id === productId);
  if (!item) return;

  if (button.dataset.cartAction === "increase") {
    item.quantity += 1;
  } else if (button.dataset.cartAction === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== productId);
    }
  } else if (button.dataset.cartAction === "remove") {
    cart = cart.filter(product => product.id !== productId);
    showToast("Item removed from your bag.");
  }

  updateCartCount();
  renderCart();
});

// ============================================
// 8. CART DRAWER
// ============================================

function openCart() {
  // If checkout or confirmation was open, return to the bag first.
  cartItemsContainer.dataset.view = "cart";
  cartFooter.style.display = "";
  renderCart();

  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  closeCartButton.focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  cartButton.focus();
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

continueShoppingButton.addEventListener("click", () => {
  closeCart();
});

// ============================================
// 9. PRODUCT DETAIL MODAL
// ============================================

let selectedDetailProduct = null;
let selectedDetailQuantity = 1;
let previousFocus = null;

function openProductDetails(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  selectedDetailProduct = product;
  selectedDetailQuantity = 1;
  previousFocus = document.activeElement;

  detailImage.src = product.image;
  detailImage.alt = product.name;
  detailCategory.textContent = product.category.toUpperCase();
  detailName.textContent = product.name;
  detailPrice.textContent = formatPrice(product.price);
  detailDescription.textContent = product.description;
  detailQuantity.textContent = selectedDetailQuantity;

  productModal.classList.add("open");
  productModalOverlay.classList.add("visible");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("product-modal-open");

  productModalClose.focus();
}

function closeProductDetails() {
  productModal.classList.remove("open");
  productModalOverlay.classList.remove("visible");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("product-modal-open");

  selectedDetailProduct = null;

  if (previousFocus && previousFocus.isConnected) {
    previousFocus.focus();
  }
}

productModalClose.addEventListener("click", closeProductDetails);
productModalOverlay.addEventListener("click", closeProductDetails);

detailDecrease.addEventListener("click", () => {
  if (selectedDetailQuantity > 1) {
    selectedDetailQuantity -= 1;
    detailQuantity.textContent = selectedDetailQuantity;
  }
});

detailIncrease.addEventListener("click", () => {
  selectedDetailQuantity += 1;
  detailQuantity.textContent = selectedDetailQuantity;
});

detailAdd.addEventListener("click", () => {
  if (!selectedDetailProduct) return;

  addToCart(selectedDetailProduct.id, selectedDetailQuantity);
  closeProductDetails();
});

productList.addEventListener("click", event => {
  // Wishlist and add-to-cart buttons keep their own actions.
  if (event.target.closest("button")) return;

  const card = event.target.closest(".product-card");
  if (!card) return;

  const name = card.querySelector("h3")?.textContent;
  const product = products.find(item => item.name === name);

  if (product) openProductDetails(product.id);
});

// ============================================
// 10. CHECKOUT SCREEN INSIDE CART DRAWER
// ============================================

function calculateSubtotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function showCheckoutForm() {
  if (cart.length === 0) return;

  cartFooter.style.display = "none";
  cartItemsContainer.dataset.view = "checkout";

  const subtotal = calculateSubtotal();

  cartItemsContainer.innerHTML = `
    <div class="checkout-view">
      <button type="button" id="back-to-bag"
        class="remove-item checkout-back">
        ← Back to your bag
      </button>

      <p class="eyebrow">ALMOST YOURS</p>
      <h3 class="checkout-title">A few little details.</h3>
      <p class="checkout-intro">
        Add your delivery information to prepare your demo order.
      </p>

      <div class="checkout-summary">
        <div class="checkout-summary-heading">
          <strong>Your order</strong>
          <span>${cart.reduce((sum, item) => sum + item.quantity, 0)} item(s)</span>
        </div>

        ${cart.map(item => `
          <div class="checkout-summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </div>
        `).join("")}

        <div class="checkout-summary-total">
          <span>Subtotal</span>
          <strong>${formatPrice(subtotal)}</strong>
        </div>

        <p class="checkout-shipping-note">
          Demo shipping: ₹0 · No payment will be taken.
        </p>
      </div>

      <form id="checkout-form" novalidate>
        <label class="checkout-field">
          Full name
          <input
            type="text"
            name="fullName"
            autocomplete="name"
            minlength="2"
            maxlength="80"
            required
            placeholder="Your full name"
          >
          <span class="field-error" data-error="fullName"></span>
        </label>

        <label class="checkout-field">
          Email address
          <input
            type="email"
            name="email"
            autocomplete="email"
            maxlength="120"
            required
            placeholder="you@example.com"
          >
          <span class="field-error" data-error="email"></span>
        </label>

        <label class="checkout-field">
          Phone number
          <input
            type="tel"
            name="phone"
            autocomplete="tel"
            inputmode="numeric"
            maxlength="10"
            required
            placeholder="10-digit mobile number"
          >
          <span class="field-error" data-error="phone"></span>
        </label>

        <label class="checkout-field">
          House number and street
          <textarea
            name="address"
            autocomplete="street-address"
            minlength="5"
            maxlength="200"
            rows="2"
            required
            placeholder="Your delivery address"
          ></textarea>
          <span class="field-error" data-error="address"></span>
        </label>

        <label class="checkout-field">
          City
          <input
            type="text"
            name="city"
            autocomplete="address-level2"
            maxlength="80"
            required
            placeholder="City"
          >
          <span class="field-error" data-error="city"></span>
        </label>

        <label class="checkout-field">
          State
          <input
            type="text"
            name="state"
            autocomplete="address-level1"
            maxlength="80"
            required
            placeholder="State"
          >
          <span class="field-error" data-error="state"></span>
        </label>

        <label class="checkout-field">
          PIN code
          <input
            type="text"
            name="pincode"
            autocomplete="postal-code"
            inputmode="numeric"
            maxlength="6"
            minlength="6"
            required
            placeholder="6-digit PIN code"
          >
          <span class="field-error" data-error="pincode"></span>
        </label>

        <label class="checkout-field">
          Demo payment method
          <select name="payment" required>
            <option value="Cash on delivery">Cash on delivery (demo)</option>
            <option value="UPI demo">UPI (demo only)</option>
            <option value="Card demo">Card (demo only)</option>
          </select>
          <span class="field-error" data-error="payment"></span>
        </label>

        <p class="checkout-privacy-note">
          This is a portfolio demo. Do not enter real payment details.
          No payment information is collected.
        </p>

        <p class="checkout-form-message" id="checkout-form-message"
          role="alert"></p>

        <button type="submit" class="checkout-button checkout-submit">
          Place demo order · ${formatPrice(subtotal)}
        </button>
      </form>
    </div>
  `;

  document.getElementById("back-to-bag").addEventListener("click", () => {
    cartFooter.style.display = "";
    renderCart();
  });

  document.getElementById("checkout-form").addEventListener("submit", submitDemoOrder);
}

// ============================================
// 11. VALIDATE AND PLACE DEMO ORDER
// ============================================

function submitDemoOrder(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());
  const errors = {};

  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.replace(/\s+/g, "");
  const address = values.address.trim();
  const city = values.city.trim();
  const state = values.state.trim();
  const pincode = values.pincode.trim();

  if (fullName.length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (address.length < 5) {
    errors.address = "Enter a complete delivery address.";
  }

  if (city.length < 2) {
    errors.city = "Enter your city.";
  }

  if (state.length < 2) {
    errors.state = "Enter your state.";
  }

  if (!/^\d{6}$/.test(pincode)) {
    errors.pincode = "Enter a valid 6-digit PIN code.";
  }

  if (!values.payment) {
    errors.payment = "Choose a demo payment method.";
  }

  form.querySelectorAll(".field-error").forEach(element => {
    element.textContent = "";
  });

  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = form.querySelector(`[data-error="${field}"]`);
    if (errorElement) errorElement.textContent = message;
  });

  if (Object.keys(errors).length > 0) {
    const firstInvalid = form.querySelector(
      `[name="${Object.keys(errors)[0]}"]`
    );

    firstInvalid?.focus();

    document.getElementById("checkout-form-message").textContent =
      "Please correct the highlighted fields.";

    return;
  }

  // Save only a demo order and delivery details.
  // Never save payment credentials.
  const order = {
    orderId: "SE-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    customer: {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode
    },
    paymentMethod: values.payment,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    subtotal: calculateSubtotal(),
    status: "Demo order — not paid"
  };

  const previousOrders = readStorage("shopease-orders", []);
  const orders = Array.isArray(previousOrders) ? previousOrders : [];

  // If storage fails, do not falsely claim the order was saved.
  if (!writeStorage("shopease-orders", [order, ...orders])) {
    document.getElementById("checkout-form-message").textContent =
      "We couldn't save this demo order. Please check browser storage and try again.";
    return;
  }

  showOrderConfirmation(order);
}

// ============================================
// 12. ORDER CONFIRMATION
// ============================================

function showOrderConfirmation(order) {
  // Empty the shopping bag only after the order was saved.
  cart = [];
  updateCartCount();

  cartFooter.style.display = "none";
  cartItemsContainer.dataset.view = "confirmation";

  cartItemsContainer.innerHTML = `
    <div class="order-confirmation">
      <div class="confirmation-symbol">✓</div>

      <p class="eyebrow">YOUR ORDER IS RECORDED</p>

      <h3 class="confirmation-title">
        Thanks, ${escapeHTML(order.customer.fullName.split(" ")[0])}.
      </h3>

      <p class="confirmation-intro">
        Your demo order has been created successfully.
      </p>

      <div class="order-reference">
        <span>DEMO ORDER REFERENCE</span>
        <strong>${escapeHTML(order.orderId)}</strong>
      </div>

      <div class="confirmation-items">
        ${order.items.map(item => `
          <div class="checkout-summary-item">
            <span>${escapeHTML(item.name)} × ${item.quantity}</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </div>
        `).join("")}

        <div class="checkout-summary-total">
          <span>Order total</span>
          <strong>${formatPrice(order.subtotal)}</strong>
        </div>
      </div>

      <p class="checkout-privacy-note">
        ${escapeHTML(order.status)}. No real payment or shipment was initiated.
      </p>

      <button type="button" class="checkout-button" id="finish-order">
        Continue exploring ↗
      </button>

      <p class="confirmation-footnote">
        Your demo order is stored in this browser.
      </p>
    </div>
  `;

  document.getElementById("finish-order").addEventListener("click", () => {
    cartFooter.style.display = "";
    closeCart();
    renderCart();
    showToast("Thanks for trying ShopEase!");
  });
}

// Escape customer-entered text before inserting it into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Checkout button opens the form instead of claiming payment success.
checkoutButton.addEventListener("click", showCheckoutForm);

// ============================================
// 13. KEYBOARD SUPPORT
// ============================================

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    productModal.classList.contains("open")
  ) {
    closeProductDetails();
    return;
  }

  if (
    event.key === "Escape" &&
    cartPanel.classList.contains("open")
  ) {
    closeCart();
  }
});

// ============================================
// 14. INITIALIZE THE STORE
// ============================================

displayProducts();
updateCartCount();
renderCart();