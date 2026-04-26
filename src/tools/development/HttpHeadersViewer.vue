<template>
  <div class="http-headers-viewer">
    <h2>HTTP 响应头查看器</h2>

    <div class="viewer-container">
      <div class="input-section">
        <h3>输入 URL</h3>
        <div class="input-group">
          <select v-model="method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <input
            type="url"
            v-model="url"
            placeholder="输入 URL (如: https://example.com)"
            @keyup.enter="fetchHeaders"
          />
          <button @click="fetchHeaders" :disabled="isLoading" class="fetch-btn">
            {{ isLoading ? '获取中...' : '获取' }}
          </button>
        </div>

        <div class="quick-urls">
          <span>快速测试:</span>
          <button @click="url = 'https://google.com'; fetchHeaders()">Google</button>
          <button @click="url = 'https://github.com'; fetchHeaders()">GitHub</button>
          <button @click="url = 'https://cloudflare.com'; fetchHeaders()">Cloudflare</button>
        </div>
      </div>

      <div class="result-section" v-if="headers">
        <div class="result-header">
          <h3>响应信息</h3>
          <div class="status-info">
            <span class="status-badge" :class="statusClass">{{ status }} {{ statusText }}</span>
            <span class="response-time">{{ responseTime }}ms</span>
          </div>
        </div>

        <div class="headers-category">
          <h4>通用响应头 (General Headers)</h4>
          <div class="headers-list">
            <div v-for="(value, key) in generalHeaders" :key="key" class="header-item">
              <span class="header-key">{{ key }}</span>
              <span class="header-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="headers-category" v-if="Object.keys(responseHeaders).length > 0">
          <h4>响应头 (Response Headers)</h4>
          <div class="headers-list">
            <div v-for="(value, key) in responseHeaders" :key="key" class="header-item">
              <span class="header-key">{{ key }}</span>
              <span class="header-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="headers-category" v-if="Object.keys(entityHeaders).length > 0">
          <h4>实体头 (Entity Headers)</h4>
          <div class="headers-list">
            <div v-for="(value, key) in entityHeaders" :key="key" class="header-item">
              <span class="header-key">{{ key }}</span>
              <span class="header-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="security-info" v-if="securityHeaders">
          <h4>安全相关头</h4>
          <div class="security-grid">
            <div class="security-item" :class="{ present: securityHeaders['strict-transport-security'] }">
              <span class="security-label">HSTS</span>
              <span class="security-status">{{ securityHeaders['strict-transport-security'] ? '✓' : '✗' }}</span>
            </div>
            <div class="security-item" :class="{ present: securityHeaders['content-security-policy'] }">
              <span class="security-label">CSP</span>
              <span class="security-status">{{ securityHeaders['content-security-policy'] ? '✓' : '✗' }}</span>
            </div>
            <div class="security-item" :class="{ present: securityHeaders['x-content-type-options'] }">
              <span class="security-label">X-Content-Type</span>
              <span class="security-status">{{ securityHeaders['x-content-type-options'] ? '✓' : '✗' }}</span>
            </div>
            <div class="security-item" :class="{ present: securityHeaders['x-frame-options'] }">
              <span class="security-label">X-Frame-Options</span>
              <span class="security-status">{{ securityHeaders['x-frame-options'] ? '✓' : '✗' }}</span>
            </div>
            <div class="security-item" :class="{ present: securityHeaders['x-xss-protection'] }">
              <span class="security-label">X-XSS-Protection</span>
              <span class="security-status">{{ securityHeaders['x-xss-protection'] ? '✓' : '✗' }}</span>
            </div>
            <div class="security-item" :class="{ present: securityHeaders['referrer-policy'] }">
              <span class="security-label">Referrer-Policy</span>
              <span class="security-status">{{ securityHeaders['referrer-policy'] ? '✓' : '✗' }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="copyAllHeaders" class="copy-btn">{{ copied ? '已复制!' : '复制所有头' }}</button>
          <button @click="downloadHeaders" class="download-btn">下载 JSON</button>
        </div>
      </div>

      <div class="empty-state" v-else-if="!isLoading">
        <p>输入 URL 并点击"获取"查看 HTTP 响应头</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const url = ref('')
const method = ref('GET')
const isLoading = ref(false)
const headers = ref(null)
const status = ref(0)
const statusText = ref('')
const responseTime = ref(0)
const copied = ref(false)

const statusClass = computed(() => {
  if (status.value >= 200 && status.value < 300) return 'success'
  if (status.value >= 300 && status.value < 400) return 'redirect'
  if (status.value >= 400 && status.value < 500) return 'client-error'
  if (status.value >= 500) return 'server-error'
  return ''
})

const generalHeadersList = ['date', 'expires', 'cache-control', 'pragma', 'connection', 'content-length', 'content-type', 'server', 'transfer-encoding']
const entityHeadersList = ['allow', 'content-encoding', 'content-language', 'content-length', 'content-location', 'content-md5', 'content-range', 'content-type', 'last-modified', 'etag']

const generalHeaders = computed(() => {
  if (!headers.value) return {}
  const result = {}
  for (const [key, value] of Object.entries(headers.value)) {
    if (generalHeadersList.includes(key.toLowerCase())) {
      result[key] = value
    }
  }
  return result
})

const responseHeaders = computed(() => {
  if (!headers.value) return {}
  const result = {}
  const allGeneralAndEntity = [...generalHeadersList, ...entityHeadersList]
  for (const [key, value] of Object.entries(headers.value)) {
    if (!allGeneralAndEntity.includes(key.toLowerCase())) {
      result[key] = value
    }
  }
  return result
})

const entityHeaders = computed(() => {
  if (!headers.value) return {}
  const result = {}
  for (const [key, value] of Object.entries(headers.value)) {
    if (entityHeadersList.includes(key.toLowerCase())) {
      result[key] = value
    }
  }
  return result
})

const securityHeaders = computed(() => {
  if (!headers.value) return null
  const securityKeys = [
    'strict-transport-security',
    'content-security-policy',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy'
  ]
  const result = {}
  for (const [key, value] of Object.entries(headers.value)) {
    if (securityKeys.includes(key.toLowerCase())) {
      result[key.toLowerCase()] = value
    }
  }
  return result
})

const fetchHeaders = async () => {
  if (!url.value || isLoading.value) return

  isLoading.value = true
  const startTime = performance.now()

  try {
    let targetUrl = url.value.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(targetUrl, {
      method: method.value,
      signal: controller.signal,
      mode: 'no-cors'
    })

    clearTimeout(timeoutId)

    const endTime = performance.now()
    responseTime.value = Math.round(endTime - startTime)

    status.value = response.status || 0
    statusText.value = response.statusText || ''

    const headerObj = {}
    response.headers.forEach((value, key) => {
      headerObj[key] = value
    })

    headers.value = headerObj
  } catch (e) {
    status.value = 0
    statusText.value = 'Error'
    headers.value = {}
    responseTime.value = Math.round(performance.now() - startTime)
  }

  isLoading.value = false
}

const copyAllHeaders = async () => {
  if (!headers.value) return
  try {
    const text = Object.entries(headers.value)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

const downloadHeaders = () => {
  if (!headers.value) return
  const json = JSON.stringify(headers.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'http-headers.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.http-headers-viewer {
  padding: 20px;
}
.viewer-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-section,
.result-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.input-group {
  display: flex;
  gap: 10px;
}
.input-group select {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-bg);
}
.input-group input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.fetch-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.quick-urls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.quick-urls span {
  font-size: 12px;
  color: var(--text-secondary);
}
.quick-urls button {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.quick-urls button:hover {
  background: var(--border-color);
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.result-header h3 {
  margin: 0;
}
.status-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}
.status-badge.success { background: #E8F5E9; color: #4CAF50; }
.status-badge.redirect { background: #FFF3E0; color: #FF9800; }
.status-badge.client-error { background: #FFEBEE; color: #F44336; }
.status-badge.server-error { background: #FFEBEE; color: #F44336; }
.response-time {
  color: var(--text-secondary);
  font-size: 14px;
}
.headers-category {
  margin-bottom: 20px;
}
.headers-category h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--text-secondary);
}
.headers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.header-item {
  display: flex;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
  gap: 15px;
}
.header-key {
  font-weight: bold;
  min-width: 200px;
  color: var(--primary-color);
}
.header-value {
  flex: 1;
  word-break: break-all;
  font-family: monospace;
  font-size: 13px;
}
.security-info {
  margin-bottom: 20px;
}
.security-info h4 {
  margin: 0 0 15px 0;
}
.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}
.security-item.present {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
}
.security-label {
  font-size: 12px;
}
.security-status {
  font-weight: bold;
}
.security-item.present .security-status {
  color: #4CAF50;
}
.security-item:not(.present) .security-status {
  color: #9E9E9E;
}
.action-buttons {
  display: flex;
  gap: 10px;
}
.copy-btn,
.download-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.download-btn {
  background: var(--primary-color);
  color: white;
}
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
}
</style>
