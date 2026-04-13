const createProduct = (id, name, price, category, imageSrc) => ({
  id: id || Date.now().toString(),
  name,
  price: Number(price),
  category,
  imageSrc,
  createdAt: id ? undefined : Date.now(),
  updatedAt: Date.now(),
});

const addProductToState = (products, product) => [...products, product];

const updateProductInState = (products, updatedProduct) =>
  products.map((p) =>
    p.id === updatedProduct.id
      ? { ...p, ...updatedProduct, createdAt: p.createdAt }
      : p,
  );

const removeProductFromState = (products, id) =>
  products.filter((p) => p.id !== id);

const calculateTotal = (products) =>
  products.reduce((sum, p) => sum + p.price, 0);

const filterProducts = (products, category) =>
  category ? products.filter((p) => p.category === category) : products;

const sortProducts = (products, sortType) => {
  const productsCopy = [...products];
  switch (sortType) {
    case "price":
      return productsCopy.sort((a, b) => a.price - b.price);
    case "createdAt":
      return productsCopy.sort((a, b) => b.createdAt - a.createdAt);
    case "updatedAt":
      return productsCopy.sort((a, b) => b.updatedAt - a.updatedAt);
    default:
      return productsCopy;
  }
};

let state = {
  products: [],
  currentFilter: null,
  currentSort: null,
};

const els = {
  productList: document.getElementById("product-list"),
  emptyState: document.getElementById("empty-state"),
  totalPrice: document.getElementById("total-price"),
  modal: document.getElementById("product-modal"),
  form: document.getElementById("product-form"),
  snackbar: document.getElementById("snackbar"),
  modalTitle: document.getElementById("modal-title"),
};

const render = () => {
  let displayedProducts = filterProducts(state.products, state.currentFilter);
  displayedProducts = sortProducts(displayedProducts, state.currentSort);

  els.totalPrice.textContent = calculateTotal(displayedProducts).toFixed(2);

  if (displayedProducts.length === 0) {
    els.emptyState.style.display = "block";
    els.productList.innerHTML = "";
    return;
  }

  els.emptyState.style.display = "none";
  els.productList.innerHTML = "";

  displayedProducts.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product-card";
    li.dataset.id = p.id;

    li.innerHTML = `
      <img src="${p.imageSrc}" alt="${p.name}" class="product-image">
      <div><strong>ID:</strong> ${p.id}</div>
      <div><strong>Назва:</strong> ${p.name}</div>
      <div><strong>Ціна:</strong> ${p.price.toFixed(2)} ₴</div>
      <div><strong>Категорія:</strong> ${p.category}</div>
      <div class="product-actions">
        <button class="btn-warning btn-edit">Редагувати</button>
        <button class="btn-danger btn-delete">Видалити</button>
      </div>
    `;

    li.querySelector(".btn-delete").addEventListener("click", () =>
      handleDelete(p.id, li),
    );
    li.querySelector(".btn-edit").addEventListener("click", () => openModal(p));

    els.productList.appendChild(li);
  });
};

const handleDelete = (id, liElement) => {
  liElement.classList.add("removing");

  setTimeout(() => {
    state.products = removeProductFromState(state.products, id);
    showSnackbar("Товар успішно видалено!");
    render();
  }, 400);
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const id = document.getElementById("product-id").value;
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const category = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").value;

  const productData = createProduct(id, name, price, category, image);

  if (id) {
    state.products = updateProductInState(state.products, productData);
    showSnackbar(`Оновлено: ID ${productData.id} - ${productData.name}`);
  } else {
    state.products = addProductToState(state.products, productData);
  }

  closeModal();
  render();
};

document.getElementById("filter-buttons").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const category = e.target.dataset.category;
  const isReset = e.target.dataset.reset;

  document
    .querySelectorAll("#filter-buttons button")
    .forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");

  state.currentFilter = isReset ? null : category;
  render();
});

document.getElementById("sort-buttons").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const sortType = e.target.dataset.sort;
  const isReset = e.target.dataset.reset;

  document
    .querySelectorAll("#sort-buttons button")
    .forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");

  state.currentSort = isReset ? null : sortType;
  render();
});

const openModal = (product = null) => {
  els.form.reset();
  if (product) {
    els.modalTitle.textContent = "Редагувати товар";
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-image").value = product.imageSrc;
  } else {
    els.modalTitle.textContent = "Додати товар";
    document.getElementById("product-id").value = "";
  }
  els.modal.style.display = "block";
};

const closeModal = () => {
  els.modal.style.display = "none";
};

const showSnackbar = (message) => {
  els.snackbar.textContent = message;
  els.snackbar.className = "show";
  setTimeout(() => {
    els.snackbar.className = els.snackbar.className.replace("show", "");
  }, 3000);
};

document
  .getElementById("btn-add-new")
  .addEventListener("click", () => openModal());
document.getElementById("close-modal").addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === els.modal) closeModal();
});
els.form.addEventListener("submit", handleFormSubmit);

render();
