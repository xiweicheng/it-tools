<template>
  <div class="tool-container">
    <h1 class="title">数据速率换算</h1>
    <p class="description">在不同数据速率单位之间进行换算，如 bps、Kbps、Mbps、Gbps 等。</p>

    <div class="converter-section">
      <div class="input-group">
        <label>输入数值：</label>
        <input
          v-model.number="inputValue"
          type="number"
          class="number-input"
          @input="convert"
        />
      </div>

      <div class="input-group">
        <label>选择单位：</label>
        <select v-model="fromUnit" class="select-input" @change="convert">
          <option value="bps">比特/秒 (bps)</option>
          <option value="Kbps">千比特/秒 (Kbps)</option>
          <option value="Mbps">兆比特/秒 (Mbps)</option>
          <option value="Gbps">吉比特/秒 (Gbps)</option>
          <option value="Tbps">太比特/秒 (Tbps)</option>
          <option value="Bps">字节/秒 (Bps)</option>
          <option value="KBps">千字节/秒 (KBps)</option>
          <option value="MBps">兆字节/秒 (MBps)</option>
          <option value="GBps">吉字节/秒 (GBps)</option>
        </select>
      </div>
    </div>

    <div class="visual-bar">
      <div class="bar-label">数据速率</div>
      <div class="bar-container">
        <div class="bar-fill" :style="{ width: barWidth + '%' }"></div>
      </div>
      <div class="bar-unit">{{ formatRate(bpsValue) }}</div>
    </div>

    <div class="results-grid">
      <div class="result-card">
        <div class="card-header">
          <span>比特/秒 (bps)</span>
          <button @click="copy(bpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(bpsValue) }} bps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>千比特/秒 (Kbps)</span>
          <button @click="copy(kbpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(kbpsValue) }} Kbps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>兆比特/秒 (Mbps)</span>
          <button @click="copy(mbpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(mbpsValue) }} Mbps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>吉比特/秒 (Gbps)</span>
          <button @click="copy(gbpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(gbpsValue) }} Gbps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>太比特/秒 (Tbps)</span>
          <button @click="copy(tbpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(tbpsValue) }} Tbps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>字节/秒 (Bps)</span>
          <button @click="copy(BpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(BpsValue) }} Bps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>千字节/秒 (KBps)</span>
          <button @click="copy(KBpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(KBpsValue) }} KBps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>兆字节/秒 (MBps)</span>
          <button @click="copy(MBpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(MBpsValue) }} MBps</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>吉字节/秒 (GBps)</span>
          <button @click="copy(GBpsValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ formatNumber(GBpsValue) }} GBps</div>
      </div>
    </div>

    <div class="info-section">
      <h3>换算说明</h3>
      <ul>
        <li>1 字节 (Byte) = 8 比特 (bit)</li>
        <li>1 Kbps = 1000 bps（不是 1024）</li>
        <li>1 Mbps = 1000 Kbps</li>
        <li>1 Gbps = 1000 Mbps</li>
        <li>1 Tbps = 1000 Gbps</li>
      </ul>
      <p class="note">注意：网络运营商常用的 "Mbps" 是兆比特/秒，而下载软件显示的 "MB/s" 是兆字节/秒，两者相差 8 倍。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref(100)
const fromUnit = ref('Mbps')

const bpsValue = computed(() => {
  if (!inputValue.value) return 0

  const bitRates = {
    'bps': 1,
    'Kbps': 1000,
    'Mbps': 1000 * 1000,
    'Gbps': 1000 * 1000 * 1000,
    'Tbps': 1000 * 1000 * 1000 * 1000,
    'Bps': 8,
    'KBps': 8 * 1000,
    'MBps': 8 * 1000 * 1000,
    'GBps': 8 * 1000 * 1000 * 1000
  }

  return inputValue.value * bitRates[fromUnit.value]
})

const kbpsValue = computed(() => bpsValue.value / 1000)
const mbpsValue = computed(() => bpsValue.value / (1000 * 1000))
const gbpsValue = computed(() => bpsValue.value / (1000 * 1000 * 1000))
const tbpsValue = computed(() => bpsValue.value / (1000 * 1000 * 1000 * 1000))
const BpsValue = computed(() => bpsValue.value / 8)
const KBpsValue = computed(() => bpsValue.value / 8 / 1000)
const MBpsValue = computed(() => bpsValue.value / 8 / (1000 * 1000))
const GBpsValue = computed(() => bpsValue.value / 8 / (1000 * 1000 * 1000))

const barWidth = computed(() => {
  const max = 100 * 1000 * 1000
  const percentage = Math.min((mbpsValue.value / max) * 100, 100)
  return percentage
})

function convert() {
}

function formatNumber(num) {
  if (num === 0) return '0'
  if (num < 0.001) return num.toExponential(4)
  if (num >= 1000000000) return (num / 1000000000).toFixed(4) + 'G'
  if (num >= 1000000) return (num / 1000000).toFixed(4) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(4) + 'K'
  return num.toFixed(4)
}

function formatRate(bps) {
  if (bps >= 1000000000) return (bps / 1000000000).toFixed(2) + ' Gbps'
  if (bps >= 1000000) return (bps / 1000000).toFixed(2) + ' Mbps'
  if (bps >= 1000) return (bps / 1000).toFixed(2) + ' Kbps'
  return bps.toFixed(2) + ' bps'
}

function copy(value) {
  navigator.clipboard.writeText(value.toString())
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

.converter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 12px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.number-input,
.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.visual-bar {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.bar-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.bar-container {
  height: 24px;
  background: #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  border-radius: 12px;
  transition: width 0.3s ease;
}

.bar-unit {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.card-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
  word-break: break-all;
}

.btn-copy {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-copy:hover {
  background: #f0f0f0;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.info-section ul {
  margin: 0 0 1rem 0;
  padding-left: 1.25rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.25rem;
}

.note {
  font-size: 0.9rem;
  color: #666;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
  border-left: 3px solid #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-section,
.dark .visual-bar,
.dark .result-card,
.dark .info-section {
  background: #262626;
}

.dark .number-input,
.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .bar-container {
  background: #404040;
}

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-copy:hover {
  background: #404040;
}

.dark .note {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .converter-section {
    flex-direction: column;
  }

  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
