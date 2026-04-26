<template>
  <div class="tool-container">
    <h1 class="title">SQL 格式化工具</h1>
    <p class="description">对 SQL 查询语句进行格式化和压缩，支持多种 SQL 方言。</p>

    <div class="sql-card">
      <div class="form-group">
        <label>输入 SQL：</label>
        <textarea
          v-model="inputSql"
          class="text-input"
          placeholder="输入要格式化的 SQL 语句..."
          rows="8"
        ></textarea>
      </div>

      <div class="form-group">
        <label>SQL 类型：</label>
        <select v-model="sqlDialect" class="select-input">
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
          <option value="sqlserver">SQL Server</option>
          <option value="standard">标准 SQL</option>
        </select>
      </div>

      <div class="options-row">
        <label class="option-checkbox">
          <input type="checkbox" v-model="uppercaseKeywords" />
          <span>关键字大写</span>
        </label>
        <label class="option-checkbox">
          <input type="checkbox" v-model="indentSize" />
          <span>缩进 {{ indentSizeValue }} 空格</span>
        </label>
        <label class="option-checkbox">
          <input type="checkbox" v-model="compressOutput" />
          <span>压缩输出</span>
        </label>
      </div>

      <div class="action-buttons">
        <button @click="formatSql" class="btn-primary">格式化</button>
        <button @click="minifySql" class="btn-secondary">压缩</button>
        <button @click="copySql" class="btn-secondary">复制</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="form-group">
        <label>格式化结果：</label>
        <textarea
          :value="formattedSql"
          class="text-input result"
          readonly
          rows="10"
        ></textarea>
      </div>

      <div class="stats-row">
        <span>原始长度: {{ originalLength }}</span>
        <span>格式化后: {{ formattedLength }}</span>
        <span>压缩率: {{ compressionRatio }}%</span>
      </div>
    </div>

    <div class="info-section">
      <h3>SQL 格式化说明</h3>
      <p>支持以下 SQL 语句的格式化：</p>
      <ul>
        <li>SELECT, FROM, WHERE, JOIN, LEFT JOIN, RIGHT JOIN, INNER JOIN, OUTER JOIN</li>
        <li>ORDER BY, GROUP BY, HAVING, LIMIT, OFFSET</li>
        <li>INSERT, UPDATE, DELETE, CREATE, ALTER, DROP</li>
        <li>AND, OR, IN, NOT IN, BETWEEN, LIKE, IS NULL, IS NOT NULL</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputSql = ref('')
const sqlDialect = ref('mysql')
const uppercaseKeywords = ref(true)
const indentSize = ref(true)
const indentSizeValue = ref(2)
const compressOutput = ref(false)

const formattedSql = computed(() => {
  if (!inputSql.value) return ''

  let sql = inputSql.value.trim()

  if (compressOutput.value) {
    return minify(sql)
  }

  return format(sql)
})

const originalLength = computed(() => inputSql.value.length)
const formattedLength = computed(() => formattedSql.value.length)

const compressionRatio = computed(() => {
  if (originalLength.value === 0) return 0
  return Math.round((1 - formattedLength.value / originalLength.value) * 100)
})

function format(sql) {
  let result = sql

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'INNER JOIN', 'OUTER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
    'CROSS JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'CREATE INDEX', 'DROP INDEX',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'NOT NULL', 'UNIQUE', 'DEFAULT',
    'IN', 'NOT IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
    'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'AS', 'ON', 'ASC', 'DESC', 'DISTINCT', 'ALL', 'EXISTS', 'NOT EXISTS'
  ]

  let indent = indentSize.value ? indentSizeValue.value : 0
  let currentIndent = ''
  let formatted = ''

  const tokens = sql.split(/(\s+|\(|\)|,|;)/).filter(t => t.trim())

  let indentLevel = 0
  let newLine = true

  for (let token of tokens) {
    token = token.trim()
    if (!token) continue

    const upperToken = token.toUpperCase()

    if (['SELECT', 'WHERE', 'AND', 'OR', 'FROM', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
         'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'ORDER BY', 'GROUP BY',
         'HAVING', 'SET', 'VALUES', 'ON', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
         'UNION', 'EXCEPT', 'INTERSECT'].includes(upperToken)) {

      if (upperToken === 'WHERE' || upperToken === 'AND' || upperToken === 'OR') {
        if (!newLine) {
          formatted = formatted.trim()
          if (uppercaseKeywords.value) {
            formatted += ' ' + upperToken + '\n' + ' '.repeat(indent * (indentLevel + 1))
          } else {
            formatted += ' ' + token.toLowerCase() + '\n' + ' '.repeat(indent * (indentLevel + 1))
          }
          newLine = true
          continue
        }
      }

      if (upperToken === 'SELECT') {
        indentLevel = 1
      } else if (upperToken === 'FROM' || upperToken === 'WHERE' || upperToken === 'HAVING') {
        indentLevel = 0
      } else if (upperToken === 'JOIN' || upperToken.includes('JOIN')) {
        indentLevel = 0
      }

      if (uppercaseKeywords.value) {
        formatted += '\n' + ' '.repeat(indent * indentLevel) + upperToken
      } else {
        formatted += '\n' + ' '.repeat(indent * indentLevel) + token.toLowerCase()
      }
      newLine = false
    } else if (['INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
                'DROP TABLE', 'CREATE INDEX', 'DROP INDEX'].includes(upperToken)) {
      if (uppercaseKeywords.value) {
        formatted += '\n' + upperToken
      } else {
        formatted += '\n' + token.toLowerCase()
      }
      newLine = false
    } else if (upperToken === 'IN' || upperToken === 'NOT IN' || upperToken === 'BETWEEN') {
      if (uppercaseKeywords.value) {
        formatted += ' ' + upperToken
      } else {
        formatted += ' ' + token.toLowerCase()
      }
    } else if (token === '(') {
      indentLevel++
      formatted += token
    } else if (token === ')') {
      indentLevel = Math.max(0, indentLevel - 1)
      formatted += token
    } else if (token === ',') {
      formatted = formatted.trim() + ','
      formatted += '\n' + ' '.repeat(indent * indentLevel)
    } else if (token === ';') {
      formatted = formatted.trim() + ';\n'
    } else {
      formatted += ' ' + token
      newLine = false
    }
  }

  return formatted.trim()
}

function minify(sql) {
  return sql
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;()])\s*/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim()
}

function formatSql() {
  // 格式化
}

function minifySql() {
  compressOutput.value = true
  setTimeout(() => {
    compressOutput.value = false
  }, 100)
}

function copySql() {
  navigator.clipboard.writeText(formattedSql.value)
}

function clearAll() {
  inputSql.value = ''
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

.sql-card {
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

.select-input,
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

.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.option-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

.stats-row {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-section p {
  color: #666;
  margin-bottom: 0.5rem;
}

.info-section ul {
  padding-left: 1.5rem;
  color: #666;
}

.info-section li {
  margin-bottom: 0.25rem;
  font-family: monospace;
  font-size: 0.9rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .sql-card,
.dark .info-section {
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

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .stats-row {
  background: #1a1a1a;
  color: #a3a3a3;
}

.dark .info-section p,
.dark .info-section li {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .stats-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
