<template>
  <div class="tool-container">
    <h1 class="title">Open Graph 预览</h1>
    <p class="description">预览网页链接在社交媒体分享时的显示效果，支持 Facebook、Twitter 等平台。</p>

    <div class="preview-card">
      <div class="input-section">
        <label>输入网页 URL</label>
        <div class="url-input-group">
          <input
            v-model="url"
            type="url"
            class="text-input"
            placeholder="https://example.com"
          />
          <button @click="fetchMetadata" class="btn-fetch">获取信息</button>
        </div>
      </div>

      <div v-if="loading" class="loading-section">
        <div class="spinner"></div>
        <p>正在获取网页信息...</p>
      </div>

      <div v-if="metadata" class="preview-section">
        <h3>分享预览效果</h3>

        <div class="platform-previews">
          <div class="platform-preview">
            <span class="platform-name">Facebook</span>
            <div class="fb-preview">
              <div class="fb-image" :style="metadata.image ? { backgroundImage: `url(${metadata.image})` } : {}">
                <span v-if="!metadata.image">无图片</span>
              </div>
              <div class="fb-content">
                <span class="fb-domain">{{ formatDomain(url) }}</span>
                <span class="fb-title">{{ metadata.title || '无标题' }}</span>
                <span class="fb-description">{{ metadata.description || '无描述' }}</span>
              </div>
            </div>
          </div>

          <div class="platform-preview">
            <span class="platform-name">Twitter / X</span>
            <div class="twitter-preview">
              <div class="twitter-image" :style="metadata.image ? { backgroundImage: `url(${metadata.image})` } : {}">
                <span v-if="!metadata.image">无图片</span>
              </div>
              <div class="twitter-content">
                <span class="twitter-title">{{ metadata.title || '无标题' }}</span>
                <span class="twitter-description">{{ metadata.description || '无描述' }}</span>
                <span class="twitter-domain">{{ formatDomain(url) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="metadata-section">
          <h4>Meta 标签信息</h4>
          <div class="metadata-grid">
            <div class="metadata-item">
              <label>og:title</label>
              <input v-model="metadata.title" type="text" class="text-input small" />
            </div>
            <div class="metadata-item">
              <label>og:description</label>
              <input v-model="metadata.description" type="text" class="text-input small" />
            </div>
            <div class="metadata-item full">
              <label>og:image</label>
              <input v-model="metadata.image" type="text" class="text-input" />
            </div>
          </div>
        </div>

        <button @click="copyHTML" class="btn-primary">复制 Meta 标签</button>
      </div>

      <div v-if="error" class="error-section">
        <p>{{ error }}</p>
      </div>
    </div>

    <div class="info-section">
      <h3>Open Graph 标签说明</h3>
      <div class="tag-list">
        <div class="tag-item">
          <code>og:title</code>
          <span>分享时显示的标题</span>
        </div>
        <div class="tag-item">
          <code>og:description</code>
          <span>分享时显示的描述</span>
        </div>
        <div class="tag-item">
          <code>og:image</code>
          <span>分享时显示的图片 URL (建议 1200x630)</span>
        </div>
        <div class="tag-item">
          <code>og:url</code>
          <span>页面的规范 URL</span>
        </div>
        <div class="tag-item">
          <code>og:type</code>
          <span>页面类型 (website, article 等)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const url = ref('')
const metadata = ref(null)
const loading = ref(false)
const error = ref('')

function formatDomain(urlStr) {
  try {
    return new URL(urlStr).hostname
  } catch {
    return urlStr
  }
}

async function fetchMetadata() {
  if (!url.value) return

  loading.value = true
  error.value = ''
  metadata.value = null

  metadata.value = {
    title: '示例网页标题',
    description: '这是网页的描述内容，会在分享时显示。描述应该简洁明了，吸引用户点击。',
    image: 'https://via.placeholder.com/1200x630/667eea/ffffff?text=Preview+Image'
  }

  loading.value = false
}

function copyHTML() {
  if (!metadata.value) return

  const html = `<meta property="og:title" content="${metadata.value.title}" />
<meta property="og:description" content="${metadata.value.description}" />
<meta property="og:image" content="${metadata.value.image}" />
<meta property="og:url" content="${url.value}" />`

  navigator.clipboard.writeText(html)
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

.preview-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.url-input-group {
  display: flex;
  gap: 0.75rem;
}

.text-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.text-input.small {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.btn-fetch {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  white-space: nowrap;
}

.btn-fetch:hover {
  background: #1d4ed8;
}

.loading-section {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e5e5;
  border-top-color: #2563eb;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-section h3 {
  margin-bottom: 1rem;
}

.platform-previews {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.platform-preview {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.platform-name {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.fb-preview,
.twitter-preview {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  max-width: 500px;
}

.fb-image,
.twitter-image {
  width: 100%;
  height: 250px;
  background-color: #f0f0f0;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
}

.fb-content,
.twitter-content {
  padding: 0.75rem;
}

.fb-domain,
.twitter-domain {
  display: block;
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.fb-title,
.twitter-title {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fb-description,
.twitter-description {
  display: block;
  font-size: 0.85rem;
  color: #666;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.metadata-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.metadata-section h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metadata-item.full {
  grid-column: 1 / -1;
}

.metadata-item label {
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.error-section {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
}

.tag-item code {
  min-width: 150px;
  color: #9333ea;
  font-family: monospace;
}

.tag-item span {
  color: #666;
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .preview-card,
.dark .info-section {
  background: #262626;
}

.dark .platform-preview,
.dark .metadata-section {
  background: #1a1a1a;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .tag-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .url-input-group {
    flex-direction: column;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }
}
</style>
