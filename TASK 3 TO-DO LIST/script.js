document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const pendingTasksList = document.getElementById('pendingTasksList');
    const completedTasksList = document.getElementById('completedTasksList');

    function getCurrentDateTime() {
        const now = new Date();
        return now.toLocaleString();
    }

    function addTask(taskText, taskDateTime) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        const taskContent = document.createElement('div');
        taskContent.innerHTML = `<span>${taskText}</span><span class="date-time">Added: ${taskDateTime || getCurrentDateTime()}</span>`;
        taskItem.appendChild(taskContent);

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => editTask(taskItem, taskContent));
        taskItem.appendChild(editButton);

        const completeButton = document.createElement('button');
        completeButton.innerText = 'Complete';
        completeButton.classList.add('complete');
        completeButton.addEventListener('click', () => completeTask(taskItem));
        taskItem.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTask(taskItem));
        taskItem.appendChild(deleteButton);

        pendingTasksList.appendChild(taskItem);
    }

    function editTask(taskItem, taskContent) {
        const newText = prompt('Edit task:', taskContent.querySelector('span').innerText);
        if (newText !== null) {
            taskContent.querySelector('span').innerText = newText;
        }
        const newDateTime = prompt('Edit date and time (format: YYYY-MM-DD HH:MM):', taskContent.querySelector('.date-time').innerText.replace('Added: ', ''));
        if (newDateTime !== null) {
            taskContent.querySelector('.date-time').innerText = `Added: ${newDateTime}`;
        }
        saveTasks();
    }

    function completeTask(taskItem) {
        taskItem.classList.add('completed');
        const completedDateTime = document.createElement('span');
        completedDateTime.classList.add('date-time');
        completedDateTime.innerText = `Completed: ${getCurrentDateTime()}`;
        taskItem.querySelector('.date-time').after(completedDateTime);

        const undoButton = document.createElement('button');
        undoButton.innerText = 'Undo';
        undoButton.classList.add('undo');
        undoButton.addEventListener('click', () => undoComplete(taskItem));
        taskItem.appendChild(undoButton);

        completedTasksList.appendChild(taskItem);
        saveTasks();
    }

    function undoComplete(taskItem) {
        taskItem.classList.remove('completed');
        const completedDateTime = taskItem.querySelector('.date-time:last-of-type');
        if (completedDateTime) {
            completedDateTime.remove();
        }
        const undoButton = taskItem.querySelector('.undo');
        if (undoButton) {
            undoButton.remove();
        }
        pendingTasksList.appendChild(taskItem);
        saveTasks();
    }

    function deleteTask(taskItem) {
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.remove();
            saveTasks();
        }
    }

    function saveTasks() {
        const pendingTasks = Array.from(pendingTasksList.children).map(taskItem => ({
            text: taskItem.querySelector('span').innerText,
            dateTime: taskItem.querySelector('.date-time')?.innerText || ''
        }));
        const completedTasks = Array.from(completedTasksList.children).map(taskItem => ({
            text: taskItem.querySelector('span').innerText,
            dateTime: taskItem.querySelector('.date-time')?.innerText || ''
        }));
        localStorage.setItem('tasks', JSON.stringify({ pending: pendingTasks, completed: completedTasks }));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || { pending: [], completed: [] };
        tasks.pending.forEach(task => addTask(task.text, task.dateTime));
        tasks.completed.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item', 'completed');
            const taskContent = document.createElement('div');
            taskContent.innerHTML = `<span>${task.text}</span><span class="date-time">${task.dateTime}</span>`;
            taskItem.appendChild(taskContent);
            const undoButton = document.createElement('button');
            undoButton.innerText = 'Undo';
            undoButton.classList.add('undo');
            undoButton.addEventListener('click', () => undoComplete(taskItem));
            taskItem.appendChild(undoButton);
            completedTasksList.appendChild(taskItem);
        });
    }

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    });

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskButton.click();
        }
    });

    loadTasks();
});
