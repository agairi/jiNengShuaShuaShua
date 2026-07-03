import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Plus, Clock, Trash2, Check } from 'lucide-react';
import { SKILL_LEVELS } from '../utils/skillLevels';
import Modal from './Modal';

// 本地类型定义
type Skill = {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  level: number;
  exp: number;
  totalExp: number;
};

interface PlanEditorProps {
  planId?: string;
  onClose: () => void;
}

export const PlanEditor: React.FC<PlanEditorProps> = ({ planId, onClose }) => {
  const { plans, skills, addPlan, updatePlan, addTask, updateTask, deleteTask, toggleTask, startTimer, stopTimer, isTimerRunning, currentTimerPlanId, currentTimerTaskId } = useStore();
  
  const existingPlan = planId ? plans.find((p) => p.id === planId) : null;
  
  const [title, setTitle] = useState(existingPlan?.title || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskExp, setNewTaskExp] = useState(50);
  const [newTaskSkill, setNewTaskSkill] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(
    existingPlan?.priority || 'medium'
  );
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const handleSavePlan = () => {
    if (!title.trim()) return;
    
    if (existingPlan) {
      updatePlan(existingPlan.id, { title, description, priority });
    } else {
      addPlan({ title, description, tasks: [], priority });
    }
    onClose();
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !existingPlan) return;
    
    addTask(existingPlan.id, {
      title: newTaskTitle,
      description: newTaskDesc,
      completed: false,
      expReward: newTaskExp,
      relatedSkillId: newTaskSkill || undefined,
      dueDate: newTaskDueDate || undefined,
    });
    
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskExp(50);
    setNewTaskSkill('');
    setNewTaskDueDate('');
    setShowTaskForm(false);
  };

  const handleStartTimer = (taskId: string) => {
    if (isTimerRunning) {
      stopTimer();
    }
    startTimer(existingPlan!.id, taskId);
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (!existingPlan && planId) {
    return (
      <Modal isOpen onClose={onClose} title="提示" size="sm">
        <p>计划不存在</p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={existingPlan ? '编辑计划' : '新建计划'}
      size="lg"
      className="plan-editor-modal"
    >
      <div className="plan-editor-body">
          <div className="form-group">
            <label>计划标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：学习 React 基础"
            />
          </div>

          <div className="form-group">
            <label>计划描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述你的学习目标..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>优先级</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>

          {!existingPlan ? (
            <button className="btn-primary" onClick={handleSavePlan}>
              创建计划
            </button>
          ) : (
            <>
              <div className="tasks-section">
                <div className="section-header">
                  <h3>任务列表</h3>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowTaskForm(!showTaskForm)}
                  >
                    <Plus size={16} />
                    添加任务
                  </button>
                </div>

                {showTaskForm && (
                  <div className="task-form">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="任务标题"
                    />
                    <textarea
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="任务描述（可选）"
                      rows={2}
                    />
                    <div className="task-form-row">
                      <div className="form-group">
                        <label>经验值奖励</label>
                        <input
                          type="number"
                          value={newTaskExp}
                          onChange={(e) => setNewTaskExp(Number(e.target.value))}
                          min={10}
                          max={500}
                        />
                      </div>
                      <div className="form-group">
                        <label>关联技能</label>
                        <select
                          value={newTaskSkill}
                          onChange={(e) => setNewTaskSkill(e.target.value)}
                        >
                          <option value="">不关联</option>
                          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                            <optgroup key={category} label={category}>
                              {categorySkills.map((skill) => (
                                <option key={skill.id} value={skill.id}>
                                  {skill.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>截止日期</label>
                        <input
                          type="date"
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="task-form-actions">
                      <button className="btn-secondary" onClick={() => setShowTaskForm(false)}>
                        取消
                      </button>
                      <button className="btn-primary" onClick={handleAddTask}>
                        添加
                      </button>
                    </div>
                  </div>
                )}

                <div className="task-list">
                  {existingPlan.tasks.map((task) => {
                    const relatedSkill = task.relatedSkillId
                      ? skills.find((s) => s.id === task.relatedSkillId)
                      : null;
                    
                    const isTimerActive = isTimerRunning && currentTimerTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                      >
                        <div className="task-content">
                          <button
                            className={`checkbox ${task.completed ? 'checked' : ''}`}
                            onClick={() => toggleTask(existingPlan.id, task.id)}
                          >
                            {task.completed && <Check size={14} />}
                          </button>
                          <div className="task-info">
                            <h4>{task.title}</h4>
                            {task.description && <p>{task.description}</p>}
                            {task.notes && (
                              <div className="task-notes">
                                <span className="notes-label">笔记:</span> {task.notes}
                              </div>
                            )}
                            <div className="task-meta">
                              <span className="exp">+{task.expReward} EXP</span>
                              {relatedSkill && (
                                <span
                                  className="skill-tag"
                                  style={{ backgroundColor: relatedSkill.color }}
                                >
                                  {relatedSkill.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button
                            className="note-btn"
                            onClick={() => {
                              if (editingNoteTaskId === task.id) {
                                updateTask(existingPlan.id, task.id, { notes: noteDraft });
                                setEditingNoteTaskId(null);
                              } else {
                                setEditingNoteTaskId(task.id);
                                setNoteDraft(task.notes || '');
                              }
                            }}
                            title="笔记"
                          >
                            {editingNoteTaskId === task.id ? <Check size={16} /> : '笔记'}
                          </button>
                          <button
                            className={`timer-btn ${isTimerActive ? 'active' : ''}`}
                            onClick={() => handleStartTimer(task.id)}
                            disabled={task.completed}
                          >
                            <Clock size={16} />
                            {isTimerActive ? '停止' : '计时'}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteTask(existingPlan.id, task.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {editingNoteTaskId === task.id && (
                          <div className="task-note-editor">
                            <textarea
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="记录学习笔记..."
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {existingPlan.tasks.length === 0 && (
                    <p className="empty-tip">还没有任务，点击上方添加</p>
                  )}
                </div>
              </div>

              <button className="btn-primary save-btn" onClick={handleSavePlan}>
                保存计划
              </button>
            </>
          )}
        </div>
    </Modal>
  );
};