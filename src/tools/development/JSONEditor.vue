<template>
  <div class="tool-container">
    <h1 class="title">JSON Editor</h1>
    <p class="description">可视化 JSON 编辑器，以树形结构展示和编辑 JSON 数据。</p>

    <div class="editor-card">
      <div class="mode-tabs">
        <button :class="{ active: mode === 'tree' }" @click="mode = 'tree'">树形视图</button>
        <button :class="{ active: mode === 'text' }" @click="mode = 'text'">文本编辑</button>
      </div>

      <div class="editor-area" v-if="mode === 'tree'">
        <div v-if="jsonError" class="error-message">{{ jsonError }}</div>
        <div class="tree-view">
          <TreeNode
            v-for="(value, key) in parsedJson"
            :key="key"
            :nodeKey="key"
            :nodeValue="value"
            :depth="0"
            @update="updateNode"
            @delete="deleteNode"
          />
        </div>
        <button @click="addRootNode" class="btn-add-root">+ 添加根节点</button>
      </div>

      <div class="editor-area" v-else>
        <textarea
          v-model="jsonText"
          class="text-input"
          placeholder="输入 JSON 内容..."
          rows="15"
          @input="validateJson"
        ></textarea>
        <div v-if="jsonError" class="error-message">{{ jsonError }}</div>
      </div>

      <div class="action-buttons">
        <button @click="copyJson" class="btn-secondary">复制 JSON</button>
        <button @click="formatJson" class="btn-primary">格式化</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="stats-bar">
        <span>键数量: {{ keyCount }}</span>
        <span>层级深度: {{ maxDepth }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const mode = ref('tree')
const jsonText = ref('{\n  "name": "示例",\n  "age": 25,\n  "email": "example@test.com"\n}')
const jsonError = ref('')

const parsedJson = computed(() => {
  try {
    jsonError.value = ''
    return JSON.parse(jsonText.value)
  } catch (e) {
    jsonError.value = e.message
    return {}
  }
})

const keyCount = computed(() => {
  return countKeys(parsedJson.value)
})

const maxDepth = computed(() => {
  return getMaxDepth(parsedJson.value, 0)
})

function countKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return 0
  let count = Object.keys(obj).length
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key])
    }
  }
  return count
}

function getMaxDepth(obj, depth) {
  if (typeof obj !== 'object' || obj === null) return depth
  let max = depth
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      max = Math.max(max, getMaxDepth(obj[key], depth + 1))
    }
  }
  return max
}

function validateJson() {
  try {
    JSON.parse(jsonText.value)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = e.message
  }
}

function formatJson() {
  try {
    const parsed = JSON.parse(jsonText.value)
    jsonText.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = e.message
  }
}

function copyJson() {
  navigator.clipboard.writeText(jsonText.value)
}

function clearAll() {
  jsonText.value = '{}'
  jsonError.value = ''
}

function updateNode(path, newValue) {
  try {
    const parsed = JSON.parse(jsonText.value)
    const keys = path.split('.')
    let current = parsed
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = newValue
    jsonText.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    jsonError.value = e.message
  }
}

function deleteNode(path) {
  try {
    const parsed = JSON.parse(jsonText.value)
    const keys = path.split('.')
    let current = parsed
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    delete current[keys[keys.length - 1]]
    jsonText.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    jsonError.value = e.message
  }
}

function addRootNode() {
  try {
    const parsed = JSON.parse(jsonText.value)
    const newKey = `newKey_${Object.keys(parsed).length + 1}`
    parsed[newKey] = 'value'
    jsonText.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    jsonError.value = e.message
  }
}

const TreeNode = (props) => {
  const { nodeKey, nodeValue, depth } = props
  const isObject = typeof nodeValue === 'object' && nodeValue !== null
  const isArray = Array.isArray(nodeValue)

  return h('div', { class: 'tree-node', style: { marginLeft: `${depth * 20}px` } }, [
    h('div', { class: 'node-header' }, [
      h('span', { class: 'node-key' }, isArray ? `[${nodeKey}]` : nodeKey),
      h('span', { class: 'node-colon' }, ': '),
      isObject
        ? h('span', { class: 'node-bracket' }, isArray ? '[' : '{')
        : h('span', { class: 'node-value', 
          style: { color: typeof nodeValue === 'number' ? '#2563eb' : typeof nodeValue === 'boolean' ? '#10b981' : '#ef4444' }
        }, JSON.stringify(nodeValue))
    ]),
    isObject && h('div', { class: 'node-children' },
      Object.keys(nodeValue).map((key, index) =>
        h(TreeNode, {
          key,
          nodeKey: key,
          nodeValue: nodeValue[key],
          depth: depth + 1
        })
      )
    ),
    isObject && h('div', { class: 'node-footer' }, [
      h('span', { class: 'node-bracket' }, isArray ? ']' : '}')
    ])
  ])
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

.editor-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.mode-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.mode-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.mode-tabs button.active {
  background: #2563eb;
  color: white;
}

.editor-area {
  margin-bottom: 1.5rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
}

.error-message {
  padding: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  margin: 0.75rem 0;
  font-size: 0.9rem;
}

.tree-view {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  max-height: 400px;
  overflow: auto;
}

.tree-node {
  font-family: monospace;
  font-size: 0.95rem;
  padding: 0.25rem 0;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
}

.node-key {
  color: #9333ea;
  font-weight: 500;
}

.node-colon {
  color: #666;
}

.node-value {
  font-weight: 500;
}

.node-bracket {
  color: #666;
}

.node-children {
  border-left: 1px dashed #ddd;
  margin-left: 4px;
  padding-left: 8px;
}

.btn-add-root {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  border-radius: 6px;
  background: transparent;
  color: #666;
  cursor: pointer;
  margin-top: 0.75rem;
}

.btn-add-root:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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

.stats-bar {
  display: flex;
  gap: 2rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .editor-card {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .tree-view {
  background: #1a1a1a;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .stats-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
