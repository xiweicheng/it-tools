<template>
  <div class="favicon-generator">
    <h2>Favicon 生成器</h2>

    <div class="generator-container">
      <div class="input-section">
        <h3>配置</h3>
        <div class="control-group">
          <label>输入文字或选择图标</label>
          <input type="text" v-model="text" maxlength="2" placeholder="最多2个字符" @input="generateFavicon" />
        </div>

        <div class="control-group">
          <label>背景颜色</label>
          <div class="color-input">
            <input type="color" v-model="bgColor" @input="generateFavicon" />
            <input type="text" v-model="bgColor" @input="generateFavicon" />
          </div>
        </div>

        <div class="control-group">
          <label>文字颜色</label>
          <div class="color-input">
            <input type="color" v-model="textColor" @input="generateFavicon" />
            <input type="text" v-model="textColor" @input="generateFavicon" />
          </div>
        </div>

        <div class="control-group">
          <label>字体</label>
          <select v-model="fontFamily" @change="generateFavicon">
            <option value="Arial, sans-serif">Arial</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Courier New, monospace">Courier New</option>
          </select>
        </div>

        <div class="control-group">
          <label>形状</label>
          <div class="shape-options">
            <button :class="{ active: shape === 'circle' }" @click="shape = 'circle'; generateFavicon()">圆形</button>
            <button :class="{ active: shape === 'square' }" @click="shape = 'square'; generateFavicon()">方形</button>
            <button :class="{ active: shape === 'rounded' }" @click="shape = 'rounded'; generateFavicon()">圆角</button>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-list">
          <div class="preview-item">
            <canvas ref="canvas16" width="16" height="16"></canvas>
            <span>16x16</span>
          </div>
          <div class="preview-item">
            <canvas ref="canvas32" width="32" height="32"></canvas>
            <span>32x32</span>
          </div>
          <div class="preview-item">
            <canvas ref="canvas48" width="48" height="48"></canvas>
            <span>48x48</span>
          </div>
          <div class="preview-item large">
            <canvas ref="canvas128" width="128" height="128"></canvas>
            <span>128x128</span>
          </div>
        </div>

        <div class="main-preview">
          <canvas ref="mainCanvas" width="128" height="128"></canvas>
        </div>
      </div>

      <div class="output-section">
        <h3>输出</h3>
        <div class="output-tabs">
          <button :class="{ active: outputFormat === 'png' }" @click="outputFormat = 'png'">PNG</button>
          <button :class="{ active: outputFormat === 'ico' }" @click="outputFormat = 'ico'">ICO</button>
          <button :class="{ active: outputFormat === 'svg' }" @click="outputFormat = 'svg'">SVG</button>
        </div>

        <div class="output-content">
          <textarea v-if="outputFormat === 'png'" v-model="pngOutput" readonly></textarea>
          <textarea v-else-if="outputFormat === 'svg'" v-model="svgOutput" readonly></textarea>
          <div v-else class="ico-info">
            <p>ICO 格式需要下载使用</p>
            <p>浏览器无法直接显示 ICO 文本格式</p>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="downloadFavicon" class="download-btn">下载 {{ outputFormat.toUpperCase() }}</button>
          <button @click="copyOutput" class="copy-btn">{{ copied ? '已复制!' : '复制' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const text = ref('IT')
const bgColor = ref('#4CAF50')
const textColor = ref('#FFFFFF')
const fontFamily = ref('Arial, sans-serif')
const shape = ref('circle')
const outputFormat = ref('png')
const copied = ref(false)

const canvas16 = ref(null)
const canvas32 = ref(null)
const canvas48 = ref(null)
const canvas128 = ref(null)
const mainCanvas = ref(null)

const pngOutput = ref('')
const svgOutput = ref('')

const drawFavicon = (canvas, size) => {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  ctx.scale(dpr, dpr)

  ctx.fillStyle = bgColor.value
  if (shape.value === 'circle') {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()
  } else if (shape.value === 'rounded') {
    const radius = size * 0.15
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.fillRect(0, 0, size, size)
  }

  const fontSize = size * 0.5
  ctx.fillStyle = textColor.value
  ctx.font = `bold ${fontSize}px ${fontFamily.value}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.value || '?', size / 2, size / 2 + size * 0.05)
}

const generateFavicon = () => {
  if (!text.value && outputFormat.value === 'png') return

  drawFavicon(canvas16.value, 16)
  drawFavicon(canvas32.value, 32)
  drawFavicon(canvas48.value, 48)
  drawFavicon(canvas128.value, 128)
  drawFavicon(mainCanvas.value, 128)

  if (canvas128.value) {
    pngOutput.value = canvas128.value.toDataURL('image/png')
  }

  svgOutput.value = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="${shape.value === 'rounded' ? 20 : shape.value === 'circle' ? 64 : 0}" fill="${bgColor.value}"/>
  <text x="64" y="74" font-family="${fontFamily.value}" font-size="64" font-weight="bold" fill="${textColor.value}" text-anchor="middle">${text.value || '?'}</text>
</svg>`
}

const downloadFavicon = () => {
  if (outputFormat.value === 'svg') {
    const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favicon.svg'
    a.click()
    URL.revokeObjectURL(url)
  } else if (outputFormat.value === 'png') {
    const link = document.createElement('a')
    link.download = 'favicon.png'
    link.href = canvas128.value.toDataURL('image/png')
    link.click()
  } else {
    const sizes = [16, 32, 48, 128]
    const canvases = [canvas16.value, canvas32.value, canvas48.value, canvas128.value]
    const icoData = createIco(canvases, sizes)
    const blob = new Blob([icoData], { type: 'image/x-icon' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favicon.ico'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const createIco = (canvases, sizes) => {
  const numImages = canvases.length
  const headerSize = 6 + numImages * 16
  let offset = headerSize
  const entries = []
  const imageData = []

  canvases.forEach((canvas, i) => {
    const ctx = canvas.getContext('2d')
    const imageBytes = ctx.getImageData(0, 0, sizes[i], sizes[i]).data
    const size = sizes[i]
    const andMaskSize = Math.ceil(size / 8) * size
    const totalBytes = 40 + size * size * 4 + andMaskSize

    const bmpHeader = new ArrayBuffer(40)
    const bmpView = new DataView(bmpHeader)
    bmpView.setUint32(0, 40, true)
    bmpView.setInt32(4, size, true)
    bmpView.setInt32(8, size * 2, true)
    bmpView.setUint16(12, 1, true)
    bmpView.setUint16(14, 32, true)
    bmpView.setUint32(16, 0, true)
    bmpView.setUint32(20, totalBytes - 40, true)
    bmpView.setInt32(24, 0, true)
    bmpView.setInt32(28, 0, true)
    bmpView.setUint32(32, 0, true)
    bmpView.setUint32(36, 0, true)

    const pixelData = new Uint8Array(size * size * 4)
    for (let j = 0; j < imageBytes.length; j += 4) {
      pixelData[j] = imageBytes[j + 2]
      pixelData[j + 1] = imageBytes[j + 1]
      pixelData[j + 2] = imageBytes[j]
      pixelData[j + 3] = imageBytes[j + 3]
    }

    const andMask = new Uint8Array(andMaskSize)
    imageData.push(new Uint8Array([...new Uint8Array(bmpHeader), ...pixelData, ...andMask]))

    entries.push({
      width: size >= 256 ? 0 : size,
      height: size >= 256 ? 0 : size,
      colors: 0,
      reserved: 0,
      planes: 1,
      bitCount: 32,
      bytesInRes: totalBytes,
      imageOffset: offset
    })
    offset += totalBytes
  })

  const header = new ArrayBuffer(6 + numImages * 16)
  const headerView = new DataView(header)
  headerView.setUint16(0, 0, true)
  headerView.setUint16(2, 1, true)
  headerView.setUint16(4, numImages, true)

  entries.forEach((entry, i) => {
    const pos = 6 + i * 16
    headerView.setUint8(pos, entry.width)
    headerView.setUint8(pos + 1, entry.height)
    headerView.setUint8(pos + 2, entry.colors)
    headerView.setUint8(pos + 3, entry.reserved)
    headerView.setUint16(pos + 4, entry.planes, true)
    headerView.setUint16(pos + 6, entry.bitCount, true)
    headerView.setUint32(pos + 8, entry.bytesInRes, true)
    headerView.setUint32(pos + 12, entry.imageOffset, true)
  })

  const result = new Uint8Array(header.byteLength + imageData.reduce((a, b) => a + b.byteLength, 0))
  let pos = 0
  result.set(new Uint8Array(header), pos)
  pos += header.byteLength
  imageData.forEach(data => {
    result.set(data, pos)
    pos += data.byteLength
  })

  return result
}

const copyOutput = async () => {
  try {
    if (outputFormat.value === 'png') {
      await navigator.clipboard.writeText(pngOutput.value)
    } else {
      await navigator.clipboard.writeText(svgOutput.value)
    }
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

onMounted(() => {
  generateFavicon()
})
</script>

<style scoped>
.favicon-generator {
  padding: 20px;
}
.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
.input-section,
.preview-section,
.output-section {
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
.control-group input[type="text"],
.control-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.color-input {
  display: flex;
  gap: 10px;
}
.color-input input[type="color"] {
  width: 50px;
  height: 38px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.color-input input[type="text"] {
  flex: 1;
}
.shape-options {
  display: flex;
  gap: 10px;
}
.shape-options button {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.shape-options button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.preview-list {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.preview-item {
  text-align: center;
}
.preview-item canvas {
  background: var(--bg-secondary);
  border-radius: 4px;
}
.preview-item span {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: var(--text-secondary);
}
.main-preview {
  display: flex;
  justify-content: center;
}
.main-preview canvas {
  background: var(--bg-secondary);
  border-radius: 8px;
}
.output-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.output-tabs button {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.output-tabs button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.output-content textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}
.ico-info {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 4px;
  text-align: center;
  color: var(--text-secondary);
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.download-btn {
  flex: 2;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-btn {
  flex: 1;
  padding: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
@media (max-width: 1024px) {
  .generator-container {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
}
</style>
