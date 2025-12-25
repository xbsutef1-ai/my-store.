const products = [
  {
    id: 1,
    title: "GLOM Tweaker",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    description: "أداة تحسين أداء قوية",
    plans: [
      { name: "شهر", price: 5 },
      { name: "سنة", price: 25 }
    ]
  },
  {
    id: 2,
    title: "GLOM Cleaner",
    image: "https://images.unsplash.com/photo-1527430253228-e93688616381",
    description: "تنظيف النظام بذكاء",
    plans: [
      { name: "مدى الحياة", price: 15 }
    ]
  }
];

const productsEl = document.getElementById("products");

function renderProducts() {
  productsEl.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" />
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="plans">
        ${p.plans.map(pl => `<span>${pl.name} - $${pl.price}</span>`).join("")}
      </div>
      <button>شراء</button>
    `;

    productsEl.appendChild(card);
  });
}

renderProducts();
