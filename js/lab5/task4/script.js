const productsMap = new Map();
const ordersSet = new Set();
const productHistoryWeakMap = new WeakMap();
const activeUsersWeakSet = new WeakSet();
const systemUser = { username: "Адміністратор", role: "admin" };
activeUsersWeakSet.add(systemUser);
let currentProductId = 1;
const outputDisplay = document.getElementById("output-display");

function printLog(message) {
  outputDisplay.textContent = message;
}

document.getElementById("btn-add").addEventListener("click", function () {
  const name = document.getElementById("add-name").value.trim();
  const price = Number(document.getElementById("add-price").value);
  const qty = Number(document.getElementById("add-qty").value);

  if (name === "" || price <= 0 || qty < 0) {
    printLog("Помилка: Перевірте правильність введених даних для додавання.");
    return;
  }

  const newProduct = {
    id: currentProductId,
    name: name,
    price: price,
    quantity: qty,
  };

  const obj = {...newProduct};

  console.log(obj.price)

  productsMap.set(currentProductId, newProduct);
  productHistoryWeakMap.set(newProduct, ["Створено запис у каталозі."]);

  printLog(
    `Успіх: Продукт "${name}" додано до каталогу.\nПрисвоєно ідентифікатор (ID): ${currentProductId}`,
  );

  currentProductId++;

  document.getElementById("add-name").value = "";
  document.getElementById("add-price").value = "";
  document.getElementById("add-qty").value = "";
});

document.getElementById("btn-order").addEventListener("click", function () {
  const id = Number(document.getElementById("manage-id").value);
  const product = productsMap.get(id);

  if (!product) {
    printLog(`Помилка: Продукт з ідентифікатором ${id} не знайдено.`);
    return;
  }

  if (product.quantity > 0) {
    product.quantity -= 1;

    const orderRecord = `Замовлення [ID ${product.id}]: ${product.name}. Залишок: ${product.quantity}`;
    ordersSet.add(orderRecord);

    const history = productHistoryWeakMap.get(product);
    history.push("Виконано замовлення 1 шт.");

    printLog(
      `Замовлення оформлено: ${product.name}.\nПоточний залишок на складі: ${product.quantity} шт.`,
    );
  } else {
    printLog(`Відмова: Продукт "${product.name}" відсутній на складі.`);
  }
});

document.getElementById("btn-delete").addEventListener("click", function () {
  const id = Number(document.getElementById("manage-id").value);
  const product = productsMap.get(id);

  if (product) {
    productsMap.delete(id);

    printLog(
      `Успіх: Продукт "${product.name}" (ID: ${id}) назавжди видалено з каталогу.`,
    );
    document.getElementById("manage-id").value = "";
  } else {
    printLog(`Помилка: Продукт з ідентифікатором ${id} не знайдено.`);
  }
});

document.getElementById("btn-update").addEventListener("click", function () {
  const id = Number(document.getElementById("manage-id").value);
  const product = productsMap.get(id);

  if (!product) {
    printLog(`Помилка: Продукт з ідентифікатором ${id} не знайдено.`);
    return;
  }

  const newPrice = Number(document.getElementById("update-price").value);
  const newQty = Number(document.getElementById("update-qty").value);

  if (newPrice >= 0 && newQty >= 0) {
    product.price = newPrice;
    product.quantity = newQty;

    const history = productHistoryWeakMap.get(product);
    history.push(
      `Оновлення даних: ціна ${newPrice} грн, кількість ${newQty} шт.`,
    );

    printLog(`Успіх: Інформацію про продукт "${product.name}" оновлено.`);
  } else {
    printLog("Помилка: Введено некоректні значення для оновлення.");
  }
});

document.getElementById("btn-search").addEventListener("click", function () {
  const searchName = document
    .getElementById("search-name")
    .value.trim()
    .toLowerCase();
  let targetProduct = null;

  for (let product of productsMap.values()) {
    if (product.name.toLowerCase() === searchName) {
      targetProduct = product;
      break;
    }
  }

  if (targetProduct) {
    const historyArray = productHistoryWeakMap.get(targetProduct);
    const formattedHistory = historyArray.map((item) => `> ${item}`).join("\n");

    const resultText = `--- ІНФОРМАЦІЯ ПРО ПРОДУКТ ---
    Ідентифікатор: ${targetProduct.id}
    Назва: ${targetProduct.name}
    Ціна: ${targetProduct.price} грн
    Залишок на складі: ${targetProduct.quantity} шт.
    ІСТОРІЯ ЗМІН ТА ОПЕРАЦІЙ:${formattedHistory}
    --- СТАТИСТИКА СИСТЕМИ ---
    Загальна кількість замовлень у магазині: ${ordersSet.size}`;
    printLog(resultText);
  } else {
    printLog(
      `Результат: Продукт з назвою "${searchName}" не знайдено в каталозі.`,
    );
  }
});
