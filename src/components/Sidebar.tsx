import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Briefcase,
  Sparkles,
  PlusCircle,
  FolderKanban,
  BookOpen,
  ListTodo,
  Download,
  Upload,
  FileText,
} from 'lucide-react';
import { useStore } from '../store';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onNewPlan: () => void;
}

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { id: 'plans', label: '学习计划', icon: ListTodo },
  { id: 'calendar', label: '日历视图', icon: Calendar },
  { id: 'skills', label: '技能面板', icon: BookOpen },
  { id: 'careers', label: '职业路径', icon: Briefcase },
  { id: 'projectGoals', label: '项目目标', icon: FolderKanban },
  { id: 'ai', label: 'AI推荐', icon: Sparkles },
  { id: 'report', label: '学习报告', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  onNewPlan,
}) => {
  const { exportData, importData } = useStore();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importData(text);
        alert(ok ? '导入成功！' : '导入失败，文件格式错误');
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>📚 学习计划助手</h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <button className="new-plan-btn" onClick={onNewPlan}>
          <PlusCircle size={20} />
          <span>新建计划</span>
        </button>
        <div className="sidebar-data-actions">
          <button className="data-btn" onClick={handleExport} title="导出数据">
            <Download size={16} />
            <span>导出</span>
          </button>
          <button className="data-btn" onClick={handleImport} title="导入数据">
            <Upload size={16} />
            <span>导入</span>
          </button>
        </div>
      </div>
    </aside>
  );
};