import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Video,
  FileText,
  Link as LinkIcon,
  TrendingUp,
  Plus,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lightbulb,
  Zap,
  PlusCircle,
  Send,
  MessageCircle,
  Calendar,
  Route,
  Bot,
  ArrowRight,
  Flame,
  Award,
  PlayCircle,
  Globe,
  Cpu,
  Settings,
} from 'lucide-react';
import { useStore } from '../store';
import {
  smartSearch,
  getRecommendations,
  getPopularSkills,
  type SearchResult,
} from '../utils/smartSearch';
import {
  generateResponse,
  getQuickQuestions,
  type ChatMessage,
} from '../utils/aiChatEngine';
import {
  generateRoadmap,
  parseGoal,
  type Roadmap,
} from '../utils/roadmapEngine';
import {
  generateDailyPush,
  type DailyPush,
} from '../utils/dailyPush';
import { webSearch, SEARCH_SOURCE_INFO, type WebSearchResult, type ApiConfig } from '../utils/searchApi';
import { chatWithAi, generateWithAi, type AiProviderConfig } from '../utils/localAiService';
import ApiSettingsModal from './ApiSettingsModal';
import AiSettingsModal from './AiSettingsModal';

// 全网学习平台搜索配置
const SEARCH_PLATFORMS = [
  { name: 'B站', icon: '📺', url: (q: string) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(q)}`, color: '#fb7299', desc: '视频教程' },
  { name: '知乎', icon: '💡', url: (q: string) => `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(q)}`, color: '#0084ff', desc: '经验分享' },
  { name: 'GitHub', icon: '🐙', url: (q: string) => `https://github.com/search?q=${encodeURIComponent(q)}&type=repositories`, color: '#f05032', desc: '开源项目' },
  { name: '掘金', icon: '⛏️', url: (q: string) => `https://juejin.cn/search?query=${encodeURIComponent(q)}&type=0`, color: '#1e80ff', desc: '技术文章' },
  { name: 'CSDN', icon: '📄', url: (q: string) => `https://so.csdn.net/so/search?q=${encodeURIComponent(q)}&t=all`, color: '#fc5531', desc: '技术博客' },
  { name: 'YouTube', icon: '▶️', url: (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}+tutorial`, color: '#ff0000', desc: '英文视频' },
  { name: 'Google', icon: '🔍', url: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}+教程`, color: '#4285f4', desc: '综合搜索' },
  { name: 'Stack Overflow', icon: '📚', url: (q: string) => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`, color: '#f48024', desc: '问答社区' },
  { name: 'MDN', icon: '📖', url: (q: string) => `https://developer.mozilla.org/zh-CN/search?q=${encodeURIComponent(q)}`, color: '#000000', desc: 'Web文档' },
  { name: '菜鸟教程', icon: '🐦', url: (q: string) => `https://www.runoob.com/?s=${encodeURIComponent(q)}`, color: '#009639', desc: '入门教程' },
  { name: 'LeetCode', icon: '🧩', url: (q: string) => `https://leetcode.cn/problemset/list/?search=${encodeURIComponent(q)}`, color: '#ffa116', desc: '刷题练习' },
  { name: '豆瓣读书', icon: '📕', url: (q: string) => `https://search.douban.com/book/subject_search?search_text=${encodeURIComponent(q)}&cat=1001`, color: '#007722', desc: '推荐书籍' },
];

type TabType = 'chat' | 'roadmap' | 'search' | 'daily';

interface AIRecommendProps {
  onNewPlan?: () => void;
}

export const AIRecommend: React.FC<AIRecommendProps> = ({ onNewPlan }) => {
  const { skills, plans, stats, addPlan, addTask, startTimer, aiConfig } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('chat');

  // ===== AI 对话状态 =====
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ===== 路线规划状态 =====
  const [roadmapGoal, setRoadmapGoal] = useState('');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [generating, setGenerating] = useState(false);

  // ===== 搜索状态 =====
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [webSearchResults, setWebSearchResults] = useState<Record<string, WebSearchResult[]> | null>(null);
  const [webSearching, setWebSearching] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  // 搜索筛选与排序
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'difficulty' | 'time'>('score');
  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ===== 每日推送状态 =====
  const [dailyPush, setDailyPush] = useState<DailyPush | null>(null);

  // 用户上下文
  const userSkillContext = useMemo(
    () => skills.filter((s) => s.totalExp > 0).map((s) => ({ skillId: s.id, level: s.level, totalExp: s.totalExp })),
    [skills]
  );

  // 快捷问题
  const quickQuestions = useMemo(() => {
    const ctx = {
      skills: skills.map((s) => ({ id: s.id, name: s.name, level: s.level, totalExp: s.totalExp, category: s.category })),
      plans: [],
      stats: { totalStudyTime: stats.totalStudyTime, completedTasks: stats.completedTasks, streakDays: stats.currentStreak },
    };
    return getQuickQuestions(ctx as any);
  }, [skills, stats]);

  const popularSkills = useMemo(() => getPopularSkills(), []);

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // 初始化每日推送
  useEffect(() => {
    if (activeTab === 'daily' && !dailyPush) {
      generateDaily();
    }
  }, [activeTab]);

  const generateDaily = () => {
    const ctx = {
      skills: skills.map((s) => ({ id: s.id, name: s.name, level: s.level, totalExp: s.totalExp, category: s.category })),
      plans: plans.map((p) => ({ id: p.id, title: p.title, priority: p.priority, tasks: p.tasks.map((t) => ({ id: t.id, title: t.title, completed: t.completed, dueDate: t.dueDate, relatedSkillId: t.relatedSkillId, expReward: t.expReward })) })),
      stats: { totalStudyTime: stats.totalStudyTime, completedTasks: stats.completedTasks, streakDays: stats.currentStreak },
      recentBreakthroughs: [],
    };
    setDailyPush(generateDailyPush(ctx as any));
  };

  // ===== AI 对话 =====
  const AI_SYSTEM_PROMPT = `你是一个专业的学习助手，帮助用户制定学习计划、解答技术问题、推荐学习资源。
用户信息：
- 已学技能：${skills.filter(s => s.totalExp > 0).map(s => `${s.name}(Lv.${s.level})`).join('、') || '暂无'}
- 学习时长：${Math.round(stats.totalStudyTime / 60)}小时
- 完成任务：${stats.completedTasks}个
- 连续学习：${stats.currentStreak}天

请用中文回答，简洁实用，多给具体建议。如果用户问到具体技能学习，推荐学习路径和资源。`;

  const handleSendMessage = (text?: string) => {
    const content = text ?? input;
    if (!content.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    // 优先使用本地AI
    if (aiConfig.enabled && aiConfig.provider !== 'builtin') {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      chatWithAi([...history, { role: 'user', content }], aiConfig as AiProviderConfig, AI_SYSTEM_PROMPT)
        .then((response) => {
          setMessages((prev) => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
          setThinking(false);
        })
        .catch((err) => {
          // 本地AI失败，回退到内置引擎
          console.warn('本地AI请求失败，回退到内置引擎:', err.message);
          const ctx = {
            skills: skills.map((s) => ({ id: s.id, name: s.name, level: s.level, totalExp: s.totalExp, category: s.category })),
            plans: plans.map((p) => ({ id: p.id, title: p.title, tasks: p.tasks.map((t) => ({ id: t.id, title: t.title, completed: t.completed, dueDate: t.dueDate })) })),
            stats: { totalStudyTime: stats.totalStudyTime, completedTasks: stats.completedTasks, streakDays: stats.currentStreak },
          };
          const fallback = generateResponse(content, ctx as any);
          fallback.content = `⚠️ 本地AI连接失败（${err.message}），已回退到内置引擎：\n\n${fallback.content}`;
          setMessages((prev) => [...prev, fallback]);
          setThinking(false);
        });
      return;
    }

    // 内置引擎
    setTimeout(() => {
      const ctx = {
        skills: skills.map((s) => ({ id: s.id, name: s.name, level: s.level, totalExp: s.totalExp, category: s.category })),
        plans: plans.map((p) => ({ id: p.id, title: p.title, tasks: p.tasks.map((t) => ({ id: t.id, title: t.title, completed: t.completed, dueDate: t.dueDate })) })),
        stats: { totalStudyTime: stats.totalStudyTime, completedTasks: stats.completedTasks, streakDays: stats.currentStreak },
      };
      const response = generateResponse(content, ctx as any);
      setMessages((prev) => [...prev, response]);
      setThinking(false);
    }, 500);
  };

  // ===== 路线规划 =====
  const handleGenerateRoadmap = () => {
    if (!roadmapGoal.trim()) return;
    setGenerating(true);

    // 优先使用本地AI
    if (aiConfig.enabled && aiConfig.provider !== 'builtin') {
      const prompt = `请为以下学习目标生成详细的学习路线图，以JSON格式返回：
目标：${roadmapGoal}
用户已有技能：${skills.filter(s => s.totalExp > 0).map(s => `${s.name}(Lv.${s.level})`).join('、') || '暂无'}

请返回以下JSON格式（不要包含其他文字）：
{
  "title": "路线标题",
  "description": "路线描述",
  "totalDuration": "总预计时间",
  "targetLevel": "目标水平",
  "phases": [
    {
      "phase": 1,
      "name": "阶段名称",
      "duration": "预计时间",
      "goal": "阶段目标",
      "skills": [{"id": "skill-id", "name": "技能名", "category": "分类", "difficulty": "难度", "reason": "学习原因", "resources": [{"title": "资源名", "url": "URL", "type": "video/article/book"}]}],
      "milestone": "里程碑"
    }
  ],
  "finalProject": "最终项目建议",
  "careerOptions": ["职业方向1", "职业方向2"]
}`;

      generateWithAi(prompt, aiConfig as AiProviderConfig, '你是一个学习路线规划专家，请生成详细的学习路线。只返回JSON，不要包含markdown代码块标记。')
        .then((response) => {
          try {
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const roadmapData = JSON.parse(cleanResponse);
            if (roadmapData.phases && roadmapData.title) {
              setRoadmap(roadmapData as Roadmap);
            } else {
              throw new Error('返回的JSON格式不完整');
            }
          } catch {
            // JSON解析失败，使用内置引擎
            const ctx = {
              skillIds: skills.filter((s) => s.totalExp > 0).map((s) => s.id),
              skillLevels: Object.fromEntries(skills.map((s) => [s.id, s.level])),
            };
            setRoadmap(generateRoadmap(roadmapGoal, ctx));
          }
          setGenerating(false);
        })
        .catch(() => {
          // 本地AI失败，回退到内置引擎
          const ctx = {
            skillIds: skills.filter((s) => s.totalExp > 0).map((s) => s.id),
            skillLevels: Object.fromEntries(skills.map((s) => [s.id, s.level])),
          };
          setRoadmap(generateRoadmap(roadmapGoal, ctx));
          setGenerating(false);
        });
      return;
    }

    // 内置引擎
    setTimeout(() => {
      const ctx = {
        skillIds: skills.filter((s) => s.totalExp > 0).map((s) => s.id),
        skillLevels: Object.fromEntries(skills.map((s) => [s.id, s.level])),
      };
      const result = generateRoadmap(roadmapGoal, ctx);
      setRoadmap(result);
      setGenerating(false);
    }, 500);
  };

  const handleRoadmapToPlan = (rm: Roadmap) => {
    rm.phases.forEach((phase) => {
      addPlan({
        title: `${rm.title} - ${phase.name}`,
        description: `目标：${phase.goal} | 里程碑：${phase.milestone}`,
        tasks: phase.skills.map((s) => ({
          id: `${Date.now()}-${s.id}`,
          title: `学习 ${s.name}`,
          description: s.reason,
          completed: false,
          expReward: 50,
          relatedSkillId: s.id,
        })),
        priority: phase.phase === 1 ? 'high' : phase.phase === rm.phases.length ? 'low' : 'medium',
      });
    });
  };

  // ===== 搜索 =====
  const { apiSettings } = useStore();

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setHasSearched(true);
    setWebSearchResults(null);
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('score');

    // 保存搜索历史
    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((q) => q !== query)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });

    // 本地智能搜索
    setTimeout(() => {
      const results = smartSearch(query, userSkillContext);
      setSearchResults(results);
      setSearching(false);
    }, 300);

    // 全网搜索（如果开启）
    if (apiSettings.webSearchEnabled && apiSettings.enabledSources.length > 0) {
      setWebSearching(true);
      webSearch(query, apiSettings as ApiConfig).then((results) => {
        setWebSearchResults(results);
        setWebSearching(false);
      });
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setQuery(keyword);
    setSearching(true);
    setHasSearched(true);
    setExpandedResult(keyword);
    setTimeout(() => {
      const results = smartSearch(keyword, userSkillContext);
      setSearchResults(results);
      setSearching(false);
    }, 300);
  };

  // ===== 工具函数 =====
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'article': return <FileText size={16} />;
      case 'book': return <BookOpen size={16} />;
      case 'doc': return <FileText size={16} />;
      case 'practice': return <LinkIcon size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    const map: Record<string, string> = { video: '视频', article: '文章', book: '书籍', doc: '文档', practice: '练习' };
    return map[type] || type;
  };

  const renderDifficulty = (difficulty: string) => {
    const colors: Record<string, string> = { '入门': '#22c55e', '简单': '#84cc16', '中等': '#f59e0b', '较难': '#f97316', '困难': '#ef4444' };
    return <span className="difficulty-badge" style={{ color: colors[difficulty] || '#64748b', borderColor: colors[difficulty] || '#64748b' }}>{difficulty}</span>;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}小时${m}分钟` : `${h}小时`;
  };

  // ===== 渲染函数 =====
  const renderChat = () => (
    <div className="ai-chat-container">
      {/* 对话区 */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <Bot size={48} />
            <h3>AI 学习助手</h3>
            <p>
              {aiConfig.enabled && aiConfig.provider !== 'builtin'
                ? `🟢 已连接 ${aiConfig.provider === 'ollama' ? 'Ollama' : 'OpenAI兼容'} · ${aiConfig.provider === 'ollama' ? aiConfig.ollamaModel : aiConfig.openaiModel}`
                : '🟡 内置引擎模式 · 点击右下角设置连接本地AI'}
            </p>
            <div className="chat-suggestions">
              {quickQuestions.map((q, idx) => (
                <button key={idx} className="chat-suggestion-btn" onClick={() => handleSendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
            <p className="chat-capabilities">
              支持的问题类型：怎么学X、X和Y选哪个、学X需要什么基础、X难吗、推荐我学什么、学X能做什么、前端怎么学...
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.role}`}>
            <div className="chat-msg-avatar">
              {msg.role === 'user' ? '🧑' : '🤖'}
            </div>
            <div className="chat-msg-body">
              <div className="chat-msg-content" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br>') }} />
              {msg.resources && msg.resources.length > 0 && (
                <div className="chat-msg-resources">
                  {msg.resources.map((r, ridx) => (
                    <a key={ridx} href={r.url} target="_blank" rel="noopener noreferrer" className="chat-resource-link">
                      <LinkIcon size={12} />
                      {r.title}
                    </a>
                  ))}
                </div>
              )}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="chat-msg-suggestions">
                  {msg.suggestions.map((s, sidx) => (
                    <button key={sidx} className="chat-suggestion-chip" onClick={() => handleSendMessage(`怎么学${s}`)}>
                      <Search size={10} />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="chat-msg assistant">
            <div className="chat-msg-avatar">🤖</div>
            <div className="chat-msg-body">
              <div className="chat-thinking">
                <span className="thinking-dot" />
                <span className="thinking-dot" />
                <span className="thinking-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 输入区 */}
      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的问题..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="chat-send-btn" onClick={() => handleSendMessage()} disabled={thinking || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="roadmap-container">
      <div className="roadmap-input-area">
        <input
          type="text"
          value={roadmapGoal}
          onChange={(e) => setRoadmapGoal(e.target.value)}
          placeholder="输入你的学习目标，如：3个月转行前端、成为Python后端工程师、半年学AI..."
          onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
        />
        <button className="roadmap-gen-btn" onClick={handleGenerateRoadmap} disabled={generating || !roadmapGoal.trim()}>
          <Route size={18} />
          {generating ? '生成中...' : '生成路线'}
        </button>
      </div>

      {/* 快捷目标 */}
      <div className="hot-skills">
        <span className="hot-label">快捷目标：</span>
        {[
          '3个月转行前端',
          '成为Python后端工程师',
          '半年入门AI',
          '学习数据分析',
          '转行运维工程师',
          '全栈开发路线',
        ].map((goal) => (
          <button key={goal} className="hot-tag" onClick={() => { setRoadmapGoal(goal); }}>
            {goal}
          </button>
        ))}
      </div>

      {roadmap && (
        <div className="roadmap-result">
          <div className="roadmap-header">
            <h3>{roadmap.title}</h3>
            <p className="roadmap-desc">{roadmap.description}</p>
            <div className="roadmap-meta">
              <span><Clock size={12} /> {roadmap.totalDuration}</span>
              <span><Target size={12} /> {roadmap.targetLevel}</span>
            </div>
            <button className="btn-primary roadmap-to-plan" onClick={() => handleRoadmapToPlan(roadmap)}>
              <Plus size={14} />
              一键创建全部学习计划
            </button>
          </div>

          <div className="roadmap-timeline">
            {roadmap.phases.map((phase, idx) => (
              <div key={idx} className={`roadmap-phase ${phase.skills.every(s => skills.find(sk => sk.id === s.id)?.level ?? 0 >= 3) ? 'done' : ''}`}>
                <div className="phase-marker">
                  <span className="phase-num">{phase.phase}</span>
                  {idx < roadmap.phases.length - 1 && <span className="phase-line" />}
                </div>
                <div className="phase-content">
                  <div className="phase-top">
                    <h4>{phase.name}</h4>
                    <span className="phase-duration">{phase.duration}</span>
                  </div>
                  <p className="phase-goal">{phase.goal}</p>
                  <div className="phase-skills">
                    {phase.skills.map((s, sidx) => (
                      <div key={sidx} className="phase-skill">
                        <span className="phase-skill-name">{s.name}</span>
                        <span className="phase-skill-diff">{s.difficulty}</span>
                        <span className="phase-skill-reason">{s.reason}</span>
                        {s.resources.length > 0 && (
                          <a href={s.resources[0].url} target="_blank" rel="noopener noreferrer" className="phase-skill-link">
                            <LinkIcon size={10} />
                            {s.resources[0].title}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="phase-milestone">
                    <Award size={12} />
                    里程碑：{phase.milestone}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="roadmap-footer">
            <div className="roadmap-project">
              <Target size={16} />
              <div>
                <span className="section-label">最终项目建议</span>
                <p>{roadmap.finalProject}</p>
              </div>
            </div>
            <div className="roadmap-careers">
              <span className="section-label">对应职业方向</span>
              <div className="career-tags">
                {roadmap.careerOptions.map((c, idx) => (
                  <span key={idx} className="career-tag">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!roadmap && !generating && (
        <div className="empty-state">
          <Route size={48} />
          <p>输入你的学习目标，AI 自动生成完整学习路线</p>
          <p className="empty-tip">支持的目标：前端、后端、AI、运维、全栈、安全、移动、数据、游戏、区块链</p>
        </div>
      )}

      {generating && (
        <div className="searching-state">
          <div className="loading-spinner" />
          <p>正在为你规划学习路线...</p>
        </div>
      )}
    </div>
  );

  const renderDaily = () => {
    if (!dailyPush) return null;
    const dp = dailyPush;

    const handleTaskAction = (task: any) => {
      if (task.planId && task.taskId) {
        startTimer(task.planId, task.taskId);
      } else if (task.skillId) {
        handleQuickSearch(task.skillName || '');
        setActiveTab('search');
      }
    };

    return (
      <div className="daily-container">
        <div className="daily-header">
          <h3>{dp.greeting}</h3>
          <p className="daily-summary">{dp.summary}</p>
          <div className="daily-stats">
            <div className="daily-stat">
              <Zap size={14} />
              <span>{dp.totalExp} EXP</span>
            </div>
            <div className="daily-stat">
              <Clock size={14} />
              <span>{formatTime(dp.totalEstimatedTime)}</span>
            </div>
            <div className="daily-stat">
              <Target size={14} />
              <span>{dp.tasks.length} 个任务</span>
            </div>
          </div>
        </div>

        <div className="daily-tasks">
          {dp.tasks.map((task) => (
            <div key={task.id} className={`daily-task ${task.priority}`}>
              <div className="task-priority-bar" />
              <div className="task-content">
                <div className="task-top">
                  <span className={`task-type-badge ${task.type}`}>
                    {task.type === 'review' && '⏰ 临近截止'}
                    {task.type === 'breakthrough' && '🔥 突破瓶颈'}
                    {task.type === 'continue' && '📖 继续学习'}
                    {task.type === 'practice' && '✏️ 计划任务'}
                    {task.type === 'new' && '✨ 新技能'}
                  </span>
                  <span className="task-priority-label">{task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}</span>
                </div>
                <h4>{task.title}</h4>
                <p className="task-desc">{task.description}</p>
                <div className="task-reason">
                  <Lightbulb size={11} />
                  {task.reason}
                </div>
                <div className="task-footer">
                  <span className="task-exp">+{task.expReward} EXP</span>
                  <span className="task-time"><Clock size={10} /> {formatTime(task.estimatedTime)}</span>
                  <button className="task-action-btn" onClick={() => handleTaskAction(task)}>
                    <PlayCircle size={12} />
                    {task.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="daily-tips">
          <h4><Lightbulb size={14} /> 今日学习小贴士</h4>
          <ul>
            {dp.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderSearch = () => {
    const getResourceIconLocal = (type: string) => {
      switch (type) {
        case 'video': return <Video size={16} />;
        case 'article': return <FileText size={16} />;
        case 'book': return <BookOpen size={16} />;
        case 'doc': return <FileText size={16} />;
        case 'practice': return <LinkIcon size={16} />;
        default: return <LinkIcon size={16} />;
      }
    };

    const getResourceTypeLabelLocal = (type: string) => {
      const map: Record<string, string> = { video: '视频', article: '文章', book: '书籍', doc: '文档', practice: '练习' };
      return map[type] || type;
    };

    return (
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入你想学的技术，如：Python、前端、机器学习、怎么做网站..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch} disabled={searching}>
            <Search size={20} />
            {searching ? '搜索中...' : '搜索'}
          </button>
          <button className="api-settings-btn" onClick={() => setShowApiSettings(true)} title="API搜索设置">
            {apiSettings.webSearchEnabled ? <Globe size={18} className="glow" /> : <Globe size={18} />}
          </button>
        </div>

        <div className="hot-skills">
          <span className="hot-label">热门搜索：</span>
          {popularSkills.slice(0, 8).map((skill) => (
            <button key={skill.skillId} className="hot-tag" onClick={() => handleQuickSearch(skill.skillName)}>
              {skill.skillName}
            </button>
          ))}
        </div>

        {/* 搜索历史 */}
        {searchHistory.length > 0 && (
          <div className="search-history">
            <span className="history-label">搜索历史：</span>
            {searchHistory.slice(0, 5).map((q, idx) => (
              <button key={idx} className="history-tag" onClick={() => {
                setQuery(q);
                handleSearch();
              }}>
                {q}
              </button>
            ))}
            <button className="clear-history" onClick={() => {
              setSearchHistory([]);
              localStorage.removeItem('searchHistory');
            }}>
              清空
            </button>
          </div>
        )}

        {hasSearched && (
          <>
            <div className="search-results">
            <div className="results-header">
              <h3><Search size={18} /> 搜索结果</h3>
              <span className="results-count">
                {searching ? '搜索中...' : `找到 ${searchResults.length} 个相关技能`}
              </span>
            </div>

            {/* 筛选与排序栏 */}
            {!searching && searchResults.length > 0 && (
              <div className="search-filters">
                <div className="filter-group">
                  <span className="filter-label">分类：</span>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${selectedCategory === '' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('')}
                    >
                      全部
                    </button>
                    {['编程', '理论', '工具', '实操'].map((cat) => (
                      <button
                        key={cat}
                        className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <span className="filter-label">难度：</span>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${selectedDifficulty === '' ? 'active' : ''}`}
                      onClick={() => setSelectedDifficulty('')}
                    >
                      全部
                    </button>
                    {['入门', '简单', '中等', '较难', '困难'].map((diff) => (
                      <button
                        key={diff}
                        className={`filter-option ${selectedDifficulty === diff ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <span className="filter-label">排序：</span>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${sortBy === 'score' ? 'active' : ''}`}
                      onClick={() => setSortBy('score')}
                    >
                      匹配度
                    </button>
                    <button
                      className={`filter-option ${sortBy === 'difficulty' ? 'active' : ''}`}
                      onClick={() => setSortBy('difficulty')}
                    >
                      难度
                    </button>
                    <button
                      className={`filter-option ${sortBy === 'time' ? 'active' : ''}`}
                      onClick={() => setSortBy('time')}
                    >
                      学习时间
                    </button>
                  </div>
                </div>
              </div>
            )}

            {searching && (
              <div className="searching-state">
                <div className="loading-spinner" />
                <p>正在智能匹配学习资源...</p>
              </div>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="results-list">
                {(() => {
                  let filtered = [...searchResults];
                  
                  // 分类筛选
                  if (selectedCategory) {
                    filtered = filtered.filter((r) => r.entry.category === selectedCategory);
                  }
                  
                  // 难度筛选
                  if (selectedDifficulty) {
                    filtered = filtered.filter((r) => r.entry.difficulty === selectedDifficulty);
                  }
                  
                  // 排序
                  const DIFFICULTY_ORDER: Record<string, number> = { '入门': 1, '简单': 2, '中等': 3, '较难': 4, '困难': 5 };
                  const TIME_REGEX = /(\d+)\s*(小时|分钟|天)/;
                  
                  filtered.sort((a, b) => {
                    switch (sortBy) {
                      case 'score':
                        return b.score - a.score;
                      case 'difficulty':
                        return (DIFFICULTY_ORDER[a.entry.difficulty] || 3) - (DIFFICULTY_ORDER[b.entry.difficulty] || 3);
                      case 'time':
                        const matchA = a.entry.estimatedTime.match(TIME_REGEX);
                        const matchB = b.entry.estimatedTime.match(TIME_REGEX);
                        const timeA = matchA ? parseInt(matchA[1]) * (matchA[2] === '天' ? 24 : matchA[2] === '分钟' ? 1/60 : 1) : 999;
                        const timeB = matchB ? parseInt(matchB[1]) * (matchB[2] === '天' ? 24 : matchB[2] === '分钟' ? 1/60 : 1) : 999;
                        return timeA - timeB;
                      default:
                        return 0;
                    }
                  });
                  
                  return filtered.slice(0, 15);
                })().map((result) => {
                  const { entry, score, matchReasons, recommendedPhase = 0 } = result;
                  const isExpanded = expandedResult === entry.skillId;
                  return (
                    <div key={entry.skillId} className="smart-result-card">
                      <div className="result-header" onClick={() => setExpandedResult(isExpanded ? null : entry.skillId)}>
                        <div className="result-main">
                          <h3 className="result-title">{entry.skillName}</h3>
                          <div className="result-meta-row">
                            <span className="result-category">{entry.category}</span>
                            {renderDifficulty(entry.difficulty)}
                            <span className="result-time"><Clock size={11} /> {entry.estimatedTime}</span>
                          </div>
                          <p className="result-desc">{entry.description}</p>
                        </div>
                        <div className="result-side">
                          <div className="result-score">
                            <div className="score-bar"><div className="score-fill" style={{ width: `${score}%` }} /></div>
                            <span className="score-text">{score}%匹配</span>
                          </div>
                          <span className="result-expand-icon">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </span>
                        </div>
                      </div>

                      {matchReasons.length > 0 && (
                        <div className="match-reasons">
                          {matchReasons.map((reason, idx) => (
                            <span key={idx} className="match-reason-tag"><Zap size={10} /> {reason}</span>
                          ))}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="result-details">
                          {recommendedPhase > 0 && (
                            <div className="phase-recommendation">
                              <Lightbulb size={14} />
                              <span>根据你的当前水平，建议从 <strong>{entry.learningPath[recommendedPhase].phase}</strong> 阶段开始学习</span>
                            </div>
                          )}

                          <div className="learning-path-list">
                            {entry.learningPath.map((phase, phaseIdx) => (
                              <div key={phaseIdx} className={`path-phase ${phaseIdx < recommendedPhase ? 'completed' : ''} ${phaseIdx === recommendedPhase ? 'current' : ''}`}>
                                <div className="phase-header">
                                  <span className="phase-number">
                                    {phaseIdx < recommendedPhase ? <CheckCircle2 size={16} color="#22c55e" /> : <span className="phase-num-text">{phaseIdx + 1}</span>}
                                  </span>
                                  <div className="phase-info">
                                    <h4>{phase.phase}</h4>
                                    <p>{phase.goal}</p>
                                  </div>
                                </div>
                                <div className="phase-resources">
                                  {phase.resources.map((resource, resIdx) => (
                                    <a key={resIdx} href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-item">
                                      <div className="resource-icon">{getResourceIconLocal(resource.type)}</div>
                                      <div className="resource-info">
                                        <span className="resource-title">{resource.title}</span>
                                        <span className="resource-desc">{resource.description}</span>
                                      </div>
                                      <div className="resource-tags">
                                        <span className={`resource-level ${resource.level}`}>{resource.level}</span>
                                        <span className="resource-type-label">{getResourceTypeLabelLocal(resource.type)}</span>
                                        {resource.free && <span className="resource-free">免费</span>}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="web-search-section">
                            <span className="section-label"><Search size={12} /> 全网搜索「{entry.skillName}」</span>
                            <p className="web-search-hint">点击平台直达搜索结果页：</p>
                            <div className="platform-grid">
                              {SEARCH_PLATFORMS.map((platform) => (
                                <a key={platform.name} href={platform.url(entry.skillName)} target="_blank" rel="noopener noreferrer" className="platform-card" style={{ borderColor: platform.color }}>
                                  <span className="platform-icon">{platform.icon}</span>
                                  <span className="platform-name">{platform.name}</span>
                                  <span className="platform-desc">{platform.desc}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          <div className="result-actions">
                            <button className="btn-primary" onClick={() => {
                              const planId = addPlan({ title: `学习 ${entry.skillName}`, description: `${entry.description}（${entry.difficulty}，预计${entry.estimatedTime}）`, tasks: [], priority: 'medium' });
                              entry.learningPath.forEach((phase, index) => {
                                addTask(planId, {
                                  title: `阶段 ${index + 1}: ${phase.phase}`,
                                  description: phase.goal,
                                  completed: false,
                                  expReward: 50 + index * 10,
                                  relatedSkillId: entry.skillId,
                                });
                              });
                            }}>
                              <Plus size={14} /> 创建学习计划
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!searching && searchResults.length === 0 && (
              <div className="no-results">
                <Sparkles size={48} />
                <p>没有找到相关技能，试试其他关键词？</p>
              </div>
            )}
          </div>

          {apiSettings.webSearchEnabled && (
            <WebSearchResultsBlock
              webSearching={webSearching}
              webSearchResults={webSearchResults}
              onConfigure={() => setShowApiSettings(true)}
            />
          )}
          </>
        )}

        {!hasSearched && (
          <div className="empty-state">
            <Sparkles size={48} />
            <p>输入你想学习的内容，获取智能推荐</p>
            <p className="empty-tip">支持自然语言搜索，例如"我想学做网站"、"怎么入门AI"</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ai-recommend">
      {/* Tab 切换 */}
      <div className="ai-tabs">
        <button className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          <MessageCircle size={16} />
          AI对话
        </button>
        <button className={`ai-tab ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
          <Route size={16} />
          路线规划
        </button>
        <button className={`ai-tab ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
          <Calendar size={16} />
          今日推荐
        </button>
        <button className={`ai-tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
          <Search size={16} />
          资源搜索
        </button>
        
        {/* AI引擎状态与设置 */}
        <div className="ai-engine-status">
          <div className={`engine-indicator ${aiConfig.enabled && aiConfig.provider !== 'builtin' ? 'connected' : 'offline'}`}>
            <Cpu size={14} />
            <span>{aiConfig.enabled && aiConfig.provider !== 'builtin' ? '本地AI' : '内置引擎'}</span>
          </div>
          <button 
            className="ai-settings-btn-inline" 
            onClick={() => setShowAiSettings(true)}
            title="AI引擎设置"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="ai-tab-content">
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'daily' && renderDaily()}
        {activeTab === 'search' && renderSearch()}
      </div>

      {onNewPlan && (
        <button className="new-plan-float" onClick={() => onNewPlan()} title="新建学习计划">
          <PlusCircle size={24} />
        </button>
      )}

      {/* AI设置按钮 */}
      <button
        className={`ai-settings-float ${aiConfig.enabled ? 'active' : ''}`}
        onClick={() => setShowAiSettings(true)}
        title="本地AI设置"
      >
        {aiConfig.enabled ? <Cpu size={20} /> : <Settings size={20} />}
      </button>

      {/* API 设置模态框 */}
      <ApiSettingsModal isOpen={showApiSettings} onClose={() => setShowApiSettings(false)} />
      {/* 本地AI 设置模态框 */}
      <AiSettingsModal isOpen={showAiSettings} onClose={() => setShowAiSettings(false)} />
    </div>
  );
};

// 全网搜索结果区块组件
const WebSearchResultsBlock: React.FC<{
  webSearching: boolean;
  webSearchResults: Record<string, WebSearchResult[]> | null;
  onConfigure: () => void;
}> = ({ webSearching, webSearchResults, onConfigure }) => {
  return (
    <div className="web-search-results">
      <div className="results-header">
        <h3><Globe size={18} /> 全网搜索结果</h3>
        <span className="results-count">
          {webSearching ? '搜索中...' : webSearchResults ? `来自 ${Object.keys(webSearchResults).length} 个来源` : '准备搜索'}
        </span>
      </div>

      {webSearching && (
        <div className="searching-state">
          <div className="loading-spinner" />
          <p>正在全网搜索学习资源...</p>
        </div>
      )}

      {!webSearching && webSearchResults && Object.keys(webSearchResults).length > 0 && (
        <div className="web-results-groups">
          {Object.entries(webSearchResults).map(([source, items]) => {
            const info = SEARCH_SOURCE_INFO[source as keyof typeof SEARCH_SOURCE_INFO];
            return (
              <div key={source} className="web-result-group">
                <div className="web-group-header">
                  <span className="web-group-icon">{info?.icon || '🔍'}</span>
                  <span className="web-group-name">{info?.label || source}</span>
                  <span className="web-group-count">{items.length}条</span>
                </div>
                <div className="web-result-list">
                  {items.slice(0, 4).map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="web-result-item"
                    >
                      <div className="web-result-title">{item.title}</div>
                      <div className="web-result-snippet">{item.snippet}</div>
                      {item.category && (
                        <span className="web-result-category">{item.category}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!webSearching && webSearchResults && Object.keys(webSearchResults).length === 0 && (
        <div className="no-results small">
          <p>没有找到全网搜索结果</p>
        </div>
      )}

      {!webSearching && !webSearchResults && (
        <div className="web-search-hint-box">
          <Lightbulb size={16} />
          <span>搜索后自动加载全网结果</span>
          <button className="link-btn" onClick={onConfigure}>配置搜索源</button>
        </div>
      )}
    </div>
  );
};

export default AIRecommend;
