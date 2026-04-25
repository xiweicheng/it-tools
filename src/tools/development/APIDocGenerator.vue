<template>
  <div class="tool-container">
    <h1 class="title">API 文档生成器</h1>
    <p class="description">根据 API 端点信息自动生成标准格式的 API 文档，支持 Swagger/OpenAPI 格式。</p>

    <div class="api-doc-card">
      <div class="form-group">
        <label>API 标题：</label>
        <input
          v-model="apiTitle"
          type="text"
          class="text-input"
          placeholder="输入 API 标题"
        />
      </div>

      <div class="form-group">
        <label>API 版本：</label>
        <input
          v-model="apiVersion"
          type="text"
          class="text-input"
          placeholder="例如: 1.0.0"
        />
      </div>

      <div class="form-group">
        <label>API 描述：</label>
        <textarea
          v-model="apiDescription"
          class="text-input"
          placeholder="输入 API 描述"
        ></textarea>
      </div>

      <div class="endpoints-section">
        <h3>API 端点</h3>
        <div
          v-for="(endpoint, index) in endpoints"
          :key="index"
          class="endpoint-card"
        >
          <div class="endpoint-header">
            <h4>端点 {{ index + 1 }}</h4>
            <button @click="removeEndpoint(index)" class="btn-remove">删除</button>
          </div>

          <div class="endpoint-fields">
            <div class="form-group">
              <label>路径：</label>
              <input
                v-model="endpoint.path"
                type="text"
                class="text-input"
                placeholder="例如: /users"
              />
            </div>

            <div class="form-group">
              <label>方法：</label>
              <select v-model="endpoint.method" class="select-input">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div class="form-group">
              <label>描述：</label>
              <textarea
                v-model="endpoint.description"
                class="text-input"
                placeholder="输入端点描述"
              ></textarea>
            </div>

            <div class="parameters-section">
              <h5>参数</h5>
              <div
                v-for="(param, paramIndex) in endpoint.parameters"
                :key="paramIndex"
                class="parameter-row"
              >
                <input
                  v-model="param.name"
                  type="text"
                  class="text-input param-input"
                  placeholder="参数名"
                />
                <select v-model="param.type" class="select-input param-input">
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="array">array</option>
                  <option value="object">object</option>
                </select>
                <select v-model="param.in" class="select-input param-input">
                  <option value="query">query</option>
                  <option value="path">path</option>
                  <option value="body">body</option>
                  <option value="header">header</option>
                </select>
                <input
                  v-model="param.description"
                  type="text"
                  class="text-input param-input"
                  placeholder="描述"
                />
                <button @click="removeParameter(index, paramIndex)" class="btn-remove small">删除</button>
              </div>
              <button @click="addParameter(index)" class="btn-add-parameter">添加参数</button>
            </div>

            <div class="form-group">
              <label>响应示例：</label>
              <textarea
                v-model="endpoint.response"
                class="text-input"
                placeholder="输入响应示例 JSON"
              ></textarea>
            </div>
          </div>
        </div>
        <button @click="addEndpoint" class="btn-add-endpoint">添加端点</button>
      </div>

      <div class="action-buttons">
        <button @click="generateDocs" class="btn-primary">生成文档</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="output-section">
        <h3>生成的文档</h3>
        <div class="output-tabs">
          <button
            :class="{ active: outputFormat === 'swagger' }"
            @click="outputFormat = 'swagger'"
          >
            Swagger/OpenAPI
          </button>
          <button
            :class="{ active: outputFormat === 'markdown' }"
            @click="outputFormat = 'markdown'"
          >
            Markdown
          </button>
        </div>
        <textarea
          :value="generatedDocs"
          class="text-input result"
          readonly
          rows="15"
        ></textarea>
        <button @click="copyDocs" class="btn-copy">复制文档</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const apiTitle = ref('My API')
const apiVersion = ref('1.0.0')
const apiDescription = ref('API 文档描述')
const outputFormat = ref('swagger')

const endpoints = ref([
  {
    path: '/users',
    method: 'GET',
    description: '获取用户列表',
    parameters: [
      {
        name: 'page',
        type: 'number',
        in: 'query',
        description: '页码'
      },
      {
        name: 'limit',
        type: 'number',
        in: 'query',
        description: '每页数量'
      }
    ],
    response: JSON.stringify({
      data: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    }, null, 2)
  }
])

const generatedDocs = computed(() => {
  if (outputFormat.value === 'swagger') {
    return generateSwaggerDocs()
  } else {
    return generateMarkdownDocs()
  }
})

function addEndpoint() {
  endpoints.value.push({
    path: '',
    method: 'GET',
    description: '',
    parameters: [],
    response: ''
  })
}

function removeEndpoint(index) {
  endpoints.value.splice(index, 1)
}

function addParameter(endpointIndex) {
  endpoints.value[endpointIndex].parameters.push({
    name: '',
    type: 'string',
    in: 'query',
    description: ''
  })
}

function removeParameter(endpointIndex, paramIndex) {
  endpoints.value[endpointIndex].parameters.splice(paramIndex, 1)
}

function generateSwaggerDocs() {
  const swagger = {
    openapi: '3.0.0',
    info: {
      title: apiTitle.value,
      version: apiVersion.value,
      description: apiDescription.value
    },
    paths: {}
  }

  endpoints.value.forEach(endpoint => {
    if (!endpoint.path) return

    swagger.paths[endpoint.path] = {
      [endpoint.method.toLowerCase()]: {
        summary: endpoint.description,
        parameters: endpoint.parameters.map(param => ({
          name: param.name,
          in: param.in,
          description: param.description,
          required: param.in === 'path',
          schema: {
            type: param.type
          }
        })),
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                example: endpoint.response ? JSON.parse(endpoint.response) : {}
              }
            }
          }
        }
      }
    }
  })

  return JSON.stringify(swagger, null, 2)
}

function generateMarkdownDocs() {
  let markdown = `# ${apiTitle.value}\n\n`
  markdown += `## 版本: ${apiVersion.value}\n\n`
  markdown += `${apiDescription.value}\n\n`
  markdown += `## API 端点\n\n`

  endpoints.value.forEach((endpoint, index) => {
    if (!endpoint.path) return

    markdown += `### ${index + 1}. ${endpoint.method} ${endpoint.path}\n\n`
    markdown += `${endpoint.description}\n\n`

    if (endpoint.parameters.length > 0) {
      markdown += `#### 参数\n\n`
      markdown += `| 参数名 | 类型 | 位置 | 描述 |\n`
      markdown += `|--------|------|------|------|\n`
      endpoint.parameters.forEach(param => {
        markdown += `| ${param.name} | ${param.type} | ${param.in} | ${param.description} |\n`
      })
      markdown += `\n`
    }

    if (endpoint.response) {
      markdown += `#### 响应示例\n\n`
      markdown += `\`\`\`json\n${endpoint.response}\n\`\`\`\n\n`
    }
  })

  return markdown
}

function generateDocs() {
  // 生成文档
}

function copyDocs() {
  navigator.clipboard.writeText(generatedDocs.value)
}

function clearAll() {
  apiTitle.value = 'My API'
  apiVersion.value = '1.0.0'
  apiDescription.value = 'API 文档描述'
  endpoints.value = [
    {
      path: '/users',
      method: 'GET',
      description: '获取用户列表',
      parameters: [
        {
          name: 'page',
          type: 'number',
          in: 'query',
          description: '页码'
        },
        {
          name: 'limit',
          type: 'number',
          in: 'query',
          description: '每页数量'
        }
      ],
      response: JSON.stringify({
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      }, null, 2)
    }
  ]
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

.api-doc-card {
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

.endpoints-section {
  margin: 2rem 0;
}

.endpoints-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.endpoint-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #eee;
}

.endpoint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.endpoint-header h4 {
  margin: 0;
  font-size: 1rem;
}

.btn-remove {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-remove.small {
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
}

.endpoint-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.parameters-section {
  margin: 1rem 0;
}

.parameters-section h5 {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
}

.parameter-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.param-input {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.btn-add-parameter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-add-parameter:hover {
  background: #e0e0e0;
}

.btn-add-endpoint {
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  margin-top: 1rem;
}

.btn-add-endpoint:hover {
  background: #e0e0e0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
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

.output-section {
  margin-top: 2rem;
}

.output-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.output-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.output-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.output-tabs button.active {
  background: #2563eb;
  color: white;
}

.btn-copy {
  margin-top: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: #10b981;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  width: 100%;
}

.btn-copy:hover {
  background: #059669;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .api-doc-card {
  background: #262626;
}

.dark .select-input,
.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .endpoint-card {
  background: #1a1a1a;
  border-color: #333;
}

.dark .btn-remove {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .btn-remove:hover {
  background: #991b1b;
}

.dark .btn-add-parameter,
.dark .btn-add-endpoint {
  background: #333;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .btn-add-parameter:hover,
.dark .btn-add-endpoint:hover {
  background: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .output-tabs {
  background: #333;
}

@media (max-width: 768px) {
  .parameter-row {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
