const listItems = document.querySelectorAll("ul li");

listItems.forEach(function (item) {
  item.textContent = "Hello world!";
});

function showStudentName(buttonElement) {
  buttonElement.textContent = "Sophia";
}
