// ========== ПРОЦЕНТ ВЫПОЛНЕНИЯ ЗА ДАТУ ==========
const getPercentForDate = (date) => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(habit => habit.completedDates.includes(date)).length;
    return (completedCount / habits.length) * 100;
};

const getTotalCompletions = () => {
    return habits.reduce((total, habit) => total + habit.completedDates.length, 0);
};

const getLongestStreak = () => {
    if (habits.length === 0) return 0;
    return habits.reduce((max, habit) => Math.max(max, habit.getStreak()), 0);
};

const displayStats = () => {
    let statsDiv = document.querySelector('.habits-stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'habits-stats';
        const habitsMenu = document.querySelector('.habits-menu');
        if (habitsMenu) {
            habitsMenu.insertBefore(statsDiv, document.getElementById('habitsList'));
        }
    }
    
    const percentForDate = getPercentForDate(currentSelectedDate);
    const dateLabel = currentSelectedDate === getTodayDate() ? 'Сегодня' : formatDisplayDate(currentSelectedDate);
    
    statsDiv.innerHTML = `
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-value">${percentForDate.toFixed(0)}%</div>
                <div class="stat-label">${dateLabel}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${getTotalCompletions()}</div>
                <div class="stat-label">Всего выполнено</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${getLongestStreak()}</div>
                <div class="stat-label">Макс. серия</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${habits.length}</div>
                <div class="stat-label">Всего привычек</div>
            </div>
        </div>
    `;
};