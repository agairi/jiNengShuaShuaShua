import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Code,
  CheckCircle,
  XCircle,
  Sparkles,
  Clock,
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  Target,
} from 'lucide-react';
import { useStore } from '../store';
import { generateResponseSmart, type ChatMessage } from '../utils/aiChatEngine';
import { SKILL_TREES, type SkillTreeNode } from '../data/skillTrees';
import { SKILLS_WITH_META } from '../data/skillsAndCareers';

interface TeachingPageProps {
  onNavigate: (page: string) => void;
}

interface TeachingMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export const TeachingPage: React.FC<TeachingPageProps> = ({ onNavigate }) => {
  const { skills, plans, stats, aiConfig } = useStore();
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);
  const [messages, setMessages] = useState<TeachingMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState<string>('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const userContext = {
    skills: skills.map(s => ({ id: s.id, name: s.name, level: s.level, totalExp: s.totalExp, category: s.category })),
    plans: plans.map(p => ({ id: p.id, title: p.title, tasks: p.tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed, dueDate: t.dueDate })) })),
    stats: { totalStudyTime: stats.totalStudyTime, completedTasks: stats.completedTasks, streakDays: stats.currentStreak },
  };

  const skillList = skills.filter((s) => s.category === '编程语言' || s.category === '前端开发' || s.category === '后端开发' || s.category === '数据库');

  const handleSelectSkill = (skillId: string) => {
    setSelectedSkill(skillId);
    setSelectedNode(null);
    setMessages([]);
    setLearningPath([]);
    setCurrentStep(0);
    setShowQuiz(false);
    const tree = SKILL_TREES[skillId.toLowerCase()] || [];
    const path: string[] = [];
    const flatten = (nodes: SkillTreeNode[], prefix: string = '') => {
      nodes.forEach((node) => {
        const name = prefix ? `${prefix} > ${node.name}` : node.name;
        path.push(name);
        if (node.children) {
          flatten(node.children, name);
        }
      });
    };
    flatten(tree);
    setLearningPath(path);
  };

  const handleSelectNode = async (node: SkillTreeNode) => {
    setSelectedNode(node);
    setMessages([]);
    setShowQuiz(false);
    setIsLoading(true);
    const skill = skills.find((s) => s.id === selectedSkill);
    const prompt = `请作为一位耐心的编程老师，用通俗易懂的语言讲解【${skill?.name || selectedSkill}】中的知识点：${node.name}。

讲解要求：
1. 先给出这个知识点的核心概念和作用
2. 用简单的例子说明（如果是代码，请给出完整可运行的示例）
3. 解释关键点和容易出错的地方
4. 最后提一个问题来检验学生的理解

请用中文回答，不要太学术化，像面对面讲解一样。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setMessages([
      { role: 'system', content: `正在学习：${node.name}`, timestamp: Date.now() },
      { role: 'assistant', content: res.content, timestamp: res.timestamp },
    ]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg: TeachingMessage = { role: 'user', content: inputValue.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    const skill = skills.find((s) => s.id === selectedSkill);
    const prompt = `你是一位专业的${skill?.name || ''}编程老师，正在讲解知识点"${selectedNode?.name || '通用'}".

学生的问题：${inputValue}

请用清晰易懂的方式回答，必要时可以给出代码示例。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setMessages((prev) => [...prev, { role: 'assistant', content: res.content, timestamp: res.timestamp }]);
    setIsLoading(false);
  };

  const handleStartLearning = async () => {
    if (learningPath.length === 0) return;
    setCurrentStep(0);
    setMessages([]);
    setShowQuiz(false);
    const skill = skills.find((s) => s.id === selectedSkill);
    const firstTopic = learningPath[0];
    setIsLoading(true);
    const prompt = `请作为一位耐心的编程老师，用通俗易懂的语言讲解【${skill?.name || selectedSkill}】中的知识点：${firstTopic}。

讲解要求：
1. 先给出这个知识点的核心概念和作用
2. 用简单的例子说明（如果是代码，请给出完整可运行的示例）
3. 解释关键点和容易出错的地方
4. 保持内容简洁，适合初学者理解

请用中文回答。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setMessages([
      { role: 'system', content: `学习进度：${firstTopic}（第 ${currentStep + 1}/${learningPath.length} 步）`, timestamp: Date.now() },
      { role: 'assistant', content: res.content, timestamp: res.timestamp },
    ]);
    setIsLoading(false);
  };

  const handleNextStep = async () => {
    if (currentStep >= learningPath.length - 1) return;
    setCurrentStep((prev) => prev + 1);
    setMessages([]);
    setShowQuiz(false);
    const skill = skills.find((s) => s.id === selectedSkill);
    const topic = learningPath[currentStep + 1];
    setIsLoading(true);
    const prompt = `请作为一位耐心的编程老师，用通俗易懂的语言讲解【${skill?.name || selectedSkill}】中的知识点：${topic}。

讲解要求：
1. 先给出这个知识点的核心概念和作用
2. 用简单的例子说明（如果是代码，请给出完整可运行的示例）
3. 解释关键点和容易出错的地方
4. 保持内容简洁，适合初学者理解

请用中文回答。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setMessages([
      { role: 'system', content: `学习进度：${topic}（第 ${currentStep + 2}/${learningPath.length} 步）`, timestamp: Date.now() },
      { role: 'assistant', content: res.content, timestamp: res.timestamp },
    ]);
    setIsLoading(false);
  };

  const handlePrevStep = async () => {
    if (currentStep <= 0) return;
    setCurrentStep((prev) => prev - 1);
    setMessages([]);
    setShowQuiz(false);
    const skill = skills.find((s) => s.id === selectedSkill);
    const topic = learningPath[currentStep - 1];
    setIsLoading(true);
    const prompt = `请作为一位耐心的编程老师，用通俗易懂的语言讲解【${skill?.name || selectedSkill}】中的知识点：${topic}。

讲解要求：
1. 先给出这个知识点的核心概念和作用
2. 用简单的例子说明（如果是代码，请给出完整可运行的示例）
3. 解释关键点和容易出错的地方
4. 保持内容简洁，适合初学者理解

请用中文回答。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setMessages([
      { role: 'system', content: `学习进度：${topic}（第 ${currentStep}/${learningPath.length} 步）`, timestamp: Date.now() },
      { role: 'assistant', content: res.content, timestamp: res.timestamp },
    ]);
    setIsLoading(false);
  };

  const handleStartQuiz = async () => {
    setShowQuiz(true);
    setQuizAnswer('');
    setQuizResult(null);
    setQuizLoading(true);
    const skill = skills.find((s) => s.id === selectedSkill);
    const topic = selectedNode?.name || learningPath[currentStep];
    const prompt = `请为【${skill?.name || selectedSkill}】的知识点"${topic}"出一道练习题来检验学习效果。

要求：
1. 题目要考察对这个知识点的理解
2. 可以是选择题、填空题或简单的编程题
3. 给出参考答案和解析

请先只输出题目，不要给答案。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    setQuizQuestion(res.content);
    setQuizLoading(false);
  };

  const handleSubmitQuiz = async () => {
    if (!quizAnswer.trim()) return;
    setQuizLoading(true);
    const skill = skills.find((s) => s.id === selectedSkill);
    const topic = selectedNode?.name || learningPath[currentStep];
    const prompt = `我是一位${skill?.name || ''}老师，正在批改学生的作业。

知识点：${topic}
题目：${quizQuestion}
学生答案：${quizAnswer}

请分析学生的答案：
1. 判断答案是否正确
2. 如果不正确，指出错误原因
3. 给出正确答案和详细解析
4. 根据答题情况给出下一步学习建议

请用中文回答，格式清晰。`;
    const res = await generateResponseSmart(prompt, userContext, aiConfig);
    const correct = res.content.includes('正确') || res.content.includes('对') || res.content.includes('正确答案');
    setQuizResult({ correct, feedback: res.content });
    setQuizLoading(false);
  };

  const renderSkillTree = (nodes: SkillTreeNode[], depth: number = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <button
          className={`skill-node ${selectedNode?.id === node.id ? 'active' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleSelectNode(node)}
        >
          {node.children ? (
            <ChevronRight size={14} className="mr-2" />
          ) : (
            <BookOpen size={14} className="mr-2" />
          )}
          {node.name}
        </button>
        {node.children && renderSkillTree(node.children, depth + 1)}
      </div>
    ));
  };

  const tree = SKILL_TREES[selectedSkill.toLowerCase()] || [];

  return (
    <div className="teaching-page">
      <div className="teaching-header">
        <h1 className="page-title">
          <Sparkles className="inline-block mr-2 text-amber-500" />
          AI 教学
        </h1>
        <p className="page-subtitle">让 AI 当你的私人老师，一步步带你学会编程</p>
      </div>

      <div className="teaching-content">
        <div className="teaching-sidebar">
          <h3 className="sidebar-title">选择技能</h3>
          <div className="skill-list">
            {skillList.map((skill) => (
              <button
                key={skill.id}
                className={`skill-item ${selectedSkill === skill.id ? 'active' : ''}`}
                onClick={() => handleSelectSkill(skill.id)}
              >
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">Lv.{skill.level}</span>
              </button>
            ))}
          </div>

          {selectedSkill && (
            <>
              <h3 className="sidebar-title mt-4">学习路径</h3>
              <div className="path-progress">
                {learningPath.length > 0 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentStep + 1) / learningPath.length) * 100}%` }} />
                  </div>
                )}
                <div className="progress-text">
                  {learningPath.length > 0 ? `${currentStep + 1} / ${learningPath.length}` : '请选择技能'}
                </div>
              </div>

              {tree.length > 0 && (
                <div className="skill-tree">
                  <h3 className="sidebar-title mt-4">知识点</h3>
                  {renderSkillTree(tree)}
                </div>
              )}

              {learningPath.length > 0 && (
                <div className="learning-controls mt-4">
                  <button
                    className="nav-btn"
                    onClick={handleStartLearning}
                    disabled={isLoading}
                  >
                    <PlayCircle size={18} className="mr-2" />
                    开始学习
                  </button>
                  <div className="step-nav">
                    <button
                      className="step-btn"
                      onClick={handlePrevStep}
                      disabled={currentStep <= 0 || isLoading}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span className="step-info">
                      {learningPath.length > 0 ? learningPath[currentStep] : ''}
                    </span>
                    <button
                      className="step-btn"
                      onClick={handleNextStep}
                      disabled={currentStep >= learningPath.length - 1 || isLoading}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="teaching-main">
          {!selectedSkill ? (
            <div className="empty-state">
              <BookOpen size={64} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold">选择一个技能开始学习</h3>
              <p className="text-gray-500 mt-2">从左侧列表中选择你想学的技能，AI 老师会带你一步步学习</p>
            </div>
          ) : showQuiz ? (
            <div className="quiz-section">
              <div className="quiz-header">
                <h3 className="quiz-title">
                  <Target className="inline-block mr-2 text-blue-500" />
                  练习题
                </h3>
                <button
                  className="close-quiz-btn"
                  onClick={() => setShowQuiz(false)}
                >
                  关闭
                </button>
              </div>

              {quizLoading ? (
                <div className="loading-state">
                  <Clock className="animate-spin text-blue-500" size={32} />
                  <p>正在生成题目...</p>
                </div>
              ) : (
                <div className="quiz-content">
                  <div className="question-card">
                    <p className="question-text">{quizQuestion}</p>
                  </div>

                  <div className="answer-area">
                    <textarea
                      className="answer-input"
                      placeholder="输入你的答案..."
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                    />
                    <button
                      className="submit-btn"
                      onClick={handleSubmitQuiz}
                      disabled={!quizAnswer.trim() || quizLoading}
                    >
                      <Send size={16} className="mr-2" />
                      提交答案
                    </button>
                  </div>

                  {quizResult && (
                    <div className={`result-card ${quizResult.correct ? 'correct' : 'wrong'}`}>
                      <div className="result-icon">
                        {quizResult.correct ? (
                          <CheckCircle size={24} className="text-green-500" />
                        ) : (
                          <XCircle size={24} className="text-red-500" />
                        )}
                      </div>
                      <div className="result-content">
                        <h4 className="result-title">
                          {quizResult.correct ? '回答正确！' : '回答错误'}
                        </h4>
                        <p className="result-feedback">{quizResult.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="chat-section">
              <div className="chat-header">
                <h3 className="chat-title">
                  <MessageCircle className="inline-block mr-2 text-amber-500" />
                  {selectedNode?.name || (learningPath[currentStep] || '学习对话')}
                </h3>
                <button
                  className="start-quiz-btn"
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                >
                  <Target className="inline-block mr-2" />
                  做练习
                </button>
              </div>

              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    {msg.role === 'system' && (
                      <div className="system-message">
                        <Lightbulb size={14} className="mr-2" />
                        {msg.content}
                      </div>
                    )}
                    {msg.role === 'assistant' && (
                      <div className="assistant-message">
                        <div className="avatar">🤖</div>
                        <div className="message-content">
                          <p className="message-text">{msg.content}</p>
                        </div>
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="user-message">
                        <div className="avatar">👤</div>
                        <div className="message-content">
                          <p className="message-text">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="loading-message">
                    <div className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <textarea
                  className="input-area"
                  placeholder="输入你的问题，向 AI 老师提问..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
