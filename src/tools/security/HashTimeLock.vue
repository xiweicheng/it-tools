<template>
  <div class="tool-container">
    <h1 class="title">哈希时间锁</h1>
    <p class="description">使用哈希算法锁定文本内容，在未来某个时间自动揭示。也可用于创建限时秘密。</p>

    <div class="locker-card">
      <div class="mode-toggle">
        <button
          :class="{ active: mode === 'lock' }"
          @click="mode = 'lock'"
        >
          🔒 创建锁
        </button>
        <button
          :class="{ active: mode === 'unlock' }"
          @click="mode = 'unlock'"
        >
          🔓 解除锁
        </button>
      </div>

      <div v-if="mode === 'lock'" class="lock-section">
        <div class="form-group">
          <label>输入需要锁定的内容</label>
          <textarea
            v-model="lockContent"
            class="text-input"
            placeholder="输入您想要锁定保密的文本内容..."
            rows="6"
          ></textarea>
        </div>

        <div class="form-group">
          <label>设置密码</label>
          <input
            v-model="lockPassword"
            type="password"
            class="text-input"
            placeholder="设置解锁密码"
          />
        </div>

        <div class="form-group">
          <label>自动解锁时间</label>
          <select v-model="unlockTime" class="select-input">
            <option value="1">1 小时后</option>
            <option value="6">6 小时后</option>
            <option value="24">24 小时后</option>
            <option value="72">3 天后</option>
            <option value="168">7 天后</option>
            <option value="720">30 天后</option>
          </select>
        </div>

        <button @click="createLock" class="btn-primary">🔒 创建时间锁</button>

        <div v-if="lockedResult" class="result-section">
          <h3>锁定成功!</h3>
          <div class="result-box">
            <div class="result-item">
              <span class="result-label">哈希值 (SHA-256)</span>
              <code class="result-value hash-value">{{ lockedResult.hash }}</code>
            </div>
            <div class="result-item">
              <span class="result-label">锁定时间</span>
              <span class="result-value">{{ lockedResult.lockTime }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">解锁时间</span>
              <span class="result-value">{{ lockedResult.unlockTime }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">剩余时间</span>
              <span class="result-value countdown">{{ lockedResult.remaining }}</span>
            </div>
          </div>
          <button @click="copyLockedLink" class="btn-copy-link">📋 复制解锁链接</button>
        </div>
      </div>

      <div v-if="mode === 'unlock'" class="unlock-section">
        <div class="form-group">
          <label>输入哈希值</label>
          <input
            v-model="unlockHash"
            type="text"
            class="text-input"
            placeholder="输入之前生成的哈希值..."
          />
        </div>

        <div class="form-group">
          <label>输入密码</label>
          <input
            v-model="unlockPassword"
            type="password"
            class="text-input"
            placeholder="输入解锁密码"
          />
        </div>

        <button @click="tryUnlock" class="btn-primary">🔓 尝试解锁</button>

        <div v-if="unlockResult !== null" class="unlock-result">
          <div v-if="unlockResult" class="success-section">
            <h3>✅ 解锁成功!</h3>
            <div class="unlocked-content">
              <label>原始内容:</label>
              <pre>{{ unlockedContent }}</pre>
            </div>
          </div>
          <div v-else class="error-section">
            <h3>❌ 解锁失败</h3>
            <p>密码错误或内容已过期</p>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>功能说明</h3>
      <ul>
        <li>使用 <strong>SHA-256</strong> 哈希算法确保内容安全</li>
        <li>只有在设定的 <strong>时间到期</strong> 后才能尝试解锁</li>
        <li><strong>密码保护</strong> 确保只有知道密码的人才能查看内容</li>
        <li>锁定内容存储在 <strong>本地浏览器</strong>，不会上传到服务器</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mode = ref('lock')
const lockContent = ref('')
const lockPassword = ref('')
const unlockTime = ref('24')
const lockedResult = ref(null)
const unlockHash = ref('')
const unlockPassword = ref('')
const unlockResult = ref(null)
const unlockedContent = ref('')

const storedLocks = ref({})

async function hashText(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function createLock() {
  if (!lockContent.value || !lockPassword.value) {
    alert('请填写完整信息')
    return
  }

  const hash = await hashText(lockContent.value + lockPassword.value)

  const now = new Date()
  const unlockDate = new Date(now.getTime() + parseInt(unlockTime.value) * 60 * 60 * 1000)

  lockedResult.value = {
    hash,
    lockTime: now.toLocaleString('zh-CN'),
    unlockTime: unlockDate.toLocaleString('zh-CN'),
    remaining: formatRemainingTime(parseInt(unlockTime.value) * 60 * 60)
  }

  storedLocks.value[hash] = {
    content: lockContent.value,
    password: lockPassword.value,
    unlockTime: unlockDate.getTime()
  }
}

function formatRemainingTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} 天 ${hours % 24} 小时`
  }
  return `${hours} 小时 ${minutes} 分钟`
}

async function tryUnlock() {
  if (!unlockHash.value || !unlockPassword.value) {
    alert('请填写完整信息')
    return
  }

  const lock = storedLocks.value[unlockHash.value]

  if (!lock) {
    unlockResult.value = false
    return
  }

  if (Date.now() < lock.unlockTime) {
    unlockResult.value = false
    alert('时间锁尚未到期，请等待')
    return
  }

  const hash = await hashText(lock.content + unlockPassword.value)

  if (hash === unlockHash.value) {
    unlockResult.value = true
    unlockedContent.value = lock.content
  } else {
    unlockResult.value = false
  }
}

function copyLockedLink() {
  if (lockedResult.value) {
    const link = `${window.location.origin}${window.location.pathname}#/unlock/${lockedResult.value.hash}`
    navigator.clipboard.writeText(link)
    alert('解锁链接已复制到剪贴板!')
  }
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 700px;
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

.locker-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.mode-toggle {
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.mode-toggle button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.mode-toggle button.active {
  background: #2563eb;
  color: white;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input,
.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.result-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
}

.result-section h3 {
  margin-bottom: 1rem;
  color: #10b981;
}

.result-box {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.result-item {
  margin-bottom: 0.75rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.result-value {
  font-weight: 500;
}

.result-value.hash-value {
  display: block;
  font-family: monospace;
  font-size: 0.75rem;
  word-break: break-all;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
}

.btn-copy-link {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.unlock-result {
  margin-top: 1.5rem;
}

.success-section h3 {
  color: #10b981;
  margin-bottom: 1rem;
}

.unlocked-content label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.unlocked-content pre {
  background: #1a1a1a;
  color: #e5e5e5;
  padding: 1rem;
  border-radius: 8px;
  white-space: pre-wrap;
  font-size: 0.9rem;
}

.error-section h3 {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-section p {
  color: #666;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-section li {
  margin-bottom: 0.5rem;
  color: #666;
  line-height: 1.5;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .locker-card,
.dark .info-section {
  background: #262626;
}

.dark .text-input,
.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .result-box {
  background: #1a1a1a;
}
</style>
