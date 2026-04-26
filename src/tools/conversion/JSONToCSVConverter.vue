<template>
  <div class="tool-container">
    <h1 class="title">JSON 转 CSV 转换器</h1>
    <p class="description">将 JSON 数据转换为 CSV 格式，方便在 Excel 等电子表格软件中打开。</p>

    <div class="converter-card">
      <div class="input-section">
        <label>输入 JSON 数据</label>
        <textarea
          v-model="jsonInput"
          class="text-input"
          placeholder='[{"name": "张三", "age": 25}, {"name": "李四", "age": 30}]'
          rows="10"
        ></textarea>
      </div>

      <div class="options-section">
        <div class="option-group">
          <label>
            <input type="checkbox" v-model="includeHeaders" />
            包含表头
          </label>
        </div>
        <div class="option-group">
          <label>
            <input type="checkbox" v-model="flatNestedObjects" />
            扁平化嵌套对象
          </label>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="convert" class="btn-primary">转换为 CSV</button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="error" class="error-section">
        <p>{{ error }}</p>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>CSV 输出</label>
          <button @click="copyCSV" class="btn-copy">复制</button>
        </div>
        <textarea
          :value="csvOutput"
          class="text-input result"
          readonly
          rows="12"
        ></textarea>
      </div>

      <div v-if="previewData.length > 0" class="preview-section">
        <h3>数据预览</h3>
        <div class="table-wrapper">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="header in previewHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in previewData" :key="index">
                <td v-for="header in previewHeaders" :key="header">{{ row[header] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const jsonInput = ref('')
const csvOutput = ref('')
const error = ref('')
const includeHeaders = ref(true)
const flatNestedObjects = ref(true)
const previewData = ref([])

const previewHeaders = computed(() => {
  if (previewData.value.length === 0) return []
  return Object.keys(previewData.value[0])
})

function convert() {
  error.value = ''
  csvOutput.value = ''
  previewData.value = []

  if (!jsonInput.value.trim()) {
    error.value = '请输入 JSON 数据'
    return
  }

  try {
    const jsonData = JSON.parse(jsonInput.value)

    if (!Array.isArray(jsonData)) {
      error.value = 'JSON 数据必须是数组格式'
      return
    }

    let data = jsonData

    if (flatNestedObjects.value) {
      data = jsonData.map(item => flattenObject(item))
    }

    const headers = includeHeaders.value ? Object.keys(data[0]) : []
    const rows = data.map(item => headers.map(h => escapeCSVValue(item[h])))

    if (includeHeaders.value) {
      csvOutput.value = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    } else {
      csvOutput.value = rows.map(r => r.join(',')).join('\n')
    }

    previewData.value = data.slice(0, 10)

  } catch (e) {
    error.value = 'JSON 解析错误: ' + e.message
  }
}

function flattenObject(obj, prefix = '') {
  const result = {}

  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value)
    } else {
      result[newKey] = value
    }
  }

  return result
}

function escapeCSVValue(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function loadSample() {
  jsonInput.value = JSON.stringify([
    { "name": "张三", "age": 28, "city": "北京", "score": 95.5 },
    { "name": "李四", "age": 34, "city": "上海", "score": 87.3 },
    { "name": "王五", "age": 22, "city": "广州", "score": 92.8 }
  ], null, 2)
  convert()
}

function copyCSV() {
  if (csvOutput.value) {
    navigator.clipboard.writeText(csvOutput.value)
  }
}

function clearAll() {
  jsonInput.value = ''
  csvOutput.value = ''
  error.value = ''
  previewData.value = []
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

.converter-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-section label {
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

.options-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.option-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
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

.error-section {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.output-section {
  margin-bottom: 1.5rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.output-header label {
  font-weight: 500;
}

.btn-copy {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-input.result {
  border: 2px solid #10b981;
  background: #faffff;
}

.preview-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 8px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.preview-table th {
  background: #f5f5f5;
  font-weight: 600;
  font-size: 0.9rem;
}

.preview-table td {
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card {
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

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .table-wrapper {
  background: #1a1a1a;
}

.dark .preview-table th {
  background: #333;
}

@media (max-width: 768px) {
  .options-section {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>
