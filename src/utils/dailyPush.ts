/**
 * 每日智能推送引擎
 * 根据用户的学习数据，每天推荐应该学什么
 */

import { DEFAULT_SKILLS, SKILLS_WITH_META } from '../data/skillsAndCareers';
import { LEARNING_RESOURCE_DB } from '../data/learningResources';
import { getRecommendations } from './smartSearch';

export type DailyTask = {
  id: string;
  type: 'review' | 'continue' | 'new' | 'practice' | 'breakthrough';
  priority: 'high' | 'medium' | 'low';
  title: string;          // 任务标题
  description: string;    // 任务描述
  skillId?: string;       // 关联技能
  skillName?: string;
  planId?: string;        // 关联计划
  taskId?: string;        // 关联任务
  expReward: number;      // 经验奖励
  estimatedTime: number;  // 预计分钟数
  reason: string;         // 推荐原因
  action: string;         // 建议动作，如"开始计时学习"
};

export type DailyPush = {
  date: string;
  greeting: string;       // 问候语
  summary: string;        // 今日总结
  tasks: DailyTask[];
  tips: string[];         // 学习小贴士
  totalExp: number;       // 今日预计可获得经验
  totalEstimatedTime: number; // 预计总时长（分钟）
};

export type UserContext = {
  skills: { id: string; name: string; level: number; totalExp: number; category: string; lastStudyDate?: string }[];
  plans: { id: string; title: string; priority?: string; tasks: { id: string; title: string; completed: boolean; dueDate?: string; relatedSkillId?: string; expReward: number }[] }[];
  stats: { totalStudyTime: number; completedTasks: number; streakDays: number; lastStudyDate?: string; todayStudyTime: number };
  recentBreakthroughs: string[]; // 近期突破的技能ID
};

// 瓶颈等级：达到这些等级后，需要完成突破任务才能继续升级
const BREAKTHROUGH_LEVELS = [4, 6, 8];

// 瓶颈等级 -> 下一级名称
const NEXT_LEVEL_NAME: Record<number, string> = {
  4: '炉火纯青',
  6: '登峰造极',
  8: '一代宗师',
};

// 学习小技巧库
const STUDY_TIPS = [
  '番茄工作法：专注学习25分钟，休息5分钟，每4个番茄钟长休息15分钟',
  '费曼学习法：尝试用通俗的语言把刚学的内容讲给小白听，讲不清的地方就是你的知识盲区',
  '主动回忆：合上书本，主动回忆刚学的内容，比反复阅读更有效',
  '间隔重复：把复习分散到多天，比集中突击记忆更持久',
  '刻意练习：针对薄弱环节反复训练，而不是重复已经掌握的内容',
  '学习笔记：用自己的话总结，加入例子和图示，形成知识网络',
  '教是最好的学：写博客或给他人讲解，能加深自己对知识的理解',
  '碎片时间：通勤、排队时用手机看技术文章或视频，积少成多',
  '项目驱动：学完基础立即动手做小项目，在实践中巩固知识',
  '睡眠记忆：睡前复习难点，睡眠有助于巩固长期记忆',
];

// 日期工具：格式化为 YYYY-MM-DD
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 获取当天 0 点（本地时间）
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// 解析日期字符串（优先解析 YYYY-MM-DD，避免时区偏移）
function parseDate(s: string): Date | null {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    return new Date(y, m, d);
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return startOfDay(d);
}

// 判断截止日期是否在今天或明天
function isDueSoon(dueDate: string): boolean {
  const due = parseDate(dueDate);
  if (!due) return false;
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return due.getTime() === today.getTime() || due.getTime() === tomorrow.getTime();
}

// 计算给定日期距今的天数（正数表示已过去；无日期返回 Infinity）
function daysSinceToday(dateString: string): number {
  const d = parseDate(dateString);
  if (!d) return Infinity;
  const today = startOfDay(new Date());
  return Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
}

// 根据 skillId 查找技能完整元数据
function getSkillMeta(skillId: string) {
  return SKILLS_WITH_META.find((s) => s.id === skillId);
}

// 根据 skillId 查找技能基础信息
function getSkillBasic(skillId: string) {
  return DEFAULT_SKILLS.find((s) => s.id === skillId);
}

// 根据 skillId 查找学习资源
function getResource(skillId: string) {
  return LEARNING_RESOURCE_DB.find((r) => r.skillId === skillId);
}

// 生成任务 ID
function genId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

// 根据当前时间生成问候语
function getGreeting(streakDays: number, todayStudyTime: number): string {
  const hour = new Date().getHours();
  let base: string;
  if (hour >= 5 && hour < 12) {
    base = '早上好';
  } else if (hour >= 12 && hour < 18) {
    base = '下午好';
  } else {
    base = '晚上好';
  }

  let greeting = base;
  if (streakDays > 0) {
    greeting += `，已连续学习${streakDays}天`;
  }
  if (todayStudyTime > 0) {
    greeting += '，今天表现很棒，继续保持！';
  }
  return greeting;
}

// 返回随机一个学习小技巧
export function getStudyTips(): string {
  const idx = Math.floor(Math.random() * STUDY_TIPS.length);
  return STUDY_TIPS[idx];
}

// 生成学习小贴士列表
function buildTips(context: UserContext, tasks: DailyTask[]): string[] {
  const tips: string[] = [];
  const { stats } = context;

  if (stats.streakDays > 3) {
    tips.push(`已连续学习${stats.streakDays}天，势头正盛，保持下去！`);
  }

  if (stats.todayStudyTime <= 0) {
    tips.push('今天还没有学习记录，从一个简单的任务开始吧');
  }

  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  if (highPriorityCount >= 2) {
    tips.push('今天有多个高优先级任务，建议先专注完成最重要的一项');
  }

  const randomTip = getStudyTips();
  if (!tips.includes(randomTip)) {
    tips.push(randomTip);
  }

  return tips;
}

// 生成今日总结
function buildSummary(tasks: DailyTask[]): string {
  const totalExp = tasks.reduce((sum, t) => sum + t.expReward, 0);
  const totalTime = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
  return `今日推荐${tasks.length}个学习任务，预计可获得${totalExp}经验，耗时约${totalTime}分钟`;
}

export function generateDailyPush(context: UserContext): DailyPush {
  const tasks: DailyTask[] = [];
  let taskIdx = 0;

  const { skills, plans, stats, recentBreakthroughs } = context;
  const breakthroughSkillIds = new Set(
    skills
      .filter((s) => BREAKTHROUGH_LEVELS.includes(s.level) && !recentBreakthroughs.includes(s.id))
      .map((s) => s.id)
  );

  // 1. 高优先级 - 截止日期临近的任务（今天或明天到期且未完成）
  for (const plan of plans) {
    for (const task of plan.tasks) {
      if (task.completed) continue;
      if (!task.dueDate || !isDueSoon(task.dueDate)) continue;
      const meta = task.relatedSkillId ? getSkillMeta(task.relatedSkillId) : undefined;
      tasks.push({
        id: genId('review', taskIdx++),
        type: 'review',
        priority: 'high',
        title: `完成: ${task.title}`,
        description: plan.title,
        skillId: task.relatedSkillId,
        skillName: meta?.name,
        planId: plan.id,
        taskId: task.id,
        expReward: task.expReward,
        estimatedTime: 30,
        reason: '此任务即将到期',
        action: '开始计时学习',
      });
    }
  }

  // 2. 高优先级 - 突破瓶颈（处于 Lv.4 / Lv.6 / Lv.8 的技能）
  for (const skill of skills) {
    if (!BREAKTHROUGH_LEVELS.includes(skill.level)) continue;
    if (recentBreakthroughs.includes(skill.id)) continue;
    const nextLevelName = NEXT_LEVEL_NAME[skill.level] ?? '下一级';
    tasks.push({
      id: genId('breakthrough', taskIdx++),
      type: 'breakthrough',
      priority: 'high',
      title: `突破瓶颈: ${skill.name}`,
      description: `${skill.name}已达 Lv.${skill.level}，完成突破任务即可升级到「${nextLevelName}」`,
      skillId: skill.id,
      skillName: skill.name,
      expReward: 120,
      estimatedTime: 45,
      reason: `你的${skill.name}技能即将突破瓶颈，完成突破任务即可升级`,
      action: '完成突破任务',
    });
  }

  // 3. 中优先级 - 继续学习未完成的技能（totalExp > 0 但最近 7 天没学习）
  for (const skill of skills) {
    if (skill.totalExp <= 0) continue;
    // 已在突破任务中处理的不重复推荐
    if (breakthroughSkillIds.has(skill.id)) continue;
    const lastStudy = skill.lastStudyDate;
    const stale = !lastStudy || daysSinceToday(lastStudy) > 7;
    if (!stale) continue;
    const meta = getSkillMeta(skill.id);
    const resource = getResource(skill.id);
    const method = meta?.expMethods?.[0] ?? '学习';
    tasks.push({
      id: genId('continue', taskIdx++),
      type: 'continue',
      priority: 'medium',
      title: `继续学习: ${skill.name}`,
      description: resource
        ? `上次学到 Lv.${skill.level}，建议继续「${method}」`
        : `${skill.name} 已学到 Lv.${skill.level}，继续学习保持进度`,
      skillId: skill.id,
      skillName: skill.name,
      expReward: 60,
      estimatedTime: 30,
      reason: `你的${skill.name}技能已经学到 Lv.${skill.level}，继续学习保持进度`,
      action: '开始计时学习',
    });
  }

  // 4. 中优先级 - 完成计划中的未完成任务（优先推荐关联了技能的任务）
  const practiceTasks: DailyTask[] = [];
  for (const plan of plans) {
    for (const task of plan.tasks) {
      if (task.completed) continue;
      // 跳过已因为截止日期临近推荐过的任务
      if (task.dueDate && isDueSoon(task.dueDate)) continue;
      const meta = task.relatedSkillId ? getSkillMeta(task.relatedSkillId) : undefined;
      const basic = task.relatedSkillId ? getSkillBasic(task.relatedSkillId) : undefined;
      practiceTasks.push({
        id: genId('practice', taskIdx++),
        type: 'practice',
        priority: 'medium',
        title: `推进计划: ${task.title}`,
        description: plan.title,
        skillId: task.relatedSkillId,
        skillName: meta?.name ?? basic?.name,
        planId: plan.id,
        taskId: task.id,
        expReward: Math.max(task.expReward, 50),
        estimatedTime: 25,
        reason: '继续推进你的学习计划',
        action: '开始计时学习',
      });
    }
  }
  // 关联了技能的任务排在前面
  practiceTasks.sort((a, b) => {
    const aHas = a.skillId ? 1 : 0;
    const bHas = b.skillId ? 1 : 0;
    return bHas - aHas;
  });
  tasks.push(...practiceTasks);

  // 5. 低优先级 - 推荐新技能
  const userSkillContext = skills.map((s) => ({
    skillId: s.id,
    level: s.level,
    totalExp: s.totalExp,
  }));
  const recommendations = getRecommendations(userSkillContext);
  const userSkillIds = new Set(skills.map((s) => s.id));
  const newRec = recommendations.find((r) => !userSkillIds.has(r.entry.skillId)) ?? recommendations[0];
  if (newRec) {
    const entry = newRec.entry;
    tasks.push({
      id: genId('new', taskIdx++),
      type: 'new',
      priority: 'low',
      title: `尝试新技能: ${entry.skillName}`,
      description: entry.description,
      skillId: entry.skillId,
      skillName: entry.skillName,
      expReward: 40,
      estimatedTime: 20,
      reason: '基于你的学习记录，推荐尝试新技能',
      action: '查看学习资源',
    });
  }

  // 按优先级排序（高 > 中 > 低），同优先级保持生成顺序，最多 5 个
  const priorityOrder: Record<DailyTask['priority'], number> = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  const finalTasks = tasks.slice(0, 5);

  const totalExp = finalTasks.reduce((sum, t) => sum + t.expReward, 0);
  const totalEstimatedTime = finalTasks.reduce((sum, t) => sum + t.estimatedTime, 0);

  return {
    date: formatDate(new Date()),
    greeting: getGreeting(stats.streakDays, stats.todayStudyTime),
    summary: buildSummary(finalTasks),
    tasks: finalTasks,
    tips: buildTips(context, finalTasks),
    totalExp,
    totalEstimatedTime,
  };
}
