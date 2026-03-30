const bulbElement = document.getElementById("bulb");
const toggleBtn = document.getElementById("toggle-btn");
const typeSelect = document.getElementById("bulb-type");
const brightnessBtn = document.getElementById("brightness-btn");

let isBulbOn = false;
let inactivityTimerId = null;

const AUTO_OFF_DELAY = 5 * 60 * 1000;

function getSelectedType() {
  return typeSelect.value;
}

function getBrightnessFromUser() {
  const input = prompt("Введіть яскравість (від 10 до 100):", "100");
  return Number(input);
}

function checkIsLed(type) {
  return type === "led";
}

function checkIsValidBrightness(value) {
  return value >= 10 && value <= 100 && !isNaN(value);
}

function setBulbTypeClass(type) {
  bulbElement.classList.remove("regular", "energy", "led");
  bulbElement.classList.add(type);
}

function setBulbStateClass(isOn) {
  if (isOn) {
    bulbElement.classList.remove("off");
    bulbElement.classList.add("on");
    toggleBtn.textContent = "Вимкнути";
  } else {
    bulbElement.classList.remove("on");
    bulbElement.classList.add("off");
    toggleBtn.textContent = "Увімкнути";
    resetBulbBrightnessStyle();
  }
}

function setBulbBrightnessStyle(brightnessValue) {
  const opacityValue = brightnessValue / 100;
  bulbElement.style.opacity = opacityValue;
}

function resetBulbBrightnessStyle() {
  bulbElement.style.opacity = "";
}

function startInactivityTimer() {
  inactivityTimerId = setTimeout(turnOffBulb, AUTO_OFF_DELAY);
}

function clearInactivityTimer() {
  if (inactivityTimerId !== null) {
    clearTimeout(inactivityTimerId);
    inactivityTimerId = null;
  }
}

function resetInactivityTimer() {
  clearInactivityTimer();
  if (isBulbOn) {
    startInactivityTimer();
  }
}

function turnOffBulb() {
  isBulbOn = false;
  setBulbStateClass(isBulbOn);
  console.log("Лампочку вимкнено автоматично через бездіяльність.");
}

function handleToggleClick() {
  isBulbOn = !isBulbOn;
  setBulbStateClass(isBulbOn);
  resetInactivityTimer();
}

function handleTypeChange() {
  const newType = getSelectedType();
  setBulbTypeClass(newType);

  if (!checkIsLed(newType)) {
    resetBulbBrightnessStyle();
  }
  resetInactivityTimer();
}

function handleBrightnessClick() {
  resetInactivityTimer();
  const currentType = getSelectedType();

  if (!checkIsLed(currentType)) {
    alert("Яскравість можна змінювати лише для світлодіодних (LED) лампочок!");
    return;
  }

  if (!isBulbOn) {
    alert("Спочатку увімкніть лампочку!");
    return;
  }

  const brightness = getBrightnessFromUser();

  if (checkIsValidBrightness(brightness)) {
    setBulbBrightnessStyle(brightness);
  } else {
    alert(
      "Введено некоректне значення. Будь ласка, введіть число від 10 до 100.",
    );
  }
}

toggleBtn.addEventListener("click", handleToggleClick);
typeSelect.addEventListener("change", handleTypeChange);
brightnessBtn.addEventListener("click", handleBrightnessClick);

setBulbTypeClass(getSelectedType());
