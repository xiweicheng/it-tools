<template>
  <div class="tool-container">
    <h1 class="title">环境变量格式化工具</h1>
    <p class="description">格式化和验证环境变量，支持多种格式的转换和导出。</p>

    <div class="env-card">
      <div class="form-group">
        <label>输入环境变量：</label>
        <textarea
          v-model="inputEnv"
          class="text-input"
          placeholder="粘贴环境变量，每行一个，格式: KEY=value"
          @input="parseEnv"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="parseEnv" class="btn-primary">解析环境变量</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="envVariables.length > 0" class="variables-section">
        <h3>解析结果</h3>
        <div class="variables-table">
          <div class="table-header">
            <div class="header-cell">变量名</div>
            <div class="header-cell">值</div>
            <div class="header-cell">操作</div>
          </div>
          <div
            v-for="(variable, index) in envVariables"
            :key="index"
            class="table-row"
          >
            <div class="cell">
              <input
                v-model="variable.key"
                type="text"
                class="edit-input"
                @input="updateEnvString"
              />
            </div>
            <div class="cell">
              <input
                v-model="variable.value"
                type="text"
                class="edit-input"
                @input="updateEnvString"
              />
            </div>
            <div class="cell action-cell">
              <button @click="removeVariable(index)" class="btn-remove">删除</button>
              <button @click="copyVariable(variable)" class="btn-copy">复制</button>
            </div>
          </div>
        </div>

        <div class="add-variable">
          <button @click="addVariable" class="btn-add">添加变量</button>
        </div>

        <div class="form-group">
          <label>选择输出格式：</label>
          <select v-model="outputFormat" class="select-input" @change="updateOutput">
            <option value=".env">.env 文件格式</option>
            <option value="json">JSON 格式</option>
            <option value="js">JavaScript 对象</option>
            <option value="yaml">YAML 格式</option>
            <option value="shell">Shell 导出格式</option>
          </select>
        </div>

        <div class="form-group">
          <label>格式化结果：</label>
          <textarea
            :value="formattedOutput"
            class="text-input result"
            readonly
            rows="8"
          ></textarea>
        </div>

        <div class="action-buttons">
          <button @click="copyOutput" class="btn-primary">复制结果</button>
          <button @click="downloadEnv" class="btn-secondary">下载文件</button>
        </div>
      </div>

      <div v-if="envVariables.length === 0 && inputEnv" class="no-results">
        未解析到环境变量
      </div>
    </div>

    <div class="info-section">
      <h4>格式说明</h4>
      <p>支持的环境变量格式：</p>
      <ul>
        <li><code>KEY=value</code> - 基本格式</li>
        <li><code>KEY="value with spaces"</code> - 带空格的值</li>
        <li><code>KEY='value with spaces'</code> - 带空格的值（单引号）</li>
        <li><code># 注释</code> - 注释行</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const inputEnv = ref('')
const envVariables = ref([])
const outputFormat = ref('.env')

const formattedOutput = computed(() => {
  switch (outputFormat.value) {
    case '.env':
      return envVariables.value
        .map(v => `${v.key}=${v.value}`)
        .join('\n')
    case 'json':
      const jsonObj = {}
      envVariables.value.forEach(v => {
        try {
          jsonObj[v.key] = JSON.parse(v.value)
        } catch {
          jsonObj[v.key] = v.value
        }
      })
      return JSON.stringify(jsonObj, null, 2)
    case 'js':
      let jsOutput = 'const env = {\n'
      envVariables.value.forEach(v => {
        try {
          jsOutput += `  ${v.key}: ${JSON.stringify(v.value)},\n`
        } catch {
          jsOutput += `  ${v.key}: '${v.value}',\n`
        }
      })
      jsOutput += '}'
      return jsOutput
    case 'yaml':
      let yamlOutput = ''
      envVariables.value.forEach(v => {
        yamlOutput += `${v.key}: ${v.value}\n`
      })
      return yamlOutput
    case 'shell':
      return envVariables.value
        .map(v => `export ${v.key}=${v.value}`)
        .join('\n')
    default:
      return ''
  }
})

function parseEnv() {
  if (!inputEnv.value) {
    envVariables.value = []
    return
  }

  const lines = inputEnv.value.split('\n')
  const variables = []

  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/)
      if (match) {
        let key = match[1].trim()
        let value = match[2].trim()

        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1)
        }

        variables.push({ key, value })
      }
    }
  })

  envVariables.value = variables
}

function updateEnvString() {
  inputEnv.value = envVariables.value
    .map(v => `${v.key}=${v.value}`)
    .join('\n')
}

function addVariable() {
  envVariables.value.push({ key: '', value: '' })
  updateEnvString()
}

function removeVariable(index) {
  envVariables.value.splice(index, 1)
  updateEnvString()
}

function copyVariable(variable) {
  const envString = `${variable.key}=${variable.value}`
  navigator.clipboard.writeText(envString)
}

function updateOutput() {
  // 自动更新输出
}

function copyOutput() {
  navigator.clipboard.writeText(formattedOutput.value)
}

function downloadEnv() {
  const content = formattedOutput.value
  const filename = outputFormat.value === '.env' ? '.env' : `env.${outputFormat.value}`
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function clearAll() {
  inputEnv.value = ''
  envVariables.value = []
}

watch(inputEnv, parseEnv, { immediate: true })
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

.env-card {
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

.select-input,
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

.variables-section {
  margin-top: 1.5rem;
}

.variables-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.variables-table {
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

.add-variable {
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

.info-section ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.25rem;
}

.info-section code {
  background: #e0e0e0;
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

.dark .env-card,
.dark .info-section {
  background: #262626;
}

.dark .select-input,
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

.dark .variables-table {
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

.dark .info-section ul {
  color: #a3a3a3;
}

.dark .info-section code {
  background: #404040;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .table-header,
  .table-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .action-cell {
    flex: 1;
    justify-content: flex-start;
  }
}
</style>
