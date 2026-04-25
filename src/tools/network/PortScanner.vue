<template>
  <div class="tool-container">
    <h1 class="title">端口检测工具</h1>
    <p class="description">检测目标主机的端口开放状态，支持单端口和端口范围检测。</p>

    <div class="input-section">
      <div class="form-row">
        <div class="form-group">
          <label>目标主机：</label>
          <input
            v-model="host"
            type="text"
            class="text-input"
            placeholder="如: 192.168.1.1 或 example.com"
          />
        </div>
        <div class="form-group">
          <label>检测超时(ms)：</label>
          <input
            v-model.number="timeout"
            type="number"
            class="number-input"
            min="100"
            max="10000"
          />
        </div>
      </div>

      <div class="form-group">
        <label>检测模式：</label>
        <div class="mode-options">
          <label class="radio-label">
            <input type="radio" v-model="mode" value="single" />
            单端口
          </label>
          <label class="radio-label">
            <input type="radio" v-model="mode" value="range" />
            端口范围
          </label>
          <label class="radio-label">
            <input type="radio" v-model="mode" value="common" />
            常用端口
          </label>
        </div>
      </div>

      <div v-if="mode === 'single'" class="form-group">
        <label>端口号：</label>
        <input
          v-model.number="singlePort"
          type="number"
          class="number-input"
          min="1"
          max="65535"
          placeholder="1-65535"
        />
      </div>

      <div v-if="mode === 'range'" class="form-group">
        <label>端口范围：</label>
        <div class="range-inputs">
          <input
            v-model.number="startPort"
            type="number"
            class="number-input"
            min="1"
            max="65535"
            placeholder="起始端口"
          />
          <span class="range-separator">至</span>
          <input
            v-model.number="endPort"
            type="number"
            class="number-input"
            min="1"
            max="65535"
            placeholder="结束端口"
          />
        </div>
      </div>

      <button @click="startScan" class="btn-primary" :disabled="scanning">
        {{ scanning ? '检测中...' : '开始检测' }}
      </button>
    </div>

    <div v-if="results.length > 0" class="results-section">
      <div class="results-header">
        <h3>检测结果</h3>
        <div class="results-summary">
          <span class="stat open">开放: {{ openCount }}</span>
          <span class="stat closed">关闭: {{ closedCount }}</span>
        </div>
      </div>

      <table class="results-table">
        <thead>
          <tr>
            <th>端口</th>
            <th>状态</th>
            <th>服务</th>
            <th>响应时间</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in results"
            :key="result.port"
            :class="result.status"
          >
            <td>{{ result.port }}</td>
            <td>
              <span class="status-badge" :class="result.status">
                {{ result.status === 'open' ? '开放' : '关闭' }}
              </span>
            </td>
            <td>{{ result.service }}</td>
            <td>{{ result.responseTime || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="note-section">
      <h4>说明</h4>
      <ul>
        <li>常用端口包括：21(FTP), 22(SSH), 23(Telnet), 25(SMTP), 53(DNS), 80(HTTP), 110(POP3), 143(IMAP), 443(HTTPS), 3306(MySQL), 3389(RDP), 5432(PostgreSQL), 6379(Redis), 8080(HTTP-Alt), 27017(MongoDB)</li>
        <li>部分端口可能需要管理员权限才能检测</li>
        <li>检测结果仅供参考，实际服务状态可能不同</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const host = ref('127.0.0.1')
const timeout = ref(2000)
const mode = ref('common')
const singlePort = ref(80)
const startPort = ref(1)
const endPort = ref(100)
const scanning = ref(false)
const results = ref([])

const commonPorts = [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995,
  3306, 3389, 5432, 6379, 8080, 8443, 27017
]

const portServices = {
  21: 'FTP',
  22: 'SSH',
  23: 'Telnet',
  25: 'SMTP',
  53: 'DNS',
  80: 'HTTP',
  110: 'POP3',
  143: 'IMAP',
  443: 'HTTPS',
  465: 'SMTPS',
  587: 'SMTP',
  993: 'IMAPS',
  995: 'POP3S',
  3306: 'MySQL',
  3389: 'RDP',
  5432: 'PostgreSQL',
  6379: 'Redis',
  8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt',
  27017: 'MongoDB'
}

const openCount = ref(0)
const closedCount = ref(0)

async function checkPort(port) {
  const startTime = Date.now()

  return new Promise((resolve) => {
    const socket = new WebSocket(`ws://${host.value}:${port}`)

    socket.onopen = () => {
      const responseTime = Date.now() - startTime
      socket.close()
      resolve({ port, status: 'open', service: portServices[port] || '-', responseTime: `${responseTime}ms` })
    }

    socket.onerror = () => {
      resolve({ port, status: 'closed', service: portServices[port] || '-', responseTime: null })
    }

    setTimeout(() => {
      socket.close()
      resolve({ port, status: 'closed', service: portServices[port] || '-', responseTime: null })
    }, timeout.value)
  })
}

async function startScan() {
  if (!host.value) return

  scanning.value = true
  results.value = []
  openCount.value = 0
  closedCount.value = 0

  let ports = []

  switch (mode.value) {
    case 'single':
      ports = [singlePort.value]
      break
    case 'range':
      ports = []
      for (let i = startPort.value; i <= endPort.value; i++) {
        ports.push(i)
      }
      break
    case 'common':
      ports = commonPorts
      break
  }

  if (ports.length > 100) {
    ports = ports.slice(0, 100)
  }

  const scanPromises = ports.map(port => checkPort(port))
  const scanResults = await Promise.all(scanPromises)

  scanResults.sort((a, b) => a.port - b.port)

  results.value = scanResults
  openCount.value = scanResults.filter(r => r.status === 'open').length
  closedCount.value = scanResults.filter(r => r.status === 'closed').length

  scanning.value = false
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
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

.form-group > label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input,
.number-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.number-input {
  width: 150px;
}

.mode-options {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.range-separator {
  color: #666;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.results-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.results-summary {
  display: flex;
  gap: 1rem;
}

.stat {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.stat.open {
  background: #dcfce7;
  color: #166534;
}

.stat.closed {
  background: #fee2e2;
  color: #991b1b;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.results-table th {
  font-weight: 500;
  font-size: 0.9rem;
  color: #666;
}

.results-table tr.open td {
  background: #f0fdf4;
}

.results-table tr.closed td {
  background: #fef2f2;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status-badge.open {
  background: #dcfce7;
  color: #166534;
}

.status-badge.closed {
  background: #fee2e2;
  color: #991b1b;
}

.note-section {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.note-section h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.note-section ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #666;
  font-size: 0.9rem;
}

.note-section li {
  margin-bottom: 0.25rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .input-section,
.dark .results-section,
.dark .note-section {
  background: #262626;
}

.dark .text-input,
.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .results-table th {
  color: #a3a3a3;
}

.dark .results-table td {
  border-color: #404040;
}

.dark .results-table tr.open td {
  background: #14532d;
}

.dark .results-table tr.closed td {
  background: #7f1d1d;
}

.dark .stat.open {
  background: #14532d;
  color: #bbf7d0;
}

.dark .stat.closed {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .status-badge.open {
  background: #14532d;
  color: #bbf7d0;
}

.dark .status-badge.closed {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .note-section ul {
  color: #a3a3a3;
}
</style>
