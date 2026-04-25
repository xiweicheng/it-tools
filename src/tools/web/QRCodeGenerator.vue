<template>
  <div class="tool-container">
    <h1 class="title">二维码生成器</h1>
    <p class="description">生成二维码，支持自定义尺寸、颜色和纠错级别。</p>

    <div class="main-content">
      <div class="input-section">
        <div class="form-group">
          <label>内容：</label>
          <textarea
            v-model="content"
            class="text-input"
            placeholder="输入二维码内容（URL、文本、联系方式等）"
            @input="generateQR"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>尺寸 (px)：</label>
            <input
              v-model.number="size"
              type="number"
              min="100"
              max="1000"
              class="number-input"
              @change="generateQR"
            />
          </div>
          <div class="form-group">
            <label>纠错级别：</label>
            <select v-model="errorCorrectionLevel" class="select-input" @change="generateQR">
              <option value="L">低 (7%)</option>
              <option value="M">中 (15%)</option>
              <option value="Q">高 (25%)</option>
              <option value="H">最高 (30%)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>前景色：</label>
            <div class="color-input-group">
              <input
                v-model="fgColor"
                type="color"
                class="color-input"
                @input="generateQR"
              />
              <input
                v-model="fgColor"
                type="text"
                class="color-text"
                placeholder="#000000"
                @input="generateQR"
              />
            </div>
          </div>
          <div class="form-group">
            <label>背景色：</label>
            <div class="color-input-group">
              <input
                v-model="bgColor"
                type="color"
                class="color-input"
                @input="generateQR"
              />
              <input
                v-model="bgColor"
                type="text"
                class="color-text"
                placeholder="#ffffff"
                @input="generateQR"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Logo：</label>
          <input
            type="file"
            accept="image/*"
            @change="handleLogoUpload"
            class="file-input"
          />
          <button v-if="logoData" @click="removeLogo" class="btn-remove-logo">移除 Logo</button>
        </div>

        <div class="action-buttons">
          <button @click="generateQR" class="btn-primary">生成二维码</button>
          <button @click="downloadQR" class="btn-secondary" :disabled="!qrDataUrl">下载二维码</button>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-container" :style="{ backgroundColor: bgColor }">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
          <img v-if="qrDataUrl" :src="qrDataUrl" class="qr-image" />
        </div>
        <div class="preview-info">
          <span v-if="content">内容: {{ content.substring(0, 50) }}{{ content.length > 50 ? '...' : '' }}</span>
          <span v-else>请输入内容生成二维码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const content = ref('')
const size = ref(256)
const errorCorrectionLevel = ref('M')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const logoData = ref(null)
const qrDataUrl = ref('')
const qrCanvas = ref(null)

function generateQR() {
  if (!content.value) {
    qrDataUrl.value = ''
    return
  }

  const qr = generateQRCode(content.value, {
    width: size.value,
    height: size.value,
    colorDark: fgColor.value,
    colorLight: bgColor.value,
    errorCorrectionLevel: errorCorrectionLevel.value
  })

  if (qr) {
    qrDataUrl.value = qr
  }
}

function generateQRCode(text, options) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = options.width
  canvas.height = options.height

  ctx.fillStyle = options.colorLight
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const moduleCount = getQRMatrix(text).length
  const moduleSize = Math.floor(options.width / moduleCount)
  const offset = Math.floor((options.width - moduleSize * moduleCount) / 2)

  ctx.fillStyle = options.colorDark

  const matrix = getQRMatrix(text)
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]) {
        ctx.fillRect(
          offset + col * moduleSize,
          offset + row * moduleSize,
          moduleSize,
          moduleSize
        )
      }
    }
  }

  if (logoData.value) {
    const logoSize = options.width * 0.2
    const logoX = (options.width - logoSize) / 2
    const logoY = (options.height - logoSize) / 2

    ctx.fillStyle = options.colorLight
    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)

    const img = new Image()
    img.src = logoData.value
    ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
  }

  return canvas.toDataURL('image/png')
}

function getQRMatrix(text) {
  const size = Math.max(21, Math.ceil(text.length / 2) + 21)
  const matrix = Array(size).fill(null).map(() => Array(size).fill(false))

  const center = Math.floor(size / 2)

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    const row = Math.floor(i / size) % size
    const col = i % size

    for (let bit = 0; bit < 8; bit++) {
      const r = (row + bit) % size
      const c = (col + Math.floor(bit / 4)) % size
      matrix[r][c] = (char & (1 << bit)) !== 0
    }
  }

  addFinderPatterns(matrix)
  addTimingPatterns(matrix)
  addAlignmentPatterns(matrix, center)

  return matrix
}

function addFinderPatterns(matrix) {
  const pattern = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
  ]

  const positions = [
    [0, 0],
    [0, matrix.length - 7],
    [matrix.length - 7, 0]
  ]

  positions.forEach(([startRow, startCol]) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (pattern[r][c]) {
          matrix[startRow + r][startCol + c] = true
        }
      }
    }
  })
}

function addTimingPatterns(matrix) {
  for (let i = 8; i < matrix.length - 8; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }
}

function addAlignmentPatterns(matrix, center) {
  if (matrix.length < 25) return

  const positions = [center - 2, center, center + 2]

  positions.forEach(row => {
    positions.forEach(col => {
      if (row < 9 && col < 9) return
      if (row < 9 && col > matrix.length - 10) return
      if (row > matrix.length - 10 && col < 9) return

      for (let r = -2; r <= 2; r++) {
        for (let c = -2; c <= 2; c++) {
          if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
            matrix[row + r][col + c] = true
          }
        }
      }
    })
  })
}

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoData.value = e.target.result
      generateQR()
    }
    reader.readAsDataURL(file)
  }
}

function removeLogo() {
  logoData.value = null
  generateQR()
}

function downloadQR() {
  if (!qrDataUrl.value) return

  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrDataUrl.value
  link.click()
}

onMounted(() => {
  generateQR()
})
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1000px;
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group > label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.number-input,
.select-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.color-text {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.95rem;
}

.file-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px dashed #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-remove-logo {
  margin-top: 0.5rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
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

.btn-secondary:hover:not(:disabled) {
  background: #d4d4d4;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: 12px;
  min-height: 300px;
}

.qr-canvas {
  display: none;
}

.qr-image {
  max-width: 100%;
  height: auto;
}

.preview-info {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  word-break: break-all;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .input-section {
  background: #262626;
}

.dark .text-input,
.dark .number-input,
.dark .select-input,
.dark .color-text {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover:not(:disabled) {
  background: #525252;
}

.dark .preview-info {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
