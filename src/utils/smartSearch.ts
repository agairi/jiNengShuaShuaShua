/**
 * 本地智能搜索引擎
 * 支持自然语言查询、关联推荐、难度匹配、搜索结果排序
 */

import { LEARNING_RESOURCE_DB, type LearningResourceEntry } from '../data/learningResources';

// 搜索结果类型
export type SearchResult = {
  entry: LearningResourceEntry;
  score: number; // 匹配分数 0-100
  matchReasons: string[]; // 匹配原因
  recommendedPhase?: number; // 推荐从哪个阶段开始（基于用户水平）
};

// 用户技能上下文
export type UserSkillContext = {
  skillId: string;
  level: number;
  totalExp: number;
};

// 意图识别关键词映射
const INTENT_KEYWORDS: Record<string, string[]> = {
  'web前端': ['前端', '网页', '网站', 'web', 'frontend', '页面', 'html', 'css', 'javascript'],
  '后端开发': ['后端', '服务端', 'backend', 'server', 'api', '接口', '服务器'],
  '移动开发': ['移动', 'app', '手机', 'android', 'ios', 'flutter', '小程序'],
  '人工智能': ['ai', '人工智能', '机器学习', '深度学习', '神经网络', 'gpt', '大模型', 'llm', 'chatgpt'],
  '数据分析': ['数据分析', '数据可视化', '大数据', 'bi', '报表', '统计'],
  '运维': ['运维', 'devops', '部署', 'docker', 'k8s', '容器', 'ci/cd'],
  '数据库': ['数据库', 'database', 'sql', 'mysql', 'redis', 'mongo'],
  '网络安全': ['安全', '渗透', '漏洞', '加密', '黑客', '攻防'],
  '游戏开发': ['游戏', 'game', 'unity', 'unreal', '引擎'],
  '区块链': ['区块链', 'blockchain', '智能合约', 'web3', '以太坊', 'defi'],
  '嵌入式': ['嵌入式', '单片机', 'arduino', '树莓派', 'iot', '物联网', '硬件'],
  '算法面试': ['算法', '面试', '刷题', 'leetcode', '数据结构', '笔试'],
  '项目管理': ['项目管理', 'pmp', '敏捷', 'scrum', '需求'],
};

// 难度映射
const DIFFICULTY_MAP: Record<string, number> = {
  '入门': 1,
  '简单': 2,
  '中等': 3,
  '较难': 4,
  '困难': 5,
};

// 分词：将查询拆分为关键词
function tokenize(query: string): string[] {
  // 移除标点符号，转为小写
  const cleaned = query.toLowerCase().replace(/[，。、！？,.!?;:：；""''（）()\[\]{}]/g, ' ');
  // 按空格分词
  const tokens = cleaned.split(/\s+/).filter((t) => t.length > 0);
  // 如果没有空格（中文连续输入），尝试按2-3字切分
  if (tokens.length === 1 && tokens[0].length > 3) {
    const subTokens: string[] = [tokens[0]];
    for (let i = 0; i < tokens[0].length - 1; i++) {
      subTokens.push(tokens[0].substring(i, i + 2));
    }
    return subTokens;
  }
  return tokens;
}

// 计算字符串相似度（编辑距离的简化版）
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8;
  // 简单的字符级 Jaccard 相似度
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// 识别查询意图
function detectIntent(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const intents: string[] = [];
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        intents.push(intent);
        break;
      }
    }
  }
  return intents;
}

// 主搜索函数
export function smartSearch(
  query: string,
  userSkills?: UserSkillContext[]
): SearchResult[] {
  const tokens = tokenize(query);
  const intents = detectIntent(query);
  const results: SearchResult[] = [];

  for (const entry of LEARNING_RESOURCE_DB) {
    let score = 0;
    const reasons: string[] = [];

    // 1. 精确匹配 skillId
    if (tokens.some((t) => t.toLowerCase() === entry.skillId.toLowerCase())) {
      score += 40;
      reasons.push('ID精确匹配');
    }

    // 2. 匹配技能名称
    for (const token of tokens) {
      if (entry.skillName.toLowerCase().includes(token.toLowerCase())) {
        score += 30;
        if (!reasons.includes('名称匹配')) reasons.push('名称匹配');
      }
    }

    // 3. 匹配别名
    for (const alias of entry.aliases) {
      for (const token of tokens) {
        const sim = similarity(alias.toLowerCase(), token.toLowerCase());
        if (sim > 0.6) {
          score += Math.round(sim * 25);
          if (!reasons.includes('关键词匹配')) reasons.push('关键词匹配');
        }
      }
    }

    // 4. 匹配描述
    for (const token of tokens) {
      if (entry.description.toLowerCase().includes(token.toLowerCase())) {
        score += 10;
        if (!reasons.includes('描述相关')) reasons.push('描述相关');
      }
    }

    // 5. 匹配分类
    for (const token of tokens) {
      if (entry.category.toLowerCase().includes(token.toLowerCase())) {
        score += 15;
        if (!reasons.includes('分类相关')) reasons.push('分类相关');
      }
    }

    // 6. 意图匹配
    for (const intent of intents) {
      const intentKeywords = INTENT_KEYWORDS[intent] || [];
      // 如果技能的别名/名称/分类与意图关键词有交集
      const allText = (
        entry.skillName +
        ' ' +
        entry.category +
        ' ' +
        entry.aliases.join(' ')
      ).toLowerCase();
      for (const kw of intentKeywords) {
        if (allText.includes(kw.toLowerCase())) {
          score += 20;
          if (!reasons.includes(`属于「${intent}」方向`)) {
            reasons.push(`属于「${intent}」方向`);
          }
          break;
        }
      }
    }

    // 7. 用户技能上下文加权
    if (userSkills && userSkills.length > 0) {
      // 如果用户正在学这个技能，提高分数
      const userSkill = userSkills.find((s) => s.skillId === entry.skillId);
      if (userSkill) {
        score += 35;
        reasons.push('你正在学习');
      }

      // 如果是已学技能的相关技能，提高分数
      for (const userS of userSkills) {
        if (entry.prerequisites.includes(userS.skillId)) {
          score += 25;
          reasons.push('是你已学技能的进阶');
        }
        if (entry.relatedSkills.includes(userS.skillId)) {
          score += 20;
          reasons.push('与你已学技能相关');
        }
      }
    }

    if (score > 0) {
      // 根据用户水平推荐起始阶段
      let recommendedPhase = 0;
      if (userSkills) {
        const userSkill = userSkills.find((s) => s.skillId === entry.skillId);
        if (userSkill) {
          if (userSkill.level >= 5) recommendedPhase = 2;
          else if (userSkill.level >= 2) recommendedPhase = 1;
          else recommendedPhase = 0;
        }
      }

      results.push({
        entry,
        score: Math.min(100, score),
        matchReasons: reasons,
        recommendedPhase,
      });
    }
  }

  // 按分数排序
  results.sort((a, b) => b.score - a.score);
  return results;
}

// 获取推荐：基于用户已有技能推荐下一步学什么
export function getRecommendations(
  userSkills: UserSkillContext[]
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const entry of LEARNING_RESOURCE_DB) {
    let score = 0;
    const reasons: string[] = [];

    // 如果用户已经在学这个技能
    const existingSkill = userSkills.find((s) => s.skillId === entry.skillId);
    if (existingSkill) {
      // 低等级的技能优先推荐继续学
      if (existingSkill.level < 5) {
        score += 50 - existingSkill.level * 5;
        reasons.push('继续学习 unfinished');
      } else {
        continue; // 已经高等级了，不推荐
      }
    }

    // 检查前置条件满足度
    const prereqMet = entry.prerequisites.filter((prereqId) =>
      userSkills.some((s) => s.skillId === prereqId && s.level >= 1)
    );
    if (prereqMet.length > 0 && !existingSkill) {
      score += prereqMet.length * 20;
      reasons.push(`已满足${prereqMet.length}个前置条件`);
    }

    // 相关技能已学
    const relatedMet = entry.relatedSkills.filter((relatedId) =>
      userSkills.some((s) => s.skillId === relatedId)
    );
    if (relatedMet.length > 0 && !existingSkill) {
      score += relatedMet.length * 15;
      reasons.push('与你已学技能关联');
    }

    if (score > 0) {
      results.push({
        entry,
        score: Math.min(100, score),
        matchReasons: reasons,
        recommendedPhase: existingSkill
          ? existingSkill.level >= 3
            ? 1
            : 0
          : 0,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 10);
}

// 获取热门推荐
export function getPopularSkills(): LearningResourceEntry[] {
  const popularIds = [
    'python',
    'javascript',
    'react',
    'machine-learning',
    'llm',
    'go',
    'rust',
    'docker',
    'algorithms',
    'vue',
  ];
  return popularIds
    .map((id) => LEARNING_RESOURCE_DB.find((e) => e.skillId === id))
    .filter((e): e is LearningResourceEntry => e !== undefined);
}

// 根据技能 ID 获取学习资源
export function getResourceBySkillId(
  skillId: string
): LearningResourceEntry | undefined {
  return LEARNING_RESOURCE_DB.find((e) => e.skillId === skillId);
}
