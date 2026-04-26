<template>
  <div class="tool-container">
    <h1 class="title">JSON Path 测试器</h1>
    <p class="description">使用 JSONPath 表达式查询和提取 JSON 数据中的特定元素。</p>

    <div class="jsonpath-card">
      <div class="form-group">
        <label>输入 JSON 数据：</label>
        <textarea
          v-model="inputJson"
          class="text-input"
          placeholder="输入 JSON 数据..."
          rows="8"
        ></textarea>
      </div>

      <div class="form-group">
        <label>JSONPath 表达式：</label>
        <input
          v-model="jsonPath"
          type="text"
          class="text-input path-input"
          placeholder="例如: $.store.book[*].author 或 $..title"
        />
      </div>

      <div class="action-buttons">
        <button @click="evaluatePath" class="btn-primary">执行查询</button>
        <button @click="copyResult" class="btn-secondary">复制结果</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="form-group">
        <label>查询结果：</label>
        <textarea
          :value="result"
          class="text-input result"
          readonly
          rows="6"
        ></textarea>
      </div>

      <div class="match-count" v-if="matchCount !== null">
        匹配结果: {{ matchCount }} 个
      </div>

      <div class="reference-section">
        <h3>JSONPath 语法参考</h3>
        <table class="reference-table">
          <thead>
            <tr>
              <th>语法</th>
              <th>说明</th>
              <th>示例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>$</code></td>
              <td>根节点</td>
              <td><code>$</code> - 整个对象</td>
            </tr>
            <tr>
              <td><code>.key</code></td>
              <td>子属性</td>
              <td><code>$.name</code> - 获取 name 属性</td>
            </tr>
            <tr>
              <td><code>['key']</code></td>
              <td>子属性</td>
              <td><code>$['name']</code> - 同上</td>
            </tr>
            <tr>
              <td><code>..key</code></td>
              <td>递归搜索</td>
              <td><code>$..name</code> - 搜索所有 name</td>
            </tr>
            <tr>
              <td><code>[*]</code></td>
              <td>通配符</td>
              <td><code>$.book[*]</code> - 所有 book 元素</td>
            </tr>
            <tr>
              <td><code>[0,1]</code></td>
              <td>多个索引</td>
              <td><code>$.book[0,1]</code> - 前两个 book</td>
            </tr>
            <tr>
              <td><code>[0:3]</code></td>
              <td>数组切片</td>
              <td><code>$.book[0:3]</code> - 前三个 book</td>
            </tr>
            <tr>
              <td><code>[?(@.key)]</code></td>
              <td>过滤表达式</td>
              <td><code>$.book[?(@.price&lt;10)]</code> - 价格小于10的书</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="examples-section">
      <h3>示例 JSON 数据</h3>
      <button @click="loadExample" class="btn-example">加载示例</button>
      <pre v-if="showExample" class="example-json">{{ exampleJson }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { JSONPath } from 'jsonpath-plus'

const inputJson = ref('')
const jsonPath = ref('')
const result = ref('')
const error = ref('')
const matchCount = ref(null)
const showExample = ref(false)

const exampleJson = JSON.stringify({
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}, null, 2)

function evaluatePath() {
  error.value = ''
  result.value = ''
  matchCount.value = null

  if (!inputJson.value.trim()) {
    error.value = '请输入 JSON 数据'
    return
  }

  if (!jsonPath.value.trim()) {
    error.value = '请输入 JSONPath 表达式'
    return
  }

  try {
    const json = JSON.parse(inputJson.value)
    const matches = jsonPathQuery(json, jsonPath.value)
    result.value = JSON.stringify(matches, null, 2)
    matchCount.value = Array.isArray(matches) ? matches.length : 1
  } catch (e) {
    error.value = '错误: ' + e.message
  }
}

function jsonPathQuery(obj, path) {
  const result = JSONPath({ path, json: obj })

  if (result.length === 0) return null
  if (result.length === 1) return result[0]
  return result
}

function loadExample() {
  inputJson.value = exampleJson
  showExample.value = true
}

function copyResult() {
  if (result.value) {
    navigator.clipboard.writeText(result.value)
  }
}

function clearAll() {
  inputJson.value = ''
  jsonPath.value = ''
  result.value = ''
  error.value = ''
  matchCount.value = null
  showExample.value = false
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

.jsonpath-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: monospace;
}

.text-input.result {
  background: #fafafa;
  white-space: pre-wrap;
}

.path-input {
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
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

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.match-count {
  padding: 0.75rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.reference-section {
  margin-top: 2rem;
}

.reference-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.reference-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.reference-table th,
.reference-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.reference-table th {
  background: #f0f0f0;
  font-weight: 500;
}

.reference-table td:first-child code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  color: #2563eb;
}

.examples-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.examples-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.btn-example {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #10b981;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
}

.example-json {
  background: #1a1a1a;
  color: #10b981;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .jsonpath-card,
.dark .examples-section {
  background: #262626;
}

.dark .text-input {
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

.dark .error-message {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .match-count {
  background: #14532d;
  color: #86efac;
}

.dark .reference-table {
  background: #1a1a1a;
}

.dark .reference-table th {
  background: #333;
}

.dark .reference-table td {
  border-bottom-color: #333;
}

.dark .reference-table td:first-child code {
  background: #262626;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .reference-table {
    font-size: 0.9rem;
  }

  .reference-table th,
  .reference-table td {
    padding: 0.5rem;
  }
}
</style>
