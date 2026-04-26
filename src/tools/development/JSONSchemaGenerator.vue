<template>
  <div class="tool-container">
    <h1 class="title">JSON Schema 生成器</h1>
    <p class="description">根据 JSON 数据自动生成 JSON Schema，用于验证和数据文档化。</p>

    <div class="schema-card">
      <div class="form-group">
        <label>输入 JSON：</label>
        <textarea
          v-model="inputJson"
          class="text-input"
          placeholder="输入 JSON 数据，Schema 将根据其结构自动生成..."
          rows="8"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="generateSchema" class="btn-primary">生成 Schema</button>
        <button @click="validateJson" class="btn-secondary">验证 JSON</button>
        <button @click="copySchema" class="btn-secondary">复制 Schema</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="validationError" class="error-message">
        {{ validationError }}
      </div>

      <div class="form-group">
        <label>生成的 JSON Schema：</label>
        <textarea
          :value="generatedSchema"
          class="text-input result"
          readonly
          rows="12"
        ></textarea>
      </div>

      <div class="options-section">
        <h3>选项</h3>
        <div class="options-grid">
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.required" />
            <span>生成 required 字段</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.addDescriptions" />
            <span>添加描述信息</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.detectArrays" />
            <span>检测数组类型</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.generateExamples" />
            <span>生成示例值</span>
          </label>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>JSON Schema 简介</h3>
      <p>
        JSON Schema 是一个用于描述 JSON 数据结构的标准格式。它可以用来：
      </p>
      <ul>
        <li>验证 JSON 数据的结构和格式</li>
        <li>为 API 提供数据文档</li>
        <li>生成用户界面的表单和输入验证</li>
        <li>促进前后端的数据契约一致性</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const inputJson = ref('')
const generatedSchema = ref('')
const validationError = ref('')

const options = reactive({
  required: true,
  addDescriptions: true,
  detectArrays: true,
  generateExamples: true
})

function generateSchema() {
  validationError.value = ''

  if (!inputJson.value.trim()) {
    generatedSchema.value = ''
    return
  }

  try {
    const json = JSON.parse(inputJson.value)
    generatedSchema.value = JSON.stringify(generateFromValue(json, '#', ''), null, 2)
  } catch (e) {
    validationError.value = 'JSON 解析错误: ' + e.message
    generatedSchema.value = ''
  }
}

function generateFromValue(value, path, name) {
  const schema = {}

  if (name) {
    schema.title = name
  }

  if (value === null) {
    schema.type = 'null'
    if (options.generateExamples) schema.example = null
    return schema
  }

  if (Array.isArray(value)) {
    schema.type = 'array'

    if (options.detectArrays && value.length > 0) {
      const itemSchemas = value.map((item, index) => generateFromValue(item, `${path}/items/${index}`, ''))
      schema.items = mergeSchemas(itemSchemas)
    } else if (value.length === 0) {
      schema.items = {}
    }

    if (options.addDescriptions) {
      schema.description = `包含 ${value.length} 个元素的数组`
    }
    if (options.generateExamples) schema.example = value.slice(0, 3)

    return schema
  }

  if (typeof value === 'object') {
    schema.type = 'object'
    const properties = {}
    const required = []

    Object.keys(value).forEach(key => {
      properties[key] = generateFromValue(value[key], `${path}/properties/${key}`, key)
      if (options.required) {
        required.push(key)
      }
    })

    schema.properties = properties
    if (options.required && required.length > 0) {
      schema.required = required
    }

    if (options.generateExamples) schema.example = value

    return schema
  }

  if (typeof value === 'string') {
    schema.type = 'string'
    if (options.addDescriptions) {
      if (value.includes('@')) {
        schema.description = '电子邮件地址'
      } else if (/^https?:\/\//.test(value)) {
        schema.description = 'URL 地址'
      } else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        schema.description = '日期格式'
        schema.format = 'date'
      }
    }
    if (options.generateExamples) schema.example = value
    return schema
  }

  if (typeof value === 'number') {
    schema.type = Number.isInteger(value) ? 'integer' : 'number'
    if (options.generateExamples) schema.example = value
    return schema
  }

  if (typeof value === 'boolean') {
    schema.type = 'boolean'
    if (options.generateExamples) schema.example = value
    return schema
  }

  return schema
}

function mergeSchemas(schemas) {
  if (schemas.length === 0) return {}
  if (schemas.length === 1) return schemas[0]

  const first = schemas[0]
  const merged = { ...first }

  if (first.type === 'object' && first.properties) {
    const allKeys = new Set()
    schemas.forEach(s => {
      if (s.properties) {
        Object.keys(s.properties).forEach(k => allKeys.add(k))
      }
    })

    merged.properties = {}
    allKeys.forEach(key => {
      const values = schemas.map(s => s.properties?.[key]).filter(Boolean)
      if (values.length === 1) {
        merged.properties[key] = values[0]
      } else {
        merged.properties[key] = mergeSchemas(values)
      }
    })
  }

  return merged
}

function validateJson() {
  validationError.value = ''

  if (!inputJson.value.trim()) {
    validationError.value = '请输入 JSON 数据'
    return
  }

  try {
    JSON.parse(inputJson.value)
    validationError.value = ''
    alert('JSON 格式有效!')
  } catch (e) {
    validationError.value = 'JSON 解析错误: ' + e.message
  }
}

function copySchema() {
  if (generatedSchema.value) {
    navigator.clipboard.writeText(generatedSchema.value)
  }
}

function clearAll() {
  inputJson.value = ''
  generatedSchema.value = ''
  validationError.value = ''
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

.schema-card {
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

.options-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
}

.options-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.option-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
  line-height: 1.6;
}

.info-section ul {
  padding-left: 1.5rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.5rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .schema-card,
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

.dark .options-section {
  border-top-color: #404040;
}

.dark .info-section p,
.dark .info-section li {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
