<template>
  <div class="duplicate-word-remover">
    <h2>去除连续重复单词</h2>
    <p class="subtitle">删除文本中连续重复出现的单词，保留一个</p>

    <div class="converter-container">
      <div class="input-section">
        <h3>输入文本</h3>
        <textarea
          v-model="inputText"
          placeholder="输入包含重复单词的文本，例如：
The the cat cat sat on the the mat mat
Hello Hello World World
This This is is a a test test text text"
        ></textarea>
        <div class="input-stats">
          <span>字符数: {{ inputText.length }}</span>
          <span>单词数: {{ wordCount }}</span>
          <span>重复组: {{ duplicateGroups }}</span>
        </div>
      </div>

      <div class="controls-section">
        <h3>选项</h3>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="options.caseSensitive" />
            <span>区分大小写</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeAdjacent" checked />
            <span>去除相邻重复</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeDuplicateLines" />
            <span>去除重复行</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.trimSpaces" checked />
            <span>清理多余空格</span>
          </label>
        </div>

        <div class="action-buttons">
          <button @click="processText" class="process-btn">处理文本</button>
          <button @click="clearAll" class="clear-btn">清空</button>
        </div>
      </div>

      <div class="output-section">
        <h3>处理结果</h3>
        <div class="output-display">
          <pre v-if="outputText">{{ outputText }}</pre>
          <span v-else class="placeholder">处理后的文本将在此显示</span>
        </div>
        <div class="output-stats" v-if="outputText">
          <span>原字符数: {{ inputText.length }}</span>
          <span>→</span>
          <span>新字符数: {{ outputText.length }}</span>
          <span class="savings" v-if="charReduction > 0">节省 {{ charReduction }} 字符</span>
        </div>
        <div class="action-buttons" v-if="outputText">
          <button @click="copyOutput" class="copy-btn">{{ copied ? '已复制!' : '复制结果' }}</button>
          <button @click="downloadTxt" class="download-btn">下载 TXT</button>
        </div>
      </div>
    </div>

    <div class="preview-section" v-if="duplicateGroups > 0">
      <h3>检测到的重复</h3>
      <div class="duplicate-list">
        <div v-for="(group, index) in detectedDuplicates" :key="index" class="duplicate-item">
          <span class="duplicate-word">"{{ group.word }}"</span>
          <span class="duplicate-count">重复 {{ group.count }} 次</span>
          <button @click="highlightWord(group.word)" class="highlight-btn">高亮</button>
        </div>
      </div>
    </div>

    <div class="examples-section">
      <h3>示例</h3>
      <div class="example-list">
        <div class="example-item" @click="loadExample('adjacent')">
          <span class="example-label">相邻单词重复</span>
          <span class="example-before">The the cat cat sat</span>
          <span class="example-arrow">→</span>
          <span class="example-after">The cat sat</span>
        </div>
        <div class="example-item" @click="loadExample('case')">
          <span class="example-label">大小写重复</span>
          <span class="example-before">Hello Hello hello HELLO</span>
          <span class="example-arrow">→</span>
          <span class="example-after">Hello (区分大小写)</span>
        </div>
        <div class="example-item" @click="loadExample('lines')">
          <span class="example-label">重复行</span>
          <span class="example-before">Line 1\nLine 1\nLine 2</span>
          <span class="example-arrow">→</span>
          <span class="example-after">Line 1\nLine 2</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const inputText = ref('')
const outputText = ref('')
const copied = ref(false)

const options = ref({
  caseSensitive: false,
  removeAdjacent: true,
  removeDuplicateLines: false,
  trimSpaces: true
})

const wordCount = computed(() => {
  if (!inputText.value) return 0
  const words = inputText.value.trim().split(/\s+/)
  return words.filter(w => w).length
})

const duplicateGroups = computed(() => {
  return detectedDuplicates.value.length
})

const charReduction = computed(() => {
  return inputText.value.length - outputText.value.length
})

const detectedDuplicates = ref([])

const processText = () => {
  if (!inputText.value) {
    outputText.value = ''
    detectedDuplicates.value = []
    return
  }

  let text = inputText.value

  if (options.value.trimSpaces) {
    text = text.replace(/\s+/g, ' ').trim()
  }

  if (options.value.removeDuplicateLines) {
    const lines = text.split('\n')
    const seen = new Set()
    const uniqueLines = []
    for (const line of lines) {
      const key = options.value.caseSensitive ? line : line.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        uniqueLines.push(line)
      }
    }
    text = uniqueLines.join('\n')
  }

  if (options.value.removeAdjacent) {
    const words = text.split(/(\s+)/)
    const result = []
    let i = 0

    while (i < words.length) {
      if (/\s/.test(words[i])) {
        result.push(words[i])
        i++
        continue
      }

      const current = words[i]
      const next = words[i + 2]

      if (next !== undefined) {
        const isDuplicate = options.value.caseSensitive
          ? current === next
          : current.toLowerCase() === next.toLowerCase()

        if (isDuplicate) {
          result.push(current)
          let count = 1
          let j = i + 2
          while (j < words.length) {
            const check = words[j]
            if (/\s/.test(check)) {
              result.push(check)
              j++
              continue
            }
            const nextCheck = words[j + 2]
            if (nextCheck !== undefined) {
              const isDup = options.value.caseSensitive
                ? check === nextCheck
                : check.toLowerCase() === nextCheck.toLowerCase()
              if (isDup) {
                count++
                j += 2
              } else {
                break
              }
            } else {
              break
            }
          }
          if (count > 1) {
            detectedDuplicates.value.push({ word: current, count })
          }
          i = j
        } else {
          result.push(current)
          i++
        }
      } else {
        result.push(current)
        i++
      }
    }

    text = result.join('')
  }

  if (options.value.trimSpaces) {
    text = text.replace(/\s+/g, ' ').trim()
  }

  outputText.value = text

  const groups = []
  const words = inputText.value.split(/\s+/)
  for (let i = 0; i < words.length - 1; i++) {
    if (options.value.caseSensitive ? words[i] === words[i + 1] : words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      const word = words[i]
      const existing = groups.find(g => g.word === word)
      if (existing) {
        existing.count++
      } else {
        groups.push({ word, count: 2 })
      }
      i++
    }
  }
  detectedDuplicates.value = groups
}

watch(inputText, () => {
  if (options.value.removeAdjacent || options.value.removeDuplicateLines) {
    processText()
  }
})

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  detectedDuplicates.value = []
}

const copyOutput = async () => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

const downloadTxt = () => {
  if (!outputText.value) return
  const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cleaned-text.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const highlightWord = (word) => {
  const regex = new RegExp(`(${word})`, 'gi')
  outputText.value = outputText.value.replace(regex, '**$1**')
}

const loadExample = (type) => {
  const examples = {
    adjacent: 'The the cat cat sat on the the mat mat',
    case: 'Hello Hello hello HELLO World world',
    lines: 'Line 1\nLine 1\nLine 2\nLine 2\nLine 3'
  }
  inputText.value = examples[type]
  options.value.caseSensitive = type === 'case'
  options.value.removeDuplicateLines = type === 'lines'
  processText()
}
</script>

<style scoped>
.duplicate-word-remover {
  padding: 20px;
}
.subtitle {
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 20px;
}
.converter-container {
  display: grid;
  grid-template-columns: 1fr 250px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section,
.controls-section,
.output-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
textarea {
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}
.input-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.process-btn,
.clear-btn,
.copy-btn,
.download-btn {
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.process-btn {
  background: var(--primary-color);
  color: white;
}
.clear-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.output-display {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  min-height: 150px;
  max-height: 200px;
  overflow: auto;
}
.output-display pre {
  margin: 0;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}
.output-display .placeholder {
  color: var(--text-secondary);
}
.output-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.output-stats .savings {
  color: #4CAF50;
  font-weight: bold;
}
.copy-btn {
  background: var(--primary-color);
  color: white;
}
.download-btn {
  background: #4CAF50;
  color: white;
}
.preview-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.preview-section h3 {
  margin-bottom: 15px;
}
.duplicate-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.duplicate-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.duplicate-word {
  font-weight: bold;
  color: var(--primary-color);
}
.duplicate-count {
  color: var(--text-secondary);
  font-size: 14px;
}
.highlight-btn {
  margin-left: auto;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.highlight-btn:hover {
  background: var(--border-color);
}
.examples-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.examples-section h3 {
  margin-bottom: 15px;
}
.example-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.example-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.example-item:hover {
  background: var(--border-color);
}
.example-label {
  font-weight: 500;
  min-width: 100px;
}
.example-before {
  color: var(--text-secondary);
  font-size: 13px;
}
.example-arrow {
  color: var(--primary-color);
}
.example-after {
  font-weight: bold;
}
@media (max-width: 768px) {
  .converter-container {
    grid-template-columns: 1fr;
  }
}
</style>
