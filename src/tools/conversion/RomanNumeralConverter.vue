<template>
  <div class="roman-numeral-converter">
    <h2>罗马数字转换器</h2>

    <div class="converter-container">
      <div class="input-section">
        <h3>输入</h3>
        <div class="mode-toggle">
          <button :class="{ active: mode === 'toRoman' }" @click="mode = 'toRoman'">数字 → 罗马数字</button>
          <button :class="{ active: mode === 'toNumber' }" @click="mode = 'toNumber'">罗马数字 → 数字</button>
        </div>

        <div class="input-group" v-if="mode === 'toRoman'">
          <input
            type="number"
            v-model.number="inputNumber"
            placeholder="输入数字 (1-3999)"
            min="1"
            max="3999"
            @input="convertToRoman"
          />
        </div>

        <div class="input-group" v-else>
          <input
            type="text"
            v-model="inputRoman"
            placeholder="输入罗马数字 (如: MCMXCIV)"
            @input="convertToNumber"
          />
        </div>

        <div class="common-examples">
          <span>常见数字:</span>
          <button @click="inputNumber = 1; mode = 'toRoman'; convertToRoman()">I</button>
          <button @click="inputNumber = 4; mode = 'toRoman'; convertToRoman()">IV</button>
          <button @click="inputNumber = 9; mode = 'toRoman'; convertToRoman()">IX</button>
          <button @click="inputNumber = 58; mode = 'toRoman'; convertToRoman()">LVIII</button>
          <button @click="inputNumber = 1994; mode = 'toRoman'; convertToRoman()">MCMXCIV</button>
          <button @click="inputNumber = 3999; mode = 'toRoman'; convertToRoman()">MMMCMXCIX</button>
        </div>
      </div>

      <div class="output-section">
        <h3>转换结果</h3>
        <div class="result-display">
          <span class="result-value" v-if="mode === 'toRoman'">{{ romanResult || '-' }}</span>
          <span class="result-value number" v-else>{{ numberResult || '-' }}</span>
        </div>

        <div class="result-info" v-if="mode === 'toRoman' && romanResult">
          <p>您输入的数字 <strong>{{ inputNumber }}</strong> 转换为罗马数字为:</p>
          <div class="roman-large">{{ romanResult }}</div>
        </div>

        <div class="result-info" v-if="mode === 'toNumber' && numberResult">
          <p>您输入的罗马数字 <strong>{{ inputRoman.toUpperCase() }}</strong> 转换为数字为:</p>
          <div class="number-large">{{ numberResult }}</div>
        </div>

        <div class="action-buttons" v-if="romanResult || numberResult">
          <button @click="copyResult" class="copy-btn">{{ copied ? '已复制!' : '复制' }}</button>
          <button @click="clearAll" class="clear-btn">清空</button>
        </div>
      </div>
    </div>

    <div class="reference-section">
      <h3>罗马数字对照表</h3>
      <div class="reference-grid">
        <div class="reference-item">
          <span class="num">1</span>
          <span class="roman">I</span>
        </div>
        <div class="reference-item">
          <span class="num">2</span>
          <span class="roman">II</span>
        </div>
        <div class="reference-item">
          <span class="num">3</span>
          <span class="roman">III</span>
        </div>
        <div class="reference-item">
          <span class="num">4</span>
          <span class="roman">IV</span>
        </div>
        <div class="reference-item">
          <span class="num">5</span>
          <span class="roman">V</span>
        </div>
        <div class="reference-item">
          <span class="num">6</span>
          <span class="roman">VI</span>
        </div>
        <div class="reference-item">
          <span class="num">7</span>
          <span class="roman">VII</span>
        </div>
        <div class="reference-item">
          <span class="num">8</span>
          <span class="roman">VIII</span>
        </div>
        <div class="reference-item">
          <span class="num">9</span>
          <span class="roman">IX</span>
        </div>
        <div class="reference-item">
          <span class="num">10</span>
          <span class="roman">X</span>
        </div>
        <div class="reference-item">
          <span class="num">50</span>
          <span class="roman">L</span>
        </div>
        <div class="reference-item">
          <span class="num">100</span>
          <span class="roman">C</span>
        </div>
        <div class="reference-item">
          <span class="num">500</span>
          <span class="roman">D</span>
        </div>
        <div class="reference-item">
          <span class="num">1000</span>
          <span class="roman">M</span>
        </div>
      </div>

      <div class="rules-section">
        <h4>转换规则</h4>
        <ul>
          <li>基本数字：I (1), V (5), X (10), L (50), C (100), D (500), M (1000)</li>
          <li>相同数字连写：表示重复相加，如 III = 3, CCC = 300</li>
          <li>小的数字在大的数字右边：表示相加，如 VIII = 8</li>
          <li>小的数字在大的数字左边：表示相减，如 IV = 4, IX = 9</li>
          <li>只能使用 I, X, C 进行减法：I只减V和X，X只减L和C，C只减D和M</li>
          <li>同一数字只能连续出现最多3次：如 IIII 是错误的，应为 IV</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('toRoman')
const inputNumber = ref(null)
const inputRoman = ref('')
const romanResult = ref('')
const numberResult = ref(null)
const copied = ref(false)

const romanChars = [
  { value: 1000, char: 'M' },
  { value: 900, char: 'CM' },
  { value: 500, char: 'D' },
  { value: 400, char: 'CD' },
  { value: 100, char: 'C' },
  { value: 90, char: 'XC' },
  { value: 50, char: 'L' },
  { value: 40, char: 'XL' },
  { value: 10, char: 'X' },
  { value: 9, char: 'IX' },
  { value: 5, char: 'V' },
  { value: 4, char: 'IV' },
  { value: 1, char: 'I' }
]

const romanValues = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000
}

const convertToRoman = () => {
  if (!inputNumber.value || inputNumber.value < 1 || inputNumber.value > 3999) {
    romanResult.value = ''
    return
  }

  let num = inputNumber.value
  let result = ''

  for (const { value, char } of romanChars) {
    while (num >= value) {
      result += char
      num -= value
    }
  }

  romanResult.value = result
}

const convertToNumber = () => {
  if (!inputRoman.value) {
    numberResult.value = null
    return
  }

  const roman = inputRoman.value.toUpperCase()
  let result = 0
  let prevValue = 0

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentChar = roman[i]
    const currentValue = romanValues[currentChar]

    if (!currentValue) {
      numberResult.value = null
      return
    }

    if (currentValue < prevValue) {
      result -= currentValue
    } else {
      result += currentValue
      prevValue = currentValue
    }
  }

  if (result > 0 && result <= 3999) {
    numberResult.value = result
  } else {
    numberResult.value = null
  }
}

const copyResult = async () => {
  const text = mode.value === 'toRoman' ? romanResult.value : String(numberResult.value)
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('复制失败:', e)
  }
}

const clearAll = () => {
  inputNumber.value = null
  inputRoman.value = ''
  romanResult.value = ''
  numberResult.value = null
}
</script>

<style scoped>
.roman-numeral-converter {
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
.mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.mode-toggle button {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.mode-toggle button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}
.common-examples {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
}
.common-examples span {
  font-size: 12px;
  color: var(--text-secondary);
}
.common-examples button {
  padding: 6px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.common-examples button:hover {
  background: var(--border-color);
}
.result-display {
  background: var(--bg-secondary);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}
.result-value {
  font-size: 32px;
  font-weight: bold;
  font-family: serif;
  color: var(--primary-color);
}
.result-value.number {
  font-size: 48px;
}
.result-info {
  margin-bottom: 15px;
}
.result-info p {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
}
.roman-large {
  font-size: 36px;
  font-family: serif;
  color: var(--primary-color);
  font-weight: bold;
}
.number-large {
  font-size: 48px;
  font-weight: bold;
  color: var(--primary-color);
}
.action-buttons {
  display: flex;
  gap: 10px;
}
.copy-btn,
.clear-btn {
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
.clear-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.reference-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.reference-section h3 {
  margin-bottom: 15px;
}
.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}
.reference-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.reference-item .num {
  color: var(--text-secondary);
}
.reference-item .roman {
  font-weight: bold;
  font-family: serif;
  color: var(--primary-color);
}
.rules-section h4 {
  margin: 0 0 10px 0;
}
.rules-section ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 14px;
}
.rules-section li {
  margin-bottom: 5px;
}
@media (max-width: 768px) {
  .converter-container {
    grid-template-columns: 1fr;
  }
}
</style>
