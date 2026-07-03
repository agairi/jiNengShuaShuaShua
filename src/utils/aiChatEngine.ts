/**
 * 本地 AI 问答引擎
 * 基于本地知识库回答用户关于学习的问题，并结合用户已有技能数据给出个性化回答。
 * 纯本地实现，不调用任何外部 API。
 */

import { DEFAULT_SKILLS, DEFAULT_CAREERS } from '../data/skillsAndCareers';
import { LEARNING_RESOURCE_DB, type LearningResourceEntry } from '../data/learningResources';
import {
  smartSearch,
  getResourceBySkillId,
  getRecommendations,
  type UserSkillContext,
} from './smartSearch';

// ============ 导出类型 ============

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  // 可选的富文本数据
  suggestions?: string[]; // 推荐的技能（名称）
  relatedSkills?: string[]; // 相关技能ID
  resources?: { title: string; url: string }[]; // 相关资源
};

export type UserContext = {
  skills: { id: string; name: string; level: number; totalExp: number; category: string }[];
  plans: { id: string; title: string; tasks: { id: string; title: string; completed: boolean; dueDate?: string }[] }[];
  stats: { totalStudyTime: number; completedTasks: number; streakDays: number };
};

// 自然语气的开场白
const GREETINGS = [
  '好的，我来帮你分析一下！',
  '了解，我来给你一些建议~',
  '没问题，让我看看你的情况。',
  '收到，这是我的建议：',
];

// 自然语气的结束语
const SIGN_OFFS = [
  '',
  '',
  '\n\n如果还有其他问题，随时问我！',
  '\n\n希望这些建议对你有帮助 😊',
];

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 学习阶段元素类型
type Phase = LearningResourceEntry['learningPath'][number];
const DIFFICULTY_NUM: Record<string, number> = {
  '入门': 1,
  '简单': 2,
  '中等': 3,
  '较难': 4,
  '困难': 5,
};

// 职业技能重要度排序权重
const IMPORTANCE_ORDER: Record<'core' | 'important' | 'optional', number> = {
  core: 0,
  important: 1,
  optional: 2,
};

// 技能ID -> 名称映射（优先取自 DEFAULT_SKILLS，回退到资源库）
const SKILL_NAME_MAP: Record<string, string> = {};
for (const s of DEFAULT_SKILLS) SKILL_NAME_MAP[s.id] = s.name;

function skillNameOf(skillId: string): string {
  if (SKILL_NAME_MAP[skillId]) return SKILL_NAME_MAP[skillId];
  const entry = getResourceBySkillId(skillId);
  return entry ? entry.skillName : skillId;
}

function getSkillDifficultyNum(skillId: string): number {
  const entry = getResourceBySkillId(skillId);
  if (entry && DIFFICULTY_NUM[entry.difficulty]) return DIFFICULTY_NUM[entry.difficulty];
  return 3;
}

// 将 UserContext.skills 转换为 smartSearch 需要的上下文
function toUserSkillContext(context: UserContext): UserSkillContext[] {
  return context.skills.map((s) => ({ skillId: s.id, level: s.level, totalExp: s.totalExp }));
}

// 获取用户对某技能的掌握情况
function getUserSkill(context: UserContext, skillId: string): UserContext['skills'][number] | undefined {
  return context.skills.find((s) => s.id === skillId);
}

// ============ 文本中查找技能 ============

type SkillMatch = { entry: LearningResourceEntry; start: number; len: number };

function findSkillMatches(text: string): SkillMatch[] {
  const lower = text.toLowerCase();
  const result: SkillMatch[] = [];
  for (const entry of LEARNING_RESOURCE_DB) {
    const candidates = [entry.skillName, entry.skillId, ...entry.aliases];
    let best = { start: -1, len: 0 };
    for (const c of candidates) {
      const cl = c.toLowerCase();
      if (cl.length < 2) continue; // 跳过过短的别名，避免误匹配
      const idx = lower.indexOf(cl);
      if (idx !== -1 && cl.length > best.len) {
        best = { start: idx, len: cl.length };
      }
    }
    if (best.len > 0) result.push({ entry, start: best.start, len: best.len });
  }
  // 按匹配长度降序、位置升序
  result.sort((a, b) => b.len - a.len || a.start - b.start);
  return result;
}

// 查找文本中出现的所有技能（去除重叠匹配，如 MySQL 与 SQL 只保留 MySQL）
function findSkillsInText(text: string): LearningResourceEntry[] {
  const matches = findSkillMatches(text);
  const chosen: SkillMatch[] = [];
  for (const m of matches) {
    const overlaps = chosen.some(
      (c) => !(m.start + m.len <= c.start || c.start + c.len <= m.start)
    );
    if (!overlaps) chosen.push(m);
  }
  return chosen.map((m) => m.entry);
}

// 查找文本中最佳匹配的单个技能
function findSkillInText(text: string): LearningResourceEntry | undefined {
  const skills = findSkillsInText(text);
  return skills.length > 0 ? skills[0] : undefined;
}

// ============ 资源选择 ============

// 根据用户水平挑选合适阶段的资源
function pickResources(
  entry: LearningResourceEntry,
  userLevel: number,
  count: number
): { title: string; url: string }[] {
  const phases = entry.learningPath;
  const picked: { title: string; url: string }[] = [];
  if (phases.length === 0) return picked;

  let phaseIdx = 0;
  if (userLevel >= 5 && phases.length > 1) phaseIdx = phases.length - 1;
  else if (userLevel >= 2 && phases.length > 1) phaseIdx = 1;

  const pushFrom = (phase: Phase) => {
    for (const r of phase.resources) {
      if (picked.length >= count) break;
      if (!picked.some((p) => p.url === r.url)) picked.push({ title: r.title, url: r.url });
    }
  };

  pushFrom(phases[phaseIdx]);
  if (picked.length < count && phaseIdx + 1 < phases.length) pushFrom(phases[phaseIdx + 1]);
  if (picked.length < count && phaseIdx > 0) pushFrom(phases[0]);
  return picked;
}

// 描述技能的应用场景（基于需要该技能的职业）
function describeApplication(entry: LearningResourceEntry): string {
  const careers = DEFAULT_CAREERS.filter((c) => c.skills.some((s) => s.skillId === entry.skillId));
  if (careers.length > 0) {
    return `可从事 ${careers.slice(0, 3).map((c) => c.name).join('、')} 等`;
  }
  return entry.description;
}

// ============ 用户亲和度（判断哪个技能对用户更友好）============

function userAffinity(
  entry: LearningResourceEntry,
  context: UserContext
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const userSkills = toUserSkillContext(context);

  // 已满足的前置条件
  if (entry.prerequisites.length > 0) {
    const metPrereqs = entry.prerequisites.filter((p) =>
      userSkills.some((s) => s.skillId === p && s.level >= 1)
    );
    score += metPrereqs.length * 20;
    if (metPrereqs.length > 0) {
      reasons.push(`已满足 ${metPrereqs.length}/${entry.prerequisites.length} 个前置条件`);
    } else {
      reasons.push(`尚不满足任何前置条件（共 ${entry.prerequisites.length} 个）`);
    }
  } else {
    reasons.push('无前置条件，可直接入门');
  }

  // 已学的相关技能
  const metRelated = entry.relatedSkills.filter((r) =>
    userSkills.some((s) => s.skillId === r)
  );
  if (metRelated.length > 0) {
    score += metRelated.length * 10;
    reasons.push(`已学 ${metRelated.length} 个相关技能`);
  }

  // 同方向基础
  const sameCat = context.skills.filter((s) => s.category === entry.category);
  if (sameCat.length > 0) {
    score += sameCat.length * 5;
    reasons.push(`有 ${sameCat.length} 个同方向（${entry.category}）技能基础`);
  }

  // 已在学习
  const existing = getUserSkill(context, entry.skillId);
  if (existing) {
    score += 30;
    reasons.push(`你已在学习（Lv.${existing.level}）`);
  }

  return { score, reasons };
}

// ============ 意图识别 ============

type Intent =
  | 'compare'
  | 'recommend'
  | 'career'
  | 'prereq'
  | 'time'
  | 'direction'
  | 'learn'
  | 'generic';

const RE_LEARN_KW = [
  '怎么学', '如何学', '怎样学', '怎么开始', '如何开始', '入门',
  '从哪开始', '从哪学', '学习路径', '学习路线', '学习顺序', '怎么入门',
];
const RE_ROUTE_KW = ['路线', '方向', '路径', '技术栈', '技术路线'];
const RE_RECOMMEND_KW = [
  '推荐我学', '接下来学', '该学什么', '学什么好', '下一步',
  '建议我学', '不知道学什么', '推荐学什么',
];
const RE_CAREER_KW = [
  '职业方向', '能做什么', '就业', '找工作', '做什么工作', '前景', '薪资', '赚钱', '职位',
];
const RE_PREREQ_KW = [
  '能学', '可以学', '能不能学', '需要什么基础', '基础要求',
  '前置', '前提', '先学什么', '先学哪些', '有什么基础',
];
const RE_TIME_KW = [
  '多久', '多长时间', '难吗', '难度', '多难', '容易吗', '费时', '好学吗', '简单吗', '要学多久',
];
const RE_COMPARE_KW = ['还是', 'vs', '对比', '比较', '哪个好', '选哪个'];

function hasAny(q: string, kws: string[]): boolean {
  return kws.some((k) => q.includes(k));
}

// 方向定义
type DirectionDef = { name: string; careerIds: string[]; match: (q: string) => boolean };

// 匹配独立的 "ai"（前后非英文字母），避免误匹配 available 等
function isAiWord(q: string): boolean {
  return /(^|[^a-z])ai([^a-z]|$)/i.test(q);
}

const DIRECTIONS: DirectionDef[] = [
  { name: '前端', careerIds: ['frontend-engineer'], match: (q) => q.includes('前端') || q.includes('网页开发') || q.includes('web前端') },
  { name: '后端', careerIds: ['backend-engineer', 'java-backend', 'go-backend'], match: (q) => q.includes('后端') || q.includes('服务端') },
  {
    name: '人工智能',
    careerIds: ['ai-engineer', 'llm-engineer'],
    match: (q) =>
      q.includes('人工智能') ||
      q.includes('机器学习方向') ||
      q.includes('深度学习方向') ||
      q.includes('大模型方向') ||
      q.includes('llm方向') ||
      (isAiWord(q) && (hasAny(q, RE_LEARN_KW) || hasAny(q, RE_ROUTE_KW))),
  },
  {
    name: '数据分析',
    careerIds: ['data-analyst', 'data-engineer'],
    match: (q) => q.includes('数据分析方向') || q.includes('数据方向') || q.includes('大数据方向') || q.includes('数据工程'),
  },
  {
    name: '运维/DevOps',
    careerIds: ['devops-engineer', 'cloud-engineer', 'it-ops-engineer'],
    match: (q) => q.includes('运维') || /devops/i.test(q) || q.includes('云计算方向'),
  },
  {
    name: '移动开发',
    careerIds: ['mobile-developer'],
    match: (q) => q.includes('移动开发') || q.includes('移动端') || q.includes('app开发') || q.includes('安卓开发') || q.includes('苹果开发'),
  },
  {
    name: '网络安全',
    careerIds: ['security-engineer', 'network-security-specialist'],
    match: (q) => q.includes('安全方向') || q.includes('网络安全方向') || q.includes('渗透方向'),
  },
  { name: '游戏开发', careerIds: ['game-developer'], match: (q) => q.includes('游戏开发') || q.includes('游戏方向') },
  { name: '区块链', careerIds: ['blockchain-engineer'], match: (q) => q.includes('区块链方向') || q.includes('web3方向') },
  {
    name: '嵌入式/物联网',
    careerIds: ['embedded-engineer'],
    match: (q) => q.includes('嵌入式方向') || q.includes('物联网方向') || q.includes('iot方向') || q.includes('硬件方向'),
  },
  {
    name: '网络工程',
    careerIds: ['network-engineer', 'datacom-engineer', 'network-architect'],
    match: (q) => q.includes('网络工程') || q.includes('数通') || q.includes('网络方向'),
  },
  {
    name: '项目管理',
    careerIds: ['product-manager', 'technical-project-manager'],
    match: (q) => q.includes('项目管理方向') || q.includes('产品经理方向') || q.includes('pmp方向'),
  },
];

function detectDirection(q: string): DirectionDef | undefined {
  return DIRECTIONS.find((d) => d.match(q));
}

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();

  // 1. 比较：需要比较关键词 + 至少 2 个技能
  if (hasAny(lower, RE_COMPARE_KW)) {
    const skills = findSkillsInText(q);
    if (skills.length >= 2) return 'compare';
  }

  // 2. 推荐
  if (hasAny(lower, RE_RECOMMEND_KW)) return 'recommend';
  // 含 "推荐" 但没有提到具体技能时也算推荐
  if (q.includes('推荐') && !findSkillInText(q)) return 'recommend';

  // 3. 职业
  if (hasAny(lower, RE_CAREER_KW)) return 'career';

  // 4. 前置/基础
  if (hasAny(lower, RE_PREREQ_KW)) return 'prereq';

  // 5. 时间/难度
  if (hasAny(lower, RE_TIME_KW)) return 'time';

  // 6. 方向路线：方向关键词 + (学习词 或 路线词 或 "学什么")
  const dir = detectDirection(lower);
  if (dir && (hasAny(lower, RE_LEARN_KW) || hasAny(lower, RE_ROUTE_KW) || q.includes('学什么'))) {
    return 'direction';
  }

  // 7. 学某技能
  if (hasAny(lower, RE_LEARN_KW)) return 'learn';

  // 8. 通用
  return 'generic';
}

// ============ 各意图处理函数 ============

// 1. "怎么学X" / "如何学X" / "X入门"
function handleLearn(context: UserContext, entry: LearningResourceEntry): ChatMessage {
  const userSkill = getUserSkill(context, entry.skillId);
  const userLevel = userSkill ? userSkill.level : 0;
  const lines: string[] = [];

  lines.push(
    `**${entry.skillName}** 属于「${entry.category}」方向，难度：**${entry.difficulty}**，预计学习时间 **${entry.estimatedTime}**。`
  );
  if (entry.description) lines.push(`> ${entry.description}`);

  if (entry.learningPath.length > 0) {
    lines.push('');
    lines.push('📚 学习路径：');
    entry.learningPath.forEach((phase, i) => {
      lines.push(`${i + 1}. **${phase.phase}** — ${phase.goal}`);
    });
  }

  if (userSkill) {
    const phaseIdx = Math.min(
      userLevel >= 5 ? entry.learningPath.length - 1 : userLevel >= 2 ? 1 : 0,
      Math.max(0, entry.learningPath.length - 1)
    );
    const continuePhase = entry.learningPath[phaseIdx];
    lines.push('');
    lines.push(
      `✅ 你目前 ${entry.skillName} 水平为 **Lv.${userLevel}**，建议从「${continuePhase ? continuePhase.phase : '下一阶段'}」继续深入。`
    );
  } else if (entry.prerequisites.length > 0) {
    const unmet = entry.prerequisites.filter((p) => !getUserSkill(context, p));
    if (unmet.length > 0) {
      lines.push('');
      lines.push(`⚠️ 建议先具备基础：${unmet.map(skillNameOf).join('、')}（可帮助你更快上手）`);
    }
  }

  const resources = pickResources(entry, userLevel, 3);
  if (resources.length > 0) {
    lines.push('');
    lines.push('🔗 推荐资源：');
    resources.forEach((r) => lines.push(`- [${r.title}](${r.url})`));
  }

  const relatedSkills = entry.relatedSkills.slice(0, 5);
  const suggestions = relatedSkills.map(skillNameOf).filter((n) => n && n !== entry.skillId);

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// 2. "X和Y选哪个" / "X还是Y" / "X vs Y"
function handleCompare(
  context: UserContext,
  a: LearningResourceEntry,
  b: LearningResourceEntry
): ChatMessage {
  const affA = userAffinity(a, context);
  const affB = userAffinity(b, context);
  const diffA = getSkillDifficultyNum(a.skillId);
  const diffB = getSkillDifficultyNum(b.skillId);
  // 综合分：亲和度 - 难度惩罚
  const scoreA = affA.score - diffA * 5;
  const scoreB = affB.score - diffB * 5;

  const lines: string[] = [];
  lines.push(`**${a.skillName}** vs **${b.skillName}** 对比：`);
  lines.push('');
  lines.push(`| 维度 | ${a.skillName} | ${b.skillName} |`);
  lines.push(`| --- | --- | --- |`);
  lines.push(`| 分类 | ${a.category} | ${b.category} |`);
  lines.push(`| 难度 | ${a.difficulty}（${diffA}/5） | ${b.difficulty}（${diffB}/5） |`);
  lines.push(`| 预计时间 | ${a.estimatedTime} | ${b.estimatedTime} |`);
  lines.push(`| 应用场景 | ${describeApplication(a)} | ${describeApplication(b)} |`);
  lines.push('');
  lines.push(`**你的基础情况：**`);
  lines.push(`- ${a.skillName}：${affA.reasons.join('；') || '暂无相关基础'}`);
  lines.push(`- ${b.skillName}：${affB.reasons.join('；') || '暂无相关基础'}`);
  lines.push('');

  let recommend: LearningResourceEntry;
  let reason: string;
  if (scoreA > scoreB) {
    recommend = a;
    reason = `${a.skillName} 与你已有技能更契合${diffA <= diffB ? '，且难度相对更低' : ''}`;
  } else if (scoreB > scoreA) {
    recommend = b;
    reason = `${b.skillName} 与你已有技能更契合${diffB <= diffA ? '，且难度相对更低' : ''}`;
  } else if (diffA <= diffB) {
    recommend = a;
    reason = `两者对你的友好度相当，但 ${a.skillName} 难度更低，更适合先上手`;
  } else {
    recommend = b;
    reason = `两者对你的友好度相当，但 ${b.skillName} 难度更低，更适合先上手`;
  }
  lines.push(`🎯 **推荐：先学 ${recommend.skillName}** —— ${reason}`);

  const other = recommend === a ? b : a;
  const resources = pickResources(recommend, 0, 2);
  const suggestions = [recommend.skillName, other.skillName];
  const relatedSkills = [recommend.skillId, other.skillId];

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// 3. "我现在的水平能学X吗" / "学X需要什么基础"
function handlePrereq(context: UserContext, entry: LearningResourceEntry): ChatMessage {
  const lines: string[] = [];

  // 无前置条件
  if (entry.prerequisites.length === 0) {
    lines.push(`**${entry.skillName}** 没有明确的前置条件，可以**零基础直接入门**。`);
    lines.push(`难度：${entry.difficulty}，预计时间：${entry.estimatedTime}。`);
    const resources = pickResources(entry, 0, 3);
    if (resources.length > 0) {
      lines.push('');
      lines.push('🔗 推荐资源：');
      resources.forEach((r) => lines.push(`- [${r.title}](${r.url})`));
    }
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions: [entry.skillName],
      relatedSkills: entry.relatedSkills.slice(0, 5),
      resources,
    };
  }

  const met: string[] = [];
  const unmet: string[] = [];
  const unmetEntries: LearningResourceEntry[] = [];
  entry.prerequisites.forEach((p) => {
    const us = getUserSkill(context, p);
    if (us && us.level >= 1) {
      met.push(`${skillNameOf(p)}（Lv.${us.level}）`);
    } else {
      unmet.push(skillNameOf(p));
      const e = getResourceBySkillId(p);
      if (e) unmetEntries.push(e);
    }
  });

  lines.push(`学习 **${entry.skillName}** 需要以下前置基础：`);
  lines.push('');
  if (met.length > 0) lines.push(`✅ **已满足：** ${met.join('、')}`);
  if (unmet.length > 0) lines.push(`❌ **未满足：** ${unmet.join('、')}`);
  lines.push('');

  const userSkill = getUserSkill(context, entry.skillId);

  // 已在学习
  if (userSkill) {
    lines.push(`你已在学习 ${entry.skillName}（Lv.${userSkill.level}），前置条件不再是障碍，继续加油！`);
    const resources = pickResources(entry, userSkill.level, 3);
    if (resources.length > 0) {
      lines.push('');
      lines.push('🔗 推荐资源：');
      resources.forEach((r) => lines.push(`- [${r.title}](${r.url})`));
    }
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions: [entry.skillName],
      relatedSkills: entry.relatedSkills.slice(0, 5),
      resources,
    };
  }

  // 有未满足的前置
  if (unmet.length > 0) {
    lines.push(`💡 建议先学 **${unmet[0]}**，再进入 ${entry.skillName} 的学习。`);
    const firstUnmet = unmetEntries[0];
    const resources = firstUnmet ? pickResources(firstUnmet, 0, 3) : [];
    if (resources.length > 0) {
      lines.push('');
      lines.push(`🔗 「${unmet[0]}」推荐资源：`);
      resources.forEach((r) => lines.push(`- [${r.title}](${r.url})`));
    }
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions: unmet,
      relatedSkills: entry.prerequisites,
      resources,
    };
  }

  // 全部满足且未在学习
  lines.push(`🎉 你的前置条件已全部满足，可以开始学习 **${entry.skillName}** 了！`);
  const resources = pickResources(entry, 0, 3);
  if (resources.length > 0) {
    lines.push('');
    lines.push('🔗 推荐资源：');
    resources.forEach((r) => lines.push(`- [${r.title}](${r.url})`));
  }
  const relatedSuggestions = entry.relatedSkills.slice(0, 2).map(skillNameOf);
  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions: [entry.skillName, ...relatedSuggestions],
    relatedSkills: entry.relatedSkills.slice(0, 5),
    resources,
  };
}

// 4. "X要学多久" / "X难吗" / "X难度"
function handleTimeDifficulty(context: UserContext, entry: LearningResourceEntry): ChatMessage {
  const diffNum = getSkillDifficultyNum(entry.skillId);
  const lines: string[] = [];
  lines.push(
    `**${entry.skillName}** 的难度为 **${entry.difficulty}**（${diffNum}/5），预计学习时间 **${entry.estimatedTime}**。`
  );

  // 根据用户已有相关技能调整估计
  const prereqMet = entry.prerequisites.filter((p) => getUserSkill(context, p));
  const relatedMet = entry.relatedSkills.filter((r) => getUserSkill(context, r));
  const totalBase = prereqMet.length + relatedMet.length;
  if (totalBase > 0) {
    const adjust = Math.min(30, totalBase * 10);
    const names = [...prereqMet, ...relatedMet].map(skillNameOf).join('、');
    lines.push('');
    lines.push(`⚡ 你已掌握 ${totalBase} 个相关/前置技能（${names}），实际学习时间可能缩短约 ${adjust}%。`);
  } else if (entry.prerequisites.length > 0) {
    lines.push('');
    lines.push(`⚠️ 该技能有 ${entry.prerequisites.length} 个前置条件尚未掌握，建议先打好基础，否则耗时可能更长。`);
  }

  lines.push('');
  if (diffNum <= 2) {
    lines.push('难度较低，适合新手入门，可以快速上手。');
  } else if (diffNum === 3) {
    lines.push('难度中等，需要一定练习，坚持即可掌握。');
  } else {
    lines.push('难度较高，需要投入较多时间与精力，建议分阶段学习。');
  }

  const resources = pickResources(entry, 0, 2);
  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions: [entry.skillName],
    relatedSkills: entry.relatedSkills.slice(0, 5),
    resources,
  };
}

// 5. "推荐我学什么" / "接下来学什么" / "该学什么"
function handleRecommend(context: UserContext): ChatMessage {
  const userSkills = toUserSkillContext(context);
  const lines: string[] = [];

  // 新手：无学习记录
  if (userSkills.length === 0) {
    const popular = ['python', 'javascript', 'html-css', 'git', 'prompt-engineering']
      .map(getResourceBySkillId)
      .filter((e): e is LearningResourceEntry => !!e);
    lines.push('你还没有学习记录，为你推荐以下热门入门技能：');
    lines.push('');
    popular.slice(0, 5).forEach((e, i) => {
      lines.push(`${i + 1}. **${e.skillName}**（${e.category}，${e.difficulty}，${e.estimatedTime}）`);
      lines.push(`   ${e.description}`);
    });
    const suggestions = popular.slice(0, 5).map((e) => e.skillName);
    const relatedSkills = popular.slice(0, 5).map((e) => e.skillId);
    const resources = popular.slice(0, 2).flatMap((e) => pickResources(e, 0, 1));
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions,
      relatedSkills,
      resources,
    };
  }

  const recs = getRecommendations(userSkills);

  // 已掌握得很全面
  if (recs.length === 0) {
    lines.push('你已掌握的技能已经相当全面了！可以考虑向架构师方向发展，或学习一些跨领域的软技能（如沟通协作、技术写作）。');
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions: ['系统设计', '沟通协作'],
      relatedSkills: ['system-design', 'communication'],
    };
  }

  lines.push('根据你当前的技能图谱，推荐你接下来学习：');
  lines.push('');
  const top = recs.slice(0, 5);
  top.forEach((r, i) => {
    const e = r.entry;
    lines.push(`${i + 1}. **${e.skillName}**（${e.category}，${e.difficulty}，${e.estimatedTime}）`);
    const reasons = r.matchReasons.map((x) =>
      x.toLowerCase().includes('unfinished') ? '你已在学习，建议继续深入' : x
    );
    if (reasons.length > 0) {
      lines.push(`   理由：${reasons.join('；')}`);
    } else {
      lines.push(`   ${e.description}`);
    }
  });

  const suggestions = top.map((r) => r.entry.skillName);
  const relatedSkills = top.map((r) => r.entry.skillId);
  const resources = top.slice(0, 2).flatMap((r) => pickResources(r.entry, 0, 1));

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// 6. "X的职业方向" / "学X能做什么" / "X就业"
function handleCareer(context: UserContext, entry: LearningResourceEntry): ChatMessage {
  const lines: string[] = [];
  const careers = DEFAULT_CAREERS.filter((c) => c.skills.some((s) => s.skillId === entry.skillId));

  if (careers.length === 0) {
    lines.push(`暂未找到明确需要 **${entry.skillName}** 的职业方向。不过它属于「${entry.category}」，可作为该方向的重要基础。`);
    const related = entry.relatedSkills.slice(0, 5);
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
      suggestions: related.map(skillNameOf),
      relatedSkills: related,
    };
  }

  // 按 importance 排序
  const mapped = careers.flatMap((c) => {
    const req = c.skills.find((s) => s.skillId === entry.skillId);
    return req ? [{ career: c, req }] : [];
  });
  mapped.sort((a, b) => IMPORTANCE_ORDER[a.req.importance] - IMPORTANCE_ORDER[b.req.importance]);

  lines.push(`掌握 **${entry.skillName}** 后，可从事以下职业方向：`);
  lines.push('');
  const userSkill = getUserSkill(context, entry.skillId);
  mapped.slice(0, 6).forEach(({ career, req }) => {
    let meetTag: string;
    if (userSkill && userSkill.level >= req.requiredLevel) {
      meetTag = '✅ 已达标';
    } else if (userSkill) {
      meetTag = `⏳ 当前 Lv.${userSkill.level}/需 Lv.${req.requiredLevel}`;
    } else {
      meetTag = `🎯 需 Lv.${req.requiredLevel}`;
    }
    const impText = req.importance === 'core' ? '核心' : req.importance === 'important' ? '重要' : '加分';
    lines.push(`- **${career.name}**（${career.avgSalary}）— ${impText}技能，${meetTag}`);
  });

  // 推荐主攻方向
  const top = mapped[0];
  lines.push('');
  lines.push(`💡 推荐主攻方向：**${top.career.name}**（${top.career.avgSalary}），需要 ${entry.skillName} 达到 Lv.${top.req.requiredLevel}。`);
  const otherCore = top.career.skills.filter(
    (s) => s.skillId !== entry.skillId && s.importance === 'core'
  ).slice(0, 4);
  if (otherCore.length > 0) {
    lines.push(`   同时建议学习：${otherCore.map((s) => skillNameOf(s.skillId)).join('、')}`);
  }

  const suggestions = [entry.skillName, ...otherCore.map((s) => skillNameOf(s.skillId))];
  const relatedSkills = [entry.skillId, ...otherCore.map((s) => s.skillId)];
  const resources = pickResources(entry, userSkill ? userSkill.level : 0, 2);

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// 7. "前端怎么学" / "后端路线" / "AI方向" 等方向性问题
function handleDirection(context: UserContext, dir: DirectionDef): ChatMessage {
  const lines: string[] = [];
  lines.push(`**${dir.name}** 方向的学习路线：`);

  // 取主职业的 learningPath 作为推荐顺序
  const careers = dir.careerIds
    .map((id) => DEFAULT_CAREERS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  if (careers.length === 0) {
    lines.push('暂无该方向的详细路线数据，可尝试询问具体技能（如「Python 怎么学」）。');
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
    };
  }

  const primary = careers[0];
  const path = primary.learningPath;
  lines.push(`参考职业「${primary.name}」（薪资 ${primary.avgSalary}）的推荐顺序：`);
  lines.push('');

  let learnedCount = 0;
  path.forEach((skillId, i) => {
    const us = getUserSkill(context, skillId);
    const name = skillNameOf(skillId);
    const res = getResourceBySkillId(skillId);
    const diff = res ? res.difficulty : '—';
    const time = res ? res.estimatedTime : '';
    const mark = us ? `✅ Lv.${us.level}` : '⬜ 未学';
    if (us) learnedCount++;
    const extra = time ? `，${diff}，${time}` : diff !== '—' ? `，${diff}` : '';
    lines.push(`${i + 1}. ${mark} **${name}**${extra}`);
  });

  lines.push('');
  lines.push(`📊 你的进度：${learnedCount}/${path.length}`);

  // 推荐下一个未学的核心技能
  const nextSkillId = path.find((id) => !getUserSkill(context, id));
  const suggestions: string[] = [];
  const relatedSkills: string[] = [];
  let resources: { title: string; url: string }[] = [];

  if (nextSkillId) {
    const nextRes = getResourceBySkillId(nextSkillId);
    const extra = nextRes ? `（${nextRes.difficulty}，${nextRes.estimatedTime}）` : '';
    lines.push(`🎯 建议下一步学习：**${skillNameOf(nextSkillId)}**${extra}`);
    suggestions.push(skillNameOf(nextSkillId));
    relatedSkills.push(nextSkillId);
    if (nextRes) resources = pickResources(nextRes, 0, 2);
  } else {
    // 该方向核心技能已全部学完
    lines.push('🎉 该方向核心技能你已基本掌握，可考虑向高级岗位或架构方向发展！');
    const advanced = careers.slice(1, 3);
    if (advanced.length > 0) {
      lines.push(`进阶方向：${advanced.map((c) => c.name).join('、')}`);
      advanced.forEach((c) => suggestions.push(c.name));
    }
  }

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// 8. 通用回答：无法识别意图时，用 smartSearch 搜索关键词
function handleGeneric(question: string, context: UserContext): ChatMessage {
  const userSkills = toUserSkillContext(context);
  const results = smartSearch(question, userSkills);
  const lines: string[] = [];

  if (results.length === 0) {
    lines.push('抱歉，我在本地知识库中没找到与你的问题直接匹配的内容。');
    lines.push('你可以试试这样问：');
    lines.push('- 「Python 怎么学」');
    lines.push('- 「前端 怎么学」');
    lines.push('- 「Python 和 Java 选哪个」');
    lines.push('- 「学 React 需要什么基础」');
    lines.push('- 「推荐我学什么」');
    return {
      role: 'assistant',
      content: lines.join('\n'),
      timestamp: Date.now(),
    };
  }

  const top = results.slice(0, 3);
  lines.push('根据你的问题，找到以下相关技能：');
  lines.push('');
  top.forEach((r, i) => {
    const e = r.entry;
    const us = getUserSkill(context, e.skillId);
    const tag = us ? `（你已 Lv.${us.level}）` : '';
    lines.push(`${i + 1}. **${e.skillName}**（${e.category}，${e.difficulty}，${e.estimatedTime}）${tag}`);
    lines.push(`   ${e.description}`);
    if (r.matchReasons.length > 0) {
      lines.push(`   匹配：${r.matchReasons.join('、')}`);
    }
  });

  const best = top[0].entry;
  const bestUserSkill = getUserSkill(context, best.skillId);
  const resources = pickResources(best, bestUserSkill ? bestUserSkill.level : 0, 2);
  const suggestions = top.map((r) => r.entry.skillName);
  const relatedSkills = top.flatMap((r) => r.entry.relatedSkills).slice(0, 5);

  return {
    role: 'assistant',
    content: lines.join('\n'),
    timestamp: Date.now(),
    suggestions,
    relatedSkills,
    resources,
  };
}

// ============ 主入口 ============

/**
 * 根据用户问题与上下文生成本地回答
 */
export function generateResponse(question: string, context: UserContext): ChatMessage {
  const intent = detectIntent(question);
  let response: ChatMessage;

  switch (intent) {
    case 'compare': {
      const skills = findSkillsInText(question);
      if (skills.length >= 2) response = handleCompare(context, skills[0], skills[1]);
      else {
        const single = findSkillInText(question);
        response = single ? handleLearn(context, single) : handleGeneric(question, context);
      }
      break;
    }
    case 'recommend':
      response = handleRecommend(context);
      break;
    case 'career': {
      const skill = findSkillInText(question);
      response = skill ? handleCareer(context, skill) : handleGeneric(question, context);
      break;
    }
    case 'prereq': {
      const skill = findSkillInText(question);
      response = skill ? handlePrereq(context, skill) : handleGeneric(question, context);
      break;
    }
    case 'time': {
      const skill = findSkillInText(question);
      response = skill ? handleTimeDifficulty(context, skill) : handleGeneric(question, context);
      break;
    }
    case 'direction': {
      const dir = detectDirection(question.toLowerCase());
      response = dir ? handleDirection(context, dir) : handleGeneric(question, context);
      break;
    }
    case 'learn': {
      const skill = findSkillInText(question);
      response = skill ? handleLearn(context, skill) : handleGeneric(question, context);
      break;
    }
    case 'generic':
    default:
      response = handleGeneric(question, context);
      break;
  }

  // 添加自然语气的开场白和结束语
  const greeting = getRandom(GREETINGS);
  const signOff = getRandom(SIGN_OFFS);
  response.content = `${greeting}\n\n${response.content}${signOff}`;

  return response;
}

/**
 * 根据用户当前状态生成 3-4 个快捷问题
 */
export function getQuickQuestions(context: UserContext): string[] {
  if (context.skills.length === 0) {
    return ['Python 怎么学', '前端 怎么学', '推荐我学什么', '学 Git 需要什么基础'];
  }

  // 选水平最高/经验最多的技能
  const sorted = [...context.skills].sort(
    (a, b) => b.level - a.level || b.totalExp - a.totalExp
  );
  const top = sorted[0];
  const second = sorted[1];

  const questions: string[] = [];
  questions.push(`${top.name}接下来学什么`);
  questions.push(`${top.name}能做什么工作`);
  if (second) {
    questions.push(`${top.name}和${second.name}选哪个`);
    questions.push('推荐我学什么');
  } else {
    questions.push(`${top.name}要学多久`);
    questions.push(`学${top.name}需要什么基础`);
  }
  return questions.slice(0, 4);
}