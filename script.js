// Variables
let data = [];
const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const loading = document.getElementById("loading");
const noResults = document.getElementById("noResults");
const countSpan = document.getElementById("count");

// Show loading
function showLoading() {
    loading.classList.add("show");
    container.innerHTML = "";
    noResults.classList.remove("show");
}

// Hide loading
function hideLoading() {
    loading.classList.remove("show");
}

// FETCH DATA
fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(res => {
        data = res.products;
        hideLoading();
        showData(data);
    })
    .catch(err => {
        hideLoading();
        console.log("Error:", err);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.2rem; color: #ef4444;">Failed to load products</p>
                <p style="color: #64748b; margin-top: 10px;">Please check your internet connection</p>
            </div>
        `;
    });

// DISPLAY DATA
function showData(arr) {
    // Update count
    countSpan.textContent = arr.length;
    
    // Clear container
    container.innerHTML = "";
    
    // Check if empty
    if (arr.length === 0) {
        noResults.classList.add("show");
        return;
    }
    
    noResults.classList.remove("show");
    
    // Create cards
    arr.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        
        div.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" class="card-img" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="card-body">
                <span class="card-category">${item.category}</span>
                <h3>${item.title}</h3>
                <p class="card-desc">${item.description}</p>
                <div class="card-footer">
                    <span class="card-price">$${item.price}</span>
                    <span class="card-rating">${item.rating}</span>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// EVENTS
searchInput.addEventListener("input", applyAll);
filterSelect.addEventListener("change", applyAll);
sortSelect.addEventListener("change", applyAll);

// MAIN LOGIC
function applyAll() {
    let result = [...data];
    
    // SEARCH
    const searchText = searchInput.value.toLowerCase();
    result = result.filter(item => 
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
    );
    
    // FILTER
    if (filterSelect.value !== "all") {
        result = result.filter(item => item.category === filterSelect.value);
    }
    
    // SORT
    if (sortSelect.value === "az") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortSelect.value === "za") {
        result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortSelect.value === "price-low") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "price-high") {
        result.sort((a, b) => b.price - a.price);
    }
    
    showData(result);
}