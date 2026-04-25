<template>
  <div class="tool-container">
    <h1 class="title">接口参数拼装工具</h1>
    <p class="description">快速拼装和格式化 API 请求参数，支持 URL 查询字符串和 JSON 格式。</p>

    <div class="api-card">
      <div class="form-group">
        <label>请求 URL：</label>
        <input
          v-model="baseUrl"
          type="text"
          class="text-input"
          placeholder="例如: https://api.example.com/users"
        />
      </div>

      <div class="form-group">
        <label>HTTP 方法：</label>
        <select v-model="httpMethod" class="select-input">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div class="parameters-section">
        <h3>参数列表</h3>
        <div class="parameters-header">
          <div class="header-cell">参数名</div>
          <div class="header-cell">值</div>
          <div class="header-cell">类型</div>
          <div class="header-cell">操作</div>
        </div>
        <div
          v-for="(param, index) in parameters"
          :key="index"
          class="parameter-row"
        >
          <div class="cell">
            <input
              v-model="param.name"
              type="text"
              class="edit-input"
              placeholder="参数名"
              @input="updateOutput"
            />
          </div>
          <div class="cell">
            <input
              v-model="param.value"
              type="text"
              class="edit-input"
              placeholder="参数值"
              @input="updateOutput"
            />
          </div>
          <div class="cell">
            <select v-model="param.type" class="type-select" @change="updateOutput">
              <option value="query">查询参数</option>
              <option value="body">请求体</option>
            </select>
          </div>
          <div class="cell action-cell">
            <button @click="removeParam(index)" class="btn-remove">删除</button>
          </div>
        </div>
        <button @click="addParam" class="btn-add">添加参数</button>
      </div>

      <div class="output-section">
        <h3>生成结果</h3>
        <div class="output-tabs">
          <button
            :class="{ active: outputFormat === 'url' }"
            @click="outputFormat = 'url'"
          >
            URL 格式
          </button>
          <button
            :class="{ active: outputFormat === 'json' }"
            @click="outputFormat = 'json'"
          >
            JSON 格式
          </button>
          <button
            :class="{ active: outputFormat === 'curl' }"
            @click="outputFormat = 'curl'"
          >
            cURL 命令
          </button>
        </div>
        <textarea
          :value="formattedOutput"
          class="text-input result"
          readonly
          rows="8"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="copyOutput" class="btn-primary">复制结果</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const baseUrl = ref('https://api.example.com')
const httpMethod = ref('GET')
const parameters = ref([])
const outputFormat = ref('url')

const queryParameters = computed(() => {
  return parameters.value.filter(p => p.type === 'query' && p.name && p.value)
})

const bodyParameters = computed(() => {
  return parameters.value.filter(p => p.type === 'body' && p.name && p.value)
})

const formattedOutput = computed(() => {
  switch (outputFormat.value) {
    case 'url':
      return generateUrlFormat()
    case 'json':
      return generateJsonFormat()
    case 'curl':
      return generateCurlCommand()
    default:
      return ''
  }
})

function addParam() {
  parameters.value.push({
    name: '',
    value: '',
    type: 'query'
  })
  updateOutput()
}

function removeParam(index) {
  parameters.value.splice(index, 1)
  updateOutput()
}

function updateOutput() {
  // 自动更新输出
}

function generateUrlFormat() {
  if (!baseUrl.value) return ''

  let url = baseUrl.value
  const queryParams = queryParameters.value

  if (queryParams.length > 0) {
    const queryString = queryParams
      .map(p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value)}`)
      .join('&')
    url += url.includes('?') ? `&${queryString}` : `?${queryString}`
  }

  return url
}

function generateJsonFormat() {
  const bodyParams = bodyParameters.value
  if (bodyParams.length === 0) return '{}'

  const json = {}
  bodyParams.forEach(p => {
    try {
      json[p.name] = JSON.parse(p.value)
    } catch {
      json[p.name] = p.value
    }
  })
  return JSON.stringify(json, null, 2)
}

function generateCurlCommand() {
  let curl = `curl -X ${httpMethod.value} `

  const queryParams = queryParameters.value
  const bodyParams = bodyParameters.value

  if (queryParams.length > 0) {
    const queryString = queryParams
      .map(p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value)}`)
      .join('&')
    const url = baseUrl.value + (baseUrl.value.includes('?') ? `&${queryString}` : `?${queryString}`)
    curl += `"${url}" `
  } else {
    curl += `"${baseUrl.value}" `
  }

  if (bodyParams.length > 0) {
    const json = {}
    bodyParams.forEach(p => {
      try {
        json[p.name] = JSON.parse(p.value)
      } catch {
        json[p.name] = p.value
      }
    })
    curl += `-H "Content-Type: application/json" -d '${JSON.stringify(json)}'`
  }

  return curl
}

function copyOutput() {
  navigator.clipboard.writeText(formattedOutput.value)
}

function clearAll() {
  baseUrl.value = 'https://api.example.com'
  httpMethod.value = 'GET'
  parameters.value = []
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

.api-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
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

.text-input.result {
  background: #fafafa;
  font-family: monospace;
  white-space: pre-wrap;
}

.parameters-section {
  margin: 1.5rem 0;
}

.parameters-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.parameters-header {
  display: flex;
  background: #f0f0f0;
  padding: 0.75rem;
  font-weight: 500;
  border-radius: 6px 6px 0 0;
}

.parameter-row {
  display: flex;
  border-top: 1px solid #eee;
  padding: 0.75rem;
}

.header-cell,
.cell {
  flex: 1;
  padding: 0 0.5rem;
}

.action-cell {
  flex: 0 0 80px;
  display: flex;
  justify-content: flex-end;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.type-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-remove {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0 0 6px 6px;
  background: #10b981;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-add:hover {
  background: #059669;
}

.output-section {
  margin: 1.5rem 0;
}

.output-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.output-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.output-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.output-tabs button.active {
  background: #2563eb;
  color: white;
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

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .api-card {
  background: #262626;
}

.dark .select-input,
.dark .text-input,
.dark .edit-input,
.dark .type-select {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .parameters-header {
  background: #333;
}

.dark .parameter-row {
  border-top-color: #333;
}

.dark .btn-remove {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .btn-remove:hover {
  background: #991b1b;
}

.dark .output-tabs {
  background: #333;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

@media (max-width: 768px) {
  .parameters-header,
  .parameter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .action-cell {
    flex: 1;
    justify-content: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
