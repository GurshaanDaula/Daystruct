const activityBank = document.getElementById('activityBank');
const scheduleSlots = document.getElementById('scheduleSlots');
const addActivityBtn = document.getElementById('addActivityBtn');
const activityName = document.getElementById('activityName');
const activityType = document.getElementById('activityType');
const generateRoutineBtn = document.getElementById('generateRoutineBtn');
const routineInput = document.getElementById('routineInput');
const scheduleTitle = document.getElementById('scheduleTitle');
const clearScheduleBtn = document.getElementById('clearScheduleBtn');

const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

const assistantBtn = document.getElementById('assistantBtn');
const assistantInput = document.getElementById('assistantInput');
const assistantResponse = document.getElementById('assistantResponse');

const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');

const dayTabs = document.querySelectorAll('.day-tab');

const timePeriods = [
    '6:00 AM - 8:00 AM',
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM'
];

let activities = [
    { id: generateId(), name: 'Wake Up', type: 'Personal' },
    { id: generateId(), name: 'Breakfast', type: 'Personal' },
    { id: generateId(), name: 'Workout', type: 'Health' },
    { id: generateId(), name: 'Study Session', type: 'Study' }
];

let schedules = {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {}
};

let currentDay = 'Monday';

function generateId() {
    return 'id-' + Math.random().toString(36).substring(2, 11);
}

function init() {
    renderActivityBank();
    renderSchedule(currentDay);
}

function renderActivityBank() {
    activityBank.innerHTML = '';

    activities.forEach(activity => {
        const card = createActivityCard(activity);
        activityBank.appendChild(card);
    });
}

function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.draggable = true;
    card.dataset.id = activity.id;

    card.innerHTML = `
        <h4>${activity.name}</h4>
        <p>${activity.type}</p>
    `;

    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', activity.id);
    });

    return card;
}

function renderSchedule(day) {
    scheduleTitle.textContent = `${day} Schedule`;
    scheduleSlots.innerHTML = '';

    timePeriods.forEach(period => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';

        const assignedActivities = schedules[day][period] || [];

        timeSlot.innerHTML = `
            <div class="time-label">${period}</div>
            <div class="slot-dropzone" data-period="${period}"></div>
        `;

        const dropzone = timeSlot.querySelector('.slot-dropzone');

        assignedActivities.forEach(activity => {
            const card = createActivityCard(activity);
            dropzone.appendChild(card);
        });

        addDropzoneEvents(timeSlot, dropzone);
        scheduleSlots.appendChild(timeSlot);
    });
}

function addDropzoneEvents(timeSlot, dropzone) {
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        timeSlot.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        timeSlot.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        timeSlot.classList.remove('drag-over');

        const activityId = e.dataTransfer.getData('text/plain');
        const activity = activities.find(a => a.id === activityId);

        if (!activity) return;

        const period = dropzone.dataset.period;

        if (!schedules[currentDay][period]) {
            schedules[currentDay][period] = [];
        }

        const alreadyExists = schedules[currentDay][period].some(a => a.id === activity.id);

        if (!alreadyExists) {
            schedules[currentDay][period].push(activity);
            renderSchedule(currentDay);
        }
    });
}

addActivityBtn.addEventListener('click', () => {
    const name = activityName.value.trim();
    const type = activityType.value;

    if (!name) return;

    activities.push({
        id: generateId(),
        name,
        type
    });

    activityName.value = '';
    activityType.value = 'Personal';

    renderActivityBank();
});

generateRoutineBtn.addEventListener('click', () => {
    const text = routineInput.value.trim();
    if (!text) return;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

    lines.forEach(line => {
        activities.push({
            id: generateId(),
            name: line,
            type: 'Imported Routine'
        });
    });

    routineInput.value = '';
    renderActivityBank();
});

dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        dayTabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        currentDay = tab.dataset.day;
        renderSchedule(currentDay);
    });
});

clearScheduleBtn.addEventListener('click', () => {
    schedules[currentDay] = {};
    renderSchedule(currentDay);
});

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active-panel'));

        button.classList.add('active');
        document.getElementById(button.dataset.panel).classList.add('active-panel');
    });
});

/* To-do list */
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

function addTodo() {
    const task = todoInput.value.trim();
    if (!task) return;

    const li = document.createElement('li');
    li.className = 'todo-item';

    const span = document.createElement('span');
    span.textContent = task;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const doneBtn = document.createElement('button');
    doneBtn.className = 'small-btn';
    doneBtn.textContent = 'Done';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'small-btn';
    deleteBtn.textContent = 'Delete';

    doneBtn.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    deleteBtn.addEventListener('click', () => {
        li.remove();
    });

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    todoList.appendChild(li);
    todoInput.value = '';
}

/* Assistant placeholder */
assistantBtn.addEventListener('click', () => {
    const prompt = assistantInput.value.trim();

    if (!prompt) {
        assistantResponse.textContent = 'Try asking something about improving focus, time management, or balancing your day.';
        return;
    }

    assistantResponse.textContent =
        `Suggestion based on: "${prompt}" — Try prioritizing your 2–3 most important tasks early in the day, grouping similar tasks together, and scheduling short breaks between demanding activities.`;
});

init();