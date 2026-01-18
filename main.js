const input = document.getElementById("input");
const btn = document.getElementById("addBtn");
const list = document.getElementById("todoList");

/* ===== LocalStorage ===== */
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ===== Create Task Element ===== */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  li.className = `
    flex flex-col sm:flex-row
    sm:items-center sm:justify-between
    gap-3
    p-3 sm:p-4
    rounded-lg shadow
    bg-white text-black
    transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    opacity-0 scale-95 translate-y-2
  `;

  li.innerHTML = `
    <span class="task-text text-base sm:text-lg break-words">
      ${task.text}
    </span>

    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2">
      <button class="deleteBtn bg-red-600 text-white px-3 py-1 rounded-lg text-sm sm:text-base">
        Delete
      </button>

      <input type="checkbox" class="check w-5 h-5 cursor-pointer">

      <button class="editBtn bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm sm:text-base">
        Edit
      </button>
    </div>
  `;

  const taskText = li.querySelector(".task-text");
  const checkbox = li.querySelector(".check");
  const deleteBtn = li.querySelector(".deleteBtn");
  const editBtn = li.querySelector(".editBtn");

  /* ===== Initial Completed State ===== */
  checkbox.checked = task.completed;
  if (task.completed) {
    li.classList.replace("bg-white", "bg-slate-200");
    taskText.classList.add("line-through", "text-gray-500");
  }

  /* ===== Checkbox ===== */
  checkbox.addEventListener("change", () => {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;

    tasks[index].completed = checkbox.checked;
    saveTasks(tasks);

    li.classList.toggle("bg-white");
    li.classList.toggle("bg-slate-200");

    taskText.classList.toggle("line-through");
    taskText.classList.toggle("text-gray-500");

    li.classList.add("scale-105");
    setTimeout(() => li.classList.remove("scale-105"), 150);
  });

  /* ===== Delete ===== */
  deleteBtn.addEventListener("click", () => {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks(tasks);

    li.classList.add(
      "opacity-0",
      "scale-90",
      "-translate-x-6",
      "blur-sm"
    );

    setTimeout(() => li.remove(), 350);
  });

  /* ===== Edit ===== */
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit your task:", task.text);
    if (!newText || newText.trim() === "") return;

    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) return;

    tasks[index].text = newText;
    saveTasks(tasks);

    task.text = newText;
    taskText.textContent = newText;
  });

  list.appendChild(li);

  /* ===== Animate In ===== */
  requestAnimationFrame(() => {
    li.classList.remove("opacity-0", "scale-95", "translate-y-2");
    li.classList.add("opacity-100", "scale-100", "translate-y-0");
  });
}

/* ===== Add Task ===== */
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  createTaskElement(task);
  input.value = "";
}

/* ===== Events ===== */
btn.addEventListener("click", addTask);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

/* ===== Load ===== */
window.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasks();
  tasks.forEach(task => createTaskElement(task));
});

/* ===== Service Worker ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
