<template>
  <div class="qrcode-generator">
    <h2>二维码生成器</h2>
    <p class="subtitle">生成二维码，支持自定义尺寸、颜色和纠错级别</p>

    <div class="generator-container">
      <div class="input-section">
        <div class="form-group">
          <label>内容</label>
          <textarea
            v-model="content"
            placeholder="输入二维码内容（URL、文本、联系方式等）"
            @input="generateQR"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>尺寸 (px)</label>
            <input
              v-model.number="size"
              type="number"
              min="100"
              max="1000"
              @input="generateQR"
            />
          </div>
          <div class="form-group">
            <label>纠错级别</label>
            <select v-model="errorCorrectionLevel" @change="generateQR">
              <option value="L">低 (7%)</option>
              <option value="M">中 (15%)</option>
              <option value="Q">高 (25%)</option>
              <option value="H">最高 (30%)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>前景色</label>
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
            <label>背景色</label>
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
          <label>Logo (可选)</label>
          <input
            type="file"
            accept="image/*"
            @change="handleLogoUpload"
          />
          <div v-if="logoData" class="logo-preview">
            <img :src="logoData" alt="Logo" />
            <button @click="removeLogo" class="remove-btn">移除</button>
          </div>
        </div>

        <button @click="generateQR" class="generate-btn">生成二维码</button>
      </div>

      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-container" :style="{ backgroundColor: bgColor }">
          <canvas ref="qrCanvas"></canvas>
        </div>

        <div class="preview-info" v-if="content">
          <p>内容: {{ content.substring(0, 50) }}{{ content.length > 50 ? '...' : '' }}</p>
          <p class="qr-version">版本: {{ qrVersion }}</p>
        </div>

        <div class="action-buttons">
          <button @click="downloadQR('png')" class="action-btn primary" :disabled="!content">
            下载 PNG
          </button>
          <button @click="downloadQR('svg')" class="action-btn" :disabled="!content">
            下载 SVG
          </button>
          <button @click="copyToClipboard" class="action-btn" :disabled="!content">
            {{ copied ? '已复制!' : '复制图片' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const content = ref('')
const size = ref(256)
const errorCorrectionLevel = ref('M')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const logoData = ref(null)
const qrCanvas = ref(null)
const copied = ref(false)
const qrVersion = ref('-')

const generateQR = async () => {
  if (!content.value || !qrCanvas.value) {
    return
  }

  try {
    const options = {
      width: size.value,
      height: size.value,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      errorCorrectionLevel: errorCorrectionLevel.value,
      margin: 2,
      version: 10
    }

    await QRCode.toCanvas(qrCanvas.value, content.value, options)

    if (logoData.value) {
      const ctx = qrCanvas.value.getContext('2d')
      const logoSize = size.value * 0.2
      const logoX = (size.value - logoSize) / 2
      const logoY = (size.value - logoSize) / 2

      ctx.fillStyle = bgColor.value
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)

      const img = new Image()
      img.src = logoData.value
      await new Promise((resolve) => {
        img.onload = resolve
      })
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
    }

    const estimatedVersion = QRCode.__proto__.generate
      ? '自动'
      : Math.ceil(content.value.length / 40) + 1
    qrVersion.value = estimatedVersion <= 40 ? estimatedVersion : '40+'

  } catch (error) {
    console.error('生成二维码失败:', error)
  }
}

const handleLogoUpload = (event) => {
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

const removeLogo = () => {
  logoData.value = null
  generateQR()
}

const downloadQR = async (format) => {
  if (!content.value) return

  try {
    if (format === 'svg') {
      const svgString = await QRCode.toString(content.value, {
        type: 'svg',
        width: size.value,
        color: {
          dark: fgColor.value,
          light: bgColor.value
        },
        errorCorrectionLevel: errorCorrectionLevel.value
      })

      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qrcode-${Date.now()}.svg`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const dataUrl = qrCanvas.value.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `qrcode-${Date.now()}.png`
      a.click()
    }
  } catch (error) {
    console.error('下载失败:', error)
  }
}

const copyToClipboard = async () => {
  if (!qrCanvas.value) return

  try {
    const blob = await new Promise(resolve => qrCanvas.value.toBlob(resolve))
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

onMounted(() => {
  if (content.value) {
    generateQR()
  }
})
</script>

<style scoped>
.qrcode-generator {
  padding: 20px;
}
.subtitle {
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 20px;
}
.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.input-section,
.preview-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.form-group textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.form-group input[type="number"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.color-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
.color-input {
  width: 50px;
  height: 40px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.color-text {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
}
.form-group input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
}
.logo-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.logo-preview img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.remove-btn {
  padding: 5px 10px;
  background: #fee2e2;
  border: none;
  border-radius: 4px;
  color: #991b1b;
  cursor: pointer;
}
.generate-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.generate-btn:hover {
  opacity: 0.9;
}
.preview-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  min-height: 300px;
}
.preview-container canvas {
  max-width: 100%;
  height: auto;
}
.preview-info {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}
.preview-info p {
  margin: 5px 0;
}
.qr-version {
  color: var(--primary-color);
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.action-btn.primary {
  background: var(--primary-color);
  color: white;
  border: none;
}
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
@media (max-width: 768px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
}
</style>
