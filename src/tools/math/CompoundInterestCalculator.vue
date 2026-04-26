<template>
  <div class="compound-interest-calculator">
    <h2>复利计算器</h2>

    <div class="calculator-container">
      <div class="input-section">
        <h3>输入参数</h3>

        <div class="control-group">
          <label>本金 (¥)</label>
          <input type="number" v-model.number="principal" min="0" step="1000" @input="calculate" />
        </div>

        <div class="control-group">
          <label>年利率 (%)</label>
          <input type="number" v-model.number="rate" min="0" max="100" step="0.1" @input="calculate" />
        </div>

        <div class="control-group">
          <label>投资期限</label>
          <div class="period-input">
            <input type="number" v-model.number="years" min="1" max="100" @input="calculate" />
            <select v-model="periodType" @change="calculate">
              <option value="years">年</option>
              <option value="months">月</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label>复利频率</label>
          <select v-model="compoundingFrequency" @change="calculate">
            <option value="1">每年 (1次/年)</option>
            <option value="2">每半年 (2次/年)</option>
            <option value="4">每季度 (4次/年)</option>
            <option value="12">每月 (12次/年)</option>
            <option value="365">每天 (365次/年)</option>
          </select>
        </div>

        <div class="control-group">
          <label>每月追加投资 (可选)</label>
          <input type="number" v-model.number="monthlyContribution" min="0" step="100" @input="calculate" />
        </div>

        <div class="control-group">
          <label>一次性追加 (可选)</label>
          <input type="number" v-model.number="oneTimeContribution" min="0" step="1000" @input="calculate" />
        </div>
      </div>

      <div class="result-section" v-if="result">
        <h3>计算结果</h3>

        <div class="result-summary">
          <div class="summary-item primary">
            <span class="summary-label">到期总额</span>
            <span class="summary-value">¥{{ formatNumber(result.totalAmount) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">本金</span>
            <span class="summary-value">¥{{ formatNumber(result.principal) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">利息收益</span>
            <span class="summary-value interest">¥{{ formatNumber(result.totalInterest) }}</span>
          </div>
        </div>

        <div class="breakdown">
          <h4>收益明细</h4>
          <div class="breakdown-chart">
            <div class="chart-bar">
              <div class="bar principal" :style="{ width: principalRatio + '%' }"></div>
              <div class="bar interest" :style="{ width: interestRatio + '%' }"></div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot principal"></span>本金 {{ principalRatio.toFixed(1) }}%</span>
              <span class="legend-item"><span class="dot interest"></span>利息 {{ interestRatio.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">年化收益率 (单利)</span>
            <span class="detail-value">{{ simpleReturn.toFixed(2) }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">年化收益率 (复利)</span>
            <span class="detail-value">{{ effectiveRate.toFixed(2) }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">总投入</span>
            <span class="detail-value">¥{{ formatNumber(result.totalInvestment) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="schedule-section" v-if="result && yearlySchedule.length > 0">
      <h3>年度收益明细</h3>
      <div class="schedule-table">
        <table>
          <thead>
            <tr>
              <th>年份</th>
              <th>年初本金</th>
              <th>年度利息</th>
              <th>年末本息</th>
              <th>累计利息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in yearlySchedule" :key="index">
              <td>{{ item.year }}年</td>
              <td>¥{{ formatNumber(item.startPrincipal) }}</td>
              <td class="interest-cell">¥{{ formatNumber(item.yearInterest) }}</td>
              <td>¥{{ formatNumber(item.endPrincipal) }}</td>
              <td class="interest-cell">¥{{ formatNumber(item.cumulativeInterest) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button @click="downloadSchedule" class="download-btn">下载明细 (CSV)</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const principal = ref(10000)
const rate = ref(5)
const years = ref(10)
const periodType = ref('years')
const compoundingFrequency = ref(12)
const monthlyContribution = ref(0)
const oneTimeContribution = ref(0)

const result = ref(null)
const yearlySchedule = ref([])

const formatNumber = (num) => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const principalRatio = computed(() => {
  if (!result.value || result.value.totalAmount === 0) return 100
  return (result.value.principal / result.value.totalAmount) * 100
})

const interestRatio = computed(() => {
  return 100 - principalRatio.value
})

const simpleReturn = computed(() => {
  if (!result.value || years.value === 0) return 0
  const totalYears = periodType.value === 'months' ? years.value / 12 : years.value
  return ((result.value.totalAmount - result.value.totalInvestment) / result.value.totalInvestment / totalYears) * 100
})

const effectiveRate = computed(() => {
  const n = parseInt(compoundingFrequency.value)
  const r = rate.value / 100
  return (Math.pow(1 + r / n, n) - 1) * 100
})

const calculate = () => {
  if (!principal.value || !rate.value || !years.value) {
    result.value = null
    return
  }

  const p = principal.value
  const r = rate.value / 100
  const n = parseInt(compoundingFrequency.value)
  const t = periodType.value === 'months' ? years.value / 12 : years.value
  const monthly = monthlyContribution.value
  const oneTime = oneTimeContribution.value

  let totalAmount = p
  let totalInterest = 0
  const schedule = []

  const months = Math.round(t * 12)
  const monthlyRate = r / 12

  let currentPrincipal = p
  let monthCount = 0

  for (let year = 1; year <= t; year++) {
    let yearInterest = 0

    for (let month = 1; month <= 12; month++) {
      monthCount++

      if (monthCount === Math.floor(t * 12 / 2) && oneTime > 0) {
        currentPrincipal += oneTime
      }

      const monthInterest = currentPrincipal * monthlyRate
      currentPrincipal += monthInterest
      yearInterest += monthInterest

      if (monthly > 0) {
        currentPrincipal += monthly
      }
    }

    schedule.push({
      year,
      startPrincipal: p * Math.pow(1 + r / n, n * (year - 1)) + (year - 1) * 12 * monthly,
      yearInterest,
      endPrincipal: currentPrincipal,
      cumulativeInterest: currentPrincipal - p - (year * 12 * monthly) - (oneTime > 0 ? oneTime : 0)
    })
  }

  totalAmount = currentPrincipal
  totalInterest = totalAmount - p - (years.value * 12 * monthly) - oneTime

  const totalInvestment = p + (years.value * 12 * monthly) + oneTime

  result.value = {
    principal: p,
    totalAmount,
    totalInterest,
    totalInvestment
  }

  yearlySchedule.value = schedule
}

const downloadSchedule = () => {
  const headers = ['年份', '年初本金', '年度利息', '年末本息', '累计利息']
  const rows = yearlySchedule.value.map(item => [
    item.year,
    item.startPrincipal.toFixed(2),
    item.yearInterest.toFixed(2),
    item.endPrincipal.toFixed(2),
    item.cumulativeInterest.toFixed(2)
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'compound-interest-schedule.csv'
  a.click()
  URL.revokeObjectURL(url)
}

calculate()
</script>

<style scoped>
.compound-interest-calculator {
  padding: 20px;
}
.calculator-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section,
.result-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.control-group {
  margin-bottom: 20px;
}
.control-group > label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.control-group input[type="number"],
.control-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}
.period-input {
  display: flex;
  gap: 10px;
}
.period-input input {
  flex: 1;
}
.period-input select {
  width: 80px;
}
.result-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}
.summary-item {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.summary-item.primary {
  background: var(--primary-color);
  color: white;
}
.summary-label {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
}
.summary-item.primary .summary-label {
  color: rgba(255, 255, 255, 0.8);
}
.summary-value {
  font-size: 24px;
  font-weight: bold;
}
.summary-value.interest {
  color: #4CAF50;
}
.breakdown {
  margin-bottom: 20px;
}
.breakdown h4 {
  margin: 0 0 15px 0;
}
.chart-bar {
  display: flex;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
}
.bar {
  height: 100%;
  transition: width 0.3s;
}
.bar.principal {
  background: #2196F3;
}
.bar.interest {
  background: #4CAF50;
}
.chart-legend {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.dot.principal {
  background: #2196F3;
}
.dot.interest {
  background: #4CAF50;
}
.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.detail-item {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}
.detail-label {
  font-size: 12px;
  color: var(--text-secondary);
}
.detail-value {
  font-weight: bold;
}
.schedule-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.schedule-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.schedule-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid var(--border-color);
}
th {
  background: var(--bg-secondary);
  font-weight: 500;
  text-align: right;
}
td:first-child, th:first-child {
  text-align: center;
}
.interest-cell {
  color: #4CAF50;
}
.download-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
  }
  .result-summary,
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
