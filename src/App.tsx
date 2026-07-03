import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import './api-styles.css';
import { Sidebar } from './components/Sidebar';
import { FloatingTimer } from './components/FloatingTimer';

// 按需加载页面组件，减小首屏包体积
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const PlansPage = lazy(() => import('./components/PlansPage').then(m => ({ default: m.PlansPage })));
const PlanEditor = lazy(() => import('./components/PlanEditor').then(m => ({ default: m.PlanEditor })));
const CalendarView = lazy(() => import('./components/CalendarView').then(m => ({ default: m.CalendarView })));
const SkillDashboard = lazy(() => import('./components/SkillDashboard').then(m => ({ default: m.SkillDashboard })));
const CareerPage = lazy(() => import('./components/CareerPage').then(m => ({ default: m.CareerPage })));
const AIRecommend = lazy(() => import('./components/AIRecommend').then(m => ({ default: m.AIRecommend })));
const ProjectGoals = lazy(() => import('./components/ProjectGoals').then(m => ({ default: m.ProjectGoals })));
const StudyReport = lazy(() => import('./components/StudyReport').then(m => ({ default: m.StudyReport })));

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [editPlanId, setEditPlanId] = useState<string | undefined>(undefined);

  const handleNewPlan = () => {
    setEditPlanId(undefined);
    setShowPlanEditor(true);
  };

  const handleEditPlan = (planId: string) => {
    setEditPlanId(planId);
    setShowPlanEditor(true);
  };

  const handleCloseEditor = () => {
    setShowPlanEditor(false);
    setEditPlanId(undefined);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'plans':
        return <PlansPage onEditPlan={handleEditPlan} onNewPlan={handleNewPlan} />;
      case 'calendar':
        return <CalendarView />;
      case 'skills':
        return <SkillDashboard onNavigate={setCurrentPage} />;
      case 'careers':
        return <CareerPage onNavigate={setCurrentPage} />;
      case 'projectGoals':
        return <ProjectGoals />;
      case 'ai':
        return <AIRecommend onNewPlan={handleNewPlan} />;
      case 'report':
        return <StudyReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onNewPlan={handleNewPlan}
      />

      <main className="main-content">
        <Suspense fallback={<div className="page-loading">加载中...</div>}>
          {renderPage()}
        </Suspense>
      </main>

      <FloatingTimer />

      {showPlanEditor && (
        <Suspense fallback={<div className="page-loading">加载中...</div>}>
          <PlanEditor planId={editPlanId} onClose={handleCloseEditor} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
