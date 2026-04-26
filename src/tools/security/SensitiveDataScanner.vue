<template>
  <div class="tool-container">
    <h1 class="title">敏感信息扫描器</h1>
    <p class="description">检测文本或代码中可能暴露的敏感信息，如 API Key、邮箱、电话等。</p>

    <div class="scanner-card">
      <div class="form-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入需要扫描的文本或代码..."
          rows="10"
        ></textarea>
      </div>

      <div class="scan-options">
        <label class="option-title">扫描类型：</label>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.apiKey" />
            <span>API Key</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.email" />
            <span>邮箱地址</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.phone" />
            <span>电话号码</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.idCard" />
            <span>身份证号</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.creditCard" />
            <span>信用卡号</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="scanTypes.privateKey" />
            <span>私钥</span>
          </label>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="startScan" class="btn-primary">开始扫描</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <h3>扫描结果 <span class="result-count">({{ results.length }} 处敏感信息)</span></h3>
        <div class="results-list">
          <div v-for="(result, index) in results" :key="index" class="result-item">
            <div class="result-header">
              <span class="result-type">{{ result.type }}</span>
              <span class="result-risk" :class="result.risk">{{ result.risk === 'high' ? '高风险' : result.risk === 'medium' ? '中风险' : '低风险' }}</span>
            </div>
            <div class="result-content">
              <code>{{ result.value }}</code>
              <button @click="copyResult(result.value)" class="btn-copy">复制</button>
            </div>
            <div class="result-position">位置: 第 {{ result.line }} 行, 第 {{ result.column }} 列</div>
          </div>
        </div>
      </div>

      <div v-else-if="scanned && results.length === 0" class="no-results">
        <span class="success-icon">✓</span>
        <p>未检测到敏感信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputText = ref('')
const results = ref([])
const scanned = ref(false)

const scanTypes = reactive({
  apiKey: true,
  email: true,
  phone: true,
  idCard: true,
  creditCard: true,
  privateKey: true
})

const patterns = {
  apiKey: {
    pattern: /(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?token|auth[_-]?token)["\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
    type: 'API Key',
    risk: 'high'
  },
  email: {
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    type: '邮箱地址',
    risk: 'low'
  },
  phone: {
    pattern: /1[3-9]\d{9}/g,
    type: '电话号码',
    risk: 'medium'
  },
  idCard: {
    pattern: /[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g,
    type: '身份证号',
    risk: 'high'
  },
  creditCard: {
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    type: '信用卡号',
    risk: 'high'
  },
  privateKey: {
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    type: '私钥',
    risk: 'high'
  }
}

function startScan() {
  results.value = []
  scanned.value = false

  if (!inputText.value.trim()) {
    return
  }

  const lines = inputText.value.split('\n')

  for (const [key, config] of Object.entries(patterns)) {
    if (!scanTypes[key]) continue

    const matches = inputText.value.match(config.pattern) || []

    for (const match of matches) {
      const position = findPosition(match, inputText.value)
      results.value.push({
        type: config.type,
        value: match,
        risk: config.risk,
        line: position.line,
        column: position.column
      })
    }
  }

  results.value.sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2 }
    return riskOrder[a.risk] - riskOrder[b.risk]
  })

  scanned.value = true
}

function findPosition(match, text) {
  const index = text.indexOf(match)
  const beforeMatch = text.substring(0, index)
  const lines = beforeMatch.split('\n')
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  }
}

function copyResult(value) {
  navigator.clipboard.writeText(value)
}

function clearAll() {
  inputText.value = ''
  results.value = []
  scanned.value = false
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

.scanner-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
  resize: vertical;
}

.scan-options {
  margin-bottom: 1.5rem;
}

.option-title {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-item input {
  width: 18px;
  height: 18px;
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
  background: #dc2626;
  color: white;
}

.btn-primary:hover {
  background: #b91c1c;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.results-section {
  margin-top: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.result-count {
  color: #666;
  font-weight: normal;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid;
}

.result-item .result-type {
  font-weight: 600;
  color: #333;
}

.result-risk {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}

.result-risk.high {
  background: #fee2e2;
  color: #dc2626;
  border-left-color: #dc2626;
}

.result-risk.medium {
  background: #fef3c7;
  color: #d97706;
  border-left-color: #d97706;
}

.result-risk.low {
  background: #dbeafe;
  color: #2563eb;
  border-left-color: #2563eb;
}

.result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
}

.result-content code {
  font-family: monospace;
  font-size: 0.95rem;
  color: #666;
  word-break: break-all;
}

.btn-copy {
  padding: 0.25rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-copy:hover {
  background: #e5e5e5;
}

.result-position {
  font-size: 0.85rem;
  color: #999;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background: #dcfce7;
  border-radius: 8px;
  color: #166534;
}

.success-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .scanner-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .result-item {
  background: #1a1a1a;
}

.dark .result-type {
  color: #e5e5e5;
}

.dark .result-content code {
  color: #a3a3a3;
}

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
