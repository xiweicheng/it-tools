<template>
  <div class="tool-container">
    <h1 class="title">HTML 表格生成器</h1>
    <p class="description">根据 JSON 数据或手动输入生成 HTML 表格代码。</p>

    <div class="generator-card">
      <div class="input-section">
        <div class="tabs">
          <button
            :class="{ active: inputMode === 'json' }"
            @click="inputMode = 'json'"
          >
            JSON 模式
          </button>
          <button
            :class="{ active: inputMode === 'manual' }"
            @click="inputMode = 'manual'"
          >
            手动模式
          </button>
        </div>

        <div v-if="inputMode === 'json'" class="json-input">
          <label>输入 JSON 数据</label>
          <textarea
            v-model="jsonInput"
            class="text-input"
            placeholder='[{"name": "张三", "age": 28}, {"name": "李四", "age": 34}]'
            rows="8"
          ></textarea>
        </div>

        <div v-else class="manual-input">
          <div class="form-group">
            <label>列定义 (逗号分隔)</label>
            <input
              v-model="columns"
              type="text"
              class="text-input"
              placeholder="姓名, 年龄, 城市"
            />
          </div>
          <div class="form-group">
            <label>数据行 (每行用换行分隔，列用逗号分隔)</label>
            <textarea
              v-model="manualData"
              class="text-input"
              placeholder="张三, 28, 北京&#10;李四, 34, 上海"
              rows="6"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="options-section">
        <h3>表格选项</h3>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="options.bordered" />
            <span>带边框</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.striped" />
            <span>斑马纹</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.hover" />
            <span>悬停高亮</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.condensed" />
            <span>紧凑型</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.header" />
            <span>显示表头</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.indexColumn" />
            <span>序号列</span>
          </label>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="generateTable" class="btn-primary">生成表格</button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="error" class="error-section">
        <p>{{ error }}</p>
      </div>

      <div v-if="tableHTML" class="output-section">
        <div class="output-header">
          <label>生成的 HTML</label>
          <button @click="copyHTML" class="btn-copy">复制</button>
        </div>
        <pre class="code-output">{{ tableHTML }}</pre>
      </div>

      <div v-if="previewHTML" class="preview-section">
        <h3>预览效果</h3>
        <div class="table-wrapper" v-html="previewHTML"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputMode = ref('json')
const jsonInput = ref('')
const columns = ref('')
const manualData = ref('')
const error = ref('')
const tableHTML = ref('')
const previewHTML = ref('')

const options = ref({
  bordered: true,
  striped: false,
  hover: true,
  condensed: false,
  header: true,
  indexColumn: false
})

function generateTable() {
  error.value = ''
  tableHTML.value = ''
  previewHTML.value = ''

  let headers = []
  let data = []

  if (inputMode.value === 'json') {
    if (!jsonInput.value.trim()) {
      error.value = '请输入 JSON 数据'
      return
    }

    try {
      const jsonData = JSON.parse(jsonInput.value)
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        error.value = 'JSON 数据必须是数组格式'
        return
      }
      headers = Object.keys(jsonData[0])
      data = jsonData
    } catch (e) {
      error.value = 'JSON 解析错误: ' + e.message
      return
    }
  } else {
    if (!columns.value || !manualData.value) {
      error.value = '请填写完整的列定义和数据'
      return
    }
    headers = columns.value.split(',').map(h => h.trim())
    data = manualData.value.split('\n').map(row =>
      row.split(',').map(cell => cell.trim())
    )
  }

  const classes = []
  if (options.value.bordered) classes.push('table-bordered')
  if (options.value.striped) classes.push('table-striped')
  if (options.value.hover) classes.push('table-hover')
  if (options.value.condensed) classes.push('table-condensed')

  const tableClass = classes.length > 0 ? ` class="${classes.join(' ')}"` : ''

  let html = `<table${tableClass}>\n`

  if (options.value.header) {
    html += '  <thead>\n    <tr>\n'
    if (options.value.indexColumn) {
      html += '      <th>#</th>\n'
    }
    headers.forEach(h => {
      html += `      <th>${h}</th>\n`
    })
    html += '    </tr>\n  </thead>\n'
  }

  html += '  <tbody>\n'

  data.forEach((row, index) => {
    html += '    <tr>\n'
    if (options.value.indexColumn) {
      html += `      <td>${index + 1}</td>\n`
    }
    if (inputMode.value === 'json') {
      headers.forEach(h => {
        html += `      <td>${row[h] ?? ''}</td>\n`
      })
    } else {
      row.forEach(cell => {
        html += `      <td>${cell}</td>\n`
      })
    }
    html += '    </tr>\n'
  })

  html += '  </tbody>\n</table>'

  tableHTML.value = html
  previewHTML.value = `<style>
.table-bordered { border-collapse: collapse; width: 100%; }
.table-bordered th, .table-bordered td { border: 1px solid #ddd; padding: 8px; }
.table-striped tr:nth-child(even) { background: #f9f9f9; }
.table-hover tr:hover { background: #f5f5f5; }
.table-condensed th, .table-condensed td { padding: 4px; }
</style>${html}`
}

function loadSample() {
  if (inputMode.value === 'json') {
    jsonInput.value = JSON.stringify([
      { "产品": "iPhone 15", "价格": "¥5999", "库存": 128 },
      { "产品": "MacBook Pro", "价格": "¥14999", "库存": 64 },
      { "产品": "AirPods Pro", "价格": "¥1899", "库存": 256 }
    ], null, 2)
  } else {
    columns.value = '产品, 价格, 库存'
    manualData.value = 'iPhone 15, ¥5999, 128\nMacBook Pro, ¥14999, 64\nAirPods Pro, ¥1899, 256'
  }
  generateTable()
}

function copyHTML() {
  if (tableHTML.value) {
    navigator.clipboard.writeText(tableHTML.value)
  }
}

function clearAll() {
  jsonInput.value = ''
  columns.value = ''
  manualData.value = ''
  error.value = ''
  tableHTML.value = ''
  previewHTML.value = ''
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

.generator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.tabs {
  display: flex;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
}

.tabs button.active {
  background: #2563eb;
  color: white;
}

.json-input label,
.manual-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
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
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
}

.options-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
}

.option-item input {
  width: 18px;
  height: 18px;
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
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
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

.code-output {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  max-height: 300px;
}

.preview-section h3 {
  margin-bottom: 1rem;
}

.table-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.table-wrapper :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.table-wrapper :deep(th),
.table-wrapper :deep(td) {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.table-wrapper :deep(th) {
  background: #f5f5f5;
  font-weight: 600;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .generator-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .tabs {
  background: #333;
}

.dark .option-item {
  background: #262626;
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

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
