// ================= DATA =================
let productsData = [];
let quotesData = [];
let cartItems = [];

// ================= ELEMENTS =================
const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const noResults = document.getElementById("noResults");
const stats = document.getElementById("stats");
const cartCount = document.getElementById("cartCount");

// ================= DARK MODE =================
const toggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  toggle.checked = true;
}

toggle.addEventListener("change", function () {
  if (this.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  }
});

// ================= FETCH 2 APIS =================
container.innerHTML = `<div class="loading">⏳ Loading...</div>`;

Promise.all([

  // API 1 - Products
  fetch("https://dummyjson.com/products?limit=100")
    .then(r => r.json()),

  // API 2 - Quotes
  fetch("https://dummyjson.com/quotes?limit=50")
    .then(r => r.json()),

  // Categories
  fetch("https://dummyjson.com/products/category-list")
    .then(r => r.json())

])
.then(([products, quotes, categories]) => {

  productsData = products.products;
  quotesData = quotes.quotes;

  console.log("✅ Products loaded:", productsData.length);
  console.log("✅ Quotes loaded:", quotesData.length);

  // Show quote
  showRandomQuote();

  // Load categories that have products
  categories.forEach(cat => {
    const hasProducts = productsData.some(product => product.category === cat);
    if (hasProducts) {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      filterSelect.appendChild(option);
    }
  });

  // Show products
  showProducts(productsData);

})
.catch(err => {
  console.log("❌ Error:", err);
  container.innerHTML = `<div class="loading">❌ Failed to load. Check connection.</div>`;
});

// ================= SHOW PRODUCTS =================
function showProducts(arr) {
  container.innerHTML = "";

  if (arr.length === 0) {
    noResults.classList.add("show");
    stats.textContent = "";
    return;
  }

  noResults.classList.remove("show");
  stats.textContent = `Showing ${arr.length} products`;

  arr.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    const stars = "⭐".repeat(Math.round(item.rating));

    div.innerHTML = `
      <img src="${item.thumbnail}" class="card-img" alt="${item.title}">
      <div class="card-body">
        <span class="badge">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.description.substring(0, 80)}...</p>
        <p class="card-rating">${stars} (${item.rating})</p>
        <div class="card-footer">
          <span class="card-price">$${item.price}</span>
          <button class="add-btn" onclick="addToCart('${item.id}', '${item.title.replace(/'/g, "")}', ${item.price})">
            + Cart
          </button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

// ================= QUOTE =================
function showRandomQuote() {
  const random = quotesData[Math.floor(Math.random() * quotesData.length)];
  document.getElementById("quoteText").textContent =
    `"${random.quote}" — ${random.author}`;
}

function newQuote() {
  showRandomQuote();
}

// ================= FILTER + SEARCH + SORT =================
function applyAll() {
  let result = [...productsData];

  const searchText = searchInput.value.toLowerCase();
  if (searchText) {
    result = result.filter(item =>
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText)
    );
  }

  if (filterSelect.value !== "all") {
    result = result.filter(item => item.category === filterSelect.value);
  }

  if (sortSelect.value === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (sortSelect.value === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  showProducts(result);
}

searchInput.addEventListener("input", applyAll);
filterSelect.addEventListener("change", applyAll);
sortSelect.addEventListener("change", applyAll);

// ================= CART =================
function addToCart(id, title, price) {
  const existing = cartItems.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ id, title, price, qty: 1 });
  }

  updateCartCount();
}

function updateCartCount() {
  const total = cartItems.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
}
// ================= NAVIGATION =================
function goToSignup() {
  window.location.href = "signup.html";
}