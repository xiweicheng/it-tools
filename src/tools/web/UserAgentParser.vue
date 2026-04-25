<template>
  <div class="tool-container">
    <h1 class="title">User-Agent 解析器</h1>
    <p class="description">解析浏览器的 User-Agent 字符串，获取浏览器类型、操作系统、设备信息等。</p>

    <div class="input-section">
      <div class="panel-header">
        <span>输入 User-Agent</span>
        <button @click="detectCurrent" class="btn-small">使用当前浏览器</button>
      </div>
      <textarea
        v-model="uaInput"
        class="ua-input"
        placeholder="粘贴 User-Agent 字符串..."
      ></textarea>
    </div>

    <div class="action-bar">
      <button @click="parseUA" class="btn-primary">解析</button>
      <button @click="clearInput" class="btn-secondary">清空</button>
    </div>

    <div v-if="result" class="result-section">
      <h3>解析结果</h3>

      <div class="device-icon">
        <div class="icon-wrapper" :class="result.device.type">
          <svg v-if="result.device.type === 'mobile'" viewBox="0 0 24 24" width="64" height="64">
            <path fill="currentColor" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
          <svg v-else-if="result.device.type === 'tablet'" viewBox="0 0 24 24" width="64" height="64">
            <path fill="currentColor" d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM18 19H6V5h12v14z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="64" height="64">
            <path fill="currentColor" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>
          </svg>
        </div>
        <div class="device-name">{{ result.device.typeName }}</div>
      </div>

      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">浏览器</div>
          <div class="result-value highlight">{{ result.browser.name }} {{ result.browser.version }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">浏览器类型</div>
          <div class="result-value">{{ result.browser.type }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">操作系统</div>
          <div class="result-value highlight">{{ result.os.name }} {{ result.os.version }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">设备品牌</div>
          <div class="result-value">{{ result.device.brand || '(未知)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">设备型号</div>
          <div class="result-value">{{ result.device.model || '(未知)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">引擎</div>
          <div class="result-value">{{ result.engine.name }} {{ result.engine.version }}</div>
        </div>
      </div>

      <div class="raw-section">
        <h4>原始字符串</h4>
        <pre class="raw-text">{{ uaInput }}</pre>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uaInput = ref('')
const result = ref(null)
const error = ref('')

function detectCurrent() {
  uaInput.value = navigator.userAgent
  parseUA()
}

function clearInput() {
  uaInput.value = ''
  result.value = null
  error.value = ''
}

function parseUA() {
  error.value = ''
  result.value = null

  if (!uaInput.value.trim()) {
    return
  }

  const ua = uaInput.value

  result.value = {
    browser: parseBrowser(ua),
    os: parseOS(ua),
    device: parseDevice(ua),
    engine: parseEngine(ua)
  }
}

function parseBrowser(ua) {
  let name = '未知浏览器'
  let version = ''
  let type = '桌面浏览器'

  const browsers = [
    { name: 'Edge', regex: /Edg[eA]?\/([\d.]+)/ },
    { name: 'Chrome', regex: /Chrome\/([\d.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([\d.]+)/ },
    { name: 'Safari', regex: /Version\/([\d.]+).*Safari/ },
    { name: 'Opera', regex: /OPR\/([\d.]+)/ },
    { name: 'IE', regex: /MSIE\s([\d.]+)/ },
    { name: 'IE', regex: /Trident\/.*rv:([\d.]+)/ }
  ]

  for (const browser of browsers) {
    const match = ua.match(browser.regex)
    if (match) {
      name = browser.name
      version = match[1]
      break
    }
  }

  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    type = '移动浏览器'
  }

  return { name, version, type }
}

function parseOS(ua) {
  let name = '未知系统'
  let version = ''

  const systems = [
    { name: 'Windows', regex: /Windows\sNT\s([\d.]+)/ },
    { name: 'macOS', regex: /Mac\sOS\sX\s([\d_.]+)/ },
    { name: 'Linux', regex: /Linux/ },
    { name: 'Android', regex: /Android\s([\d.]+)/ },
    { name: 'iOS', regex: /iPhone\sOS\s([\d_]+)/ },
    { name: 'Chrome OS', regex: /CrOS/ }
  ]

  const windowsVersions = {
    '10.0': '10/11',
    '6.3': '8.1',
    '6.2': '8',
    '6.1': '7'
  }

  for (const system of systems) {
    const match = ua.match(system.regex)
    if (match) {
      name = system.name
      if (match[1]) {
        version = match[1].replace(/_/g, '.')
        if (name === 'Windows' && windowsVersions[version]) {
          version = windowsVersions[version]
        }
      }
      break
    }
  }

  return { name, version }
}

function parseDevice(ua) {
  let type = 'desktop'
  let typeName = '台式机'
  let brand = ''
  let model = ''

  if (/iPad|Tablet/i.test(ua)) {
    type = 'tablet'
    typeName = '平板电脑'
    if (/iPad/i.test(ua)) {
      brand = 'Apple'
      model = 'iPad'
    }
  } else if (/Mobile|Android|iPhone/i.test(ua)) {
    type = 'mobile'
    typeName = '手机'

    if (/iPhone/i.test(ua)) {
      brand = 'Apple'
      const match = ua.match(/iPhone\sOS\s([\d_]+)/)
      if (match) model = `iPhone (iOS ${match[1].replace(/_/g, '.')})`
    } else if (/Android/i.test(ua)) {
      const brandMatch = ua.match(/Android\s[\d.]+;\s([^;]+)/)
      if (brandMatch) {
        const parts = brandMatch[1].split(/\s/)
        brand = parts[0]
        model = brandMatch[1]
      }
    }
  }

  return { type, typeName, brand, model }
}

function parseEngine(ua) {
  let name = '未知引擎'
  let version = ''

  if (/AppleWebKit/i.test(ua)) {
    name = 'WebKit'
    const match = ua.match(/AppleWebKit\/([\d.]+)/)
    if (match) version = match[1]
  } else if (/Gecko/i.test(ua)) {
    name = 'Gecko'
    const match = ua.match(/Gecko\/([\d.]+)/)
    if (match) version = match[1]
  } else if (/Trident/i.test(ua)) {
    name = 'Trident'
    const match = ua.match(/Trident\/([\d.]+)/)
    if (match) version = match[1]
  }

  return { name, version }
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.input-section {
  margin-bottom: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #e0e0e0;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
}

.ua-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  resize: vertical;
  font-family: monospace;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.btn-small {
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-small:hover {
  background: #f5f5f5;
}

.result-section {
  margin-bottom: 1.5rem;
}

.result-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.device-icon {
  text-align: center;
  margin-bottom: 1.5rem;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f5f5f5;
  margin-bottom: 0.5rem;
}

.icon-wrapper.mobile {
  background: #dcfce7;
  color: #166534;
}

.icon-wrapper.tablet {
  background: #fef3c7;
  color: #92400e;
}

.icon-wrapper.desktop {
  background: #e0e0e0;
  color: #666;
}

.device-name {
  font-weight: 500;
  color: #666;
}

.result-grid {
  display: grid;
  gap: 1rem;
}

.result-item {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.35rem;
}

.result-value {
  font-size: 1rem;
}

.result-value.highlight {
  color: #2563eb;
  font-weight: 500;
}

.raw-section {
  margin-top: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.raw-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.raw-text {
  margin: 0;
  padding: 0.75rem;
  background: #fff;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
  white-space: pre-wrap;
}

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  text-align: center;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .panel-header {
  background: #404040;
}

.dark .ua-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item,
.dark .icon-wrapper,
.dark .raw-section {
  background: #262626;
}

.dark .raw-text {
  background: #1a1a1a;
}

.dark .result-value.highlight {
  color: #60a5fa;
}

.dark .device-icon {
  color: #a3a3a3;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .btn-small {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}
</style>
