<template>
  <div class="morse-code-translator">
    <h2>摩斯密码翻译器</h2>

    <div class="translator-container">
      <div class="input-section">
        <div class="section-header">
          <h3>输入</h3>
          <div class="mode-toggle">
            <button :class="{ active: inputMode === 'text' }" @click="inputMode = 'text'">文本</button>
            <button :class="{ active: inputMode === 'morse' }" @click="inputMode = 'morse'">摩斯密码</button>
          </div>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="inputMode === 'text' ? '输入要转换为摩斯密码的文本...' : '输入摩斯密码 (用空格分隔字母, 用 / 分隔单词)...'"
          @input="convert"
        ></textarea>
        <div class="char-count">字符数: {{ inputText.length }}</div>
      </div>

      <div class="output-section">
        <h3>输出</h3>
        <div class="output-display" :class="{ morse: inputMode === 'text' }">
          {{ outputText || '翻译结果将在此显示' }}
        </div>
        <div class="output-morse" v-if="inputMode === 'text' && outputText">
          <span class="label">摩斯密码:</span>
          {{ morseOutput }}
        </div>
        <div class="action-buttons">
          <button @click="copyOutput" class="copy-btn">{{ copied ? '已复制!' : '复制' }}</button>
          <button @click="clearAll" class="clear-btn">清空</button>
          <button @click="playSound" class="sound-btn" :disabled="!outputText">播放声音</button>
        </div>
      </div>
    </div>

    <div class="morse-reference">
      <h3>摩斯密码对照表</h3>
      <div class="reference-grid">
        <div class="reference-item" v-for="(code, letter) in morseAlphabet" :key="letter">
          <span class="letter">{{ letter }}</span>
          <span class="code">{{ code }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const morseOutput = ref('')
const inputMode = ref('text')
const copied = ref(false)

const morseAlphabet = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
}

const reverseMorse = Object.fromEntries(
  Object.entries(morseAlphabet).map(([k, v]) => [v, k])
)

const textToMorse = (text) => {
  return text.toUpperCase().split('').map(char => {
    if (char === ' ') return ' '
    return morseAlphabet[char] || ''
  }).filter(Boolean).join(' ')
}

const morseToText = (morse) => {
  return morse.split(' / ').map(word => {
    return word.split(' ').map(code => {
      return reverseMorse[code] || ''
    }).join('')
  }).join(' ')
}

const convert = () => {
  if (!inputText.value) {
    outputText.value = ''
    morseOutput.value = ''
    return
  }

  if (inputMode.value === 'text') {
    morseOutput.value = textToMorse(inputText.value)
    outputText.value = morseOutput.value
  } else {
    outputText.value = morseToText(inputText.value)
  }
}

const copyOutput = async () => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  morseOutput.value = ''
}

const playSound = () => {
  if (!morseOutput.value) return

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const duration = {
    '.': 150,
    '-': 450,
    ' ': 150,
    '/': 350
  }

  let time = audioContext.currentTime
  const sequences = morseOutput.value.replace(/\//g, ' / ').split(' ')

  sequences.forEach(char => {
    if (char === '/') {
      time += 0.2
      return
    }

    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.value = 700
    gain.gain.value = 0.3

    osc.connect(gain)
    gain.connect(audioContext.destination)

    const len = char === '.' ? 0.15 : 0.45
    gain.gain.setValueAtTime(0.3, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + len)
    osc.start(time)
    osc.stop(time + len)

    time += len + 0.1
  })
}
</script>

<style scoped>
.morse-code-translator {
  padding: 20px;
}
.translator-container {
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
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.section-header h3,
.output-section h3 {
  margin: 0;
}
.mode-toggle {
  display: flex;
  gap: 5px;
}
.mode-toggle button {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.mode-toggle button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
textarea {
  width: 100%;
  height: 150px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}
.char-count {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
.output-display {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 4px;
  min-height: 80px;
  font-size: 16px;
  word-break: break-all;
}
.output-display.morse {
  font-family: monospace;
  font-size: 20px;
  letter-spacing: 2px;
}
.output-morse {
  margin-top: 15px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-family: monospace;
}
.output-morse .label {
  color: var(--text-secondary);
  margin-right: 10px;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.copy-btn,
.clear-btn,
.sound-btn {
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
.sound-btn {
  background: #FF9800;
  color: white;
}
.sound-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.morse-reference {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.morse-reference h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}
.reference-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.reference-item .letter {
  font-weight: bold;
}
.reference-item .code {
  font-family: monospace;
  color: var(--primary-color);
}
@media (max-width: 768px) {
  .translator-container {
    grid-template-columns: 1fr;
  }
}
</style>
