<template>
  <div class="tool-container">
    <h1 class="title">像素/尺寸单位换算</h1>
    <p class="description">在不同屏幕尺寸单位之间进行换算，如 px、em、rem、vw、vh 等。</p>

    <div class="converter-section">
      <div class="input-group">
        <label>数值：</label>
        <input
          v-model.number="inputValue"
          type="number"
          class="number-input"
          @input="convert"
        />
      </div>

      <div class="input-group">
        <label>从：</label>
        <select v-model="fromUnit" class="select-input" @change="convert">
          <option value="px">像素 (px)</option>
          <option value="em">Em (em)</option>
          <option value="rem">Rem (rem)</option>
          <option value="vw">视口宽度 (vw)</option>
          <option value="vh">视口高度 (vh)</option>
          <option value="pt">磅 (pt)</option>
          <option value="percent">百分比 (%)</option>
        </select>
      </div>
    </div>

    <div class="results-grid">
      <div class="result-card">
        <div class="card-header">
          <span>像素 (px)</span>
          <button @click="copy(pxValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ pxValue.toFixed(2) }} px</div>
        <div class="card-note">基于 {{ baseFontSize }}px 基础字号</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>Em (em)</span>
          <button @click="copy(emValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ emValue.toFixed(4) }} em</div>
        <div class="card-note">相对于父元素字号</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>Rem (rem)</span>
          <button @click="copy(remValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ remValue.toFixed(4) }} rem</div>
        <div class="card-note">相对于根元素字号</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>视口宽度 (vw)</span>
          <button @click="copy(vwValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ vwValue.toFixed(4) }} vw</div>
        <div class="card-note">基于 {{ viewportWidth }}px 视口宽度</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>视口高度 (vh)</span>
          <button @click="copy(vhValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ vhValue.toFixed(4) }} vh</div>
        <div class="card-note">基于 {{ viewportHeight }}px 视口高度</div>
      </div>

      <div class="result-card">
        <div class="card-header">
          <span>磅 (pt)</span>
          <button @click="copy(ptValue)" class="btn-copy">复制</button>
        </div>
        <div class="card-value">{{ ptValue.toFixed(2) }} pt</div>
        <div class="card-note">常用于印刷</div>
      </div>
    </div>

    <div class="settings-section">
      <h3>换算设置</h3>

      <div class="settings-grid">
        <div class="setting-item">
          <label>基础字号 (px)：</label>
          <input
            v-model.number="baseFontSize"
            type="number"
            class="number-input small"
            min="1"
            @change="convert"
          />
        </div>

        <div class="setting-item">
          <label>视口宽度 (px)：</label>
          <input
            v-model.number="viewportWidth"
            type="number"
            class="number-input small"
            min="1"
            @change="convert"
          />
        </div>

        <div class="setting-item">
          <label>视口高度 (px)：</label>
          <input
            v-model.number="viewportHeight"
            type="number"
            class="number-input small"
            min="1"
            @change="convert"
          />
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>换算说明</h4>
      <table class="info-table">
        <thead>
          <tr>
            <th>单位</th>
            <th>说明</th>
            <th>换算公式</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>px</td>
            <td>像素，屏幕上的最小单位</td>
            <td>基准单位</td>
          </tr>
          <tr>
            <td>em</td>
            <td>相对于父元素字体大小</td>
            <td>px ÷ 父元素字号</td>
          </tr>
          <tr>
            <td>rem</td>
            <td>相对于根元素字体大小</td>
            <td>px ÷ 根元素字号</td>
          </tr>
          <tr>
            <td>vw</td>
            <td>视口宽度的 1%</td>
            <td>px ÷ 视口宽度 × 100</td>
          </tr>
          <tr>
            <td>vh</td>
            <td>视口高度的 1%</td>
            <td>px ÷ 视口高度 × 100</td>
          </tr>
          <tr>
            <td>pt</td>
            <td>磅，1pt = 1/72 英寸</td>
            <td>px × 0.75</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref(16)
const fromUnit = ref('px')
const baseFontSize = ref(16)
const viewportWidth = ref(1920)
const viewportHeight = ref(1080)

const pxValue = computed(() => {
  if (!inputValue.value) return 0

  switch (fromUnit.value) {
    case 'px':
      return inputValue.value
    case 'em':
      return inputValue.value * baseFontSize.value
    case 'rem':
      return inputValue.value * baseFontSize.value
    case 'vw':
      return inputValue.value / 100 * viewportWidth.value
    case 'vh':
      return inputValue.value / 100 * viewportHeight.value
    case 'pt':
      return inputValue.value / 0.75
    case 'percent':
      return inputValue.value / 100 * baseFontSize.value
    default:
      return inputValue.value
  }
})

const emValue = computed(() => {
  return pxValue.value / baseFontSize.value
})

const remValue = computed(() => {
  return pxValue.value / baseFontSize.value
})

const vwValue = computed(() => {
  return pxValue.value / viewportWidth.value * 100
})

const vhValue = computed(() => {
  return pxValue.value / viewportHeight.value * 100
})

const ptValue = computed(() => {
  return pxValue.value * 0.75
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  font-size: 0.9rem;
  color: #666;
}

.card-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.card-note {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

.btn-copy {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-copy:hover {
  background: #f0f0f0;
}

.settings-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.settings-grid {
  display: flex;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.setting-item label {
  white-space: nowrap;
}

.number-input.small {
  width: 100px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h4 {
  margin-bottom: 1rem;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.info-table th,
.info-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.info-table th {
  font-weight: 500;
  color: #666;
}

.info-table td:first-child {
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
.dark .settings-section,
.dark .info-section {
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

.dark .info-table th {
  color: #a3a3a3;
}

.dark .info-table td {
  border-color: #404040;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .converter-section {
    flex-direction: column;
  }

  .settings-grid {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
