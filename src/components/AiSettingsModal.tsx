import React, { useState, useEffect } from 'react';
import { X, Settings, Cpu, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Zap, ExternalLink, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { testConnection, ollamaModels, type AiProvider, type AiProviderConfig } from '../utils/localAiService';
import Modal from './Modal';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'fail';

const PROVIDER_INFO: Record<AiProvider, { label: string; desc: string; badge: string }> = {
  builtin: { label: '内置引擎', desc: '免费、无需安装、智能规则匹配', badge: 'free' },
  ollama: { label: 'Ollama 本地', desc: '本地大模型、免费、需安装Ollama', badge: 'free' },
  'openai-compatible': { label: '在线/兼容API', desc: '支持DeepSeek/硅基流动/LM Studio等', badge: 'api' },
};

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const { aiConfig, updateAiConfig } = useStore();
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [showTutorial, setShowTutorial] = useState(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const fetchModels = async (baseUrl?: string) => {
    const url = baseUrl || aiConfig.ollamaBaseUrl;
    setLoadingModels(true);
    const models = await ollamaModels(url);
    setModelList(models);
    setLoadingModels(false);
  };

  useEffect(() => {
    if (isOpen && aiConfig.provider === 'ollama') {
      fetchModels();
    }
  }, [isOpen, aiConfig.provider]);

  const handleTest = async () => {
    setTestStatus('testing');
    const ok = await testConnection(aiConfig);
    setTestStatus(ok ? 'success' : 'fail');
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const handleProviderChange = (provider: AiProvider) => {
    updateAiConfig({ provider });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<><Cpu size={20} /> AI 引擎设置</>}
      size="md"
      footer={<button className="btn-primary" onClick={onClose}>完成</button>}
    >
          {/* 总开关 */}
          <div className="settings-section">
            <div className="setting-row main-toggle">
              <div className="setting-info">
                <Cpu size={20} className="setting-icon" />
                <div>
                  <h3>AI 助手</h3>
                  <p>开启后可使用 AI 提供智能学习建议和讲解</p>
                </div>
              </div>
              <div className={`toggle-switch ${aiConfig.enabled ? 'on' : ''}`} onClick={() => updateAiConfig({ enabled: !aiConfig.enabled })}>
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>

          {/* 提供者选择 */}
          <div className="settings-section">
            <h4 className="section-title">AI引擎</h4>
            <div className="sources-list">
              {(Object.keys(PROVIDER_INFO) as AiProvider[]).map((provider) => {
                const info = PROVIDER_INFO[provider];
                const selected = aiConfig.provider === provider;
                return (
                  <div
                    key={provider}
                    className={`source-card ${selected ? 'enabled' : ''}`}
                    onClick={() => handleProviderChange(provider)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="source-header">
                      <div className="source-info">
                        <div>
                          <div className="source-name">
                            {info.label}
                            <span className={`badge ${info.badge}`}>{info.badge === 'free' ? '免费' : '需Key'}</span>
                          </div>
                          <p className="source-desc">{info.desc}</p>
                        </div>
                      </div>
                      <div className="source-actions">
                        <div className={`toggle-switch small ${selected ? 'on' : ''}`}>
                          <div className="toggle-thumb" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ollama 配置 */}
          {aiConfig.provider === 'ollama' && (
            <div className="settings-section">
              <h4 className="section-title">Ollama 配置</h4>
              <div className="source-config">
                <div className="config-field">
                  <label>Base URL</label>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={aiConfig.ollamaBaseUrl}
                    onChange={(e) => updateAiConfig({ ollamaBaseUrl: e.target.value })}
                  />
                  <span className="help-text">Ollama 默认运行在 11434 端口</span>
                </div>
                <div className="config-field">
                  <label>模型</label>
                  <div className="input-with-action">
                    <select
                      value={aiConfig.ollamaModel}
                      onChange={(e) => updateAiConfig({ ollamaModel: e.target.value })}
                    >
                      {modelList.length === 0 && (
                        <option value="">{loadingModels ? '加载中...' : '未发现模型'}</option>
                      )}
                      {modelList.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button className="copy-btn" onClick={() => fetchModels()} title="刷新模型列表">
                      <RefreshCw size={14} className={loadingModels ? 'spin' : ''} />
                    </button>
                  </div>
                  <span className="help-text">
                    安装模型: <code>ollama pull qwen2.5:7b</code>
                  </span>
                </div>
                <div className="config-field">
                  <div className="input-with-action" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                    <button className="test-btn" onClick={handleTest} disabled={testStatus === 'testing'}>
                      {testStatus === 'testing' ? '测试中...' : '测试连接'}
                    </button>
                    {testStatus === 'success' && <CheckCircle size={16} className="status-icon success" />}
                    {testStatus === 'fail' && <AlertCircle size={16} className="status-icon fail" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OpenAI兼容 配置 */}
          {aiConfig.provider === 'openai-compatible' && (
            <div className="settings-section">
              <h4 className="section-title">在线/兼容API 配置</h4>
              <div className="source-config">
                <div className="config-field">
                  <label>Base URL</label>
                  <input
                    type="text"
                    placeholder="https://api.deepseek.com/v1"
                    value={aiConfig.openaiBaseUrl}
                    onChange={(e) => updateAiConfig({ openaiBaseUrl: e.target.value })}
                  />
                  <span className="help-text">
                    DeepSeek: https://api.deepseek.com/v1 &nbsp;|&nbsp;
                    硅基流动: https://api.siliconflow.cn/v1
                  </span>
                </div>
                <div className="config-field">
                  <label>API Key</label>
                  <input
                    type="password"
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                    value={aiConfig.openaiApiKey}
                    onChange={(e) => updateAiConfig({ openaiApiKey: e.target.value })}
                  />
                  <span className="help-text">在对应平台的设置中获取 API Key</span>
                </div>
                <div className="config-field">
                  <label>模型名称</label>
                  <input
                    type="text"
                    placeholder="deepseek-chat / gpt-3.5-turbo / qwen2.5-7b-instruct"
                    value={aiConfig.openaiModel}
                    onChange={(e) => updateAiConfig({ openaiModel: e.target.value })}
                  />
                  <span className="help-text">根据所选平台填写对应的模型名</span>
                </div>
                <div className="config-field">
                  <div className="input-with-action" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                    <button className="test-btn" onClick={handleTest} disabled={testStatus === 'testing'}>
                      {testStatus === 'testing' ? '测试中...' : '测试连接'}
                    </button>
                    {testStatus === 'success' && <CheckCircle size={16} className="status-icon success" />}
                    {testStatus === 'fail' && <AlertCircle size={16} className="status-icon fail" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 使用教程 */}
          <div className="tutorial-entry" onClick={() => setShowTutorial(!showTutorial)}>
            <div className="tutorial-header">
              <Zap size={18} />
              <span>如何搭建本地AI？</span>
              {showTutorial ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {showTutorial && (
              <div className="tutorial-content">
                <div className="tutorial-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h5>方案一：在线API（推荐，效果最好）</h5>
                    <ol>
                      <li>注册 DeepSeek: <a href="https://www.deepseek.com/" target="_blank" rel="noopener noreferrer">deepseek.com</a>（新用户送额度）</li>
                      <li>或注册 硅基流动: <a href="https://siliconflow.cn/" target="_blank" rel="noopener noreferrer">siliconflow.cn</a>（国产平台，模型多）</li>
                      <li>在平台设置中获取 API Key</li>
                      <li>选择"在线/兼容API"模式，填入 Base URL 和 API Key</li>
                      <li>模型名：DeepSeek填 <code>deepseek-chat</code>，硅基流动填对应模型名</li>
                      <li>点击"测试连接"验证配置是否正确</li>
                    </ol>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h5>方案二：Ollama 本地（完全免费）</h5>
                    <ol>
                      <li>下载安装 Ollama: <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">ollama.com/download</a></li>
                      <li>安装后打开终端，运行: <code>ollama pull qwen2.5:7b</code>（推荐中文能力强的模型）</li>
                      <li>其他可选模型: <code>ollama pull llama3.1:8b</code>, <code>ollama pull mistral:7b</code>, <code>ollama pull glm4:9b</code></li>
                      <li>等待下载完成（模型约4-5GB），确保Ollama在后台运行</li>
                      <li>回到这里点击"测试连接"验证</li>
                    </ol>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h5>方案三：LM Studio（图形界面）</h5>
                    <ol>
                      <li>下载安装 LM Studio: <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer">lmstudio.ai</a></li>
                      <li>在LM Studio中搜索并下载一个模型（如 Qwen2.5-7B）</li>
                      <li>点击"Start Server"，默认端口1234</li>
                      <li>选择"在线/兼容API"模式，填入 <code>http://localhost:1234/v1</code></li>
                    </ol>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">4</div>
                  <div className="step-content">
                    <h5>常见问题</h5>
                    <ul>
                      <li><strong>混合模式是什么？</strong>简单问题用内置引擎（快），复杂问题调AI（准）</li>
                      <li><strong>在线API收费吗？</strong>DeepSeek/硅基流动新用户有免费额度，超出后按量付费</li>
                      <li><strong>本地模型慢？</strong>7B模型需要8GB内存，可以用更小的模型如 <code>qwen2.5:3b</code></li>
                      <li><strong>中文效果差？</strong>推荐用 <code>qwen2.5</code> 或 <code>glm4</code> 系列模型</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
    </Modal>
  );
};

export default AiSettingsModal;
