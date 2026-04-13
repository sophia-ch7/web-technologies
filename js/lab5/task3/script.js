const hoursSpan = document.getElementById("hours");
const minutesSpan = document.getElementById("minutes");
const secondsSpan = document.getElementById("seconds");

function formatTimeComponent(value) {
  if (value < 10) {
    return "0" + value;
  }
  return value;
}

function updateClockDisplay() {
  const now = new Date();
  const hours = formatTimeComponent(now.getHours());
  const minutes = formatTimeComponent(now.getMinutes());
  const seconds = formatTimeComponent(now.getSeconds());

  hoursSpan.textContent = hours;
  minutesSpan.textContent = minutes;
  secondsSpan.textContent = seconds;
}

function startClock() {
  updateClockDisplay();
  setInterval(updateClockDisplay, 1000);
}

startClock();

const targetDatetimeInput = document.getElementById("target-datetime");
const startTimerBtn = document.getElementById("start-timer-btn");
const timerDisplay = document.getElementById("timer-display");

let countdownIntervalId = null;

function getTargetDate() {
  const inputValue = targetDatetimeInput.value;
  if (inputValue === "") {
    return null;
  }
  return new Date(inputValue);
}

function calcTimeDifference(targetDate) {
  const now = new Date();
  return targetDate.getTime() - now.getTime();
}

function formatRemainingTime(ms) {
  if (ms <= 0) {
    return "Час вийшов!";
  }

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  return `Залишилось: ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
}

function updateTimerDisplay(text) {
  timerDisplay.textContent = text;
}

function handleStartTimerClick() {
  const targetDate = getTargetDate();

  if (targetDate === null) {
    updateTimerDisplay("Будь ласка, оберіть дату та час!");
    return;
  }

  if (countdownIntervalId !== null) {
    clearInterval(countdownIntervalId);
  }

  countdownIntervalId = setInterval(function () {
    const differenceMs = calcTimeDifference(targetDate);
    const formattedText = formatRemainingTime(differenceMs);
    updateTimerDisplay(formattedText);

    if (differenceMs <= 0) {
      clearInterval(countdownIntervalId);
    }
  }, 1000);
}

startTimerBtn.addEventListener("click", handleStartTimerClick);

const birthdayDateInput = document.getElementById("birthday-date");
const birthdayDisplay = document.getElementById("birthday-display");

let birthdayIntervalId = null;

function getBirthdayDate() {
  const inputValue = birthdayDateInput.value;
  return inputValue ? new Date(inputValue) : null;
}

function calcNextBirthday(birthDate) {
  const now = new Date();

  const nextBday = new Date(
    now.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (nextBday.getTime() < now.getTime()) {
    nextBday.setFullYear(now.getFullYear() + 1);
  }

  return nextBday;
}

function formatBirthdayCountdown(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  let totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  let totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  let totalDays = Math.floor(totalHours / 24);
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  return `До Дня народження: ${months} міс. ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
}

function updateBirthdayDisplay(text) {
  birthdayDisplay.textContent = text;
}

function handleBirthdayChange() {
  const bDate = getBirthdayDate();
  if (bDate === null) return;

  if (birthdayIntervalId !== null) {
    clearInterval(birthdayIntervalId);
  }

  birthdayIntervalId = setInterval(function () {
    const nextBday = calcNextBirthday(bDate);
    const differenceMs = calcTimeDifference(nextBday);
    const formattedText = formatBirthdayCountdown(differenceMs);

    updateBirthdayDisplay(formattedText);
  }, 1000);
}

birthdayDateInput.addEventListener("change", handleBirthdayChange);
function setCurrentDateToInput() {
  const today = new Date();
  const year = today.getFullYear();
  const month = formatTimeComponent(today.getMonth() + 1);
  const day = formatTimeComponent(today.getDate());

  birthdayDateInput.value = `${year}-${month}-${day}`;
}

setCurrentDateToInput();
