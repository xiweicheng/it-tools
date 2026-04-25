<template>
  <div class="tool-container">
    <h1 class="title">几何面积体积计算</h1>
    <p class="description">计算各种几何图形的面积和体积，包括圆形、矩形、三角形、立方体等。</p>

    <div class="geometry-card">
      <div class="form-group">
        <label>选择图形：</label>
        <select v-model="shape" class="select-input" @change="resetParameters">
          <option value="circle">圆形</option>
          <option value="rectangle">矩形</option>
          <option value="triangle">三角形</option>
          <option value="square">正方形</option>
          <option value="cube">立方体</option>
          <option value="cylinder">圆柱体</option>
          <option value="sphere">球体</option>
          <option value="cone">圆锥体</option>
        </select>
      </div>

      <div class="parameters-section">
        <div
          v-for="param in parameters"
          :key="param.name"
          class="parameter-group"
        >
          <label>{{ param.label }}：</label>
          <input
            v-model.number="param.value"
            type="number"
            min="0.01"
            step="0.1"
            class="number-input"
            @input="calculate"
          />
          <span class="unit">{{ param.unit }}</span>
        </div>
      </div>

      <button @click="calculate" class="btn-primary">计算</button>

      <div class="results-section">
        <div v-if="area !== null" class="result-item">
          <div class="result-label">面积：</div>
          <div class="result-value">{{ area.toFixed(4) }} {{ areaUnit }}</div>
        </div>
        <div v-if="volume !== null" class="result-item">
          <div class="result-label">体积：</div>
          <div class="result-value">{{ volume.toFixed(4) }} {{ volumeUnit }}</div>
        </div>
        <div v-if="perimeter !== null" class="result-item">
          <div class="result-label">周长：</div>
          <div class="result-value">{{ perimeter.toFixed(4) }} {{ lengthUnit }}</div>
        </div>
      </div>

      <div class="formula-section">
        <h3>计算公式</h3>
        <div class="formula-content">{{ formula }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const shape = ref('circle')
const parameters = ref([])
const area = ref(null)
const volume = ref(null)
const perimeter = ref(null)

const lengthUnit = 'cm'
const areaUnit = 'cm²'
const volumeUnit = 'cm³'

const shapeParameters = {
  circle: [
    { name: 'radius', label: '半径', value: 5, unit: lengthUnit }
  ],
  rectangle: [
    { name: 'length', label: '长度', value: 10, unit: lengthUnit },
    { name: 'width', label: '宽度', value: 5, unit: lengthUnit }
  ],
  triangle: [
    { name: 'base', label: '底边长', value: 10, unit: lengthUnit },
    { name: 'height', label: '高度', value: 8, unit: lengthUnit }
  ],
  square: [
    { name: 'side', label: '边长', value: 5, unit: lengthUnit }
  ],
  cube: [
    { name: 'side', label: '边长', value: 5, unit: lengthUnit }
  ],
  cylinder: [
    { name: 'radius', label: '底面半径', value: 5, unit: lengthUnit },
    { name: 'height', label: '高度', value: 10, unit: lengthUnit }
  ],
  sphere: [
    { name: 'radius', label: '半径', value: 5, unit: lengthUnit }
  ],
  cone: [
    { name: 'radius', label: '底面半径', value: 5, unit: lengthUnit },
    { name: 'height', label: '高度', value: 10, unit: lengthUnit }
  ]
}

const formula = computed(() => {
  switch (shape.value) {
    case 'circle':
      return `面积 = π × r²\n周长 = 2 × π × r`
    case 'rectangle':
      return `面积 = 长 × 宽\n周长 = 2 × (长 + 宽)`
    case 'triangle':
      return `面积 = 底 × 高 ÷ 2`
    case 'square':
      return `面积 = 边长²\n周长 = 4 × 边长`
    case 'cube':
      return `表面积 = 6 × 边长²\n体积 = 边长³`
    case 'cylinder':
      return `表面积 = 2 × π × r² + 2 × π × r × h\n体积 = π × r² × h`
    case 'sphere':
      return `表面积 = 4 × π × r²\n体积 = (4/3) × π × r³`
    case 'cone':
      return `表面积 = π × r² + π × r × √(r² + h²)\n体积 = (1/3) × π × r² × h`
    default:
      return ''
  }
})

function resetParameters() {
  parameters.value = JSON.parse(JSON.stringify(shapeParameters[shape.value]))
  calculate()
}

function calculate() {
  switch (shape.value) {
    case 'circle':
      calculateCircle()
      break
    case 'rectangle':
      calculateRectangle()
      break
    case 'triangle':
      calculateTriangle()
      break
    case 'square':
      calculateSquare()
      break
    case 'cube':
      calculateCube()
      break
    case 'cylinder':
      calculateCylinder()
      break
    case 'sphere':
      calculateSphere()
      break
    case 'cone':
      calculateCone()
      break
  }
}

function calculateCircle() {
  const radius = parameters.value.find(p => p.name === 'radius').value
  area.value = Math.PI * radius * radius
  perimeter.value = 2 * Math.PI * radius
  volume.value = null
}

function calculateRectangle() {
  const length = parameters.value.find(p => p.name === 'length').value
  const width = parameters.value.find(p => p.name === 'width').value
  area.value = length * width
  perimeter.value = 2 * (length + width)
  volume.value = null
}

function calculateTriangle() {
  const base = parameters.value.find(p => p.name === 'base').value
  const height = parameters.value.find(p => p.name === 'height').value
  area.value = (base * height) / 2
  perimeter.value = null
  volume.value = null
}

function calculateSquare() {
  const side = parameters.value.find(p => p.name === 'side').value
  area.value = side * side
  perimeter.value = 4 * side
  volume.value = null
}

function calculateCube() {
  const side = parameters.value.find(p => p.name === 'side').value
  area.value = 6 * side * side
  volume.value = side * side * side
  perimeter.value = null
}

function calculateCylinder() {
  const radius = parameters.value.find(p => p.name === 'radius').value
  const height = parameters.value.find(p => p.name === 'height').value
  area.value = 2 * Math.PI * radius * radius + 2 * Math.PI * radius * height
  volume.value = Math.PI * radius * radius * height
  perimeter.value = null
}

function calculateSphere() {
  const radius = parameters.value.find(p => p.name === 'radius').value
  area.value = 4 * Math.PI * radius * radius
  volume.value = (4/3) * Math.PI * radius * radius * radius
  perimeter.value = null
}

function calculateCone() {
  const radius = parameters.value.find(p => p.name === 'radius').value
  const height = parameters.value.find(p => p.name === 'height').value
  const slantHeight = Math.sqrt(radius * radius + height * height)
  area.value = Math.PI * radius * radius + Math.PI * radius * slantHeight
  volume.value = (1/3) * Math.PI * radius * radius * height
  perimeter.value = null
}

watch(shape, resetParameters, { immediate: true })
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

.geometry-card {
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

.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.parameters-section {
  margin-bottom: 1.5rem;
}

.parameter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.parameter-group label {
  width: 100px;
  font-weight: 500;
}

.number-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.unit {
  white-space: nowrap;
  color: #666;
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
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.result-label {
  font-weight: 500;
  color: #666;
}

.result-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.formula-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
}

.formula-section h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.formula-content {
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #eee;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .geometry-card {
  background: #262626;
}

.dark .select-input,
.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .unit {
  color: #a3a3a3;
}

.dark .results-section {
  background: #1a1a1a;
}

.dark .result-label {
  color: #a3a3a3;
}

.dark .formula-section {
  background: #1a1a1a;
}

.dark .formula-content {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .parameter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .parameter-group label {
    width: auto;
  }
}
</style>
