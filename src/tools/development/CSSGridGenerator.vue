<template>
  <div class="css-grid-generator">
    <h2>CSS Grid 布局生成器</h2>

    <div class="grid-container">
      <div class="controls">
        <div class="control-group">
          <label>列数</label>
          <input type="number" v-model.number="columns" min="1" max="12" @input="generateCode" />
        </div>
        <div class="control-group">
          <label>行数</label>
          <input type="number" v-model.number="rows" min="1" max="12" @input="generateCode" />
        </div>
        <div class="control-group">
          <label>列宽 (fr)</label>
          <input type="text" v-model="columnSize" placeholder="1fr 1fr 1fr" @input="generateCode" />
        </div>
        <div class="control-group">
          <label>行高 (fr)</label>
          <input type="text" v-model="rowSize" placeholder="1fr 1fr 1fr" @input="generateCode" />
        </div>
        <div class="control-group">
          <label>间距 (px)</label>
          <input type="number" v-model.number="gap" min="0" max="50" @input="generateCode" />
        </div>
        <div class="control-group">
          <label>对齐方式</label>
          <select v-model="alignItems" @change="generateCode">
            <option value="stretch">stretch</option>
            <option value="start">start</option>
            <option value="end">end</option>
            <option value="center">center</option>
          </select>
        </div>
        <div class="control-group">
          <label>内容对齐</label>
          <select v-model="justifyItems" @change="generateCode">
            <option value="stretch">stretch</option>
            <option value="start">start</option>
            <option value="end">end</option>
            <option value="center">center</option>
          </select>
        </div>
      </div>

      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-grid" :style="previewStyle">
          <div v-for="i in columns * rows" :key="i" class="grid-item">{{ i }}</div>
        </div>
      </div>

      <div class="code-section">
        <h3>生成代码</h3>
        <pre><code>{{ generatedCode }}</code></pre>
        <button @click="copyCode" class="copy-btn">{{ copied ? '已复制!' : '复制代码' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const columns = ref(3)
const rows = ref(3)
const columnSize = ref('')
const rowSize = ref('')
const gap = ref(10)
const alignItems = ref('stretch')
const justifyItems = ref('stretch')
const copied = ref(false)

const previewStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: columnSize.value || `repeat(${columns.value}, 1fr)`,
  gridTemplateRows: rowSize.value || `repeat(${rows.value}, 1fr)`,
  gap: `${gap.value}px`,
  alignItems: alignItems.value,
  justifyItems: justifyItems.value
}))

const generatedCode = computed(() => {
  const colTemplate = columnSize.value || `repeat(${columns.value}, 1fr)`
  const rowTemplate = rowSize.value || `repeat(${rows.value}, 1fr)`

  return `.container {
  display: grid;
  grid-template-columns: ${colTemplate};
  grid-template-rows: ${rowTemplate};
  gap: ${gap.value}px;
  align-items: ${alignItems.value};
  justify-items: ${justifyItems.value};
}`
})

const generateCode = () => {
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.css-grid-generator {
  padding: 20px;
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.controls {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.control-group {
  margin-bottom: 15px;
}
.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
.control-group input,
.control-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}
.preview-section,
.code-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.preview-grid {
  min-height: 200px;
  background: var(--bg-secondary);
  padding: 10px;
  border-radius: 4px;
}
.grid-item {
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: bold;
}
.code-section pre {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}
.copy-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-btn:hover {
  opacity: 0.9;
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>
