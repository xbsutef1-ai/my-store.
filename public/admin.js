const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(t => {
  t.onclick = () => {
    tabs.forEach(x => x.classList.remove("active"));
    panels.forEach(p => p.classList.remove("show"));
    t.classList.add("active");
    document.getElementById(t.dataset.tab).classList.add("show");
  };
});

function openProductModal(){ open("productModal"); }
function openCouponModal(){ open("couponModal"); }
function closeModal(id){ document.getElementById(id).classList.add("hidden"); }
function open(id){ document.getElementById(id).classList.remove("hidden"); }

async function loadStats(){
  const r = await fetch("/api/admin/stats");
  const d = await r.json();
  stProducts.textContent = d.products;
  stOrders.textContent = d.orders;
  stRevenue.textContent = "$"+d.revenue;
  stPending.textContent = d.pending;
}

async function loadProducts(){
  const r = await fetch("/api/admin/products");
  const list = await r.json();
  productList.innerHTML = list.map(p=>`
    <div class="card glow">
      <img src="${p.images?.[0]||''}">
      <b>${p.title}</b>
      <button class="btn small" onclick="deleteProduct('${p._id}')">Delete</button>
    </div>
  `).join("");
}

async function saveProduct(){
  const fd = new FormData();
  fd.append("title", pTitle.value);
  fd.append("description", pDesc.value);
  fd.append("categorySlug", pCategory.value);
  fd.append("price", pPrice.value);
  fd.append("image", pImage.files[0]);
  await fetch("/api/admin/products",{method:"POST",body:fd});
  closeModal("productModal");
  loadProducts();
}

async function saveCoupon(){
  await fetch("/api/admin/coupons",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({
      code:cCode.value,
      type:cType.value,
      value:cValue.value,
      expires:cExpires.value
    })
  });
  closeModal("couponModal");
}

loadStats();
loadProducts();
