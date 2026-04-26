<template>
  <div class="tool-container">
    <h1 class="title">CSS 渐变生成器</h1>
    <p class="description">可视化生成 CSS 渐变代码，支持线性渐变和径向渐变。</p>

    <div class="generator-card">
      <div class="preview-section">
        <div
          class="gradient-preview"
          :style="{ background: gradientCSS }"
        ></div>
      </div>

      <div class="controls-section">
        <div class="control-group">
          <label>渐变类型</label>
          <div class="type-buttons">
            <button
              :class="{ active: gradientType === 'linear' }"
              @click="gradientType = 'linear'"
            >
              线性渐变
            </button>
            <button
              :class="{ active: gradientType === 'radial' }"
              @click="gradientType = 'radial'"
            >
              径向渐变
            </button>
          </div>
        </div>

        <div class="control-group">
          <label>角度</label>
          <div class="slider-row">
            <input
              type="range"
              v-model.number="angle"
              min="0"
              max="360"
              class="slider"
            />
            <span class="slider-value">{{ angle }}°</span>
          </div>
        </div>

        <div class="color-stops">
          <label>颜色节点</label>
          <div
            v-for="(stop, index) in colorStops"
            :key="index"
            class="color-stop-row"
          >
            <input
              type="color"
              v-model="stop.color"
              class="color-picker"
            />
            <input
              type="number"
              v-model.number="stop.position"
              min="0"
              max="100"
              class="position-input"
            />
            <span class="position-unit">%</span>
            <button
              v-if="colorStops.length > 2"
              @click="removeStop(index)"
              class="btn-remove"
            >
              ×
            </button>
          </div>
          <button @click="addStop" class="btn-add">+ 添加颜色</button>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>生成的 CSS</label>
          <button @click="copyCSS" class="btn-copy">复制</button>
        </div>
        <pre class="code-output">{{ gradientCSS }}</pre>
      </div>

      <div class="presets-section">
        <label>预设渐变</label>
        <div class="presets-grid">
          <div
            v-for="(preset, index) in presets"
            :key="index"
            class="preset-item"
            :style="{ background: preset.gradient }"
            @click="applyPreset(preset)"
          >
            <span>{{ preset.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const gradientType = ref('linear')
const angle = ref(90)
const colorStops = ref([
  { color: '#667eea', position: 0 },
  { color: '#764ba2', position: 100 }
])

const presets = [
  { name: '紫色梦幻', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '日落橙', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '海洋蓝', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '森林绿', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: '阳光金', gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)' },
  { name: '暗夜紫', gradient: 'linear-gradient(135deg, #c471ed 0%, #f64f59 100%)' },
  { name: '薄荷绿', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: '橙红渐变', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }
]

const gradientCSS = computed(() => {
  const stops = colorStops.value
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')

  if (gradientType.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${stops})`
  } else {
    return `radial-gradient(circle, ${stops})`
  }
})

function addStop() {
  const lastStop = colorStops.value[colorStops.value.length - 1]
  colorStops.value.push({
    color: '#ffffff',
    position: Math.min(lastStop.position + 20, 100)
  })
}

function removeStop(index) {
  colorStops.value.splice(index, 1)
}

function applyPreset(preset) {
  gradientType.value = 'linear'
  angle.value = 135
  colorStops.value = [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ]
}

function copyCSS() {
  navigator.clipboard.writeText(gradientCSS.value)
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

.generator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.gradient-preview {
  height: 200px;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.controls-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.type-buttons {
  display: flex;
  gap: 0;
}

.type-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.type-buttons button:first-child {
  border-radius: 6px 0 0 6px;
}

.type-buttons button:last-child {
  border-radius: 0 6px 6px 0;
}

.type-buttons button.active {
  background: #2563eb;
  color: white;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
}

.color-stops {
  margin-top: 1.5rem;
}

.color-stop-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.position-input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

.position-unit {
  color: #666;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #fee2e2;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-add:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.output-section {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.output-header label {
  color: #e5e5e5;
  font-weight: 500;
}

.btn-copy {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.code-output {
  margin: 0;
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.95rem;
  word-break: break-all;
}

.presets-section {
  margin-top: 1rem;
}

.presets-section label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.preset-item {
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preset-item:hover {
  transform: scale(1.05);
}

.preset-item span {
  background: rgba(255,255,255,0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .generator-card {
  background: #262626;
}

.dark .controls-section {
  background: #1a1a1a;
}

.dark .type-buttons button {
  background: #404040;
  color: #e5e5e5;
}

.dark .position-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .presets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
