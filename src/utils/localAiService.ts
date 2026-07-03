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

export type AiStatus = 'offline' | 'connecting' | 'online' | 'error';

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

export async function testConnection(config: AiProviderConfig): Promise<{ success: boolean; error?: string; models?: string[] }> {
  try {
    if (config.provider === 'builtin') {
      return { success: true };
    }
    if (config.provider === 'ollama') {
      const res = await fetch(`${config.ollamaBaseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) {
        return { success: false, error: `Ollama 请求失败: ${res.status} ${res.statusText}` };
      }
      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];
      if (models.length === 0) {
        return { success: false, error: 'Ollama 已连接，但没有下载任何模型，请运行 `ollama pull qwen2.5:7b`' };
      }
      return { success: true, models };
    }
    if (config.provider === 'openai-compatible') {
      const res = await fetch(`${config.openaiBaseUrl}/models`, {
        headers: { Authorization: `Bearer ${config.openaiApiKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        return { 
          success: false, 
          error: `API 请求失败: ${res.status} ${res.statusText}${errData?.error?.message ? ` - ${errData.error.message}` : ''}` 
        };
      }
      const data = await res.json();
      const models = Array.isArray(data.data) ? data.data.map((m: { id: string }) => m.id) : [];
      return { success: true, models };
    }
    return { success: false, error: '不支持的 AI 提供者类型' };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      return { success: false, error: '连接超时，请检查服务是否正在运行' };
    }
    return { success: false, error: `连接失败: ${(err as Error).message || '未知错误'}` };
  }
}

export async function chatWithAi(
  messages: { role: string; content: string }[],
  config: AiProviderConfig,
  systemPrompt?: string,
  onProgress?: (chunk: string) => void,
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
        stream: !!onProgress,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error?.message || `Ollama 请求失败: ${res.status} ${res.statusText}`);
    }

    if (onProgress) {
      const reader = res.body?.getReader();
      if (!reader) {
        const data = await res.json();
        return data.message?.content ?? '';
      }
      const decoder = new TextDecoder();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.message?.content) {
                result += json.message.content;
                onProgress(json.message.content);
              }
            } catch {}
          }
        }
      }
      return result;
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
        stream: !!onProgress,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error?.message || `API 请求失败: ${res.status} ${res.statusText}`);
    }

    if (onProgress) {
      const reader = res.body?.getReader();
      if (!reader) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? '';
      }
      const decoder = new TextDecoder();
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                result += content;
                onProgress(content);
              }
            } catch {}
          }
        }
      }
      return result;
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
  onProgress?: (chunk: string) => void,
): Promise<string> {
  return chatWithAi([{ role: 'user', content: prompt }], config, systemPrompt, onProgress);
}
