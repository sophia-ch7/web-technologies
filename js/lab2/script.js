function findMinMax(arr) {
  if (arr.length === 0) return "Масив порожній";
  let min = Math.min(...arr);
  let max = Math.max(...arr);
  return `Мін: ${min}, Макс: ${max}`;
}

function compareProducts(prod1, prod2) {
  if (prod1.price === prod2.price) return "Ціни однакові";
  return prod1.price > prod2.price ? "Перший дорожчий" : "Другий дорожчий";
}

function isBetween(x, min, max) {
  return x >= min && x <= max ? "Входить" : "Не входить";
}

let currentAppStatus = true;
function toggleStatus() {
  currentAppStatus = !currentAppStatus;
  return currentAppStatus;
}

function getGrade(score) {
  if (score >= 90) return "відмінно";
  if (score >= 75) return "добре";
  if (score >= 60) return "задовільно";
  return "незадовільно";
}

function seasonIf(m) {
  if (m === 12 || m === 1 || m === 2) return "Зима";
  if (m >= 3 && m <= 5) return "Весна";
  if (m >= 6 && m <= 8) return "Літо";
  if (m >= 9 && m <= 11) return "Осінь";
  return "Некоректний місяць";
}

function seasonTernary(m) {
  return m === 12 || m === 1 || m === 2
    ? "Зима"
    : m >= 3 && m <= 5
      ? "Весна"
      : m >= 6 && m <= 8
        ? "Літо"
        : m >= 9 && m <= 11
          ? "Осінь"
          : "Помилка";
}

document.getElementById("task1").innerText = findMinMax([15, 3, 28, 2, 10]);

const item1 = { name: "Телефон", price: 500 };
const item2 = { name: "Ноутбук", price: 1200 };
document.getElementById("task2").innerText = compareProducts(item1, item2);
document.getElementById("task3").innerText = isBetween(25, 10, 50);
document.getElementById("task4").innerText = toggleStatus();
document.getElementById("task5").innerText = getGrade(82);
document.getElementById("task6").innerText = seasonIf(4);
document.getElementById("task7").innerText = seasonTernary(10);

n = 5;
function newFunction(n) {
  if (n >= 0 && n <= 2) return "WINTER";
  if (n >= 3 && n <= 5) return "SPRING";
  if (n >= 6 && n <= 8) return "SUMMER";
  return "Autгmn";
}
console.log(newFunction(5));
