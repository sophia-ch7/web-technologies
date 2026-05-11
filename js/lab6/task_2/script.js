let tasks = JSON.parse(localStorage.getItem("myTodoTasks")) || [];
let currentSort = "added_desc";
let editingId = null;

const createTaskObj = (text) => ({
  id: `task-${Date.now()}`,
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const addTask = (tasksArray, text) => [...tasksArray, createTaskObj(text)];

const removeTask = (tasksArray, id) =>
  tasksArray.filter((task) => task.id !== id);

const toggleTaskStatus = (tasksArray, id) =>
  tasksArray.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed, updatedAt: Date.now() }
      : task,
  );

const updateTaskText = (tasksArray, id, newText) =>
  tasksArray.map((task) =>
    task.id === id
      ? { ...task, text: newText.trim(), updatedAt: Date.now() }
      : task,
  );

const sortTasks = (tasksArray, sortType) => {
  const copy = [...tasksArray];
  switch (sortType) {
    case "added_desc":
      return copy.sort((a, b) => b.createdAt - a.createdAt);
    case "added_asc":
      return copy.sort((a, b) => a.createdAt - b.createdAt);
    case "updated_desc":
      return copy.sort((a, b) => b.updatedAt - a.updatedAt);
    case "status":
      return copy.sort((a, b) => Number(a.completed) - Number(b.completed));
    default:
      return copy;
  }
};

function saveState() {
  localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
}

function renderUI() {
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-message");

  const sortedTasks = sortTasks(tasks, currentSort);

  list.innerHTML = "";

  if (sortedTasks.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";

    sortedTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.dataset.id = task.id;

      if (task.id === editingId) {
        li.innerHTML = `
                    <form class="edit-form" id="form-${task.id}">
                        <input type="text" class="edit-input" value="${task.text}" required minlength="3">
                        <div class="task-actions">
                            <button type="submit" class="btn-save">Зберегти</button>
                            <button type="button" class="btn-cancel">Скасувати</button>
                        </div>
                    </form>
                `;
      } else {
        li.innerHTML = `
                    <span class="task-text" title="Натисніть, щоб змінити статус">${task.text}</span>
                    <div class="task-actions">
                        <button class="btn-edit" ${task.completed ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""}>Редаг.</button>
                        <button class="btn-delete">Видал.</button>
                    </div>
                `;
      }

      list.appendChild(li);
    });
  }
}

document.getElementById("task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("new-task-input");

  tasks = addTask(tasks, input.value);
  input.value = "";

  saveState();
  renderUI();
});

document.getElementById("task-list").addEventListener("click", (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("task-text")) {
    tasks = toggleTaskStatus(tasks, id);
    saveState();
    renderUI();
  }

  if (e.target.classList.contains("btn-delete")) {
    li.classList.add("removing");
    setTimeout(() => {
      tasks = removeTask(tasks, id);
      saveState();
      renderUI();
    }, 300);
  }

  if (e.target.classList.contains("btn-edit")) {
    editingId = id;
    renderUI();
  }

  if (e.target.classList.contains("btn-cancel")) {
    editingId = null;
    renderUI();
  }
});

document.getElementById("task-list").addEventListener("submit", (e) => {
  if (e.target.classList.contains("edit-form")) {
    e.preventDefault();
    const li = e.target.closest(".task-item");
    const id = li.dataset.id;
    const newText = e.target.querySelector(".edit-input").value;

    tasks = updateTaskText(tasks, id, newText);
    editingId = null;
    saveState();
    renderUI();
  }
});

document.getElementById("sort-select").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderUI();
});

renderUI();
