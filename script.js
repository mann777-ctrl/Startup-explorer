const container = document.getElementById("container");

// loading state
container.innerHTML = "⏳ Loading products...";

// fetch data
fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(data => {
    displayProducts(data.products);
  })
  .catch(() => {
    container.innerHTML = "⚠️ Failed to load products";
  });

// display function
function displayProducts(products) {
  container.innerHTML = "";

  products.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p class="price">$${item.price}</p>
    `;

    container.appendChild(div);
  });
}