<template>
  <div class="tool-container">
    <h1 class="title">UUID 格式转换工具</h1>
    <p class="description">在不同 UUID 格式之间进行转换和验证，支持标准 UUID、紧凑格式和 URI 格式。</p>

    <div class="uuid-card">
      <div class="form-group">
        <label>输入 UUID：</label>
        <input
          v-model="inputUuid"
          type="text"
          class="text-input"
          placeholder="输入 UUID，例如: 550e8400-e29b-41d4-a716-446655440000"
        />
      </div>

      <div class="action-buttons">
        <button @click="formatUuid" class="btn-primary">格式转换</button>
        <button @click="validateUuid" class="btn-secondary">验证 UUID</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="validationResult" class="validation-result">
        <div :class="{ valid: isValid, invalid: !isValid }">
          {{ isValid ? '✓ 有效的 UUID' : '✗ 无效的 UUID' }}
        </div>
      </div>

      <div class="results-section">
        <h3>转换结果</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="result-label">标准格式</div>
            <div class="result-value">
              <code>{{ formats.standard }}</code>
              <button @click="copyToClipboard(formats.standard)" class="btn-copy-small">复制</button>
            </div>
          </div>

          <div class="result-item">
            <div class="result-label">紧凑格式 (无连字符)</div>
            <div class="result-value">
              <code>{{ formats.compact }}</code>
              <button @click="copyToClipboard(formats.compact)" class="btn-copy-small">复制</button>
            </div>
          </div>

          <div class="result-item">
            <div class="result-label">URN 格式</div>
            <div class="result-value">
              <code>{{ formats.urn }}</code>
              <button @click="copyToClipboard(formats.urn)" class="btn-copy-small">复制</button>
            </div>
          </div>

          <div class="result-item">
            <div class="result-label">大写格式</div>
            <div class="result-value">
              <code>{{ formats.uppercase }}</code>
              <button @click="copyToClipboard(formats.uppercase)" class="btn-copy-small">复制</button>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>UUID 结构说明</h3>
        <p>UUID (通用唯一标识符) 是 128 位的数字，用于唯一标识信息。标准格式为：</p>
        <pre>550e8400-e29b-41d4-a716-446655440000</pre>
        <p>分为 5 个部分：</p>
        <ul>
          <li>时间低位：550e8400</li>
          <li>时间中位：e29b</li>
          <li>时间高位（带版本）：41d4</li>
          <li>变体位：a716</li>
          <li>节点位：446655440000</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputUuid = ref('')
const validationResult = ref(false)
const isValid = ref(false)

const formats = reactive({
  standard: '',
  compact: '',
  urn: '',
  uppercase: ''
})

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

function formatUuid() {
  if (!inputUuid.value) return

  let cleanUuid = inputUuid.value.trim()

  formats.standard = cleanUuid.toLowerCase()
  formats.compact = cleanUuid.replace(/-/g, '').toLowerCase()
  formats.urn = 'urn:uuid:' + cleanUuid.toLowerCase()
  formats.uppercase = cleanUuid.toUpperCase()
}

function validateUuid() {
  if (!inputUuid.value) return

  validationResult.value = true
  isValid.value = isValidUUID(inputUuid.value.trim())
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
}

function clearAll() {
  inputUuid.value = ''
  validationResult.value = false
  isValid.value = false
  formats.standard = ''
  formats.compact = ''
  formats.urn = ''
  formats.uppercase = ''
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 800px;
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

.uuid-card {
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

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: monospace;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
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

.validation-result {
  margin: 1.5rem 0;
  text-align: center;
}

.validation-result .valid {
  padding: 1rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  font-weight: 500;
}

.validation-result .invalid {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-weight: 500;
}

.results-section {
  margin: 2rem 0;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.result-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.result-value code {
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
  color: #2563eb;
}

.btn-copy-small {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #dbeafe;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-copy-small:hover {
  background: #bfdbfe;
}

.info-section {
  margin-top: 2rem;
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.info-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.info-section p {
  color: #666;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.info-section pre {
  background: #f5f5f5;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.info-section ul {
  padding-left: 1.5rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.25rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .uuid-card,
.dark .info-section {
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

.dark .validation-result .valid {
  background: #14532d;
  color: #86efac;
}

.dark .validation-result .invalid {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .result-item {
  background: #1a1a1a;
  border-color: #333;
}

.dark .result-value code {
  color: #60a5fa;
}

.dark .btn-copy-small {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark .btn-copy-small:hover {
  background: #1e40af;
}

.dark .info-section pre {
  background: #1a1a1a;
}

.dark .info-section p,
.dark .info-section li {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .result-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
