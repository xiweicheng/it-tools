<template>
  <div class="tool-container">
    <h1 class="title">版本号对比工具</h1>
    <p class="description">比较两个版本号的大小，支持语义化版本（SemVer）格式。</p>

    <div class="compare-section">
      <div class="version-input-group">
        <label>版本 A：</label>
        <input
          v-model="versionA"
          type="text"
          class="version-input"
          placeholder="如: 1.2.3"
        />
      </div>

      <div class="compare-operator">
        <button @click="swapVersions" class="btn-swap" title="交换版本">
          ⇄
        </button>
      </div>

      <div class="version-input-group">
        <label>版本 B：</label>
        <input
          v-model="versionB"
          type="text"
          class="version-input"
          placeholder="如: 1.3.0"
        />
      </div>
    </div>

    <button @click="compareVersions" class="btn-primary">对比版本</button>

    <div v-if="compareResult !== null" class="result-section">
      <div class="result-card" :class="compareResultClass">
        <div class="result-icon">
          {{ compareResult > 0 ? '↑' : compareResult < 0 ? '↓' : '=' }}
        </div>
        <div class="result-text">
          <strong>版本 {{ versionA }}</strong>
          {{ compareResult > 0 ? '大于' : compareResult < 0 ? '小于' : '等于' }}
          <strong>版本 {{ versionB }}</strong>
        </div>
      </div>

      <div class="version-breakdown">
        <h3>版本解析</h3>

        <div class="breakdown-grid">
          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="version-label">版本 A</span>
              <span class="version-value">{{ versionA }}</span>
            </div>
            <div class="breakdown-details">
              <span>主版本: <strong>{{ parsedA.major }}</strong></span>
              <span>次版本: <strong>{{ parsedA.minor }}</strong></span>
              <span>补丁版本: <strong>{{ parsedA.patch }}</strong></span>
              <span v-if="parsedA.prerelease">预发布: <strong>{{ parsedA.prerelease }}</strong></span>
              <span v-if="parsedA.buildmetadata">构建元数据: <strong>{{ parsedA.buildmetadata }}</strong></span>
            </div>
          </div>

          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="version-label">版本 B</span>
              <span class="version-value">{{ versionB }}</span>
            </div>
            <div class="breakdown-details">
              <span>主版本: <strong>{{ parsedB.major }}</strong></span>
              <span>次版本: <strong>{{ parsedB.minor }}</strong></span>
              <span>补丁版本: <strong>{{ parsedB.patch }}</strong></span>
              <span v-if="parsedB.prerelease">预发布: <strong>{{ parsedB.prerelease }}</strong></span>
              <span v-if="parsedB.buildmetadata">构建元数据: <strong>{{ parsedB.buildmetadata }}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-section">
      <h3>对比历史</h3>
      <div v-if="history.length === 0" class="empty-history">
        暂无对比历史
      </div>
      <div v-else class="history-list">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
        >
          <span class="history-versions">
            {{ item.a }} vs {{ item.b }}
          </span>
          <span class="history-result" :class="item.class">
            {{ item.result }}
          </span>
          <button @click="removeHistory(index)" class="btn-remove">×</button>
        </div>
      </div>
      <button v-if="history.length > 0" @click="clearHistory" class="btn-clear">
        清空历史
      </button>
    </div>

    <div class="format-hint">
      <h4>支持的版本格式</h4>
      <ul>
        <li>标准语义化版本: <code>1.2.3</code>, <code>2.0.0</code></li>
        <li>带预发布版本: <code>1.0.0-alpha</code>, <code>2.1.0-beta.3</code></li>
        <li>带构建元数据: <code>1.0.0+build.123</code></li>
        <li>三段式大版本: <code>v1.2.3</code>, <code>version 2.3.4</code></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const versionA = ref('1.2.3')
const versionB = ref('1.2.4')
const compareResult = ref(null)
const history = ref([])

const parsedA = computed(() => parseVersion(versionA.value))
const parsedB = computed(() => parseVersion(versionB.value))

const compareResultClass = computed(() => {
  if (compareResult.value > 0) return 'greater'
  if (compareResult.value < 0) return 'less'
  return 'equal'
})

function parseVersion(version) {
  const cleaned = version.replace(/^v|version\s*/i, '').trim()

  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/)

  if (match) {
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4] || '',
      buildmetadata: match[5] || '',
      valid: true
    }
  }

  return {
    major: 0,
    minor: 0,
    patch: 0,
    prerelease: '',
    buildmetadata: '',
    valid: false
  }
}

function compareVersions() {
  const a = parsedA.value
  const b = parsedB.value

  if (!a.valid || !b.valid) {
    compareResult.value = null
    return
  }

  if (a.major !== b.major) {
    compareResult.value = a.major - b.major
  } else if (a.minor !== b.minor) {
    compareResult.value = a.minor - b.minor
  } else if (a.patch !== b.patch) {
    compareResult.value = a.patch - b.patch
  } else {
    compareResult.value = comparePrerelease(a.prerelease, b.prerelease)
  }

  const resultText = compareResult.value > 0 ? '大于' : compareResult.value < 0 ? '小于' : '等于'
  const resultClass = compareResult.value > 0 ? 'greater' : compareResult.value < 0 ? 'less' : 'equal'

  history.value.unshift({
    a: versionA.value,
    b: versionB.value,
    result: resultText,
    class: resultClass
  })

  if (history.value.length > 10) {
    history.value.pop()
  }
}

function comparePrerelease(a, b) {
  if (!a && !b) return 0
  if (!a) return 1
  if (!b) return -1

  const partsA = a.split('.')
  const partsB = b.split('.')

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || ''
    const partB = partsB[i] || ''

    const numA = parseInt(partA)
    const numB = parseInt(partB)

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB
    } else if (partA !== partB) {
      return partA.localeCompare(partB)
    }
  }

  return 0
}

function swapVersions() {
  const temp = versionA.value
  versionA.value = versionB.value
  versionB.value = temp
}

function removeHistory(index) {
  history.value.splice(index, 1)
}

function clearHistory() {
  history.value = []
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

.compare-section {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.version-input-group {
  flex: 1;
}

.version-input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.version-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.compare-operator {
  padding-bottom: 0.5rem;
}

.btn-swap {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.btn-swap:hover {
  background: #d4d4d4;
  transform: rotate(180deg);
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.result-section {
  margin-top: 1.5rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.result-card.greater {
  background: #dcfce7;
}

.result-card.less {
  background: #fee2e2;
}

.result-card.equal {
  background: #fef3c7;
}

.result-icon {
  font-size: 2rem;
  font-weight: bold;
}

.result-card.greater .result-icon {
  color: #166534;
}

.result-card.less .result-icon {
  color: #991b1b;
}

.result-card.equal .result-icon {
  color: #92400e;
}

.result-text {
  font-size: 1.1rem;
}

.result-card.greater .result-text {
  color: #166534;
}

.result-card.less .result-text {
  color: #991b1b;
}

.result-card.equal .result-text {
  color: #92400e;
}

.version-breakdown {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.version-breakdown h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.breakdown-item {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.version-label {
  font-size: 0.85rem;
  color: #666;
}

.version-value {
  font-family: monospace;
  font-weight: 500;
}

.breakdown-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.9rem;
}

.breakdown-details span {
  color: #666;
}

.breakdown-details strong {
  color: #333;
}

.history-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.history-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
}

.history-versions {
  flex: 1;
  font-family: monospace;
  font-size: 0.95rem;
}

.history-result {
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.history-result.greater {
  background: #dcfce7;
  color: #166534;
}

.history-result.less {
  background: #fee2e2;
  color: #991b1b;
}

.history-result.equal {
  background: #fef3c7;
  color: #92400e;
}

.btn-remove {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.btn-remove:hover {
  background: #d4d4d4;
}

.btn-clear {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-clear:hover {
  background: #d4d4d4;
}

.format-hint {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.format-hint h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.format-hint ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #666;
  font-size: 0.9rem;
}

.format-hint li {
  margin-bottom: 0.25rem;
}

.format-hint code {
  background: #e5e5e5;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .version-input {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-swap {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-swap:hover {
  background: #525252;
}

.dark .result-card.greater {
  background: #14532d;
}

.dark .result-card.less {
  background: #7f1d1d;
}

.dark .result-card.equal {
  background: #78350f;
}

.dark .version-breakdown,
.dark .history-section,
.dark .format-hint {
  background: #262626;
}

.dark .breakdown-item,
.dark .history-item {
  background: #1a1a1a;
}

.dark .breakdown-header {
  border-color: #333;
}

.dark .breakdown-details span {
  color: #a3a3a3;
}

.dark .breakdown-details strong {
  color: #e5e5e5;
}

.dark .btn-remove,
.dark .btn-clear {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-remove:hover,
.dark .btn-clear:hover {
  background: #525252;
}

.dark .format-hint code {
  background: #404040;
}

@media (max-width: 600px) {
  .compare-section {
    flex-direction: column;
    align-items: stretch;
  }

  .compare-operator {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .breakdown-grid {
    grid-template-columns: 1fr;
  }
}
</style>
