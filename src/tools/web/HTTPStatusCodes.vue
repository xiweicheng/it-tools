<template>
  <div class="tool-container">
    <h1 class="title">HTTP 状态码查询</h1>
    <p class="description">查询 HTTP 状态码的含义、分类和使用场景。</p>

    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="输入状态码或描述..."
      />
      <select v-model="category" class="category-select">
        <option value="all">全部类别</option>
        <option value="100">信息性 (1xx)</option>
        <option value="200">成功 (2xx)</option>
        <option value="300">重定向 (3xx)</option>
        <option value="400">客户端错误 (4xx)</option>
        <option value="500">服务器错误 (5xx)</option>
      </select>
    </div>

    <div class="status-codes-grid">
      <div
        v-for="code in filteredStatusCodes"
        :key="code.code"
        class="status-card"
        :class="code.category"
      >
        <div class="code-header">
          <span class="code-number">{{ code.code }}</span>
          <span class="code-name">{{ code.name }}</span>
        </div>
        <div class="code-description">{{ code.description }}</div>
        <div class="code-category-badge">{{ getCategoryName(code.category) }}</div>
        <button @click="copyCode(code.code)" class="btn-copy">复制代码</button>
      </div>
    </div>

    <div v-if="filteredStatusCodes.length === 0" class="no-results">
      未找到匹配的状态码
    </div>

    <div class="info-section">
      <h4>状态码分类</h4>
      <div class="category-info">
        <div class="category-item info">
          <span class="category-code">1xx</span>
          <span class="category-desc">信息性状态码</span>
        </div>
        <div class="category-item success">
          <span class="category-code">2xx</span>
          <span class="category-desc">成功状态码</span>
        </div>
        <div class="category-item redirect">
          <span class="category-code">3xx</span>
          <span class="category-desc">重定向状态码</span>
        </div>
        <div class="category-item client-error">
          <span class="category-code">4xx</span>
          <span class="category-desc">客户端错误状态码</span>
        </div>
        <div class="category-item server-error">
          <span class="category-code">5xx</span>
          <span class="category-desc">服务器错误状态码</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const category = ref('all')

const statusCodes = [
  // 1xx 信息性
  { code: 100, name: 'Continue', category: 'info', description: '服务器已收到请求的初始部分，客户端应继续发送剩余部分。' },
  { code: 101, name: 'Switching Protocols', category: 'info', description: '服务器同意切换协议，客户端可以开始使用新协议。' },
  { code: 102, name: 'Processing', category: 'info', description: '服务器正在处理请求，但尚未完成。' },
  
  // 2xx 成功
  { code: 200, name: 'OK', category: 'success', description: '请求成功，服务器返回请求的资源。' },
  { code: 201, name: 'Created', category: 'success', description: '请求成功创建了新资源。' },
  { code: 202, name: 'Accepted', category: 'success', description: '请求已被接受，但处理尚未完成。' },
  { code: 204, name: 'No Content', category: 'success', description: '请求成功，但没有内容返回。' },
  { code: 206, name: 'Partial Content', category: 'success', description: '服务器返回部分内容，用于范围请求。' },
  
  // 3xx 重定向
  { code: 301, name: 'Moved Permanently', category: 'redirect', description: '资源已永久移动到新位置。' },
  { code: 302, name: 'Found', category: 'redirect', description: '资源临时移动到新位置。' },
  { code: 303, name: 'See Other', category: 'redirect', description: '客户端应使用 GET 方法访问另一个 URI。' },
  { code: 304, name: 'Not Modified', category: 'redirect', description: '资源未修改，使用缓存版本。' },
  { code: 307, name: 'Temporary Redirect', category: 'redirect', description: '临时重定向，保持请求方法不变。' },
  { code: 308, name: 'Permanent Redirect', category: 'redirect', description: '永久重定向，保持请求方法不变。' },
  
  // 4xx 客户端错误
  { code: 400, name: 'Bad Request', category: 'client-error', description: '服务器无法理解请求，通常是请求参数错误。' },
  { code: 401, name: 'Unauthorized', category: 'client-error', description: '请求需要身份验证。' },
  { code: 403, name: 'Forbidden', category: 'client-error', description: '服务器拒绝请求，权限不足。' },
  { code: 404, name: 'Not Found', category: 'client-error', description: '请求的资源不存在。' },
  { code: 405, name: 'Method Not Allowed', category: 'client-error', description: '请求方法不被允许。' },
  { code: 406, name: 'Not Acceptable', category: 'client-error', description: '服务器无法产生符合 Accept 头的响应。' },
  { code: 408, name: 'Request Timeout', category: 'client-error', description: '请求超时。' },
  { code: 409, name: 'Conflict', category: 'client-error', description: '请求与服务器当前状态冲突。' },
  { code: 410, name: 'Gone', category: 'client-error', description: '请求的资源已永久删除。' },
  { code: 413, name: 'Payload Too Large', category: 'client-error', description: '请求体过大。' },
  { code: 414, name: 'URI Too Long', category: 'client-error', description: '请求 URI 过长。' },
  { code: 415, name: 'Unsupported Media Type', category: 'client-error', description: '请求的媒体类型不被支持。' },
  { code: 429, name: 'Too Many Requests', category: 'client-error', description: '客户端发送了太多请求。' },
  
  // 5xx 服务器错误
  { code: 500, name: 'Internal Server Error', category: 'server-error', description: '服务器内部错误。' },
  { code: 501, name: 'Not Implemented', category: 'server-error', description: '服务器不支持请求的功能。' },
  { code: 502, name: 'Bad Gateway', category: 'server-error', description: '网关错误，上游服务器响应无效。' },
  { code: 503, name: 'Service Unavailable', category: 'server-error', description: '服务器暂时不可用。' },
  { code: 504, name: 'Gateway Timeout', category: 'server-error', description: '网关超时，上游服务器响应超时。' },
  { code: 505, name: 'HTTP Version Not Supported', category: 'server-error', description: '服务器不支持请求的 HTTP 版本。' }
]

const filteredStatusCodes = computed(() => {
  let filtered = statusCodes

  if (category.value !== 'all') {
    const categoryPrefix = category.value
    filtered = filtered.filter(code => code.code.toString().startsWith(categoryPrefix))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(code => 
      code.code.toString().includes(query) ||
      code.name.toLowerCase().includes(query) ||
      code.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const categoryNames = {
  info: '信息性',
  success: '成功',
  redirect: '重定向',
  'client-error': '客户端错误',
  'server-error': '服务器错误'
}

function getCategoryName(cat) {
  return categoryNames[cat] || cat
}

function copyCode(code) {
  navigator.clipboard.writeText(code.toString())
}
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

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.category-select {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.status-codes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #ccc;
}

.status-card.info {
  border-left-color: #3b82f6;
}

.status-card.success {
  border-left-color: #10b981;
}

.status-card.redirect {
  border-left-color: #f59e0b;
}

.status-card.client-error {
  border-left-color: #ef4444;
}

.status-card.server-error {
  border-left-color: #8b5cf6;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.code-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  font-family: monospace;
}

.code-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
}

.code-description {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #666;
  margin-bottom: 1rem;
}

.code-category-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  background: #e0e0e0;
  color: #666;
  margin-bottom: 1rem;
}

.btn-copy {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #1d4ed8;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h4 {
  margin-bottom: 1rem;
}

.category-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.category-item {
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.category-item.info {
  background: #dbeafe;
  color: #1e40af;
}

.category-item.success {
  background: #d1fae5;
  color: #065f46;
}

.category-item.redirect {
  background: #fef3c7;
  color: #92400e;
}

.category-item.client-error {
  background: #fee2e2;
  color: #991b1b;
}

.category-item.server-error {
  background: #f3e8ff;
  color: #6d28d9;
}

.category-code {
  font-weight: 600;
  font-family: monospace;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .search-input,
.dark .category-select {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .status-card {
  background: #262626;
}

.dark .code-number {
  color: #e5e5e5;
}

.dark .code-name,
.dark .code-description {
  color: #a3a3a3;
}

.dark .code-category-badge {
  background: #404040;
  color: #a3a3a3;
}

.dark .no-results {
  background: #262626;
  color: #a3a3a3;
}

.dark .info-section {
  background: #262626;
}

.dark .category-item.info {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark .category-item.success {
  background: #065f46;
  color: #d1fae5;
}

.dark .category-item.redirect {
  background: #92400e;
  color: #fef3c7;
}

.dark .category-item.client-error {
  background: #991b1b;
  color: #fee2e2;
}

.dark .category-item.server-error {
  background: #6d28d9;
  color: #f3e8ff;
}

@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
  }

  .status-codes-grid {
    grid-template-columns: 1fr;
  }

  .category-info {
    grid-template-columns: 1fr;
  }
}
</style>
