<template>
  <div class="tool-container">
    <h1 class="title">角度/弧度转换器</h1>
    <p class="description">在不同角度单位之间进行换算，支持度（°）、弧度（rad）、梯度（grad）和圈数（turn）。</p>

    <div class="converter-section">
      <div class="input-group">
        <label>输入数值：</label>
        <input
          v-model.number="inputValue"
          type="number"
          class="number-input"
          @input="convert"
        />
      </div>

      <div class="input-group">
        <label>选择单位：</label>
        <select v-model="fromUnit" class="select-input" @change="convert">
          <option value="deg">度 (°)</option>
          <option value="rad">弧度 (rad)</option>
          <option value="grad">梯度 (grad)</option>
          <option value="turn">圈数 (turn)</option>
        </select>
      </div>
    </div>

    <div class="visual-circle">
      <div class="circle-container">
        <svg viewBox="0 0 200 200" class="circle-svg">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#e5e5e5"
            stroke-width="20"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#2563eb"
            stroke-width="20"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            transform="rotate(-90 100 100)"
          />
          <line
            x1="100"
            y1="100"
            :x2="lineEndX"
            :y2="lineEndY"
            stroke="#2563eb"
            stroke-width="3"
          />
        </svg>
        <div class="degree-display">{{ inputValue }}°</div>
      </div>
    </div>

    <div class="results-grid">
      <div class="result-card">
        <div class="card-header">
          <span>度 (°)</span>
          <button @click="copy(degrees)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ degrees.toFixed(6) }}°</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>弧度 (rad)</span>
          <button @click="copy(radians)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ radians.toFixed(6) }} rad</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>梯度 (grad)</span>
          <button @click="copy(gradians)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ gradians.toFixed(6) }} grad</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>圈数 (turn)</span>
          <button @click="copy(turns)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ turns.toFixed(6) }} turn</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>毫弧度 (mrad)</span>
          <button @click="copy(milliradians)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ milliradians.toFixed(6) }} mrad</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>角分 (′)</span>
          <button @click="copy(arcminutes)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ arcminutes.toFixed(6) }} ′</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>角秒 (″)</span>
          <button @click="copy(arcseconds)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ arcseconds.toFixed(6) }} ″</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>象限 (quadrant)</span>
          <button @click="copy(quadrants)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ quadrants.toFixed(6) }} q</div>
      </div>
    </div>

    <div class="formula-section">
      <h3>常用换算公式</h3>
      <div class="formula-grid">
        <div class="formula-item">
          <code>1° = π/180 rad</code>
        </div>
        <div class="formula-item">
          <code>1 rad = 180/π°</code>
        </div>
        <div class="formula-item">
          <code>1° = 10/9 grad</code>
        </div>
        <div class="formula-item">
          <code>1 turn = 360°</code>
        </div>
        <div class="formula-item">
          <code>1° = 60′ = 3600″</code>
        </div>
        <div class="formula-item">
          <code>π ≈ 3.14159265</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref(90)
const fromUnit = ref('deg')

const PI = Math.PI
const circumference = 2 * PI * 80

const baseValue = computed(() => {
  if (!inputValue.value) return 0

  switch (fromUnit.value) {
    case 'deg':
      return inputValue.value
    case 'rad':
      return inputValue.value * 180 / PI
    case 'grad':
      return inputValue.value * 9 / 10
    case 'turn':
      return inputValue.value * 360
    default:
      return inputValue.value
  }
})

const degrees = computed(() => baseValue.value)
const radians = computed(() => baseValue.value * PI / 180)
const gradians = computed(() => baseValue.value * 10 / 9)
const turns = computed(() => baseValue.value / 360)
const milliradians = computed(() => baseValue.value * PI / 180 * 1000)
const arcminutes = computed(() => baseValue.value * 60)
const arcseconds = computed(() => baseValue.value * 3600)
const quadrants = computed(() => baseValue.value / 90)

const dashOffset = computed(() => {
  const percentage = (baseValue.value % 360) / 360
  return circumference * (1 - percentage)
})

const lineEndX = computed(() => {
  const angle = (baseValue.value % 360 - 90) * PI / 180
  return 100 + 60 * Math.cos(angle)
})

const lineEndY = computed(() => {
  const angle = (baseValue.value % 360 - 90) * PI / 180
  return 100 + 60 * Math.sin(angle)
})

function convert() {
}

function copy(value) {
  navigator.clipboard.writeText(value.toString())
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

.converter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 12px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.number-input,
.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.visual-circle {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.circle-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.circle-svg {
  width: 100%;
  height: 100%;
}

.degree-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.card-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.btn-copy {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-copy:hover {
  background: #f0f0f0;
}

.formula-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.formula-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.formula-item {
  padding: 0.5rem 0.75rem;
  background: #fff;
  border-radius: 4px;
  text-align: center;
}

.formula-item code {
  font-family: monospace;
  color: #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-section,
.dark .result-card,
.dark .formula-section {
  background: #262626;
}

.dark .number-input,
.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-copy {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-copy:hover {
  background: #404040;
}

.dark .formula-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .converter-section {
    flex-direction: column;
  }

  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .formula-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
