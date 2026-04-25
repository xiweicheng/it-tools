<template>
  <div class="tool-container">
    <h1 class="title">文本对比差异工具</h1>
    <p class="description">比较两段文本的差异，高亮显示新增、删除和修改的内容。</p>

    <div class="diff-container">
      <div class="diff-panel">
        <div class="panel-header">
          <span>文本 A（原始）</span>
          <button @click="clearA" class="btn-small">清空</button>
        </div>
        <textarea
          v-model="textA"
          class="diff-input"
          placeholder="输入第一段文本..."
        ></textarea>
      </div>

      <div class="diff-panel">
        <div class="panel-header">
          <span>文本 B（修改后）</span>
          <button @click="clearB" class="btn-small">清空</button>
        </div>
        <textarea
          v-model="textB"
          class="diff-input"
          placeholder="输入第二段文本..."
        ></textarea>
      </div>
    </div>

    <div class="controls">
      <button @click="compareTexts" class="btn-primary">对比差异</button>
      <button @click="swapTexts" class="btn-secondary">交换文本</button>
    </div>

    <div v-if="diffResult" class="result-container">
      <div class="result-header">
        <h3>对比结果</h3>
        <div class="diff-stats">
          <span class="stat added">+ {{ stats.added }} 新增</span>
          <span class="stat removed">- {{ stats.removed }} 删除</span>
          <span class="stat unchanged">{{ stats.unchanged }} 未变</span>
        </div>
      </div>
      <div class="diff-output" v-html="diffResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const textA = ref('')
const textB = ref('')
const diffResult = ref('')

const stats = computed(() => {
  let added = 0
  let removed = 0
  let unchanged = 0

  const linesA = textA.value.split('\n')
  const linesB = textB.value.split('\n')

  const maxLen = Math.max(linesA.length, linesB.length)

  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] || ''
    const lineB = linesB[i] || ''

    if (lineA === lineB) {
      unchanged++
    } else if (!linesA[i]) {
      added++
    } else if (!linesB[i]) {
      removed++
    } else {
      removed++
      added++
    }
  }

  return { added, removed, unchanged }
})

function clearA() {
  textA.value = ''
  diffResult.value = ''
}

function clearB() {
  textB.value = ''
  diffResult.value = ''
}

function swapTexts() {
  const temp = textA.value
  textA.value = textB.value
  textB.value = temp
  diffResult.value = ''
}

function compareTexts() {
  if (!textA.value && !textB.value) {
    diffResult.value = ''
    return
  }

  const linesA = textA.value.split('\n')
  const linesB = textB.value.split('\n')

  let result = '<div class="diff-lines">'

  const maxLen = Math.max(linesA.length, linesB.length)

  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i]
    const lineB = linesB[i]
    const lineNum = i + 1

    if (lineA === lineB) {
      result += `<div class="diff-line unchanged"><span class="line-num">${lineNum}</span><span class="line-content">${escapeHtml(lineA || '')}</span></div>`
    } else if (lineA === undefined || lineA === '') {
      result += `<div class="diff-line added"><span class="line-num">${lineNum}</span><span class="line-content">${escapeHtml(lineB)}</span></div>`
    } else if (lineB === undefined || lineB === '') {
      result += `<div class="diff-line removed"><span class="line-num">${lineNum}</span><span class="line-content">${escapeHtml(lineA)}</span></div>`
    } else {
      result += `<div class="diff-line removed"><span class="line-num">${lineNum}</span><span class="line-content">${escapeHtml(lineA)}</span></div>`
      result += `<div class="diff-line added"><span class="line-num">${lineNum}</span><span class="line-content">${escapeHtml(lineB)}</span></div>`
    }
  }

  result += '</div>'
  diffResult.value = result
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1400px;
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

.diff-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.diff-panel {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #e0e0e0;
  font-weight: 500;
}

.diff-input {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: none;
  resize: vertical;
  font-family: monospace;
  font-size: 0.9rem;
}

.controls {
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
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.result-container {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #e0e0e0;
}

.result-header h3 {
  margin: 0;
}

.diff-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.stat.added {
  background: #dcfce7;
  color: #166534;
}

.stat.removed {
  background: #fee2e2;
  color: #991b1b;
}

.stat.unchanged {
  background: #e5e5e5;
  color: #666;
}

.diff-output {
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

:deep(.diff-lines) {
  font-family: monospace;
  font-size: 0.9rem;
}

:deep(.diff-line) {
  display: flex;
  padding: 0.25rem 0;
  border-radius: 2px;
}

:deep(.line-num) {
  width: 40px;
  color: #999;
  text-align: right;
  padding-right: 1rem;
  user-select: none;
}

:deep(.line-content) {
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.diff-line.added) {
  background: #dcfce7;
}

:deep(.diff-line.added .line-content) {
  color: #166534;
}

:deep(.diff-line.removed) {
  background: #fee2e2;
}

:deep(.diff-line.removed .line-content) {
  color: #991b1b;
}

:deep(.diff-line.unchanged) {
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .diff-panel,
.dark .result-container {
  background: #262626;
}

.dark .panel-header,
.dark .result-header {
  background: #404040;
}

.dark .diff-input {
  background: #262626;
  color: #e5e5e5;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .stat.unchanged {
  background: #404040;
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .diff-container {
    grid-template-columns: 1fr;
  }
}
</style>
