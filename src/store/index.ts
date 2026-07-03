import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { SKILLS_WITH_META } from '../data/skillsAndCareers';

import { getSkillLevelWithBreakthrough, EXP_CONFIG, getStreakBonus } from '../utils/skillLevels';
import { DEFAULT_ENABLED_SOURCES, type SearchSource } from '../utils/searchApi';
import { DEFAULT_AI_CONFIG, type AiProviderConfig } from '../utils/localAiService';

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
  skillType?: string;
  difficulty?: number;
  expMethods?: string[];
  verification?: string[];
  // 已突破的瓶颈等级列表，如 [4, 6]
  breakthroughs?: number[];
};



type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  expReward: number;
  relatedSkillId?: string;
  dueDate?: string;
  notes?: string;
};

type StudyPlan = {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  priority?: 'high' | 'medium' | 'low';
};

type StudySession = {
  id: string;
  planId: string;
  taskId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  notes?: string;
};

type StudyStats = {
  totalStudyTime: number;
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
};

type AppState = {
  plans: StudyPlan[];
  currentPlanId: string | null;
  skills: Skill[];
  sessions: StudySession[];
  stats: StudyStats;
  isTimerRunning: boolean;
  timerStartTime: string | null;
  currentTimerPlanId: string | null;
  currentTimerTaskId: string | null;
  // 已完成的项目目标：projectGoalId -> { completedAt, expReward }
  completedProjects: Record<string, { completedAt: string; expReward: number }>;
  // 技能树知识点掌握状态：skillId -> Set of mastered node ids
  masteredSkillNodes: Record<string, string[]>;
  // API搜索配置
  apiSettings: {
    serpApiKey?: string;
    googleApiKey?: string;
    googleCx?: string;
    customApiUrl?: string;
    enabledSources: SearchSource[];
    webSearchEnabled: boolean;
  };
  // 本地AI配置
  aiConfig: AiProviderConfig;
};

interface AppStore extends AppState {
  // Plan actions
  addPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePlan: (id: string, updates: Partial<StudyPlan>) => void;
  deletePlan: (id: string) => void;
  setCurrentPlan: (id: string | null) => void;

  // Task actions
  addTask: (planId: string, task: Omit<Task, 'id'>) => string;
  updateTask: (planId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (planId: string, taskId: string) => void;
  toggleTask: (planId: string, taskId: string) => void;

  // Skill actions
  addSkillExp: (skillId: string, exp: number) => void;
  // 突破指定技能的指定瓶颈等级
  breakthroughSkill: (skillId: string, level: number) => void;
  // 标记项目目标完成/取消完成
  toggleProjectComplete: (projectGoalId: string, skillId: string, difficulty: number) => void;
  // 技能树知识点：切换掌握状态
  toggleSkillNodeMastered: (skillId: string, nodeId: string) => void;

  // Timer actions
  startTimer: (planId: string, taskId?: string) => void;
  stopTimer: () => number;
  getCurrentDuration: () => number;

  // Session actions
  addSession: (session: Omit<StudySession, 'id'>) => void;

  // API settings actions
  updateApiSettings: (updates: Partial<AppState['apiSettings']>) => void;
  toggleSearchSource: (source: SearchSource) => void;
  toggleWebSearch: () => void;
  // AI config actions
  updateAiConfig: (updates: Partial<AiProviderConfig>) => void;

  // Data import/export
  exportData: () => string;
  importData: (json: string) => boolean;
}

const initialSkills: Skill[] = SKILLS_WITH_META.map(skill => ({
  ...skill,
  level: 0,
  exp: 0,
  totalExp: 0,
})) as Skill[];

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      plans: [],
      currentPlanId: null,
      skills: initialSkills,
      sessions: [],
      stats: {
        totalStudyTime: 0,
        totalTasks: 0,
        completedTasks: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      isTimerRunning: false,
      timerStartTime: null,
      currentTimerPlanId: null,
      currentTimerTaskId: null,
      completedProjects: {},
      masteredSkillNodes: {},
      apiSettings: {
        enabledSources: DEFAULT_ENABLED_SOURCES,
        webSearchEnabled: false,
      },
      aiConfig: { ...DEFAULT_AI_CONFIG },

      addPlan: (plan) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        set((state) => ({
          plans: [
            ...state.plans,
            {
              ...plan,
              id,
              createdAt: now,
              updatedAt: now,
            },
          ],
          currentPlanId: state.currentPlanId || id,
        }));
        return id;
      },

      updatePlan: (id, updates) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === id
              ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
              : plan
          ),
        }));
      },

      deletePlan: (id) => {
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== id),
          currentPlanId: state.currentPlanId === id ? null : state.currentPlanId,
        }));
      },

      setCurrentPlan: (id) => {
        set({ currentPlanId: id });
      },

      addTask: (planId, task) => {
        const taskId = uuidv4();
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  tasks: [...plan.tasks, { ...task, id: taskId }],
                  updatedAt: new Date().toISOString(),
                }
              : plan
          ),
          stats: {
            ...state.stats,
            totalTasks: state.stats.totalTasks + 1,
          },
        }));
        return taskId;
      },

      updateTask: (planId, taskId, updates) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  tasks: plan.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : plan
          ),
        }));
      },

      deleteTask: (planId, taskId) => {
        set((state) => {
          const plan = state.plans.find((p) => p.id === planId);
          const task = plan?.tasks.find((t) => t.id === taskId);
          return {
            plans: state.plans.map((plan) =>
              plan.id === planId
                ? {
                    ...plan,
                    tasks: plan.tasks.filter((task) => task.id !== taskId),
                    updatedAt: new Date().toISOString(),
                  }
                : plan
            ),
            stats: {
              ...state.stats,
              totalTasks: task ? state.stats.totalTasks - 1 : state.stats.totalTasks,
              completedTasks: task?.completed
                ? state.stats.completedTasks - 1
                : state.stats.completedTasks,
            },
          };
        });
      },

      toggleTask: (planId, taskId) => {
        set((state) => {
          const plan = state.plans.find((p) => p.id === planId);
          const task = plan?.tasks.find((t) => t.id === taskId);
          
          if (!task) return state;
          
          const newCompleted = !task.completed;
          
          // If completing task, add exp
          let newSkills = state.skills;
          if (newCompleted && task.relatedSkillId) {
            newSkills = state.skills.map((skill) =>
              skill.id === task.relatedSkillId
                ? {
                    ...skill,
                    exp: skill.exp + task.expReward,
                    totalExp: skill.totalExp + task.expReward,
                    level: getSkillLevelWithBreakthrough(skill.exp + task.expReward, skill.breakthroughs || []),
                  }
                : skill
            );
          }
          
          return {
            plans: state.plans.map((plan) =>
              plan.id === planId
                ? {
                    ...plan,
                    tasks: plan.tasks.map((task) =>
                      task.id === taskId
                        ? { ...task, completed: newCompleted }
                        : task
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : plan
            ),
            skills: newSkills,
            stats: {
              ...state.stats,
              completedTasks: newCompleted
                ? state.stats.completedTasks + 1
                : state.stats.completedTasks - 1,
            },
          };
        });
      },

      addSkillExp: (skillId, exp) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  exp: skill.exp + exp,
                  totalExp: skill.totalExp + exp,
                  level: getSkillLevelWithBreakthrough(skill.exp + exp, skill.breakthroughs || []),
                }
              : skill
          ),
        }));
      },

      breakthroughSkill: (skillId, level) => {
        set((state) => ({
          skills: state.skills.map((skill) => {
            if (skill.id !== skillId) return skill;
            const breakthroughs = skill.breakthroughs || [];
            if (breakthroughs.includes(level)) return skill;
            const newBreakthroughs = [...breakthroughs, level];
            return {
              ...skill,
              breakthroughs: newBreakthroughs,
              level: getSkillLevelWithBreakthrough(skill.exp, newBreakthroughs),
            };
          }),
        }));
      },

      toggleProjectComplete: (projectGoalId, skillId, difficulty) => {
        const expReward = EXP_CONFIG.PROJECT_COMPLETE_EXP * difficulty;
        set((state) => {
          const isCompleted = !!state.completedProjects[projectGoalId];
          let newCompleted = { ...state.completedProjects };
          let newSkills = state.skills;

          if (isCompleted) {
            delete newCompleted[projectGoalId];
            newSkills = state.skills.map((skill) =>
              skill.id === skillId
                ? {
                    ...skill,
                    exp: Math.max(0, skill.exp - expReward),
                    totalExp: Math.max(0, skill.totalExp - expReward),
                    level: getSkillLevelWithBreakthrough(
                      Math.max(0, skill.exp - expReward),
                      skill.breakthroughs || []
                    ),
                  }
                : skill
            );
          } else {
            newCompleted[projectGoalId] = {
              completedAt: new Date().toISOString(),
              expReward,
            };
            newSkills = state.skills.map((skill) =>
              skill.id === skillId
                ? {
                    ...skill,
                    exp: skill.exp + expReward,
                    totalExp: skill.totalExp + expReward,
                    level: getSkillLevelWithBreakthrough(
                      skill.exp + expReward,
                      skill.breakthroughs || []
                    ),
                  }
                : skill
            );
          }

          return {
            completedProjects: newCompleted,
            skills: newSkills,
          };
        });
      },

      toggleSkillNodeMastered: (skillId, nodeId) => {
        set((state) => {
          const mastered = state.masteredSkillNodes[skillId] || [];
          const isMastered = mastered.includes(nodeId);
          const newMastered = isMastered
            ? mastered.filter((id) => id !== nodeId)
            : [...mastered, nodeId];
          return {
            masteredSkillNodes: {
              ...state.masteredSkillNodes,
              [skillId]: newMastered,
            },
          };
        });
      },

      startTimer: (planId, taskId) => {
        set({
          isTimerRunning: true,
          timerStartTime: new Date().toISOString(),
          currentTimerPlanId: planId,
          currentTimerTaskId: taskId || null,
        });
      },

      stopTimer: () => {
        const state = get();
        if (!state.isTimerRunning || !state.timerStartTime) return 0;

        const startTime = new Date(state.timerStartTime).getTime();
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime) / 1000);

        const session: Omit<StudySession, 'id'> = {
          planId: state.currentTimerPlanId!,
          taskId: state.currentTimerTaskId || undefined,
          startTime: state.timerStartTime,
          endTime: new Date(endTime).toISOString(),
          duration,
        };

        // 计算基于时间的经验（至少1分钟才算）
        const minutes = Math.max(1, Math.floor(duration / 60));
        const streakBonus = getStreakBonus(state.stats.currentStreak);
        const timeExp = Math.round(minutes * EXP_CONFIG.EXP_PER_MINUTE * streakBonus);

        // 查找关联技能：优先从 task 取 relatedSkillId
        let relatedSkillId: string | null = null;
        if (state.currentTimerTaskId && state.currentTimerPlanId) {
          const plan = state.plans.find((p) => p.id === state.currentTimerPlanId);
          const task = plan?.tasks.find((t) => t.id === state.currentTimerTaskId);
          relatedSkillId = task?.relatedSkillId || null;
        }

        // 更新连胜与最后学习日期
        const todayStr = new Date().toDateString();
        const lastDateStr = state.stats.lastStudyDate
          ? new Date(state.stats.lastStudyDate).toDateString()
          : null;
        let newStreak = state.stats.currentStreak;
        let newLongest = state.stats.longestStreak;
        let newLastDate = state.stats.lastStudyDate;

        if (lastDateStr !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          if (lastDateStr === yesterdayStr) {
            newStreak = state.stats.currentStreak + 1;
          } else {
            newStreak = 1;
          }
          newLongest = Math.max(newLongest, newStreak);
          newLastDate = new Date().toISOString();
        }

        set((state) => {
          let newSkills = state.skills;
          if (relatedSkillId && timeExp > 0) {
            newSkills = state.skills.map((skill) =>
              skill.id === relatedSkillId
                ? {
                    ...skill,
                    exp: skill.exp + timeExp,
                    totalExp: skill.totalExp + timeExp,
                    level: getSkillLevelWithBreakthrough(
                      skill.exp + timeExp,
                      skill.breakthroughs || []
                    ),
                  }
                : skill
            );
          }
          return {
            isTimerRunning: false,
            timerStartTime: null,
            currentTimerPlanId: null,
            currentTimerTaskId: null,
            sessions: [...state.sessions, { ...session, id: uuidv4() }],
            skills: newSkills,
            stats: {
              ...state.stats,
              totalStudyTime: state.stats.totalStudyTime + duration,
              currentStreak: newStreak,
              longestStreak: newLongest,
              lastStudyDate: newLastDate,
            },
          };
        });

        return duration;
      },

      getCurrentDuration: () => {
        const state = get();
        if (!state.isTimerRunning || !state.timerStartTime) return 0;
        const startTime = new Date(state.timerStartTime).getTime();
        return Math.floor((Date.now() - startTime) / 1000);
      },

      addSession: (session) => {
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: uuidv4() }],
        }));
      },

      updateApiSettings: (updates) => {
        set((state) => ({
          apiSettings: { ...state.apiSettings, ...updates },
        }));
      },

      toggleSearchSource: (source) => {
        set((state) => {
          const sources = state.apiSettings.enabledSources.includes(source)
            ? state.apiSettings.enabledSources.filter((s) => s !== source)
            : [...state.apiSettings.enabledSources, source];
          return { apiSettings: { ...state.apiSettings, enabledSources: sources } };
        });
      },

      toggleWebSearch: () => {
        set((state) => ({
          apiSettings: { ...state.apiSettings, webSearchEnabled: !state.apiSettings.webSearchEnabled },
        }));
      },

      updateAiConfig: (updates) => {
        set((state) => ({
          aiConfig: { ...state.aiConfig, ...updates },
        }));
      },

      exportData: () => {
        const state = get();
        const exportObj = {
          version: 1,
          exportedAt: new Date().toISOString(),
          plans: state.plans,
          skills: state.skills,
          sessions: state.sessions,
          stats: state.stats,
          completedProjects: state.completedProjects,
          masteredSkillNodes: state.masteredSkillNodes,
          apiSettings: state.apiSettings,
          aiConfig: state.aiConfig,
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.plans || !Array.isArray(data.plans)) return false;
          set({
            plans: data.plans || [],
            skills: data.skills || initialSkills,
            sessions: data.sessions || [],
            stats: data.stats || {
              totalStudyTime: 0,
              totalTasks: 0,
              completedTasks: 0,
              currentStreak: 0,
              longestStreak: 0,
            },
            completedProjects: data.completedProjects || {},
            masteredSkillNodes: data.masteredSkillNodes || {},
            apiSettings: data.apiSettings || { enabledSources: DEFAULT_ENABLED_SOURCES, webSearchEnabled: false },
            aiConfig: data.aiConfig || { ...DEFAULT_AI_CONFIG },
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'study-planner-storage',
    }
  )
);