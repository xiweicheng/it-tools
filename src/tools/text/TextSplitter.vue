<template>
  <div class="tool-container">
    <h1 class="title">文本分割合并工具</h1>
    <p class="description">将大文本按指定规则分割，或将多个小文本片段合并成一个。</p>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'split' }"
        @click="activeTab = 'split'"
      >
        文本分割
      </button>
      <button
        :class="{ active: activeTab === 'merge' }"
        @click="activeTab = 'merge'"
      >
        文本合并
      </button>
    </div>

    <div v-if="activeTab === 'split'" class="tab-content">
      <div class="input-section">
        <div class="panel-header">
          <span>输入文本</span>
          <button @click="clearInput" class="btn-small">清空</button>
        </div>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入要分割的文本..."
        ></textarea>
      </div>

      <div class="controls">
        <div class="control-group">
          <label>分割方式：</label>
          <select v-model="splitType" class="select-input">
            <option value="lines">按行数分割</option>
            <option value="chars">按字符数分割</option>
            <option value="delimiter">按分隔符分割</option>
          </select>
        </div>

        <div class="control-group">
          <label>每段数量：</label>
          <input
            v-model.number="splitSize"
            type="number"
            min="1"
            class="number-input"
          />
        </div>

        <div v-if="splitType === 'delimiter'" class="control-group">
          <label>分隔符：</label>
          <input
            v-model="delimiter"
            type="text"
            class="text-input-small"
            placeholder="如: | 或 ,"
          />
        </div>
      </div>

      <button @click="splitText" class="btn-primary">开始分割</button>

      <div v-if="splitResult.length > 0" class="result-section">
        <div class="panel-header">
          <span>分割结果（共 {{ splitResult.length }} 段）</span>
          <button @click="copyAll" class="btn-small">复制全部</button>
        </div>
        <div class="split-results">
          <div
            v-for="(part, index) in splitResult"
            :key="index"
            class="split-part"
          >
            <div class="part-header">
              <span>片段 {{ index + 1 }}</span>
              <button @click="copyPart(index)" class="btn-tiny">复制</button>
            </div>
            <pre class="part-content">{{ part }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'merge'" class="tab-content">
      <div class="input-section">
        <div class="panel-header">
          <span>输入片段（每行一个片段）</span>
          <button @click="clearMergeInput" class="btn-small">清空</button>
        </div>
        <textarea
          v-model="mergeInput"
          class="text-input"
          placeholder="输入要合并的文本片段，每行一个..."
        ></textarea>
      </div>

      <div class="controls">
        <div class="control-group">
          <label>合并连接符：</label>
          <select v-model="joinType" class="select-input">
            <option value="none">无连接符</option>
            <option value="newline">换行符</option>
            <option value="space">空格</option>
            <option value="comma">逗号</option>
            <option value="custom">自定义</option>
          </select>
        </div>

        <div v-if="joinType === 'custom'" class="control-group">
          <label>自定义：</label>
          <input
            v-model="customJoiner"
            type="text"
            class="text-input-small"
            placeholder="如: | 或 , "
          />
        </div>

        <div class="control-group">
          <label>
            <input type="checkbox" v-model="trimLines" />
            去除首尾空白
          </label>
        </div>

        <div class="control-group">
          <label>
            <input type="checkbox" v-model="removeEmpty" />
            去除空行
          </label>
        </div>
      </div>

      <button @click="mergeText" class="btn-primary">开始合并</button>

      <div v-if="mergedResult" class="result-section">
        <div class="panel-header">
          <span>合并结果</span>
          <button @click="copyMerged" class="btn-small">复制</button>
        </div>
        <textarea
          :value="mergedResult"
          class="text-input result"
          readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('split')
const inputText = ref('')
const splitType = ref('lines')
const splitSize = ref(100)
const delimiter = ref('')
const splitResult = ref([])

const mergeInput = ref('')
const joinType = ref('newline')
const customJoiner = ref('')
const trimLines = ref(true)
const removeEmpty = ref(true)
const mergedResult = ref('')

function clearInput() {
  inputText.value = ''
  splitResult.value = []
}

function clearMergeInput() {
  mergeInput.value = ''
  mergedResult.value = ''
}

function splitText() {
  if (!inputText.value) {
    splitResult.value = []
    return
  }

  let parts = []

  switch (splitType.value) {
    case 'lines':
      parts = splitByLines(inputText.value, splitSize.value)
      break
    case 'chars':
      parts = splitByChars(inputText.value, splitSize.value)
      break
    case 'delimiter':
      parts = splitByDelimiter(inputText.value, delimiter.value)
      break
  }

  splitResult.value = parts
}

function splitByLines(text, size) {
  const lines = text.split('\n')
  const parts = []
  for (let i = 0; i < lines.length; i += size) {
    parts.push(lines.slice(i, i + size).join('\n'))
  }
  return parts
}

function splitByChars(text, size) {
  const parts = []
  for (let i = 0; i < text.length; i += size) {
    parts.push(text.slice(i, i + size))
  }
  return parts
}

function splitByDelimiter(text, delim) {
  if (!delim) return [text]
  return text.split(delim)
}

function copyPart(index) {
  navigator.clipboard.writeText(splitResult.value[index])
}

function copyAll() {
  navigator.clipboard.writeText(splitResult.value.join('\n---split---\n'))
}

function mergeText() {
  let lines = mergeInput.value.split('\n')

  if (trimLines.value) {
    lines = lines.map(line => line.trim())
  }

  if (removeEmpty.value) {
    lines = lines.filter(line => line !== '')
  }

  let joiner = ''
  switch (joinType.value) {
    case 'none':
      joiner = ''
      break
    case 'newline':
      joiner = '\n'
      break
    case 'space':
      joiner = ' '
      break
    case 'comma':
      joiner = ','
      break
    case 'custom':
      joiner = customJoiner.value
      break
  }

  mergedResult.value = lines.join(joiner)
}

function copyMerged() {
  navigator.clipboard.writeText(mergedResult.value)
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.tabs button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: #2563eb;
  color: white;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  gap: 1rem;
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
  white-space: nowrap;
}

.select-input,
.number-input,
.text-input-small {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.number-input {
  width: 80px;
}

.text-input-small {
  width: 120px;
}

.split-results {
  display: grid;
  gap: 1rem;
}

.split-part {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  font-size: 0.9rem;
  font-weight: 500;
}

.part-content {
  padding: 1rem;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.9rem;
  max-height: 200px;
  overflow-y: auto;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-small,
.btn-tiny {
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-tiny {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
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

.dark .tabs {
  background: #404040;
}

.dark .tabs button:not(.active) {
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

.dark .select-input,
.dark .number-input,
.dark .text-input-small {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .split-part {
  background: #262626;
}

.dark .part-header {
  background: #404040;
}

.dark .btn-small,
.dark .btn-tiny {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-tiny:hover,
.dark .btn-small:hover {
  background: #404040;
}
</style>
