// ===== 购物车状态 =====
let cart = JSON.parse(localStorage.getItem("shopCart") || "[]");

// ===== DOM 元素引用 =====
const productsGrid = document.getElementById("productsGrid");
const categoryTabs = document.getElementById("categoryTabs");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartFooter = document.getElementById("cartFooter");
const toastEl = document.getElementById("toast");

let currentCategory = "all";

// ===== 初始化 =====
function init() {
    renderCategories();
    renderProducts("all");
    updateCartUI();
}

// ===== 渲染分类标签 =====
function renderCategories() {
    const categories = getCategories();
    categoryTabs.innerHTML = categories.map(cat =>
        `<button class="cat-tab ${cat === "all" ? "active" : ""}" data-category="${cat}">${cat === "all" ? "全部" : cat}</button>`
    ).join("");

    categoryTabs.querySelectorAll(".cat-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            categoryTabs.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            renderProducts(currentCategory);
        });
    });
}

// ===== 商品图片 HTML =====
function productImageHTML(p) {
    if (p.image) {
        return `<img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${p.emoji}'">`;
    }
    return p.emoji;
}

// ===== 渲染商品列表 =====
function renderProducts(category) {
    const filtered = category === "all" ? products : products.filter(p => p.category === category);

    productsGrid.innerHTML = filtered.map(p => {
        const inCart = cart.find(c => c.id === p.id);
        return `
        <div class="product-card">
            <div class="product-image">
                ${productImageHTML(p)}
                ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
            </div>
            <div class="product-body">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="unit">¥</span>${p.price}
                        <span class="original">¥${p.originalPrice}</span>
                    </div>
                    <button class="btn-add-cart ${inCart ? "added" : ""}" onclick="addToCart(${p.id}, this)">
                        ${inCart ? "✓ 已添加" : "+ 加入购物袋"}
                    </button>
                </div>
            </div>
        </div>`;
    }).join("");
}

// ===== 购物车操作 =====
function addToCart(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    renderProducts(currentCategory);
    showToast(`${product.name} 已加入购物袋`);
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartUI();
    renderProducts(currentCategory);
    renderCartItems();
}

function changeQuantity(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
    updateCartUI();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(cart));
}

// ===== 更新购物车 UI =====
function updateCartUI() {
    const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
    renderCartItems();
}

// ===== 购物车商品图片 HTML =====
function cartImageHTML(p) {
    if (p.image) {
        return `<img src="${p.image}" alt="${p.name}" class="cart-item-img" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${p.emoji}'">`;
    }
    return p.emoji;
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = "<p class=\"cart-empty\">购物袋是空的</p>";
        cartFooter.style.display = "none";
        return;
    }

    cartFooter.style.display = "block";
    const total = cart.reduce((sum, c) => {
        const product = products.find(p => p.id === c.id);
        return sum + (product ? product.price * c.quantity : 0);
    }, 0);

    cartTotal.textContent = "¥" + total.toLocaleString("zh-CN");

    cartItems.innerHTML = cart.map(c => {
        const product = products.find(p => p.id === c.id);
        if (!product) return "";
        return `
        <div class="cart-item">
            <div class="cart-item-image">${cartImageHTML(product)}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">¥${(product.price * c.quantity).toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="changeQuantity(${c.id}, -1)">−</button>
                    <span class="qty-num">${c.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${c.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${c.id})">&times;</button>
        </div>`;
    }).join("");
}

// ===== 购物车面板开关 =====
function toggleCart() {
    const isActive = cartSidebar.classList.contains("active");
    if (isActive) {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
    } else {
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
    }
}

// ===== 结算 → 跳转支付页 =====
function checkout() {
    if (cart.length === 0) return;
    toggleCart();
    window.location.href = "checkout.html";
}

// ===== Toast 提示 =====
let toastTimer;
function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.className = "toast";
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

// ===== 启动 =====
document.addEventListener("DOMContentLoaded", init);