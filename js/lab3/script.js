"use strict";

function sumFibonacci() {
  let number1 = 0;
  let number2 = 1;
  let count = 0;
  let sum = 0;

  while (true) {
    sum += number1;

    let next = number1 + number2;
    number1 = number2;
    number2 = next;

    count++;
  }

  return sum;
}

function sumPrimes() {
  let sum = 0;

  for (let i = 2; i <= 1000; i++) {
    let isPrime = true;

    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      sum += i;
    }
  }

  return sum;
}

function getDayOfWeek(dayNumber) {
  switch (dayNumber) {
    case 1:
      return "Понеділок";

    case 2:
      return "Вівторок";

    case 3:
      return "Середа";

    case 4:
      return "Четвер";

    case 5:
      return "П'ятниця";

    case 6:
      return "Субота";

    case 7:
      return "Неділя";

    default:
      return "Некоректне значення";
  }
}

function getOddLengthStrings(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let currentString = arr[i];

    if (currentString.length % 2 !== 0) {
      result.push(currentString);
    }
  }

  return result;
}

function incrementNumbers(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] += 1;
    result.push(arr[i]);
  }
  return result;
}

function checkTen(a, b) {
  return a + b === 10 || Math.abs(a - b) === 10;
}

console.log("========== ЛАБОРАТОРНА РОБОТА ==========");

console.log("1. Сума перших 10 чисел Фібоначчі:", sumFirst10Fibonacci());

console.log("2. Сума простих чисел від 1 до 1000:", sumPrimesUpTo1000());

let userDay = Number(prompt("Введіть число від 1 до 7"));

console.log("3. День тижня:", getDayOfWeek(userDay));

let words = ["яблуко", "кіт", "сонце", "ніч", "програмування"];

console.log("4. Рядки з непарною довжиною:", getOddLengthStrings(words));

let numbers = [10, 25, 99, 0];

console.log("5. Масив чисел +1:", incrementNumbers(numbers));

console.log("6. Перевірка (5,5):", checkTen(5, 5));

console.log("6. Перевірка (15,5):", checkTen(15, 5));

console.log("6. Перевірка (3,4):", checkTen(3, 4));
