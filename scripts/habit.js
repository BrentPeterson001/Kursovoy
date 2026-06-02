// ========== КЛАСС ПРИВЫЧКИ ==========
class HabitItem {
    constructor(id, name, completedDates = [], createdAt = null) {
        this.id = id;
        this.name = name;
        this.completedDates = completedDates;
        this.createdAt = createdAt || getTodayDate();
    }
    
    isCompletedToday() {
        return this.completedDates.includes(getTodayDate());
    }
    
    toggleComplete() {
        const today = getTodayDate();
        if (this.completedDates.includes(today)) {
            this.completedDates = this.completedDates.filter(date => date !== today);
        } else {
            this.completedDates.push(today);
        }
        return this;
    }
    
    // Получить серию для конкретной даты
    getStreakForDate(targetDate) {
        if (!this.completedDates.length) return 0;
        
        const sortedDates = [...this.completedDates].sort().reverse();
        if (sortedDates[0] !== targetDate) return 0;
        
        let streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = new Date(sortedDates[i]);
            const curr = new Date(sortedDates[i - 1]);
            const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
    
    getStreak() {
        return this.getStreakForDate(getTodayDate());
    }
}