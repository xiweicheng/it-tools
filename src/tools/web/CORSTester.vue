<template>
  <div class="tool-container">
    <h1 class="title">CORS 测试工具</h1>
    <p class="description">测试跨域资源共享（CORS）策略，检测 API 的跨域访问权限。</p>

    <div class="test-section">
      <div class="form-group">
        <label>请求 URL：</label>
        <input
          v-model="url"
          type="text"
          class="url-input"
          placeholder="输入 API 地址，如: https://api.example.com/data"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>请求方法：</label>
          <select v-model="method" class="select-input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div class="form-group">
          <label>数据类型：</label>
          <select v-model="contentType" class="select-input">
            <option value="json">JSON</option>
            <option value="text">Text</option>
            <option value="xml">XML</option>
            <option value="html">HTML</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>请求头（每行一个，格式: Key: Value）：</label>
        <textarea
          v-model="requestHeaders"
          class="headers-input"
          placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
        ></textarea>
      </div>

      <div class="form-group">
        <label>请求体：</label>
        <textarea
          v-model="requestBody"
          class="body-input"
          placeholder='{"key": "value"}'
        ></textarea>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="withCredentials" />
          发送 credentials（Cookie、Authorization header 等）
        </label>
      </div>

      <button @click="sendRequest" class="btn-primary" :disabled="testing">
        {{ testing ? '测试中...' : '发送测试请求' }}
      </button>
    </div>

    <div v-if="testResult" class="result-section">
      <h3>测试结果</h3>

      <div class="result-item">
        <div class="result-label">请求状态</div>
        <div class="result-value" :class="testResult.success ? 'success' : 'error'">
          {{ testResult.success ? '✅ 成功' : '❌ 失败' }}
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">HTTP 状态码</div>
        <div class="result-value">{{ testResult.status }} {{ testResult.statusText }}</div>
      </div>

      <div class="result-item">
        <div class="result-label">响应时间</div>
        <div class="result-value">{{ testResult.duration }}ms</div>
      </div>

      <div class="result-item">
        <div class="result-label">CORS 响应头检测</div>
        <div class="cors-headers">
          <div class="cors-header" :class="corsHeadersDetected['Access-Control-Allow-Origin'] ? 'detected' : 'missing'">
            <span class="header-name">Access-Control-Allow-Origin</span>
            <span class="header-value">{{ corsHeadersDetected['Access-Control-Allow-Origin'] || '❌ 未检测到' }}</span>
          </div>
          <div class="cors-header" :class="corsHeadersDetected['Access-Control-Allow-Methods'] ? 'detected' : 'missing'">
            <span class="header-name">Access-Control-Allow-Methods</span>
            <span class="header-value">{{ corsHeadersDetected['Access-Control-Allow-Methods'] || '❌ 未检测到' }}</span>
          </div>
          <div class="cors-header" :class="corsHeadersDetected['Access-Control-Allow-Headers'] ? 'detected' : 'missing'">
            <span class="header-name">Access-Control-Allow-Headers</span>
            <span class="header-value">{{ corsHeadersDetected['Access-Control-Allow-Headers'] || '❌ 未检测到' }}</span>
          </div>
          <div class="cors-header" :class="corsHeadersDetected['Access-Control-Allow-Credentials'] ? 'detected' : 'missing'">
            <span class="header-name">Access-Control-Allow-Credentials</span>
            <span class="header-value">{{ corsHeadersDetected['Access-Control-Allow-Credentials'] || '❌ 未检测到' }}</span>
          </div>
        </div>
      </div>

      <div class="result-item">
        <div class="result-label">CORS 状态</div>
        <div class="result-value" :class="isCORSEnabled ? 'success' : 'warning'">
          {{ isCORSEnabled ? '✅ 服务器允许跨域请求' : '⚠️ 可能存在 CORS 限制' }}
        </div>
      </div>

      <div v-if="testResult.headers" class="result-item">
        <div class="result-label">响应头</div>
        <div class="headers-display">
          <div v-for="(value, key) in testResult.headers" :key="key" class="header-row">
            <span class="header-key">{{ key }}</span>
            <span class="header-val">{{ value }}</span>
          </div>
        </div>
      </div>

      <div v-if="testResult.body" class="result-item">
        <div class="result-label">响应体</div>
        <pre class="body-display">{{ testResult.body }}</pre>
      </div>
    </div>

    <div class="info-section">
      <h4>什么是 CORS？</h4>
      <p>CORS（跨域资源共享）是一种安全机制，允许网页从不同域名的服务器请求资源。如果服务器没有正确配置 CORS 头，浏览器会阻止这些请求。</p>

      <h4>常见 CORS 响应头</h4>
      <ul>
        <li><code>Access-Control-Allow-Origin</code> - 指定允许访问的域名</li>
        <li><code>Access-Control-Allow-Methods</code> - 指定允许的 HTTP 方法</li>
        <li><code>Access-Control-Allow-Headers</code> - 指定允许的请求头</li>
        <li><code>Access-Control-Allow-Credentials</code> - 是否允许发送 Cookie</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const url = ref('')
const method = ref('GET')
const contentType = ref('json')
const requestHeaders = ref('')
const requestBody = ref('')
const withCredentials = ref(false)
const testing = ref(false)
const testResult = ref(null)

const corsHeadersDetected = computed(() => {
  if (!testResult.value || !testResult.value.headers) return {}

  const headers = {}
  const corsHeaderNames = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials'
  ]

  const lowerHeaders = {}
  for (const [key, value] of Object.entries(testResult.value.headers)) {
    lowerHeaders[key.toLowerCase()] = value
  }

  corsHeaderNames.forEach(name => {
    const key = name.toLowerCase()
    if (lowerHeaders[key]) {
      headers[name] = lowerHeaders[key]
    }
  })

  return headers
})

const isCORSEnabled = computed(() => {
  return corsHeadersDetected.value['Access-Control-Allow-Origin'] !== undefined
})

async function sendRequest() {
  if (!url.value) return

  testing.value = true
  testResult.value = null

  const startTime = Date.now()

  try {
    const headers = {}
    if (requestHeaders.value) {
      requestHeaders.value.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
          headers[key.trim()] = valueParts.join(':').trim()
        }
      })
    }

    const options = {
      method: method.value,
      headers: {
        ...headers
      },
      mode: 'cors'
    }

    if (withCredentials.value) {
      options.credentials = 'include'
    }

    if (['POST', 'PUT', 'PATCH'].includes(method.value) && requestBody.value) {
      const contentTypeMap = {
        json: 'application/json',
        text: 'text/plain',
        xml: 'application/xml',
        html: 'text/html'
      }
      options.headers['Content-Type'] = contentTypeMap[contentType.value] || 'application/json'
      options.body = requestBody.value
    }

    const response = await fetch(url.value, options)
    const duration = Date.now() - startTime

    let body = ''
    try {
      body = await response.text()
    } catch (e) {
      body = '[无法读取响应体]'
    }

    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    testResult.value = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      duration,
      headers: responseHeaders,
      body
    }
  } catch (error) {
    const duration = Date.now() - startTime
    testResult.value = {
      success: false,
      status: 0,
      statusText: 'Network Error',
      duration,
      headers: {},
      body: error.message
    }
  }

  testing.value = false
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

.test-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group > label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.url-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.headers-input,
.body-input {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.result-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.result-section h3 {
  margin-bottom: 1rem;
}

.result-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1rem;
  font-weight: 500;
}

.result-value.success {
  color: #166534;
}

.result-value.error {
  color: #991b1b;
}

.result-value.warning {
  color: #92400e;
}

.cors-headers {
  display: grid;
  gap: 0.5rem;
}

.cors-header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.cors-header.detected {
  background: #dcfce7;
}

.cors-header.missing {
  background: #fef3c7;
}

.header-name {
  font-family: monospace;
  color: #666;
}

.header-value {
  font-family: monospace;
}

.cors-header.detected .header-value {
  color: #166534;
}

.cors-header.missing .header-value {
  color: #92400e;
}

.headers-display {
  font-family: monospace;
  font-size: 0.85rem;
  max-height: 200px;
  overflow-y: auto;
}

.header-row {
  display: flex;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}

.header-key {
  width: 200px;
  color: #666;
}

.header-val {
  flex: 1;
  word-break: break-all;
}

.body-display {
  margin: 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85rem;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h4 {
  margin-bottom: 0.5rem;
}

.info-section p {
  margin-bottom: 1rem;
  color: #666;
}

.info-section ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.25rem;
}

.info-section code {
  background: #e5e5e5;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .test-section,
.dark .result-section,
.dark .info-section {
  background: #262626;
}

.dark .url-input,
.dark .select-input,
.dark .headers-input,
.dark .body-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item {
  background: #1a1a1a;
}

.dark .result-value.success {
  color: #86efac;
}

.dark .result-value.error {
  color: #fca5a5;
}

.dark .result-value.warning {
  color: #fcd34d;
}

.dark .cors-header.detected {
  background: #14532d;
}

.dark .cors-header.missing {
  background: #78350f;
}

.dark .body-display {
  background: #1a1a1a;
}

.dark .info-section code {
  background: #404040;
}
</style>
