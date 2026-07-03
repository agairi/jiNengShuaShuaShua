export type AiProvider = 'builtin' | 'ollama' | 'openai-compatible';

export type AiProviderConfig = {
  provider: AiProvider;
  ollamaBaseUrl: string;
  ollamaModel: string;
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  enabled: boolean;
};

export const DEFAULT_AI_CONFIG: AiProviderConfig = {
  provider: 'ollama',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'qwen2.5:7b',
  openaiBaseUrl: '',
  openaiApiKey: '',
  openaiModel: 'gpt-3.5-turbo',
  enabled: false,
};

export async function ollamaModels(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];
  } catch {
    return [];
  }
}

export async function testConnection(config: AiProviderConfig): Promise<boolean> {
  try {
    if (config.provider === 'builtin') {
      return true;
    }
    if (config.provider === 'ollama') {
      const res = await fetch(`${config.ollamaBaseUrl}/api/tags`);
      if (!res.ok) return false;
      const data = await res.json();
      return Array.isArray(data.models) && data.models.length >= 0;
    }
    if (config.provider === 'openai-compatible') {
      const res = await fetch(`${config.openaiBaseUrl}/models`, {
        headers: { Authorization: `Bearer ${config.openaiApiKey}` },
      });
      return res.ok;
    }
    return false;
  } catch {
    return false;
  }
}

export async function chatWithAi(
  messages: { role: string; content: string }[],
  config: AiProviderConfig,
  systemPrompt?: string,
): Promise<string> {
  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  if (config.provider === 'ollama') {
    const res = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollamaModel,
        messages: allMessages,
        stream: false,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ollama 请求失败: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.message?.content ?? '';
  }

  if (config.provider === 'openai-compatible') {
    const res = await fetch(`${config.openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: config.openaiModel,
        messages: allMessages,
      }),
    });
    if (!res.ok) {
      throw new Error(`OpenAI 兼容接口请求失败: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  throw new Error('不支持的 AI 提供者类型，无法发起对话');
}

export async function generateWithAi(
  prompt: string,
  config: AiProviderConfig,
  systemPrompt?: string,
): Promise<string> {
  return chatWithAi([{ role: 'user', content: prompt }], config, systemPrompt);
}
