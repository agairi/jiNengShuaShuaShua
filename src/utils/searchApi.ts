// 全网搜索API服务层
// 支持多种搜索源：免费（Wikipedia/GitHub/StackExchange）+ 付费（SerpApi/Google Custom Search）

export type SearchSource = 'wikipedia' | 'github' | 'stackexchange' | 'serpapi' | 'google' | 'custom';

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: SearchSource;
  sourceLabel: string;
  icon: string;
  category?: string;
}

export interface ApiConfig {
  serpApiKey?: string;
  googleApiKey?: string;
  googleCx?: string;
  customApiUrl?: string;
  enabledSources: SearchSource[];
}

export const DEFAULT_ENABLED_SOURCES: SearchSource[] = ['wikipedia', 'github', 'stackexchange'];

export const SEARCH_SOURCE_INFO: Record<SearchSource, { label: string; icon: string; free: boolean; description: string }> = {
  wikipedia: { label: 'Wikipedia', icon: '📚', free: true, description: '维基百科，获取技术概念的权威定义' },
  github: { label: 'GitHub', icon: '🐙', free: true, description: '搜索开源项目和代码仓库' },
  stackexchange: { label: 'StackExchange', icon: '💬', free: true, description: '技术问答社区，找解决方案' },
  serpapi: { label: 'SerpApi', icon: '🔍', free: false, description: 'Google搜索结果（需API Key）' },
  google: { label: 'Google CSE', icon: '🌐', free: false, description: 'Google自定义搜索引擎（需API Key）' },
  custom: { label: '自定义API', icon: '⚙️', free: false, description: '自定义搜索API端点' },
};

// Wikipedia API 搜索
async function searchWikipedia(query: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://zh.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results: WebSearchResult[] = [];
    if (data?.query?.search) {
      for (const item of data.query.search) {
        // 去掉HTML标签
        const cleanSnippet = item.snippet
          .replace(/<[^>]*>/g, '')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        results.push({
          title: item.title,
          url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          snippet: cleanSnippet.slice(0, 200) + '...',
          source: 'wikipedia',
          sourceLabel: 'Wikipedia',
          icon: '📚',
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// GitHub API 搜索仓库
async function searchGitHub(query: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`;
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results: WebSearchResult[] = [];
    if (data?.items) {
      for (const item of data.items) {
        results.push({
          title: item.full_name,
          url: item.html_url,
          snippet: `${item.description || '暂无描述'} ⭐${item.stargazers_count}`,
          source: 'github',
          sourceLabel: 'GitHub',
          icon: '🐙',
          category: item.language,
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// Stack Exchange API 搜索
async function searchStackExchange(query: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&filter=!nNPvSNdWme&pagesize=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const results: WebSearchResult[] = [];
    if (data?.items) {
      for (const item of data.items) {
        results.push({
          title: item.title,
          url: item.link,
          snippet: `${item.answer_count}个回答 · ${item.score}分`,
          source: 'stackexchange',
          sourceLabel: 'Stack Overflow',
          icon: '💬',
          category: item.tags?.slice(0, 3).join(', '),
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// SerpApi 搜索
async function searchSerpApi(query: string, apiKey: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query + ' 教程')}&engine=google&hl=zh-cn&gl=cn&api_key=${apiKey}&num=8`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('SerpApi request failed');
    const data = await res.json();
    const results: WebSearchResult[] = [];
    if (data?.organic_results) {
      for (const item of data.organic_results) {
        results.push({
          title: item.title,
          url: item.link,
          snippet: item.snippet || '',
          source: 'serpapi',
          sourceLabel: 'Google',
          icon: '🔍',
          category: item.source,
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// Google Custom Search API
async function searchGoogleCSE(query: string, apiKey: string, cx: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query + ' 教程')}&key=${apiKey}&cx=${cx}&num=8&hl=zh-CN`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Google CSE request failed');
    const data = await res.json();
    const results: WebSearchResult[] = [];
    if (data?.items) {
      for (const item of data.items) {
        results.push({
          title: item.title,
          url: item.link,
          snippet: item.snippet || '',
          source: 'google',
          sourceLabel: 'Google搜索',
          icon: '🌐',
        });
      }
    }
    return results;
  } catch {
    return [];
  }
}

// 自定义API
async function searchCustom(query: string, apiUrl: string): Promise<WebSearchResult[]> {
  try {
    const res = await fetch(`${apiUrl}${apiUrl.includes('?') ? '&' : '?'}q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    const results: WebSearchResult[] = [];
    // 兼容常见的搜索结果格式
    const items = data.results || data.items || data.data || [];
    for (const item of items.slice(0, 10)) {
      results.push({
        title: item.title || item.name || '未知',
        url: item.url || item.link || item.href || '#',
        snippet: item.snippet || item.description || item.content || '',
        source: 'custom',
        sourceLabel: '自定义',
        icon: '⚙️',
      });
    }
    return results;
  } catch {
    return [];
  }
}

/**
 * 执行全网搜索，并行请求所有已启用的搜索源
 */
export async function webSearch(query: string, config: ApiConfig): Promise<Record<string, WebSearchResult[]>> {
  const sources = config.enabledSources;
  const promises: Promise<{ source: SearchSource; results: WebSearchResult[] }>[] = [];

  if (sources.includes('wikipedia')) {
    promises.push(searchWikipedia(query).then((r) => ({ source: 'wikipedia' as SearchSource, results: r })));
  }
  if (sources.includes('github')) {
    promises.push(searchGitHub(query).then((r) => ({ source: 'github' as SearchSource, results: r })));
  }
  if (sources.includes('stackexchange')) {
    promises.push(searchStackExchange(query).then((r) => ({ source: 'stackexchange' as SearchSource, results: r })));
  }
  if (sources.includes('serpapi') && config.serpApiKey) {
    promises.push(searchSerpApi(query, config.serpApiKey).then((r) => ({ source: 'serpapi' as SearchSource, results: r })));
  }
  if (sources.includes('google') && config.googleApiKey && config.googleCx) {
    promises.push(searchGoogleCSE(query, config.googleApiKey, config.googleCx).then((r) => ({ source: 'google' as SearchSource, results: r })));
  }
  if (sources.includes('custom') && config.customApiUrl) {
    promises.push(searchCustom(query, config.customApiUrl).then((r) => ({ source: 'custom' as SearchSource, results: r })));
  }

  const results = await Promise.all(promises);
  const grouped: Record<string, WebSearchResult[]> = {};
  for (const { source, results: items } of results) {
    if (items.length > 0) {
      grouped[source] = items;
    }
  }
  return grouped;
}

/**
 * 测试API连接是否正常
 */
export async function testApiConnection(source: SearchSource, config: ApiConfig): Promise<boolean> {
  try {
    const testQuery = 'test';
    if (source === 'wikipedia') {
      const r = await searchWikipedia(testQuery);
      return r.length > 0;
    }
    if (source === 'github') {
      const r = await searchGitHub(testQuery);
      return r.length > 0;
    }
    if (source === 'stackexchange') {
      const r = await searchStackExchange(testQuery);
      return r.length > 0;
    }
    if (source === 'serpapi' && config.serpApiKey) {
      const r = await searchSerpApi(testQuery, config.serpApiKey);
      return r.length > 0;
    }
    if (source === 'google' && config.googleApiKey && config.googleCx) {
      const r = await searchGoogleCSE(testQuery, config.googleApiKey, config.googleCx);
      return r.length > 0;
    }
    if (source === 'custom' && config.customApiUrl) {
      const r = await searchCustom('test', config.customApiUrl);
      return r.length > 0;
    }
    return false;
  } catch {
    return false;
  }
}
