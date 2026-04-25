<template>
  <div class="tool-container">
    <h1 class="title">Cookie 解析格式化</h1>
    <p class="description">解析和格式化 Cookie 字符串，支持查看、编辑和生成 Cookie。</p>

    <div class="cookie-card">
      <div class="form-group">
        <label>输入 Cookie 字符串：</label>
        <textarea
          v-model="inputCookie"
          class="text-input"
          placeholder="粘贴 Cookie 字符串..."
          @input="parseCookie"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="parseCookie" class="btn-primary">解析 Cookie</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="cookiePairs.length > 0" class="cookie-results">
        <h3>解析结果</h3>
        <div class="cookie-table">
          <div class="table-header">
            <div class="header-cell">名称</div>
            <div class="header-cell">值</div>
            <div class="header-cell">操作</div>
          </div>
          <div
            v-for="(pair, index) in cookiePairs"
            :key="index"
            class="table-row"
          >
            <div class="cell">
              <input
                v-model="pair.name"
                type="text"
                class="edit-input"
                @input="updateCookieString"
              />
            </div>
            <div class="cell">
              <input
                v-model="pair.value"
                type="text"
                class="edit-input"
                @input="updateCookieString"
              />
            </div>
            <div class="cell action-cell">
              <button @click="removePair(index)" class="btn-remove">删除</button>
              <button @click="copyPair(pair)" class="btn-copy">复制</button>
            </div>
          </div>
        </div>

        <div class="add-pair">
          <button @click="addPair" class="btn-add">添加 Cookie</button>
        </div>

        <div class="form-group">
          <label>格式化后的 Cookie：</label>
          <textarea
            :value="formattedCookie"
            class="text-input result"
            readonly
          ></textarea>
        </div>

        <div class="action-buttons">
          <button @click="copyFormatted" class="btn-primary">复制格式化结果</button>
          <button @click="generateCookie" class="btn-secondary">生成新 Cookie</button>
        </div>
      </div>

      <div v-if="cookiePairs.length === 0 && inputCookie" class="no-results">
        未解析到 Cookie 数据
      </div>
    </div>

    <div class="info-section">
      <h4>Cookie 格式说明</h4>
      <p>Cookie 字符串格式：name1=value1; name2=value2; name3=value3</p>
      <p>每个 Cookie 由名称和值组成，用等号分隔，多个 Cookie 之间用分号和空格分隔。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const inputCookie = ref('')
const cookiePairs = ref([])

const formattedCookie = computed(() => {
  return cookiePairs.value
    .map(pair => `${pair.name}=${pair.value}`)
    .join('; ')
})

function parseCookie() {
  if (!inputCookie.value) {
    cookiePairs.value = []
    return
  }

  const pairs = inputCookie.value.split(';')
  const parsed = []

  pairs.forEach(pair => {
    const trimmed = pair.trim()
    if (trimmed) {
      const [name, ...valueParts] = trimmed.split('=')
      if (name) {
        parsed.push({
          name: name.trim(),
          value: valueParts.join('=').trim()
        })
      }
    }
  })

  cookiePairs.value = parsed
}

function updateCookieString() {
  inputCookie.value = formattedCookie.value
}

function addPair() {
  cookiePairs.value.push({ name: '', value: '' })
  updateCookieString()
}

function removePair(index) {
  cookiePairs.value.splice(index, 1)
  updateCookieString()
}

function copyPair(pair) {
  const cookieString = `${pair.name}=${pair.value}`
  navigator.clipboard.writeText(cookieString)
}

function copyFormatted() {
  navigator.clipboard.writeText(formattedCookie.value)
}

function generateCookie() {
  const randomName = `cookie_${Math.random().toString(36).substr(2, 9)}`
  const randomValue = Math.random().toString(36).substr(2, 15)
  cookiePairs.value.push({ name: randomName, value: randomValue })
  updateCookieString()
}

function clearAll() {
  inputCookie.value = ''
  cookiePairs.value = []
}

watch(inputCookie, parseCookie, { immediate: true })
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

.cookie-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
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
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  resize: vertical;
  box-sizing: border-box;
}

.text-input.result {
  background: #fafafa;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary,
.btn-secondary,
.btn-add {
  padding: 0.75rem 1.5rem;
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

.btn-add {
  background: #10b981;
  color: white;
  margin: 1rem 0;
}

.btn-add:hover {
  background: #059669;
}

.cookie-results {
  margin-top: 1.5rem;
}

.cookie-results h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.cookie-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.table-header {
  display: flex;
  background: #f0f0f0;
  padding: 0.75rem;
  font-weight: 500;
}

.table-row {
  display: flex;
  border-top: 1px solid #eee;
  padding: 0.75rem;
}

.header-cell,
.cell {
  flex: 1;
  padding: 0 0.5rem;
}

.action-cell {
  flex: 0 0 120px;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
}

.btn-remove,
.btn-copy {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove {
  background: #fee2e2;
  color: #991b1b;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-copy {
  background: #dbeafe;
  color: #1e40af;
}

.btn-copy:hover {
  background: #bfdbfe;
}

.add-pair {
  margin: 1rem 0;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 1rem;
}

.info-section {
  margin-top: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-section h4 {
  margin-bottom: 0.75rem;
}

.info-section p {
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .cookie-card,
.dark .info-section {
  background: #262626;
}

.dark .text-input,
.dark .edit-input {
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

.dark .cookie-table {
  background: #1a1a1a;
}

.dark .table-header {
  background: #333;
}

.dark .table-row {
  border-top-color: #333;
}

.dark .btn-remove {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .btn-remove:hover {
  background: #991b1b;
}

.dark .btn-copy {
  background: #1e3a8a;
  color: #bfdbfe;
}

.dark .btn-copy:hover {
  background: #1e40af;
}

.dark .no-results {
  background: #1a1a1a;
  color: #a3a3a3;
}

.dark .info-section p {
  color: #a3a3a3;
}
</style>
