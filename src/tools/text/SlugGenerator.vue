<template>
  <div class="slug-generator">
    <h2>URL Slug 生成器</h2>

    <div class="generator-container">
      <div class="input-section">
        <h3>输入文本</h3>
        <textarea
          v-model="inputText"
          placeholder="输入要转换为 URL Slug 的文本..."
        ></textarea>
        <div class="input-actions">
          <button @click="clearInput" class="clear-btn">清空</button>
        </div>
      </div>

      <div class="output-section">
        <h3>生成结果</h3>
        <div class="slug-display">
          <code v-if="slugOutput">{{ slugOutput }}</code>
          <span v-else class="placeholder">生成的 Slug 将在此显示</span>
        </div>
        <div class="action-buttons">
          <button @click="copySlug" class="copy-btn" :disabled="!slugOutput">{{ copied ? '已复制!' : '复制' }}</button>
          <button @click="goUppercase" class="action-btn" :disabled="!slugOutput">转大写</button>
          <button @click="goLowercase" class="action-btn" :disabled="!slugOutput">转小写</button>
        </div>
      </div>
    </div>

    <div class="options-section">
      <h3>选项</h3>
      <div class="options-grid">
        <label class="option-item">
          <input type="checkbox" v-model="options.lowercase" />
          <span>转小写</span>
        </label>
        <label class="option-item">
          <input type="checkbox" v-model="options.removeNumbers" />
          <span>移除数字</span>
        </label>
        <label class="option-item">
          <input type="checkbox" v-model="options.removeSpecialChars" />
          <span>移除特殊字符</span>
        </label>
        <label class="option-item">
          <input type="checkbox" v-model="options.trimSpaces" />
          <span>移除首尾空格</span>
        </label>
        <label class="option-item">
          <input type="checkbox" v-model="options.limitLength" />
          <span>限制长度</span>
        </label>
        <div class="option-item" v-if="options.limitLength">
          <input type="number" v-model.number="options.maxLength" min="10" max="200" />
          <span>最大长度</span>
        </div>
      </div>
      <div class="custom-separator" v-if="!options.removeSpecialChars">
        <label>分隔符</label>
        <select v-model="options.separator">
          <option value="-">连字符 (-)</option>
          <option value="_">下划线 (_)</option>
          <option value=".">点 (.)</option>
        </select>
      </div>
    </div>

    <div class="history-section" v-if="slugHistory.length > 0">
      <h3>历史记录</h3>
      <div class="history-list">
        <div
          v-for="(slug, index) in slugHistory"
          :key="index"
          class="history-item"
          @click="inputText = slug.original; generateSlug()"
        >
          <span class="history-original">{{ slug.original.substring(0, 30) }}{{ slug.original.length > 30 ? '...' : '' }}</span>
          <span class="history-slug">{{ slug.slug }}</span>
        </div>
      </div>
      <button @click="clearHistory" class="clear-history-btn">清空历史</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const inputText = ref('')
const slugOutput = ref('')
const copied = ref(false)
const slugHistory = ref([])

const options = ref({
  lowercase: true,
  removeNumbers: false,
  removeSpecialChars: true,
  trimSpaces: true,
  limitLength: false,
  maxLength: 60,
  separator: '-'
})

const generateSlug = () => {
  let text = inputText.value

  if (options.value.trimSpaces) {
    text = text.trim()
  }

  if (options.value.removeSpecialChars) {
    text = text.replace(/[^\w\s\u4e00-\u9fa5]/g, '')
  }

  if (options.value.removeNumbers) {
    text = text.replace(/[0-9]/g, '')
  }

  const sep = options.value.separator
  let slug = text
    .replace(/\s+/g, sep)
    .replace(new RegExp(`\\${sep}+`, 'g'), sep)

  if (options.value.lowercase) {
    slug = slug.toLowerCase()
  }

  if (options.value.limitLength && slug.length > options.value.maxLength) {
    slug = slug.substring(0, options.value.maxLength)
    const lastSep = slug.lastIndexOf(sep)
    if (lastSep > 0) {
      slug = slug.substring(0, lastSep)
    }
  }

  slugOutput.value = slug

  if (inputText.value && slug && slugHistory.value.length < 10) {
    const exists = slugHistory.value.some(h => h.original === inputText.value)
    if (!exists) {
      slugHistory.value.unshift({ original: inputText.value, slug })
    }
  }
}

watch(inputText, () => {
  if (inputText.value) {
    generateSlug()
  } else {
    slugOutput.value = ''
  }
}, { immediate: true })

const copySlug = async () => {
  if (!slugOutput.value) return
  try {
    await navigator.clipboard.writeText(slugOutput.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const goUppercase = () => {
  slugOutput.value = slugOutput.value.toUpperCase()
}

const goLowercase = () => {
  slugOutput.value = slugOutput.value.toLowerCase()
}

const clearInput = () => {
  inputText.value = ''
  slugOutput.value = ''
}

const clearHistory = () => {
  slugHistory.value = []
}
</script>

<style scoped>
.slug-generator {
  padding: 20px;
}
.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section,
.output-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}
.input-actions {
  margin-top: 10px;
}
.clear-btn {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.slug-display {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 4px;
  min-height: 60px;
  display: flex;
  align-items: center;
}
.slug-display code {
  font-family: monospace;
  font-size: 16px;
  color: var(--primary-color);
  word-break: break-all;
}
.slug-display .placeholder {
  color: var(--text-secondary);
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.copy-btn,
.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.copy-btn {
  background: var(--primary-color);
  color: white;
}
.copy-btn:disabled,
.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.action-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.options-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
.option-item input[type="number"] {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.custom-separator {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.custom-separator select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.history-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}
.history-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.history-item:hover {
  background: var(--border-color);
}
.history-original {
  color: var(--text-secondary);
}
.history-slug {
  font-family: monospace;
  color: var(--primary-color);
}
.clear-history-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
}
</style>
