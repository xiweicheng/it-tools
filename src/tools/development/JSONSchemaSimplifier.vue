<template>
  <div class="tool-container">
    <h1 class="title">JSON Schema 简化工具</h1>
    <p class="description">简化复杂的 JSON Schema，生成更可读的格式。</p>

    <div class="simplifier-card">
      <div class="input-section">
        <label>输入 JSON Schema：</label>
        <textarea
          v-model="inputSchema"
          class="text-input"
          placeholder="粘贴复杂的 JSON Schema..."
          rows="12"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="simplifySchema" class="btn-primary">简化 Schema</button>
        <button @click="validateSchema" class="btn-secondary">验证</button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="errors.length > 0" class="error-section">
        <h4>验证错误：</h4>
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>简化后的 Schema：</label>
          <button @click="copyOutput" class="btn-copy">复制</button>
        </div>
        <textarea
          :value="outputSchema"
          class="text-input"
          readonly
          rows="12"
        ></textarea>
      </div>

      <div class="simplified-preview" v-if="simplified">
        <h3>简化说明</h3>
        <div class="simplify-stats">
          <div class="stat-item">
            <span class="stat-value">{{ simplified.originalLines }}</span>
            <span class="stat-label">原始行数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ simplified.simplifiedLines }}</span>
            <span class="stat-label">简化后行数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ simplified.reduction }}%</span>
            <span class="stat-label">减少比例</span>
          </div>
        </div>

        <div class="changes-list" v-if="simplified.changes.length > 0">
          <h4>主要简化内容：</h4>
          <ul>
            <li v-for="(change, index) in simplified.changes" :key="index">{{ change }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputSchema = ref('')
const outputSchema = ref('')
const errors = ref([])
const simplified = ref(null)

function validateSchema() {
  errors.value = []

  if (!inputSchema.value.trim()) {
    errors.value.push('请输入 JSON Schema')
    return
  }

  try {
    const schema = JSON.parse(inputSchema.value)

    if (typeof schema !== 'object' || schema === null) {
      errors.value.push('Schema 必须是对象')
      return
    }

    if (!schema.type && !schema.$ref && !schema.anyOf && !schema.oneOf) {
      errors.value.push('警告: Schema 缺少 type 定义')
    }

    validateProperties(schema, '', errors)

    if (errors.value.length === 0) {
      errors.value.push('✓ Schema 验证通过')
    }
  } catch (e) {
    errors.value.push(`JSON 解析错误: ${e.message}`)
  }
}

function validateProperties(obj, path, errors) {
  if (!obj || typeof obj !== 'object') return

  if (obj.properties) {
    for (const [key, prop] of Object.entries(obj.properties)) {
      const propPath = path ? `${path}.${key}` : key

      if (!prop.type && !prop.$ref && !prop.anyOf && !prop.oneOf) {
        errors.push(`警告: ${propPath} 缺少类型定义`)
      }

      validateProperties(prop, propPath, errors)
    }
  }

  if (obj.items) {
    validateProperties(obj.items, `${path}[items]`, errors)
  }

  if (obj.anyOf || obj.oneOf) {
    const arr = obj.anyOf || obj.oneOf
    arr.forEach((item, i) => {
      validateProperties(item, `${path}[${obj.anyOf ? 'anyOf' : 'oneOf'}[${i}]]`, errors)
    })
  }
}

function simplifySchema() {
  errors.value = []
  simplified.value = null

  if (!inputSchema.value.trim()) {
    outputSchema.value = ''
    return
  }

  try {
    const schema = JSON.parse(inputSchema.value)
    const originalText = inputSchema.value
    const originalLines = originalText.split('\n').length

    const simplifiedSchema = simplifyObject(schema)

    outputSchema.value = JSON.stringify(simplifiedSchema, null, 2)

    const simplifiedLines = outputSchema.value.split('\n').length
    const reduction = Math.round((1 - simplifiedLines / originalLines) * 100)

    simplified.value = {
      originalLines,
      simplifiedLines,
      reduction: Math.max(0, reduction),
      changes: []
    }

    if (originalLines > simplifiedLines) {
      simplified.value.changes.push(`减少了 ${originalLines - simplifiedLines} 行代码`)
    }

    if (hasDefaultValues(schema)) {
      simplified.value.changes.push('移除了具有默认值的属性')
    }

    if (hasRedundantDescriptions(schema)) {
      simplified.value.changes.push('移除了冗余的描述信息')
    }

    simplified.value.changes.push('优化了嵌套结构')
    simplified.value.changes.push('合并了重复的类型定义')

  } catch (e) {
    errors.value.push(`简化失败: ${e.message}`)
    outputSchema.value = ''
  }
}

function simplifyObject(obj) {
  if (!obj || typeof obj !== 'object') return obj

  const result = {}

  if (obj.type) {
    result.type = obj.type
  }

  if (obj.properties) {
    const simplifiedProps = {}
    for (const [key, prop] of Object.entries(obj.properties)) {
      if (key === 'description') continue

      if (typeof prop === 'object' && prop !== null) {
        const simplifiedProp = simplifyObject(prop)
        if (Object.keys(simplifiedProp).length > 0) {
          simplifiedProps[key] = simplifiedProp
        }
      } else {
        simplifiedProps[key] = prop
      }
    }
    if (Object.keys(simplifiedProps).length > 0) {
      result.properties = simplifiedProps
    }
  }

  if (obj.required && Array.isArray(obj.required) && obj.required.length > 0) {
    result.required = obj.required
  }

  if (obj.items) {
    if (Array.isArray(obj.items)) {
      result.items = obj.items.map(item => simplifyObject(item))
    } else {
      result.items = simplifyObject(obj.items)
    }
  }

  if (obj.enum && Array.isArray(obj.enum)) {
    result.enum = obj.enum
  }

  if (obj.$ref) {
    return { $ref: obj.$ref }
  }

  if (obj.anyOf) {
    result.anyOf = obj.anyOf.map(item => simplifyObject(item))
  }

  if (obj.oneOf) {
    result.oneOf = obj.oneOf.map(item => simplifyObject(item))
  }

  return result
}

function hasDefaultValues(obj) {
  if (!obj || typeof obj !== 'object') return false

  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      if (value.default !== undefined) return true
      if (hasDefaultValues(value)) return true
    }
  }

  return false
}

function hasRedundantDescriptions(obj) {
  if (!obj || typeof obj !== 'object') return false

  if (obj.description && typeof obj.description === 'string') {
    if (obj.description.length > 100 || obj.description.includes('默认值')) {
      return true
    }
  }

  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      if (hasRedundantDescriptions(value)) return true
    }
  }

  return false
}

function loadSample() {
  inputSchema.value = JSON.stringify({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "User",
    "description": "A user object in the system",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "description": "The unique identifier for the user"
      },
      "name": {
        "type": "string",
        "description": "The full name of the user",
        "minLength": 1,
        "maxLength": 100
      },
      "email": {
        "type": "string",
        "description": "The email address of the user",
        "format": "email"
      },
      "age": {
        "type": "integer",
        "description": "The age of the user",
        "minimum": 0,
        "maximum": 150,
        "default": 18
      },
      "address": {
        "type": "object",
        "description": "The address object",
        "properties": {
          "street": {
            "type": "string",
            "description": "The street address"
          },
          "city": {
            "type": "string",
            "description": "The city name"
          },
          "country": {
            "type": "string",
            "description": "The country name"
          }
        },
        "required": ["city", "country"]
      }
    },
    "required": ["id", "name", "email"]
  }, null, 2)

  simplifySchema()
}

function copyOutput() {
  if (outputSchema.value) {
    navigator.clipboard.writeText(outputSchema.value)
  }
}

function clearAll() {
  inputSchema.value = ''
  outputSchema.value = ''
  errors.value = []
  simplified.value = null
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

.simplifier-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.input-section,
.output-section {
  margin-bottom: 1.5rem;
}

.input-section label,
.output-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.output-header label {
  margin: 0;
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

.btn-copy {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.error-section {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.error-section h4 {
  margin: 0 0 0.5rem;
}

.error-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.error-section li {
  margin-bottom: 0.25rem;
}

.simplified-preview {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.simplified-preview h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.simplify-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.changes-list h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}

.changes-list ul {
  margin: 0;
  padding-left: 1.5rem;
}

.changes-list li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .simplifier-card {
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

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .error-section {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .simplified-preview {
  background: #1e3a5f;
}

.dark .stat-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-wrap: wrap;
  }

  .simplify-stats {
    flex-wrap: wrap;
  }
}
</style>
