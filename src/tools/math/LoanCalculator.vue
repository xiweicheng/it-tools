<template>
  <div class="tool-container">
    <h1 class="title">贷款计算器</h1>
    <p class="description">计算房贷、车贷等贷款还款金额，支持等额本息和等额本金两种还款方式。</p>

    <div class="calculator-card">
      <div class="input-section">
        <div class="form-group">
          <label>贷款金额 (元)</label>
          <input
            v-model.number="principal"
            type="number"
            class="text-input"
            placeholder="请输入贷款金额"
          />
        </div>

        <div class="form-group">
          <label>年利率 (%)</label>
          <input
            v-model.number="annualRate"
            type="number"
            step="0.01"
            class="text-input"
            placeholder="请输入年利率"
          />
        </div>

        <div class="form-group">
          <label>贷款期限 (月)</label>
          <input
            v-model.number="months"
            type="number"
            class="text-input"
            placeholder="请输入贷款期限"
          />
        </div>

        <div class="form-group">
          <label>还款方式</label>
          <div class="method-buttons">
            <button
              :class="{ active: repaymentMethod === 'equal-principal-interest' }"
              @click="repaymentMethod = 'equal-principal-interest'"
            >
              等额本息
            </button>
            <button
              :class="{ active: repaymentMethod === 'equal-principal' }"
              @click="repaymentMethod = 'equal-principal'"
            >
              等额本金
            </button>
          </div>
        </div>

        <button @click="calculate" class="btn-calculate">计算</button>
      </div>

      <div v-if="results" class="results-section">
        <h3>计算结果</h3>

        <div class="results-grid">
          <div class="result-card highlight">
            <span class="result-label">每月还款</span>
            <span class="result-value">{{ formatMoney(results.monthlyPayment) }}</span>
            <span class="result-unit">元</span>
          </div>
          <div class="result-card">
            <span class="result-label">还款总额</span>
            <span class="result-value">{{ formatMoney(results.totalPayment) }}</span>
            <span class="result-unit">元</span>
          </div>
          <div class="result-card">
            <span class="result-label">利息总额</span>
            <span class="result-value">{{ formatMoney(results.totalInterest) }}</span>
            <span class="result-unit">元</span>
          </div>
          <div class="result-card">
            <span class="result-label">年利率</span>
            <span class="result-value">{{ annualRate }}%</span>
            <span class="result-unit">/年</span>
          </div>
        </div>

        <div class="amortization-section">
          <h4>还款计划表</h4>
          <div class="amortization-table">
            <div class="table-header">
              <span>月份</span>
              <span>月供</span>
              <span>本金</span>
              <span>利息</span>
              <span>剩余本金</span>
            </div>
            <div
              v-for="(item, index) in amortizationSchedule"
              :key="index"
              class="table-row"
            >
              <span>{{ index + 1 }}</span>
              <span>{{ formatMoney(item.payment) }}</span>
              <span>{{ formatMoney(item.principal) }}</span>
              <span>{{ formatMoney(item.interest) }}</span>
              <span>{{ formatMoney(item.balance) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>还款方式说明</h3>
      <div class="info-cards">
        <div class="info-card">
          <h4>等额本息</h4>
          <p>每月还款金额相同，还款初期利息占比高，本金占比低；还款后期相反。</p>
          <p class="feature">特点：月供稳定，便于记忆</p>
        </div>
        <div class="info-card">
          <h4>等额本金</h4>
          <p>每月还款本金相同，利息逐月减少，月供也逐月减少。</p>
          <p class="feature">特点：总利息较少，但初期还款压力大</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const principal = ref(1000000)
const annualRate = ref(4.9)
const months = ref(240)
const repaymentMethod = ref('equal-principal-interest')
const results = ref(null)
const amortizationSchedule = ref([])

function formatMoney(amount) {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function calculate() {
  const P = principal.value
  const r = annualRate.value / 100 / 12
  const n = months.value

  if (repaymentMethod.value === 'equal-principal-interest') {
    calculateEqualPrincipalInterest(P, r, n)
  } else {
    calculateEqualPrincipal(P, r, n)
  }
}

function calculateEqualPrincipalInterest(P, r, n) {
  const monthlyPayment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const totalPayment = monthlyPayment * n
  const totalInterest = totalPayment - P

  results.value = {
    monthlyPayment,
    totalPayment,
    totalInterest
  }

  generateSchedule(P, r, n, monthlyPayment, 'equal-principal-interest')
}

function calculateEqualPrincipal(P, r, n) {
  const monthlyPrincipal = P / n
  let totalPayment = 0
  let balance = P
  const schedule = []

  for (let i = 0; i < n; i++) {
    const interest = balance * r
    const payment = monthlyPrincipal + interest
    totalPayment += payment
    balance -= monthlyPrincipal

    schedule.push({
      payment,
      principal: monthlyPrincipal,
      interest,
      balance: Math.max(0, balance)
    })
  }

  results.value = {
    monthlyPayment: schedule[0].payment,
    totalPayment,
    totalInterest: totalPayment - P
  }

  amortizationSchedule.value = schedule
}

function generateSchedule(P, r, n, monthlyPayment, method) {
  const schedule = []
  let balance = P

  for (let i = 0; i < n; i++) {
    const interest = balance * r
    const principal = monthlyPayment - interest
    balance -= principal

    schedule.push({
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance)
    })
  }

  amortizationSchedule.value = schedule
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
  margin-bottom: 1.5rem;
}

.input-section {
  max-width: 500px;
  margin: 0 auto;
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
  box-sizing: border-box;
}

.method-buttons {
  display: flex;
  gap: 0;
}

.method-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.method-buttons button:first-child {
  border-radius: 6px 0 0 6px;
}

.method-buttons button:last-child {
  border-radius: 0 6px 6px 0;
}

.method-buttons button.active {
  background: #2563eb;
  color: white;
}

.btn-calculate {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-calculate:hover {
  background: #1d4ed8;
}

.results-section {
  margin-top: 2rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
}

.result-unit {
  font-size: 0.85rem;
  color: #666;
  margin-left: 0.25rem;
}

.amortization-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.amortization-section h4 {
  margin-bottom: 1rem;
}

.amortization-table {
  max-height: 400px;
  overflow-y: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr 1.5fr;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.table-header {
  background: #f5f5f5;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.table-row {
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.info-card h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.info-card p {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.info-card .feature {
  color: #2563eb;
  font-weight: 500;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calculator-card,
.dark .info-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .method-buttons button {
  background: #404040;
  color: #e5e5e5;
}

.dark .method-buttons button.active {
  background: #2563eb;
}

.dark .result-card {
  background: #1a1a1a;
}

.dark .result-card.highlight {
  background: #1e3a5f;
}

.dark .amortization-section,
.dark .info-card {
  background: #1a1a1a;
}

.dark .table-header {
  background: #333;
}

.dark .table-row {
  border-color: #333;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr;
    font-size: 0.8rem;
  }
}
</style>
