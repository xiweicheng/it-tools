<template>
  <div class="tool-container">
    <h1 class="title">文本排序工具</h1>
    <p class="description">对文本进行升序或降序排序，支持按行、字母、数字等方式排序。</p>

    <div class="input-section">
      <div class="panel-header">
        <span>输入文本（每行一个）</span>
        <button @click="clearInput" class="btn-small">清空</button>
      </div>
      <textarea
        v-model="inputText"
        class="text-input"
        placeholder="输入要排序的文本，每行一个..."
      ></textarea>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>排序方式：</label>
        <select v-model="sortType" class="select-input">
          <option value="line">按行排序</option>
          <option value="alpha">按字母排序</option>
          <option value="length">按长度排序</option>
          <option value="number">按数字排序</option>
        </select>
      </div>

      <div class="control-group">
        <label>排序顺序：</label>
        <select v-model="sortOrder" class="select-input">
          <option value="asc">升序 (A → Z)</option>
          <option value="desc">降序 (Z → A)</option>
        </select>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="caseSensitive" />
          区分大小写
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="removeDuplicates" />
          去除重复项
        </label>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="sortText" class="btn-primary">开始排序</button>
      <button @click="shuffleText" class="btn-secondary">随机打乱</button>
    </div>

    <div v-if="sortedText" class="result-section">
      <div class="panel-header">
        <span>排序结果</span>
        <div class="header-actions">
          <span class="item-count">{{ itemCount }} 项</span>
          <button @click="copyResult" class="btn-small">复制</button>
        </div>
      </div>
      <textarea
        :value="sortedText"
        class="text-input result"
        readonly
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputText = ref('')
const sortType = ref('line')
const sortOrder = ref('asc')
const caseSensitive = ref(false)
const removeDuplicates = ref(false)
const sortedText = ref('')

const itemCount = computed(() => {
  if (!sortedText.value) return 0
  return sortedText.value.split('\n').filter(line => line.trim()).length
})

function clearInput() {
  inputText.value = ''
  sortedText.value = ''
}

function sortText() {
  let lines = inputText.value.split('\n').filter(line => line !== '')

  if (removeDuplicates.value) {
    if (caseSensitive.value) {
      lines = [...new Set(lines)]
    } else {
      const seen = new Set()
      lines = lines.filter(line => {
        const lower = line.toLowerCase()
        if (seen.has(lower)) return false
        seen.add(lower)
        return true
      })
    }
  }

  lines.sort((a, b) => {
    let comparison = 0

    switch (sortType.value) {
      case 'alpha':
        comparison = caseSensitive.value
          ? a.localeCompare(b)
          : a.toLowerCase().localeCompare(b.toLowerCase())
        break
      case 'length':
        comparison = a.length - b.length
        break
      case 'number':
        const numA = parseFloat(a) || 0
        const numB = parseFloat(b) || 0
        comparison = numA - numB
        break
      default:
        comparison = caseSensitive.value
          ? a.localeCompare(b)
          : a.toLowerCase().localeCompare(b.toLowerCase())
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  sortedText.value = lines.join('\n')
}

function shuffleText() {
  let lines = inputText.value.split('\n').filter(line => line !== '')

  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[lines[i], lines[j]] = [lines[j], lines[i]]
  }

  sortedText.value = lines.join('\n')
}

function copyResult() {
  navigator.clipboard.writeText(sortedText.value)
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

.input-section,
.result-section {
  margin-bottom: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #e0e0e0;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: normal;
}

.text-input {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  resize: vertical;
  font-family: monospace;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.text-input.result {
  background: #f9f9f9;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.select-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
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

.btn-small {
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-small:hover {
  background: #f5f5f5;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .panel-header {
  background: #404040;
}

.dark .text-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .controls {
  background: #262626;
}

.dark .select-input {
  background: #262626;
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

.dark .btn-small {
  background: #262626;
  border-color: #404040;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .item-count {
  color: #a3a3a3;
}
</style>
