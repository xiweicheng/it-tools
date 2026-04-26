<template>
  <div class="svg-preview">
    <h2>SVG 预览器</h2>

    <div class="editor-container">
      <div class="input-section">
        <h3>输入 SVG 代码</h3>
        <textarea v-model="svgCode" placeholder="粘贴 SVG 代码..." @input="parseSvg"></textarea>
        <button @click="loadSample" class="sample-btn">加载示例</button>
      </div>

      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-box" v-html="svgCode"></div>
      </div>

      <div class="info-section" v-if="svgInfo">
        <h3>SVG 信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">宽度</span>
            <span class="value">{{ svgInfo.width }}</span>
          </div>
          <div class="info-item">
            <span class="label">高度</span>
            <span class="value">{{ svgInfo.height }}</span>
          </div>
          <div class="info-item">
            <span class="label">视图Box</span>
            <span class="value">{{ svgInfo.viewBox || '无' }}</span>
          </div>
          <div class="info-item">
            <span class="label">元素数量</span>
            <span class="value">{{ svgInfo.elementCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions" v-if="svgCode">
      <button @click="downloadSvg" class="action-btn">下载 SVG</button>
      <button @click="copySvg" class="action-btn">{{ copied ? '已复制!' : '复制 SVG' }}</button>
      <button @click="copyAsDataUri" class="action-btn">复制为 Data URI</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const svgCode = ref('')
const svgInfo = ref(null)
const copied = ref(false)

const sampleSvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#4CAF50" />
  <circle cx="100" cy="100" r="60" fill="#8BC34A" />
  <circle cx="100" cy="100" r="40" fill="#CDDC39" />
  <circle cx="100" cy="100" r="20" fill="#FFEB3B" />
</svg>`

const loadSample = () => {
  svgCode.value = sampleSvg
  parseSvg()
}

const parseSvg = () => {
  if (!svgCode.value) {
    svgInfo.value = null
    return
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, 'image/svg+xml')
    const svg = doc.querySelector('svg')

    if (svg) {
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        svgInfo.value = { error: 'SVG 解析错误' }
        return
      }

      const elements = svg.querySelectorAll('*')
      svgInfo.value = {
        width: svg.getAttribute('width') || 'auto',
        height: svg.getAttribute('height') || 'auto',
        viewBox: svg.getAttribute('viewBox') || null,
        elementCount: elements.length
      }
    }
  } catch (e) {
    svgInfo.value = { error: '解析失败' }
  }
}

const downloadSvg = () => {
  const blob = new Blob([svgCode.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'svg-preview.svg'
  a.click()
  URL.revokeObjectURL(url)
}

const copySvg = async () => {
  try {
    await navigator.clipboard.writeText(svgCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const copyAsDataUri = async () => {
  const base64 = btoa(unescape(encodeURIComponent(svgCode.value)))
  const dataUri = `data:image/svg+xml;base64,${base64}`
  try {
    await navigator.clipboard.writeText(dataUri)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.svg-preview {
  padding: 20px;
}
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.input-section textarea {
  width: 100%;
  height: 300px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}
.sample-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.sample-btn:hover {
  background: var(--border-color);
}
.preview-section,
.info-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.preview-box {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 4px;
  padding: 20px;
}
.preview-box :deep(svg) {
  max-width: 100%;
  max-height: 280px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.info-item .label {
  color: var(--text-secondary);
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.action-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.action-btn:hover {
  opacity: 0.9;
}
@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}
</style>
