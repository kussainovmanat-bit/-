const dateInput = document.getElementById('date');
const taskInput = document.getElementById('task');
const timeInput = document.getElementById('time');
const list = document.getElementById('list');

dateInput.valueAsDate = new Date();
loadTasks();

dateInput.addEventListener('change', loadTasks);

if ('Notification' in window) {
  Notification.requestPermission();
}

function storageKey() {
  return 'tasks-' + dateInput.value;
}

function loadTasks() {
  list.innerHTML = '';
  const tasks = JSON.parse(localStorage.getItem(storageKey())) || [];

  if (tasks.length === 0) {
    list.innerHTML = '<li>📭 Дел на эту дату нет</li>';
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.time
      ? `${task.time} — ${task.text}`
      : task.text;
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

  tasks.push({
    text: taskInput.value,
    time: timeInput.value,
    done: false
  });

  localStorage.setItem(storageKey(), JSON.stringify(tasks));

  if (timeInput.value) {
    scheduleNotification(taskInput.value, timeInput.value);
  }

  taskInput.value = '';
  timeInput.value = '';
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

function scheduleNotification(text, time) {
  const [hours, minutes] = time.split(':');
  const now = new Date();
  const notifyTime = new Date(dateInput.value);

  notifyTime.setHours(hours, minutes, 0);

  const delay = notifyTime - now;
  if (delay <= 0) return;

  setTimeout(() => {
    new Notification('Напоминание', {
      body: text
    });
  }, delay);
}
