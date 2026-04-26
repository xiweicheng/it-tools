<template>
  <div class="tool-container">
    <h1 class="title">ASCII 艺术生成器</h1>
    <p class="description">将文字转换为 ASCII 艺术字符，支持多种字体风格。</p>

    <div class="ascii-card">
      <div class="form-group">
        <label>输入文字：</label>
        <input
          v-model="inputText"
          type="text"
          class="text-input"
          placeholder="输入要转换的文字..."
          @input="generateAscii"
        />
      </div>

      <div class="form-group">
        <label>选择风格：</label>
        <div class="styles-grid">
          <button
            v-for="style in asciiStyles"
            :key="style.id"
            :class="{ active: selectedStyle === style.id }"
            class="style-button"
            @click="selectedStyle = style.id; generateAscii()"
          >
            {{ style.name }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="copyAscii" class="btn-primary">复制 ASCII 艺术</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="result-section">
        <h3>生成的 ASCII 艺术</h3>
        <div class="ascii-display">
          <pre>{{ asciiArt }}</pre>
        </div>
      </div>
    </div>

    <div class="examples-section">
      <h3>示例</h3>
      <div class="example-list">
        <div class="example-item" @click="loadExample('HELLO')">
          <span class="example-text">HELLO</span>
        </div>
        <div class="example-item" @click="loadExample('IT')">
          <span class="example-text">IT</span>
        </div>
        <div class="example-item" @click="loadExample('TOOLS')">
          <span class="example-text">TOOLS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('IT')
const selectedStyle = ref('banner')
const asciiArt = ref('')

const asciiStyles = [
  { id: 'banner', name: 'Banner' },
  { id: 'block', name: 'Block' },
  { id: 'shadow', name: 'Shadow' },
  { id: 'slant', name: 'Slant' },
  { id: 'bubble', name: 'Bubble' }
]

const bannerFont = {
  'A': ['  ███  ', ' ██ ██ ', '███████', '███ ███', '██   ██'],
  'B': ['██████ ', '███ ██', '██████ ', '███ ██', '██████ '],
  'C': [' ██████', '██     ', '██     ', '██     ', ' ██████'],
  'D': ['██████ ', '██  ██', '██   ██', '██  ██', '██████ '],
  'E': ['███████', '██     ', '█████  ', '██     ', '███████'],
  'F': ['███████', '██     ', '█████  ', '██     ', '██     '],
  'G': [' ██████', '██     ', '██  ███', '██   ██', ' ██████'],
  'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██'],
  'I': ['███████', '  ███  ', '  ███  ', '  ███  ', '███████'],
  'J': ['███████', '    ██', '    ██', '██  ██', ' ████ '],
  'K': ['██   ██', '██  ██ ', '█████  ', '██  ██ ', '██   ██'],
  'L': ['██     ', '██     ', '██     ', '██     ', '███████'],
  'M': ['███ ███', '███████', '██ █ ██', '██   ██', '██   ██'],
  'N': ['██   ██', '████  ██', '███  ██', '██   ██', '██   ██'],
  'O': [' ██████', '██   ██', '██   ██', '██   ██', ' ██████'],
  'P': ['██████ ', '██   ██', '██████ ', '██     ', '██     '],
  'Q': [' ██████', '██   ██', '██   ██', '██ ▄▄ ██', ' ████ ██'],
  'R': ['██████ ', '██   ██', '██████ ', '██  ██ ', '██   ██'],
  'S': [' ██████', '██     ', ' ██████', '    ██', '██████ '],
  'T': ['███████', '  ███  ', '  ███  ', '  ███  ', '  ███  '],
  'U': ['██   ██', '██   ██', '██   ██', '██   ██', ' ██████'],
  'V': ['██   ██', '██   ██', '██   ██', ' ██ ██ ', '  ███  '],
  'W': ['██   ██', '██   ██', '██ █ ██', '███████', '███ ███'],
  'X': ['██   ██', ' ██ ██ ', '  ███  ', ' ██ ██ ', '██   ██'],
  'Y': ['██   ██', ' ██ ██ ', '  ███  ', '  ███  ', '  ███  '],
  'Z': ['███████', '   ██ ', '  ██  ', ' ██   ', '███████'],
  '0': [' ██████', '██  ██', '██ █ ██', '████  ██', ' ██████'],
  '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '███████'],
  '2': ['██████ ', '    ██', ' █████ ', '██     ', '███████'],
  '3': ['██████ ', '    ██', ' █████ ', '    ██', '██████ '],
  '4': ['██   ██', '██   ██', '███████', '    ██', '    ██'],
  '5': ['███████', '██     ', '███████', '    ██', '███████'],
  '6': [' ██████', '██     ', '███████', '██   ██', ' ██████'],
  '7': ['███████', '    ██', '   ██  ', '  ██  ', '  ██  '],
  '8': [' ██████', '██   ██', ' █████ ', '██   ██', ' ██████'],
  '9': [' ██████', '██   ██', ' ██████', '    ██', ' ██████'],
  ' ': ['   ', '   ', '   ', '   ', '   '],
  '!': ['███', '███', '███', '   ', '███'],
  '.': ['   ', '   ', '   ', '   ', '███'],
  '-': ['     ', '     ', '█████', '     ', '     '],
  '_': ['          ', '          ', '          ', '          ', '██████████']
}

const blockFont = {
  'A': ['╔═══╗', '║ A ║', '╠═══╣', '║   ║', '║   ║'],
  'B': ['╔══╗ ', '║ B ║', '╠══╝ ', '║ B ║', '╚══╝ '],
  'C': ['╔═══╗', '║   ║', '║   ║', '║   ║', '╚═══╝'],
  'D': ['╔══╗ ', '║  ║║', '║  ║║', '║  ║║', '╚══╝ '],
  'E': ['╔═══╗', '║   ║', '╠══ ║', '║   ║', '╚═══╝'],
  'F': ['╔═══╗', '║   ║', '╠══ ║', '║   ║', '║   ║'],
  'G': ['╔═══╗', '║   ║', '║ ═╣║', '║   ║', '╚═══╝'],
  'H': ['║   ║', '║   ║', '╠═══╣', '║   ║', '║   ║'],
  'I': ['╔═╗', '║ ║', '║ ║', '║ ║', '╚═╝'],
  'J': ['╔═══╗', '║   ║', '║   ║', '║  ║║', '╚══╝ '],
  'K': ['║  ╔╣', '║ ╔╝', '╠══╣ ', '║ ╚╗', '║  ║'],
  'L': ['║   ', '║   ', '║   ', '║   ', '╚═══'],
  'M': ['╔╦╗', '║║║', '║║║', '║ ║', '╝ ╚'],
  'N': ['╔╗ ║', '║║║║', '║ ║║', '║  ║', '╝  ║'],
  'O': ['╔═══╗', '║   ║', '║   ║', '║   ║', '╚═══╝'],
  'P': ['╔══╗ ', '║   ║', '╠══╗ ', '║   ', '║   '],
  'Q': ['╔═══╗', '║   ║', '║ ═╬', '║  ║ ', '╚══╝ '],
  'R': ['╔══╗ ', '║   ║', '╠══╗ ', '║ ╔╝', '║  ║'],
  'S': ['╔═══╗', '║   ║', '╚═══╗', '    ║', '╚═══╝'],
  'T': ['╔═══╗', '  ║   ', '  ║   ', '  ║   ', '  ╨   '],
  'U': ['║   ║', '║   ║', '║   ║', '║   ║', '╚═══╝'],
  'V': ['║   ║', '║   ║', ' ║ ║ ', ' ║ ║ ', '  ╨  '],
  'W': ['║   ║', '║   ║', '║ ║ ║', '╠═╦═╣', '╝ ╚ ╝'],
  'X': ['║   ║', ' ║ ║ ', '  ║  ', ' ║ ║ ', '║   ║'],
  'Y': ['║   ║', ' ║ ║ ', '  ║  ', '  ║  ', '  ╨  '],
  'Z': ['╔═══╗', '   ║║', '  ╔╝', ' ╔╝  ', '╚═══╝'],
  '0': ['╔═══╗', '║0  ║', '║   ║', '║  0║', '╚═══╝'],
  '1': [' ╔╗  ', ' ║║  ', '  ║  ', '  ║  ', ' ╚╝  '],
  '2': ['╔═══╗', '   ║║', '  ╔╝ ', ' ╔╝  ', '╚═══╝'],
  '3': ['╔═══╗', '   ║║', '  ╔╝ ', '   ║║', '╚═══╝'],
  '4': ['║   ║', '║   ║', '╚═══╣', '   ║║', '   ╨╨'],
  '5': ['╔═══╗', '║   ', '╚═══╗', '   ║║', '╚═══╝'],
  '6': ['╔═══╗', '║   ', '╠═══╗', '║   ║', '╚═══╝'],
  '7': ['╔═══╗', '   ║║', '  ╔╝ ', ' ╔╝  ', '╚╝  '],
  '8': ['╔═══╗', '║   ║', '╠═══╣', '║   ║', '╚═══╝'],
  '9': ['╔═══╗', '║   ║', '╚═══╣', '   ║║', '╚═══╝'],
  ' ': ['   ', '   ', '   ', '   ', '   '],
  '-': ['     ', '     ', '═════', '     ', '     '],
  '.': ['   ', '   ', '   ', '   ', '███ '],
  '!': ['╔╗  ', '║║  ', '║║  ', '   ║', '   ╨']
}

function generateAscii() {
  const text = inputText.value.toUpperCase()
  const font = selectedStyle.value === 'banner' ? bannerFont : blockFont

  const lines = ['', '', '', '', '']

  for (const char of text) {
    const charLines = font[char] || font[' ']
    for (let i = 0; i < 5; i++) {
      lines[i] += (charLines[i] || '   ') + ' '
    }
  }

  asciiArt.value = lines.join('\n')
}

function loadExample(text) {
  inputText.value = text
  generateAscii()
}

function copyAscii() {
  if (asciiArt.value) {
    navigator.clipboard.writeText(asciiArt.value)
  }
}

function clearAll() {
  inputText.value = ''
  asciiArt.value = ''
}

generateAscii()
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

.ascii-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.2rem;
  box-sizing: border-box;
  text-align: center;
  font-weight: 600;
}

.styles-grid {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.style-button {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.style-button:hover {
  border-color: #2563eb;
}

.style-button.active {
  border-color: #2563eb;
  background: #2563eb;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  margin-bottom: 1rem;
  font-size: 1rem;
}

.ascii-display {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
}

.ascii-display pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  color: #10b981;
  line-height: 1.2;
  white-space: pre;
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
  gap: 1rem;
}

.example-item {
  padding: 1rem 2rem;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.example-item:hover {
  background: #e3f2fd;
}

.example-text {
  font-weight: 600;
  color: #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .ascii-card,
.dark .examples-section {
  background: #262626;
}

.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .style-button {
  background: #1a1a1a;
  border-color: #404040;
  color: #e5e5e5;
}

.dark .style-button.active {
  background: #2563eb;
  border-color: #2563eb;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
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

  .example-list {
    flex-direction: column;
  }
}
</style>
