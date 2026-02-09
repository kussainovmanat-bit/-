const dateInput = document.getElementById('date');
const taskInput = document.getElementById('task');
const list = document.getElementById('list');

dateInput.valueAsDate = new Date();
loadTasks();

dateInput.addEventListener('change', loadTasks);

function storageKey() {
  return 'tasks-' + dateInput.value;
}

function loadTasks() {
  list.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem(storageKey())) || [];

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.done) span.classList.add('done');
    span.onclick = () => toggleTask(index);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = () => deleteTask(index);

    actions.appendChild(del);
    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function addTask() {
  if (!taskInput.value) return;

  const tasks = JSON.parse(localStorage.getItem(storageKey())) || [];
  tasks.push({ text: taskInput.value, done: false });
  localStorage.setItem(storageKey(), JSON.stringify(tasks));

  taskInput.value = '';
  loadTasks();
}

function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem(storageKey()));
  tasks[index].done = !tasks[index].done;
  localStorage.setItem(storageKey(), JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem(storageKey()));
  tasks.splice(index, 1);
  localStorage.setItem(storageKey(), JSON.stringify(tasks));
  loadTasks();
}
