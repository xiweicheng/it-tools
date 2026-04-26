<template>
  <div class="tool-container">
    <h1 class="title">DateTime 格式化工具</h1>
    <p class="description">支持多种日期时间格式的转换，如 ISO 8601、RFC 2822 等。</p>

    <div class="formatter-card">
      <div class="input-section">
        <div class="form-group">
          <label>输入日期时间：</label>
          <input
            v-model="inputDateTime"
            type="text"
            class="text-input"
            placeholder="例如: 2024-01-15 10:30:00 或 timestamp"
          />
        </div>

        <div class="format-select">
          <label>输入格式：</label>
          <select v-model="inputFormat" class="select-input">
            <option value="auto">自动检测</option>
            <option value="iso">ISO 8601</option>
            <option value="timestamp">时间戳 (毫秒)</option>
            <option value="unix">Unix 时间戳 (秒)</option>
            <option value="date">日期 (YYYY-MM-DD)</option>
            <option value="datetime">日期时间 (YYYY-MM-DD HH:mm:ss)</option>
            <option value="cn">中文格式 (YYYY年MM月DD日)</option>
            <option value="us">美国格式 (MM/DD/YYYY)</option>
            <option value="eu">欧洲格式 (DD/MM/YYYY)</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="parseDateTime" class="btn-primary">解析</button>
        <button @click="getCurrentTime" class="btn-secondary">当前时间</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="parsedDate" class="results-section">
        <h3>转换结果</h3>

        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">时间戳 (毫秒)</span>
            <span class="result-value">{{ parsedDate.timestamp }}</span>
            <button @click="copyValue(parsedDate.timestamp)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">Unix 时间戳 (秒)</span>
            <span class="result-value">{{ parsedDate.unix }}</span>
            <button @click="copyValue(parsedDate.unix)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">ISO 8601</span>
            <span class="result-value">{{ parsedDate.iso }}</span>
            <button @click="copyValue(parsedDate.iso)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">UTC</span>
            <span class="result-value">{{ parsedDate.utc }}</span>
            <button @click="copyValue(parsedDate.utc)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">日期 (YYYY-MM-DD)</span>
            <span class="result-value">{{ parsedDate.date }}</span>
            <button @click="copyValue(parsedDate.date)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">时间 (HH:mm:ss)</span>
            <span class="result-value">{{ parsedDate.time }}</span>
            <button @click="copyValue(parsedDate.time)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">中文格式</span>
            <span class="result-value">{{ parsedDate.cn }}</span>
            <button @click="copyValue(parsedDate.cn)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">美国格式</span>
            <span class="result-value">{{ parsedDate.us }}</span>
            <button @click="copyValue(parsedDate.us)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">欧洲格式</span>
            <span class="result-value">{{ parsedDate.eu }}</span>
            <button @click="copyValue(parsedDate.eu)" class="btn-copy">复制</button>
          </div>
          <div class="result-item">
            <span class="result-label">RFC 2822</span>
            <span class="result-value">{{ parsedDate.rfc2822 }}</span>
            <button @click="copyValue(parsedDate.rfc2822)" class="btn-copy">复制</button>
          </div>
          <div class="result-item full-width">
            <span class="result-label">相对时间</span>
            <span class="result-value">{{ parsedDate.relative }}</span>
          </div>
        </div>
      </div>

      <div class="quick-convert">
        <h3>快速转换</h3>
        <div class="quick-buttons">
          <button @click="convertFromTimestamp" class="btn-quick">时间戳 → 日期</button>
          <button @click="convertToTimestamp" class="btn-quick">日期 → 时间戳</button>
          <button @click="addDays(7)" class="btn-quick">+7 天</button>
          <button @click="addDays(-7)" class="btn-quick">-7 天</button>
          <button @click="addHours(1)" class="btn-quick">+1 小时</button>
          <button @click="addHours(-1)" class="btn-quick">-1 小时</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputDateTime = ref('')
const inputFormat = ref('auto')
const parsedDate = ref(null)

function parseDateTime() {
  if (!inputDateTime.value.trim()) {
    parsedDate.value = null
    return
  }

  let date

  if (inputFormat.value === 'timestamp') {
    date = new Date(parseInt(inputDateTime.value))
  } else if (inputFormat.value === 'unix') {
    date = new Date(parseInt(inputDateTime.value) * 1000)
  } else if (inputFormat.value === 'auto') {
    if (/^\d{13}$/.test(inputDateTime.value)) {
      date = new Date(parseInt(inputDateTime.value))
    } else if (/^\d{10}$/.test(inputDateTime.value)) {
      date = new Date(parseInt(inputDateTime.value) * 1000)
    } else {
      date = new Date(inputDateTime.value)
    }
  } else {
    date = new Date(inputDateTime.value)
  }

  if (isNaN(date.getTime())) {
    parsedDate.value = null
    return
  }

  parsedDate.value = formatDate(date)
}

function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return {
    timestamp: date.getTime(),
    unix: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`,
    cn: `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
    us: `${month}/${day}/${year}`,
    eu: `${day}/${month}/${year}`,
    rfc2822: date.toUTCString(),
    relative: getRelativeTime(date)
  }
}

function getRelativeTime(date) {
  const now = new Date()
  const diff = now - date
  const absDiff = Math.abs(diff)

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const past = diff > 0

  if (days > 30) {
    return past ? `${Math.floor(days / 30)} 个月前` : `${Math.floor(days / 30)} 个月后`
  }
  if (days > 0) {
    return past ? `${days} 天前` : `${days} 天后`
  }
  if (hours > 0) {
    return past ? `${hours} 小时前` : `${hours} 小时后`
  }
  if (minutes > 0) {
    return past ? `${minutes} 分钟前` : `${minutes} 分钟后`
  }
  return past ? '刚刚' : '即将'
}

function getCurrentTime() {
  const now = new Date()
  inputDateTime.value = now.toISOString()
  parseDateTime()
}

function convertFromTimestamp() {
  const ts = prompt('输入时间戳 (毫秒):')
  if (ts) {
    inputDateTime.value = ts
    inputFormat.value = 'timestamp'
    parseDateTime()
  }
}

function convertToTimestamp() {
  const dt = prompt('输入日期时间:')
  if (dt) {
    inputDateTime.value = dt
    inputFormat.value = 'auto'
    parseDateTime()
  }
}

function addDays(days) {
  if (!parsedDate.value) return
  const date = new Date(parsedDate.value.timestamp)
  date.setDate(date.getDate() + days)
  parsedDate.value = formatDate(date)
}

function addHours(hours) {
  if (!parsedDate.value) return
  const date = new Date(parsedDate.value.timestamp)
  date.setHours(date.getHours() + hours)
  parsedDate.value = formatDate(date)
}

function copyValue(value) {
  navigator.clipboard.writeText(value.toString())
}

function clearAll() {
  inputDateTime.value = ''
  parsedDate.value = null
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

.formatter-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.input-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 2;
}

.format-select {
  flex: 1;
}

.form-group label,
.format-select label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input,
.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
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

.results-section {
  margin-bottom: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.result-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item.full-width {
  grid-column: 1 / -1;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
}

.result-value {
  font-size: 1rem;
  font-weight: 500;
  word-break: break-all;
}

.btn-copy {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-copy:hover {
  background: #e5e5e5;
}

.quick-convert {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.quick-convert h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-quick {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-quick:hover {
  background: #e5e5e5;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .formatter-card,
.dark .quick-convert {
  background: #262626;
}

.dark .text-input,
.dark .select-input {
  background: #1a1a1a;
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

.dark .result-item {
  background: #1a1a1a;
}

.dark .btn-copy,
.dark .btn-quick {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-copy:hover,
.dark .btn-quick:hover {
  background: #333;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>
