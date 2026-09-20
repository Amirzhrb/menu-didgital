const CART_KEY = "bintech_cart";
const FAVORITES_KEY = "bintech_favorites";


/* =========================
   PRODUCTS
========================= */

const PRODUCTS = {

    "cappuccino": {
        id: "cappuccino",
        name: "Cappuccino",
        category: "Hot Coffee",
        price: 5,
        rating: 4.8,
        image: "img/cappuccino.jpg"
    },

    "iced-latte": {
        id: "iced-latte",
        name: "Iced Latte",
        category: "Cold Coffee",
        price: 7,
        rating: 4.7,
        image: "img/Iced lette.jpg"
    },

    "mocha": {
        id: "mocha",
        name: "Mocha",
        category: "Hot Coffee",
        price: 9,
        rating: 4.9,
        image: "img/Mocha.jpg"
    },

    "peachy-dream": {
        id: "peachy-dream",
        name: "Peachy Dream",
        category: "Cold Coffee",
        price: 12,
        rating: 4.6,
        image: "img/Peachy Dream.jpg"
    },

    "vanilla-latte": {
        id: "vanilla-latte",
        name: "Vanilla Latte",
        category: "Hot Coffee",
        price: 7,
        rating: 4.8,
        image: "img/Vanilla Latte.jpg"
    },

    "caramel-macchiato": {
        id: "caramel-macchiato",
        name: "Caramel Macchiato",
        category: "Hot Coffee",
        price: 6,
        rating: 4.9,
        image: "img/cappuccino.jpg"
    },

    "hazelnut-latte": {
        id: "hazelnut-latte",
        name: "Hazelnut Latte",
        category: "Hot Coffee",
        price: 8,
        rating: 4.8,
        image: "img/Iced lette.jpg"
    }

};


/* =========================
   LOCAL STORAGE
========================= */

function getCart() {

    try {

        const cart = JSON.parse(
            localStorage.getItem(CART_KEY)
        );

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


function getFavorites() {

    try {

        const favorites = JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        );

        return Array.isArray(favorites)
            ? favorites
            : [];

    } catch (error) {

        return [];

    }

}


function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


/* =========================
   CART
========================= */

function addToCart(productId) {

    const product = PRODUCTS[productId];

    if (!product) return;

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    saveCart(cart);

    updateBadges();

    showToast(`${product.name} added to cart`);

    renderCartPage();

}


function increaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;

    item.quantity += 1;

    saveCart(cart);

    updateBadges();

    renderCartPage();

}


function decreaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {

        const newCart = cart.filter(
            item => item.id !== productId
        );

        saveCart(newCart);

    } else {

        saveCart(cart);

    }

    updateBadges();

    renderCartPage();

}


function removeFromCart(productId) {

    const product = PRODUCTS[productId];

    const cart = getCart();

    const newCart = cart.filter(
        item => item.id !== productId
    );

    saveCart(newCart);

    updateBadges();

    if (product) {

        showToast(`${product.name} removed`);

    }

    renderCartPage();

}


function clearCart() {

    localStorage.removeItem(CART_KEY);

    updateBadges();

    renderCartPage();

    showToast("Cart cleared");

}


/* =========================
   FAVORITES
========================= */

function toggleFavorite(productId) {

    const product = PRODUCTS[productId];

    if (!product) return;

    let favorites = getFavorites();

    const index = favorites.indexOf(productId);

    if (index === -1) {

        favorites.push(productId);

        showToast(`${product.name} added to favorites`);

    } else {

        favorites.splice(index, 1);

        showToast(`${product.name} removed from favorites`);

    }

    saveFavorites(favorites);

    updateBadges();

    updateFavoriteButtons();

    renderFavoritesPage();

}


/* =========================
   BADGES
========================= */

function updateBadges() {

    const cart = getCart();

    const favorites = getFavorites();

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.querySelectorAll(".cart-count").forEach(
        element => {

            element.textContent = cartCount;

            element.style.display =
                cartCount > 0 ? "flex" : "none";

        }
    );


    document.querySelectorAll(".favorite-count").forEach(
        element => {

            element.textContent = favorites.length;

            element.style.display =
                favorites.length > 0 ? "flex" : "none";

        }
    );

}


/* =========================
   FAVORITE BUTTON STATE
========================= */

function updateFavoriteButtons() {

    const favorites = getFavorites();

    document.querySelectorAll(
        "[data-favorite-id]"
    ).forEach(button => {

        const productId =
            button.dataset.favoriteId;

        const isFavorite =
            favorites.includes(productId);

        button.classList.toggle(
            "active",
            isFavorite
        );

        const icon =
            button.querySelector("i");

        if (!icon) return;

        if (isFavorite) {

            icon.className =
                "fa-solid fa-heart";

        } else {

            icon.className =
                "fa-regular fa-heart";

        }

    });

}


/* =========================
   CART PAGE
========================= */

function renderCartPage() {

    const container =
        document.getElementById("cartContent");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Add your favorite coffee drinks
                    to your cart.
                </p>

                <a href="menu.html" class="action-btn primary">
                    Browse Menu
                </a>

            </div>

        `;

        return;

    }


    let subtotal = 0;


    const itemsHTML = cart.map(item => {

        const product = PRODUCTS[item.id];

        if (!product) return "";

        const itemTotal =
            product.price * item.quantity;

        subtotal += itemTotal;

        return `

            <article class="cart-item">

                <div class="cart-item-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}">
                </div>


                <div class="cart-item-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>


                    <div class="cart-item-meta">

                        <span class="rating">
                            <i class="fa-solid fa-star"></i>
                            ${product.rating}
                        </span>

                        <span class="cart-unit-price">
                            $${product.price.toFixed(2)}
                        </span>

                    </div>


                    <div class="quantity-row">

                        <div class="quantity-control">

                            <button
                                type="button"
                                data-cart-minus="${product.id}">
                                <i class="fa-solid fa-minus"></i>
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-plus="${product.id}">
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>


                        <button
                            type="button"
                            class="remove-item"
                            data-cart-remove="${product.id}">
                            <i class="fa-regular fa-trash-can"></i>
                            Remove
                        </button>

                    </div>

                </div>


                <strong class="cart-item-total">
                    $${itemTotal.toFixed(2)}
                </strong>

            </article>

        `;

    }).join("");


    const delivery =
        subtotal >= 30 ? 0 : 2.50;

    const total =
        subtotal + delivery;


    container.innerHTML = `

        <div class="cart-layout">


            <div class="cart-panel">

                <div class="panel-heading">

                    <div>
                        <span class="section-label">
                            YOUR ORDER
                        </span>

                        <h2>Cart Items</h2>
                    </div>


                    <button
                        type="button"
                        class="clear-cart-btn"
                        data-clear-cart>

                        Clear Cart

                    </button>

                </div>


                <div class="cart-items">

                    ${itemsHTML}

                </div>

            </div>


            <aside class="summary-card">

                <span class="section-label">
                    ORDER SUMMARY
                </span>

                <h2>Checkout</h2>


                <div class="summary-row">

                    <span>Subtotal</span>

                    <strong>
                        $${subtotal.toFixed(2)}
                    </strong>

                </div>


                <div class="summary-row">

                    <span>Delivery</span>

                    <strong>
                        ${
                            delivery === 0
                                ? "FREE"
                                : "$" + delivery.toFixed(2)
                        }
                    </strong>

                </div>


                ${
                    delivery === 0
                    ? `
                        <p class="free-delivery">
                            <i class="fa-solid fa-circle-check"></i>
                            You unlocked free delivery.
                        </p>
                    `
                    : `
                        <p class="free-delivery">
                            Add $${(30 - subtotal).toFixed(2)}
                            more for free delivery.
                        </p>
                    `
                }


                <div class="summary-total">

                    <span>Total</span>

                    <strong>
                        $${total.toFixed(2)}
                    </strong>

                </div>


                <button
                    type="button"
                    class="checkout-btn"
                    data-checkout>

                    Checkout

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </aside>

        </div>

    `;

}


/* =========================
   FAVORITES PAGE
========================= */

function renderFavoritesPage() {

    const container =
        document.getElementById("favoritesContent");

    if (!container) return;

    const favorites = getFavorites();

    if (favorites.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-regular fa-heart"></i>
                </div>

                <h2>No favorites yet</h2>

                <p>
                    Tap the heart icon on a drink
                    to save it here.
                </p>

                <a href="menu.html" class="action-btn primary">
                    Explore Menu
                </a>

            </div>

        `;

        return;

    }


    const validFavorites =
        favorites.filter(
            id => PRODUCTS[id]
        );


    const cards =
        validFavorites.map(id => {

            const product = PRODUCTS[id];

            return `

                <article class="favorite-card">

                    <div class="favorite-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}">


                        <button
                            type="button"
                            class="favorite-remove favorite-toggle active"
                            data-favorite-id="${product.id}"
                            aria-label="Remove ${product.name} from favorites">

                            <i class="fa-solid fa-heart"></i>

                        </button>

                    </div>


                    <div class="favorite-info">

                        <span class="product-category">
                            ${product.category}
                        </span>

                        <h3>${product.name}</h3>


                        <div class="favorite-meta">

                            <span class="rating">

                                <i class="fa-solid fa-star"></i>

                                ${product.rating}

                            </span>


                            <strong>
                                $${product.price.toFixed(2)}
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="action-btn primary full-btn"
                            data-cart-id="${product.id}">

                            <i class="fa-solid fa-plus"></i>

                            Add to Cart

                        </button>

                    </div>

                </article>

            `;

        }).join("");


    container.innerHTML = `

        <div class="favorites-grid">

            ${cards}

        </div>

    `;

}


/* =========================
   CHECKOUT
========================= */

function checkout() {

    const cart = getCart();

    if (cart.length === 0) {

        showToast("Your cart is empty");

        return;

    }

    showToast(
        "Checkout is ready for your payment system"
    );

}


/* =========================
   CLICK EVENTS
========================= */

document.addEventListener("click", function(event) {


    /* Add to cart */

    const addButton =
        event.target.closest("[data-cart-id]");

    if (
        addButton &&
        !event.target.closest("[data-cart-remove]")
    ) {

        addToCart(
            addButton.dataset.cartId
        );

        return;

    }


    /* Favorite */

    const favoriteButton =
        event.target.closest("[data-favorite-id]");

    if (favoriteButton) {

        toggleFavorite(
            favoriteButton.dataset.favoriteId
        );

        return;

    }


    /* Increase */

    const plusButton =
        event.target.closest("[data-cart-plus]");

    if (plusButton) {

        increaseQuantity(
            plusButton.dataset.cartPlus
        );

        return;

    }


    /* Decrease */

    const minusButton =
        event.target.closest("[data-cart-minus]");

    if (minusButton) {

        decreaseQuantity(
            minusButton.dataset.cartMinus
        );

        return;

    }


    /* Remove */

    const removeButton =
        event.target.closest("[data-cart-remove]");

    if (removeButton) {

        removeFromCart(
            removeButton.dataset.cartRemove
        );

        return;

    }


    /* Clear cart */

    const clearButton =
        event.target.closest("[data-clear-cart]");

    if (clearButton) {

        clearCart();

        return;

    }


    /* Checkout */

    const checkoutButton =
        event.target.closest("[data-checkout]");

    if (checkoutButton) {

        checkout();

        return;

    }

});


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateBadges();

        updateFavoriteButtons();

        renderCartPage();

        renderFavoritesPage();

    }
);

/* ============================================================
   BinTech Coffee — Profile / Auth logic (FRONT-END DEMO)
   Storage: localStorage (no backend yet).
   Search for "TODO(backend)" to find every API integration point.
   ============================================================ */
'use strict';

const SESSION_KEY = 'bintech_user';   // logged-in user session
const USERS_KEY   = 'bintech_users';  // demo "database" (localStorage)

const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- demo state ---------- */
let users = [];
try { users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { users = []; }

let user = null;
try { user = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { user = null; }

const saveUsers = () => localStorage.setItem(USERS_KEY, JSON.stringify(users));

/* ---------- demo data (replace with API responses) ---------- */
// TODO(backend): GET /api/orders?userId=...
const DEMO_ORDERS = [
  {
    id: 'BT-2451', date: 'Sep 18, 2026', status: 'Delivered', statusClass: 'b-green',
    items: [
      { name: 'Cappuccino', qty: 1, price: 4.50 },
      { name: 'Vanilla Latte', qty: 2, price: 5.25 }
    ],
    total: 15.00
  },
  {
    id: 'BT-2447', date: 'Sep 15, 2026', status: 'Delivered', statusClass: 'b-green',
    items: [{ name: 'Iced Latte', qty: 2, price: 3.50 }],
    total: 7.00
  },
  {
    id: 'BT-2440', date: 'Sep 12, 2026', status: 'Preparing', statusClass: 'b-orange',
    items: [
      { name: 'Mocha', qty: 1, price: 5.50 },
      { name: 'Peachy Dream', qty: 1, price: 5.00 }
    ],
    total: 10.50
  },
  {
    id: 'BT-2433', date: 'Sep 8, 2026', status: 'Delivered', statusClass: 'b-green',
    items: [{ name: 'Cappuccino', qty: 1, price: 4.50 }],
    total: 4.50
  }
];

// TODO(backend): GET /api/transactions?userId=...
const DEMO_TRANSACTIONS = [
  { id: 'TXN-9931', date: 'Sep 18, 2026 · 09:24 AM', method: 'card',   label: 'Visa •••• 4242', amount: 15.00, status: 'Paid',    statusClass: 'b-green'  },
  { id: 'TXN-9920', date: 'Sep 15, 2026 · 05:41 PM', method: 'wallet', label: 'Coffee Wallet',  amount: 7.00,  status: 'Paid',    statusClass: 'b-green'  },
  { id: 'TXN-9905', date: 'Sep 12, 2026 · 11:03 AM', method: 'cash',   label: 'Cash on delivery', amount: 10.50, status: 'Pending', statusClass: 'b-yellow' },
  { id: 'TXN-9880', date: 'Sep 5, 2026 · 08:12 AM',  method: 'card',   label: 'Visa •••• 4242', amount: 4.50,  status: 'Refund',  statusClass: 'b-red'    }
];

const TX_ICON = { card: '💳', wallet: '👛', cash: '💵' };

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const initials = n => n.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

let toastTimer;
function toast(msg, type = 'success') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

function showScreen(name) {
  $('#authScreen').classList.toggle('active', name === 'auth');
  $('#profileScreen').classList.toggle('active', name === 'profile');
  window.scrollTo(0, 0);
}

/* ============================================================
   AUTH SCREEN
   ============================================================ */
function setAuthTab(tab) {
  $$('.atab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $('#loginForm').hidden  = tab !== 'login';
  $('#signupForm').hidden = tab !== 'signup';
  $('#authTitle').textContent = tab === 'login' ? 'Welcome back 👋' : 'Create account';
  $('#authSub').textContent   = tab === 'login'
    ? 'Sign in to continue to your profile'
    : 'Join BinTech Coffee today ☕';
}

$$('.atab').forEach(b => b.addEventListener('click', () => setAuthTab(b.dataset.tab)));

/* show / hide password */
$$('.pw-eye').forEach(btn => btn.addEventListener('click', () => {
  const inp = $('#' + btn.dataset.eye);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}));

$('#forgotLink').addEventListener('click', e => {
  e.preventDefault();
  // TODO(backend): password-reset flow (email link)
  toast('Password reset will be handled by your backend', 'error');
});

$('#backBtn').addEventListener('click', () => {
  // In your real site: location.href = 'index.html' (or history.back())
  user ? (renderProfile(), showScreen('profile')) : toast('Hook this to your home page 🙂');
});

/* social buttons — demo only */
$$('.btn-social').forEach(b => b.addEventListener('click', () => {
  // TODO(backend): OAuth flow (Google / Apple)
  toast(b.dataset.social + ' sign-in needs your backend (OAuth)', 'error');
}));

/* ---------- LOGIN ---------- */
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass  = $('#loginPass').value;

  if (!emailOk(email))          return toast('Please enter a valid email', 'error');
  if (pass.length < 6)          return toast('Password must be at least 6 characters', 'error');

  // TODO(backend): POST /api/auth/login  { email, password }
  const found = users.find(u => u.email === email);
  if (!found)             return toast('No account found — please sign up first', 'error');
  if (found.pass !== pass) return toast('Incorrect password', 'error'); // DEMO ONLY — server must verify in production

  user = { name: found.name, email: found.email, avatar: found.avatar || null };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  $('#loginBtn').textContent = 'Signing in…';
  setTimeout(() => {
    $('#loginBtn').textContent = 'Login';
    renderProfile();
    showScreen('profile');
    toast('Welcome back, ' + esc(found.name.split(' ')[0]) + '! ☕');
  }, 500);
});

/* ---------- SIGN UP ---------- */
$('#signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const p1    = $('#signupPass').value;
  const p2    = $('#signupPass2').value;

  if (name.length < 3)    return toast('Please enter your full name', 'error');
  if (!emailOk(email))    return toast('Please enter a valid email', 'error');
  if (p1.length < 6)      return toast('Password must be at least 6 characters', 'error');
  if (p1 !== p2)          return toast('Passwords do not match', 'error');

  // TODO(backend): POST /api/auth/register  { name, email, password }
  if (users.some(u => u.email === email)) return toast('This email is already registered', 'error');

  users.push({ name, email, pass: p1, avatar: null }); // DEMO ONLY — never store plain passwords in production
  saveUsers();

  user = { name, email, avatar: null };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  const btn = $('#signupBtn');
  btn.textContent = 'Creating…';
  setTimeout(() => {
    btn.textContent = 'Create Account';
    renderProfile();
    showScreen('profile');
    toast('Account created — welcome aboard! 🎉');
  }, 500);
});

/* ============================================================
   PROFILE SCREEN
   ============================================================ */
function renderProfile() {
  if (!user) return;

  /* header */
  const av = $('#pAvatar');
  if (user.avatar) av.innerHTML = '<img src="' + user.avatar + '" alt="avatar">';
  else av.textContent = initials(user.name);

  $('#pName').textContent  = user.name;
  $('#pEmail').textContent = user.email;

  /* stats — TODO(backend): compute from real orders */
  const spent = DEMO_ORDERS.reduce((s, o) => s + o.total, 0).toFixed(2);
  $('#stOrders').textContent = DEMO_ORDERS.length;
  $('#stSpent').textContent  = '$' + spent;
  $('#stPoints').textContent = 320;
  $('#loyalPts').textContent = '320 pts';

  /* settings prefill */
  $('#setName').value  = user.name;
  $('#setEmail').value = user.email;
  renderSettingsAvatar();

  renderOrders();
  renderTransactions();
}

/* ---------- orders ---------- */
function renderOrders() {
  $('#ordersList').innerHTML = DEMO_ORDERS.map(o => `
    <article class="ocard">
      <div class="orow">
        <div>
          <div class="oid">#${esc(o.id)}</div>
          <div class="odate">${esc(o.date)}</div>
        </div>
        <span class="badge ${o.statusClass}">${esc(o.status)}</span>
      </div>
      <div class="oitems">
        ${o.items.map(i => `
          <div class="oitem">
            <span>${i.qty}× ${esc(i.name)}</span>
            <span>$${(i.price * i.qty).toFixed(2)}</span>
          </div>`).join('')}
      </div>
      <div class="ofoot">
        <div class="ototal">Total <b>$${o.total.toFixed(2)}</b></div>
        <button class="btn-mini" data-reorder="${esc(o.id)}">Reorder</button>
      </div>
    </article>`).join('');
}

$('#ordersList').addEventListener('click', e => {
  // TODO(backend): POST /api/cart  { items }
  if (e.target.closest('[data-reorder]')) toast('Added to cart ✓');
});

/* ---------- transactions ---------- */
function renderTransactions() {
  $('#txList').innerHTML = DEMO_TRANSACTIONS.map(t => `
    <article class="titem">
      <div class="ticon">${TX_ICON[t.method] || '💳'}</div>
      <div class="tmid">
        <div class="tname">${esc(t.label)}</div>
        <div class="tsub">${esc(t.date)} · ${esc(t.id)}</div>
      </div>
      <div class="tright">
        <div class="tamount ${t.status === 'Refund' ? '' : 'neg'}">$${t.amount.toFixed(2)}</div>
        <span class="badge ${t.statusClass} tbadge">${esc(t.status)}</span>
      </div>
    </article>`).join('');
}

/* ---------- profile tabs ---------- */
$$('.ptab').forEach(b => b.addEventListener('click', () => {
  $$('.ptab').forEach(x => x.classList.toggle('active', x === b));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + b.dataset.panel));
}));

$('#settingsBtn').addEventListener('click', () => {
  $('.ptab[data-panel="settings"]').click();
});

/* ---------- settings: avatar upload ---------- */
function renderSettingsAvatar() {
  const av = $('#setAvatar');
  if (user.avatar) av.innerHTML = '<img src="' + user.avatar + '" alt="avatar">';
  else av.textContent = initials(user.name);
}

$('#changePhotoBtn').addEventListener('click', () => $('#avatarInput').click());

$('#avatarInput').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > 2 * 1024 * 1024) return toast('Max file size is 2MB', 'error');

  // TODO(backend): upload to server / CDN, then save the returned URL on the user
  const r = new FileReader();
  r.onload = () => {
    user.avatar = r.result;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    const u = users.find(x => x.email === user.email);
    if (u) { u.avatar = user.avatar; saveUsers(); }
    renderProfile();
    toast('Profile photo updated 📸');
  };
  r.readAsDataURL(f);
});

/* ---------- settings: edit profile ---------- */
$('#profileForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = $('#setName').value.trim();
  const email = $('#setEmail').value.trim().toLowerCase();

  if (name.length < 3) return toast('Name is too short', 'error');
  if (!emailOk(email)) return toast('Please enter a valid email', 'error');

  // TODO(backend): PUT /api/user  { name, email }
  const oldEmail = user.email;
  if (email !== oldEmail && users.some(u => u.email === email && u.email !== oldEmail)) {
    return toast('This email is already taken', 'error');
  }
  const u = users.find(x => x.email === oldEmail);
  if (u) { u.name = name; u.email = email; saveUsers(); }

  user.name = name;
  user.email = email;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  renderProfile();
  toast('Profile updated ✓');
});

/* ---------- preferences (demo) ---------- */
$$('.tgl input').forEach(t => t.addEventListener('change', () => {
  // TODO(backend): PUT /api/user/preferences
  toast('Preference saved');
}));

/* ---------- logout ---------- */
$('#logoutBtn').addEventListener('click', () => {
  // TODO(backend): POST /api/auth/logout
  localStorage.removeItem(SESSION_KEY);
  user = null;
  setAuthTab('login');
  $('#loginForm').reset();
  $('#signupForm').reset();
  showScreen('auth');
  toast('Logged out — see you soon 👋');
});

/* ---------- bottom nav (demo) ---------- */
$$('.bitem').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.nav === 'profile') return; // already here
  // In your real site, navigate to the matching page:
  // location.href = b.dataset.nav + '.html';
  toast('Connect this tab to its own page in your site');
}));

/* ---------- init ---------- */
if (user) {
  renderProfile();
  showScreen('profile');
} else {
  showScreen('auth');
}
