<template>
  <div class="tool-container">
    <h1 class="title">网络延迟测试器</h1>
    <p class="description">测试本地到远程服务器的网络延迟，评估网络性能。</p>

    <div class="tester-card">
      <div class="form-group">
        <label>目标服务器：</label>
        <input
          v-model="targetHost"
          type="text"
          class="text-input"
          placeholder="例如: google.com 或 8.8.8.8"
        />
      </div>

      <div class="test-options">
        <div class="option-group">
          <label>测试次数：</label>
          <select v-model="testCount" class="select-input">
            <option :value="3">3 次</option>
            <option :value="5">5 次</option>
            <option :value="10">10 次</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="startTest" class="btn-primary" :disabled="testing">
          {{ testing ? '测试中...' : '开始测试' }}
        </button>
        <button @click="clearResults" class="btn-secondary">清空</button>
      </div>

      <div v-if="testing" class="loading-section">
        <div class="spinner"></div>
        <p>正在测试 {{ currentTest }}/{{ testCount }}...</p>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <h3>测试结果</h3>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">平均延迟</span>
            <span class="stat-value" :class="getLatencyClass(avgLatency)">{{ avgLatency.toFixed(1) }} ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最快</span>
            <span class="stat-value">{{ minLatency.toFixed(1) }} ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最慢</span>
            <span class="stat-value">{{ maxLatency.toFixed(1) }} ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">丢包率</span>
            <span class="stat-value" :class="packetLoss > 0 ? 'warning' : 'success'">{{ packetLoss }}%</span>
          </div>
        </div>

        <div class="history-list">
          <div class="history-header">
            <span>#</span>
            <span>时间</span>
            <span>延迟</span>
            <span>状态</span>
          </div>
          <div v-for="(result, index) in results" :key="index" class="history-item">
            <span>{{ index + 1 }}</span>
            <span>{{ result.time }}</span>
            <span :class="result.latency === -1 ? 'error' : ''">{{ result.latency === -1 ? '超时' : result.latency.toFixed(1) + ' ms' }}</span>
            <span :class="result.latency === -1 ? 'status-error' : 'status-ok'">{{ result.latency === -1 ? '失败' : '成功' }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h4>延迟参考</h4>
        <ul>
          <li><strong>&lt; 50ms</strong>: 极低延迟，网络性能优秀</li>
          <li><strong>50-100ms</strong>: 低延迟，正常水平</li>
          <li><strong>100-200ms</strong>: 中等延迟，可能影响实时应用</li>
          <li><strong>&gt; 200ms</strong>: 高延迟，视频通话等可能受影响</li>
          <li><strong>超时</strong>: 网络不通或服务器无响应</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const targetHost = ref('8.8.8.8')
const testCount = ref(5)
const testing = ref(false)
const currentTest = ref(0)
const results = ref([])

const avgLatency = computed(() => {
  const successful = results.value.filter(r => r.latency !== -1)
  if (successful.length === 0) return 0
  return successful.reduce((sum, r) => sum + r.latency, 0) / successful.length
})

const minLatency = computed(() => {
  const successful = results.value.filter(r => r.latency !== -1)
  if (successful.length === 0) return 0
  return Math.min(...successful.map(r => r.latency))
})

const maxLatency = computed(() => {
  const successful = results.value.filter(r => r.latency !== -1)
  if (successful.length === 0) return 0
  return Math.max(...successful.map(r => r.latency))
})

const packetLoss = computed(() => {
  const failed = results.value.filter(r => r.latency === -1).length
  return Math.round((failed / results.value.length) * 100)
})

function getLatencyClass(latency) {
  if (latency < 50) return 'excellent'
  if (latency < 100) return 'good'
  if (latency < 200) return 'fair'
  return 'poor'
}

async function measureLatency(host) {
  const startTime = performance.now()

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    const timeout = setTimeout(() => {
      xhr.abort()
      resolve(-1)
    }, 5000)

    try {
      xhr.open('HEAD', `https://${host}`, true)
      xhr.onload = () => {
        clearTimeout(timeout)
        const endTime = performance.now()
        resolve(endTime - startTime)
      }
      xhr.onerror = () => {
        clearTimeout(timeout)
        resolve(-1)
      }
      xhr.send()
    } catch (e) {
      clearTimeout(timeout)
      resolve(-1)
    }
  })
}

async function startTest() {
  if (!targetHost.value.trim()) return

  results.value = []
  testing.value = true
  currentTest.value = 0

  for (let i = 0; i < testCount.value; i++) {
    currentTest.value = i + 1

    const latency = await measureLatency(targetHost.value)
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    results.value.push({
      latency,
      time: timeStr
    })

    await new Promise(resolve => setTimeout(resolve, 200))
  }

  testing.value = false
}

function clearResults() {
  results.value = []
  currentTest.value = 0
}
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

.tester-card {
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
  box-sizing: border-box;
}

.test-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-group {
  flex: 1;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
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

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.loading-section {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e5e5;
  border-top-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-section {
  margin-bottom: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-value.excellent { color: #10b981; }
.stat-value.good { color: #22c55e; }
.stat-value.fair { color: #f59e0b; }
.stat-value.poor { color: #ef4444; }
.stat-value.warning { color: #ef4444; }
.stat-value.success { color: #10b981; }

.history-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.history-header,
.history-item {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 80px;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-align: center;
}

.history-header {
  background: #f5f5f5;
  font-weight: 600;
  font-size: 0.9rem;
}

.history-item {
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item .error {
  color: #ef4444;
}

.status-error {
  color: #ef4444;
}

.status-ok {
  color: #10b981;
}

.info-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.info-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-section li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .tester-card {
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

.dark .stat-item {
  background: #1a1a1a;
}

.dark .history-list {
  background: #1a1a1a;
}

.dark .history-header {
  background: #333;
}

.dark .history-item {
  border-color: #333;
}

.dark .info-section {
  background: #1e3a5f;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .history-header,
  .history-item {
    grid-template-columns: 40px 1fr 1fr 60px;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
