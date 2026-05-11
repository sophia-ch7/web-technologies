document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".kanban-board");

  board.addEventListener("dragstart", (e) => {
    const task = e.target.closest(".task-card");

    if (task) {
      setTimeout(() => {
        task.classList.add("dragging");
      }, 0);
    }
  });

  board.addEventListener("dragend", (e) => {
    const task = e.target.closest(".task-card");

    if (task) {
      task.classList.remove("dragging");
      updateCounters();

      document.querySelectorAll(".column-content").forEach((zone) => {
        zone.classList.remove("drag-over");
      });
    }
  });

  board.addEventListener("dragover", (e) => {
    const zone = e.target.closest(".column-content");

    if (zone) {
      e.preventDefault();
      zone.classList.add("drag-over");
    }
  });

  board.addEventListener("dragleave", (e) => {
    const zone = e.target.closest(".column-content");

    if (zone) {
      zone.classList.remove("drag-over");
    }
  });

  board.addEventListener("drop", (e) => {
    const zone = e.target.closest(".column-content");

    if (zone) {
      e.preventDefault();
      zone.classList.remove("drag-over");

      const draggedTask = document.querySelector(".dragging");
      if (draggedTask) {
        zone.appendChild(draggedTask);
      }
    }
  });

  function updateCounters() {
    const columns = document.querySelectorAll(".kanban-column");
    columns.forEach((column) => {
      const countStr = column.querySelector(".column-content").children.length;
      column.querySelector(".column-header span").textContent = countStr;
    });
  }
});
