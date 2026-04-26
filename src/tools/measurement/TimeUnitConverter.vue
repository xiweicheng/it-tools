<template>
  <div class="tool-container">
    <h1 class="title">时间单位换算</h1>
    <p class="description">在不同时间单位之间进行换算，如毫秒、秒、分钟、小时、天等。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>输入时间值：</label>
        <input
          v-model.number="inputValue"
          type="number"
          class="text-input"
          placeholder="输入时间值"
          @input="convertAll"
        />
      </div>

      <div class="form-group">
        <label>原始单位：</label>
        <select v-model="fromUnit" class="select-input" @change="convertAll">
          <option v-for="unit in timeUnits" :key="unit.value" :value="unit.value">
            {{ unit.label }}
          </option>
        </select>
      </div>

      <div class="results-section">
        <h3>换算结果</h3>
        <div class="results-grid">
          <div
            v-for="unit in timeUnits"
            :key="unit.value"
            class="result-item"
            :class="{ active: unit.value === fromUnit }"
          >
            <div class="result-label">{{ unit.label }}</div>
            <div class="result-value">{{ formatNumber(convertedValues[unit.value]) }}</div>
          </div>
        </div>
      </div>

      <div class="common-conversions">
        <h3>常用换算</h3>
        <div class="conversion-list">
          <div class="conversion-item">
            <code>1 分钟</code> = <code>60 秒</code> = <code>60,000 毫秒</code>
          </div>
          <div class="conversion-item">
            <code>1 小时</code> = <code>3,600 秒</code> = <code>3,600,000 毫秒</code>
          </div>
          <div class="conversion-item">
            <code>1 天</code> = <code>86,400 秒</code> = <code>86,400,000 毫秒</code>
          </div>
          <div class="conversion-item">
            <code>1 周</code> = <code>604,800 秒</code> = <code>604,800,000 毫秒</code>
          </div>
          <div class="conversion-item">
            <code>1 年 (365天)</code> = <code>31,536,000 秒</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const inputValue = ref(1)
const fromUnit = ref('hour')

const timeUnits = [
  { value: 'millisecond', label: '毫秒 (ms)', factor: 1 },
  { value: 'second', label: '秒 (s)', factor: 1000 },
  { value: 'minute', label: '分钟 (min)', factor: 60000 },
  { value: 'hour', label: '小时 (h)', factor: 3600000 },
  { value: 'day', label: '天 (d)', factor: 86400000 },
  { value: 'week', label: '周 (w)', factor: 604800000 },
  { value: 'month', label: '月 (30天)', factor: 2592000000 },
  { value: 'year', label: '年 (365天)', factor: 31536000000 }
]

const convertedValues = reactive({})

function convertAll() {
  const baseValue = inputValue.value
  const fromFactor = timeUnits.find(u => u.value === fromUnit.value)?.factor || 1
  const valueInMs = baseValue * fromFactor

  timeUnits.forEach(unit => {
    convertedValues[unit.value] = valueInMs / unit.factor
  })
}

function formatNumber(num) {
  if (num === 0) return '0'
  if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e10) {
    return num.toExponential(4)
  }
  if (Number.isInteger(num)) {
    return num.toLocaleString()
  }
  return parseFloat(num.toPrecision(10)).toString()
}

convertAll()
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

.converter-card {
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

.text-input,
.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.2rem;
  box-sizing: border-box;
  text-align: center;
}

.results-section {
  margin: 2rem 0;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.result-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.result-item.active {
  border-color: #2563eb;
  background: #e3f2fd;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
  word-break: break-all;
}

.common-conversions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.common-conversions h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.conversion-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversion-item {
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
  font-size: 0.95rem;
}

.conversion-item code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  color: #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card {
  background: #262626;
}

.dark .text-input,
.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item {
  background: #1a1a1a;
}

.dark .result-item.active {
  background: #1e3a8a;
}

.dark .conversion-item {
  background: #1a1a1a;
}

.dark .conversion-item code {
  background: #333;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
