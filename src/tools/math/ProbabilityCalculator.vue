<template>
  <div class="probability-calculator">
    <h2>概率计算器</h2>

    <div class="calculator-container">
      <div class="mode-section">
        <div class="mode-tabs">
          <button :class="{ active: mode === 'basic' }" @click="mode = 'basic'">基本概率</button>
          <button :class="{ active: mode === 'combine' }" @click="mode = 'combine'">组合概率</button>
          <button :class="{ active: mode === 'permutation' }" @click="mode = 'permutation'">排列组合</button>
        </div>
      </div>

      <div class="input-section" v-if="mode === 'basic'">
        <h3>基本概率计算</h3>
        <div class="input-grid">
          <div class="input-group">
            <label>有利事件数</label>
            <input type="number" v-model.number="basic.favorable" min="0" />
          </div>
          <div class="input-group">
            <label>总事件数</label>
            <input type="number" v-model.number="basic.total" min="1" />
          </div>
        </div>
        <button @click="calculateBasic" class="calc-btn">计算</button>

        <div class="result-display" v-if="basic.result !== null">
          <div class="result-item">
            <span class="label">概率</span>
            <span class="value">{{ (basic.result * 100).toFixed(2) }}%</span>
          </div>
          <div class="result-item">
            <span class="label">小数</span>
            <span class="value">{{ basic.result.toFixed(6) }}</span>
          </div>
          <div class="result-item">
            <span class="label">分数</span>
            <span class="value">{{ basicFraction }}</span>
          </div>
          <div class="result-item">
            <span class="label"> odds 格式</span>
            <span class="value">{{ basicOdds }}</span>
          </div>
        </div>
      </div>

      <div class="input-section" v-if="mode === 'combine'">
        <h3>组合概率计算</h3>
        <p class="mode-desc">计算多个事件同时发生 (P(A∩B)) 或任一发生 (P(A∪B)) 的概率</p>

        <div class="event-inputs">
          <div class="event-item" v-for="(event, index) in combine.events" :key="index">
            <span class="event-label">P({{ String.fromCharCode(65 + index) }})</span>
            <input type="number" v-model.number="event.probability" min="0" max="1" step="0.01" placeholder="0-1" />
            <span class="event-percent">{{ (event.probability * 100).toFixed(1) }}%</span>
            <button @click="removeEvent(index)" class="remove-btn" v-if="combine.events.length > 2">×</button>
          </div>
        </div>
        <button @click="addEvent" class="add-btn">添加事件</button>

        <div class="combine-results">
          <div class="combine-result">
            <h4>同时发生 (交集)</h4>
            <p>P(A∩B) = {{ (combineIntersection * 100).toFixed(2) }}%</p>
            <p class="desc">所有事件都发生的概率</p>
          </div>
          <div class="combine-result">
            <h4>至少一个发生 (并集)</h4>
            <p>P(A∪B) = {{ (combineUnion * 100).toFixed(2) }}%</p>
            <p class="desc">至少有一个事件发生的概率</p>
          </div>
        </div>

        <div class="options-group">
          <label>
            <input type="checkbox" v-model="combine.independent" />
            <span>假设事件相互独立 (不相互影响)</span>
          </label>
        </div>
      </div>

      <div class="input-section" v-if="mode === 'permutation'">
        <h3>排列组合计算</h3>

        <div class="calc-type">
          <button :class="{ active: permCalcType === 'permutation' }" @click="permCalcType = 'permutation'">排列 (P)</button>
          <button :class="{ active: permCalcType === 'combination' }" @click="permCalcType = 'combination'">组合 (C)</button>
        </div>

        <div class="input-grid">
          <div class="input-group">
            <label>总数 n</label>
            <input type="number" v-model.number="perm.n" min="0" />
          </div>
          <div class="input-group">
            <label>选择 r</label>
            <input type="number" v-model.number="perm.r" min="0" />
          </div>
        </div>
        <button @click="calculatePermutation" class="calc-btn">计算</button>

        <div class="result-display" v-if="perm.result !== null">
          <div class="result-item large">
            <span class="label">{{ permCalcType === 'permutation' ? '排列数' : '组合数' }}</span>
            <span class="value">{{ perm.result.toLocaleString() }}</span>
          </div>
          <div class="result-item">
            <span class="label">公式</span>
            <span class="value formula">{{ permFormula }}</span>
          </div>
        </div>

        <div class="factorial-info" v-if="perm.result !== null">
          <h4>计算过程</h4>
          <div class="factorial-steps">
            <p v-for="(step, index) in permSteps" :key="index">{{ step }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>概率论基础</h3>
      <div class="info-grid">
        <div class="info-item">
          <h4>概率范围</h4>
          <p>0 ≤ P(A) ≤ 1</p>
          <p>0% ≤ P(A) ≤ 100%</p>
        </div>
        <div class="info-item">
          <h4>加法法则</h4>
          <p>P(A∪B) = P(A) + P(B) - P(A∩B)</p>
        </div>
        <div class="info-item">
          <h4>乘法法则</h4>
          <p>P(A∩B) = P(A) × P(B|A)</p>
          <p>独立事件: P(A∩B) = P(A) × P(B)</p>
        </div>
        <div class="info-item">
          <h4>排列公式</h4>
          <p>P(n,r) = n!/(n-r)!</p>
        </div>
        <div class="info-item">
          <h4>组合公式</h4>
          <p>C(n,r) = n!/r!(n-r)!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mode = ref('basic')
const permCalcType = ref('permutation')

const basic = ref({
  favorable: 1,
  total: 4,
  result: null
})

const combine = ref({
  events: [
    { probability: 0.5 },
    { probability: 0.3 }
  ],
  independent: true
})

const perm = ref({
  n: 5,
  r: 2,
  result: null
})

const permSteps = ref([])

const basicFraction = computed(() => {
  if (basic.value.result === null) return ''
  const { favorable, total } = basic.value
  const g = gcd(favorable, total)
  return `${favorable/g}/${total/g}`
})

const basicOdds = computed(() => {
  if (basic.value.result === null) return ''
  const { favorable, total } = basic.value
  return `${favorable}:${total - favorable}`
})

const combineIntersection = computed(() => {
  if (combine.value.independent) {
    return combine.value.events.reduce((acc, e) => acc * e.probability, 1)
  }
  return 0
})

const combineUnion = computed(() => {
  const events = combine.value.events
  let sum = 0
  for (let i = 0; i < events.length; i++) {
    sum += events[i].probability
  }
  if (combine.value.independent) {
    let intersection = 1
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        intersection += events[i].probability * events[j].probability
      }
    }
    return Math.min(1, sum - intersection / 2)
  }
  return Math.min(1, sum)
})

const permFormula = computed(() => {
  if (permCalcType.value === 'permutation') {
    return `P(${perm.value.n},${perm.value.r}) = ${perm.value.n}!/${perm.value.n - perm.value.r}!`
  }
  return `C(${perm.value.n},${perm.value.r}) = ${perm.value.n}!/(${perm.value.r}!×${perm.value.n - perm.value.r}!)`
})

const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b)
}

const factorial = (n) => {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

const calculateBasic = () => {
  const { favorable, total } = basic.value
  if (total > 0 && favorable <= total) {
    basic.value.result = favorable / total
  }
}

const addEvent = () => {
  if (combine.value.events.length < 10) {
    combine.value.events.push({ probability: 0.1 })
  }
}

const removeEvent = (index) => {
  combine.value.events.splice(index, 1)
}

const calculatePermutation = () => {
  const { n, r } = perm.value
  if (n < 0 || r < 0 || r > n) {
    perm.value.result = null
    return
  }

  permSteps.value = []

  if (permCalcType.value === 'permutation') {
    perm.value.result = factorial(n) / factorial(n - r)
    permSteps.value.push(`${n}! = ${factorial(n)}`)
    permSteps.value.push(`${n - r}! = ${factorial(n - r)}`)
    permSteps.value.push(`${n}! / ${n - r}! = ${perm.value.result}`)
  } else {
    perm.value.result = factorial(n) / (factorial(r) * factorial(n - r))
    permSteps.value.push(`${n}! = ${factorial(n)}`)
    permSteps.value.push(`${r}! = ${factorial(r)}`)
    permSteps.value.push(`${n - r}! = ${factorial(n - r)}`)
    permSteps.value.push(`${n}! / (${r}! × ${n - r}!) = ${perm.value.result}`)
  }
}
</script>

<style scoped>
.probability-calculator {
  padding: 20px;
}
.calculator-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.mode-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.mode-tabs {
  display: flex;
  gap: 10px;
}
.mode-tabs button {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.mode-tabs button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.input-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.input-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.mode-desc {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 15px;
}
.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-group label {
  font-weight: 500;
  font-size: 14px;
}
.input-group input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}
.calc-btn,
.add-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}
.event-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}
.event-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.event-label {
  font-weight: bold;
  min-width: 60px;
}
.event-item input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.event-percent {
  color: var(--text-secondary);
  font-size: 14px;
  min-width: 50px;
}
.remove-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.combine-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}
.combine-result {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
}
.combine-result h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
}
.combine-result p {
  margin: 5px 0;
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
}
.combine-result .desc {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: normal;
}
.options-group {
  margin-top: 15px;
}
.options-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.calc-type {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.calc-type button {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.calc-type button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.result-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
}
.result-item {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}
.result-item.large {
  grid-column: span 2;
}
.result-item .label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}
.result-item .value {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
}
.result-item .value.formula {
  font-size: 12px;
  font-family: monospace;
}
.factorial-info {
  margin-top: 15px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.factorial-info h4 {
  margin: 0 0 10px 0;
}
.factorial-steps p {
  margin: 5px 0;
  font-family: monospace;
  font-size: 14px;
}
.info-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.info-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
.info-item {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
}
.info-item h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: var(--primary-color);
}
.info-item p {
  margin: 5px 0;
  font-size: 13px;
  font-family: monospace;
}
@media (max-width: 768px) {
  .input-grid,
  .combine-results {
    grid-template-columns: 1fr;
  }
  .result-item.large {
    grid-column: span 1;
  }
}
</style>
