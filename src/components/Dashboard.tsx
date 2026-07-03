import React from 'react';
import {
  Clock,
  CheckCircle,
  Target,
  Flame,
  TrendingUp,
  BookOpen,
  Play,
  Calendar,
  Zap,
  Pause,
} from 'lucide-react';
import { useStore } from '../store';
import { formatDuration } from '../utils/skillLevels';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { plans, skills, stats, sessions, startTimer, stopTimer, isTimerRunning, currentTimerPlanId, currentTimerTaskId } = useStore();

  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter((t) => t.completed).length;
    return totalTasks > 0 && completedTasks < totalTasks;
  }).length;

  const topSkills = [...skills]
    .sort((a, b) => b.totalExp - a.totalExp)
    .slice(0, 5);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyStudyTime = last7Days.map((date) => {
    const daySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
      return sessionDate === date;
    });
    const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
    return {
      date: date.slice(5),
      hours: Math.round((totalTime / 3600) * 10) / 10,
    };
  });

  const todayTasks = plans.reduce((sum, plan) => {
    return sum + plan.tasks.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return dueDate === today && !t.completed;
    }).length;
  }, 0);

  const totalSkillsWithExp = skills.filter((s) => s.totalExp > 0).length;

  const activePlan = plans.find((p) => {
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter((t) => t.completed).length;
    return totalTasks > 0 && completedTasks < totalTasks;
  });

  const firstPlan = plans[0];

  const handleQuickStart = () => {
    if (isTimerRunning) {
      stopTimer();
      return;
    }
    // 优先找有技能关联的未完成任务，这样计时时能获得技能经验
    const planToUse = activePlan || firstPlan;
    if (!planToUse) return;
    const incompleteTaskWithSkill = planToUse.tasks.find(
      (t) => !t.completed && t.relatedSkillId
    );
    const incompleteTask = planToUse.tasks.find((t) => !t.completed);
    const taskId = incompleteTaskWithSkill?.id || incompleteTask?.id;
    startTimer(planToUse.id, taskId);
  };

  const currentTimerPlan = plans.find((p) => p.id === currentTimerPlanId);
  const currentTimerTask = currentTimerPlan?.tasks.find((t) => t.id === currentTimerTaskId);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">仪表盘</h2>
          <p className="page-desc">欢迎回来，继续你的学习之旅吧！</p>
        </div>
        {plans.length > 0 && (
          <button className="quick-start-btn" onClick={handleQuickStart}>
            {isTimerRunning ? (
              <>
                <Pause size={18} />
                停止计时
                {currentTimerTask && (
                  <span className="timer-task-name"> · {currentTimerTask.title}</span>
                )}
              </>
            ) : (
              <>
                <Play size={18} />
                开始学习
              </>
            )}
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{formatDuration(stats.totalStudyTime)}</span>
            <span className="stat-label">总学习时长</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {stats.completedTasks}/{stats.totalTasks}
            </span>
            <span className="stat-label">完成任务</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {activePlans}/{totalPlans}
            </span>
            <span className="stat-label">进行中计划</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.currentStreak}天</span>
            <span className="stat-label">连续学习</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf6' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalSkillsWithExp}</span>
            <span className="stat-label">在学技能</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec4899' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayTasks}</span>
            <span className="stat-label">今日待办</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <TrendingUp size={20} />
                最近7天学习时长
              </h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailyStudyTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} 小时`, '学习时长']}
                  />
                  <Bar dataKey="hours" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {activePlan && (
            <div className="active-plan-card">
              <div className="active-plan-header">
                <h3>
                  <Zap size={20} style={{ color: '#f59e0b' }} />
                  当前学习计划
                </h3>
              </div>
              <div className="active-plan-body">
                <h4>{activePlan.title}</h4>
                <p className="plan-desc">{activePlan.description || '暂无描述'}</p>
                <div className="plan-progress">
                  <div className="progress-bar large">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${activePlan.tasks.length > 0
                          ? (activePlan.tasks.filter(t => t.completed).length / activePlan.tasks.length) * 100
                          : 0}%`,
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {activePlan.tasks.filter(t => t.completed).length}/{activePlan.tasks.length} 任务完成
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-side">
          <div className="chart-card">
            <div className="chart-header">
              <h3>
                <BookOpen size={20} />
                技能排行榜
              </h3>
            </div>
            <div className="skill-rank-list">
              {topSkills.map((skill, index) => (
                <div key={skill.id} className="skill-rank-item">
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <div
                    className="skill-color"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">Lv.{skill.level}</span>
                </div>
              ))}
              {topSkills.length === 0 && (
                <p className="empty-tip">还没有技能经验，开始学习吧！</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
