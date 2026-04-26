<template>
  <div class="tool-container">
    <h1 class="title">正则表达式生成器</h1>
    <p class="description">根据常见模式自动生成正则表达式，支持常用正则规则的自定义组合。</p>

    <div class="regex-card">
      <div class="patterns-section">
        <h3>选择正则模式</h3>
        <div class="patterns-grid">
          <div
            v-for="pattern in commonPatterns"
            :key="pattern.id"
            :class="{ selected: selectedPatterns.includes(pattern.id) }"
            class="pattern-item"
            @click="togglePattern(pattern.id)"
          >
            <div class="pattern-name">{{ pattern.name }}</div>
            <div class="pattern-example">{{ pattern.example }}</div>
          </div>
        </div>
      </div>

      <div class="custom-section">
        <h3>自定义修饰符</h3>
        <div class="modifiers-row">
          <label class="modifier-checkbox">
            <input type="checkbox" v-model="modifiers.global" />
            <span>g (全局匹配)</span>
          </label>
          <label class="modifier-checkbox">
            <input type="checkbox" v-model="modifiers.caseInsensitive" />
            <span>i (忽略大小写)</span>
          </label>
          <label class="modifier-checkbox">
            <input type="checkbox" v-model="modifiers.multiline" />
            <span>m (多行模式)</span>
          </label>
        </div>
      </div>

      <div class="generated-section">
        <h3>生成的正则表达式</h3>
        <div class="regex-display">
          <code>{{ generatedRegex }}</code>
          <button @click="copyRegex" class="btn-copy">复制</button>
        </div>
      </div>

      <div class="test-section">
        <h3>测试正则表达式</h3>
        <div class="form-group">
          <label>输入测试文本：</label>
          <textarea
            v-model="testString"
            class="text-input"
            placeholder="输入要测试的文本..."
            rows="3"
          ></textarea>
        </div>
        <div v-if="testString && generatedRegex" class="match-results">
          <div v-if="matches.length > 0" class="matches-found">
            <div class="match-count">找到 {{ matches.length }} 个匹配：</div>
            <div class="matches-list">
              <span v-for="(match, index) in matches" :key="index" class="match-item">
                "{{ match }}"
              </span>
            </div>
          </div>
          <div v-else class="no-matches">未找到匹配</div>
        </div>
      </div>

      <div class="reference-section">
        <h3>常用正则表达式参考</h3>
        <div class="reference-grid">
          <div class="reference-item">
            <div class="ref-pattern">手机号码</div>
            <div class="ref-regex">/^1[3-9]\d{9}$/</div>
          </div>
          <div class="reference-item">
            <div class="ref-pattern">电子邮箱</div>
            <div class="ref-regex">/^[\w.-]+@[\w.-]+\.\w+$/</div>
          </div>
          <div class="reference-item">
            <div class="ref-pattern">URL 链接</div>
            <div class="ref-regex">/^https?:\/\/[\w.-]+(?:\.[\w.-]+)+[\w\-\._~:/?#\[\]@!\$&'\(\)\*\+,;=%]+$/</div>
          </div>
          <div class="reference-item">
            <div class="ref-pattern">IP地址</div>
            <div class="ref-regex">/^(?:\d{1,3}\.){3}\d{1,3}$/</div>
          </div>
          <div class="reference-item">
            <div class="ref-pattern">身份证号</div>
            <div class="ref-regex">/^[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/</div>
          </div>
          <div class="reference-item">
            <div class="ref-pattern">日期格式</div>
            <div class="ref-regex">/^\d{4}-\d{2}-\d{2}$/</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const selectedPatterns = ref([])
const testString = ref('')

const modifiers = reactive({
  global: true,
  caseInsensitive: false,
  multiline: false
})

const commonPatterns = [
  { id: 'digit', name: '数字', pattern: '\\d', example: '0-9' },
  { id: 'letter', name: '字母', pattern: '[a-zA-Z]', example: 'a-z, A-Z' },
  { id: 'chinese', name: '中文字符', pattern: '[\u4e00-\u9fa5]', example: '中文' },
  { id: 'email', name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', example: 'user@example.com' },
  { id: 'phone', name: '手机号', pattern: '1[3-9]\\d{9}', example: '13812345678' },
  { id: 'url', name: 'URL', pattern: 'https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+', example: 'https://example.com' },
  { id: 'date', name: '日期', pattern: '\\d{4}-\\d{2}-\\d{2}', example: '2024-01-01' },
  { id: 'time', name: '时间', pattern: '\\d{2}:\\d{2}(?::\\d{2})?', example: '12:30 或 12:30:59' },
  { id: 'username', name: '用户名', pattern: '[a-zA-Z][a-zA-Z0-9_]{3,15}', example: 'user_name123' },
  { id: 'postcode', name: '邮政编码', pattern: '\\d{6}', example: '100000' },
  { id: 'idcard', name: '身份证号', pattern: '[1-9]\\d{5}(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dX]', example: '11010119900101123X' },
  { id: 'ipv4', name: 'IPv4 地址', pattern: '(?:\\d{1,3}\\.){3}\\d{1,3}', example: '192.168.1.1' }
]

const generatedRegex = computed(() => {
  if (selectedPatterns.value.length === 0) {
    return '/请选择模式/'
  }

  let pattern = selectedPatterns.value
    .map(id => commonPatterns.find(p => p.id === id)?.pattern || '')
    .join('')

  let flags = ''
  if (modifiers.global) flags += 'g'
  if (modifiers.caseInsensitive) flags += 'i'
  if (modifiers.multiline) flags += 'm'

  return `/${pattern}/${flags}`
})

const matches = computed(() => {
  if (!testString.value || selectedPatterns.value.length === 0) return []

  try {
    const pattern = selectedPatterns.value
      .map(id => commonPatterns.find(p => p.id === id)?.pattern || '')
      .join('')

    let flags = 'g'
    if (modifiers.caseInsensitive) flags += 'i'
    if (modifiers.multiline) flags += 'm'

    const regex = new RegExp(pattern, flags)
    const found = testString.value.match(regex)
    return found || []
  } catch {
    return []
  }
})

function togglePattern(id) {
  const index = selectedPatterns.value.indexOf(id)
  if (index === -1) {
    selectedPatterns.value.push(id)
  } else {
    selectedPatterns.value.splice(index, 1)
  }
}

function copyRegex() {
  navigator.clipboard.writeText(generatedRegex.value)
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

.regex-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.patterns-section,
.custom-section,
.generated-section,
.test-section,
.reference-section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.pattern-item {
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pattern-item:hover {
  border-color: #2563eb;
}

.pattern-item.selected {
  background: #e3f2fd;
  border-color: #2563eb;
}

.pattern-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
}

.pattern-example {
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
}

.modifiers-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.modifier-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.modifier-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.modifier-checkbox span {
  font-family: monospace;
  font-size: 0.9rem;
}

.regex-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a1a;
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.regex-display code {
  color: #10b981;
  font-family: monospace;
  font-size: 1rem;
  word-break: break-all;
}

.btn-copy {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #2563eb;
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
  font-family: inherit;
}

.match-results {
  margin-top: 1rem;
}

.matches-found {
  background: #dcfce7;
  padding: 1rem;
  border-radius: 8px;
}

.match-count {
  font-weight: 500;
  color: #166534;
  margin-bottom: 0.75rem;
}

.matches-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.match-item {
  background: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #166534;
}

.no-matches {
  background: #fee2e2;
  padding: 1rem;
  border-radius: 8px;
  color: #991b1b;
  text-align: center;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.reference-item {
  background: #fff;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid #eee;
}

.ref-pattern {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
}

.ref-regex {
  font-family: monospace;
  font-size: 0.8rem;
  color: #2563eb;
  word-break: break-all;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .regex-card {
  background: #262626;
}

.dark .pattern-item {
  background: #1a1a1a;
}

.dark .pattern-item:hover {
  border-color: #60a5fa;
}

.dark .pattern-item.selected {
  background: #1e3a8a;
}

.dark .pattern-name {
  color: #e5e5e5;
}

.dark .pattern-example {
  color: #a3a3a3;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .reference-item {
  background: #1a1a1a;
  border-color: #333;
}

.dark .ref-pattern {
  color: #e5e5e5;
}

.dark .matches-found {
  background: #14532d;
}

.dark .match-count,
.dark .match-item {
  color: #86efac;
}

.dark .no-matches {
  background: #7f1d1d;
  color: #fecaca;
}

@media (max-width: 768px) {
  .patterns-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .regex-display {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
