import React, { useState } from 'react';
import { useStore } from '../store';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns';

export const CalendarView: React.FC = () => {
  const { plans, toggleTask, startTimer, stopTimer, isTimerRunning, currentTimerTaskId } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 获取所有任务按日期分组
  const tasksByDate: Record<string, { task: any; plan: any }[]> = {};
  plans.forEach((plan) => {
    plan.tasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
        tasksByDate[dateKey].push({ task, plan });
      }
    });
  });

  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // 月统计
  const monthTasks = Object.entries(tasksByDate).filter(([dateKey]) => {
    const date = new Date(dateKey);
    return isSameMonth(date, currentDate);
  });
  const monthTotalTasks = monthTasks.reduce((sum, [, tasks]) => sum + tasks.length, 0);
  const monthCompletedTasks = monthTasks.reduce(
    (sum, [, tasks]) => sum + tasks.filter((t) => t.task.completed).length,
    0
  );
  const monthPendingTasks = monthTotalTasks - monthCompletedTasks;

  // 选中日期任务
  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedTasks = selectedDateKey ? tasksByDate[selectedDateKey] || [] : [];

  return (
    <div className="calendar-view">
      <h2 className="page-title">
        <Calendar size={24} />
        日历视图
      </h2>

      <div className="calendar-layout">
        {/* 左侧 - 日历 */}
        <div className="calendar-main">
          {/* 头部导航 */}
          <div className="calendar-header">
            <div className="calendar-nav">
              <button onClick={goToPrevMonth} className="calendar-nav-btn">
                <ChevronLeft size={18} />
              </button>
              <h3>{format(currentDate, 'yyyy年 MM月')}</h3>
              <button onClick={goToNextMonth} className="calendar-nav-btn">
                <ChevronRight size={18} />
              </button>
            </div>
            <button className="btn-today" onClick={goToToday}>
              今天
            </button>
          </div>

          {/* 月统计 */}
          <div className="calendar-month-stats">
            <div className="month-stat">
              <Target size={14} />
              <span>{monthTotalTasks} 任务</span>
            </div>
            <div className="month-stat completed">
              <CheckCircle2 size={14} />
              <span>{monthCompletedTasks} 完成</span>
            </div>
            <div className="month-stat pending">
              <Clock size={14} />
              <span>{monthPendingTasks} 待办</span>
            </div>
          </div>

          {/* 星期标题 */}
          <div className="calendar-weekdays">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="calendar-days">
            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate[dateKey] || [];
              const completedCount = dayTasks.filter((t) => t.task.completed).length;
              const pendingCount = dayTasks.length - completedCount;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={dateKey}
                  className={`calendar-day ${isCurrentMonth ? '' : 'other-month'} ${
                    isTodayDate ? 'today' : ''
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="day-number">{format(day, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <div className="day-dots">
                      {pendingCount > 0 && (
                        <span className="day-dot pending" title={`${pendingCount} 待办`} />
                      )}
                      {completedCount > 0 && (
                        <span className="day-dot completed" title={`${completedCount} 完成`} />
                      )}
                      {dayTasks.length > 3 && (
                        <span className="day-dot-more">+</span>
                      )}
                    </div>
                  )}
                  {dayTasks.length > 0 && (
                    <span className="day-task-count">{dayTasks.length}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧 - 选中日期详情 */}
        <div className="calendar-side">
          <div className="day-detail-card">
            <div className="day-detail-header">
              <h3>
                {selectedDate
                  ? isToday(selectedDate)
                    ? '今日任务'
                    : format(selectedDate, 'MM月dd日')
                  : '选择日期'}
              </h3>
              {selectedDate && (
                <span className="day-detail-count">
                  {selectedTasks.length} 个任务
                </span>
              )}
            </div>

            {selectedTasks.length > 0 ? (
              <div className="day-task-list">
                {selectedTasks.map((item, idx) => (
                  <div
                    key={idx}
                    className={`day-task-item ${item.task.completed ? 'completed' : ''}`}
                  >
                    <span
                      className="task-status-icon clickable"
                      onClick={() => toggleTask(item.plan.id, item.task.id)}
                    >
                      {item.task.completed ? (
                        <CheckCircle2 size={16} color="#22c55e" />
                      ) : (
                        <Circle size={16} color="#64748b" />
                      )}
                    </span>
                    <div className="task-info">
                      <span className="task-name">{item.task.title}</span>
                      <span className="task-plan-name">{item.plan.title}</span>
                    </div>
                    <span className="task-exp">+{item.task.expReward}</span>
                    {!item.task.completed && (
                      <button
                        className="task-timer-btn"
                        onClick={() => {
                          if (isTimerRunning && currentTimerTaskId === item.task.id) {
                            stopTimer();
                          } else {
                            if (isTimerRunning) stopTimer();
                            startTimer(item.plan.id, item.task.id);
                          }
                        }}
                      >
                        <Clock size={12} />
                        {isTimerRunning && currentTimerTaskId === item.task.id ? '停止' : '计时'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="day-empty">
                <Clock size={32} />
                <p>
                  {selectedDate && isToday(selectedDate)
                    ? '今天没有安排任务'
                    : '该日期没有任务'}
                </p>
              </div>
            )}
          </div>

          {/* 本月概览 */}
          <div className="day-detail-card">
            <div className="day-detail-header">
              <h3>
                <TrendingUp size={16} />
                本月概览
              </h3>
            </div>
            <div className="month-overview">
              <div className="overview-item">
                <span className="overview-label">任务完成率</span>
                <div className="overview-bar">
                  <div
                    className="overview-fill"
                    style={{
                      width: `${monthTotalTasks > 0 ? (monthCompletedTasks / monthTotalTasks) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="overview-value">
                  {monthTotalTasks > 0
                    ? Math.round((monthCompletedTasks / monthTotalTasks) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="os-value">{monthTotalTasks}</span>
                  <span className="os-label">总任务</span>
                </div>
                <div className="overview-stat">
                  <span className="os-value" style={{ color: '#22c55e' }}>
                    {monthCompletedTasks}
                  </span>
                  <span className="os-label">已完成</span>
                </div>
                <div className="overview-stat">
                  <span className="os-value" style={{ color: '#f59e0b' }}>
                    {monthPendingTasks}
                  </span>
                  <span className="os-label">待办</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
