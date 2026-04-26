<template>
  <div class="tool-container">
    <h1 class="title">HTTP 请求模拟器</h1>
    <p class="description">模拟各种 HTTP 请求，测试服务器响应情况。</p>

    <div class="simulator-card">
      <div class="request-config">
        <div class="config-row">
          <div class="method-select">
            <label>请求方法：</label>
            <select v-model="method" class="select-input">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>

          <div class="url-input">
            <label>请求 URL：</label>
            <input
              v-model="url"
              type="text"
              class="text-input"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        </div>

        <div class="headers-section">
          <div class="section-header">
            <h3>请求头</h3>
            <button @click="addHeader" class="btn-add">+ 添加</button>
          </div>
          <div class="headers-list">
            <div v-for="(header, index) in headers" :key="index" class="header-item">
              <input
                v-model="header.key"
                type="text"
                placeholder="Header 名"
                class="text-input small"
              />
              <input
                v-model="header.value"
                type="text"
                placeholder="Header 值"
                class="text-input small"
              />
              <button @click="removeHeader(index)" class="btn-remove">×</button>
            </div>
          </div>
        </div>

        <div class="body-section" v-if="['POST', 'PUT', 'PATCH'].includes(method)">
          <h3>请求体</h3>
          <div class="body-type-select">
            <label>
              <input type="radio" v-model="bodyType" value="json" />
              <span>JSON</span>
            </label>
            <label>
              <input type="radio" v-model="bodyType" value="form" />
              <span>表单数据</span>
            </label>
            <label>
              <input type="radio" v-model="bodyType" value="text" />
              <span>纯文本</span>
            </label>
          </div>
          <textarea
            v-model="requestBody"
            class="text-input"
            rows="8"
            :placeholder="bodyPlaceholder"
          ></textarea>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="sendRequest" class="btn-primary" :disabled="sending">
          {{ sending ? '发送中...' : '发送请求' }}
        </button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="sending" class="loading-section">
        <div class="spinner"></div>
        <p>正在发送请求...</p>
      </div>

      <div v-if="response" class="response-section">
        <div class="response-header">
          <h3>响应结果</h3>
          <span class="response-status" :class="getStatusClass(response.status)">
            {{ response.status }} {{ response.statusText }}
          </span>
        </div>

        <div class="response-tabs">
          <button
            :class="{ active: responseTab === 'body' }"
            @click="responseTab = 'body'"
          >
            响应体
          </button>
          <button
            :class="{ active: responseTab === 'headers' }"
            @click="responseTab = 'headers'"
          >
            响应头
          </button>
          <button
            :class="{ active: responseTab === 'info' }"
            @click="responseTab = 'info'"
          >
            请求信息
          </button>
        </div>

        <div class="response-content">
          <div v-if="responseTab === 'body'" class="response-body">
            <div class="response-actions">
              <button @click="copyResponse" class="btn-copy">复制响应</button>
              <button @click="formatResponse" class="btn-secondary">格式化</button>
            </div>
            <pre class="response-pre">{{ formattedResponse }}</pre>
          </div>

          <div v-if="responseTab === 'headers'" class="response-headers">
            <div v-for="(value, key) in response.headers" :key="key" class="header-row">
              <span class="header-key">{{ key }}:</span>
              <span class="header-value">{{ value }}</span>
            </div>
          </div>

          <div v-if="responseTab === 'info'" class="response-info">
            <div class="info-item">
              <span class="info-label">请求方法</span>
              <span class="info-value">{{ response.requestMethod }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">请求 URL</span>
              <span class="info-value">{{ response.requestUrl }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">响应时间</span>
              <span class="info-value">{{ response.time }} ms</span>
            </div>
            <div class="info-item">
              <span class="info-label">数据大小</span>
              <span class="info-value">{{ formatSize(response.size) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-section">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const method = ref('GET')
const url = ref('')
const headers = ref([
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Accept', value: 'application/json' }
])
const bodyType = ref('json')
const requestBody = ref('')
const sending = ref(false)
const response = ref(null)
const responseTab = ref('body')
const error = ref('')

const bodyPlaceholder = computed(() => {
  if (bodyType.value === 'json') {
    return '{\n  "key": "value"\n}'
  } else if (bodyType.value === 'form') {
    return 'key1=value1&key2=value2'
  }
  return '请求体内容...'
})

const formattedResponse = computed(() => {
  if (!response.value) return ''

  try {
    const json = JSON.parse(response.value.body)
    return JSON.stringify(json, null, 2)
  } catch {
    return response.value.body
  }
})

function getStatusClass(status) {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'redirect'
  if (status >= 400 && status < 500) return 'client-error'
  return 'server-error'
}

function addHeader() {
  headers.value.push({ key: '', value: '' })
}

function removeHeader(index) {
  headers.value.splice(index, 1)
}

async function sendRequest() {
  if (!url.value.trim()) {
    error.value = '请输入请求 URL'
    return
  }

  error.value = ''
  response.value = null
  sending.value = true

  const startTime = Date.now()

  try {
    const options = {
      method: method.value,
      headers: {}
    }

    headers.value.forEach(h => {
      if (h.key && h.value) {
        options.headers[h.key] = h.value
      }
    })

    if (['POST', 'PUT', 'PATCH'].includes(method.value) && requestBody.value) {
      options.body = requestBody.value
    }

    const res = await fetch(url.value, options)
    const responseText = await res.text()
    const responseHeaders = {}

    res.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    response.value = {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
      body: responseText,
      time: Date.now() - startTime,
      size: new Blob([responseText]).size,
      requestMethod: method.value,
      requestUrl: url.value
    }
  } catch (e) {
    error.value = '请求失败: ' + e.message
  }

  sending.value = false
}

function loadSample() {
  method.value = 'GET'
  url.value = 'https://jsonplaceholder.typicode.com/posts/1'
  headers.value = [
    { key: 'Accept', value: 'application/json' }
  ]
  requestBody.value = ''
}

function copyResponse() {
  if (response.value) {
    navigator.clipboard.writeText(formattedResponse.value)
  }
}

function formatResponse() {
  // Toggle formatting in the response display
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function clearAll() {
  method.value = 'GET'
  url.value = ''
  headers.value = [{ key: 'Content-Type', value: 'application/json' }]
  requestBody.value = ''
  response.value = null
  error.value = ''
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

.simulator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.request-config {
  margin-bottom: 1.5rem;
}

.config-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.method-select {
  width: 150px;
}

.url-input {
  flex: 1;
}

.config-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input,
.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.headers-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1rem;
}

.btn-add {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.headers-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.header-item .text-input.small {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #fee2e2;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.2rem;
}

.body-section {
  margin-bottom: 1.5rem;
}

.body-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.body-type-select {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.body-type-select label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.loading-section {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e5e5;
  border-top-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.response-section {
  margin-top: 1.5rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.response-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.response-status {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.response-status.success { background: #dcfce7; color: #166534; }
.response-status.redirect { background: #fef3c7; color: #92400e; }
.response-status.client-error { background: #fef2f2; color: #991b1b; }
.response-status.server-error { background: #dc2626; color: white; }

.response-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #e5e5e5;
}

.response-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.response-tabs button.active {
  background: #2563eb;
  color: white;
}

.response-content {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.response-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.btn-copy {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.response-pre {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 400px;
  margin: 0;
  font-size: 0.9rem;
}

.header-row {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.header-key {
  font-weight: 600;
  min-width: 200px;
}

.header-value {
  color: #666;
  word-break: break-all;
}

.response-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
  word-break: break-all;
}

.error-section {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-top: 1rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .simulator-card {
  background: #262626;
}

.dark .select-input,
.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-add {
  background: #1a1a1a;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .response-tabs {
  background: #333;
}

.dark .response-content {
  background: #1a1a1a;
}

.dark .response-pre {
  background: #000;
}

@media (max-width: 768px) {
  .config-row {
    flex-direction: column;
  }

  .method-select {
    width: 100%;
  }

  .response-info {
    grid-template-columns: 1fr;
  }
}
</style>
