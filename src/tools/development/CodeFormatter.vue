<template>
  <div class="tool-container">
    <h1 class="title">代码格式化工具</h1>
    <p class="description">对代码进行格式化（美化）和压缩处理，支持多种编程语言。</p>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'format' }"
        @click="activeTab = 'format'"
      >
        代码美化
      </button>
      <button
        :class="{ active: activeTab === 'minify' }"
        @click="activeTab = 'minify'"
      >
        代码压缩
      </button>
    </div>

    <div class="main-content">
      <div class="input-panel">
        <div class="panel-header">
          <span>输入代码</span>
          <div class="header-actions">
            <select v-model="language" class="lang-select">
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="xml">XML</option>
              <option value="sql">SQL</option>
            </select>
            <button @click="clearInput" class="btn-small">清空</button>
          </div>
        </div>
        <textarea
          v-model="inputCode"
          class="code-input"
          placeholder="粘贴要处理的代码..."
        ></textarea>
      </div>

      <div class="action-bar">
        <button
          v-if="activeTab === 'format'"
          @click="formatCode"
          class="btn-primary"
        >
          格式化代码
        </button>
        <button
          v-else
          @click="minifyCode"
          class="btn-primary"
        >
          压缩代码
        </button>
        <button @click="copyOutput" class="btn-secondary">复制结果</button>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <span>输出结果</span>
          <span v-if="outputCode" class="size-info">{{ outputSize }} 字符</span>
        </div>
        <textarea
          :value="outputCode"
          class="code-input"
          readonly
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('format')
const inputCode = ref('')
const outputCode = ref('')
const language = ref('javascript')

const outputSize = computed(() => outputCode.value.length)

function clearInput() {
  inputCode.value = ''
  outputCode.value = ''
}

function formatCode() {
  if (!inputCode.value) {
    outputCode.value = ''
    return
  }

  try {
    switch (language.value) {
      case 'json':
        outputCode.value = formatJSON(inputCode.value)
        break
      case 'javascript':
        outputCode.value = formatJS(inputCode.value)
        break
      case 'css':
        outputCode.value = formatCSS(inputCode.value)
        break
      case 'html':
        outputCode.value = formatHTML(inputCode.value)
        break
      case 'xml':
        outputCode.value = formatXML(inputCode.value)
        break
      case 'sql':
        outputCode.value = formatSQL(inputCode.value)
        break
      default:
        outputCode.value = inputCode.value
    }
  } catch (e) {
    outputCode.value = `格式化错误: ${e.message}`
  }
}

function minifyCode() {
  if (!inputCode.value) {
    outputCode.value = ''
    return
  }

  try {
    switch (language.value) {
      case 'json':
        outputCode.value = minifyJSON(inputCode.value)
        break
      case 'javascript':
        outputCode.value = minifyJS(inputCode.value)
        break
      case 'css':
        outputCode.value = minifyCSS(inputCode.value)
        break
      case 'html':
        outputCode.value = minifyHTML(inputCode.value)
        break
      case 'xml':
        outputCode.value = minifyXML(inputCode.value)
        break
      default:
        outputCode.value = minifyGeneric(inputCode.value)
    }
  } catch (e) {
    outputCode.value = `压缩错误: ${e.message}`
  }
}

function formatJSON(str) {
  const obj = JSON.parse(str)
  return JSON.stringify(obj, null, 2)
}

function minifyJSON(str) {
  const obj = JSON.parse(str)
  return JSON.stringify(obj)
}

function formatJS(str) {
  let result = str
  result = result
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\s*;\s*/g, ';\n')
    .replace(/\s*,\s*/g, ',\n')
    .replace(/\s*\(\s*/g, '(\n  ')
    .replace(/\s*\)\s*\{/g, '\n) {')

  const lines = result.split('\n')
  const formatted = []
  let indent = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('}')) {
      indent = Math.max(0, indent - 1)
    }

    formatted.push('  '.repeat(indent) + trimmed)

    if (trimmed.endsWith('{') || trimmed.endsWith('(')) {
      indent++
    }
  }

  return formatted.join('\n')
}

function minifyJS(str) {
  return str
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:])\s*/g, '$1')
    .trim()
}

function formatCSS(str) {
  return str
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/\s*;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

function minifyCSS(str) {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

function formatHTML(str) {
  let result = str
  result = result.replace(/></g, '>\n<')

  const lines = result.split('\n')
  const formatted = []
  let indent = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('</') && !trimmed.startsWith('</ ') && !trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1)
    }

    formatted.push('  '.repeat(indent) + trimmed)

    if ((trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<!') &&
         !trimmed.endsWith('/>') && !trimmed.endsWith('>')) ||
        (trimmed.startsWith('<') && trimmed.endsWith('>') && !trimmed.includes('</') &&
         !trimmed.startsWith('<!') && !trimmed.endsWith('/>'))) {
      const selfClosing = trimmed.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\s*\/>/i)
      if (!selfClosing) {
        indent++
      }
    }
  }

  return formatted.join('\n')
}

function minifyHTML(str) {
  return str
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatXML(str) {
  return formatHTML(str)
}

function minifyXML(str) {
  return minifyHTML(str)
}

function formatSQL(str) {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'DISTINCT', 'AS', 'ASC', 'DESC']

  let result = str
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi')
    result = result.replace(regex, `\n${kw}`)
  })

  return result.split('\n').filter(line => line.trim()).join('\n')
}

function minifyGeneric(str) {
  return str
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function copyOutput() {
  if (outputCode.value) {
    navigator.clipboard.writeText(outputCode.value)
  }
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1200px;
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

.main-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-panel,
.output-panel {
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-select {
  padding: 0.35rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.code-input {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: none;
  resize: vertical;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  box-sizing: border-box;
}

.action-bar {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
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

.size-info {
  font-size: 0.85rem;
  color: #666;
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

.dark .input-panel,
.dark .output-panel {
  background: #262626;
}

.dark .panel-header {
  background: #404040;
}

.dark .code-input {
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

.dark .btn-small {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .lang-select {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}
</style>
