import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Target, Star, BookOpen, Code, Wrench, Hand, Zap, CheckCircle2, CheckSquare, FolderKanban, TrendingUp, ChevronDown, ChevronUp, Layers, ExternalLink } from 'lucide-react';
import { getLevelInfo, getExpToNextLevel, isStuckAtBreakthrough, SKILL_LEVELS, BREAKTHROUGH_REQUIREMENTS } from '../utils/skillLevels';
import { PROJECT_GOALS } from '../data/projectGoals';
import { CAREER_PROJECTS } from '../data/careerProjects';
import { getSkillTree } from '../data/skillTrees';
import { SkillTreeView } from './SkillTreeView';

const SKILL_TYPE_INFO: Record<string, { label: string; icon: any; color: string }> = {
  theory: { label: '理论', icon: BookOpen, color: '#3b82f6' },
  coding: { label: '编程', icon: Code, color: '#22c55e' },
  tool: { label: '工具', icon: Wrench, color: '#f59e0b' },
  practical: { label: '实操', icon: Hand, color: '#a855f7' },
};

const ALL_PROJECTS = [...PROJECT_GOALS, ...CAREER_PROJECTS];

interface SkillDashboardProps {
  onNavigate?: (page: string) => void;
}

export const SkillDashboard: React.FC<SkillDashboardProps> = ({ onNavigate }) => {
  const { skills, plans, completedProjects, breakthroughSkill, masteredSkillNodes, toggleSkillNodeMastered } = useStore();
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'exp' | 'difficulty'>('level');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('编程语言');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  const types = ['全部', '理论', '编程', '工具', '实操'];
  const typeKeyMap: Record<string, string> = { '理论': 'theory', '编程': 'coding', '工具': 'tool', '实操': 'practical' };

  const taskStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number }> = {};
    for (const plan of plans) {
      for (const task of plan.tasks) {
        if (!task.relatedSkillId) continue;
        if (!stats[task.relatedSkillId]) {
          stats[task.relatedSkillId] = { completed: 0, total: 0 };
        }
        stats[task.relatedSkillId].total++;
        if (task.completed) stats[task.relatedSkillId].completed++;
      }
    }
    return stats;
  }, [plans]);

  function getCompletedProjectCount(skillId: string, minDifficulty: number): number {
    const relevantProjects = ALL_PROJECTS.filter(
      (p) => p.skillId === skillId && p.difficulty >= minDifficulty
    );
    return relevantProjects.filter((p) => !!completedProjects[p.id]).length;
  }

  const filteredSkills = skills
    .filter((s) => selectedType === '全部' || s.skillType === typeKeyMap[selectedType]);

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredSkills> = {};
    for (const skill of filteredSkills) {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    }
    for (const cat of Object.keys(grouped)) {
      grouped[cat].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'level') return b.level - a.level;
        if (sortBy === 'exp') return b.totalExp - a.totalExp;
        if (sortBy === 'difficulty') return (b.difficulty || 3) - (a.difficulty || 3);
        return 0;
      });
    }
    return grouped;
  }, [filteredSkills, sortBy]);

  const categories = Object.keys(skillsByCategory);

  const getCategoryStats = (category: string) => {
    const catSkills = skillsByCategory[category] || [];
    const totalExp = catSkills.reduce((sum, s) => sum + s.totalExp, 0);
    const avgLevel = catSkills.length > 0
      ? (catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length).toFixed(1)
      : '0';
    return { count: catSkills.length, totalExp, avgLevel };
  };

  const renderStars = (difficulty: number) => {
    return (
      <span className="difficulty-stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            fill={i <= difficulty ? '#f59e0b' : 'none'}
            color={i <= difficulty ? '#f59e0b' : '#475569'}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="skill-dashboard">
      <h2 className="page-title">
        <Target size={24} />
        技能面板
      </h2>

      <p className="page-desc">按分类浏览技能，点击展开查看详情</p>

      <div className="skill-filters">
        <div className="filter-group">
          <label>类型</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>排序</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="level">等级</option>
            <option value="exp">经验值</option>
            <option value="difficulty">难度</option>
            <option value="name">名称</option>
          </select>
        </div>
        <div className="skill-summary">
          <span>共 {filteredSkills.length} 个技能 · {categories.length} 个分类</span>
        </div>
      </div>

      <div className="category-list">
        {categories.map((category) => {
          const isCategoryExpanded = expandedCategory === category;
          const stats = getCategoryStats(category);
          const catSkills = skillsByCategory[category];

          return (
            <div key={category} className={`category-section ${isCategoryExpanded ? 'expanded' : ''}`}>
              <div
                className="category-header"
                onClick={() => setExpandedCategory(isCategoryExpanded ? null : category)}
              >
                <div className="category-icon">
                  <Layers size={20} />
                </div>
                <div className="category-info">
                  <h3>{category}</h3>
                  <span className="category-meta">
                    {stats.count} 个技能 · 平均 Lv.{stats.avgLevel} · {stats.totalExp} EXP
                  </span>
                </div>
                <div className="category-expand">
                  {isCategoryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isCategoryExpanded && (
                <div className="category-skills">
                  <div className="skill-grid compact">
                    {catSkills.map((skill) => {
                      const levelInfo = getLevelInfo(skill.level);
                      const expInfo = getExpToNextLevel(skill.totalExp, skill.breakthroughs || []);
                      const typeInfo = skill.skillType ? SKILL_TYPE_INFO[skill.skillType] : null;
                      const TypeIcon = typeInfo?.icon || BookOpen;
                      const stuck = isStuckAtBreakthrough(skill.totalExp, skill.breakthroughs || []);
                      const isSkillExpanded = expandedSkillId === skill.id;
                      const skillTree = getSkillTree(skill.id, skill.name, skill.skillType);
                      const hasTree = !!skillTree;

                      return (
                        <div
                          key={skill.id}
                          className={`skill-card compact ${isSkillExpanded ? 'expanded' : ''}`}
                        >
                          <div
                            className="skill-header clickable"
                            onClick={() => setExpandedSkillId(isSkillExpanded ? null : skill.id)}
                          >
                            <div className="skill-icon" style={{ backgroundColor: skill.color }}>
                              {skill.name.slice(0, 2)}
                            </div>
                            <div className="skill-basic">
                              <div className="skill-name-row">
                                <h4>{skill.name}</h4>
                                {typeInfo && (
                                  <span
                                    className="skill-type-tag small"
                                    style={{ backgroundColor: typeInfo.color }}
                                  >
                                    {typeInfo.label}
                                  </span>
                                )}
                              </div>
                              <div className="skill-level-row">
                                <span className="level-text" style={{ color: levelInfo.color }}>
                                  Lv.{skill.level} {levelInfo.name}
                                </span>
                                {stuck.stuck && (
                                  <span className="stuck-badge">
                                    <Zap size={10} />
                                    瓶颈
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="skill-progress-col">
                              <div className="exp-bar small">
                                <div className="exp-fill" style={{ width: `${expInfo.progress}%` }} />
                              </div>
                              <span className="exp-text small">
                                {stuck.stuck ? '待突破' : `${expInfo.current}/${expInfo.required}`}
                              </span>
                            </div>
                            <span className="skill-expand-icon">
                              {isSkillExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </div>

                          {isSkillExpanded && (
                            <div className="skill-details">
                              <p className="skill-description">{skill.description}</p>

                              <div className="detail-row">
                                <span className="detail-label">难度</span>
                                {skill.difficulty && renderStars(skill.difficulty)}
                              </div>

                              {skill.expMethods && skill.expMethods.length > 0 && (
                                <div className="skill-section">
                                  <span className="section-label">经验获取方式</span>
                                  <div className="tag-list">
                                    {skill.expMethods.map((method, idx) => (
                                      <span key={idx} className="exp-method-tag">{method}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {skill.verification && skill.verification.length > 0 && (
                                <div className="skill-section">
                                  <span className="section-label">检验方式</span>
                                  <div className="tag-list">
                                    {skill.verification.map((v, idx) => (
                                      <span key={idx} className="verify-tag">{v}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {stuck.stuck && stuck.level !== null && (
                                <div className="skill-section">
                                  <span className="section-label" style={{ color: '#f59e0b' }}>
                                    <Zap size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                    突破条件（满足任一即可）
                                  </span>
                                  <div className="breakthrough-req-list">
                                    {(() => {
                                      const req = BREAKTHROUGH_REQUIREMENTS[stuck.level!];
                                      if (!req) return null;
                                      const taskDone = (taskStats[skill.id]?.completed || 0) >= req.tasks;
                                      const projectDone = getCompletedProjectCount(skill.id, req.minProjectDifficulty) >= req.projects;
                                      const canBreakthrough = taskDone || projectDone;
                                      return (
                                        <>
                                          <div className={`breakthrough-req-item ${taskDone ? 'done' : ''}`}>
                                            <span className="req-icon">
                                              {taskDone ? <CheckCircle2 size={12} color="#22c55e" /> : <CheckSquare size={12} color="#64748b" />}
                                            </span>
                                            <span>
                                              完成 {taskStats[skill.id]?.completed || 0}/{req.tasks} 个该技能任务
                                            </span>
                                          </div>
                                          <div className={`breakthrough-req-item ${projectDone ? 'done' : ''}`}>
                                            <span className="req-icon">
                                              {projectDone ? <CheckCircle2 size={12} color="#22c55e" /> : <FolderKanban size={12} color="#64748b" />}
                                            </span>
                                            <span>
                                              完成 {getCompletedProjectCount(skill.id, req.minProjectDifficulty)}/{req.projects} 个≥{req.minProjectDifficulty}星项目
                                            </span>
                                          </div>
                                          {canBreakthrough && (
                                            <button
                                              className="btn-primary breakthrough-btn"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                breakthroughSkill(skill.id, stuck.level!);
                                              }}
                                            >
                                              <TrendingUp size={14} />
                                              立即突破至 Lv.{stuck.level! + 1}
                                            </button>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}

                              {skill.breakthroughs && skill.breakthroughs.length > 0 && (
                                <div className="skill-section">
                                  <span className="section-label" style={{ color: '#22c55e' }}>
                                    <CheckCircle2 size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                    已突破等级
                                  </span>
                                  <div className="tag-list">
                                    {skill.breakthroughs.map((b) => (
                                      <span key={b} className="breakthrough-done-tag">Lv.{b}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {hasTree && skillTree && (
                                <div className="skill-section">
                                  <span className="section-label">技能树</span>
                                  <div className="skill-tree-container">
                                    <SkillTreeView
                                      tree={skillTree}
                                      masteredNodes={new Set(masteredSkillNodes[skill.id] || [])}
                                      onToggleMaster={(nodeId) => toggleSkillNodeMastered(skill.id, nodeId)}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="skill-stats-row">
                                <span>总经验: {skill.totalExp} EXP</span>
                                {(() => {
                                  const relatedProjects = ALL_PROJECTS.filter((p) => p.skillId === skill.id);
                                  if (relatedProjects.length === 0) return null;
                                  return (
                                    <button
                                      className="btn-link"
                                      onClick={() => onNavigate?.('projectGoals')}
                                    >
                                      <ExternalLink size={12} />
                                      查看相关项目 ({relatedProjects.length})
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <Target size={48} />
          <p>没有找到技能</p>
        </div>
      )}
    </div>
  );
};
