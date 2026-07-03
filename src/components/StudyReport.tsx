import React, { useMemo } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FileText, TrendingUp, Calendar, Award, Clock, Target } from 'lucide-react';

export const StudyReport: React.FC = () => {
  const { plans, skills, sessions, stats } = useStore();

  const report = useMemo(() => {
    // 最近30天学习时长
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyTime = last30Days.map((date) => {
      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        return sessionDate === date;
      });
      const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
      return {
        date: date.slice(5),
        minutes: Math.round(totalTime / 60),
      };
    });

    // 技能雷达图数据
    const categories = [...new Set(skills.map((s) => s.category))];
    const radarData = categories.map((cat) => {
      const catSkills = skills.filter((s) => s.category === cat);
      const avgLevel = catSkills.reduce((sum, s) => sum + s.level, 0) / (catSkills.length || 1);
      return {
        category: cat,
        level: Math.round(avgLevel * 10) / 10,
        fullMark: 10,
      };
    });

    // 计划完成情况
    const totalTasks = plans.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = plans.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 活跃技能数
    const activeSkills = skills.filter((s) => s.totalExp > 0).length;

    // 本周学习天数
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    const studyDays = last7Days.filter((date) => {
      return sessions.some((s) => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        return sessionDate === date;
      });
    }).length;

    return {
      dailyTime,
      radarData,
      completionRate,
      totalTasks,
      completedTasks,
      activeSkills,
      studyDays,
      totalPlans: plans.length,
      totalHours: Math.round((stats.totalStudyTime / 3600) * 10) / 10,
    };
  }, [plans, skills, sessions, stats]);

  return (
    <div className="study-report">
      <div className="report-header">
        <h2><FileText size={20} /> 学习报告</h2>
        <p className="report-date">统计周期：最近30天</p>
      </div>

      <div className="report-summary">
        <div className="report-stat-card">
          <Clock size={20} />
          <div>
            <span className="report-stat-value">{report.totalHours}</span>
            <span className="report-stat-label">总学习小时</span>
          </div>
        </div>
        <div className="report-stat-card">
          <Target size={20} />
          <div>
            <span className="report-stat-value">{report.completionRate}%</span>
            <span className="report-stat-label">任务完成率</span>
          </div>
        </div>
        <div className="report-stat-card">
          <Award size={20} />
          <div>
            <span className="report-stat-value">{report.activeSkills}</span>
            <span className="report-stat-label">已学技能</span>
          </div>
        </div>
        <div className="report-stat-card">
          <Calendar size={20} />
          <div>
            <span className="report-stat-value">{report.studyDays}/7</span>
            <span className="report-stat-label">本周学习天数</span>
          </div>
        </div>
      </div>

      <div className="report-charts">
        <div className="report-chart">
          <h3><TrendingUp size={16} /> 近30天学习时长（分钟）</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={report.dailyTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="report-chart">
          <h3><Award size={16} /> 技能分布雷达图</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={report.radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar name="技能等级" dataKey="level" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudyReport;
