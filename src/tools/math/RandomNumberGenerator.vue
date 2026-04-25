<template>
  <div class="tool-container">
    <h1 class="title">随机数生成器</h1>
    <p class="description">生成指定范围内的随机整数或小数，支持批量生成和去重。</p>

    <div class="generator-card">
      <div class="form-group">
        <label>生成数量：</label>
        <input
          v-model.number="count"
          type="number"
          min="1"
          max="1000"
          class="number-input"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>最小值：</label>
          <input
            v-model.number="min"
            type="number"
            class="number-input"
          />
        </div>
        <div class="form-group">
          <label>最大值：</label>
          <input
            v-model.number="max"
            type="number"
            class="number-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label>数字类型：</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="type" value="integer" />
            整数
          </label>
          <label class="radio-label">
            <input type="radio" v-model="type" value="float" />
            小数
          </label>
        </div>
      </div>

      <div v-if="type === 'float'" class="form-group">
        <label>小数位数：</label>
        <input
          v-model.number="decimalPlaces"
          type="number"
          min="1"
          max="10"
          class="number-input"
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="unique" />
          生成不重复的随机数
        </label>
      </div>

      <button @click="generate" class="btn-primary">生成随机数</button>
    </div>

    <div v-if="results.length > 0" class="result-card">
      <div class="result-header">
        <span>生成结果</span>
        <div class="result-actions">
          <span class="count-badge">{{ results.length }} 个数字</span>
          <button @click="copyResults" class="btn-small">复制</button>
          <button @click="clearResults" class="btn-small">清空</button>
        </div>
      </div>
      <div class="results-display">
        <div
          v-for="(num, index) in results"
          :key="index"
          class="result-item"
        >
          {{ formatNumber(num) }}
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(10)
const min = ref(1)
const max = ref(100)
const type = ref('integer')
const decimalPlaces = ref(4)
const unique = ref(false)
const results = ref([])
const error = ref('')

function generate() {
  error.value = ''
  results.value = []

  if (min.value >= max.value) {
    error.value = '最小值必须小于最大值'
    return
  }

  if (count.value < 1 || count.value > 1000) {
    error.value = '生成数量必须在 1-1000 之间'
    return
  }

  if (unique.value) {
    const range = max.value - min.value + 1
    if (count.value > range) {
      error.value = `在范围内（${range} 个数字）无法生成 ${count.value} 个不重复的数字`
      return
    }
  }

  const generated = new Set()

  if (type.value === 'integer') {
    if (unique.value) {
      while (generated.size < count.value) {
        const num = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
        generated.add(num)
      }
    } else {
      for (let i = 0; i < count.value; i++) {
        const num = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
        generated.add(num)
      }
    }
    results.value = Array.from(generated)
  } else {
    for (let i = 0; i < count.value; i++) {
      const num = Math.random() * (max.value - min.value) + min.value
      generated.add(num)
    }
    results.value = Array.from(generated)
  }

  if (type.value === 'integer') {
    results.value.sort((a, b) => a - b)
  }
}

function formatNumber(num) {
  if (type.value === 'float') {
    return num.toFixed(decimalPlaces.value)
  }
  return num.toString()
}

function copyResults() {
  const text = results.value.map(n => formatNumber(n)).join(', ')
  navigator.clipboard.writeText(text)
}

function clearResults() {
  results.value = []
  error.value = ''
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

.generator-card,
.result-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.generator-card {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group > label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.number-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
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

.btn-primary:hover {
  background: #1d4ed8;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.count-badge {
  font-size: 0.85rem;
  color: #666;
  font-weight: normal;
}

.results-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result-item {
  padding: 0.4rem 0.75rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.95rem;
}

.btn-small {
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-small:hover {
  background: #f0f0f0;
}

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  text-align: center;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .generator-card,
.dark .result-card {
  background: #262626;
}

.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-item {
  background: #1a1a1a;
  border-color: #404040;
}

.dark .btn-small {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .count-badge {
  color: #a3a3a3;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}
</style>
