import React, { useState } from 'react';
import { useStore } from '../store';
import {
  ListTodo,
  Edit,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  Play,
  Trophy,
} from 'lucide-react';

interface PlansPageProps {
  onEditPlan: (planId: string) => void;
  onNewPlan: () => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  high: { label: '高优先级', icon: ArrowUpCircle, color: '#ef4444' },
  medium: { label: '中优先级', icon: MinusCircle, color: '#f59e0b' },
  low: { label: '低优先级', icon: ArrowDownCircle, color: '#22c55e' },
};

export const PlansPage: React.FC<PlansPageProps> = ({ onEditPlan, onNewPlan }) => {
  const { plans, deletePlan, toggleTask, startTimer, stopTimer, isTimerRunning, currentTimerTaskId } = useStore();
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  const getPlanStatus = (plan: any) => {
    const totalTasks = plan.tasks.length;
    const completedTasks = plan.tasks.filter((t: any) => t.completed).length;
    if (totalTasks === 0) return 'empty';
    if (completedTasks === totalTasks) return 'completed';
    if (completedTasks === 0) return 'not_started';
    return 'in_progress';
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: '已完成', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    in_progress: { label: '进行中', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    not_started: { label: '未开始', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
    empty: { label: '无任务', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  };

  const statusOptions = ['全部', '进行中', '未开始', '已完成'];

  const filteredPlans = plans.filter((plan) => {
    if (filterStatus === '全部') return true;
    const status = getPlanStatus(plan);
    const statusMap: Record<string, string> = {
      '进行中': 'in_progress',
      '未开始': 'not_started',
      '已完成': 'completed',
    };
    return status === statusMap[filterStatus];
  });

  const stats = {
    total: plans.length,
    inProgress: plans.filter((p) => getPlanStatus(p) === 'in_progress').length,
    completed: plans.filter((p) => getPlanStatus(p) === 'completed').length,
    notStarted: plans.filter((p) => getPlanStatus(p) === 'not_started').length,
  };

  if (plans.length === 0) {
    return (
      <div className="plans-page">
        <h2 className="page-title">
          <ListTodo size={24} />
          学习计划
        </h2>
        <div className="empty-state">
          <ListTodo size={64} />
          <h3>还没有学习计划</h3>
          <p>制定你的第一个学习计划，开始高效学习之旅</p>
          <button className="btn-primary" onClick={onNewPlan}>
            <PlusCircle size={20} />
            新建计划
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-page">
      <h2 className="page-title">
        <ListTodo size={24} />
        学习计划
      </h2>

      {/* 统计概览 */}
      <div className="plans-stats-bar">
        <div className="plans-stat">
          <span className="plans-stat-value">{stats.total}</span>
          <span className="plans-stat-label">总计划</span>
        </div>
        <div className="plans-stat">
          <span className="plans-stat-value" style={{ color: '#3b82f6' }}>{stats.inProgress}</span>
          <span className="plans-stat-label">进行中</span>
        </div>
        <div className="plans-stat">
          <span className="plans-stat-value" style={{ color: '#f59e0b' }}>{stats.notStarted}</span>
          <span className="plans-stat-label">未开始</span>
        </div>
        <div className="plans-stat">
          <span className="plans-stat-value" style={{ color: '#22c55e' }}>{stats.completed}</span>
          <span className="plans-stat-label">已完成</span>
        </div>
      </div>

      {/* 筛选 */}
      <div className="plans-filter">
        <div className="filter-group">
          <label>状态</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="plans-count">共 {filteredPlans.length} 个计划</span>
      </div>

      {/* 计划列表 */}
      <div className="plans-list">
        {filteredPlans.map((plan) => {
          const totalTasks = plan.tasks.length;
          const completedTasks = plan.tasks.filter((t: any) => t.completed).length;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
          const status = getPlanStatus(plan);
          const statusInfo = STATUS_CONFIG[status];
          const isExpanded = expandedPlanId === plan.id;
          const priority = plan.priority || 'medium';
          const priorityInfo = PRIORITY_CONFIG[priority];
          const PriorityIcon = priorityInfo.icon;

          // 计算截止日期
          const hasDueDate = plan.tasks.some((t: any) => t.dueDate);
          const nearestDue = hasDueDate
            ? plan.tasks
                .filter((t: any) => t.dueDate && !t.completed)
                .map((t: any) => new Date(t.dueDate))
                .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0]
            : null;

          return (
            <div key={plan.id} className={`plan-item ${isExpanded ? 'expanded' : ''}`}>
              {/* 头部 - 始终显示 */}
              <div
                className="plan-item-header"
                onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
              >
                <div className="plan-item-main">
                  <div className="plan-item-title-row">
                    <h3>{plan.title}</h3>
                    <span
                      className="plan-status-tag"
                      style={{ color: statusInfo.color, background: statusInfo.bg }}
                    >
                      {statusInfo.label}
                    </span>
                    <span
                      className="plan-priority-tag"
                      style={{ color: priorityInfo.color }}
                    >
                      <PriorityIcon size={12} />
                      {priorityInfo.label}
                    </span>
                  </div>

                  <div className="plan-item-meta">
                    <span className="plan-meta-item">
                      <Calendar size={12} />
                      {new Date(plan.createdAt).toLocaleDateString('zh-CN')} 创建
                    </span>
                    {nearestDue && (
                      <span className="plan-meta-item due-soon">
                        <Clock size={12} />
                        截止 {nearestDue.toLocaleDateString('zh-CN')}
                      </span>
                    )}
                    <span className="plan-meta-item">
                      <ListTodo size={12} />
                      {completedTasks}/{totalTasks} 任务
                    </span>
                  </div>
                </div>

                <div className="plan-item-side">
                  <div className="plan-progress-ring">
                    <svg viewBox="0 0 36 36" className="progress-ring-svg">
                      <path
                        className="progress-ring-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="progress-ring-fill"
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="progress-ring-text">{Math.round(progress)}%</span>
                  </div>
                  <span className="plan-expand-icon">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </div>

              {/* 详情 - 展开显示 */}
              {isExpanded && (
                <div className="plan-item-details">
                  {plan.description && (
                    <p className="plan-detail-desc">{plan.description}</p>
                  )}

                  {/* 任务列表 */}
                  {totalTasks > 0 ? (
                    <div className="plan-tasks-section">
                      <h4 className="section-label">任务清单</h4>
                      <div className="plan-tasks-list">
                        {plan.tasks.map((task: any) => (
                          <div
                            key={task.id}
                            className={`plan-task-row ${task.completed ? 'completed' : ''}`}
                            onClick={() => toggleTask(plan.id, task.id)}
                          >
                            <span className="task-check">
                              {task.completed ? (
                                <CheckCircle2 size={18} color="#22c55e" />
                              ) : (
                                <Circle size={18} color="#64748b" />
                              )}
                            </span>
                            <span className="task-title">{task.title}</span>
                            <span className="task-exp">+{task.expReward} EXP</span>
                            {task.dueDate && (
                              <span className="task-due">
                                <Clock size={10} />
                                {new Date(task.dueDate).toLocaleDateString('zh-CN')}
                              </span>
                            )}
                            {!task.completed && (
                              <button
                                className="task-timer-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isTimerRunning && currentTimerTaskId === task.id) {
                                    stopTimer();
                                  } else {
                                    if (isTimerRunning) stopTimer();
                                    startTimer(plan.id, task.id);
                                  }
                                }}
                              >
                                <Clock size={12} />
                                {isTimerRunning && currentTimerTaskId === task.id ? '停止' : '计时'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="plan-empty-tasks">
                      <AlertCircle size={16} />
                      该计划还没有添加任务
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="plan-item-actions">
                    <button
                      className="btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlan(plan.id);
                      }}
                    >
                      <Edit size={14} />
                      编辑计划
                    </button>
                    <button
                      className="btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定要删除这个计划吗？')) {
                          deletePlan(plan.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <div className="empty-state">
          <ListTodo size={48} />
          <p>该状态下没有计划</p>
        </div>
      )}

      <button className="new-plan-float" onClick={onNewPlan}>
        <PlusCircle size={24} />
      </button>
    </div>
  );
};
