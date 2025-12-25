const productsEl = document.getElementById("products");
let productsCache = [];
let selectedProduct = null;
let selectedPlan = null;

/* ================= USER ================= */
function getUser() {
  const token = localStorage.getItem("token");
  return token ? { token } : null;
}

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  const r = await fetch("/api/store/products");
  productsCache = await r.json();

  productsEl.innerHTML = productsCache.map(p => `
    <div class="card">
      <img src="${p.images?.[0] || ''}">
      <h3>${p.title}</h3>
      <button class="btn" onclick="openCheckout('${p._id}')">شراء</button>
    </div>
  `).join("");
}

/* ================= CHECKOUT ================= */
window.openCheckout = (id) => {
  selectedProduct = productsCache.find(p => p._id === id);
  const plans = selectedProduct.plans;

  document.getElementById("coProduct").textContent = selectedProduct.title;

  const sel = document.getElementById("coPlan");
  sel.innerHTML = plans.map(p =>
    `<option value="${p.name}" data-price="${p.price}">
      ${p.name} - ${p.price}$
    </option>`
  ).join("");

  sel.onchange = () => {
    const opt = sel.options[sel.selectedIndex];
    document.getElementById("coPrice").textContent =
      opt.dataset.price + "$";
  };

  sel.onchange();
  document.getElementById("checkoutModal").classList.remove("hidden");
};

/* ================= CREATE ORDER ================= */
window.createOrder = async () => {
  const user = getUser();
  if (!user) return alert("سجل دخول أولاً");

  const coupon = document.getElementById("coCoupon").value.trim();
  const plan = document.getElementById("coPlan").value;

  const r = await fetch("/api/store/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify({
      productId: selectedProduct._id,
      planName: plan,
      couponCode: coupon || null
    })
  });

  const data = await r.json();
  if (!r.ok) return alert(data.error);

  alert(`تم الشراء!\n\n🔑 المفتاح:\n${data.key}`);
  document.getElementById("checkoutModal").classList.add("hidden");
};

/* ================= MY ORDERS ================= */
async function loadMyOrders() {
  const user = getUser();
  if (!user) return;

  const r = await fetch("/api/store/my-orders", {
    headers: { Authorization: `Bearer ${user.token}` }
  });
  const orders = await r.json();

  document.getElementById("myOrders").innerHTML = orders.map(o => `
    <div class="order">
      <b>${o.product}</b> (${o.plan})<br>
      🔑 ${o.key}<br>
      💰 ${o.finalPrice}$
    </div>
  `).join("");
}

/* ================= INIT ================= */
loadProducts();
