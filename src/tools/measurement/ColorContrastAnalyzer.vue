<template>
  <div class="tool-container">
    <h1 class="title">颜色对比度分析器</h1>
    <p class="description">检查两个颜色的对比度是否满足 WCAG 可访问性标准。</p>

    <div class="analyzer-card">
      <div class="color-inputs">
        <div class="color-group">
          <label>前景色（文字颜色）</label>
          <div class="color-picker-row">
            <input
              v-model="foregroundColor"
              type="color"
              class="color-picker"
            />
            <input
              v-model="foregroundColor"
              type="text"
              class="text-input"
              placeholder="#000000"
            />
          </div>
        </div>

        <div class="color-group">
          <label>背景色</label>
          <div class="color-picker-row">
            <input
              v-model="backgroundColor"
              type="color"
              class="color-picker"
            />
            <input
              v-model="backgroundColor"
              type="text"
              class="text-input"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-box" :style="{ backgroundColor: backgroundColor }">
          <p class="preview-large" :style="{ color: foregroundColor }">
            大号文字示例 Aa
          </p>
          <p class="preview-normal" :style="{ color: foregroundColor }">
            普通文字示例 The quick brown fox jumps over the lazy dog.
          </p>
          <p class="preview-small" :style="{ color: foregroundColor }">
            小号文字示例 www.example.com
          </p>
        </div>
      </div>

      <div v-if="contrastResults" class="results-section">
        <h3>对比度分析结果</h3>

        <div class="contrast-score">
          <div class="score-value" :class="getScoreClass(contrastResults.ratio)">
            {{ contrastResults.ratio.toFixed(2) }}:1
          </div>
          <div class="score-label">对比度</div>
        </div>

        <div class="wcag-results">
          <div class="wcag-item" :class="contrastResults['AA']['large'] ? 'pass' : 'fail'">
            <span class="wcag-label">WCAG AA 大文本</span>
            <span class="wcag-status">{{ contrastResults.AA.large ? '✓ 通过' : '✗ 未通过' }}</span>
            <span class="wcag-requirement">要求 ≥ 3:1</span>
          </div>
          <div class="wcag-item" :class="contrastResults['AA']['normal'] ? 'pass' : 'fail'">
            <span class="wcag-label">WCAG AA 普通文本</span>
            <span class="wcag-status">{{ contrastResults.AA.normal ? '✓ 通过' : '✗ 未通过' }}</span>
            <span class="wcag-requirement">要求 ≥ 4.5:1</span>
          </div>
          <div class="wcag-item" :class="contrastResults['AAA']['large'] ? 'pass' : 'fail'">
            <span class="wcag-label">WCAG AAA 大文本</span>
            <span class="wcag-status">{{ contrastResults.AAA.large ? '✓ 通过' : '✗ 未通过' }}</span>
            <span class="wcag-requirement">要求 ≥ 4.5:1</span>
          </div>
          <div class="wcag-item" :class="contrastResults['AAA']['normal'] ? 'pass' : 'fail'">
            <span class="wcag-label">WCAG AAA 普通文本</span>
            <span class="wcag-status">{{ contrastResults.AAA.normal ? '✓ 通过' : '✗ 未通过' }}</span>
            <span class="wcag-requirement">要求 ≥ 7:1</span>
          </div>
        </div>

        <div class="color-info">
          <div class="color-info-item">
            <span class="info-label">前景色</span>
            <span class="info-value">
              <span class="color-swatch" :style="{ backgroundColor: foregroundColor }"></span>
              {{ foregroundColor.toUpperCase() }}
            </span>
          </div>
          <div class="color-info-item">
            <span class="info-label">背景色</span>
            <span class="info-value">
              <span class="color-swatch" :style="{ backgroundColor: backgroundColor }"></span>
              {{ backgroundColor.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <div class="suggestions-section">
        <h3>配色建议</h3>
        <p class="suggestion-intro">以下是一些通过 WCAG AA 标准的配色方案：</p>

        <div class="suggestion-grid">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
            @click="applySuggestion(suggestion)"
          >
            <div
              class="suggestion-preview"
              :style="{ backgroundColor: suggestion.bg, color: suggestion.fg }"
            >
              Aa
            </div>
            <span class="suggestion-ratio">{{ suggestion.ratio }}:1</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h4>WCAG 标准说明</h4>
        <ul>
          <li><strong>AA 级</strong>: 普通文本对比度 ≥ 4.5:1，大文本 ≥ 3:1</li>
          <li><strong>AAA 级</strong>: 普通文本对比度 ≥ 7:1，大文本 ≥ 4.5:1</li>
          <li><strong>大文本</strong>: 字体大小 ≥ 18pt 或 ≥ 14pt 粗体</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const foregroundColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')

const suggestions = [
  { fg: '#000000', bg: '#FFFFFF', ratio: '21.00' },
  { fg: '#FFFFFF', bg: '#000000', ratio: '21.00' },
  { fg: '#0000FF', bg: '#FFFFFF', ratio: '8.59' },
  { fg: '#FFFFFF', bg: '#0000FF', ratio: '8.59' },
  { fg: '#006600', bg: '#FFFFFF', ratio: '7.89' },
  { fg: '#006600', bg: '#FFFF00', ratio: '7.73' },
  { fg: '#000000', bg: '#FFFF00', ratio: '19.55' },
  { fg: '#000000', bg: '#00FF00', ratio: '17.30' },
]

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(fg, bg) {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)

  if (!fgRgb || !bgRgb) return 1

  const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)

  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)

  return (lighter + 0.05) / (darker + 0.05)
}

const contrastResults = computed(() => {
  const ratio = getContrastRatio(foregroundColor.value, backgroundColor.value)

  return {
    ratio,
    AA: {
      large: ratio >= 3,
      normal: ratio >= 4.5
    },
    AAA: {
      large: ratio >= 4.5,
      normal: ratio >= 7
    }
  }
})

function getScoreClass(ratio) {
  if (ratio >= 7) return 'excellent'
  if (ratio >= 4.5) return 'good'
  if (ratio >= 3) return 'fair'
  return 'poor'
}

function applySuggestion(suggestion) {
  foregroundColor.value = suggestion.fg
  backgroundColor.value = suggestion.bg
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

.analyzer-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.color-inputs {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.color-group {
  flex: 1;
}

.color-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.color-picker-row {
  display: flex;
  gap: 0.75rem;
}

.color-picker {
  width: 60px;
  height: 50px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.text-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.preview-box {
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.preview-large {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.preview-normal {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.preview-small {
  font-size: 0.9rem;
}

.results-section {
  margin-bottom: 1.5rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.contrast-score {
  text-align: center;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
}

.score-value.excellent { color: #10b981; }
.score-value.good { color: #22c55e; }
.score-value.fair { color: #f59e0b; }
.score-value.poor { color: #ef4444; }

.score-label {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

.wcag-results {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.wcag-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.wcag-item.pass {
  border-color: #10b981;
}

.wcag-item.fail {
  border-color: #ef4444;
}

.wcag-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.wcag-status {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.wcag-item.pass .wcag-status { color: #10b981; }
.wcag-item.fail .wcag-status { color: #ef4444; }

.wcag-requirement {
  font-size: 0.85rem;
  color: #666;
}

.color-info {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.color-info-item {
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: monospace;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.suggestions-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.suggestions-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.suggestion-intro {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.suggestion-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.suggestion-item {
  cursor: pointer;
  text-align: center;
}

.suggestion-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 1px solid #ddd;
  margin-bottom: 0.25rem;
}

.suggestion-ratio {
  font-size: 0.85rem;
  color: #666;
}

.info-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.info-section h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-section li {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .analyzer-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .preview-box {
  border-color: #404040;
}

.dark .contrast-score,
.dark .wcag-item,
.dark .color-info-item,
.dark .suggestions-section {
  background: #1a1a1a;
}

.dark .info-section {
  background: #1e3a5f;
}

@media (max-width: 768px) {
  .color-inputs {
    flex-direction: column;
  }

  .wcag-results {
    grid-template-columns: 1fr;
  }
}
</style>
