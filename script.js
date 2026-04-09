let data = [];

const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const noResults = document.getElementById("noResults");

// FETCH DATA
fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(res => {
    data = res.products;
    showData(data);
  });

// DISPLAY
function showData(arr) {
  container.innerHTML = "";

  if (arr.length === 0) {
    noResults.classList.add("show");
    return;
  }

  noResults.classList.remove("show");

  arr.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${item.thumbnail}" class="card-img">
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="card-price">$${item.price}</p>
      </div>
    `;

    container.appendChild(div);
  });
}

// EVENTS
searchInput.addEventListener("input", applyAll);
filterSelect.addEventListener("change", applyAll);
sortSelect.addEventListener("change", applyAll);

// FILTER
function applyAll() {
  let result = [...data];

  const searchText = searchInput.value.toLowerCase();

  result = result.filter(item =>
    item.title.toLowerCase().includes(searchText)
  );

  if (filterSelect.value !== "all") {
    result = result.filter(item => item.category === filterSelect.value);
  }

  if (sortSelect.value === "price-low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === "price-high") {
    result.sort((a, b) => b.price - a.price);
  }

  showData(result);
}

// NAVIGATION
function goToSignup() {
  window.location.href = "signup.html";
}