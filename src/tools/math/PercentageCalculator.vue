<template>
  <div class="tool-container">
    <h1 class="title">百分比计算器</h1>
    <p class="description">计算百分比、增长率、折扣等实用的百分比计算。</p>

    <div class="calculator-card">
      <div class="calculation-types">
        <button
          v-for="type in calculationTypes"
          :key="type.id"
          :class="{ active: currentType === type.id }"
          @click="currentType = type.id"
          class="type-btn"
        >
          {{ type.name }}
        </button>
      </div>

      <div class="calculation-content">
        <div v-if="currentType === 'basic'" class="calc-section">
          <h3>基础百分比计算</h3>
          <div class="calc-form">
            <div class="input-group">
              <label>{{ currentValues.x }} 的 {{ currentValues.percent }}% = ?</label>
              <div class="input-row">
                <input
                  v-model.number="currentValues.x"
                  type="number"
                  class="text-input"
                  placeholder="数值"
                />
                <span class="operator">的</span>
                <input
                  v-model.number="currentValues.percent"
                  type="number"
                  class="text-input small"
                  placeholder="百分比"
                />
                <span class="operator">% =</span>
                <span class="result">{{ calculateBasic() }}</span>
              </div>
            </div>

            <div class="input-group">
              <label>{{ currentValues.x }} 是 {{ currentValues.y }} 的 ?%</label>
              <div class="input-row">
                <input
                  v-model.number="currentValues.x"
                  type="number"
                  class="text-input"
                  placeholder="数值"
                />
                <span class="operator">是</span>
                <input
                  v-model.number="currentValues.y"
                  type="number"
                  class="text-input"
                  placeholder="总数"
                />
                <span class="operator">的</span>
                <span class="result">{{ calculatePercentage() }}%</span>
              </div>
            </div>

            <div class="input-group">
              <label>{{ currentValues.x }} 增加 {{ currentValues.percent }}% = ?</label>
              <div class="input-row">
                <input
                  v-model.number="currentValues.x"
                  type="number"
                  class="text-input"
                  placeholder="数值"
                />
                <span class="operator">增加</span>
                <input
                  v-model.number="currentValues.percent"
                  type="number"
                  class="text-input small"
                  placeholder="百分比"
                />
                <span class="operator">% =</span>
                <span class="result">{{ calculateIncrease() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentType === 'discount'" class="calc-section">
          <h3>折扣计算</h3>
          <div class="calc-form">
            <div class="input-group">
              <label>原价 ¥{{ discount.original }}，折扣 {{ discount.percent }}%</label>
              <div class="input-row vertical">
                <input
                  v-model.number="discount.original"
                  type="number"
                  class="text-input"
                  placeholder="原价"
                />
                <span class="operator">折扣</span>
                <input
                  v-model.number="discount.percent"
                  type="number"
                  class="text-input"
                  placeholder="折扣百分比"
                />
                <span class="operator">折后价 =</span>
                <span class="result highlight">¥{{ calculateDiscount() }}</span>
              </div>
            </div>

            <div class="discount-visual">
              <div class="discount-bar">
                <div
                  class="discount-fill"
                  :style="{ width: Math.min(discount.percent, 100) + '%' }"
                ></div>
              </div>
              <div class="discount-info">
                <span>节省: ¥{{ (discount.original - calculateDiscount()).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentType === 'growth'" class="calc-section">
          <h3>增长率计算</h3>
          <div class="calc-form">
            <div class="input-group">
              <label>从 {{ growth.old }} 增长到 {{ growth.new }}</label>
              <div class="input-row">
                <input
                  v-model.number="growth.old"
                  type="number"
                  class="text-input"
                  placeholder="原值"
                />
                <span class="operator">→</span>
                <input
                  v-model.number="growth.new"
                  type="number"
                  class="text-input"
                  placeholder="新值"
                />
              </div>
              <div class="result-display">
                <span class="label">增长率:</span>
                <span class="value" :class="growth.new >= growth.old ? 'positive' : 'negative'">
                  {{ calculateGrowth() }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentType === 'change'" class="calc-section">
          <h3>百分比变化</h3>
          <div class="calc-form">
            <div class="input-group">
              <label>从 <input v-model.number="change.from" type="number" class="text-input inline" /> 变化到 <input v-model.number="change.to" type="number" class="text-input inline" /></label>
              <div class="result-display large">
                <span class="label">变化率:</span>
                <span class="value" :class="change.to >= change.from ? 'positive' : 'negative'">
                  {{ calculateChange() }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="formulas-section">
      <h3>常用公式</h3>
      <div class="formula-grid">
        <div class="formula-card">
          <code>百分比 = (部分值 / 总值) × 100%</code>
        </div>
        <div class="formula-card">
          <code>增长值 = 原值 × (1 + 增长率%)</code>
        </div>
        <div class="formula-card">
          <code>折后价 = 原价 × (折扣 / 10)</code>
        </div>
        <div class="formula-card">
          <code>变化率 = ((新值 - 旧值) / 旧值) × 100%</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentType = ref('basic')

const calculationTypes = [
  { id: 'basic', name: '基础计算' },
  { id: 'discount', name: '折扣计算' },
  { id: 'growth', name: '增长率' },
  { id: 'change', name: '百分比变化' }
]

const currentValues = ref({
  x: 100,
  y: 200,
  percent: 25
})

const discount = ref({
  original: 1000,
  percent: 20
})

const growth = ref({
  old: 100,
  new: 150
})

const change = ref({
  from: 80,
  to: 120
})

function calculateBasic() {
  return ((currentValues.value.x * currentValues.value.percent) / 100).toFixed(2)
}

function calculatePercentage() {
  if (currentValues.value.y === 0) return 0
  return ((currentValues.value.x / currentValues.value.y) * 100).toFixed(2)
}

function calculateIncrease() {
  return (currentValues.value.x * (1 + currentValues.value.percent / 100)).toFixed(2)
}

function calculateDiscount() {
  return (discount.value.original * (1 - discount.value.percent / 100)).toFixed(2)
}

function calculateGrowth() {
  if (growth.value.old === 0) return 0
  return (((growth.value.new - growth.value.old) / growth.value.old) * 100).toFixed(2)
}

function calculateChange() {
  if (change.value.from === 0) return 0
  return (((change.value.to - change.value.from) / change.value.from) * 100).toFixed(2)
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

.calculator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.calculation-types {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.type-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.type-btn.active {
  background: #2563eb;
  color: white;
}

.calc-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.calc-form {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.input-row.vertical {
  flex-direction: column;
  align-items: stretch;
}

.text-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.text-input.small {
  width: 80px;
}

.text-input.inline {
  width: 100px;
  padding: 0.5rem;
  margin: 0 0.5rem;
}

.operator {
  color: #666;
  font-size: 0.95rem;
}

.result {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
  padding: 0.5rem 1rem;
  background: #eff6ff;
  border-radius: 6px;
}

.result.highlight {
  background: #dcfce7;
  color: #166534;
}

.result-display {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-display.large {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.result-display .label {
  color: #666;
}

.result-display .value {
  font-size: 1.5rem;
  font-weight: 700;
}

.result-display .value.positive {
  color: #10b981;
}

.result-display .value.negative {
  color: #dc2626;
}

.discount-visual {
  margin-top: 1rem;
}

.discount-bar {
  height: 24px;
  background: #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
}

.discount-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 12px;
  transition: width 0.3s ease;
}

.discount-info {
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
  color: #10b981;
}

.formulas-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.formulas-section h3 {
  margin-bottom: 1rem;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.formula-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.formula-card code {
  color: #9333ea;
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calculator-card,
.dark .formulas-section {
  background: #262626;
}

.dark .calculation-types {
  background: #333;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .calc-form {
  background: #1a1a1a;
}

.dark .result {
  background: #1e3a5f;
}

.dark .result.highlight {
  background: #14532d;
}

.dark .result-display {
  background: #1a1a1a;
}

.dark .discount-bar {
  background: #333;
}

.dark .formula-card {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .formula-grid {
    grid-template-columns: 1fr;
  }

  .input-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
