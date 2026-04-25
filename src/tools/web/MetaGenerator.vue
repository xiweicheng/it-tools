<template>
  <div class="tool-container">
    <h1 class="title">Meta 标签生成器</h1>
    <p class="description">生成常用的 HTML Meta 标签，包括 SEO、社交媒体和响应式设计标签。</p>

    <div class="meta-card">
      <div class="form-group">
        <label>页面标题：</label>
        <input
          v-model="title"
          type="text"
          class="text-input"
          placeholder="输入页面标题"
          @input="generateMeta"
        />
      </div>

      <div class="form-group">
        <label>页面描述：</label>
        <textarea
          v-model="description"
          class="text-input"
          placeholder="输入页面描述"
          rows="3"
          @input="generateMeta"
        ></textarea>
      </div>

      <div class="form-group">
        <label>页面关键词：</label>
        <input
          v-model="keywords"
          type="text"
          class="text-input"
          placeholder="输入关键词，用逗号分隔"
          @input="generateMeta"
        />
      </div>

      <div class="form-group">
        <label>网站域名：</label>
        <input
          v-model="domain"
          type="text"
          class="text-input"
          placeholder="例如: https://example.com"
          @input="generateMeta"
        />
      </div>

      <div class="options-section">
        <h3>Meta 标签选项</h3>
        <div class="options-grid">
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.viewport" @change="generateMeta" />
              响应式视口
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.charset" @change="generateMeta" />
              字符编码
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.robots" @change="generateMeta" />
              爬虫指令
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.author" @change="generateMeta" />
              作者信息
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.canonical" @change="generateMeta" />
              规范链接
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.openGraph" @change="generateMeta" />
              Open Graph (社交分享)
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.twitter" @change="generateMeta" />
              Twitter 卡片
            </label>
          </div>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="options.copyright" @change="generateMeta" />
              版权信息
            </label>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>生成的 Meta 标签：</label>
        <textarea
          :value="generatedMeta"
          class="text-input result"
          readonly
          rows="10"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="copyMeta" class="btn-primary">复制 Meta 标签</button>
        <button @click="resetForm" class="btn-secondary">重置</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>预览效果</h3>
      <div class="preview-card">
        <h2>{{ title || '页面标题' }}</h2>
        <p>{{ description || '页面描述' }}</p>
        <div v-if="keywords" class="keywords">
          关键词: {{ keywords }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const title = ref('')
const description = ref('')
const keywords = ref('')
const domain = ref('')

const options = ref({
  viewport: true,
  charset: true,
  robots: true,
  author: false,
  canonical: false,
  openGraph: false,
  twitter: false,
  copyright: false
})

const generatedMeta = computed(() => {
  let metaTags = []

  if (options.value.charset) {
    metaTags.push('<meta charset="UTF-8">')
  }

  if (options.value.viewport) {
    metaTags.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
  }

  if (title.value) {
    metaTags.push(`<title>${title.value}</title>`)
    metaTags.push(`<meta name="title" content="${title.value}">`)
  }

  if (description.value) {
    metaTags.push(`<meta name="description" content="${description.value}">`)
  }

  if (keywords.value) {
    metaTags.push(`<meta name="keywords" content="${keywords.value}">`)
  }

  if (options.value.robots) {
    metaTags.push('<meta name="robots" content="index, follow">')
  }

  if (options.value.author) {
    metaTags.push('<meta name="author" content="Your Name">')
  }

  if (options.value.canonical && domain.value) {
    metaTags.push(`<link rel="canonical" href="${domain.value}">`)
  }

  if (options.value.copyright) {
    const year = new Date().getFullYear()
    metaTags.push(`<meta name="copyright" content="© ${year} Your Company">`)
  }

  if (options.value.openGraph) {
    metaTags.push('<!-- Open Graph / Facebook -->')
    metaTags.push(`<meta property="og:type" content="website">`)
    if (domain.value) metaTags.push(`<meta property="og:url" content="${domain.value}">`)
    if (title.value) metaTags.push(`<meta property="og:title" content="${title.value}">`)
    if (description.value) metaTags.push(`<meta property="og:description" content="${description.value}">`)
  }

  if (options.value.twitter) {
    metaTags.push('<!-- Twitter -->')
    metaTags.push(`<meta property="twitter:card" content="summary_large_image">`)
    if (domain.value) metaTags.push(`<meta property="twitter:url" content="${domain.value}">`)
    if (title.value) metaTags.push(`<meta property="twitter:title" content="${title.value}">`)
    if (description.value) metaTags.push(`<meta property="twitter:description" content="${description.value}">`)
  }

  return metaTags.join('\n')
})

function generateMeta() {
}

function copyMeta() {
  navigator.clipboard.writeText(generatedMeta.value)
}

function resetForm() {
  title.value = ''
  description.value = ''
  keywords.value = ''
  domain.value = ''
  Object.keys(options.value).forEach(key => {
    options.value[key] = false
  })
  options.value.viewport = true
  options.value.charset = true
  options.value.robots = true
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

.meta-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.text-input.result {
  background: #fafafa;
  font-family: monospace;
  white-space: pre-wrap;
}

.options-section {
  margin: 1.5rem 0;
}

.options-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-item label {
  cursor: pointer;
  font-weight: normal;
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

.btn-secondary:hover {
  background: #d4d4d4;
}

.preview-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.preview-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.preview-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}

.preview-card p {
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.4;
}

.keywords {
  font-size: 0.9rem;
  color: #999;
  font-style: italic;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .meta-card,
.dark .preview-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .preview-card {
  background: #1a1a1a;
  border-color: #333;
}

.dark .preview-card h2 {
  color: #e5e5e5;
}

.dark .preview-card p {
  color: #a3a3a3;
}

.dark .keywords {
  color: #666;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
