<template>
  <div class="tool-container">
    <h1 class="title">URL 解析器</h1>
    <p class="description">解析 URL 的各个组成部分，包括协议、主机名、端口、路径、查询参数等。</p>

    <div class="input-section">
      <label>输入 URL：</label>
      <input
        v-model="urlInput"
        type="text"
        class="url-input"
        placeholder="输入或粘贴 URL，如: https://example.com:8080/path?name=test&age=25"
        @input="parseUrl"
      />
    </div>

    <div v-if="parsed" class="result-section">
      <h3>解析结果</h3>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">完整 URL</div>
          <div class="result-value">{{ parsed.href }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">协议 (Protocol)</div>
          <div class="result-value highlight">{{ parsed.protocol }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">主机名 (Hostname)</div>
          <div class="result-value highlight">{{ parsed.hostname }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">端口 (Port)</div>
          <div class="result-value">{{ parsed.port || '(默认)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">路径 (Pathname)</div>
          <div class="result-value">{{ parsed.pathname }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">查询字符串 (Search)</div>
          <div class="result-value">{{ parsed.search || '(无)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">锚点 (Hash)</div>
          <div class="result-value">{{ parsed.hash || '(无)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">用户名</div>
          <div class="result-value">{{ parsed.username || '(无)' }}</div>
        </div>

        <div class="result-item">
          <div class="result-label">密码</div>
          <div class="result-value">{{ parsed.password ? '********' : '(无)' }}</div>
        </div>
      </div>

      <div v-if="parsed.search" class="params-section">
        <h4>查询参数</h4>
        <table class="params-table">
          <thead>
            <tr>
              <th>参数名</th>
              <th>参数值</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in queryParams" :key="key">
              <td>{{ key }}</td>
              <td>{{ value }}</td>
              <td>
                <button @click="copyParam(key)" class="btn-tiny">复制</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="action-buttons">
        <button @click="copyAll" class="btn-secondary">复制完整 URL</button>
        <button @click="openUrl" class="btn-primary">在新窗口打开</button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const urlInput = ref('')
const parsed = ref(null)
const error = ref('')

const queryParams = computed(() => {
  if (!parsed.value || !parsed.value.search) return {}

  const params = {}
  const searchParams = new URLSearchParams(parsed.value.search)
  for (const [key, value] of searchParams) {
    params[key] = value
  }
  return params
})

function parseUrl() {
  error.value = ''
  parsed.value = null

  if (!urlInput.value.trim()) {
    return
  }

  try {
    let urlString = urlInput.value.trim()

    if (!urlString.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//)) {
      if (urlString.startsWith('//')) {
        urlString = 'https:' + urlString
      } else {
        urlString = 'https://' + urlString
      }
    }

    const url = new URL(urlString)
    parsed.value = {
      href: url.href,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      username: url.username,
      password: url.password,
      origin: url.origin
    }
  } catch (e) {
    error.value = `URL 解析错误: ${e.message}`
    parsed.value = null
  }
}

function copyParam(key) {
  const value = queryParams.value[key]
  navigator.clipboard.writeText(`${key}=${value}`)
}

function copyAll() {
  if (parsed.value) {
    navigator.clipboard.writeText(parsed.value.href)
  }
}

function openUrl() {
  if (parsed.value) {
    window.open(parsed.value.href, '_blank')
  }
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
  margin-bottom: 2rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.url-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.result-section {
  margin-bottom: 1.5rem;
}

.result-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
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
  font-family: monospace;
  font-size: 1rem;
  word-break: break-all;
}

.result-value.highlight {
  color: #2563eb;
}

.params-section {
  margin-top: 1.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.params-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
}

.params-table th,
.params-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.params-table th {
  font-weight: 500;
  font-size: 0.9rem;
  color: #666;
}

.params-table td {
  font-family: monospace;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
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

.btn-tiny {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
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

.dark .url-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item,
.dark .params-section {
  background: #262626;
}

.dark .result-value.highlight {
  color: #60a5fa;
}

.dark .params-table th {
  color: #a3a3a3;
}

.dark .params-table td {
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .btn-tiny {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}
</style>
