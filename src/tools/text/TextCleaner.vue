<template>
  <div class="tool-container">
    <h1 class="title">文本清理器</h1>
    <p class="description">去除文本中的多余空格、换行符、特殊字符等。</p>

    <div class="cleaner-card">
      <div class="form-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入需要清理的文本..."
          rows="10"
        ></textarea>
      </div>

      <div class="clean-options">
        <h3>清理选项</h3>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="options.trimSpaces" />
            <span>去除首尾空白</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeMultipleSpaces" />
            <span>合并连续空格</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeNewlines" />
            <span>去除换行符</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.normalizeNewlines" />
            <span>统一换行符 (LF)</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeTabs" />
            <span>去除 Tab 字符</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeEmptyLines" />
            <span>去除空行</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeSpecialChars" />
            <span>去除特殊字符</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeNumbers" />
            <span>去除数字</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removePunctuation" />
            <span>去除标点符号</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.toLowerCase" />
            <span>转为小写</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.toUpperCase" />
            <span>转为大写</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.addLineNumbers" />
            <span>添加行号</span>
          </label>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="cleanText" class="btn-primary">清理文本</button>
        <button @click="selectAll" class="btn-secondary">全选</button>
        <button @click="clearOptions" class="btn-secondary">清除选项</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="result-section">
        <div class="result-header">
          <label>清理结果：</label>
          <button @click="copyResult" class="btn-copy">复制</button>
        </div>
        <textarea
          :value="outputText"
          class="text-input result"
          readonly
          rows="10"
        ></textarea>
      </div>

      <div v-if="stats" class="stats-section">
        <h3>统计信息</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">原始字符</span>
            <span class="stat-value">{{ stats.originalChars }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">清理后字符</span>
            <span class="stat-value">{{ stats.cleanedChars }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">减少字符</span>
            <span class="stat-value">{{ stats.reducedChars }} ({{ stats.reductionPercent }}%)</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">原始行数</span>
            <span class="stat-value">{{ stats.originalLines }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">清理后行数</span>
            <span class="stat-value">{{ stats.cleanedLines }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputText = ref('')
const outputText = ref('')
const stats = ref(null)

const options = reactive({
  trimSpaces: true,
  removeMultipleSpaces: true,
  removeNewlines: false,
  normalizeNewlines: true,
  removeTabs: true,
  removeEmptyLines: true,
  removeSpecialChars: false,
  removeNumbers: false,
  removePunctuation: false,
  toLowerCase: false,
  toUpperCase: false,
  addLineNumbers: false
})

function cleanText() {
  if (!inputText.value) {
    outputText.value = ''
    stats.value = null
    return
  }

  let text = inputText.value

  const originalChars = text.length
  const originalLines = text.split('\n').length

  if (options.normalizeNewlines) {
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  }

  if (options.removeTabs) {
    text = text.replace(/\t/g, ' ')
  }

  if (options.removeNewlines) {
    text = text.replace(/\n/g, ' ')
  }

  if (options.removeMultipleSpaces) {
    text = text.replace(/ +/g, ' ')
  }

  if (options.trimSpaces) {
    text = text.trim()
  }

  if (options.removeEmptyLines) {
    text = text.split('\n').filter(line => line.trim()).join('\n')
  }

  if (options.removeSpecialChars) {
    text = text.replace(/[^\w\s\u4e00-\u9fa5]/g, '')
  }

  if (options.removeNumbers) {
    text = text.replace(/[0-9]/g, '')
  }

  if (options.removePunctuation) {
    text = text.replace(/[.,;:!?。，；：！？""''【】《》（）()\[\]{}]/g, '')
  }

  if (options.toLowerCase) {
    text = text.toLowerCase()
  }

  if (options.toUpperCase) {
    text = text.toUpperCase()
  }

  if (options.addLineNumbers) {
    text = text.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
  }

  outputText.value = text

  const cleanedChars = text.length
  const cleanedLines = text.split('\n').length

  stats.value = {
    originalChars,
    cleanedChars,
    reducedChars: originalChars - cleanedChars,
    reductionPercent: originalChars > 0 ? Math.round((1 - cleanedChars / originalChars) * 100) : 0,
    originalLines,
    cleanedLines
  }
}

function selectAll() {
  Object.keys(options).forEach(key => {
    options[key] = true
  })
}

function clearOptions() {
  Object.keys(options).forEach(key => {
    options[key] = false
  })
}

function copyResult() {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value)
  }
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  stats.value = null
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

.cleaner-card {
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

.clean-options {
  margin-bottom: 1.5rem;
}

.clean-options h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.option-item:hover {
  background: #f0f0f0;
}

.option-item input {
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

.result-section {
  margin-bottom: 1.5rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.result-header label {
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

.stats-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.stats-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .cleaner-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .option-item {
  background: #1a1a1a;
}

.dark .option-item:hover {
  background: #333;
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

.dark .stats-section {
  background: #1e3a5f;
}

.dark .stat-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-wrap: wrap;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
