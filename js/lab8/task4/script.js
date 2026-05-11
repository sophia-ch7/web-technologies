document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  const grid = document.getElementById("sortable-grid");

  let isEditMode = false;
  let draggedItem = null;

  const placeholder = document.createElement("div");
  placeholder.classList.add("placeholder");

  editBtn.addEventListener("click", () => {
    isEditMode = !isEditMode;

    if (isEditMode) {
      grid.classList.add("edit-mode");
      editBtn.classList.add("done");
      editBtn.textContent = "Готово";
    } else {
      grid.classList.remove("edit-mode");
      editBtn.classList.remove("done");
      editBtn.textContent = "Редагувати";
    }

    document.querySelectorAll(".card").forEach((card) => {
      card.setAttribute("draggable", isEditMode);
    });
  });

  grid.addEventListener("click", (e) => {
    if (isEditMode && e.target.classList.contains("delete-btn")) {
      const cardToRemove = e.target.closest(".card");
      cardToRemove.remove();
    }
  });

  grid.addEventListener("dragstart", (e) => {
    if (!isEditMode) {
      e.preventDefault();
      return;
    }

    draggedItem = e.target.closest(".card");

    setTimeout(() => {
      draggedItem.style.display = "none";
      draggedItem.after(placeholder);
    }, 0);
  });

  grid.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!isEditMode || !draggedItem) return;

    const targetCard = e.target.closest(".card");

    if (targetCard && targetCard !== draggedItem) {
      const rect = targetCard.getBoundingClientRect();
      const isAfter = e.clientX - rect.left > rect.width / 2;

      if (isAfter) {
        targetCard.after(placeholder);
      } else {
        targetCard.before(placeholder);
      }
    } else if (e.target === grid) {
      grid.appendChild(placeholder);
    }
  });

  grid.addEventListener("dragend", () => {
    if (!draggedItem) return;

    draggedItem.style.display = "flex";
    placeholder.replaceWith(draggedItem);
    draggedItem = null;
  });
});
