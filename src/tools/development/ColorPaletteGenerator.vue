<template>
  <div class="tool-container">
    <h1 class="title">色板生成工具</h1>
    <p class="description">创建、调色和可视化配色方案，支持多种色彩格式和颜色导出。</p>

    <div class="palette-card">
      <div class="colors-section">
        <h3>调色板</h3>
        <div class="colors-grid">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="color-item"
          >
            <div
              class="color-preview"
              :style="{ backgroundColor: color.hex }"
              @click="editColor(index)"
            ></div>
            <input
              v-model="color.hex"
              type="text"
              class="color-input"
              placeholder="#000000"
              @input="updateColor(index)"
            />
            <button @click="removeColor(index)" class="btn-remove-color">×</button>
          </div>
          <button @click="addColor" class="btn-add-color">+ 添加颜色</button>
        </div>
      </div>

      <div class="color-picker-section">
        <h3>颜色选择器</h3>
        <div class="picker-controls">
          <div class="picker-row">
            <label>色相 (H)</label>
            <input
              v-model.number="pickerH"
              type="range"
              min="0"
              max="360"
              class="range-input"
              @input="updateFromPicker"
            />
            <span class="range-value">{{ pickerH }}°</span>
          </div>
          <div class="picker-row">
            <label>饱和度 (S)</label>
            <input
              v-model.number="pickerS"
              type="range"
              min="0"
              max="100"
              class="range-input"
              @input="updateFromPicker"
            />
            <span class="range-value">{{ pickerS }}%</span>
          </div>
          <div class="picker-row">
            <label>亮度 (L)</label>
            <input
              v-model.number="pickerL"
              type="range"
              min="0"
              max="100"
              class="range-input"
              @input="updateFromPicker"
            />
            <span class="range-value">{{ pickerL }}%</span>
          </div>
        </div>
        <div class="picker-preview" :style="{ backgroundColor: currentColor }"></div>
        <div class="picker-actions">
          <button @click="addColorFromPicker" class="btn-primary">添加到调色板</button>
        </div>
      </div>

      <div class="formats-section">
        <h3>当前颜色格式</h3>
        <div class="format-grid">
          <div class="format-item">
            <div class="format-label">HEX</div>
            <div class="format-value">
              <code>{{ formats.hex }}</code>
              <button @click="copyFormat(formats.hex)" class="btn-copy-small">复制</button>
            </div>
          </div>
          <div class="format-item">
            <div class="format-label">RGB</div>
            <div class="format-value">
              <code>{{ formats.rgb }}</code>
              <button @click="copyFormat(formats.rgb)" class="btn-copy-small">复制</button>
            </div>
          </div>
          <div class="format-item">
            <div class="format-label">HSL</div>
            <div class="format-value">
              <code>{{ formats.hsl }}</code>
              <button @click="copyFormat(formats.hsl)" class="btn-copy-small">复制</button>
            </div>
          </div>
          <div class="format-item">
            <div class="format-label">CSS 变量</div>
            <div class="format-value">
              <code>{{ formats.cssVar }}</code>
              <button @click="copyFormat(formats.cssVar)" class="btn-copy-small">复制</button>
            </div>
          </div>
        </div>
      </div>

      <div class="export-section">
        <h3>导出配色方案</h3>
        <div class="export-tabs">
          <button
            :class="{ active: exportFormat === 'css' }"
            @click="exportFormat = 'css'"
          >
            CSS
          </button>
          <button
            :class="{ active: exportFormat === 'scss' }"
            @click="exportFormat = 'scss'"
          >
            SCSS
          </button>
          <button
            :class="{ active: exportFormat === 'json' }"
            @click="exportFormat = 'json'"
          >
            JSON
          </button>
        </div>
        <textarea
          :value="exportedPalette"
          class="text-input"
          readonly
          rows="8"
        ></textarea>
        <button @click="copyPalette" class="btn-primary">复制导出代码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const colors = ref([
  { hex: '#3B82F6' },
  { hex: '#10B981' },
  { hex: '#F59E0B' },
  { hex: '#EF4444' },
  { hex: '#8B5CF6' }
])

const pickerH = ref(210)
const pickerS = ref(90)
const pickerL = ref(50)
const exportFormat = ref('css')

const currentColor = computed(() => {
  return `hsl(${pickerH.value}, ${pickerS.value}%, ${pickerL.value}%)`
})

const formats = computed(() => {
  const rgb = hslToRgb(pickerH.value, pickerS.value, pickerL.value)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${pickerH.value}, ${pickerS.value}%, ${pickerL.value}%)`,
    cssVar: `--color-primary: hsl(${pickerH.value}, ${pickerS.value}%, ${pickerL.value}%);`
  }
})

const exportedPalette = computed(() => {
  const colorList = colors.value.map((c, i) => {
    const rgb = hexToRgb(c.hex)
    return rgb
  })

  switch (exportFormat.value) {
    case 'css':
      let css = ':root {\n'
      colors.value.forEach((c, i) => {
        css += `  --color-${i + 1}: ${c.hex};\n`
      })
      css += '}'
      return css

    case 'scss':
      let scss = ''
      colors.value.forEach((c, i) => {
        scss += `$color-${i + 1}: ${c.hex};\n`
      })
      return scss

    case 'json':
      const json = {}
      colors.value.forEach((c, i) => {
        json[`color${i + 1}`] = c.hex
      })
      return JSON.stringify(json, null, 2)

    default:
      return ''
  }
})

function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function updateFromPicker() {
  // 更新颜色
}

function addColor() {
  colors.value.push({ hex: '#' + Math.random().toString(16).substr(2, 6).toUpperCase() })
}

function removeColor(index) {
  colors.value.splice(index, 1)
}

function editColor(index) {
  const hex = colors.value[index].hex
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  pickerH.value = hsl.h
  pickerS.value = hsl.s
  pickerL.value = hsl.l
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function addColorFromPicker() {
  colors.value.push({ hex: formats.value.hex })
}

function updateColor(index) {
  // 更新颜色
}

function copyFormat(text) {
  navigator.clipboard.writeText(text)
}

function copyPalette() {
  navigator.clipboard.writeText(exportedPalette.value)
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

.palette-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.colors-section,
.color-picker-section,
.formats-section,
.export-section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.color-preview {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.color-preview:hover {
  transform: scale(1.05);
}

.color-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
  font-family: monospace;
}

.btn-remove-color {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.btn-add-color {
  width: 100%;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-add-color:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.picker-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.picker-row label {
  width: 100px;
  font-weight: 500;
}

.range-input {
  flex: 1;
}

.range-value {
  width: 50px;
  text-align: right;
  font-family: monospace;
  color: #666;
}

.picker-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.picker-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.format-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.format-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.format-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.format-value code {
  font-family: monospace;
  font-size: 0.85rem;
  color: #2563eb;
}

.btn-copy-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #dbeafe;
  color: #1e40af;
  cursor: pointer;
}

.export-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.export-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.export-tabs button.active {
  background: #2563eb;
  color: white;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
  background: #fafafa;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .palette-card {
  background: #262626;
}

.dark .color-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-remove-color {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .btn-add-color {
  border-color: #404040;
  color: #a3a3a3;
}

.dark .btn-add-color:hover {
  border-color: #60a5fa;
  color: #60a5fa;
}

.dark .picker-preview {
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.dark .format-item {
  background: #1a1a1a;
  border-color: #333;
}

.dark .format-value code {
  color: #60a5fa;
}

.dark .btn-copy-small {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark .export-tabs {
  background: #333;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .format-grid {
    grid-template-columns: 1fr;
  }

  .picker-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .range-value {
    text-align: left;
  }
}
</style>
