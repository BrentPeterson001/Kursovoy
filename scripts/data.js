// ========== МАССИВ ДЛЯ ХРАНЕНИЯ ПРИВЫЧЕК ==========
let habits = [];
let editingIndex = null;
let currentSelectedDate = getTodayDate();

// ========== СОХРАНЕНИЕ В LOCALSTORAGE ==========
const saveToStorage = () => {
    const data = habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        completedDates: habit.completedDates,
        createdAt: habit.createdAt
    }));
    localStorage.setItem('habits', JSON.stringify(data));
};

// ========== ЗАГРУЗКА ИЗ LOCALSTORAGE ==========
const loadFromStorage = () => {
    const saved = localStorage.getItem('habits');
    if (saved) {
        const data = JSON.parse(saved);
        habits = data.map(h => new HabitItem(h.id, h.name, h.completedDates || [], h.createdAt));
    }
};

// Сохранение выбранной даты
const saveSelectedDate = (date) => {
    localStorage.setItem('selectedViewDate', date);
    currentSelectedDate = date;
};

const loadSelectedDate = () => {
    const savedDate = localStorage.getItem('selectedViewDate');
    if (savedDate) {
        currentSelectedDate = savedDate;
    }
};