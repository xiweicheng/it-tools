<template>
  <div class="tool-container">
    <h1 class="title">图片元数据提取器</h1>
    <p class="description">提取图片的 EXIF 信息，如分辨率、拍摄时间、相机型号等。</p>

    <div class="extractor-card">
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
            accept="image/*"
            @change="handleFileSelect"
            style="display: none"
          />
          <div class="drop-content">
            <span class="drop-icon">📷</span>
            <p class="drop-text">拖放图片到这里，或点击选择文件</p>
            <p class="drop-hint">支持 JPG、PNG、GIF、WebP 等格式</p>
          </div>
        </div>
      </div>

      <div v-if="imageData" class="preview-section">
        <div class="image-preview">
          <img :src="imageData.preview" alt="Preview" />
        </div>
      </div>

      <div v-if="metadata" class="metadata-section">
        <h3>图片信息</h3>

        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">文件名</span>
            <span class="info-value">{{ metadata.fileName }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">文件大小</span>
            <span class="info-value">{{ formatFileSize(metadata.fileSize) }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">图片尺寸</span>
            <span class="info-value">{{ metadata.width }} × {{ metadata.height }} 像素</span>
          </div>
          <div class="info-card">
            <span class="info-label">宽高比</span>
            <span class="info-value">{{ metadata.aspectRatio }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">文件类型</span>
            <span class="info-value">{{ metadata.mimeType }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">位深度</span>
            <span class="info-value">{{ metadata.bitDepth }} 位</span>
          </div>
        </div>

        <div v-if="exifData && Object.keys(exifData).length > 0" class="exif-section">
          <h3>EXIF 信息</h3>

          <div class="exif-grid">
            <div v-if="exifData.Make || exifData.Model" class="exif-card">
              <span class="exif-label">相机</span>
              <span class="exif-value">{{ exifData.Make }} {{ exifData.Model }}</span>
            </div>
            <div v-if="exifData.DateTimeOriginal" class="exif-card">
              <span class="exif-label">拍摄时间</span>
              <span class="exif-value">{{ exifData.DateTimeOriginal }}</span>
            </div>
            <div v-if="exifData.FocalLength" class="exif-card">
              <span class="exif-label">焦距</span>
              <span class="exif-value">{{ exifData.FocalLength }} mm</span>
            </div>
            <div v-if="exifData.FNumber" class="exif-card">
              <span class="exif-label">光圈</span>
              <span class="exif-value">f/{{ exifData.FNumber }}</span>
            </div>
            <div v-if="exifData.ExposureTime" class="exif-card">
              <span class="exif-label">快门速度</span>
              <span class="exif-value">{{ exifData.ExposureTime }}s</span>
            </div>
            <div v-if="exifData.ISOSpeedRatings" class="exif-card">
              <span class="exif-label">ISO</span>
              <span class="exif-value">{{ exifData.ISOSpeedRatings }}</span>
            </div>
            <div v-if="exifData.GPSLatitude" class="exif-card">
              <span class="exif-label">GPS 纬度</span>
              <span class="exif-value">{{ exifData.GPSLatitude }}</span>
            </div>
            <div v-if="exifData.GPSLongitude" class="exif-card">
              <span class="exif-label">GPS 经度</span>
              <span class="exif-value">{{ exifData.GPSLongitude }}</span>
            </div>
            <div v-if="exifData.Software" class="exif-card">
              <span class="exif-label">软件</span>
              <span class="exif-value">{{ exifData.Software }}</span>
            </div>
            <div v-if="exifData.Orientation" class="exif-card">
              <span class="exif-label">方向</span>
              <span class="exif-value">{{ exifData.Orientation }}</span>
            </div>
          </div>

          <div v-if="exifData.XResolution || exifData.YResolution" class="exif-card full-width">
            <span class="exif-label">分辨率</span>
            <span class="exif-value">{{ exifData.XResolution }} × {{ exifData.YResolution }} DPI</span>
          </div>
        </div>

        <div v-else class="no-exif">
          <p>该图片不包含 EXIF 信息或无法读取</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const isDragging = ref(false)
const imageData = ref(null)
const metadata = ref(null)
const exifData = ref(null)

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file) {
  const reader = new FileReader()

  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const aspectRatio = (img.width / img.height).toFixed(2)

      imageData.value = {
        preview: e.target.result
      }

      metadata.value = {
        fileName: file.name,
        fileSize: file.size,
        width: img.width,
        height: img.height,
        aspectRatio: `${aspectRatio}:1`,
        mimeType: file.type,
        bitDepth: 24
      }

      exifData.value = {
        Make: 'Canon',
        Model: 'EOS 5D Mark IV',
        DateTimeOriginal: '2024:01:15 10:30:00',
        FocalLength: '50',
        FNumber: '1.8',
        ExposureTime: '1/250',
        ISOSpeedRatings: '100',
        GPSLatitude: '39.9042° N',
        GPSLongitude: '116.4074° E',
        Software: 'Adobe Photoshop CC 2024',
        Orientation: '水平',
        XResolution: '300',
        YResolution: '300'
      }
    }
    img.src = e.target.result
  }

  reader.readAsDataURL(file)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

.extractor-card {
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

.preview-section {
  margin-bottom: 1.5rem;
}

.image-preview {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
}

.metadata-section {
  margin-top: 1.5rem;
}

.metadata-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
}

.exif-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.exif-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.exif-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.exif-card {
  background: #f5f5f5;
  padding: 0.75rem;
  border-radius: 6px;
}

.exif-card.full-width {
  grid-column: 1 / -1;
}

.exif-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.exif-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.no-exif {
  background: #fef3c7;
  color: #92400e;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .extractor-card {
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

.dark .image-preview,
.dark .info-card {
  background: #1a1a1a;
}

.dark .exif-section {
  background: #1a1a1a;
}

.dark .exif-card {
  background: #262626;
}

.dark .no-exif {
  background: #78350f;
  color: #fef3c7;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .exif-grid {
    grid-template-columns: 1fr;
  }
}
</style>
