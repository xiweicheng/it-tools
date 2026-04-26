<template>
  <div class="tool-container">
    <h1 class="title">图片压缩工具</h1>
    <p class="description">压缩图片文件大小，支持 JPG、PNG、GIF 等格式，保持画质可调。</p>

    <div class="compressor-card">
      <div class="upload-section">
        <div
          class="upload-area"
          :class="{ 'has-file': previewUrl }"
          @click="triggerFileInput"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileSelect"
            hidden
          />
          <div v-if="!previewUrl" class="upload-placeholder">
            <div class="upload-icon">📁</div>
            <p>点击或拖拽图片到此处</p>
            <p class="upload-hint">支持 JPG、PNG、GIF 格式</p>
          </div>
          <img v-else :src="previewUrl" class="preview-image" alt="Preview" />
        </div>
      </div>

      <div v-if="originalFile" class="file-info">
        <div class="info-item">
          <span class="info-label">文件名:</span>
          <span class="info-value">{{ originalFile.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">原始大小:</span>
          <span class="info-value">{{ formatFileSize(originalSize) }}</span>
        </div>
      </div>

      <div class="controls-section">
        <div class="form-group">
          <label>压缩质量: {{ quality }}%</label>
          <input
            v-model.number="quality"
            type="range"
            min="10"
            max="100"
            class="range-input"
          />
        </div>

        <div class="format-section">
          <label>输出格式:</label>
          <div class="format-buttons">
            <button
              :class="{ active: outputFormat === 'jpeg' }"
              @click="outputFormat = 'jpeg'"
            >
              JPEG
            </button>
            <button
              :class="{ active: outputFormat === 'png' }"
              @click="outputFormat = 'png'"
            >
              PNG
            </button>
            <button
              :class="{ active: outputFormat === 'webp' }"
              @click="outputFormat = 'webp'"
            >
              WebP
            </button>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="compressImage" class="btn-primary" :disabled="!originalFile || compressing">
          {{ compressing ? '压缩中...' : '压缩图片' }}
        </button>
        <button @click="downloadImage" class="btn-secondary" :disabled="!compressedBlob">
          下载图片
        </button>
        <button @click="resetAll" class="btn-secondary">
          重置
        </button>
      </div>

      <div v-if="compressedBlob" class="result-section">
        <h3>压缩结果</h3>
        <div class="result-info">
          <div class="result-preview">
            <img :src="compressedUrl" alt="Compressed" />
          </div>
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">原始大小</span>
              <span class="stat-value">{{ formatFileSize(originalSize) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">压缩后</span>
              <span class="stat-value">{{ formatFileSize(compressedSize) }}</span>
            </div>
            <div class="stat-item highlight">
              <span class="stat-label">节省</span>
              <span class="stat-value">{{ savedPercentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const fileInput = ref(null)
const originalFile = ref(null)
const originalSize = ref(0)
const previewUrl = ref('')
const quality = ref(80)
const outputFormat = ref('jpeg')
const compressing = ref(false)
const compressedBlob = ref(null)
const compressedSize = ref(0)

const compressedUrl = computed(() => {
  return compressedBlob.value ? URL.createObjectURL(compressedBlob.value) : ''
})

const savedPercentage = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    loadFile(file)
  }
}

function onDragOver(event) {
  event.target.closest('.upload-area').classList.add('drag-over')
}

function onDragLeave(event) {
  event.target.closest('.upload-area').classList.remove('drag-over')
}

function onDrop(event) {
  event.target.closest('.upload-area').classList.remove('drag-over')
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadFile(file)
  }
}

function loadFile(file) {
  originalFile.value = file
  originalSize.value = file.size
  compressedBlob.value = null
  compressedSize.value = 0

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

async function compressImage() {
  if (!originalFile.value) return

  compressing.value = true

  try {
    const img = new Image()
    img.src = previewUrl.value

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

    const mimeType = `image/${outputFormat.value}`
    const qualityValue = outputFormat.value === 'png' ? undefined : quality.value / 100

    canvas.toBlob(
      (blob) => {
        compressedBlob.value = blob
        compressedSize.value = blob.size
        compressing.value = false
      },
      mimeType,
      qualityValue
    )
  } catch (error) {
    console.error('Compression error:', error)
    compressing.value = false
  }
}

function downloadImage() {
  if (!compressedBlob.value) return

  const link = document.createElement('a')
  const extension = outputFormat.value === 'jpeg' ? 'jpg' : outputFormat.value
  link.download = `compressed_${originalFile.value.name.replace(/\.[^.]+$/, `.${extension}`)}`
  link.href = compressedUrl.value
  link.click()
}

function resetAll() {
  originalFile.value = null
  originalSize.value = 0
  previewUrl.value = ''
  compressedBlob.value = null
  compressedSize.value = 0
  quality.value = 80
  outputFormat.value = 'jpeg'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 800px;
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

.compressor-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #f8f9ff;
}

.upload-area.has-file {
  padding: 1rem;
  border-style: solid;
  border-color: #10b981;
}

.upload-area.drag-over {
  border-color: #2563eb;
  background: #e3f2fd;
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-hint {
  font-size: 0.85rem;
  color: #999;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.file-info {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
}

.controls-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.range-input {
  width: 100%;
}

.format-section {
  margin-top: 1rem;
}

.format-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.format-buttons {
  display: flex;
  gap: 0.5rem;
}

.format-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.format-buttons button:hover {
  border-color: #2563eb;
}

.format-buttons button.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 1rem;
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

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d4d4d4;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

.result-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.result-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.result-preview img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #eee;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
}

.stat-item.highlight {
  background: #dcfce7;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
}

.stat-item.highlight .stat-value {
  color: #10b981;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .compressor-card {
  background: #262626;
}

.dark .upload-area {
  border-color: #404040;
  background: #1a1a1a;
}

.dark .upload-area:hover {
  background: #1e3a8a;
}

.dark .upload-placeholder {
  color: #a3a3a3;
}

.dark .file-info,
.dark .controls-section,
.dark .stat-item {
  background: #1a1a1a;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover:not(:disabled) {
  background: #525252;
}

@media (max-width: 768px) {
  .result-info {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
