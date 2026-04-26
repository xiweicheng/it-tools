<template>
  <div class="tool-container">
    <h1 class="title">Markdown → HTML 转换器</h1>
    <p class="description">将 Markdown 格式文本转换为 HTML 代码。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>输入 Markdown：</label>
        <textarea
          v-model="markdownInput"
          class="text-input"
          placeholder="输入 Markdown 内容..."
          rows="12"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="convertToHtml" class="btn-primary">转换为 HTML</button>
        <button @click="copyHtml" class="btn-secondary">复制 HTML</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="result-section">
        <label>输出 HTML：</label>
        <div class="result-box">
          <textarea
            :value="htmlOutput"
            class="text-input"
            readonly
            rows="12"
          ></textarea>
        </div>
      </div>

      <div v-if="showPreview" class="preview-section">
        <div class="preview-header">
          <span>预览效果</span>
          <button @click="togglePreview" class="btn-toggle">隐藏预览</button>
        </div>
        <div class="preview-content" v-html="htmlOutput"></div>
      </div>
      <button v-else @click="togglePreview" class="btn-toggle preview-toggle">显示预览</button>
    </div>

    <div class="syntax-section">
      <h3>支持的 Markdown 语法</h3>
      <div class="syntax-grid">
        <div class="syntax-item">
          <code># 标题</code>
          <span>一级标题</span>
        </div>
        <div class="syntax-item">
          <code>**粗体**</code>
          <span>粗体文字</span>
        </div>
        <div class="syntax-item">
          <code>*斜体*</code>
          <span>斜体文字</span>
        </div>
        <div class="syntax-item">
          <code>[链接](url)</code>
          <span>超链接</span>
        </div>
        <div class="syntax-item">
          <code>![图片](url)</code>
          <span>图片</span>
        </div>
        <div class="syntax-item">
          <code>`代码`</code>
          <span>行内代码</span>
        </div>
        <div class="syntax-item">
          <code>```代码块```</code>
          <span>代码块</span>
        </div>
        <div class="syntax-item">
          <code>- 列表项</code>
          <span>无序列表</span>
        </div>
        <div class="syntax-item">
          <code>1. 列表项</code>
          <span>有序列表</span>
        </div>
        <div class="syntax-item">
          <code>> 引用</code>
          <span>引用块</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const markdownInput = ref(`# 欢迎使用 Markdown

这是一段 **粗体** 和 *斜体* 文本。

## 功能特点

- 简单易用
- 实时预览
- 支持多种语法

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

> 这是一段引用文本

[访问 Google](https://www.google.com)
`)

const htmlOutput = ref('')
const showPreview = ref(true)

function convertToHtml() {
  let html = markdownInput.value

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

  html = html.replace(/`{3}(\w*)\n([\s\S]*?)`{3}/g, '<pre><code class="$1">$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')

  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><\/p>/g, '')

  htmlOutput.value = html
}

function togglePreview() {
  showPreview.value = !showPreview.value
}

function copyHtml() {
  if (htmlOutput.value) {
    navigator.clipboard.writeText(htmlOutput.value)
  }
}

function clearAll() {
  markdownInput.value = ''
  htmlOutput.value = ''
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

.converter-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-family: monospace;
  box-sizing: border-box;
  resize: vertical;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.result-section {
  margin-bottom: 1.5rem;
}

.result-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.result-box {
  border: 2px solid #10b981;
  border-radius: 8px;
  overflow: hidden;
}

.result-box .text-input {
  border: none;
  background: #fff;
}

.preview-section {
  margin-top: 1.5rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.preview-toggle {
  width: 100%;
}

.preview-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  line-height: 1.8;
}

.preview-content :deep(h1) {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.preview-content :deep(h2) {
  font-size: 1.4rem;
  margin: 1.5rem 0 1rem;
}

.preview-content :deep(h3) {
  font-size: 1.2rem;
  margin: 1rem 0 0.75rem;
}

.preview-content :deep(strong) {
  font-weight: 700;
}

.preview-content :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.preview-content :deep(pre) {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.preview-content :deep(pre code) {
  background: transparent;
  color: inherit;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #10b981;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #666;
}

.preview-content :deep(ul) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.preview-content :deep(li) {
  margin-bottom: 0.5rem;
}

.preview-content :deep(a) {
  color: #2563eb;
}

.syntax-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.syntax-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.syntax-item {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.syntax-item code {
  font-size: 0.9rem;
  color: #9333ea;
}

.syntax-item span {
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card,
.dark .syntax-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .result-box {
  border-color: #10b981;
}

.dark .result-box .text-input {
  background: #1a1a1a;
}

.dark .btn-toggle {
  background: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .preview-content {
  background: #1a1a1a;
  border-color: #404040;
}

.dark .syntax-item {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .syntax-grid {
    grid-template-columns: 1fr;
  }
}
</style>
