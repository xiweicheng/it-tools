<template>
  <div class="ping-tester">
    <h2>Ping 测试工具</h2>

    <div class="tester-container">
      <div class="input-section">
        <h3>输入目标</h3>
        <div class="input-group">
          <input
            type="text"
            v-model="target"
            placeholder="输入域名或 IP 地址 (如: google.com)"
            @keyup.enter="startPing"
          />
          <select v-model="protocol">
            <option value="ipv4">IPv4</option>
            <option value="ipv6">IPv6</option>
          </select>
          <button @click="startPing" :disabled="isPinging" class="start-btn">
            {{ isPinging ? '测试中...' : '开始测试' }}
          </button>
        </div>

        <div class="quick-targets">
          <span>快速测试:</span>
          <button @click="target = 'google.com'; startPing()">Google</button>
          <button @click="target = 'baidu.com'; startPing()">百度</button>
          <button @click="target = 'cloudflare.com'; startPing()">Cloudflare</button>
          <button @click="target = 'github.com'; startPing()">GitHub</button>
        </div>
      </div>

      <div class="result-section" v-if="results.length > 0">
        <div class="result-header">
          <h3>测试结果</h3>
          <div class="result-stats">
            <span class="stat">
              <span class="label">平均延迟:</span>
              <span class="value" :class="avgLatencyClass">{{ avgLatency }}ms</span>
            </span>
            <span class="stat">
              <span class="label">最快:</span>
              <span class="value">{{ minLatency }}ms</span>
            </span>
            <span class="stat">
              <span class="label">最慢:</span>
              <span class="value">{{ maxLatency }}ms</span>
            </span>
            <span class="stat">
              <span class="label">丢包:</span>
              <span class="value" :class="packetLossClass">{{ packetLoss }}%</span>
            </span>
          </div>
        </div>

        <div class="results-list">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="result-item"
            :class="{ timeout: result.timeout }"
          >
            <span class="seq">{{ index + 1 }}</span>
            <span class="time" v-if="!result.timeout">{{ result.time }}ms</span>
            <span class="time timeout" v-else>超时</span>
            <span class="ip" v-if="result.ip">{{ result.ip }}</span>
          </div>
        </div>

        <div class="chart-container">
          <div class="latency-chart">
            <div
              v-for="(result, index) in chartResults"
              :key="index"
              class="chart-bar"
              :class="getLatencyClass(result.time)"
              :style="{ height: getBarHeight(result.time) + '%' }"
              :title="result.time + 'ms'"
            ></div>
          </div>
          <div class="chart-labels">
            <span>0ms</span>
            <span>{{ maxLatency }}ms</span>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>输入目标地址并点击"开始测试"进行 Ping 检测</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const target = ref('')
const protocol = ref('ipv4')
const isPinging = ref(false)
const results = ref([])
const maxResults = 10

const chartResults = computed(() => {
  return results.value.filter(r => !r.timeout).slice(-maxResults)
})

const avgLatency = computed(() => {
  const validResults = results.value.filter(r => !r.timeout)
  if (validResults.length === 0) return 0
  const sum = validResults.reduce((acc, r) => acc + r.time, 0)
  return Math.round(sum / validResults.length)
})

const minLatency = computed(() => {
  const validResults = results.value.filter(r => !r.timeout)
  if (validResults.length === 0) return 0
  return Math.min(...validResults.map(r => r.time))
})

const maxLatency = computed(() => {
  const validResults = results.value.filter(r => !r.timeout)
  if (validResults.length === 0) return 0
  return Math.max(...validResults.map(r => r.time))
})

const packetLoss = computed(() => {
  if (results.value.length === 0) return 0
  const lost = results.value.filter(r => r.timeout).length
  return Math.round((lost / results.value.length) * 100)
})

const avgLatencyClass = computed(() => {
  if (avgLatency.value < 50) return 'fast'
  if (avgLatency.value < 150) return 'medium'
  return 'slow'
})

const packetLossClass = computed(() => {
  if (packetLoss.value === 0) return 'good'
  if (packetLoss.value < 10) return 'warning'
  return 'bad'
})

const getLatencyClass = (time) => {
  if (time < 50) return 'fast'
  if (time < 150) return 'medium'
  return 'slow'
}

const getBarHeight = (time) => {
  if (maxLatency.value === 0) return 10
  return Math.max(10, (time / maxLatency.value) * 100)
}

const startPing = async () => {
  if (!target.value || isPinging.value) return

  isPinging.value = true
  results.value = []

  const host = target.value.trim()

  for (let i = 0; i < maxResults; i++) {
    const startTime = performance.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`https://dns.google/resolve?name=${host}&type=${protocol.value === 'ipv6' ? '28' : '1'}`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const endTime = performance.now()
      const latency = Math.round(endTime - startTime)

      const data = await response.json()

      results.value.push({
        time: latency,
        timeout: false,
        ip: data.Answer ? data.Answer[0]?.data : null
      })
    } catch (e) {
      results.value.push({
        time: 0,
        timeout: true,
        ip: null
      })
    }

    if (i < maxResults - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  isPinging.value = false
}
</script>

<style scoped>
.ping-tester {
  padding: 20px;
}
.tester-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-section,
.result-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.input-group {
  display: flex;
  gap: 10px;
}
.input-group input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}
.input-group select {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.start-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.quick-targets {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.quick-targets span {
  font-size: 12px;
  color: var(--text-secondary);
}
.quick-targets button {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.quick-targets button:hover {
  background: var(--border-color);
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}
.result-header h3 {
  margin: 0;
}
.result-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  gap: 6px;
  align-items: center;
}
.stat .label {
  font-size: 12px;
  color: var(--text-secondary);
}
.stat .value {
  font-weight: bold;
}
.stat .value.fast { color: #4CAF50; }
.stat .value.medium { color: #FF9800; }
.stat .value.slow { color: #F44336; }
.stat .value.good { color: #4CAF50; }
.stat .value.warning { color: #FF9800; }
.stat .value.bad { color: #F44336; }
.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}
.result-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.result-item .seq {
  width: 30px;
  color: var(--text-secondary);
}
.result-item .time {
  font-weight: bold;
  min-width: 80px;
}
.result-item .time.fast { color: #4CAF50; }
.result-item .time.medium { color: #FF9800; }
.result-item .time.slow { color: #F44336; }
.result-item .time.timeout {
  color: #9E9E9E;
}
.result-item .ip {
  font-size: 12px;
  color: var(--text-secondary);
}
.result-item.timeout {
  opacity: 0.6;
}
.chart-container {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.latency-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 100px;
  background: var(--bg-secondary);
  padding: 10px;
  border-radius: 4px;
}
.chart-bar {
  flex: 1;
  min-width: 20px;
  background: #4CAF50;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s;
}
.chart-bar.fast { background: #4CAF50; }
.chart-bar.medium { background: #FF9800; }
.chart-bar.slow { background: #F44336; }
.chart-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-secondary);
  height: 100px;
}
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--card-bg);
  border-radius: 8px;
}
</style>
