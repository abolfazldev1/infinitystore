const API_URL = "https://68c7edca5d8d9f514733a00e.mockapi.io/products";

const productsEl = document.querySelector("#products");
const messageEl = document.querySelector("#message");
const filterBox = document.querySelector("#filterBox");

let allProducts = [];
function makeCard(p) {
  const div = document.createElement("div");
  div.innerHTML = `
      <div class="card shadow-sm rounded-4 p-3">
        <img class="card-img-top" src="${p.image || ""}"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/400x300?text=No+Image'"/>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name} <small class="text-muted">(${
    p.model
  })</small></h5>
          <p class="card-text text-muted flex-grow-1">${p.description || ""}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="price fw-bold text-primary">${Number(
              p.price
            ).toLocaleString()} $</div>
            <button class="btn btn-outline-primary btn-sm" onclick="viewProduct('${
              p.id
            }')">جزئیات</button>
          </div>
        </div>
      </div>
    `;
  return div;
}

function renderProducts(list) {
  productsEl.innerHTML = "";
  if (!list.length) {
    messageEl.classList.remove("d-none");
    messageEl.textContent = "هیچ محصولی پیدا نشد.";
    productsEl.classList.add("d-none");
    return;
  }
  messageEl.classList.add("d-none");
  productsEl.classList.remove("d-none");
  list.forEach((p) => productsEl.appendChild(makeCard(p)));
}

async function fetchProducts() {
  try {
    messageEl.style.display = "block";
    messageEl.textContent = "در حال بارگذاری محصولات...";
    productsEl.classList.remove("d-none");

    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("خطا در دریافت محصولات: " + res.status);
    const data = await res.json();

    allProducts = data.filter((p) =>
      ["15", "16", "17"].includes(String(p.model).trim())
    );
    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
    messageEl.style.display = "block";
    messageEl.textContent = "مشکل در بارگذاری محصولات. کنسول رو چک کن.";
  }
}
// // فیلتر بر اساس مدل
function applyFilter(model) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((b) =>
    b.classList.toggle("active", b.dataset.model === model)
  );

  if (model === "all") renderProducts(allProducts);
  else renderProducts(allProducts.filter((p) => String(p.model) === model));
}

filterBox.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  applyFilter(btn.dataset.model);
});

function viewProduct(id) {
  const p = allProducts.find((x) => x.id === id);
  if (!p) return alert("محصول پیدا نشد");
  alert(p.name + "\\n" + (p.description || "") + "\\nقیمت: " + p.price + " $");
}

// اولین بار لود
fetchProducts();
