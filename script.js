// State management
const state = {
    todos: JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, text: "Complete online JavaScript course", completed: true },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false }
    ],
    filter: 'all',
    isDarkMode: localStorage.getItem('darkMode') === 'true'
};

// DOM references (cached)
const elements = {
    todoInput: document.getElementById('todoInput'),
    todoList: document.getElementById('todoList'),
    itemsLeft: document.getElementById('itemsLeft'),
    clearCompleted: document.getElementById('clearCompleted'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    desktopFilters: document.getElementById('desktopFilters'),
    mobileFilters: document.getElementById('mobileFilters')
};

// Initialize theme
function initTheme() {
    if (state.isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    elements.themeIcon.src = 'icon-sun.svg';
    elements.themeIcon.alt = 'Light mode';
    }
}

// Save to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(state.todos));
}

// Create todo DOM element (only called once per todo)
function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.draggable = true;
    div.dataset.id = todo.id;
    
    // Only add adding animation for new items
    if (todo.isNew) {
    div.classList.add('adding');
    delete todo.isNew;
    }
    
    div.innerHTML = `
    <div class="checkbox ${todo.completed ? 'checked' : ''}">
        <img src="./images/icon-check.svg" alt="" class="check-icon">
    </div>
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <button class="delete-btn" aria-label="Delete todo">
        <img src="./images/icon-cross.svg" alt="cross-icon">
    </button>
    `;
    
    // Attach event listeners directly to elements
    const checkbox = div.querySelector('.checkbox');
    checkbox.addEventListener('click', () => toggleTodo(todo.id));
    
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id, div));
    
    // Drag events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    
    return div;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial render - only called once
function initialRender() {
    elements.todoList.innerHTML = '';
    state.todos.forEach(todo => {
    elements.todoList.appendChild(createTodoElement(todo));
    });
    updateStats();
    applyFilter();
}

// Add new todo - only creates one new element
function addTodo(text) {
    if (!text.trim()) return;
    
    const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    isNew: true
    };
    
    state.todos.unshift(newTodo);
    saveTodos();
    
    // Insert new element at the beginning
    const newElement = createTodoElement(newTodo);
    elements.todoList.insertBefore(newElement, elements.todoList.firstChild);
    
    // Update only the stats and visibility
    updateStats();
    applyFilterToElement(newElement, newTodo);
}

// Toggle todo - only updates the specific element
function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    
    todo.completed = !todo.completed;
    saveTodos();
    
    // Find and update only the specific DOM element
    const element = elements.todoList.querySelector(`[data-id="${id}"]`);
    if (element) {
    element.classList.toggle('completed', todo.completed);
    element.querySelector('.checkbox').classList.toggle('checked', todo.completed);
    
    // Update visibility based on current filter
    applyFilterToElement(element, todo);
    }
    
    updateStats();
}

// Delete todo - removes only that element with animation
function deleteTodo(id, element) {
    state.todos = state.todos.filter(t => t.id !== id);
    saveTodos();
    
    // Animate removal
    element.style.transform = 'translateX(100%)';
    element.style.opacity = '0';
    
    setTimeout(() => {
    element.remove();
    updateStats();
    }, 300);
}

// Update only the stats text
function updateStats() {
    const activeCount = state.todos.filter(t => !t.completed).length;
    elements.itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    
    // Show/hide clear completed button
    const hasCompleted = state.todos.some(t => t.completed);
    elements.clearCompleted.style.visibility = hasCompleted ? 'visible' : 'hidden';
}

// Apply filter to single element
function applyFilterToElement(element, todo) {
    const shouldShow = state.filter === 'all' || 
                    (state.filter === 'active' && !todo.completed) ||
                    (state.filter === 'completed' && todo.completed);
    
    element.classList.toggle('hidden', !shouldShow);
}

// Apply filter to all elements (only when filter changes)
function applyFilter() {
    const elements = document.querySelectorAll('.todo-item');
    elements.forEach(el => {
    const id = parseInt(el.dataset.id);
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
        applyFilterToElement(el, todo);
    }
    });
}

// Set filter - only updates visibility, doesn't re-render
function setFilter(filter) {
    state.filter = filter;
    
    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    applyFilter();
}

// Clear completed - only removes completed elements
function clearCompleted() {
    const completedElements = elements.todoList.querySelectorAll('.todo-item.completed');
    
    completedElements.forEach(el => {
    el.style.transform = 'translateX(100%)';
    el.style.opacity = '0';
    });
    
    setTimeout(() => {
    completedElements.forEach(el => el.remove());
    state.todos = state.todos.filter(t => !t.completed);
    saveTodos();
    updateStats();
    }, 300);
}

// Drag and drop handlers
let draggedElement = null;
let draggedId = null;

function handleDragStart(e) {
    draggedElement = this;
    draggedId = parseInt(this.dataset.id);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
    draggedId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedElement || draggedElement === this) return;

    const targetId = parseInt(this.dataset.id);
    const draggedIndex = state.todos.findIndex(t => t.id === draggedId);
    const targetIndex = state.todos.findIndex(t => t.id === targetId);

    if (draggedIndex > -1 && targetIndex > -1) {
    // Reorder array
    const [removed] = state.todos.splice(draggedIndex, 1);
    state.todos.splice(targetIndex, 0, removed);
    saveTodos();
    
    // Reorder DOM elements (no re-render)
    if (draggedIndex < targetIndex) {
        this.parentNode.insertBefore(draggedElement, this.nextSibling);
    } else {
        this.parentNode.insertBefore(draggedElement, this);
    }
    }
}

// Event listeners
elements.todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
    addTodo(elements.todoInput.value);
    elements.todoInput.value = '';
    }
});

elements.clearCompleted.addEventListener('click', clearCompleted);

elements.themeToggle.addEventListener('click', () => {
    state.isDarkMode = !state.isDarkMode;
    if (state.isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    elements.themeIcon.src = './images/icon-sun.svg';
    elements.themeIcon.alt = 'Light mode';
    } else {
    document.documentElement.removeAttribute('data-theme');
    elements.themeIcon.src = './images/icon-moon.svg';
    elements.themeIcon.alt = 'Dark mode';
    }
    localStorage.setItem('darkMode', state.isDarkMode);
});

// Filter buttons
[elements.desktopFilters, elements.mobileFilters].forEach(container => {
    container.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        setFilter(e.target.dataset.filter);
    }
    });
});

// Initialize
initTheme();
initialRender();
