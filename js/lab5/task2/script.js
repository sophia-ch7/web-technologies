const redLight = document.getElementById("red-light");
const yellowLight = document.getElementById("yellow-light");
const greenLight = document.getElementById("green-light");
const statusText = document.getElementById("status-text");

const changeTimesBtn = document.getElementById("change-times-btn");
const manualNextBtn = document.getElementById("manual-next-btn");

const durations = {
  red: 5000,
  yellow: 3000,
  green: 7000,
};

let currentPhase = "red";
let timerId = null;
let blinkIntervalId = null;

function getDurationFromUser(colorName, currentValueMs) {
  const currentSeconds = currentValueMs / 1000;
  const input = prompt(
    "Введіть тривалість для ${colorName} світла (у секундах):",
    currentSeconds,
  );
  return Number(input);
}

function checkIsValidDuration(value) {
  return value > 0 && !isNaN(value);
}

function setAllLightsOff() {
  redLight.classList.replace("on", "off");
  yellowLight.classList.replace("on", "off");
  greenLight.classList.replace("on", "off");
}

function setLightOn(lightElement) {
  lightElement.classList.replace("off", "on");
}

function setStatusText(text, colorHex) {
  statusText.textContent = text;
  statusText.style.color = colorHex;
}

function clearAllTimers() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
  if (blinkIntervalId !== null) {
    clearInterval(blinkIntervalId);
    blinkIntervalId = null;
  }
}

function runRedPhase() {
  currentPhase = "red";
  setAllLightsOff();
  setLightOn(redLight);
  setStatusText("Червоний", "#ff3b30");
  timerId = setTimeout(runYellowPhase, durations.red);
}

function runYellowPhase() {
  currentPhase = "yellow";
  setAllLightsOff();
  setLightOn(yellowLight);
  setStatusText("Жовтий", "#ffcc00");
  timerId = setTimeout(runGreenPhase, durations.yellow);
}

function runGreenPhase() {
  currentPhase = "green";
  setAllLightsOff();
  setLightOn(greenLight);
  setStatusText("Зелений", "#34c759");
  timerId = setTimeout(runBlinkingYellowPhase, durations.green);
}

function runBlinkingYellowPhase() {
  currentPhase = "blinking";
  setAllLightsOff();
  setStatusText("Миготливий жовтий", "#ffcc00");

  let blinkCount = 0;
  let isYellowOn = false;

  blinkIntervalId = setInterval(() => {
    if (isYellowOn) {
      setAllLightsOff();
      isYellowOn = false;
    } else {
      setLightOn(yellowLight);
      isYellowOn = true;
    }

    blinkCount++;

    if (blinkCount >= 6) {
      clearAllTimers();
      runRedPhase();
    }
  }, 500);
}

function handleManualNextClick() {
  clearAllTimers();

  if (currentPhase === "red") {
    runYellowPhase();
  } else if (currentPhase === "yellow") {
    runGreenPhase();
  } else if (currentPhase === "green") {
    runBlinkingYellowPhase();
  } else if (currentPhase === "blinking") {
    runRedPhase();
  }
}

function handleSettingsClick() {
  clearAllTimers();
  const newRed = getDurationFromUser("червоного", durations.red);
  if (checkIsValidDuration(newRed)) durations.red = newRed * 1000;

  const newYellow = getDurationFromUser("жовтого", durations.yellow);
  if (checkIsValidDuration(newYellow)) durations.yellow = newYellow * 1000;

  const newGreen = getDurationFromUser("зеленого", durations.green);
  if (checkIsValidDuration(newGreen)) durations.green = newGreen * 1000;

  runRedPhase();
}

manualNextBtn.addEventListener("click", handleManualNextClick);
changeTimesBtn.addEventListener("click", handleSettingsClick);

runRedPhase();
