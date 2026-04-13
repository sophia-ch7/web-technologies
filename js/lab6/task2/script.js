const createTask = (text) => ({
  id: Date.now().toString(),
  text: text.trim(),
  completed: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const addTask = (tasks, task) => [...tasks, task];

const removeTask = (tasks, id) => tasks.filter((task) => task.id !== id);

const toggleTaskStatus = (tasks, id) =>
  tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed, updatedAt: Date.now() }
      : task,
  );

const updateTaskText = (tasks, id, newText) =>
  tasks.map((task) =>
    task.id === id && task.text !== newText
      ? { ...task, text: newText.trim(), updatedAt: Date.now() }
      : task,
  );

const sortTasks = (tasks, criteria) => {
  const tasksCopy = [...tasks];
  switch (criteria) {
    case "createdAt":
      return tasksCopy.sort((a, b) => b.createdAt - a.createdAt);
    case "updatedAt":
      return tasksCopy.sort((a, b) => b.updatedAt - a.updatedAt);
    case "status":
      return tasksCopy.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1,
      );
    default:
      return tasksCopy;
  }
};

let state = {
  tasks: [],
  sortBy: "createdAt",
};

const els = {
  form: document.getElementById("add-task-form"),
  input: document.getElementById("task-input"),
  list: document.getElementById("task-list"),
  sortPanel: document.getElementById("sort-controls"),
};

const render = () => {
  els.list.innerHTML = "";

  const sortedTasks = sortTasks(state.tasks, state.sortBy);

  sortedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="checkbox-custom" ${task.completed ? "checked" : ""}>
      <span class="task-text">${task.text}</span>
      <div class="actions">
        <button type="button" class="btn-edit" title="Редагувати">✎</button>
        <button type="button" class="btn-delete" title="Видалити">✖</button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox-custom");
    checkbox.addEventListener("change", () => {
      state.tasks = toggleTaskStatus(state.tasks, task.id);
      render();
    });

    li.addEventListener("click", (e) => {
      if (e.target === li) {
        state.tasks = toggleTaskStatus(state.tasks, task.id);
        render();
      }
    });

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.classList.add("removing");
      setTimeout(() => {
        state.tasks = removeTask(state.tasks, task.id);
        render();
      }, 300);
    });

    const editBtn = li.querySelector(".btn-edit");
    const textSpan = li.querySelector(".task-text");

    const enableEditing = (e) => {
      e.stopPropagation();
      textSpan.setAttribute("contenteditable", "true");
      textSpan.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textSpan);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const saveEditing = () => {
      textSpan.setAttribute("contenteditable", "false");
      const newText = textSpan.textContent;
      if (newText.trim().length > 0) {
        state.tasks = updateTaskText(state.tasks, task.id, newText);
      }
      render();
    };

    editBtn.addEventListener("click", enableEditing);

    textSpan.addEventListener("blur", saveEditing);

    textSpan.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        textSpan.blur();
      }
    });

    els.list.appendChild(li);
  });
};

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.input.value;

  const newTask = createTask(text);
  state.tasks = addTask(state.tasks, newTask);

  els.input.value = "";
  render();
});

els.sortPanel.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  els.sortPanel
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  state.sortBy = e.target.dataset.sort;
  render();
});

render();
