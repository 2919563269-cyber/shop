// ===== 读取购物车 =====
const cart = JSON.parse(localStorage.getItem("shopCart") || "[]");

if (cart.length === 0) {
    window.location.href = "index.html";
}

// ===== 渲染订单商品 =====
function renderCheckoutItems() {
    const itemsEl = document.getElementById("checkoutItems");
    const summaryRows = document.getElementById("summaryRows");
    let total = 0;

    itemsEl.innerHTML = cart.map(c => {
        const product = products.find(p => p.id === c.id);
        if (!product) return "";
        const subtotal = product.price * c.quantity;
        total += subtotal;
        return `
        <div class="checkout-item">
            <div class="checkout-item-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="cart-item-img" onerror="this.parentElement.textContent='${product.emoji}'">` : product.emoji}
            </div>
            <div class="checkout-item-info">
                <div class="checkout-item-name">${product.name}</div>
                <div class="checkout-item-meta">×${c.quantity} · ¥${product.price}/件</div>
            </div>
            <div class="checkout-item-price">¥${subtotal.toLocaleString()}</div>
        </div>`;
    }).join("");

    summaryRows.innerHTML = cart.map(c => {
        const product = products.find(p => p.id === c.id);
        if (!product) return "";
        const subtotal = product.price * c.quantity;
        return `
        <div class="summary-row">
            <span>${product.name} ×${c.quantity}</span>
            <span>¥${subtotal.toLocaleString()}</span>
        </div>`;
    }).join("");

    document.getElementById("summaryTotal").textContent = "¥" + total.toLocaleString();
}

// ===== 提交订单 =====
function submitOrder(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[placeholder="收货人姓名"]').value;
    const phone = form.querySelector('input[placeholder="手机号码"]').value;

    if (!name || !phone) {
        showToast("请填写姓名和电话");
        return;
    }

    // 清空购物车
    localStorage.removeItem("shopCart");
    showToast("订单已提交！请截图本页联系客服微信：njknjk22002");

    // 禁用表单
    form.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
    document.querySelector(".btn-dark").disabled = true;
    document.querySelector(".btn-dark").textContent = "已提交";
}

// ===== Toast =====
let toastTimer;
function showToast(msg) {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById("toast");
    toastEl.textContent = msg;
    toastEl.className = "toast";
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 4000);
}

// ===== 支付方式切换 =====
document.querySelectorAll(".payment-option input").forEach(radio => {
    radio.addEventListener("change", function() {
        document.querySelectorAll(".payment-option").forEach(opt => opt.classList.remove("active"));
        this.parentElement.classList.add("active");
    });
});

// ===== 初始化 =====
renderCheckoutItems();