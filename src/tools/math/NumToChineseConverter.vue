<template>
  <div class="tool-container">
    <h1 class="title">数字转中文大写</h1>
    <p class="description">将阿拉伯数字转换为中文大写金额，特别适合财务和会计用途。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>输入数字：</label>
        <input
          v-model="inputNumber"
          type="text"
          class="text-input"
          placeholder="输入数字，例如: 1234567.89"
        />
      </div>

      <div class="action-buttons">
        <button @click="convertToChinese" class="btn-primary">转换为中文大写</button>
        <button @click="copyResult" class="btn-secondary">复制结果</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="result-section">
        <h3>转换结果</h3>
        <div class="result-box">
          <code>{{ chineseResult }}</code>
        </div>
      </div>

      <div class="options-section">
        <label class="option-checkbox">
          <input type="checkbox" v-model="includeYuan" />
          <span>显示"元整"</span>
        </label>
        <label class="option-checkbox">
          <input type="checkbox" v-model="uppercaseMode" />
          <span>大写金额模式</span>
        </label>
      </div>
    </div>

    <div class="examples-section">
      <h3>转换示例</h3>
      <div class="example-list">
        <div class="example-item" @click="loadExample('1234.56')">
          <span class="example-input">1234.56</span>
          <span class="example-arrow">→</span>
          <span class="example-output">壹仟贰佰叁拾肆元伍角陆分</span>
        </div>
        <div class="example-item" @click="loadExample('10000')">
          <span class="example-input">10000</span>
          <span class="example-arrow">→</span>
          <span class="example-output">壹万元整</span>
        </div>
        <div class="example-item" @click="loadExample('0.15')">
          <span class="example-input">0.15</span>
          <span class="example-arrow">→</span>
          <span class="example-output">壹角伍分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputNumber = ref('')
const chineseResult = ref('')
const includeYuan = ref(true)
const uppercaseMode = ref(true)

const chineseDigits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const chineseUnits = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿']

function convertToChinese() {
  if (!inputNumber.value) {
    chineseResult.value = ''
    return
  }

  const num = parseFloat(inputNumber.value)
  if (isNaN(num)) {
    chineseResult.value = '请输入有效数字'
    return
  }

  if (num === 0) {
    chineseResult.value = '零元整'
    return
  }

  const parts = inputNumber.value.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts.length > 1 ? parts[1] : ''

  let result = ''

  if (integerPart !== '0') {
    result = convertInteger(integerPart)
    if (includeYuan.value) {
      result += '元'
    }
  }

  if (decimalPart) {
    if (decimalPart.length >= 1) {
      const jiao = parseInt(decimalPart[0])
      if (jiao > 0) {
        result += chineseDigits[jiao] + '角'
      }
    }
    if (decimalPart.length >= 2) {
      const fen = parseInt(decimalPart[1])
      if (fen > 0) {
        result += chineseDigits[fen] + '分'
      }
    }
  } else if (includeYuan.value && integerPart !== '0') {
    result += '整'
  }

  chineseResult.value = result
}

function convertInteger(numStr) {
  if (numStr === '0') return ''

  const len = numStr.length
  let result = ''
  let zeroCount = 0

  for (let i = 0; i < len; i++) {
    const digit = parseInt(numStr[i])
    const unitIndex = len - i - 1

    if (digit === 0) {
      zeroCount++
      if (unitIndex === 4 || unitIndex === 8) {
        if (zeroCount < len - i) {
          result += chineseUnits[unitIndex]
        }
        zeroCount = 0
      }
    } else {
      if (zeroCount > 0 && digit !== 0) {
        result += '零'
      }
      result += chineseDigits[digit] + chineseUnits[unitIndex]
      zeroCount = 0
    }
  }

  result = result.replace(/零+/g, '零')
  result = result.replace(/零$/, '')
  result = result.replace(/^零/, '')

  return result
}

function loadExample(num) {
  inputNumber.value = num
  convertToChinese()
}

function copyResult() {
  if (chineseResult.value) {
    navigator.clipboard.writeText(chineseResult.value)
  }
}

function clearAll() {
  inputNumber.value = ''
  chineseResult.value = ''
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

.converter-card {
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
  font-size: 1.2rem;
  box-sizing: border-box;
  text-align: right;
  font-family: monospace;
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

.result-section {
  margin-top: 1.5rem;
}

.result-section h3 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.result-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #10b981;
}

.result-box code {
  font-size: 1.4rem;
  color: #10b981;
  font-weight: 600;
}

.options-section {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
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

.examples-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.examples-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.example-item:hover {
  background: #e3f2fd;
}

.example-input {
  font-family: monospace;
  font-weight: 600;
  min-width: 100px;
}

.example-arrow {
  color: #666;
}

.example-output {
  color: #10b981;
  font-weight: 500;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card,
.dark .examples-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .result-box {
  background: #1a1a1a;
}

.dark .example-item {
  background: #1a1a1a;
}

.dark .example-item:hover {
  background: #1e3a8a;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .options-section {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
