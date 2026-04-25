<template>
  <div class="tool-container">
    <h1 class="title">图片 Base64 互转工具</h1>
    <p class="description">将图片转换为 Base64 编码，或将 Base64 还原为图片。</p>

    <div class="tabs">
      <button
        :class="{ active: activeTab === 'encode' }"
        @click="activeTab = 'encode'"
      >
        图片 → Base64
      </button>
      <button
        :class="{ active: activeTab === 'decode' }"
        @click="activeTab = 'decode'"
      >
        Base64 → 图片
      </button>
    </div>

    <div v-if="activeTab === 'encode'" class="tab-content">
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
            @change="handleFileSelect"
            class="file-input-hidden"
          />
          <img v-if="previewUrl" :src="previewUrl" class="preview-image" />
          <div v-else class="upload-placeholder">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              点击选择图片 或 拖拽图片到这里
            </div>
            <div class="upload-hint">支持 PNG, JPG, GIF, WebP, SVG 等格式</div>
          </div>
        </div>
        <button v-if="previewUrl" @click="clearFile" class="btn-clear">清除图片</button>
      </div>

      <div v-if="base64Result" class="result-section">
        <div class="result-header">
          <span>Base64 编码结果</span>
          <div class="result-actions">
            <span class="size-info">{{ formatSize(originalSize) }} → {{ formatSize(base64Size) }}</span>
            <button @click="copyBase64" class="btn-small">复制</button>
          </div>
        </div>
        <textarea
          :value="base64Result"
          class="result-textarea"
          readonly
        ></textarea>
        <div class="result-preview">
          <img :src="base64Result" class="preview-thumb" />
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'decode'" class="tab-content">
      <div class="form-group">
        <label>粘贴 Base64 编码：</label>
        <textarea
          v-model="base64Input"
          class="text-input"
          placeholder="粘贴 Base64 编码字符串..."
        ></textarea>
      </div>

      <div class="controls">
        <div class="form-group">
          <label>图片格式：</label>
          <select v-model="imageType" class="select-input">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/gif">GIF</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <button @click="decodeBase64" class="btn-primary">解码为图片</button>
      </div>

      <div v-if="decodedImage" class="result-section">
        <div class="result-header">
          <span>解码结果</span>
          <button @click="downloadImage" class="btn-small">下载图片</button>
        </div>
        <div class="decoded-preview">
          <img :src="decodedImage" class="decoded-image" />
        </div>
      </div>

      <div v-if="decodeError" class="error-message">
        {{ decodeError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('encode')
const fileInput = ref(null)
const previewUrl = ref('')
const originalFile = ref(null)
const base64Result = ref('')
const originalSize = ref(0)
const base64Size = ref(0)

const base64Input = ref('')
const imageType = ref('image/png')
const decodedImage = ref('')
const decodeError = ref('')

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function onDragOver(event) {
  event.currentTarget.classList.add('drag-over')
}

function onDragLeave(event) {
  event.currentTarget.classList.remove('drag-over')
}

function onDrop(event) {
  event.currentTarget.classList.remove('drag-over')
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file) {
  originalFile.value = file
  originalSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    base64Result.value = e.target.result
    base64Size.value = e.target.result.length
  }
  reader.readAsDataURL(file)
}

function clearFile() {
  originalFile.value = null
  previewUrl.value = ''
  base64Result.value = ''
  originalSize.value = 0
  base64Size.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function copyBase64() {
  navigator.clipboard.writeText(base64Result.value)
}

function decodeBase64() {
  decodeError.value = ''
  decodedImage.value = ''

  if (!base64Input.value.trim()) {
    decodeError.value = '请输入 Base64 编码字符串'
    return
  }

  try {
    let base64 = base64Input.value.trim()

    const dataUrlMatch = base64.match(/^data:([^;]+);base64,(.+)$/)
    if (dataUrlMatch) {
      decodedImage.value = base64
      return
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(base64)) {
      throw new Error('无效的 Base64 字符')
    }

    const padding = base64.length % 4
    if (padding) {
      base64 += '='.repeat(4 - padding)
    }

    const mimeType = imageType.value
    decodedImage.value = `data:${mimeType};base64,${base64}`
  } catch (e) {
    decodeError.value = `解码失败: ${e.message}`
  }
}

function downloadImage() {
  if (!decodedImage.value) return

  const link = document.createElement('a')
  link.download = `decoded_image.${imageType.value.split('/')[1]}`
  link.href = decodedImage.value
  link.click()
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
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.tabs button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.tabs button.active {
  background: #2563eb;
  color: white;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #f8f9fa;
}

.upload-area.drag-over {
  border-color: #2563eb;
  background: #e8f0fe;
}

.upload-area.has-file {
  padding: 1rem;
}

.file-input-hidden {
  display: none;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.85rem;
  color: #999;
}

.btn-clear {
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  font-size: 0.95rem;
}

.result-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.size-info {
  font-size: 0.85rem;
  color: #666;
}

.result-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  resize: vertical;
  box-sizing: border-box;
}

.result-preview {
  margin-top: 1rem;
  text-align: center;
}

.preview-thumb {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  border: 1px solid #ddd;
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
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.controls .form-group {
  flex: 1;
  margin-bottom: 0;
}

.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-small {
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #ddd;
}

.btn-small:hover {
  background: #f0f0f0;
}

.decoded-preview {
  margin-top: 1rem;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.decoded-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  text-align: center;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .tabs {
  background: #404040;
}

.dark .tabs button:not(.active) {
  color: #a3a3a3;
}

.dark .upload-area {
  border-color: #404040;
  background: #262626;
}

.dark .upload-area:hover {
  border-color: #60a5fa;
  background: #1a1a1a;
}

.dark .upload-placeholder {
  color: #a3a3a3;
}

.dark .result-section {
  background: #262626;
}

.dark .result-textarea {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .decoded-preview {
  background: #1a1a1a;
}

.dark .btn-small {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-small:hover {
  background: #404040;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}
</style>
