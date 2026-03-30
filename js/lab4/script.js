function processFruitsArray() {
  console.log("=== Завдання 1 ===");
  let fruits = ["банан", "апельсин", "яблуко", "груша"];
  fruits.push("apple");

  fruits.pop();
  console.log("1. Без останнього елемента:", fruits);

  fruits.unshift("ананас");
  console.log("2. Додано 'ананас' на початок:", fruits);

  fruits.sort().reverse();
  console.log("3. Зворотній алфавітний порядок:", fruits);

  let index = fruits.indexOf("яблуко");
  console.log("4. Індекс 'яблуко':", index);
}

const getLongestString = (a, b) => (a.length > b.length ? a : b);
const getShortestString = (a, b) => (a.length < b.length ? a : b);
const checkContainsBlue = (color) => color.includes("синій");

function analyzeColorsArray() {
  console.log("\n=== Завдання 2 ===");
  let colors = ["червоний", "зелений", "світло-синій", "синій", "жовтий"];

  let longest = colors.reduce(getLongestString);
  let shortest = colors.reduce(getShortestString);
  console.log(`2. Найдовший: ${longest}, Найкоротший: ${shortest}`);

  let blueColors = colors.filter(checkContainsBlue);
  console.log("3. Тільки кольори зі словом 'синій':", blueColors);

  let joinedStr = blueColors.join(", ");
  console.log("4-5. Об'єднаний рядок:", joinedStr);
}

const compareNamesAlphabetically = (a, b) => a.name.localeCompare(b.name);
const checkIsDeveloper = (emp) => emp.position === "розробник";
const checkIsUnderForty = (emp) => emp.age <= 40;

function manageEmployeeRecords() {
  console.log("\n=== Завдання 3 ===");
  let employees = [
    { name: "Яна", age: 25, position: "дизайнер" },
    { name: "Антон", age: 32, position: "розробник" },
    { name: "Богдан", age: 45, position: "менеджер" },
    { name: "Вікторія", age: 28, position: "розробник" },
  ];

  employees.sort(compareNamesAlphabetically);
  console.log(
    "2. Відсортовано за іменами:",
    JSON.parse(JSON.stringify(employees)),
  );

  let devs = employees.filter(checkIsDeveloper);
  console.log("3. Працівники-розробники:", devs);

  employees = employees.filter(checkIsUnderForty);
  console.log(
    "4. Без працівників старше 40 років:",
    JSON.parse(JSON.stringify(employees)),
  );

  employees.push({ name: "Денис", age: 22, position: "тестувальник" });
  console.log("5. Додано нового працівника:", employees);
}

const checkIsNotOleksiy = (student) => student.name !== "Олексій";
const compareAgeDescending = (a, b) => b.age - a.age;
const checkIsThirdCourse = (student) => student.course === 3;

function manageStudentRecords() {
  console.log("\n=== Завдання 4 ===");
  let students = [
    { name: "Олексій", age: 20, course: 2 },
    { name: "Марія", age: 21, course: 3 },
    { name: "Іван", age: 19, course: 1 },
  ];

  students = students.filter(checkIsNotOleksiy);
  console.log("2. Без Олексія:", JSON.parse(JSON.stringify(students)));

  students.push({ name: "Катерина", age: 22, course: 4 });
  console.log("3. Додано Катерину:", JSON.parse(JSON.stringify(students)));

  students.sort(compareAgeDescending);
  console.log(
    "4. Від найстаршого до наймолодшого:",
    JSON.parse(JSON.stringify(students)),
  );

  let thirdCourseStudent = students.find(checkIsThirdCourse);
  console.log("5. Студент 3-го курсу:", thirdCourseStudent);
}

const calcSquare = (num) => num ** 2;
const checkIsEven = (num) => num % 2 === 0;
const calcSum = (acc, curr) => acc + curr;

function performNumberCalculations() {
  console.log("\n=== Завдання ===");
  let numbers = [1, 2, 3, 4, 5, 6];

  let squares = numbers.map(calcSquare);
  console.log("1. Квадрати:", squares);

  let evens = numbers.filter(checkIsEven);
  console.log("2. Парні числа:", evens);

  let sum = numbers.reduce(calcSum, 0);
  console.log("3. Сума елементів:", sum);

  let extraNumbers = [7, 8, 9, 10, 11];
  let combined = numbers.concat(extraNumbers);
  console.log("4. Об'єднаний масив:", combined);

  combined.splice(0, 3);
  console.log("5. Після видалення перших 3 елементів:", combined);
}

function createLibraryManager() {
  let books = [
    {
      title: "1984",
      author: "Джордж Орвелл",
      genre: "Антиутопія",
      pages: 328,
      isAvailable: true,
    },
    {
      title: "Кобзар",
      author: "Тарас Шевченко",
      genre: "Поезія",
      pages: 700,
      isAvailable: false,
    },
  ];

  return {
    addBook: function (title, author, genre, pages) {
      books.push({ title, author, genre, pages, isAvailable: true });
      console.log(`Додано книгу: "${title}"`);
    },

    removeBook: function (title) {
      books = books.filter((book) => book.title !== title);
      console.log(`Книгу "${title}" видалено.`);
    },

    findBooksByAuthor: function (author) {
      return books.filter((book) => book.author === author);
    },

    toggleBookAvailability: function (title, isBorrowed) {
      let book = books.find((b) => b.title === title);
      if (book) {
        book.isAvailable = !isBorrowed;
        console.log(
          `Статус книги "${title}" змінено на: ${book.isAvailable ? "Доступна" : "Взята"}`,
        );
      }
    },

    sortBooksByPages: function () {
      books.sort((a, b) => a.pages - b.pages);
      console.log("Книги відсортовано за сторінками.");
    },

    getBooksStatistics: function () {
      let total = books.length;
      let available = books.filter((b) => b.isAvailable).length;
      let borrowed = total - available;
      let avgPages =
        total === 0 ? 0 : books.reduce((sum, b) => sum + b.pages, 0) / total;

      return {
        ЗагальнаКількість: total,
        Доступні: available,
        Взяті: borrowed,
        СередняКількістьСторінок: Math.round(avgPages),
      };
    },

    showAllBooks: function () {
      console.log(JSON.parse(JSON.stringify(books)));
    },
  };
}

function testLibraryManager() {
  console.log("\n=== Завдання 6 ===");
  let myLibrary = createLibraryManager();

  myLibrary.addBook("Тигрові лови", "Іван Багряний", "Роман", 256);
  let orwellBooks = myLibrary.findBooksByAuthor("Джордж Орвелл");
  console.log("Книги Орвелла:", orwellBooks);

  myLibrary.toggleBookAvailability("1984", true);
  myLibrary.sortBooksByPages();
  myLibrary.showAllBooks();
  console.log("Статистика бібліотеки:", myLibrary.getBooksStatistics());
}

function updateStudentProfile() {
  console.log("\n=== Завдання 7 ===");
  let student = {
    name: "Назар",
    age: 19,
    course: 2,
  };

  student.subjects = ["Вища математика", "Веб-технології", "Англійська мова"];

  delete student.age;

  console.log("Оновлений об'єкт студента:", student);
}

processFruitsArray();
analyzeColorsArray();
manageEmployeeRecords();
manageStudentRecords();
performNumberCalculations();
testLibraryManager();
updateStudentProfile();
