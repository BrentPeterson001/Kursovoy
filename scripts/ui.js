// ========== ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM ==========
const habitInput = document.getElementById('habitInput');
const habitsList = document.getElementById('habitsList');

// ========== ДОБАВЛЕНИЕ ПРИВЫЧКИ ==========
const addHabit = () => {
    const input = document.getElementById('habitInput');
    if (!input) return;
    
    const habitName = input.value.trim();
    
    const showError = () => {
        input.style.border = '1px solid #f44336cc';
        setTimeout(() => {
            input.style.border = '';
        }, 1500);
    };
    
    if (habitName === '') {
        showError();
        return;
    }
    
    if (habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) {
        showError();
        return;
    }
    
    const newHabit = new HabitItem(Date.now(), habitName);
    habits.push(newHabit);
    input.value = '';
    displayHabits();
    input.focus();
    saveToStorage();
};

// ========== УДАЛЕНИЕ ПРИВЫЧКИ ==========
const deleteHabit = (id) => {
    habits = habits.filter(habit => habit.id !== id);
    displayHabits();
    saveToStorage();
};

// ========== ОТМЕТКА ВЫПОЛНЕНИЯ (ДЛЯ СЕГОДНЯ) ==========
const toggleComplete = (id) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.toggleComplete();
        displayHabits();
        saveToStorage();
    }
};

// ========== РЕДАКТИРОВАНИЕ ==========
const startEdit = (index) => {
    editingIndex = index;
    displayHabits();
};

const saveEdit = () => {
    const editInput = document.getElementById('editInput');
    if (!editInput || editingIndex === null) return;
    
    const newName = editInput.value.trim();
    
    const showError = () => {
        editInput.style.border = '1px solid #f44336cc';
        setTimeout(() => {
            editInput.style.border = '';
        }, 1500);
    };
    
    if (newName === '') return showError();
    if (habits.some((habit, idx) => habit.name.toLowerCase() === newName.toLowerCase() && idx !== editingIndex)) {
        return showError();
    }
    
    habits[editingIndex].name = newName;
    editingIndex = null;
    displayHabits();
    saveToStorage();
};

const cancelEdit = () => {
    editingIndex = null;
    displayHabits();
};

// ========== ОТОБРАЖЕНИЕ СПИСКА (ДЛЯ СЕГОДНЯ) ==========
const displayHabits = () => {
    if (habits.length === 0) {
        habitsList.innerHTML = `<div class="empty-state"><br><medium>Скоро здесь что-то будет...</medium></div>`;
        displayStats();
        return;
    }
    
    const today = getTodayDate();
    
    habitsList.innerHTML = habits.map((habit, index) => {
        const isCompleted = habit.completedDates.includes(today);
        const streak = habit.getStreak();
        
        if (editingIndex === index) {
            return `
                <div class="habit-item editing">
                    <input type="text" id="editInput" class="edit-input" value="${(habit.name)}" maxlength="50" autocomplete="off">
                    <div class="habit-actions">
                        <button class="save-btn" onclick="saveEdit()">Сохранить</button>
                        <button class="cancel-btn" onclick="cancelEdit()">Отмена</button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="habit-item">
                <div class="habit-info">
                    <input type="checkbox" class="habit-checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleComplete(${habit.id})">
                    <span class="habit-name" onclick="startEdit(${index})">${(habit.name)}</span>
                    ${streak > 0 ? `<span class="habit-streak">🔥 ${streak}</span>` : ''}
                </div>
                <div class="habit-actions">
                    <button class="edit-btn" onclick="startEdit(${index})">Изменить</button>
                    <button class="delete-btn" onclick="deleteHabit(${habit.id})">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    displayStats();
    
    if (editingIndex !== null) {
        setTimeout(() => {
            const editInput = document.getElementById('editInput');
            if (editInput) {
                editInput.focus();
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveEdit();
                });
            }
        }, 100);
    }
};

// ========== ОТМЕТКА ДЛЯ ВЫБРАННОЙ ДАТЫ ==========
const toggleCompleteForDate = (id, date) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        if (habit.completedDates.includes(date)) {
            habit.completedDates = habit.completedDates.filter(d => d !== date);
        } else {
            habit.completedDates.push(date);
        }
        saveToStorage();
        displayHabitsForDate();
        displayStats();
        
        if (typeof renderCalendar === 'function' && document.getElementById('calendarGrid')) {
            renderCalendar();
        }
        if (typeof renderTopHabits === 'function' && document.getElementById('topList')) {
            renderTopHabits();
        }
    }
};

// ========== ОТОБРАЖЕНИЕ СПИСКА ДЛЯ ВЫБРАННОЙ ДАТЫ ==========
const displayHabitsForDate = () => {
    if (habits.length === 0) {
        habitsList.innerHTML = `<div class="empty-state"><br><medium>Скоро здесь что-то будет...</medium></div>`;
        displayStats();
        return;
    }
    
    habitsList.innerHTML = habits.map((habit, index) => {
        const isChecked = habit.completedDates.includes(currentSelectedDate);
        const streak = habit.getStreakForDate(currentSelectedDate);
        
        if (editingIndex === index) {
            return `
                <div class="habit-item editing">
                    <input type="text" id="editInput" class="edit-input" value="${(habit.name)}" maxlength="50">
                    <div class="habit-actions">
                        <button class="save-btn" onclick="saveEdit()">Сохранить</button>
                        <button class="cancel-btn" onclick="cancelEdit()">Отмена</button>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="habit-item">
                <div class="habit-info">
                    <input type="checkbox" class="habit-checkbox" ${isChecked ? 'checked' : ''} 
                           onchange="toggleCompleteForDate(${habit.id}, '${currentSelectedDate}')">
                    <span class="habit-name" onclick="startEdit(${index})">${(habit.name)}</span>
                    ${streak > 0 ? `<span class="habit-streak">🔥 ${streak}</span>` : ''}
                </div>
                <div class="habit-actions">
                    <button class="edit-btn" onclick="startEdit(${index})">Изменить</button>
                    <button class="delete-btn" onclick="deleteHabit(${habit.id})">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    displayStats();
    
    if (editingIndex !== null) {
        setTimeout(() => {
            const editInput = document.getElementById('editInput');
            if (editInput) {
                editInput.focus();
                editInput.onkeypress = (e) => { if (e.key === 'Enter') saveEdit(); };
            }
        }, 100);
    }
};

// ========== ОБРАБОТЧИК ИЗМЕНЕНИЯ ДАТЫ ==========
const onDateChange = () => {
    const dateInput = document.getElementById('historyDate');
    if (dateInput) {
        const newDate = dateInput.value;
        saveSelectedDate(newDate);
        displayHabitsForDate();
    }
};

const initDateInputListener = () => {
    const dateInput = document.getElementById('historyDate');
    if (dateInput) {
        dateInput.value = currentSelectedDate;
        dateInput.removeEventListener('change', onDateChange);
        dateInput.addEventListener('change', onDateChange);
    }
};

// ========== СБРОС СТАТИСТИКИ ==========
const resetAllStats = () => {
    habits.forEach(habit => {
        habit.completedDates = [];
    });
    saveToStorage();

    localStorage.removeItem('defaultHabitAdded')

    displayHabits();
    displayStats();
    
    if (typeof renderCalendar === 'function' && document.getElementById('calendarGrid')) {
        renderCalendar();
    }
    if (typeof renderTopHabits === 'function' && document.getElementById('topList')) {
        renderTopHabits();
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ ВЫБОРА ДАТЫ ==========
const initDateView = () => {
    loadSelectedDate();
    initDateInputListener();
    displayHabitsForDate();
};

// Запускаем инициализацию
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDateView);
} else {
    initDateView();
}