<template>
  <div class="tool-container">
    <h1 class="title">密码生成器</h1>
    <p class="description">生成安全的随机密码，支持自定义长度和字符类型。</p>

    <div class="generator-card">
      <div class="form-group">
        <label>密码长度：{{ passwordLength }}</label>
        <input
          v-model.number="passwordLength"
          type="range"
          min="4"
          max="64"
          class="range-input"
          @input="generatePassword"
        />
      </div>

      <div class="options-section">
        <h3>字符类型</h3>
        <div class="options-grid">
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.uppercase" @change="generatePassword" />
            <span>大写字母 (A-Z)</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.lowercase" @change="generatePassword" />
            <span>小写字母 (a-z)</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.numbers" @change="generatePassword" />
            <span>数字 (0-9)</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.symbols" @change="generatePassword" />
            <span>特殊符号 (!@#$%)</span>
          </label>
          <label class="option-checkbox">
            <input type="checkbox" v-model="options.excludeAmbiguous" @change="generatePassword" />
            <span>排除易混淆字符 (0O1lI)</span>
          </label>
        </div>
      </div>

      <div class="generated-section">
        <div class="password-display">
          <code>{{ generatedPassword }}</code>
          <button @click="copyPassword" class="btn-copy">复制</button>
          <button @click="generatePassword" class="btn-refresh">刷新</button>
        </div>
      </div>

      <div class="strength-section">
        <h3>密码强度</h3>
        <div class="strength-bar">
          <div
            class="strength-fill"
            :class="strengthLevel"
            :style="{ width: strengthPercentage + '%' }"
          ></div>
        </div>
        <div class="strength-text" :class="strengthLevel">
          {{ strengthLabel }}
        </div>
      </div>

      <div class="history-section" v-if="passwordHistory.length > 0">
        <h3>历史记录 <button @click="clearHistory" class="btn-clear">清空</button></h3>
        <div class="history-list">
          <div
            v-for="(pwd, index) in passwordHistory"
            :key="index"
            class="history-item"
          >
            <code>{{ pwd.password }}</code>
            <span class="history-length">{{ pwd.length }}位</span>
            <button @click="copyHistoryItem(pwd.password)" class="btn-copy-small">复制</button>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="generatePassword" class="btn-primary">生成新密码</button>
        <button @click="saveToHistory" class="btn-secondary">保存到历史</button>
      </div>
    </div>

    <div class="tips-section">
      <h3>密码安全建议</h3>
      <ul>
        <li>使用至少 12 位以上的密码</li>
        <li>混合使用大小写字母、数字和特殊符号</li>
        <li>避免使用个人信息（生日、姓名、电话等）</li>
        <li>不要在多个网站使用相同密码</li>
        <li>建议使用密码管理器来存储密码</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const passwordLength = ref(16)
const generatedPassword = ref('')
const passwordHistory = ref([])

const options = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false
})

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const ambiguousChars = '0O1lI'

const strengthPercentage = computed(() => {
  let score = 0
  if (passwordLength.value >= 8) score += 20
  if (passwordLength.value >= 12) score += 20
  if (passwordLength.value >= 16) score += 20
  if (options.value.uppercase && options.value.lowercase) score += 15
  if (options.value.numbers) score += 15
  if (options.value.symbols) score += 10
  return Math.min(100, score)
})

const strengthLevel = computed(() => {
  const p = strengthPercentage.value
  if (p >= 80) return 'strong'
  if (p >= 60) return 'medium'
  if (p >= 40) return 'weak'
  return 'very-weak'
})

const strengthLabel = computed(() => {
  switch (strengthLevel.value) {
    case 'strong': return '强 - 密码安全性高'
    case 'medium': return '中等 - 建议增强'
    case 'weak': return '弱 - 容易破解'
    case 'very-weak': return '非常弱 - 不推荐使用'
    default: return ''
  }
})

function generatePassword() {
  let chars = ''

  if (options.value.uppercase) chars += charSets.uppercase
  if (options.value.lowercase) chars += charSets.lowercase
  if (options.value.numbers) chars += charSets.numbers
  if (options.value.symbols) chars += charSets.symbols

  if (!chars) {
    generatedPassword.value = ''
    return
  }

  if (options.value.excludeAmbiguous) {
    chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('')
  }

  let password = ''
  const array = new Uint32Array(passwordLength.value)
  crypto.getRandomValues(array)

  for (let i = 0; i < passwordLength.value; i++) {
    password += chars[array[i] % chars.length]
  }

  generatedPassword.value = password
}

function copyPassword() {
  if (generatedPassword.value) {
    navigator.clipboard.writeText(generatedPassword.value)
  }
}

function saveToHistory() {
  if (generatedPassword.value) {
    passwordHistory.value.unshift({
      password: generatedPassword.value,
      length: passwordLength.value
    })
    if (passwordHistory.value.length > 10) {
      passwordHistory.value.pop()
    }
  }
}

function copyHistoryItem(password) {
  navigator.clipboard.writeText(password)
}

function clearHistory() {
  passwordHistory.value = []
}

generatePassword()
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

.generator-card {
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

.range-input {
  width: 100%;
}

.options-section {
  margin-bottom: 1.5rem;
}

.options-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  background: #fff;
  border-radius: 6px;
}

.option-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.generated-section {
  margin-bottom: 1.5rem;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.password-display code {
  flex: 1;
  color: #10b981;
  font-family: monospace;
  font-size: 1.1rem;
  word-break: break-all;
}

.btn-copy,
.btn-refresh {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-copy {
  background: #3b82f6;
  color: white;
}

.btn-copy:hover {
  background: #2563eb;
}

.btn-refresh {
  background: #10b981;
  color: white;
}

.btn-refresh:hover {
  background: #059669;
}

.strength-section {
  margin-bottom: 1.5rem;
}

.strength-section h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.strength-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.weak {
  background: #ef4444;
}

.strength-fill.very-weak {
  background: #dc2626;
}

.strength-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.strength-text.strong {
  color: #10b981;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.weak,
.strength-text.very-weak {
  color: #ef4444;
}

.history-section {
  margin-bottom: 1.5rem;
}

.history-section h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.btn-clear {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #fff;
  border-radius: 6px;
}

.history-item code {
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
  word-break: break-all;
}

.history-length {
  font-size: 0.8rem;
  color: #999;
}

.btn-copy-small {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #dbeafe;
  color: #1e40af;
  cursor: pointer;
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

.tips-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.tips-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.tips-section ul {
  padding-left: 1.5rem;
  color: #666;
}

.tips-section li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .generator-card,
.dark .tips-section {
  background: #262626;
}

.dark .option-checkbox {
  background: #1a1a1a;
}

.dark .history-item {
  background: #1a1a1a;
}

.dark .history-item code {
  color: #a3a3a3;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .strength-fill {
  background: #404040;
}

.dark .strength-fill.strong {
  background: #10b981;
}

.dark .strength-fill.medium {
  background: #f59e0b;
}

.dark .strength-fill.weak {
  background: #ef4444;
}

.dark .tips-section li {
  color: #a3a3a3;
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
