<template>
  <div class="tool-container">
    <h1 class="title">统计计算器</h1>
    <p class="description">计算均值、标准差、方差、中位数等常用统计数据。</p>

    <div class="calculator-card">
      <div class="form-group">
        <label>输入数据（一行一个数字，或用逗号/空格分隔）：</label>
        <textarea
          v-model="inputData"
          class="text-input"
          placeholder="例如: 10, 20, 30, 40, 50&#10;或&#10;10&#10;20&#10;30&#10;40&#10;50"
          rows="8"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="calculate" class="btn-primary">计算</button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="results" class="results-section">
        <h3>统计结果</h3>

        <div class="results-grid">
          <div class="result-card">
            <span class="result-label">数据个数 (n)</span>
            <span class="result-value">{{ results.count }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">总和 (Σx)</span>
            <span class="result-value">{{ results.sum.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">均值 (x̄)</span>
            <span class="result-value">{{ results.mean.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">中位数</span>
            <span class="result-value">{{ results.median.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">众数</span>
            <span class="result-value">{{ results.mode.join(', ') || '无' }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">最小值</span>
            <span class="result-value">{{ results.min.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">最大值</span>
            <span class="result-value">{{ results.max.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">范围</span>
            <span class="result-value">{{ results.range.toFixed(4) }}</span>
          </div>
          <div class="result-card highlight">
            <span class="result-label">方差 (σ²)</span>
            <span class="result-value">{{ results.variance.toFixed(4) }}</span>
          </div>
          <div class="result-card highlight">
            <span class="result-label">标准差 (σ)</span>
            <span class="result-value">{{ results.stdDev.toFixed(4) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">变异系数</span>
            <span class="result-value">{{ results.coefVar.toFixed(4) }}%</span>
          </div>
          <div class="result-card">
            <span class="result-label">偏度</span>
            <span class="result-value">{{ results.skewness.toFixed(4) }}</span>
          </div>
        </div>

        <div class="chart-section">
          <h4>数据分布图</h4>
          <div class="mini-chart">
            <div class="chart-bars">
              <div
                v-for="(bar, index) in chartData"
                :key="index"
                class="chart-bar"
                :style="{ height: (bar / maxValue * 100) + '%' }"
              >
                <span class="bar-label">{{ bar }}</span>
              </div>
            </div>
            <div class="chart-axis">
              <span>最小值</span>
              <span>均值</span>
              <span>最大值</span>
            </div>
          </div>
        </div>

        <div class="sorted-data">
          <h4>排序后的数据</h4>
          <div class="data-list">
            <span v-for="(val, index) in results.sorted" :key="index" class="data-item">
              {{ val.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="formula-section">
      <h3>统计公式说明</h3>
      <div class="formula-grid">
        <div class="formula-item">
          <code>均值 (x̄) = Σx / n</code>
          <span>所有数值之和除以数量</span>
        </div>
        <div class="formula-item">
          <code>方差 (σ²) = Σ(x - x̄)² / n</code>
          <span>每个数据与均值差的平方的平均值</span>
        </div>
        <div class="formula-item">
          <code>标准差 (σ) = √方差</code>
          <span>方差的平方根，衡量数据离散程度</span>
        </div>
        <div class="formula-item">
          <code>变异系数 = (标准差 / 均值) × 100%</code>
          <span>相对离散程度的度量</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputData = ref('')
const results = ref(null)

const chartData = computed(() => {
  if (!results.value) return []
  const data = results.value.sorted
  const bucketCount = 10
  const min = Math.min(...data)
  const max = Math.max(...data)
  const step = (max - min) / bucketCount

  const buckets = new Array(bucketCount).fill(0)
  data.forEach(val => {
    const idx = Math.min(Math.floor((val - min) / step), bucketCount - 1)
    buckets[idx]++
  })

  return buckets
})

const maxValue = computed(() => {
  return Math.max(...chartData.value, 1)
})

function parseData() {
  const text = inputData.value
  const numbers = text
    .split(/[\s,\n]+/)
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n))
  return numbers
}

function calculate() {
  const data = parseData()

  if (data.length === 0) {
    results.value = null
    return
  }

  const sorted = [...data].sort((a, b) => a - b)
  const n = data.length
  const sum = data.reduce((a, b) => a + b, 0)
  const mean = sum / n

  const squaredDiffs = data.map(x => Math.pow(x - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n
  const stdDev = Math.sqrt(variance)

  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)]

  const freq = {}
  data.forEach(x => {
    freq[x] = (freq[x] || 0) + 1
  })
  const maxFreq = Math.max(...Object.values(freq))
  const mode = maxFreq > 1 ? Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number) : []

  const coefVar = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0

  const skewness = stdDev !== 0
    ? (data.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 3), 0)) / n
    : 0

  results.value = {
    count: n,
    sum,
    mean,
    median,
    mode,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    variance,
    stdDev,
    coefVar,
    skewness,
    sorted
  }
}

function loadSample() {
  inputData.value = '23, 45, 67, 12, 89, 34, 56, 78, 90, 11, 45, 67, 23, 45'
  calculate()
}

function clearAll() {
  inputData.value = ''
  results.value = null
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

.calculator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  font-family: monospace;
  box-sizing: border-box;
  resize: vertical;
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
  margin-top: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.results-section h4 {
  margin: 1.5rem 0 1rem;
  font-size: 1rem;
  color: #666;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.result-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.result-card.highlight {
  background: #eff6ff;
  border: 2px solid #2563eb;
}

.result-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2563eb;
}

.chart-section {
  margin-top: 2rem;
}

.mini-chart {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 150px;
  padding: 0 1rem;
}

.chart-bar {
  width: 8%;
  background: linear-gradient(180deg, #2563eb, #3b82f6);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  position: relative;
  transition: height 0.3s ease;
}

.bar-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #666;
  white-space: nowrap;
}

.chart-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0 1rem;
  font-size: 0.85rem;
  color: #666;
}

.sorted-data {
  margin-top: 2rem;
}

.data-list {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.data-item {
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
}

.formula-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.formula-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.formula-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.formula-item code {
  display: block;
  font-size: 0.95rem;
  color: #9333ea;
  margin-bottom: 0.5rem;
}

.formula-item span {
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calculator-card,
.dark .formula-section {
  background: #262626;
}

.dark .text-input {
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

.dark .result-card {
  background: #1a1a1a;
}

.dark .result-card.highlight {
  background: #1e3a5f;
}

.dark .mini-chart,
.dark .data-list,
.dark .formula-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
