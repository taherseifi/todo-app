const input = document.getElementById('input');
const btn = document.getElementById('addBtn');
const list = document.getElementById('todoList');

/* ===== LocalStorage Helpers ===== */
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* ===== Add Task ===== */
function addTask(task, completed = false, save = true) {
  if (task.trim() === '') return;

  const li = document.createElement('li');
  li.className =
    "flex items-center justify-between bg-white text-black p-4 mb-2 rounded-lg shadow text-xl";

  li.innerHTML = `
    <span class="task-text">${task}</span>
    <div class="flex items-center gap-3">
      <button class="deleteBtn bg-red-600 text-white p-2 rounded-lg">Delete</button>
      <input type="checkbox" class="chek">
      <button class="editTask bg-yellow-500 text-black p-2 rounded-lg">Edit</button>
    </div>
  `;

  const taskText = li.querySelector('.task-text');
  const checkbox = li.querySelector('.chek');
  const deleteBtn = li.querySelector('.deleteBtn');
  const editBtn = li.querySelector('.editTask');

  checkbox.checked = completed;
  if (completed) {
    taskText.classList.add('line-through', 'bg-gray-400');
  }

  /* ===== Checkbox ===== */
  checkbox.addEventListener('change', () => {
    let tasks = getTasks();
    const index = tasks.findIndex(t => t.text === taskText.textContent);
    tasks[index].completed = checkbox.checked;
    saveTasks(tasks);

    taskText.classList.toggle('line-through');
    taskText.classList.toggle('bg-gray-400');
  });

  /* ===== Delete ===== */
  deleteBtn.addEventListener('click', () => {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.text !== taskText.textContent);
    saveTasks(tasks);
    li.remove();
  });

  /* ===== Edit ===== */
  editBtn.addEventListener('click', () => {
    const newTask = prompt('Edit your task:', taskText.textContent);
    if (!newTask || newTask.trim() === '') return;

    let tasks = getTasks();
    const index = tasks.findIndex(t => t.text === taskText.textContent);
    tasks[index].text = newTask;
    saveTasks(tasks);

    taskText.textContent = newTask;
  });

  list.appendChild(li);

  if (save) {
    const tasks = getTasks();
    tasks.push({ text: task, completed: false });
    saveTasks(tasks);
  }

  input.value = '';
}

/* ===== Events ===== */
btn.addEventListener('click', () => {
  addTask(input.value);
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask(input.value);
  }
});

/* ===== Load From LocalStorage ===== */
window.addEventListener('DOMContentLoaded', () => {
  const tasks = getTasks();
  tasks.forEach(task => addTask(task.text, task.completed, false));
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker Registered'));
}
