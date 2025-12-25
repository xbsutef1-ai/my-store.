async function loadAccount() {
  const token = localStorage.getItem("token");

  const r = await fetch("/api/account", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await r.json();

  document.getElementById("userInfo").innerText =
    data.user.email;

  document.getElementById("orders").innerHTML =
    data.orders.map(o =>
      `<div>طلب #${o._id} – ${o.status}</div>`
    ).join("");
}

loadAccount();
