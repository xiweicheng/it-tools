<template>
  <div class="tool-container">
    <h1 class="title">数列计算工具</h1>
    <p class="description">计算各种数列的项值和总和，支持等差数列、等比数列和斐波那契数列等。</p>

    <div class="sequence-card">
      <div class="form-group">
        <label>选择数列类型：</label>
        <select v-model="sequenceType" class="select-input" @change="resetParameters">
          <option value="arithmetic">等差数列</option>
          <option value="geometric">等比数列</option>
          <option value="fibonacci">斐波那契数列</option>
          <option value="harmonic">调和数列</option>
          <option value="triangular">三角数列</option>
        </select>
      </div>

      <div v-if="sequenceType === 'arithmetic'" class="parameters-grid">
        <div class="form-group">
          <label>首项 (a₁)：</label>
          <input
            v-model.number="params.a1"
            type="number"
            class="number-input"
            @input="calculate"
          />
        </div>
        <div class="form-group">
          <label>公差 (d)：</label>
          <input
            v-model.number="params.d"
            type="number"
            class="number-input"
            @input="calculate"
          />
        </div>
      </div>

      <div v-if="sequenceType === 'geometric'" class="parameters-grid">
        <div class="form-group">
          <label>首项 (a₁)：</label>
          <input
            v-model.number="params.a1"
            type="number"
            class="number-input"
            @input="calculate"
          />
        </div>
        <div class="form-group">
          <label>公比 (r)：</label>
          <input
            v-model.number="params.r"
            type="number"
            class="number-input"
            @input="calculate"
          />
        </div>
      </div>

      <div class="form-group">
        <label>项数 (n)：</label>
        <input
          v-model.number="params.n"
          type="number"
          min="1"
          class="number-input"
          @input="calculate"
        />
      </div>

      <button @click="calculate" class="btn-primary">计算</button>

      <div class="results-section">
        <h3>计算结果</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="result-label">第 n 项值：</div>
            <div class="result-value">{{ nthTerm.toFixed(4) }}</div>
          </div>
          <div class="result-item">
            <div class="result-label">前 n 项和：</div>
            <div class="result-value">{{ sum.toFixed(4) }}</div>
          </div>
        </div>

        <div class="sequence-display">
          <h4>数列前 {{ Math.min(params.n, 10) }} 项：</h4>
          <div class="sequence-items">
            <span
              v-for="(item, index) in sequenceItems"
              :key="index"
              class="sequence-item"
            >
              {{ item.toFixed(4) }}
            </span>
          </div>
        </div>

        <div class="formula-section">
          <h4>计算公式</h4>
          <div class="formula-content">{{ formula }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const sequenceType = ref('arithmetic')
const params = ref({
  a1: 1,
  d: 2,
  r: 2,
  n: 5
})

const nthTerm = ref(0)
const sum = ref(0)
const sequenceItems = ref([])

const formula = computed(() => {
  switch (sequenceType.value) {
    case 'arithmetic':
      return `第 n 项: aₙ = a₁ + (n-1)d\n前 n 项和: Sₙ = n/2 × [2a₁ + (n-1)d]`
    case 'geometric':
      return `第 n 项: aₙ = a₁ × r^(n-1)\n前 n 项和: Sₙ = a₁ × (1-rⁿ)/(1-r) (r ≠ 1)`
    case 'fibonacci':
      return `F(0) = 0, F(1) = 1\nF(n) = F(n-1) + F(n-2) (n ≥ 2)`
    case 'harmonic':
      return `第 n 项: Hₙ = 1 + 1/2 + 1/3 + ... + 1/n\n没有封闭公式`
    case 'triangular':
      return `第 n 项: Tₙ = n(n+1)/2\n前 n 项和: Sₙ = n(n+1)(n+2)/6`
    default:
      return ''
  }
})

function resetParameters() {
  switch (sequenceType.value) {
    case 'arithmetic':
      params.value.a1 = 1
      params.value.d = 2
      break
    case 'geometric':
      params.value.a1 = 1
      params.value.r = 2
      break
    case 'fibonacci':
      break
    case 'harmonic':
      break
    case 'triangular':
      break
  }
  calculate()
}

function calculate() {
  switch (sequenceType.value) {
    case 'arithmetic':
      calculateArithmetic()
      break
    case 'geometric':
      calculateGeometric()
      break
    case 'fibonacci':
      calculateFibonacci()
      break
    case 'harmonic':
      calculateHarmonic()
      break
    case 'triangular':
      calculateTriangular()
      break
  }
}

function calculateArithmetic() {
  const { a1, d, n } = params.value
  nthTerm.value = a1 + (n - 1) * d
  sum.value = (n / 2) * (2 * a1 + (n - 1) * d)
  
  const items = []
  for (let i = 1; i <= Math.min(n, 10); i++) {
    items.push(a1 + (i - 1) * d)
  }
  sequenceItems.value = items
}

function calculateGeometric() {
  const { a1, r, n } = params.value
  nthTerm.value = a1 * Math.pow(r, n - 1)
  sum.value = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r)
  
  const items = []
  for (let i = 1; i <= Math.min(n, 10); i++) {
    items.push(a1 * Math.pow(r, i - 1))
  }
  sequenceItems.value = items
}

function calculateFibonacci() {
  const { n } = params.value
  
  if (n === 0) {
    nthTerm.value = 0
    sum.value = 0
    sequenceItems.value = [0]
    return
  }
  
  const fib = [0, 1]
  let s = 1
  
  for (let i = 2; i < n; i++) {
    const next = fib[i-1] + fib[i-2]
    fib.push(next)
    s += next
  }
  
  nthTerm.value = fib[n-1]
  sum.value = s
  sequenceItems.value = fib.slice(0, Math.min(n, 10))
}

function calculateHarmonic() {
  const { n } = params.value
  let harmonic = 0
  const items = []
  
  for (let i = 1; i <= Math.min(n, 10); i++) {
    harmonic += 1 / i
    items.push(harmonic)
  }
  
  nthTerm.value = 1 / n
  sum.value = harmonic
  sequenceItems.value = items
}

function calculateTriangular() {
  const { n } = params.value
  nthTerm.value = n * (n + 1) / 2
  sum.value = n * (n + 1) * (n + 2) / 6
  
  const items = []
  for (let i = 1; i <= Math.min(n, 10); i++) {
    items.push(i * (i + 1) / 2)
  }
  sequenceItems.value = items
}

watch(sequenceType, resetParameters, { immediate: true })
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

.sequence-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input,
.number-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.parameters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
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
  margin-bottom: 1.5rem;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.results-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
}

.result-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.sequence-display {
  margin-bottom: 1.5rem;
}

.sequence-display h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.sequence-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sequence-item {
  padding: 0.5rem 0.75rem;
  background: #e3f2fd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #1565c0;
}

.formula-section {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}

.formula-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.formula-content {
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
  background: #fff;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .sequence-card {
  background: #262626;
}

.dark .select-input,
.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .results-section {
  background: #1a1a1a;
}

.dark .result-item {
  background: #262626;
}

.dark .result-label {
  color: #a3a3a3;
}

.dark .sequence-item {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark .formula-section {
  background: #262626;
}

.dark .formula-content {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .parameters-grid,
  .result-grid {
    grid-template-columns: 1fr;
  }

  .sequence-items {
    flex-direction: column;
  }
}
</style>
