<template>
  <div class="tool-container">
    <h1 class="title">函数绘图工具</h1>
    <p class="description">绘制数学函数图像，支持多种函数类型。</p>

    <div class="grapher-card">
      <div class="function-input">
        <label>输入函数 f(x)：</label>
        <input
          v-model="functionInput"
          type="text"
          class="text-input"
          placeholder="例如: sin(x), x^2, 2*x+1, sqrt(x)"
        />
        <div class="function-presets">
          <button @click="setFunction('sin(x)')" class="preset-btn">sin(x)</button>
          <button @click="setFunction('cos(x)')" class="preset-btn">cos(x)</button>
          <button @click="setFunction('x^2')" class="preset-btn">x²</button>
          <button @click="setFunction('x^3')" class="preset-btn">x³</button>
          <button @click="setFunction('sqrt(x)')" class="preset-btn">√x</button>
          <button @click="setFunction('1/x')" class="preset-btn">1/x</button>
          <button @click="setFunction('abs(x)')" class="preset-btn">|x|</button>
          <button @click="setFunction('tan(x)')" class="preset-btn">tan(x)</button>
        </div>
      </div>

      <div class="range-inputs">
        <div class="range-group">
          <label>X 范围：</label>
          <input v-model.number="xMin" type="number" class="range-input" />
          <span>到</span>
          <input v-model.number="xMax" type="number" class="range-input" />
        </div>
        <div class="range-group">
          <label>Y 范围：</label>
          <input v-model.number="yMin" type="number" class="range-input" />
          <span>到</span>
          <input v-model.number="yMax" type="number" class="range-input" />
        </div>
      </div>

      <div class="action-buttons">
        <button @click="drawGraph" class="btn-primary">绘制图像</button>
        <button @click="resetView" class="btn-secondary">重置视图</button>
      </div>

      <div class="canvas-container">
        <canvas ref="canvas" class="graph-canvas"></canvas>
        <div class="axis-labels">
          <span class="y-max">{{ yMax }}</span>
          <span class="y-min">{{ yMin }}</span>
          <span class="x-min">{{ xMin }}</span>
          <span class="x-max">{{ xMax }}</span>
        </div>
      </div>

      <div class="info-section">
        <h4>支持的函数</h4>
        <ul>
          <li><code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code> - 三角函数</li>
          <li><code>asin(x)</code>, <code>acos(x)</code>, <code>atan(x)</code> - 反三角函数</li>
          <li><code>sqrt(x)</code> - 平方根</li>
          <li><code>abs(x)</code> - 绝对值</li>
          <li><code>log(x)</code> - 自然对数</li>
          <li><code>exp(x)</code> - e 的指数</li>
          <li><code>pi</code> - 圆周率 (≈ 3.14159)</li>
          <li><code>e</code> - 自然常数 (≈ 2.71828)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const functionInput = ref('sin(x)')
const xMin = ref(-10)
const xMax = ref(10)
const yMin = ref(-2)
const yMax = ref(2)

function setFunction(fn) {
  functionInput.value = fn
  drawGraph()
}

function drawGraph() {
  if (!canvas.value) return

  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height

  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const xRange = xMax.value - xMin.value
  const yRange = yMax.value - yMin.value

  function toCanvasX(x) {
    return ((x - xMin.value) / xRange) * width
  }

  function toCanvasY(y) {
    return height - ((y - yMin.value) / yRange) * height
  }

  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 1
  for (let i = 0; i <= 10; i++) {
    const x = xMin.value + (xRange / 10) * i
    const canvasX = toCanvasX(x)
    ctx.beginPath()
    ctx.moveTo(canvasX, 0)
    ctx.lineTo(canvasX, height)
    ctx.stroke()

    const y = yMin.value + (yRange / 10) * i
    const canvasY = toCanvasY(y)
    ctx.beginPath()
    ctx.moveTo(0, canvasY)
    ctx.lineTo(width, canvasY)
    ctx.stroke()
  }

  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  const originX = toCanvasX(0)
  const originY = toCanvasY(0)

  if (originX >= 0 && originX <= width) {
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()
  }

  if (originY >= 0 && originY <= height) {
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()
  }

  try {
    const fn = compileFunction(functionInput.value)

    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 2
    ctx.beginPath()

    let firstPoint = true
    for (let px = 0; px < width; px++) {
      const x = xMin.value + (px / width) * xRange
      let y

      try {
        y = fn(x)
      } catch (e) {
        continue
      }

      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) {
        firstPoint = true
        continue
      }

      if (y < yMin.value || y > yMax.value) {
        firstPoint = true
        continue
      }

      const canvasX = px
      const canvasY = toCanvasY(y)

      if (firstPoint) {
        ctx.moveTo(canvasX, canvasY)
        firstPoint = false
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }

    ctx.stroke()
  } catch (e) {
    ctx.fillStyle = '#dc2626'
    ctx.font = '14px sans-serif'
    ctx.fillText('函数解析错误: ' + e.message, 10, 30)
  }

  ctx.fillStyle = '#666'
  ctx.font = '12px sans-serif'
  ctx.fillText('x', width - 15, originY - 5)
  ctx.fillText('y', originX + 5, 15)
}

function compileFunction(expr) {
  const safeExpr = expr
    .replace(/\^/g, '**')
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/asin/g, 'Math.asin')
    .replace(/acos/g, 'Math.acos')
    .replace(/atan/g, 'Math.atan')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/abs/g, 'Math.abs')
    .replace(/log/g, 'Math.log')
    .replace(/exp/g, 'Math.exp')
    .replace(/pi/gi, 'Math.PI')
    .replace(/e(?![xp])/gi, 'Math.E')
    .replace(/ln/g, 'Math.log')

  return new Function('x', `return ${safeExpr}`)
}

function resetView() {
  xMin.value = -10
  xMax.value = 10
  yMin.value = -2
  yMax.value = 2
  drawGraph()
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
    drawGraph()
  }
})
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

.grapher-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.function-input {
  margin-bottom: 1.5rem;
}

.function-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: monospace;
  box-sizing: border-box;
}

.function-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.preset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: monospace;
}

.preset-btn:hover {
  background: #e5e5e5;
}

.range-inputs {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-group label {
  font-weight: 500;
}

.range-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.canvas-container {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.graph-canvas {
  width: 100%;
  height: 400px;
  display: block;
}

.axis-labels {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  pointer-events: none;
}

.y-max {
  position: absolute;
  top: 0;
  right: 0;
  color: #666;
  font-size: 0.85rem;
}

.y-min {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #666;
  font-size: 0.85rem;
}

.x-min {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #666;
  font-size: 0.85rem;
}

.x-max {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #666;
  font-size: 0.85rem;
}

.info-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.info-section h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-section li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}

.info-section code {
  background: #e5e5e5;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .grapher-card {
  background: #262626;
}

.dark .text-input,
.dark .range-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .canvas-container {
  background: #1a1a1a;
}

.dark .preset-btn {
  background: #1a1a1a;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .preset-btn:hover {
  background: #333;
}

.dark .info-section {
  background: #1e3a5f;
}

@media (max-width: 768px) {
  .range-inputs {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
