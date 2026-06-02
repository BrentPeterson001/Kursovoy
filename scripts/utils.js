// ========== РАБОТА С ДАТАМИ ==========
const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Форматирование даты
const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = getTodayDate();
    if (dateStr === today) return 'Сегодня';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

// Получить даты для периода
const getPeriodDates = (period) => {
    const today = new Date();
    const dates = [];
    
    if (period === 'week') {
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            dates.push(`${year}-${month}-${day}`);
        }
    } else if (period === 'month') {
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            dates.push(`${year}-${month}-${day}`);
        }
    }
    return dates;
};