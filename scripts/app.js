// ========== ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
const init = () => {
    // Загружаем данные
    loadFromStorage();
    
    // Загружаем сохранённую дату
    loadSelectedDate();
    
    if (habits.length === 0) {
        const defaultHabit = new HabitItem(Date.now(), 'Зарядка');
        habits.push(defaultHabit);
        saveToStorage();
    }

    // Отображаем привычки для ВЫБРАННОЙ даты
    displayHabitsForDate();
    
    // Получаем инпут
    const input = document.getElementById('habitInput');
    if (input) {
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        const freshInput = document.getElementById('habitInput');
        
        freshInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addHabit();
            }
        });
        
        freshInput.focus();
    }
};

// Запускаем инициализацию
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.updateAllDisplays = () => {
    if (typeof renderCalendar === 'function' && document.getElementById('calendarGrid')) {
        renderCalendar();
    }
    if (typeof renderTopHabits === 'function' && document.getElementById('topList')) {
        renderTopHabits();
    }
    if (typeof displayStats === 'function') {
        displayStats();
    }
};