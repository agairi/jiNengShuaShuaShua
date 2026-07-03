import React, { useState } from 'react';
import { X, Settings, Globe, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Zap, Key, ExternalLink, Copy, Check } from 'lucide-react';
import { useStore } from '../store';
import { SEARCH_SOURCE_INFO, testApiConnection, type SearchSource } from '../utils/searchApi';
import Modal from './Modal';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'fail';

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiSettings, updateApiSettings, toggleSearchSource, toggleWebSearch } = useStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [testStatuses, setTestStatuses] = useState<Record<string, TestStatus>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleTest = async (source: SearchSource) => {
    setTestStatuses((prev) => ({ ...prev, [source]: 'testing' }));
    const ok = await testApiConnection(source, apiSettings);
    setTestStatuses((prev) => ({ ...prev, [source]: ok ? 'success' : 'fail' }));
    setTimeout(() => {
      setTestStatuses((prev) => {
        const next = { ...prev };
        delete next[source];
        return next;
      });
    }, 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<><Settings size={20} /> API 搜索设置</>}
      size="md"
      footer={<button className="btn-primary" onClick={onClose}>完成</button>}
      className="api-settings-modal"
    >
          {/* 总开关 */}
          <div className="settings-section">
            <div className="setting-row main-toggle">
              <div className="setting-info">
                <Globe size={20} className="setting-icon" />
                <div>
                  <h3>全网搜索功能</h3>
                  <p>开启后搜索时会同时查询互联网学习资源</p>
                </div>
              </div>
              <div className={`toggle-switch ${apiSettings.webSearchEnabled ? 'on' : ''}`} onClick={toggleWebSearch}>
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>

          {/* 搜索源列表 */}
          <div className="settings-section">
            <h4 className="section-title">搜索数据源</h4>

            <div className="sources-list">
              {(Object.keys(SEARCH_SOURCE_INFO) as SearchSource[]).map((source) => {
                const info = SEARCH_SOURCE_INFO[source];
                const enabled = apiSettings.enabledSources.includes(source);
                const status = testStatuses[source] || 'idle';
                const needsKey = !info.free;

                return (
                  <div key={source} className={`source-card ${enabled ? 'enabled' : ''}`}>
                    <div className="source-header">
                      <div className="source-info">
                        <span className="source-icon">{info.icon}</span>
                        <div>
                          <div className="source-name">
                            {info.label}
                            {info.free ? (
                              <span className="badge free">免费</span>
                            ) : (
                              <span className="badge paid">需Key</span>
                            )}
                          </div>
                          <p className="source-desc">{info.description}</p>
                        </div>
                      </div>
                      <div className="source-actions">
                        {status === 'testing' && <span className="status-text testing">测试中...</span>}
                        {status === 'success' && <CheckCircle size={16} className="status-icon success" />}
                        {status === 'fail' && <AlertCircle size={16} className="status-icon fail" />}
                        {status === 'idle' && enabled && (
                          <button className="test-btn" onClick={() => handleTest(source)}>测试</button>
                        )}
                        <div className={`toggle-switch small ${enabled ? 'on' : ''}`} onClick={() => toggleSearchSource(source)}>
                          <div className="toggle-thumb" />
                        </div>
                      </div>
                    </div>

                    {/* 需要Key的显示Key输入框 */}
                    {enabled && needsKey && (
                      <div className="source-config">
                        {source === 'serpapi' && (
                          <div className="config-field">
                            <label>SerpApi Key</label>
                            <div className="input-with-action">
                              <input
                                type="password"
                                placeholder="输入你的 SerpApi API Key"
                                value={apiSettings.serpApiKey || ''}
                                onChange={(e) => updateApiSettings({ serpApiKey: e.target.value })}
                              />
                              <button className="copy-btn" onClick={() => copyToClipboard('https://serpapi.com/', 'serpapi-signup')}>
                                <ExternalLink size={14} />
                              </button>
                            </div>
                            <span className="help-text">
                              前往 <a href="https://serpapi.com/" target="_blank" rel="noopener noreferrer">serpapi.com</a> 注册，每月100次免费搜索
                            </span>
                          </div>
                        )}

                        {source === 'google' && (
                          <>
                            <div className="config-field">
                              <label>Google API Key</label>
                              <input
                                type="password"
                                placeholder="输入 Google API Key"
                                value={apiSettings.googleApiKey || ''}
                                onChange={(e) => updateApiSettings({ googleApiKey: e.target.value })}
                              />
                            </div>
                            <div className="config-field">
                              <label>搜索引擎 ID (CX)</label>
                              <input
                                type="text"
                                placeholder="输入自定义搜索引擎 ID"
                                value={apiSettings.googleCx || ''}
                                onChange={(e) => updateApiSettings({ googleCx: e.target.value })}
                              />
                              <span className="help-text">
                                每天100次免费搜索，需同时配置 API Key 和 CX
                              </span>
                            </div>
                          </>
                        )}

                        {source === 'custom' && (
                          <div className="config-field">
                            <label>自定义 API 地址</label>
                            <input
                              type="text"
                              placeholder="https://your-api.com/search"
                              value={apiSettings.customApiUrl || ''}
                              onChange={(e) => updateApiSettings({ customApiUrl: e.target.value })}
                            />
                            <span className="help-text">
                              返回格式需包含 results/items/data 数组，每项有 title/url/snippet
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 使用教程入口 */}
          <div className="tutorial-entry" onClick={() => setShowTutorial(!showTutorial)}>
            <div className="tutorial-header">
              <Zap size={18} />
              <span>如何获取免费 API Key？</span>
              {showTutorial ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {showTutorial && (
              <div className="tutorial-content">
                <div className="tutorial-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    <h5>免费方案：直接使用内置免费源</h5>
                    <p>开启"全网搜索"后，默认启用3个免费源：Wikipedia、GitHub、Stack Overflow。</p>
                    <p className="tip">✅ 无需注册、无需Key、即开即用</p>
                    <ul>
                      <li>📚 Wikipedia — 查技术概念的权威定义</li>
                      <li>🐙 GitHub — 找开源项目和代码</li>
                      <li>💬 Stack Overflow — 找编程问题解决方案</li>
                    </ul>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">2</div>
                  <div className="step-content">
                    <h5>进阶方案：SerpApi（Google搜索结果）</h5>
                    <p>SerpApi 可以获取真实的 Google 搜索结果，每月 100 次免费搜索。</p>
                    <ol>
                      <li>打开 <a href="https://serpapi.com/" target="_blank" rel="noopener noreferrer">serpapi.com</a></li>
                      <li>点击右上角 "Sign Up" 注册账号</li>
                      <li>可以用 GitHub / Google 账号一键注册</li>
                      <li>注册后在 Dashboard 找到 "Your Private API Key"</li>
                      <li>复制 Key，粘贴到上方 SerpApi Key 输入框</li>
                    </ol>
                    <p className="tip">💡 免费额度：每月 100 次搜索，用完会暂停，下月恢复</p>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">3</div>
                  <div className="step-content">
                    <h5>高级方案：Google Custom Search API</h5>
                    <p>Google 官方的自定义搜索 API，每天 100 次免费查询。</p>
                    <ol>
                      <li>打开 <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                      <li>创建一个新项目（或用现有项目）</li>
                      <li>搜索 "Custom Search JSON API"，点击启用</li>
                      <li>进入 "API 和服务" → "凭据" → "创建凭据" → "API密钥"</li>
                      <li>然后去 <a href="https://cse.google.com/cse/" target="_blank" rel="noopener noreferrer">Google CSE</a> 创建搜索引擎</li>
                      <li>在 "要搜索的网站" 填 <code>www.*.com/*</code>（搜索全网）</li>
                      <li>获取 "搜索引擎 ID"（CX），和 API Key 一起填入上方</li>
                    </ol>
                    <p className="tip">💡 每天 100 次免费查询，超出后每 1000 次 5 美元</p>
                  </div>
                </div>

                <div className="tutorial-step">
                  <div className="step-num">4</div>
                  <div className="step-content">
                    <h5>极客方案：自建搜索 API</h5>
                    <p>如果你有自己的服务器或搜索服务，可以填自定义 API 地址。</p>
                    <p>API 要求：</p>
                    <ul>
                      <li>GET 请求，query 参数 <code>q</code> 为搜索词</li>
                      <li>返回 JSON，包含 <code>results</code> / <code>items</code> / <code>data</code> 数组</li>
                      <li>每项包含 <code>title</code>、<code>url</code>、<code>snippet</code> 字段</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
    </Modal>
  );
};

export default ApiSettingsModal;
