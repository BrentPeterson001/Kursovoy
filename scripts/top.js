// ========== СТРАНИЦА ТОП ПРИВЫЧЕК ==========
let currentTopPeriod = 'all';

const getHabitPercentForPeriod = (habit, period) => {
    if (period === 'all') {
        const maxPossible = 30;
        const percent = (habit.completedDates.length / maxPossible) * 100;
        return Math.min(100, percent).toFixed(0);
    } else {
        const dates = getPeriodDates(period);
        let completed = 0;
        dates.forEach(date => {
            if (habit.completedDates.includes(date)) completed++;
        });
        return (completed / dates.length * 100).toFixed(0);
    }
};

const getSortedHabits = () => {
    if (!habits || habits.length === 0) return [];
    return [...habits].sort((a, b) => {
        const percentA = parseInt(getHabitPercentForPeriod(a, currentTopPeriod));
        const percentB = parseInt(getHabitPercentForPeriod(b, currentTopPeriod));
        return percentB - percentA;
    });
};

const getRankIcon = (index) => {
    if (index === 0) return '1.';
    if (index === 1) return '2.';
    if (index === 2) return '3.';
    return `${index + 1}`;
};

const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
};

// ========== ОБНОВЛЕНИЕ СТАТИСТИКИ ТОПА ==========
const updateTopStats = (sortedHabits) => {
    const totalHabits = sortedHabits.length;
    const bestPercent = totalHabits > 0 ? getHabitPercentForPeriod(sortedHabits[0], currentTopPeriod) : 0;
    
    let totalPercent = 0;
    sortedHabits.forEach(habit => {
        totalPercent += parseInt(getHabitPercentForPeriod(habit, currentTopPeriod));
    });
    const averagePercent = totalHabits > 0 ? (totalPercent / totalHabits).toFixed(0) : 0;
    
    const totalEl = document.getElementById('topTotalHabits');
    const bestEl = document.getElementById('topBestPercent');
    const avgEl = document.getElementById('topAveragePercent');
    
    if (totalEl) totalEl.textContent = totalHabits;
    if (bestEl) bestEl.textContent = `${bestPercent}%`;
    if (avgEl) avgEl.textContent = `${averagePercent}%`;
};

// ========== СМЕНА ПЕРИОДА ==========
const changeTopPeriod = (period) => {
    currentTopPeriod = period;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((period === 'all' && btn.textContent === 'За всё время') ||
            (period === 'month' && btn.textContent === 'За месяц') ||
            (period === 'week' && btn.textContent === 'За неделю')) {
            btn.classList.add('active');
        }
    });
    
    renderTopHabits();
};

// ========== ОТРИСОВКА ТОПА ==========
const renderTopHabits = () => {
    
    const topList = document.getElementById('topList');
    if (!topList) {
        return;
    }
    
    if (!habits || habits.length === 0) {
        topList.innerHTML = `
            <div class="empty-state">
                <div class="empty-emoji">✨</div>
                <div class="empty-text">Нет привычек</div>
                <div class="empty-hint">Добавьте первую привычку на главной странице</div>
            </div>
        `;
        if (typeof updateTopStats === 'function') updateTopStats([]);
        return;
    }
    
    const sortedHabits = getSortedHabits();
    
    topList.innerHTML = sortedHabits.map((habit, index) => {
        const percent = getHabitPercentForPeriod(habit, currentTopPeriod);
        const rankIcon = getRankIcon(index);
        const rankClass = getRankClass(index);
        const streak = habit.getStreak();
        
        return `
            <div class="top-item">
                <div class="top-rank ${rankClass}">
                    ${index < 3 ? rankIcon : `${rankIcon}.`}
                </div>
                <div class="top-name">${(habit.name)}</div>
                <div class="top-percent">
                    <div class="top-percent-value">${percent}%</div>
                    <div class="top-percent-bar">
                        <div class="top-percent-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
                <div class="top-streak">🔥 ${streak}</div>
            </div>
        `;
    }).join('');
    
    updateTopStats(sortedHabits);
};


// ========== ОБНОВЛЕНИЕ ТОПА (ДЛЯ ВЫЗОВА ИЗ UI.JS) ==========
const refreshTop = () => {
    if (document.getElementById('topList')) {
        renderTopHabits();
    }
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const initTopPage = () => {
    // Ждём загрузки данных с помощью setTimeout
    const waitForData = () => {
        if (habits && habits.length > 0) {
            renderTopHabits();
        } else {
            setTimeout(waitForData, 50);
        }
    };
    
    waitForData();
};

// ========== ЭКСПОРТ ФУНКЦИЙ ==========
window.renderTopHabits = renderTopHabits;
window.refreshTop = refreshTop;
window.changeTopPeriod = changeTopPeriod;

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', initTopPage);