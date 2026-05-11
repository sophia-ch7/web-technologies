let products = JSON.parse(localStorage.getItem("myCatalogProducts")) || [];
let currentFilter = null;
let currentSort = null;

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + Number(item.price), 0);
};

const filterProducts = (items, category) => {
  if (!category) return items;
  return items.filter((item) => item.category === category);
};

const sortProducts = (items, sortType) => {
  if (!sortType) return items;
  const itemsCopy = [...items];

  switch (sortType) {
    case "price":
      return itemsCopy.sort((a, b) => a.price - b.price);
    case "created":
      return itemsCopy.sort((a, b) => a.createdAt - b.createdAt);
    case "updated":
      return itemsCopy.sort((a, b) => a.updatedAt - b.updatedAt);
    default:
      return itemsCopy;
  }
};

const createProductObj = (
  id,
  name,
  price,
  category,
  image,
  createdAt,
  updatedAt,
) => ({
  id: id || `id-${Date.now()}`,
  name,
  price: Number(price),
  category,
  image,
  createdAt: createdAt || Date.now(),
  updatedAt: updatedAt || Date.now(),
});

function saveToLocalStorage() {
  localStorage.setItem("myCatalogProducts", JSON.stringify(products));
}

function showSnackbar(message) {
  const snackbar = document.getElementById("snackbar");
  snackbar.textContent = message;
  snackbar.className = "show";

  clearTimeout(snackbar.timer);
  snackbar.timer = setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

const modal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const form = document.getElementById("product-form");

function openModal(editingProduct = null) {
  if (editingProduct) {
    modalTitle.textContent = "Редагувати товар";
    document.getElementById("product-id").value = editingProduct.id;
    document.getElementById("product-name").value = editingProduct.name;
    document.getElementById("product-price").value = editingProduct.price;
    document.getElementById("product-category").value = editingProduct.category;
    document.getElementById("product-image").value = editingProduct.image;
  } else {
    modalTitle.textContent = "Додати товар";
    form.reset();
    document.getElementById("product-id").value = "";
  }
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function renderUI() {
  let processedProducts = filterProducts(products, currentFilter);
  processedProducts = sortProducts(processedProducts, currentSort);

  document.getElementById("total-price").textContent =
    calculateTotal(processedProducts).toFixed(2);

  const emptyMsg = document.getElementById("empty-message");
  const list = document.getElementById("product-list");

  list.innerHTML = "";

  if (processedProducts.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";

    processedProducts.forEach((product) => {
      const li = document.createElement("li");
      li.className = "product-card";
      li.dataset.id = product.id;

      li.innerHTML = `
                <div class="img-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="card-info">
                    <p class="id-text">ID: <span>${product.id}</span></p>
                    <h3>${product.name}</h3>
                    <p class="category-text">Категорія: ${product.category}</p>
                    <p class="price">${product.price} ₴</p>
                    <div class="card-actions">
                        <button class="btn-edit">Редагувати</button>
                        <button class="btn-delete">Видалити</button>
                    </div>
                </div>
            `;
      list.appendChild(li);
    });
  }
}

document.querySelector(".close-modal").addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document
  .getElementById("btn-add-product")
  .addEventListener("click", () => openModal());

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("product-id").value;
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const category = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").value;

  if (id) {
    const existing = products.find((p) => p.id === id);
    const updatedProduct = createProductObj(
      id,
      name,
      price,
      category,
      image,
      existing.createdAt,
      Date.now(),
    );
    products = products.map((p) => (p.id === id ? updatedProduct : p));
    showSnackbar(`Успішно оновлено: [${id}] ${name}`);
  } else {
    const newProduct = createProductObj(
      null,
      name,
      price,
      category,
      image,
      null,
      null,
    );
    products = [...products, newProduct];
  }

  saveToLocalStorage();

  closeModal();
  renderUI();
});

document.getElementById("product-list").addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const id = card.dataset.id;

  if (e.target.classList.contains("btn-delete")) {
    card.classList.add("removing");

    setTimeout(() => {
      products = products.filter((p) => p.id !== id);

      saveToLocalStorage();

      showSnackbar("Товар успішно видалено зі списку.");
      renderUI();
    }, 400);
  }

  if (e.target.classList.contains("btn-edit")) {
    const productToEdit = products.find((p) => p.id === id);
    openModal(productToEdit);
  }
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentFilter = e.target.dataset.category;
    renderUI();
  });
});
document.getElementById("reset-filter").addEventListener("click", () => {
  currentFilter = null;
  renderUI();
});

document.querySelectorAll(".sort-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    currentSort = e.target.dataset.sort;
    renderUI();
  });
});
document.getElementById("reset-sort").addEventListener("click", () => {
  currentSort = null;
  renderUI();
});

renderUI();
