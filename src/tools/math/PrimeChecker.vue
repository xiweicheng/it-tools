<template>
  <div class="tool-container">
    <h1 class="title">质数检测/生成工具</h1>
    <p class="description">检测一个数是否为质数，或生成指定范围内的所有质数。</p>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'check' }"
        @click="activeTab = 'check'"
      >
        质数检测
      </button>
      <button
        :class="{ active: activeTab === 'generate' }"
        @click="activeTab = 'generate'"
      >
        质数生成
      </button>
    </div>

    <div v-if="activeTab === 'check'" class="tab-content">
      <div class="check-card">
        <div class="form-group">
          <label>输入数字：</label>
          <input
            v-model.number="checkNumber"
            type="number"
            class="number-input"
            placeholder="输入要检测的数字"
            @keyup.enter="checkPrime"
          />
        </div>
        <button @click="checkPrime" class="btn-primary">检测</button>

        <div v-if="checkResult !== null" class="result-box" :class="checkResult ? 'is-prime' : 'not-prime'">
          <div class="result-icon">{{ checkResult ? '✓' : '✗' }}</div>
          <div class="result-text">
            <strong>{{ checkNumber }}</strong> {{ checkResult ? '是质数' : '不是质数' }}
          </div>
          <div v-if="checkResult && factors.length > 0" class="result-info">
            质因数：{{ factors.join(' × ') }} = {{ checkNumber }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'generate'" class="tab-content">
      <div class="generate-card">
        <div class="form-row">
          <div class="form-group">
            <label>起始值：</label>
            <input
              v-model.number="startNum"
              type="number"
              min="2"
              class="number-input"
            />
          </div>
          <div class="form-group">
            <label>结束值：</label>
            <input
              v-model.number="endNum"
              type="number"
              min="2"
              class="number-input"
            />
          </div>
        </div>
        <button @click="generatePrimes" class="btn-primary">生成质数</button>

        <div v-if="primes.length > 0" class="result-section">
          <div class="result-header">
            <span>在 {{ startNum }} 到 {{ endNum }} 之间找到 {{ primes.length }} 个质数</span>
            <button @click="copyPrimes" class="btn-small">复制</button>
          </div>
          <div class="primes-display">
            <span
              v-for="prime in primes"
              :key="prime"
              class="prime-item"
            >
              {{ prime }}
            </span>
          </div>
        </div>

        <div v-if="noPrimesFound" class="info-message">
          在指定范围内没有找到质数
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('check')
const checkNumber = ref(null)
const checkResult = ref(null)
const factors = ref([])

const startNum = ref(2)
const endNum = ref(100)
const primes = ref([])
const noPrimesFound = ref(false)

function isPrime(n) {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false

  const sqrt = Math.sqrt(n)
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function getPrimeFactors(n) {
  const factors = []
  let num = n
  let divisor = 2

  while (num > 1) {
    while (num % divisor === 0) {
      factors.push(divisor)
      num = num / divisor
    }
    divisor++
  }

  return factors
}

function checkPrime() {
  if (checkNumber.value === null || isNaN(checkNumber.value)) {
    checkResult.value = null
    return
  }

  checkResult.value = isPrime(checkNumber.value)

  if (!checkResult.value && checkNumber.value > 1) {
    factors.value = getPrimeFactors(checkNumber.value)
  } else {
    factors.value = []
  }
}

function generatePrimes() {
  noPrimesFound.value = false
  primes.value = []

  if (startNum.value >= endNum.value) {
    noPrimesFound.value = true
    return
  }

  for (let i = startNum.value; i <= endNum.value; i++) {
    if (isPrime(i)) {
      primes.value.push(i)
    }
  }

  if (primes.value.length === 0) {
    noPrimesFound.value = true
  }
}

function copyPrimes() {
  navigator.clipboard.writeText(primes.value.join(', '))
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
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.tabs button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: #2563eb;
  color: white;
}

.check-card,
.generate-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
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
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.number-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
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

.result-box {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.result-box.is-prime {
  background: #dcfce7;
}

.result-box.not-prime {
  background: #fee2e2;
}

.result-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.result-box.is-prime .result-icon {
  color: #166534;
}

.result-box.not-prime .result-icon {
  color: #991b1b;
}

.result-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.result-box.is-prime .result-text {
  color: #166534;
}

.result-box.not-prime .result-text {
  color: #991b1b;
}

.result-info {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #666;
}

.result-section {
  margin-top: 1.5rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.primes-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
}

.prime-item {
  padding: 0.35rem 0.65rem;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #166534;
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

.info-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  text-align: center;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .tabs {
  background: #404040;
}

.dark .tabs button:not(.active) {
  color: #a3a3a3;
}

.dark .check-card,
.dark .generate-card {
  background: #262626;
}

.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-box.is-prime {
  background: #14532d;
}

.dark .result-box.not-prime {
  background: #7f1d1d;
}

.dark .result-box.is-prime .result-icon,
.dark .result-box.is-prime .result-text {
  color: #bbf7d0;
}

.dark .result-box.not-prime .result-icon,
.dark .result-box.not-prime .result-text {
  color: #fecaca;
}

.dark .primes-display {
  background: #1a1a1a;
}

.dark .prime-item {
  background: #14532d;
  border-color: #166534;
  color: #bbf7d0;
}

.dark .btn-small {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .info-message {
  background: #78350f;
  color: #fef3c7;
}
</style>
