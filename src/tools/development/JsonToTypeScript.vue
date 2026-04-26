<template>
  <div class="json-to-typescript">
    <h2>JSON 转 TypeScript 类型</h2>

    <div class="converter-container">
      <div class="input-section">
        <h3>输入 JSON</h3>
        <textarea
          v-model="jsonInput"
          placeholder='输入 JSON 数据,例如:
{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "isActive": true,
  "age": 25,
  "address": {
    "city": "北京",
    "district": "朝阳区"
  },
  "roles": ["admin", "user"],
  "metadata": null
}'
          @input="convertJsonToTs"
        ></textarea>
        <div class="input-actions">
          <button @click="loadSample" class="sample-btn">加载示例</button>
          <button @click="formatJson" class="format-btn">格式化</button>
          <button @click="clearInput" class="clear-btn">清空</button>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h3>TypeScript 类型</h3>
          <div class="options">
            <label>
              <input type="checkbox" v-model="options.rootTypeName" />
              <span>自定义根类型名</span>
            </label>
            <label>
              <input type="checkbox" v-model="options.exportType" />
              <span>导出类型</span>
            </label>
            <label>
              <input type="checkbox" v-model="options.addComment" />
              <span>添加注释</span>
            </label>
          </div>
        </div>

        <div class="type-name-input" v-if="options.rootTypeName">
          <input
            type="text"
            v-model="rootTypeName"
            placeholder="类型名称 (如: User)"
            @input="convertJsonToTs"
          />
        </div>

        <div class="typescript-output">
          <pre v-if="tsOutput"><code>{{ tsOutput }}</code></pre>
          <div class="empty-output" v-else>
            <p v-if="jsonInput">JSON 解析错误或不支持的类型</p>
            <p v-else>在左侧输入 JSON 后将自动转换</p>
          </div>
        </div>

        <div class="output-actions" v-if="tsOutput">
          <button @click="copyOutput" class="copy-btn">{{ copied ? '已复制!' : '复制代码' }}</button>
          <button @click="downloadTs" class="download-btn">下载 .ts 文件</button>
        </div>
      </div>
    </div>

    <div class="history-section" v-if="history.length > 0">
      <h3>历史记录</h3>
      <div class="history-list">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
          @click="jsonInput = item.json; convertJsonToTs()"
        >
          <span class="history-preview">{{ item.preview }}</span>
          <span class="history-time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const jsonInput = ref('')
const tsOutput = ref('')
const rootTypeName = ref('Data')
const copied = ref(false)
const history = ref([])

const options = reactive({
  rootTypeName: true,
  exportType: true,
  addComment: true
})

const sampleJson = `{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "isActive": true,
  "age": 25,
  "phoneNumbers": ["13800138000", "13900139000"],
  "address": {
    "street": "建国路88号",
    "city": "北京",
    "zipCode": "100022"
  },
  "birthDate": "1999-01-01",
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  },
  "roles": ["admin", "user", "moderator"],
  "permissions": {
    "read": true,
    "write": false,
    "delete": false
  }
}`

const loadSample = () => {
  jsonInput.value = sampleJson
  convertJsonToTs()
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
  }
}

const clearInput = () => {
  jsonInput.value = ''
  tsOutput.value = ''
}

const getType = (value, key, path) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = new Set(value.map((item, i) => getType(item, `${key}[${i}]`, `${path}[${i}]`)))
    const uniqueTypes = Array.from(types)
    if (uniqueTypes.length === 1) return `${uniqueTypes[0]}[]`
    return `(${uniqueTypes.join(' | ')})[]`
  }

  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
  if (typeof value === 'string') return 'string'

  if (typeof value === 'object') {
    return generateInterfaceName(key, path)
  }

  return 'unknown'
}

const generateInterfaceName = (key, path) => {
  if (!key) return rootTypeName.value || 'RootObject'

  let name = key
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/^[a-z]/, c => c.toUpperCase())

  if (/^\d/.test(name)) name = 'Item' + name
  if (!/Object$/.test(name) && path.split('.').length > 1) name += 'Object'

  return name || 'Object'
}

const convertJsonToTs = () => {
  if (!jsonInput.value.trim()) {
    tsOutput.value = ''
    return
  }

  try {
    const json = JSON.parse(jsonInput.value)
    const interfaces = []
    const processedPaths = new Set()

    const processObject = (obj, name, path = '') => {
      if (typeof obj !== 'object' || obj === null) return

      const interfaceName = name || rootTypeName.value || 'RootObject'
      const properties = []

      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key
        const type = getType(value, key, currentPath)

        let tsType = type

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const subInterfaceName = generateInterfaceName(key, currentPath)
          if (!processedPaths.has(currentPath)) {
            processedPaths.add(currentPath)
            processObject(value, subInterfaceName, currentPath)
          }
          tsType = subInterfaceName
        }

        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
        properties.push(`  ${safeKey}${type.includes('|') ? '?' : ''}: ${tsType};`)
      }

      const comment = options.addComment ? `/** ${interfaceName.replace(/Object$/, '')} 类型 */\n` : ''
      interfaces.push(`${comment}interface ${interfaceName} {\n${properties.join('\n')}\n}`)
    }

    processObject(json, rootTypeName.value || 'RootObject')

    let output = interfaces.reverse().join('\n\n')

    if (interfaces.length > 1) {
      output = output.replace(/interface (\w+)/g, (match, name) => {
        if (interfaces[interfaces.length - 1].includes(`interface ${name}`)) return match
        return `interface ${name}`
      })
    }

    if (interfaces.length > 1) {
      const lastInterface = interfaces[0]
      const match = lastInterface.match(/^(\/\*\*[^*]*\*+\/)?\s*interface (\w+)/)
      if (match) {
        const rootType = match[2]
        output = output.replace(
          new RegExp(`interface ${rootType} \\{`),
          `interface ${rootType} ${rootType.replace(/Object$/, '')} {`
        )
      }
    }

    if (options.exportType) {
      output = 'export ' + output.replace(/export /g, '')
    }

    tsOutput.value = output

    if (jsonInput.value && history.value.length < 10) {
      const preview = jsonInput.value.substring(0, 50).replace(/\s+/g, ' ')
      const exists = history.value.some(h => h.preview === preview)
      if (!exists) {
        const now = new Date()
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
        history.value.unshift({ json: jsonInput.value, preview, time })
      }
    }
  } catch (e) {
    tsOutput.value = ''
  }
}

const copyOutput = async () => {
  if (!tsOutput.value) return
  try {
    await navigator.clipboard.writeText(tsOutput.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

const downloadTs = () => {
  if (!tsOutput.value) return
  const blob = new Blob([tsOutput.value], { type: 'text/typescript' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${rootTypeName.value || 'types'}.ts`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.json-to-typescript {
  padding: 20px;
}
.converter-container {
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
  height: 350px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
}
.input-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.sample-btn,
.format-btn,
.clear-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.sample-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.format-btn {
  background: #2196F3;
  color: white;
}
.clear-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}
.output-header h3 {
  margin: 0;
}
.options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.options label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}
.options input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.type-name-input {
  margin-bottom: 15px;
}
.type-name-input input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.typescript-output {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 4px;
  min-height: 200px;
  max-height: 350px;
  overflow: auto;
}
.typescript-output pre {
  margin: 0;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}
.typescript-output code {
  color: var(--text-color);
}
.empty-output {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-secondary);
}
.output-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.copy-btn,
.download-btn {
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
.download-btn {
  background: #4CAF50;
  color: white;
}
.history-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.history-section h3 {
  margin-bottom: 15px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.history-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
}
.history-item:hover {
  background: var(--border-color);
}
.history-preview {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}
.history-time {
  font-size: 12px;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .converter-container {
    grid-template-columns: 1fr;
  }
}
</style>
