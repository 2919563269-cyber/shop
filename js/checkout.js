// ===== 读取购物车 =====
const cart = JSON.parse(localStorage.getItem("shopCart") || "[]");

if (cart.length === 0) {
    window.location.href = "index.html";
}

let orderTotal = 0;

// ===== 渲染订单商品 =====
function renderCheckoutItems() {
    const itemsEl = document.getElementById("checkoutItems");
    const summaryRows = document.getElementById("summaryRows");

    itemsEl.innerHTML = cart.map(c => {
        const product = products.find(p => p.id === c.id);
        if (!product) return "";
        const subtotal = product.price * c.quantity;
        orderTotal += subtotal;
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

    document.getElementById("summaryTotal").textContent = "¥" + orderTotal.toLocaleString();
}

// ===== 提交订单 -> 弹出支付弹窗 =====
function submitOrder(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[placeholder="收货人姓名"]').value.trim();
    const phone = form.querySelector('input[placeholder="手机号码"]').value.trim();
    const address = form.querySelector('textarea[placeholder="省/市/区/详细地址"]').value.trim();

    if (!name || !phone || !address) {
        showToast("请填写收货信息");
        return;
    }

    // 更新支付金额
    document.getElementById("wechatAmount").textContent = "¥" + orderTotal.toLocaleString();
    document.getElementById("alipayAmount").textContent = "¥" + orderTotal.toLocaleString();

    // 显示支付弹窗
    document.getElementById("paymentModal").classList.add("active");
    document.getElementById("paymentModalBox").classList.add("active");
    document.body.style.overflow = "hidden";

    // 禁用表单
    form.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
    document.querySelector(".summary-card .btn-dark").disabled = true;
    document.querySelector(".summary-card .btn-dark").textContent = "已提交";
}

// ===== 关闭支付弹窗 =====
function closePayment() {
    document.getElementById("paymentModal").classList.remove("active");
    document.getElementById("paymentModalBox").classList.remove("active");
    document.body.style.overflow = "";

    // 清空购物车
    localStorage.removeItem("shopCart");
    showToast("订单已提交！支付完成后请截图联系客服");
    
    // 3秒后返回首页
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

// ===== 切换支付方式 =====
function switchPayment(method) {
    document.querySelectorAll(".payment-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".payment-qr-panel").forEach(p => p.classList.remove("active"));

    if (method === "wechat") {
        document.querySelectorAll(".payment-tab")[0].classList.add("active");
        document.getElementById("wechatPanel").classList.add("active");
    } else {
        document.querySelectorAll(".payment-tab")[1].classList.add("active");
        document.getElementById("alipayPanel").classList.add("active");
    }
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

// ===== 初始化 =====
renderCheckoutItems();