<template>
  <div class="tool-container">
    <h1 class="title">水滴计算器</h1>
    <p class="description">计算给定距离需要多少水洒水量，适合园艺和浇水计算。</p>

    <div class="calculator-card">
      <div class="input-section">
        <div class="form-group">
          <label>种植面积</label>
          <div class="input-with-unit">
            <input
              v-model.number="area"
              type="number"
              class="text-input"
              placeholder="输入面积"
            />
            <select v-model="areaUnit" class="unit-select">
              <option value="sqm">平方米 (m²)</option>
              <option value="sqft">平方英尺 (ft²)</option>
              <option value="acre">亩</option>
              <option value="hectare">公顷 (ha)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>植物类型</label>
          <select v-model="plantType" class="select-input">
            <option value="grass">草坪</option>
            <option value="vegetables">蔬菜</option>
            <option value="flowers">花卉</option>
            <option value="shrubs">灌木</option>
            <option value="trees">树木</option>
            <option value="succulents">多肉植物</option>
          </select>
        </div>

        <div class="form-group">
          <label>浇水频率</label>
          <select v-model="frequency" class="select-input">
            <option value="daily">每天</option>
            <option value="every2">每2天</option>
            <option value="every3">每3天</option>
            <option value="weekly">每周</option>
            <option value="biweekly">每两周</option>
          </select>
        </div>

        <div class="form-group">
          <label>土壤类型</label>
          <select v-model="soilType" class="select-input">
            <option value="sandy">沙质土壤 (排水快)</option>
            <option value="loamy">壤土 (保水适中)</option>
            <option value="clay">黏土 (保水性强)</option>
          </select>
        </div>

        <button @click="calculate" class="btn-calculate">计算</button>
      </div>

      <div v-if="results" class="results-section">
        <h3>浇水建议</h3>

        <div class="result-cards">
          <div class="result-card primary">
            <span class="result-value">{{ results.dailyWater }} L</span>
            <span class="result-label">每次浇水用量</span>
          </div>
          <div class="result-card">
            <span class="result-value">{{ results.weeklyWater }} L</span>
            <span class="result-label">每周总用水量</span>
          </div>
          <div class="result-card">
            <span class="result-value">{{ results.monthlyWater }} L</span>
            <span class="result-label">每月总用水量</span>
          </div>
        </div>

        <div class="tips-section">
          <h4>💡 浇水技巧</h4>
          <ul>
            <li v-for="(tip, index) in results.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>参考用水量</h3>
      <table class="reference-table">
        <thead>
          <tr>
            <th>植物类型</th>
            <th>每周用水量 (L/m²)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>草坪</td>
            <td>25-50</td>
          </tr>
          <tr>
            <td>蔬菜</td>
            <td>20-40</td>
          </tr>
          <tr>
            <td>花卉</td>
            <td>15-30</td>
          </tr>
          <tr>
            <td>灌木</td>
            <td>10-20</td>
          </tr>
          <tr>
            <td>树木</td>
            <td>5-15</td>
          </tr>
          <tr>
            <td>多肉植物</td>
            <td>5-10</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const area = ref(100)
const areaUnit = ref('sqm')
const plantType = ref('vegetables')
const frequency = ref('every3')
const soilType = ref('loamy')
const results = ref(null)

const waterRates = {
  grass: 35,
  vegetables: 30,
  flowers: 22,
  shrubs: 15,
  trees: 10,
  succulents: 7
}

const frequencyMultipliers = {
  daily: 7,
  every2: 3.5,
  every3: 2.33,
  weekly: 1,
  biweekly: 0.5
}

const soilMultipliers = {
  sandy: 1.3,
  loamy: 1.0,
  clay: 0.7
}

function convertArea(areaVal, fromUnit) {
  const toSqm = {
    sqm: 1,
    sqft: 0.0929,
    acre: 666.67,
    hectare: 10000
  }
  return areaVal * toSqm[fromUnit]
}

function calculate() {
  const areaInSqm = convertArea(area.value, areaUnit.value)

  const baseRate = waterRates[plantType.value]
  const freqMultiplier = frequencyMultipliers[frequency.value]
  const soilMultiplier = soilMultipliers[soilType.value]

  const dailyWater = areaInSqm * baseRate * freqMultiplier * soilMultiplier
  const weeklyWater = dailyWater
  const monthlyWater = dailyWater * 4.33

  const tips = []

  if (plantType.value === 'succulents') {
    tips.push('多肉植物喜欢"干透浇透"的浇水方式，避免积水')
  } else if (plantType.value === 'vegetables') {
    tips.push('蔬菜在结果期需要更多水分，保持土壤湿润')
  }

  if (soilType.value === 'sandy') {
    tips.push('沙质土壤排水快，可能需要增加浇水频率')
  } else if (soilType.value === 'clay') {
    tips.push('黏土保水性强，注意避免过度浇水导致根系腐烂')
  }

  if (frequency.value === 'daily') {
    tips.push('建议在清晨或傍晚浇水，减少蒸发损失')
  } else if (frequency.value === 'biweekly') {
    tips.push('两周浇一次水仅适合耐旱植物，注意观察植物状态')
  }

  tips.push('使用滴灌系统可以节省 30-50% 的用水量')

  results.value = {
    dailyWater: Math.round(dailyWater),
    weeklyWater: Math.round(weeklyWater),
    monthlyWater: Math.round(monthlyWater),
    tips
  }
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

.input-section {
  max-width: 400px;
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

.input-with-unit {
  display: flex;
  gap: 0.5rem;
}

.text-input,
.select-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.text-input {
  flex: 1;
}

.unit-select,
.select-input {
  width: 100%;
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
}

.result-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.result-card.primary {
  background: #eff6ff;
  border: 2px solid #2563eb;
}

.result-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
}

.result-label {
  font-size: 0.85rem;
  color: #666;
}

.tips-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.tips-section h4 {
  margin: 0 0 0.75rem;
}

.tips-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tips-section li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.reference-table {
  width: 100%;
  border-collapse: collapse;
}

.reference-table th,
.reference-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.reference-table th {
  background: #fff;
  font-weight: 600;
}

.reference-table td {
  background: #fff;
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

.dark .text-input,
.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-card {
  background: #1a1a1a;
}

.dark .result-card.primary {
  background: #1e3a5f;
}

.dark .tips-section {
  background: #1e3a5f;
}

.dark .reference-table th,
.dark .reference-table td {
  background: #1a1a1a;
  border-color: #333;
}

@media (max-width: 768px) {
  .result-cards {
    grid-template-columns: 1fr;
  }
}
</style>
