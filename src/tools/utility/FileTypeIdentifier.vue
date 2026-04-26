<template>
  <div class="tool-container">
    <h1 class="title">文件类型识别器</h1>
    <p class="description">通过文件内容识别文件格式，如 PDF、MP4 等。</p>

    <div class="identifier-card">
      <div class="upload-section">
        <div
          class="drop-zone"
          :class="{ 'dragover': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            style="display: none"
          />
          <div class="drop-content">
            <span class="drop-icon">📁</span>
            <p class="drop-text">拖放文件到这里，或点击选择文件</p>
            <p class="drop-hint">支持任何类型的文件</p>
          </div>
        </div>
      </div>

      <div v-if="result" class="result-section">
        <div class="file-icon" :class="result.category">
          {{ getFileIcon(result.type) }}
        </div>

        <div class="file-info">
          <h3>{{ result.fileName }}</h3>
          <p class="file-size">{{ formatFileSize(result.fileSize) }}</p>
        </div>

        <div class="detection-results">
          <div class="result-item primary">
            <span class="result-label">检测到的类型</span>
            <span class="result-value">{{ result.type }}</span>
            <span class="result-extension">{{ result.extension }}</span>
          </div>

          <div class="result-item">
            <span class="result-label">文件类别</span>
            <span class="result-value">{{ result.category }}</span>
          </div>

          <div class="result-item">
            <span class="result-label">MIME 类型</span>
            <span class="result-value">{{ result.mimeType }}</span>
          </div>

          <div class="result-item">
            <span class="result-label">编码格式</span>
            <span class="result-value">{{ result.encoding }}</span>
          </div>
        </div>

        <div class="hex-preview">
          <h4>文件头 (Hex)</h4>
          <div class="hex-grid">
            <div
              v-for="(byte, index) in result.headerBytes"
              :key="index"
              class="hex-byte"
              :class="{ 'magic-byte': result.magicBytes.includes(index) }"
            >
              {{ byte }}
            </div>
          </div>
          <p class="hex-note">红色高亮部分为魔数字节，用于识别文件类型</p>
        </div>

        <div class="raw-content" v-if="result.rawText">
          <h4>文本预览</h4>
          <pre>{{ result.rawText }}</pre>
        </div>
      </div>

      <div class="magic-numbers">
        <h3>常见文件魔数</h3>
        <div class="magic-grid">
          <div class="magic-item">
            <code>89 50 4E 47</code>
            <span>PNG</span>
          </div>
          <div class="magic-item">
            <code>FF D8 FF</code>
            <span>JPEG</span>
          </div>
          <div class="magic-item">
            <code>25 50 44 46</code>
            <span>PDF</span>
          </div>
          <div class="magic-item">
            <code>47 49 46 38</code>
            <span>GIF</span>
          </div>
          <div class="magic-item">
            <code>49 44 33</code>
            <span>MP3</span>
          </div>
          <div class="magic-item">
            <code>1F 8B</code>
            <span>GZIP</span>
          </div>
          <div class="magic-item">
            <code>50 4B 03 04</code>
            <span>ZIP</span>
          </div>
          <div class="magic-item">
            <code>52 49 46 46 ... 57 41 56 45</code>
            <span>WAV</span>
          </div>
          <div class="magic-item">
            <code>00 00 00 ... 66 74 79 70</code>
            <span>MP4</span>
          </div>
          <div class="magic-item">
            <code>25 21 50 53</code>
            <span>PostScript</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const isDragging = ref(false)
const result = ref(null)

const magicNumbers = {
  'PNG': { header: [0x89, 0x50, 0x4E, 0x47], extension: '.png', mime: 'image/png', category: '图片' },
  'JPEG': { header: [0xFF, 0xD8, 0xFF], extension: '.jpg', mime: 'image/jpeg', category: '图片' },
  'GIF87a': { header: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], extension: '.gif', mime: 'image/gif', category: '图片' },
  'GIF89a': { header: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], extension: '.gif', mime: 'image/gif', category: '图片' },
  'PDF': { header: [0x25, 0x50, 0x44, 0x46], extension: '.pdf', mime: 'application/pdf', category: '文档' },
  'ZIP': { header: [0x50, 0x4B, 0x03, 0x04], extension: '.zip', mime: 'application/zip', category: '压缩文件' },
  'MP3': { header: [0x49, 0x44, 0x33], extension: '.mp3', mime: 'audio/mpeg', category: '音频' },
  'MP4': { header: [0x00, 0x00, 0x00], extension: '.mp4', mime: 'video/mp4', category: '视频' },
  'WAV': { header: [0x52, 0x49, 0x46, 0x46], extension: '.wav', mime: 'audio/wav', category: '音频' },
  'GZIP': { header: [0x1F, 0x8B], extension: '.gz', mime: 'application/gzip', category: '压缩文件' },
  'PostScript': { header: [0x25, 0x21, 0x50, 0x53], extension: '.ps', mime: 'application/postscript', category: '文档' },
  '7z': { header: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], extension: '.7z', mime: 'application/x-7z-compressed', category: '压缩文件' },
  'RAR': { header: [0x52, 0x61, 0x72, 0x21], extension: '.rar', mime: 'application/vnd.rar', category: '压缩文件' },
  'BMP': { header: [0x42, 0x4D], extension: '.bmp', mime: 'image/bmp', category: '图片' },
  'ICO': { header: [0x00, 0x00, 0x01, 0x00], extension: '.ico', mime: 'image/x-icon', category: '图片' },
  'WebP': { header: [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50], extension: '.webp', mime: 'image/webp', category: '图片' },
  'TXT': { header: null, extension: '.txt', mime: 'text/plain', category: '文本', text: true }
}

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    identifyFile(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    identifyFile(file)
  }
}

function identifyFile(file) {
  const reader = new FileReader()

  reader.onload = (e) => {
    const buffer = e.target.result
    const bytes = new Uint8Array(buffer)
    const headerBytes = Array.from(bytes.slice(0, 16)).map(b => b.toString(16).toUpperCase().padStart(2, '0'))

    let detectedType = '未知'
    let extension = ''
    let mimeType = 'application/octet-stream'
    let category = '未知'
    let magicBytes = []
    let encoding = '二进制'
    let rawText = ''

    for (const [type, info] of Object.entries(magicNumbers)) {
      if (info.text) {
        try {
          const decoder = new TextDecoder('utf-8')
          const text = decoder.decode(bytes.slice(0, 100))
          if (/^[A-Za-z0-9\s.,;:'"()\-+*/=<>[\]{}|\\`~!@#$%^&*?_ \n\r\t]+$/.test(text)) {
            detectedType = '纯文本'
            extension = '.txt'
            mimeType = 'text/plain'
            category = '文本'
            encoding = 'UTF-8'
            rawText = text.substring(0, 200)
            break
          }
        } catch {}
        continue
      }

      if (info.header) {
        let match = true
        let firstMagicIndex = -1

        for (let i = 0; i < info.header.length; i++) {
          if (info.header[i] !== null && bytes[i] !== info.header[i]) {
            match = false
            break
          }
          if (info.header[i] !== null && firstMagicIndex === -1) {
            firstMagicIndex = i
          }
        }

        if (match) {
          detectedType = type
          extension = info.extension
          mimeType = info.mime
          category = info.category
          magicBytes = info.header.map((b, i) => b !== null ? i : -1).filter(i => i !== -1)
          break
        }
      }
    }

    if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
      encoding = 'UTF-16 LE (小端序)'
    } else if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
      encoding = 'UTF-16 BE (大端序)'
    } else if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
      encoding = 'UTF-8 with BOM'
    }

    result.value = {
      fileName: file.name,
      fileSize: file.size,
      type: detectedType,
      extension,
      mimeType,
      category,
      encoding,
      headerBytes,
      magicBytes,
      rawText
    }
  }

  reader.readAsArrayBuffer(file.slice(0, 16))
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(type) {
  const icons = {
    '图片': '🖼️',
    '文档': '📄',
    '音频': '🎵',
    '视频': '🎬',
    '压缩文件': '📦',
    '文本': '📝',
    '未知': '❓'
  }
  return icons[type] || '📄'
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

.identifier-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.upload-section {
  margin-bottom: 1.5rem;
}

.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.drop-zone:hover,
.drop-zone.dragover {
  border-color: #2563eb;
  background: #eff6ff;
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drop-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.drop-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.drop-hint {
  font-size: 0.9rem;
  color: #666;
}

.result-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.file-icon {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1rem;
}

.file-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.file-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  word-break: break-all;
}

.file-size {
  color: #666;
  margin: 0;
}

.detection-results {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.result-item.primary {
  grid-column: 1 / -1;
  background: #eff6ff;
  border: 2px solid #2563eb;
  text-align: center;
}

.result-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.result-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.result-extension {
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.5rem;
}

.hex-preview {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.hex-preview h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.hex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.hex-byte {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
}

.hex-byte.magic-byte {
  background: #fee2e2;
  color: #dc2626;
  font-weight: 600;
}

.hex-note {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

.raw-content {
  margin-top: 1rem;
}

.raw-content h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.raw-content pre {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  overflow-x: auto;
  max-height: 200px;
}

.magic-numbers {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
}

.magic-numbers h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.magic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.magic-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;
}

.magic-item code {
  font-size: 0.8rem;
  color: #9333ea;
  font-family: monospace;
}

.magic-item span {
  font-size: 0.9rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .identifier-card {
  background: #262626;
}

.dark .drop-zone {
  border-color: #404040;
}

.dark .drop-zone:hover,
.dark .drop-zone.dragover {
  border-color: #2563eb;
  background: #1e3a5f;
}

.dark .result-section,
.dark .magic-numbers {
  background: #1a1a1a;
}

.dark .result-item {
  background: #262626;
}

.dark .result-item.primary {
  background: #1e3a5f;
}

.dark .hex-preview {
  background: #262626;
}

.dark .hex-byte {
  background: #404040;
  color: #e5e5e5;
}

.dark .hex-byte.magic-byte {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .magic-item {
  background: #262626;
}

@media (max-width: 768px) {
  .detection-results {
    grid-template-columns: 1fr;
  }

  .magic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
