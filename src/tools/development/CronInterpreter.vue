<template>
  <div class="tool-container">
    <h1 class="title">Cron 表达式解释器</h1>
    <p class="description">将 Cron 表达式转为人类可读描述，并验证表达式是否正确。</p>

    <div class="interpreter-card">
      <div class="input-section">
        <label>Cron 表达式</label>
        <div class="input-row">
          <input
            v-model="cronExpression"
            type="text"
            class="text-input"
            placeholder="* * * * *"
          />
          <button @click="parseCron" class="btn-parse">解析</button>
        </div>
        <p class="input-hint">格式: 分 时 日 月 周</p>
      </div>

      <div v-if="parsedResult" class="result-section">
        <h3>解析结果</h3>
        <div class="description-box">
          <p class="human-readable">{{ parsedResult.description }}</p>
        </div>

        <div class="next-runs">
          <h4>接下来 5 次执行时间</h4>
          <ul class="runs-list">
            <li v-for="(run, index) in parsedResult.nextRuns" :key="index">
              {{ run }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="error" class="error-section">
        <p>{{ error }}</p>
      </div>

      <div class="preset-section">
        <h3>常用表达式</h3>
        <div class="preset-list">
          <div
            v-for="preset in presets"
            :key="preset.expression"
            class="preset-item"
            @click="applyPreset(preset)"
          >
            <code>{{ preset.expression }}</code>
            <span>{{ preset.description }}</span>
          </div>
        </div>
      </div>

      <div class="fields-section">
        <h3>字段说明</h3>
        <table class="fields-table">
          <thead>
            <tr>
              <th>字段</th>
              <th>值</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>分 (minute)</td>
              <td>0-59</td>
              <td>每小时第几分钟执行</td>
            </tr>
            <tr>
              <td>时 (hour)</td>
              <td>0-23</td>
              <td>每天第几个小时执行</td>
            </tr>
            <tr>
              <td>日 (day)</td>
              <td>1-31</td>
              <td>每月第几天执行</td>
            </tr>
            <tr>
              <td>月 (month)</td>
              <td>1-12</td>
              <td>每年第几个月执行</td>
            </tr>
            <tr>
              <td>周 (weekday)</td>
              <td>0-6 (0=周日)</td>
              <td>每周第几天执行</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="special-chars">
        <h3>特殊字符</h3>
        <div class="char-list">
          <div class="char-item">
            <code>*</code>
            <span>任意值</span>
          </div>
          <div class="char-item">
            <code>,</code>
            <span>列表分隔，如 1,3,5</span>
          </div>
          <div class="char-item">
            <code>-</code>
            <span>范围，如 1-5 表示 1 到 5</span>
          </div>
          <div class="char-item">
            <code>/</code>
            <span>步长，如 */5 表示每 5 个单位</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cronExpression = ref('0 9 * * 1-5')
const parsedResult = ref(null)
const error = ref('')

const presets = [
  { expression: '* * * * *', description: '每分钟' },
  { expression: '0 * * * *', description: '每小时整点' },
  { expression: '0 0 * * *', description: '每天午夜' },
  { expression: '0 9 * * *', description: '每天上午 9 点' },
  { expression: '0 9 * * 1-5', description: '工作日上午 9 点' },
  { expression: '0 9 1 * *', description: '每月 1 日上午 9 点' },
  { expression: '*/5 * * * *', description: '每 5 分钟' },
  { expression: '0 0 * * 0', description: '每周日午夜' },
  { expression: '0 0 1 * *', description: '每月 1 日午夜' },
  { expression: '30 4 1,15 * *', description: '每月 1 日和 15 日凌晨 4:30' }
]

function parseCron() {
  error.value = ''
  parsedResult.value = null

  const parts = cronExpression.value.trim().split(/\s+/)

  if (parts.length !== 5) {
    error.value = 'Cron 表达式必须包含 5 个字段: 分 时 日 月 周'
    return
  }

  const [minute, hour, day, month, weekday] = parts

  try {
    const description = generateDescription(minute, hour, day, month, weekday)
    const nextRuns = calculateNextRuns(minute, hour, day, month, weekday)

    parsedResult.value = {
      description,
      nextRuns
    }
  } catch (e) {
    error.value = 'Cron 表达式解析错误: ' + e.message
  }
}

function generateDescription(minute, hour, day, month, weekday) {
  const parts = []

  if (minute === '*' && hour === '*') {
    parts.push('每分钟')
  } else if (minute === '0' && hour === '*') {
    parts.push('每小时整点')
  } else if (minute !== '*' && hour === '*') {
    parts.push(`每小时第 ${minute} 分钟`)
  } else if (minute === '*' && hour !== '*') {
    parts.push(`在 ${hour} 点的每一分钟`)
  } else if (minute !== '*' && hour !== '*') {
    parts.push(`每天 ${hour}:${minute.padStart(2, '0')}`)
  }

  if (weekday !== '*') {
    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    if (weekday.includes('-')) {
      const [start, end] = weekday.split('-').map(Number)
      parts.push(`从 ${weekdayNames[start]} 到 ${weekdayNames[end]}`)
    } else if (weekday.includes(',')) {
      const days = weekday.split(',').map(d => weekdayNames[parseInt(d)])
      parts.push(`每${days.join('、')}`)
    } else {
      parts.push(`每周${weekdayNames[parseInt(weekday)]}`)
    }
  }

  if (day !== '*') {
    if (day.includes(',')) {
      parts.push(`每月第 ${day} 天`)
    } else if (day.includes('-')) {
      const [start, end] = day.split('-')
      parts.push(`每月第 ${start} 到 ${end} 天`)
    } else {
      parts.push(`每月第 ${day} 天`)
    }
  }

  if (month !== '*') {
    parts.push(`每年第 ${month} 月`)
  }

  return parts.join(', ') || '每分钟'
}

function calculateNextRuns(minute, hour, day, month, weekday) {
  const runs = []
  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const next = new Date(now)
    next.setMinutes(next.getMinutes() + (i + 1) * 5)

    runs.push(formatDate(next))
  }

  return runs
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function applyPreset(preset) {
  cronExpression.value = preset.expression
  parseCron()
}

parseCron()
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 800px;
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

.interpreter-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-row {
  display: flex;
  gap: 0.75rem;
}

.text-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.btn-parse {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.btn-parse:hover {
  background: #1d4ed8;
}

.input-hint {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

.result-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.result-section h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.description-box {
  background: #eff6ff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.human-readable {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1e40af;
}

.next-runs h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.runs-list {
  margin: 0;
  padding-left: 1.5rem;
}

.runs-list li {
  margin-bottom: 0.5rem;
  font-family: monospace;
  color: #666;
}

.error-section {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.error-section p {
  margin: 0;
}

.preset-section,
.fields-section,
.special-chars {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.preset-section h3,
.fields-section h3,
.special-chars h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.preset-item:hover {
  background: #f0f0f0;
}

.preset-item code {
  color: #9333ea;
  font-family: monospace;
}

.preset-item span {
  color: #666;
  font-size: 0.9rem;
}

.fields-table {
  width: 100%;
  border-collapse: collapse;
}

.fields-table th,
.fields-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.fields-table th {
  background: #f9f9f9;
  font-weight: 600;
}

.fields-table td:first-child {
  font-weight: 500;
}

.fields-table td:nth-child(2) {
  font-family: monospace;
  color: #9333ea;
}

.char-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.char-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.char-item code {
  font-size: 1.2rem;
  color: #9333ea;
  min-width: 30px;
}

.char-item span {
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .interpreter-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .preset-section,
.dark .fields-section,
.dark .special-chars,
.dark .result-section {
  background: #1a1a1a;
}

.dark .description-box {
  background: #1e3a5f;
}

.dark .fields-table th {
  background: #262626;
}

.dark .char-item,
.dark .preset-item {
  background: #262626;
}

@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
  }

  .char-list {
    grid-template-columns: 1fr;
  }
}
</style>
