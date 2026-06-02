// ========== КАЛЕНДАРЬ ==========
let currentCalendarDate = new Date();

const getDayPercent = (dateStr) => {
    if (!habits || habits.length === 0) return 0;
    const completed = habits.filter(h => h.completedDates && h.completedDates.includes(dateStr)).length;
    return (completed / habits.length) * 100;
};

const getDayStatus = (percent) => {
    if (percent === 100) return 'completed';
    if (percent > 0) return 'partial';
    return 'none';
};

const getDaySymbol = (percent) => {
    if (percent === 100) return '✓';
    if (percent > 0) return '◐';
    return '○';
};

const getPercentClass = (percent) => {
    if (percent === 100) return 'high';
    if (percent >= 50) return 'medium';
    return 'low';
};

const getMonthDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startWeekday = firstDay.getDay();
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;
    
    const days = [];
    
    for (let i = 0; i < startWeekday; i++) {
        days.push({ isEmpty: true });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const yearStr = year;
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
        
        const date = new Date(year, month, day);
        const percent = getDayPercent(dateStr);
        
        days.push({
            isEmpty: false,
            dayNumber: day,
            dateStr: dateStr,
            percent: percent,
            status: getDayStatus(percent),
            symbol: getDaySymbol(percent),
            percentClass: getPercentClass(percent),
            isToday: dateStr === getTodayDate(),
            isWeekend: date.getDay() === 0 || date.getDay() === 6
        });
    }
    
    return days;
};

const renderCalendar = () => {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    const days = getMonthDays();
    
    calendarGrid.innerHTML = days.map(day => {
        if (day.isEmpty) {
            return `<div class="empty-day"></div>`;
        }
        
        return `
            <div class="calendar-day ${day.isToday ? 'today' : ''}" onclick="selectDate('${day.dateStr}')">
                <div class="day-number ${day.isWeekend ? 'weekend' : ''}">${day.dayNumber}</div>
                <div class="day-check ${day.status}">${day.symbol}</div>
                <div class="day-percent ${day.percentClass}">${day.percent.toFixed(0)}%</div>
            </div>
        `;
    }).join('');
    
    updateMonthTitle();
    updateCalendarStats();
};

const updateMonthTitle = () => {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const titleElement = document.getElementById('monthTitle');
    if (titleElement) {
        titleElement.textContent = `${monthNames[month]} ${year}`;
    }
};

const updateCalendarStats = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let completedCount = 0;
    habits.forEach(habit => {
        habit.completedDates.forEach(date => {
            const d = new Date(date);
            if (d.getFullYear() === year && d.getMonth() === month) {
                completedCount++;
            }
        });
    });
    
    const totalPossible = habits.length * daysInMonth;
    const monthPercent = totalPossible > 0 ? (completedCount / totalPossible * 100).toFixed(0) : 0;
    
    let bestStreak = 0;
    habits.forEach(habit => {
        let currentStreak = 0;
        let maxStreak = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (habit.completedDates.includes(dayStr)) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        bestStreak = Math.max(bestStreak, maxStreak);
    });
    
    const monthCompletedEl = document.getElementById('monthCompleted');
    const monthPercentEl = document.getElementById('monthPercent');
    const bestStreakEl = document.getElementById('bestStreak');
    
    if (monthCompletedEl) monthCompletedEl.textContent = completedCount;
    if (monthPercentEl) monthPercentEl.textContent = `${monthPercent}%`;
    if (bestStreakEl) bestStreakEl.textContent = bestStreak;
};

const changeMonth = (delta) => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
};

const goToToday = () => {
    currentCalendarDate = new Date();
    renderCalendar();
};

const selectDate = (dateStr) => {
    localStorage.setItem('selectedViewDate', dateStr);
    window.location.href = 'habits.html';
};

const initCalendar = () => {
    if (document.getElementById('calendarGrid')) {
        renderCalendar();
    }
};

const waitForHabits = () => {
    if (habits && habits.length > 0) {
        initCalendar();
    } else if (document.getElementById('calendarGrid')) {
        setTimeout(waitForHabits, 100);
    }
};

// Экспорт функций
window.renderCalendar = renderCalendar;
window.changeMonth = changeMonth;
window.goToToday = goToToday;
window.selectDate = selectDate;

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    waitForHabits();
});