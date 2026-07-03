import React, { useState } from 'react';
import { useStore } from '../store';
import { Briefcase, ChevronDown, ChevronUp, BookOpen, Target } from 'lucide-react';
import { DEFAULT_CAREERS } from '../data/skillsAndCareers';
import { getLevelInfo, SKILL_LEVELS } from '../utils/skillLevels';

interface CareerPageProps {
  onNavigate?: (page: string) => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({ onNavigate }) => {
  const { skills } = useStore();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);

  // Calculate match percentage for each career
  const careerMatches = DEFAULT_CAREERS.map((career) => {
    let totalRequired = 0;
    let totalMatched = 0;

    career.skills.forEach((req) => {
      const skill = skills.find((s) => s.id === req.skillId);
      if (skill) {
        totalRequired += req.requiredLevel;
        totalMatched += Math.min(skill.level, req.requiredLevel);
      }
    });

    const matchPercent = totalRequired > 0 ? Math.round((totalMatched / totalRequired) * 100) : 0;
    const missingSkills = career.skills.filter((req) => {
      const skill = skills.find((s) => s.id === req.skillId);
      return !skill || skill.level < req.requiredLevel;
    });

    return {
      ...career,
      matchPercent,
      missingSkills,
    };
  });

  return (
    <div className="career-page">
      <h2 className="page-title">职业路径</h2>

      <p className="page-desc">选择你感兴趣的职业方向，查看需要的技能和差距</p>

      <div className="career-grid">
        {careerMatches.map((career) => {
          const isExpanded = expandedCareer === career.id;

          return (
            <div
              key={career.id}
              className={`career-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setExpandedCareer(isExpanded ? null : career.id)}
            >
              <div className="career-header">
                <div className="career-info">
                  <h3>{career.name}</h3>
                  <p className="career-desc">{career.description}</p>
                  <span className="salary">平均薪资: {career.avgSalary}</span>
                </div>
                <div className="match-badge">
                  <div className="match-circle">
                    <span className="match-percent">{career.matchPercent}%</span>
                  </div>
                  <span className="match-label">匹配度</span>
                </div>
                <button className="expand-btn">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div className="career-details">
                  <h4>技能要求</h4>
                  <div className="skill-requirements">
                    {career.skills.map((req) => {
                      const skill = skills.find((s) => s.id === req.skillId);
                      const currentLevel = skill?.level || 0;
                      const requiredInfo = getLevelInfo(req.requiredLevel);
                      const currentInfo = getLevelInfo(currentLevel);
                      const isMet = currentLevel >= req.requiredLevel;

                      return (
                        <div key={req.skillId} className={`skill-req ${isMet ? 'met' : ''}`}>
                          <div className="skill-req-header">
                            <div className="skill-dot" style={{ backgroundColor: skill?.color || '#666' }} />
                            <span className="skill-name">{skill?.name || '未知技能'}</span>
                            <span className={`importance ${req.importance}`}>
                              {req.importance === 'core' ? '核心' : req.importance === 'important' ? '重要' : '可选'}
                            </span>
                          </div>
                          <div className="skill-req-levels">
                            <div className="level-compare">
                              <span className="current" style={{ color: currentInfo.color }}>
                                当前: Lv.{currentLevel} {currentInfo.name}
                              </span>
                              <span className="required" style={{ color: requiredInfo.color }}>
                                要求: Lv.{req.requiredLevel} {requiredInfo.name}
                              </span>
                            </div>
                            {!isMet && (
                              <div className="gap-info">
                                <span>差距: {req.requiredLevel - currentLevel} 级</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h4>推荐学习路径</h4>
                  <div className="learning-path">
                    {career.learningPath.map((skillId, idx) => {
                      const skill = skills.find((s) => s.id === skillId);
                      const req = career.skills.find((r) => r.skillId === skillId);
                      const isMet = skill && skill.level >= (req?.requiredLevel || 0);

                      return (
                        <div key={skillId} className={`path-step ${isMet ? 'done' : ''}`}>
                          <span className="step-num">{idx + 1}</span>
                          <div className="step-dot" style={{ backgroundColor: skill?.color || '#666' }} />
                          <span className="step-name">{skill?.name || '未知'}</span>
                          {isMet && <span className="done-mark">✓</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="career-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => onNavigate?.('skills')}
                    >
                      <BookOpen size={14} />
                      查看技能面板
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => onNavigate?.('projectGoals')}
                    >
                      <Target size={14} />
                      查看项目目标
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};