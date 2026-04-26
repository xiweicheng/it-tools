<template>
  <div class="tool-container">
    <h1 class="title">BMI 计算器</h1>
    <p class="description">计算身体质量指数 (BMI)，评估体重是否健康。</p>

    <div class="calculator-card">
      <div class="unit-toggle">
        <button
          :class="{ active: unit === 'metric' }"
          @click="unit = 'metric'"
        >
          公制单位
        </button>
        <button
          :class="{ active: unit === 'imperial' }"
          @click="unit = 'imperial'"
        >
          英制单位
        </button>
      </div>

      <div class="input-section">
        <div class="input-group">
          <label>{{ unit === 'metric' ? '身高 (cm)' : '身高 (英寸)' }}</label>
          <input
            v-model.number="height"
            type="number"
            class="text-input"
            :placeholder="unit === 'metric' ? '170' : '67'"
          />
        </div>

        <div class="input-group">
          <label>{{ unit === 'metric' ? '体重 (kg)' : '体重 (磅)' }}</label>
          <input
            v-model.number="weight"
            type="number"
            class="text-input"
            :placeholder="unit === 'metric' ? '65' : '143'"
          />
        </div>

        <button @click="calculateBMI" class="btn-calculate">计算 BMI</button>
      </div>

      <div v-if="bmi" class="result-section">
        <div class="bmi-display">
          <div class="bmi-value" :class="getBMICategory(bmi).class">
            {{ bmi.toFixed(1) }}
          </div>
          <div class="bmi-label">{{ getBMICategory(bmi).label }}</div>
        </div>

        <div class="bmi-scale">
          <div class="scale-bar">
            <div
              class="scale-indicator"
              :style="{ left: getIndicatorPosition() + '%' }"
            ></div>
          </div>
          <div class="scale-labels">
            <span>偏瘦<br/>&lt;18.5</span>
            <span>正常<br/>18.5-24</span>
            <span>偏胖<br/>24-28</span>
            <span>肥胖<br/>&gt;28</span>
          </div>
        </div>

        <div class="range-info">
          <div class="info-item">
            <span class="info-label">健康体重范围</span>
            <span class="info-value">{{ healthyWeightRange }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">您的 BMI</span>
            <span class="info-value">{{ bmi.toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <h3>BMI 分类说明</h3>
        <div class="category-list">
          <div class="category-item underweight">
            <div class="category-bar"></div>
            <div class="category-info">
              <span class="category-name">偏瘦</span>
              <span class="category-range">BMI &lt; 18.5</span>
              <span class="category-desc">体重过低，可能存在营养不良等问题</span>
            </div>
          </div>
          <div class="category-item normal">
            <div class="category-bar"></div>
            <div class="category-info">
              <span class="category-name">正常</span>
              <span class="category-range">BMI 18.5 - 24</span>
              <span class="category-desc">体重正常，保持健康的生活方式</span>
            </div>
          </div>
          <div class="category-item overweight">
            <div class="category-bar"></div>
            <div class="category-info">
              <span class="category-name">偏胖</span>
              <span class="category-range">BMI 24 - 28</span>
              <span class="category-desc">体重超标，建议适当运动和控制饮食</span>
            </div>
          </div>
          <div class="category-item obese">
            <div class="category-bar"></div>
            <div class="category-info">
              <span class="category-name">肥胖</span>
              <span class="category-range">BMI &gt; 28</span>
              <span class="category-desc">严重超重，建议咨询医生制定减肥计划</span>
            </div>
          </div>
        </div>
      </div>

      <div class="formula-section">
        <h3>计算公式</h3>
        <div class="formula-box">
          <code>BMI = 体重(kg) / 身高(m)²</code>
        </div>
        <p class="formula-note">
          BMI 是国际上常用的衡量人体胖瘦程度以及是否健康的标准。
          需要注意的是，BMI 只是参考指标之一，不能完全代表健康状况。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const unit = ref('metric')
const height = ref(170)
const weight = ref(65)
const bmi = ref(null)

function calculateBMI() {
  let h, w

  if (unit.value === 'metric') {
    h = height.value / 100
    w = weight.value
  } else {
    h = height.value * 0.0254
    w = weight.value * 0.453592
  }

  if (h > 0 && w > 0) {
    bmi.value = w / (h * h)
  }
}

function getBMICategory(bmiValue) {
  if (bmiValue < 18.5) {
    return { label: '偏瘦', class: 'underweight' }
  } else if (bmiValue < 24) {
    return { label: '正常', class: 'normal' }
  } else if (bmiValue < 28) {
    return { label: '偏胖', class: 'overweight' }
  } else {
    return { label: '肥胖', class: 'obese' }
  }
}

function getIndicatorPosition() {
  if (!bmi.value) return 0
  const minBMI = 15
  const maxBMI = 35
  const position = ((bmi.value - minBMI) / (maxBMI - minBMI)) * 100
  return Math.max(0, Math.min(100, position))
}

const healthyWeightRange = computed(() => {
  if (!height.value) return '-'

  let h = height.value
  if (unit.value === 'imperial') {
    h = height.value * 2.54
  }

  const minWeight = 18.5 * (h / 100) * (h / 100)
  const maxWeight = 24 * (h / 100) * (h / 100)

  if (unit.value === 'metric') {
    return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`
  } else {
    return `${(minWeight * 2.20462).toFixed(1)} - ${(maxWeight * 2.20462).toFixed(1)} lbs`
  }
})
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
}

.unit-toggle {
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.unit-toggle button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.unit-toggle button.active {
  background: #2563eb;
  color: white;
}

.input-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group:last-of-type {
  margin-bottom: 1.5rem;
}

.input-group label {
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

.result-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.bmi-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.bmi-value {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.bmi-value.underweight { color: #f59e0b; }
.bmi-value.normal { color: #10b981; }
.bmi-value.overweight { color: #f97316; }
.bmi-value.obese { color: #ef4444; }

.bmi-label {
  font-size: 1.2rem;
  font-weight: 600;
}

.bmi-scale {
  margin-bottom: 1.5rem;
}

.scale-bar {
  height: 16px;
  background: linear-gradient(90deg, #f59e0b 0%, #10b981 35%, #f97316 65%, #ef4444 100%);
  border-radius: 8px;
  position: relative;
  margin-bottom: 0.5rem;
}

.scale-indicator {
  position: absolute;
  top: -4px;
  width: 24px;
  height: 24px;
  background: #333;
  border: 3px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
  text-align: center;
}

.range-info {
  display: flex;
  gap: 1rem;
}

.info-item {
  flex: 1;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
}

.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.chart-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.category-bar {
  width: 8px;
  height: 60px;
  border-radius: 4px;
  flex-shrink: 0;
}

.category-item.underweight .category-bar { background: #f59e0b; }
.category-item.normal .category-bar { background: #10b981; }
.category-item.overweight .category-bar { background: #f97316; }
.category-item.obese .category-bar { background: #ef4444; }

.category-info {
  flex: 1;
}

.category-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.category-range {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.category-desc {
  display: block;
  font-size: 0.8rem;
  color: #999;
}

.formula-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.formula-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.formula-box {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.formula-box code {
  color: #9333ea;
  font-size: 1rem;
}

.formula-note {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calculator-card {
  background: #262626;
}

.dark .unit-toggle {
  background: #333;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .input-section,
.dark .result-section,
.dark .chart-section {
  background: #1a1a1a;
}

.dark .info-item {
  background: #262626;
}

.dark .formula-section {
  background: #1e3a5f;
}

.dark .formula-box {
  background: #262626;
}
</style>
