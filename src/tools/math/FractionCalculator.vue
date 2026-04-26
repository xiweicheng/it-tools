<template>
  <div class="tool-container">
    <h1 class="title">分数计算器</h1>
    <p class="description">进行分数的加、减、乘、除运算，支持带分数。</p>

    <div class="calculator-card">
      <div class="operation-selector">
        <button
          v-for="op in operations"
          :key="op.symbol"
          :class="{ active: operation === op.symbol }"
          @click="operation = op.symbol"
        >
          {{ op.symbol }}
        </button>
      </div>

      <div class="input-section">
        <div class="fraction-input">
          <div class="fraction-group">
            <div class="fraction-row">
              <input
                v-model.number="num1"
                type="number"
                class="number-input"
              />
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-row">
              <input
                v-model.number="den1"
                type="number"
                class="number-input"
              />
            </div>
          </div>

          <span class="operation-symbol">{{ operation }}</span>

          <div class="fraction-group">
            <div class="fraction-row">
              <input
                v-model.number="num2"
                type="number"
                class="number-input"
              />
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-row">
              <input
                v-model.number="den2"
                type="number"
                class="number-input"
              />
            </div>
          </div>

          <span class="equals">=</span>

          <button @click="calculate" class="btn-calculate">计算</button>
        </div>
      </div>

      <div v-if="result" class="result-section">
        <h3>计算结果</h3>

        <div class="result-display">
          <div class="fraction-result">
            <div class="fraction-group large">
              <div class="fraction-row">
                <span class="result-number">{{ result.numerator }}</span>
              </div>
              <div class="fraction-line"></div>
              <div class="fraction-row">
                <span class="result-number">{{ result.denominator }}</span>
              </div>
            </div>
          </div>

          <div class="result-info">
            <div class="info-item">
              <span class="info-label">小数形式</span>
              <span class="info-value">{{ result.decimal }}</span>
            </div>
            <div class="info-item" v-if="result.mixed">
              <span class="info-label">带分数</span>
              <span class="info-value">{{ result.mixed }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">化简结果</span>
              <span class="info-value">{{ result.simplified }}</span>
            </div>
          </div>
        </div>

        <div class="steps-section">
          <h4>计算步骤</h4>
          <ol>
            <li v-for="(step, index) in result.steps" :key="index">{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="history-section" v-if="history.length > 0">
      <h3>计算历史</h3>
      <div class="history-list">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
          @click="loadFromHistory(item)"
        >
          <span>{{ item.expression }}</span>
          <span class="history-result">= {{ item.result }}</span>
        </div>
      </div>
      <button @click="clearHistory" class="btn-clear">清除历史</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const operations = [
  { symbol: '+', name: '加法' },
  { symbol: '-', name: '减法' },
  { symbol: '×', name: '乘法' },
  { symbol: '÷', name: '除法' }
]

const operation = ref('+')
const num1 = ref(1)
const den1 = ref(2)
const num2 = ref(1)
const den2 = ref(4)
const result = ref(null)
const history = ref([])

function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function simplify(n, d) {
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

function calculate() {
  if (den1.value === 0 || den2.value === 0) {
    alert('分母不能为零')
    return
  }

  const steps = []
  let numResult, denResult

  steps.push(`第一个分数: ${num1.value}/${den1.value}`)
  steps.push(`第二个分数: ${num2.value}/${den2.value}`)

  switch (operation.value) {
    case '+':
      denResult = den1.value * den2.value
      numResult = num1.value * den2.value + num2.value * den1.value
      steps.push(`通分: 第一个分数 = ${num1.value * den2.value}/${denResult}`)
      steps.push(`通分: 第二个分数 = ${num2.value * den1.value}/${denResult}`)
      steps.push(`分子相加: ${num1.value * den2.value} + ${num2.value * den1.value} = ${numResult}`)
      break

    case '-':
      denResult = den1.value * den2.value
      numResult = num1.value * den2.value - num2.value * den1.value
      steps.push(`通分: 第一个分数 = ${num1.value * den2.value}/${denResult}`)
      steps.push(`通分: 第二个分数 = ${num2.value * den1.value}/${denResult}`)
      steps.push(`分子相减: ${num1.value * den2.value} - ${num2.value * den1.value} = ${numResult}`)
      break

    case '×':
      numResult = num1.value * num2.value
      denResult = den1.value * den2.value
      steps.push(`分子相乘: ${num1.value} × ${num2.value} = ${numResult}`)
      steps.push(`分母相乘: ${den1.value} × ${den2.value} = ${denResult}`)
      break

    case '÷':
      numResult = num1.value * den2.value
      denResult = den1.value * num2.value
      steps.push(`除法变乘法: 第二个分数翻转 ${num2.value}/${den2.value} → ${den2.value}/${num2.value}`)
      steps.push(`分子相乘: ${num1.value} × ${den2.value} = ${numResult}`)
      steps.push(`分母相乘: ${den1.value} × ${num2.value} = ${denResult}`)
      break
  }

  const simplified = simplify(numResult, denResult)
  const decimal = (simplified.n / simplified.d).toFixed(6)

  let mixed = ''
  if (Math.abs(simplified.n) >= simplified.d) {
    const whole = Math.floor(simplified.n / simplified.d)
    const remainder = Math.abs(simplified.n % simplified.d)
    if (remainder === 0) {
      mixed = whole.toString()
    } else {
      mixed = `${whole} ${remainder}/${simplified.d}`
    }
  }

  steps.push(`化简: ${simplified.n}/${simplified.d}`)

  result.value = {
    numerator: simplified.n,
    denominator: simplified.d,
    decimal,
    mixed,
    simplified: `${simplified.n}/${simplified.d}`,
    steps
  }

  const expression = `${num1.value}/${den1.value} ${operation.value} ${num2.value}/${den2.value}`
  const resultStr = simplified.n % simplified.d === 0
    ? (simplified.n / simplified.d).toString()
    : `${simplified.n}/${simplified.d}`

  history.value.unshift({ expression, result: resultStr })
  if (history.value.length > 10) {
    history.value.pop()
  }
}

function loadFromHistory(item) {
  // Parse history item if needed
}

function clearHistory() {
  history.value = []
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 700px;
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
  margin-bottom: 1.5rem;
}

.operation-selector {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.operation-selector button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
}

.operation-selector button.active {
  background: #2563eb;
  color: white;
}

.fraction-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.fraction-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fraction-group.large .result-number {
  font-size: 2rem;
}

.fraction-row {
  padding: 0.5rem;
}

.number-input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1.1rem;
  text-align: center;
}

.fraction-line {
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 2px;
}

.operation-symbol {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
}

.equals {
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-calculate {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.btn-calculate:hover {
  background: #1d4ed8;
}

.result-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
}

.result-section h3 {
  margin: 0 0 1rem;
}

.result-display {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fraction-result {
  text-align: center;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 600;
}

.steps-section h4 {
  margin: 0 0 0.75rem;
}

.steps-section ol {
  margin: 0;
  padding-left: 1.5rem;
}

.steps-section li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.history-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.history-section h3 {
  margin: 0 0 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f0f0f0;
}

.history-result {
  font-weight: 600;
  color: #2563eb;
}

.btn-clear {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calculator-card,
.dark .history-section {
  background: #262626;
}

.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-section {
  background: #1a1a1a;
}

.dark .info-item {
  background: #262626;
}

.dark .history-item {
  background: #1a1a1a;
}
</style>
