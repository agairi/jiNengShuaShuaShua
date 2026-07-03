/**
 * 智能学习路线规划器引擎
 * 根据用户输入的学习目标（如"3个月转行前端"、"成为Python后端工程师"），
 * 自动生成完整的学习路线图。纯本地实现，不调用外部 API。
 */

import { DEFAULT_SKILLS, DEFAULT_CAREERS, SKILLS_WITH_META } from '../data/skillsAndCareers';
import { LEARNING_RESOURCE_DB } from '../data/learningResources';

// ============ 对外类型定义 ============

export type RoadmapPhase = {
  phase: number;
  name: string; // 阶段名称，如"第一阶段：基础入门"
  duration: string; // 预计时间，如"2-3周"
  goal: string; // 阶段目标
  skills: {
    // 该阶段要学的技能
    id: string;
    name: string;
    category: string;
    difficulty: string;
    reason: string; // 为什么要学这个
    resources: { title: string; url: string; type: string }[];
  }[];
  milestone: string; // 阶段里程碑，如"能独立写一个静态网页"
};

export type Roadmap = {
  title: string; // 路线标题
  description: string; // 路线描述
  totalDuration: string; // 总预计时间
  targetLevel: string; // 目标水平
  phases: RoadmapPhase[];
  finalProject: string; // 最终项目建议
  careerOptions: string[]; // 对应的职业方向
};

export type UserContext = {
  skillIds: string[]; // 已有技能ID
  skillLevels: Record<string, number>; // 技能ID -> 等级
};

export type ParsedGoal = {
  direction: string; // 方向名称
  directionLabel: string; // 中文标签
  duration?: string; // 时间限制
  level: '入门' | '转行' | '进阶';
  careerId?: string; // 匹配的职业ID
};

// ============ 内部类型 ============

type SkillRaw = (typeof DEFAULT_SKILLS)[number];
type SkillWithMeta = (typeof SKILLS_WITH_META)[number];
type Career = (typeof DEFAULT_CAREERS)[number];
type CareerSkill = Career['skills'][number];

type OrderedSkill = {
  skillId: string;
  importance: CareerSkill['importance'];
  learningPathIndex: number;
};

// ============ 常量映射 ============

// 难度数字 -> 中文标签
const DIFFICULTY_LABELS: Record<number, string> = {
  1: '入门',
  2: '简单',
  3: '中等',
  4: '较难',
  5: '困难',
};

// 技能基础信息查找表（name / category / description / color）
const SKILL_BASIC_MAP: Map<string, SkillRaw> = new Map(
  DEFAULT_SKILLS.map((s) => [s.id, s]),
);

// 技能元数据查找表（difficulty / skillType / expMethods / verification）
const SKILL_META_MAP: Map<string, SkillWithMeta> = new Map(
  SKILLS_WITH_META.map((s) => [s.id, s]),
);

// 学习资源查找表
const RESOURCE_MAP: Map<string, (typeof LEARNING_RESOURCE_DB)[number]> = new Map(
  LEARNING_RESOURCE_DB.map((r) => [r.skillId, r]),
);

// ============ 方向配置 ============

type DirectionConfig = {
  direction: string;
  directionLabel: string;
  keywords: string[];
  defaultCareerId: string;
  // 根据目标文本进一步精化匹配的职业
  refineCareer?: (goal: string) => string | undefined;
};

const DIRECTION_CONFIGS: DirectionConfig[] = [
  {
    direction: 'fullstack',
    directionLabel: '全栈方向',
    keywords: ['全栈', 'fullstack', '全栈工程师', '全栈开发'],
    defaultCareerId: 'fullstack-engineer',
  },
  {
    direction: 'mobile',
    directionLabel: '移动开发方向',
    keywords: ['移动开发', '移动端', '移端工程师', 'ios', 'android', 'app开发', '手机开发'],
    defaultCareerId: 'mobile-developer',
  },
  {
    direction: 'game',
    directionLabel: '游戏开发方向',
    keywords: ['游戏开发', '游戏引擎', 'unity', 'unreal', '游戏程序员'],
    defaultCareerId: 'game-developer',
  },
  {
    direction: 'blockchain',
    directionLabel: '区块链方向',
    keywords: ['区块链', 'blockchain', 'web3', '智能合约', '以太坊', 'solidity'],
    defaultCareerId: 'blockchain-engineer',
  },
  {
    direction: 'ai',
    directionLabel: 'AI方向',
    keywords: [
      'ai', '人工智能', '机器学习', '深度学习', '算法工程师', '数据科学家',
      '大模型', 'llm', 'chatgpt', 'aigc', '神经网络',
    ],
    defaultCareerId: 'ai-engineer',
    refineCareer: (goal) => {
      const g = goal.toLowerCase();
      if (
        g.includes('大模型') ||
        g.includes('大语言') ||
        g.includes('chatgpt') ||
        g.includes('prompt') ||
        g.includes('提示') ||
        g.includes('agent') ||
        g.includes('langchain') ||
        hasWord(goal, 'llm') ||
        hasWord(goal, 'gpt')
      ) {
        return 'llm-engineer';
      }
      return undefined;
    },
  },
  {
    direction: 'data',
    directionLabel: '数据方向',
    keywords: ['数据分析', '数据工程', '数据挖掘', 'bi', '数据仓库', 'etl'],
    defaultCareerId: 'data-analyst',
    refineCareer: (goal) => {
      const g = goal.toLowerCase();
      if (g.includes('工程') || g.includes('数据仓库') || g.includes('数据管道') || g.includes('spark') || g.includes('kafka') || hasWord(goal, 'etl')) {
        return 'data-engineer';
      }
      return undefined;
    },
  },
  {
    direction: 'security',
    directionLabel: '安全方向',
    keywords: ['网络安全', '渗透测试', '安全工程师', '信息安全', '攻防', '黑客', '漏洞'],
    defaultCareerId: 'security-engineer',
  },
  {
    direction: 'devops',
    directionLabel: '运维方向',
    keywords: ['运维', 'devops', 'sre', '运维工程师', '云计算', '容器', '部署'],
    defaultCareerId: 'devops-engineer',
  },
  {
    direction: 'backend',
    directionLabel: '后端方向',
    keywords: ['后端', '服务端', 'backend', '后端工程师', '服务端开发', 'java工程师', 'python后端', 'go工程师', '后端开发'],
    defaultCareerId: 'backend-engineer',
    refineCareer: (goal) => {
      const g = goal.toLowerCase();
      if (!g.includes('javascript') && (hasWord(goal, 'java') || g.includes('java工程师') || g.includes('java后端'))) {
        return 'java-backend';
      }
      if (hasWord(goal, 'go') || g.includes('golang') || g.includes('go工程师') || g.includes('go后端')) {
        return 'go-backend';
      }
      return undefined;
    },
  },
  {
    direction: 'frontend',
    directionLabel: '前端方向',
    keywords: ['前端', 'web前端', '网页', 'frontend', '前端工程师', '前端开发'],
    defaultCareerId: 'frontend-engineer',
  },
];

// 阶段名称与目标模板（最多 5 个阶段）
const PHASE_TEMPLATES = [
  { name: '第一阶段：基础入门', goal: '掌握基础语法与核心概念，建立编程思维与开发环境' },
  { name: '第二阶段：核心技能', goal: '掌握方向核心技能，能独立完成基础开发任务' },
  { name: '第三阶段：进阶实战', goal: '掌握进阶技术，完成完整项目实践' },
  { name: '第四阶段：综合应用', goal: '综合运用所学技能，构建生产级应用' },
  { name: '第五阶段：高级专题', goal: '深入高级主题，达到工程师求职水平' },
];

// 各方向里程碑模板（按阶段顺序）
const MILESTONE_TEMPLATES: Record<string, string[]> = {
  frontend: [
    '能独立写一个静态网页并部署上线',
    '能用 JavaScript 实现页面交互效果',
    '能用 React/Vue 开发完整前端应用',
    '能独立完成前后端联调与工程化配置',
    '达到前端工程师求职水平',
  ],
  backend: [
    '能编写基础程序并操作数据库',
    '能独立开发 RESTful API 接口',
    '能完成完整后端服务并对接数据库与缓存',
    '能完成微服务与容器化部署',
    '达到后端工程师求职水平',
  ],
  ai: [
    '掌握 Python 与数学基础',
    '能训练并评估经典机器学习模型',
    '能搭建深度学习模型并完成项目',
    '能完成端到端 AI 应用部署',
    '达到 AI 工程师求职水平',
  ],
  devops: [
    '掌握 Linux 与版本控制基础',
    '能完成 Docker 容器化与 CI/CD 流水线',
    '能管理 Kubernetes 集群与监控体系',
    '能完成云基础设施自动化',
    '达到 DevOps 工程师求职水平',
  ],
  fullstack: [
    '掌握前端基础与 JavaScript',
    '能开发 React 前端应用',
    '能开发 Node.js 后端 API',
    '能完成全栈项目与部署上线',
    '达到全栈工程师求职水平',
  ],
  security: [
    '掌握网络与 Linux 安全基础',
    '能进行 Web 漏洞分析与防御',
    '能完成渗透测试实战',
    '能搭建安全运维体系',
    '达到安全工程师求职水平',
  ],
  mobile: [
    '掌握 JavaScript 与移动开发基础',
    '能用 React Native 开发跨平台 App',
    '能完成原生开发与真机调试',
    '能完成完整移动应用上架',
    '达到移动开发工程师求职水平',
  ],
  data: [
    '掌握 Excel 与 SQL 数据查询',
    '能用 Python 进行数据分析',
    '能完成数据可视化与商业分析报告',
    '能搭建数据管道与工程化',
    '达到数据方向求职水平',
  ],
  game: [
    '掌握 C#/C++ 编程基础',
    '能用 Unity 开发简单游戏',
    '能完成完整游戏项目',
    '能掌握 Shader 与高级渲染',
    '达到游戏开发工程师求职水平',
  ],
  blockchain: [
    '掌握区块链与密码学基础',
    '能编写 Solidity 智能合约',
    '能开发去中心化应用(DApp)',
    '能完成 DeFi 协议开发',
    '达到区块链工程师求职水平',
  ],
  general: [
    '掌握编程基础与工具使用',
    '能完成基础项目实践',
    '能独立开发完整应用',
    '能完成工程化与部署',
    '达到工程师求职水平',
  ],
};

// 各方向最终项目建议
const FINAL_PROJECTS: Record<string, string> = {
  frontend: '独立开发一个完整的前端项目（如电商商城或个人博客系统），包含响应式布局、组件化开发、状态管理、路由、API 对接，并部署上线。',
  backend: '设计并实现一个完整的后端服务系统，包含数据库设计、RESTful API 开发、认证授权、缓存、日志与监控，并完成 Docker 容器化部署。',
  ai: '完成一个端到端的 AI 项目，包含数据采集与清洗、特征工程、模型训练与调优、模型评估，并使用 MLOps 完成模型部署与上线。',
  devops: '从零搭建一套 DevOps 体系，包含 CI/CD 流水线、Docker 容器化、Kubernetes 集群部署、监控告警与日志收集，并完成自动化运维脚本。',
  fullstack: '独立开发一个全栈应用（如任务管理系统或社交平台），包含前端 UI、后端 API、数据库、认证、部署，完成完整产品闭环。',
  security: '完成一个安全实战项目，包含渗透测试报告编写、漏洞复现与修复、安全加固方案，并搭建一套安全监控与应急响应体系。',
  mobile: '独立开发一款移动应用（如电商或社交 App），包含 UI 设计、数据存储、网络请求、真机调试，并完成应用商店上架流程。',
  data: '完成一个完整的数据分析项目，包含数据采集与清洗、多维分析、可视化大屏、商业洞察报告，并能用 SQL 和 Python 完成数据建模。',
  game: '独立开发一款完整的游戏 Demo，包含玩法设计、核心系统、UI 界面、音效特效，并完成打包发布。',
  blockchain: '开发一个完整的去中心化应用(DApp)，包含智能合约编写、前端 Web3 对接、测试网部署、安全审计，并完成主网发布。',
  general: '独立完成一个综合项目，将所学技能整合实践，包含需求分析、设计、编码、测试与部署，形成可展示的作品集。',
};

// 各方向相关职业（用于 careerOptions）
const RELATED_CAREERS: Record<string, string[]> = {
  frontend: ['前端开发工程师', '全栈开发工程师', '移动端开发工程师'],
  backend: ['后端开发工程师', 'Java 后端工程师', 'Go 后端工程师'],
  ai: ['AI 工程师', '大模型应用工程师', '数据分析师'],
  devops: ['DevOps 工程师', '云计算工程师', '系统运维工程师'],
  fullstack: ['全栈开发工程师', '前端开发工程师', '后端开发工程师'],
  security: ['网络安全工程师', '网络安全专家', '安全运维工程师'],
  mobile: ['移动端开发工程师', '前端开发工程师', '全栈开发工程师'],
  data: ['数据分析师', '数据工程师', '数据科学家'],
  game: ['游戏开发工程师', '客户端开发工程师', '图形渲染工程师'],
  blockchain: ['区块链工程师', '智能合约工程师', '后端开发工程师'],
  general: ['后端开发工程师', '前端开发工程师', '全栈开发工程师'],
};

// ============ 工具函数 ============

// 判断目标中是否包含某英文单词（按词边界，避免 ai/go/bi 等误匹配）
function hasWord(goal: string, word: string): boolean {
  return new RegExp(`\\b${word.toLowerCase()}\\b`, 'i').test(goal);
}

// 关键词匹配：短 ASCII 用词边界，其余用 includes
function matchKeyword(goal: string, keyword: string): boolean {
  const k = keyword.toLowerCase();
  if (/^[a-z0-9]{1,4}$/.test(k)) {
    return new RegExp(`\\b${k}\\b`, 'i').test(goal);
  }
  return goal.toLowerCase().includes(k);
}

// 提取时间限制（如"3个月"、"半年"、"一年"、"2周"）
function extractDuration(goal: string): string | undefined {
  const patterns: { re: RegExp; format: (m: RegExpMatchArray) => string }[] = [
    { re: /(\d+)\s*个?月/, format: (m) => `${m[1]}个月` },
    { re: /([一二三四五六七八九十]+)\s*个?月/, format: (m) => `${m[1]}个月` },
    { re: /半年/, format: () => '半年(6个月)' },
    { re: /(\d+)\s*周/, format: (m) => `${m[1]}周` },
    { re: /([一二三四五六七八九十]+)\s*周/, format: (m) => `${m[1]}周` },
    { re: /(\d+)\s*年/, format: (m) => `${m[1]}年` },
    { re: /([一二三四五六七八九十]+)\s*年/, format: (m) => `${m[1]}年` },
    { re: /一\s*年/, format: () => '1年' },
  ];
  for (const p of patterns) {
    const m = goal.match(p.re);
    if (m) return p.format(m);
  }
  return undefined;
}

// 识别目标水平
function detectLevel(goal: string): '入门' | '转行' | '进阶' {
  const g = goal.toLowerCase();
  if (g.includes('转行') || g.includes('转岗') || g.includes('换工作') || g.includes('跨行')) {
    return '转行';
  }
  if (g.includes('进阶') || g.includes('高级') || g.includes('提升') || g.includes('深入') || g.includes('精通') || g.includes('资深')) {
    return '进阶';
  }
  return '入门';
}

// ============ parseGoal：解析目标 ============

export function parseGoal(goal: string): ParsedGoal {
  const trimmed = goal.trim();
  const duration = extractDuration(trimmed);
  const level = detectLevel(trimmed);

  // 匹配方向
  let matched: DirectionConfig | undefined;
  for (const cfg of DIRECTION_CONFIGS) {
    if (cfg.keywords.some((kw) => matchKeyword(trimmed, kw))) {
      matched = cfg;
      break;
    }
  }

  if (!matched) {
    // 兜底：尝试匹配职业名
    const lower = trimmed.toLowerCase();
    const career = DEFAULT_CAREERS.find(
      (c) => lower.includes(c.name.toLowerCase().replace(/工程师$/, '')) || lower.includes(c.id),
    );
    if (career) {
      return {
        direction: 'general',
        directionLabel: '通用方向',
        duration,
        level,
        careerId: career.id,
      };
    }
    return {
      direction: 'general',
      directionLabel: '通用方向',
      duration,
      level,
    };
  }

  // 精化职业
  let careerId = matched.defaultCareerId;
  if (matched.refineCareer) {
    const refined = matched.refineCareer(trimmed);
    if (refined) careerId = refined;
  }

  return {
    direction: matched.direction,
    directionLabel: matched.directionLabel,
    duration,
    level,
    careerId,
  };
}

// ============ 资源获取 ============

// 从 LEARNING_RESOURCE_DB 获取某技能的入门学习资源（1-2 个）
function getResourcesForSkill(skillId: string): { title: string; url: string; type: string }[] {
  const entry = RESOURCE_MAP.get(skillId);
  if (!entry) return [];

  const collected: { title: string; url: string; type: string }[] = [];
  const others: { title: string; url: string; type: string }[] = [];

  for (const phase of entry.learningPath) {
    for (const r of phase.resources) {
      const item = { title: r.title, url: r.url, type: r.type };
      if (r.level === '入门') {
        collected.push(item);
      } else {
        others.push(item);
      }
    }
  }

  const result = collected.length > 0 ? collected : others;
  return result.slice(0, 2);
}

// ============ 时长估算与格式化 ============

// 难度对应的预计学习周数
function difficultyToWeeks(diff: number): number {
  switch (diff) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 6;
    case 5:
      return 8;
    default:
      return 3;
  }
}

// 将总周数格式化为易读的时长字符串
function formatDuration(weeks: number): string {
  if (weeks <= 0) return '1周';
  const lower = Math.max(1, Math.round(weeks * 0.9));
  const upper = Math.round(weeks * 1.1);
  if (upper < 4) {
    return lower === upper ? `${lower}周` : `${lower}-${upper}周`;
  }
  const lo = Math.max(1, Math.round(lower / 4));
  const hi = Math.max(lo, Math.round(upper / 4));
  return lo === hi ? `${lo}个月` : `${lo}-${hi}个月`;
}

// ============ 技能分组 ============

// 将技能按难度排序后均匀分成 3-5 个阶段（每阶段 2-5 个）
function chunkSkills(skills: OrderedSkill[]): OrderedSkill[][] {
  const count = skills.length;
  if (count === 0) return [];

  let numPhases: number;
  if (count <= 4) numPhases = Math.min(3, count);
  else if (count <= 8) numPhases = 3;
  else if (count <= 14) numPhases = 4;
  else numPhases = 5;

  const phases: OrderedSkill[][] = [];
  const base = Math.floor(count / numPhases);
  let remainder = count % numPhases;
  let idx = 0;
  for (let i = 0; i < numPhases; i++) {
    const size = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    phases.push(skills.slice(idx, idx + size));
    idx += size;
  }
  return phases.filter((p) => p.length > 0);
}

// 生成技能学习原因
function buildReason(
  importance: CareerSkill['importance'],
  description: string,
  careerName: string,
): string {
  if (importance === 'core') {
    return `作为${careerName}的核心技能，${description}。掌握后能够胜任该岗位的主要工作。`;
  }
  if (importance === 'important') {
    return `${description}。掌握后能显著提升你在${careerName}岗位上的综合能力与项目质量。`;
  }
  return `${description}。作为加分项拓展你的技能边界，提升求职竞争力。`;
}

// 生成路线描述
function buildDescription(parsed: ParsedGoal, career: Career, masteredCount: number): string {
  const durationPart = parsed.duration ? `目标周期：${parsed.duration}；` : '';
  const masteredPart =
    masteredCount > 0
      ? `已根据你掌握的 ${masteredCount} 项技能跳过基础阶段，`
      : '';
  const goalText =
    parsed.level === '转行'
      ? '成功转行'
      : parsed.level === '进阶'
        ? '进阶提升'
        : '从零入门';
  return `${durationPart}围绕「${career.name}」岗位所需技能体系，${masteredPart}按难度由浅入深分阶段规划，包含核心技能、进阶实战与综合项目，助你${goalText}。`;
}

// ============ generateRoadmap：生成学习路线 ============

export function generateRoadmap(goal: string, context?: UserContext): Roadmap {
  const parsed = parseGoal(goal);

  // 选定职业
  let career: Career | undefined;
  if (parsed.careerId) {
    career = DEFAULT_CAREERS.find((c) => c.id === parsed.careerId);
  }
  if (!career) {
    // 兜底：默认后端工程师
    career = DEFAULT_CAREERS.find((c) => c.id === 'backend-engineer');
  }
  // 理论上一定能找到，再兜底一次让 TS 收窄类型
  if (!career) {
    career = DEFAULT_CAREERS[0];
  }

  const direction = parsed.direction;
  const learningPath = career.learningPath;

  // 计算已掌握技能（用户等级 >= 职业要求等级则视为已掌握）
  const userLevels = context?.skillLevels ?? {};
  const masteredSkillIds = new Set<string>();
  if (context?.skillIds) {
    for (const sid of context.skillIds) {
      const req = career.skills.find((s) => s.skillId === sid);
      const lvl = userLevels[sid] ?? 0;
      if (req && lvl >= req.requiredLevel) {
        masteredSkillIds.add(sid);
      }
    }
  }

  // 构建有序技能列表（按 learningPath 顺序，过滤无数据技能与已掌握技能）
  const orderedSkills: OrderedSkill[] = [];
  for (const skillId of learningPath) {
    if (!SKILL_BASIC_MAP.has(skillId)) continue;
    if (masteredSkillIds.has(skillId)) continue;
    const careerSkill = career.skills.find((s) => s.skillId === skillId);
    if (!careerSkill) continue;
    orderedSkills.push({
      skillId,
      importance: careerSkill.importance,
      learningPathIndex: learningPath.indexOf(skillId),
    });
  }

  // 按 difficulty 排序（先易后难），同难度按 learningPath 顺序保持稳定
  orderedSkills.sort((a, b) => {
    const da = SKILL_META_MAP.get(a.skillId)?.difficulty ?? 3;
    const db = SKILL_META_MAP.get(b.skillId)?.difficulty ?? 3;
    if (da !== db) return da - db;
    return a.learningPathIndex - b.learningPathIndex;
  });

  // 全部已掌握的兜底：补充一个综合实战阶段
  const phases: RoadmapPhase[] = [];
  if (orderedSkills.length === 0) {
    phases.push({
      phase: 1,
      name: '第一阶段：综合实战',
      duration: '1-2个月',
      goal: '已掌握核心技能，通过项目实战巩固能力',
      skills: [],
      milestone: '完成一个综合项目，达到工程师求职水平',
    });
  } else {
    const chunks = chunkSkills(orderedSkills);
    chunks.forEach((chunk, i) => {
      const template = PHASE_TEMPLATES[i] ?? PHASE_TEMPLATES[PHASE_TEMPLATES.length - 1];
      const totalWeeks = chunk.reduce((sum, cs) => {
        const diff = SKILL_META_MAP.get(cs.skillId)?.difficulty ?? 3;
        return sum + difficultyToWeeks(diff);
      }, 0);

      const phaseSkills = chunk.map((cs) => {
        const basic = SKILL_BASIC_MAP.get(cs.skillId)!;
        const diff = SKILL_META_MAP.get(cs.skillId)?.difficulty ?? 3;
        return {
          id: cs.skillId,
          name: basic.name,
          category: basic.category,
          difficulty: DIFFICULTY_LABELS[diff] ?? '中等',
          reason: buildReason(cs.importance, basic.description, career!.name),
          resources: getResourcesForSkill(cs.skillId),
        };
      });

      const milestones = MILESTONE_TEMPLATES[direction] ?? MILESTONE_TEMPLATES.general;
      const milestone = milestones[i] ?? milestones[milestones.length - 1];

      phases.push({
        phase: i + 1,
        name: template.name,
        duration: formatDuration(totalWeeks),
        goal: template.goal,
        skills: phaseSkills,
        milestone,
      });
    });
  }

  // 总时长（基于所有未掌握技能的难度估算）
  const totalWeeks = orderedSkills.reduce((sum, cs) => {
    const diff = SKILL_META_MAP.get(cs.skillId)?.difficulty ?? 3;
    return sum + difficultyToWeeks(diff);
  }, 0);

  // 标题与目标水平
  const levelLabel =
    parsed.level === '转行'
      ? '转行就业'
      : parsed.level === '进阶'
        ? '进阶提升'
        : '入门到精通';
  const title = `${parsed.directionLabel.replace('方向', '')}${levelLabel}学习路线`;

  const targetLevel =
    parsed.level === '转行'
      ? '达到初级工程师水平，可胜任转行就业'
      : parsed.level === '进阶'
        ? '达到中高级工程师水平'
        : '达到初级工程师水平';

  const description = buildDescription(parsed, career, masteredSkillIds.size);
  const finalProject = FINAL_PROJECTS[direction] ?? FINAL_PROJECTS.general;
  const careerOptions = RELATED_CAREERS[direction] ?? RELATED_CAREERS.general;

  return {
    title,
    description,
    totalDuration: formatDuration(totalWeeks),
    targetLevel,
    phases,
    finalProject,
    careerOptions,
  };
}
