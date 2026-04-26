<template>
  <div class="tool-container">
    <h1 class="title">盒阴影生成器</h1>
    <p class="description">可视化生成 CSS box-shadow 代码，支持多种阴影效果。</p>

    <div class="generator-card">
      <div class="preview-section">
        <div
          class="box-preview"
          :style="{ boxShadow: boxShadowCSS }"
        >
          <span>预览区域</span>
        </div>
      </div>

      <div class="controls-section">
        <div class="control-group">
          <label>阴影类型</label>
          <div class="type-buttons">
            <button
              :class="{ active: shadowType === 'single' }"
              @click="shadowType = 'single'"
            >
              单层阴影
            </button>
            <button
              :class="{ active: shadowType === 'multiple' }"
              @click="shadowType = 'multiple'"
            >
              多层阴影
            </button>
          </div>
        </div>

        <div class="shadow-layers">
          <div
            v-for="(layer, index) in shadowLayers"
            :key="index"
            class="shadow-layer"
          >
            <div class="layer-header">
              <span>阴影层 {{ index + 1 }}</span>
              <button
                v-if="shadowLayers.length > 1"
                @click="removeLayer(index)"
                class="btn-remove-layer"
              >
                ×
              </button>
            </div>

            <div class="layer-controls">
              <div class="control-row">
                <label>X 偏移</label>
                <input
                  type="range"
                  v-model.number="layer.x"
                  min="-50"
                  max="50"
                  class="slider"
                />
                <span class="value-display">{{ layer.x }}px</span>
              </div>

              <div class="control-row">
                <label>Y 偏移</label>
                <input
                  type="range"
                  v-model.number="layer.y"
                  min="-50"
                  max="50"
                  class="slider"
                />
                <span class="value-display">{{ layer.y }}px</span>
              </div>

              <div class="control-row">
                <label>模糊半径</label>
                <input
                  type="range"
                  v-model.number="layer.blur"
                  min="0"
                  max="100"
                  class="slider"
                />
                <span class="value-display">{{ layer.blur }}px</span>
              </div>

              <div class="control-row">
                <label>扩散半径</label>
                <input
                  type="range"
                  v-model.number="layer.spread"
                  min="-50"
                  max="50"
                  class="slider"
                />
                <span class="value-display">{{ layer.spread }}px</span>
              </div>

              <div class="control-row">
                <label>阴影颜色</label>
                <input
                  type="color"
                  v-model="layer.color"
                  class="color-picker"
                />
                <input
                  type="text"
                  v-model="layer.color"
                  class="color-input"
                />
              </div>

              <div class="control-row">
                <label>
                  <input type="checkbox" v-model="layer.inset" />
                  内阴影
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="shadowType === 'multiple'"
          @click="addLayer"
          class="btn-add-layer"
        >
          + 添加阴影层
        </button>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>生成的 CSS</label>
          <button @click="copyCSS" class="btn-copy">复制</button>
        </div>
        <pre class="code-output">{{ boxShadowCSS }}</pre>
      </div>

      <div class="presets-section">
        <label>预设阴影</label>
        <div class="presets-grid">
          <div
            v-for="(preset, index) in presets"
            :key="index"
            class="preset-item"
            :style="{ boxShadow: preset.shadow }"
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

const shadowType = ref('single')
const shadowLayers = ref([
  { x: 0, y: 4, blur: 15, spread: 0, color: '#000000', inset: false }
])

const presets = [
  { name: '柔和阴影', shadow: '0 4px 6px rgba(0,0,0,0.1)' },
  { name: '悬浮阴影', shadow: '0 10px 20px rgba(0,0,0,0.15)' },
  { name: '柔和内阴影', shadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
  { name: '硬边框', shadow: '3px 3px 0 #000' },
  { name: '彩色阴影', shadow: '0 4px 20px rgba(102,126,234,0.4)' },
  { name: '长阴影', shadow: '5px 5px 15px rgba(0,0,0,0.3)' },
  { name: '多重阴影', shadow: '0 4px 6px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.15)' },
  { name: '发光效果', shadow: '0 0 20px rgba(102,126,234,0.6)' }
]

const boxShadowCSS = computed(() => {
  return shadowLayers.value
    .map(layer => {
      const inset = layer.inset ? 'inset ' : ''
      return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${layer.color}`
    })
    .join(',\n     ')
})

function addLayer() {
  shadowLayers.value.push({
    x: 0,
    y: 4,
    blur: 15,
    spread: 0,
    color: '#000000',
    inset: false
  })
}

function removeLayer(index) {
  shadowLayers.value.splice(index, 1)
}

function applyPreset(preset) {
  shadowType.value = 'single'
  const shadows = preset.shadow.split(',').map(s => s.trim())

  shadowLayers.value = shadows.map(shadowStr => {
    const layer = { x: 0, y: 4, blur: 15, spread: 0, color: '#000000', inset: false }

    if (shadowStr.includes('inset')) {
      layer.inset = true
    }

    const match = shadowStr.match(/(-?\d+)px/g)
    if (match) {
      layer.x = parseInt(match[0]) || 0
      layer.y = parseInt(match[1]) || 0
      layer.blur = parseInt(match[2]) || 0
      layer.spread = parseInt(match[3]) || 0
    }

    const colorMatch = shadowStr.match(/rgba?\([^)]+\)|#[a-fA-F0-9]+/)
    if (colorMatch) {
      layer.color = colorMatch[0]
    }

    return layer
  })
}

function copyCSS() {
  navigator.clipboard.writeText(`box-shadow: ${boxShadowCSS.value};`)
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

.generator-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.box-preview {
  height: 150px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #666;
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

.control-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.type-buttons {
  display: flex;
}

.type-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 0.95rem;
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

.shadow-layer {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.btn-remove-layer {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.2rem;
}

.layer-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-row label {
  min-width: 80px;
  font-size: 0.9rem;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 3px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
}

.value-display {
  min-width: 60px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 500;
}

.color-picker {
  width: 40px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-input {
  width: 100px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.btn-add-layer {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.btn-add-layer:hover {
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
  background: #fff;
}

.preset-item:hover {
  transform: scale(1.05);
}

.preset-item span {
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

.dark .controls-section,
.dark .shadow-layer {
  background: #1a1a1a;
}

.dark .layer-controls {
  background: #262626;
}

.dark .color-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .presets-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .control-row {
    flex-wrap: wrap;
  }
}
</style>
