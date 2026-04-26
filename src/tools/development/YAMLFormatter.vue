<template>
  <div class="tool-container">
    <h1 class="title">YAML 格式化工具</h1>
    <p class="description">对 YAML 进行格式化和压缩，支持 YAML 与 JSON 互转。</p>

    <div class="yaml-card">
      <div class="form-group">
        <label>输入 YAML：</label>
        <textarea
          v-model="inputYaml"
          class="text-input"
          placeholder="输入 YAML 内容..."
          rows="8"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="formatYaml" class="btn-primary">格式化</button>
        <button @click="minifyYaml" class="btn-secondary">压缩</button>
        <button @click="yamlToJson" class="btn-secondary">转 JSON</button>
        <button @click="copyYaml" class="btn-secondary">复制</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-group">
        <label>结果：</label>
        <textarea
          :value="outputYaml"
          class="text-input result"
          readonly
          rows="10"
        ></textarea>
      </div>
    </div>

    <div class="info-section">
      <h3>YAML 简介</h3>
      <p>YAML (YAML Ain't Markup Language) 是一种人类可读的数据序列化格式，常用于：</p>
      <ul>
        <li>配置文件（如 Docker Compose、Kubernetes）</li>
        <li>数据交换格式</li>
        <li>日志文件</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputYaml = ref('')
const outputYaml = ref('')
const error = ref('')

function formatYaml() {
  error.value = ''
  if (!inputYaml.value.trim()) {
    outputYaml.value = ''
    return
  }

  try {
    const parsed = parseYaml(inputYaml.value)
    outputYaml.value = yaml.stringify(parsed, { indent: 2, lineWidth: 0 })
  } catch (e) {
    error.value = 'YAML 解析错误: ' + e.message
  }
}

function minifyYaml() {
  error.value = ''
  if (!inputYaml.value.trim()) {
    outputYaml.value = ''
    return
  }

  try {
    const parsed = parseYaml(inputYaml.value)
    outputYaml.value = yaml.stringify(parsed, { indent: 0, lineWidth: 0 })
  } catch (e) {
    error.value = 'YAML 压缩错误: ' + e.message
  }
}

function yamlToJson() {
  error.value = ''
  if (!inputYaml.value.trim()) {
    return
  }

  try {
    const parsed = parseYaml(inputYaml.value)
    outputYaml.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    error.value = 'JSON 转换错误: ' + e.message
  }
}

function parseYaml(yamlStr) {
  const lines = yamlStr.split('\n')
  const result = {}
  const stack = [{ obj: result, indent: -1 }]
  let currentArray = null

  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const indent = line.search(/\S/)
    const isArrayItem = trimmed.startsWith('- ')

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    if (isArrayItem) {
      const key = trimmed.substring(2).trim()
      const colonIndex = key.indexOf(':')

      if (colonIndex === -1) {
        if (Array.isArray(parent)) {
          parent.push(parseValue(key))
        } else {
          const arr = []
          parent[key] = arr
          stack.push({ obj: arr, indent })
        }
      } else {
        const k = key.substring(0, colonIndex).trim()
        const v = key.substring(colonIndex + 1).trim()
        const newObj = {}
        newObj[k] = parseValue(v)
        parent.push(newObj)
        stack.push({ obj: newObj, indent })
      }
    } else {
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex === -1) continue

      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()

      if (value === '' || value === '|' || value === '>') {
        parent[key] = {}
        stack.push({ obj: parent[key], indent })
      } else {
        parent[key] = parseValue(value)
      }
    }
  }

  return result
}

function parseValue(str) {
  if (str === 'true') return true
  if (str === 'false') return false
  if (str === 'null' || str === '~') return null
  if (/^-?\d+$/.test(str)) return parseInt(str)
  if (/^-?\d+\.\d+$/.test(str)) return parseFloat(str)
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1)
  }
  return str
}

const yaml = {
  stringify(obj, options = {}) {
    const indent = options.indent || 2
    const lineWidth = options.lineWidth || 80

    function toYaml(obj, level = 0) {
      if (obj === null || obj === undefined) return 'null'
      if (typeof obj === 'boolean') return obj ? 'true' : 'false'
      if (typeof obj === 'number') return String(obj)
      if (typeof obj === 'string') {
        if (obj.includes('\n') || obj.length > lineWidth) {
          return '|\n' + obj.split('\n').map(l => ' '.repeat(indent) + l).join('\n')
        }
        return `"${obj}"`
      }
      if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]'
        return obj.map(item => {
          const prefix = ' '.repeat(indent)
          const content = toYaml(item, level + 1)
          if (typeof item === 'object' && item !== null) {
            return prefix + '- ' + content.split('\n').join('\n' + prefix + '  ')
          }
          return prefix + '- ' + content
        }).join('\n')
      }
      if (typeof obj === 'object') {
        const keys = Object.keys(obj)
        if (keys.length === 0) return '{}'
        return keys.map(k => {
          const prefix = ' '.repeat(indent)
          return prefix + k + ': ' + toYaml(obj[k], level + 1)
        }).join('\n')
      }
      return String(obj)
    }

    return toYaml(obj)
  }
}

function copyYaml() {
  if (outputYaml.value) {
    navigator.clipboard.writeText(outputYaml.value)
  }
}

function clearAll() {
  inputYaml.value = ''
  outputYaml.value = ''
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

.yaml-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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

.text-input.result {
  background: #fafafa;
  white-space: pre-wrap;
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

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-section p {
  color: #666;
  line-height: 1.5;
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

.dark .yaml-card,
.dark .info-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .info-section p,
.dark .info-section li {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
}
</style>
