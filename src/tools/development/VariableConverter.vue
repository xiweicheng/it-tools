<template>
  <div class="tool-container">
    <h1 class="title">变量命名转换器</h1>
    <p class="description">在不同命名风格之间转换变量名，如驼峰命名、蛇形命名、帕斯卡命名等。</p>

    <div class="input-section">
      <label>输入变量名：</label>
      <input
        v-model="inputName"
        type="text"
        class="text-input"
        placeholder="输入变量名，如: user_name 或 userName"
        @input="convertName"
      />
    </div>

    <div class="result-section">
      <h3>转换结果</h3>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">驼峰命名 (camelCase)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.camel }}
            <button v-if="formats.camel" @click="copy(formats.camel)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">帕斯卡命名 (PascalCase)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.pascal }}
            <button v-if="formats.pascal" @click="copy(formats.pascal)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">蛇形命名 (snake_case)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.snake }}
            <button v-if="formats.snake" @click="copy(formats.snake)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">常量命名 (SCREAMING_SNAKE_CASE)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.screamingSnake }}
            <button v-if="formats.screamingSnake" @click="copy(formats.screamingSnake)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">短横线命名 (kebab-case)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.kebab }}
            <button v-if="formats.kebab" @click="copy(formats.kebab)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">点分隔命名 (dot.case)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.dot }}
            <button v-if="formats.dot" @click="copy(formats.dot)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">路径命名 (path/case)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.path }}
            <button v-if="formats.path" @click="copy(formats.path)" class="btn-copy">复制</button>
          </div>
        </div>

        <div class="result-item">
          <div class="result-label">空格分隔标题 (Title Case)</div>
          <div class="result-value" :class="{ active: inputName }">
            {{ formats.title }}
            <button v-if="formats.title" @click="copy(formats.title)" class="btn-copy">复制</button>
          </div>
        </div>
      </div>
    </div>

    <div class="hint-section">
      <h4>支持自动识别以下格式：</h4>
      <ul>
        <li>camelCase (驼峰命名)</li>
        <li>PascalCase (帕斯卡命名)</li>
        <li>snake_case (蛇形命名)</li>
        <li>SCREAMING_SNAKE_CASE (常量命名)</li>
        <li>kebab-case (短横线命名)</li>
        <li>dot.case (点分隔命名)</li>
        <li>path/case (路径命名)</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputName = ref('')

const formats = reactive({
  camel: '',
  pascal: '',
  snake: '',
  screamingSnake: '',
  kebab: '',
  dot: '',
  path: '',
  title: ''
})

function convertName() {
  if (!inputName.value) {
    Object.keys(formats).forEach(key => formats[key] = '')
    return
  }

  const words = parseWords(inputName.value)

  formats.camel = toCamel(words)
  formats.pascal = toPascal(words)
  formats.snake = toSnake(words)
  formats.screamingSnake = toScreamingSnake(words)
  formats.kebab = toKebab(words)
  formats.dot = toDot(words)
  formats.path = toPath(words)
  formats.title = toTitle(words)
}

function parseWords(str) {
  if (!str) return []

  let words = []

  if (str.includes('_') || str.includes('-') || str.includes('.') || str.includes('/')) {
    const separators = /[_.\-\/]+/
    words = str.split(separators).filter(w => w)
  } else if (/^[A-Z][a-z]/.test(str) || str === str.toUpperCase()) {
    words = str.replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
              .split(' ')
              .filter(w => w)
  } else {
    words = [str]
  }

  return words.map(w => w.toLowerCase())
}

function toCamel(words) {
  if (words.length === 0) return ''
  return words[0] + words.slice(1).map(capitalize).join('')
}

function toPascal(words) {
  return words.map(capitalize).join('')
}

function toSnake(words) {
  return words.join('_')
}

function toScreamingSnake(words) {
  return words.join('_').toUpperCase()
}

function toKebab(words) {
  return words.join('-')
}

function toDot(words) {
  return words.join('.')
}

function toPath(words) {
  return words.join('/')
}

function toTitle(words) {
  return words.map(capitalize).join(' ')
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function copy(text) {
  navigator.clipboard.writeText(text)
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

.input-section {
  margin-bottom: 2rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.result-section {
  margin-bottom: 2rem;
}

.result-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.result-grid {
  display: grid;
  gap: 1rem;
}

.result-item {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.result-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: monospace;
  font-size: 1.1rem;
  color: #999;
  word-break: break-all;
}

.result-value.active {
  color: #2563eb;
}

.btn-copy {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.btn-copy:hover {
  background: #f0f0f0;
}

.hint-section {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.25rem;
}

.hint-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.hint-section ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
}

.hint-section li {
  color: #666;
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .text-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item {
  background: #262626;
}

.dark .result-label {
  color: #a3a3a3;
}

.dark .result-value {
  color: #666;
}

.dark .result-value.active {
  color: #60a5fa;
}

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-copy:hover {
  background: #404040;
}

.dark .hint-section {
  background: #262626;
}

.dark .hint-section li {
  color: #a3a3a3;
}
</style>
