<template>
  <div class="tool-container">
    <h1 class="title">Flexbox 布局生成器</h1>
    <p class="description">可视化生成 Flexbox 布局代码，支持实时预览。</p>

    <div class="generator-card">
      <div class="preview-section">
        <div
          class="flex-preview"
          :style="containerStyle"
        >
          <div
            v-for="i in itemCount"
            :key="i"
            class="flex-item"
            :style="itemStyle"
          >
            {{ i }}
          </div>
        </div>
      </div>

      <div class="controls-grid">
        <div class="control-section">
          <h3>容器属性</h3>

          <div class="control-group">
            <label>flex-direction</label>
            <select v-model="flexDirection" class="select-input">
              <option value="row">row (水平)</option>
              <option value="row-reverse">row-reverse</option>
              <option value="column">column (垂直)</option>
              <option value="column-reverse">column-reverse</option>
            </select>
          </div>

          <div class="control-group">
            <label>justify-content</label>
            <select v-model="justifyContent" class="select-input">
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>

          <div class="control-group">
            <label>align-items</label>
            <select v-model="alignItems" class="select-input">
              <option value="stretch">stretch</option>
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="baseline">baseline</option>
            </select>
          </div>

          <div class="control-group">
            <label>flex-wrap</label>
            <select v-model="flexWrap" class="select-input">
              <option value="nowrap">nowrap</option>
              <option value="wrap">wrap</option>
              <option value="wrap-reverse">wrap-reverse</option>
            </select>
          </div>
        </div>

        <div class="control-section">
          <h3>项目属性</h3>

          <div class="control-group">
            <label>元素数量</label>
            <input
              type="number"
              v-model.number="itemCount"
              min="1"
              max="12"
              class="number-input"
            />
          </div>

          <div class="control-group">
            <label>flex-grow</label>
            <input
              type="range"
              v-model.number="flexGrow"
              min="0"
              max="5"
              class="slider"
            />
            <span class="slider-value">{{ flexGrow }}</span>
          </div>

          <div class="control-group">
            <label>flex-shrink</label>
            <input
              type="range"
              v-model.number="flexShrink"
              min="0"
              max="5"
              class="slider"
            />
            <span class="slider-value">{{ flexShrink }}</span>
          </div>

          <div class="control-group">
            <label>flex-basis</label>
            <input
              type="text"
              v-model="flexBasis"
              placeholder="如: 100px, 50%"
              class="text-input"
            />
          </div>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>容器 CSS</label>
          <button @click="copyContainerCSS" class="btn-copy">复制</button>
        </div>
        <pre class="code-output">{{ containerCSS }}</pre>
      </div>

      <div class="output-section">
        <div class="output-header">
          <label>项目 CSS</label>
          <button @click="copyItemCSS" class="btn-copy">复制</button>
        </div>
        <pre class="code-output">{{ itemCSS }}</pre>
      </div>
    </div>

    <div class="info-section">
      <h3>属性说明</h3>
      <div class="info-grid">
        <div class="info-item">
          <code>flex-direction</code>
          <span>主轴方向</span>
        </div>
        <div class="info-item">
          <code>justify-content</code>
          <span>主轴对齐方式</span>
        </div>
        <div class="info-item">
          <code>align-items</code>
          <span>交叉轴对齐方式</span>
        </div>
        <div class="info-item">
          <code>flex-wrap</code>
          <span>换行方式</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const flexDirection = ref('row')
const justifyContent = ref('flex-start')
const alignItems = ref('stretch')
const flexWrap = ref('nowrap')
const itemCount = ref(4)
const flexGrow = ref(0)
const flexShrink = ref(1)
const flexBasis = ref('auto')

const containerStyle = computed(() => ({
  display: 'flex',
  flexDirection: flexDirection.value,
  justifyContent: justifyContent.value,
  alignItems: alignItems.value,
  flexWrap: flexWrap.value
}))

const itemStyle = computed(() => ({
  flexGrow: flexGrow.value,
  flexShrink: flexShrink.value,
  flexBasis: flexBasis.value || 'auto'
}))

const containerCSS = computed(() => {
  return `.container {
  display: flex;
  flex-direction: ${flexDirection.value};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  flex-wrap: ${flexWrap.value};
}`
})

const itemCSS = computed(() => {
  return `.item {
  flex-grow: ${flexGrow.value};
  flex-shrink: ${flexShrink.value};
  flex-basis: ${flexBasis.value || 'auto'};
}`
})

function copyContainerCSS() {
  navigator.clipboard.writeText(containerCSS.value)
}

function copyItemCSS() {
  navigator.clipboard.writeText(itemCSS.value)
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
  margin-bottom: 1.5rem;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.flex-preview {
  min-height: 200px;
  background: #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
}

.flex-item {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 8px;
  margin: 4px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.control-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.control-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #333;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.select-input,
.text-input,
.number-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.number-input {
  width: 80px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.slider-value {
  min-width: 30px;
  text-align: right;
  font-weight: 600;
}

.output-section {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
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
  font-size: 0.9rem;
  line-height: 1.6;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
}

.info-item code {
  display: block;
  color: #9333ea;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.info-item span {
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .generator-card,
.dark .info-section {
  background: #262626;
}

.dark .control-section {
  background: #1a1a1a;
}

.dark .control-section h3 {
  color: #e5e5e5;
}

.dark .flex-preview {
  background: #333;
}

.dark .select-input,
.dark .text-input,
.dark .number-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .info-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
