<template>
  <div class="tool-container">
    <h1 class="title">字数统计工具</h1>
    <p class="description">详细统计中英文文本的字数、单词数、句子数等信息。</p>

    <div class="analyzer-card">
      <div class="input-section">
        <textarea
          v-model="text"
          class="text-input"
          placeholder="请输入或粘贴需要统计的文本..."
          rows="10"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="analyze" class="btn-primary">开始统计</button>
        <button @click="loadSample" class="btn-secondary">加载示例</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="stats" class="stats-section">
        <h3>统计结果</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ stats.characters }}</span>
            <span class="stat-label">总字符数</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.charactersNoSpaces }}</span>
            <span class="stat-label">不含空格字符</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.words }}</span>
            <span class="stat-label">单词数</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.chineseChars }}</span>
            <span class="stat-label">中文字符</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.englishChars }}</span>
            <span class="stat-label">英文字母</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.numbers }}</span>
            <span class="stat-label">数字</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.sentences }}</span>
            <span class="stat-label">句子数</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ stats.paragraphs }}</span>
            <span class="stat-label">段落数</span>
          </div>
        </div>

        <div class="reading-info">
          <div class="info-item">
            <span class="info-label">预计阅读时间</span>
            <span class="info-value">{{ stats.readingTime }} 分钟</span>
          </div>
          <div class="info-item">
            <span class="info-label">预计朗读时间</span>
            <span class="info-value">{{ stats.speakingTime }} 分钟</span>
          </div>
        </div>
      </div>

      <div v-if="charFrequency.length > 0" class="frequency-section">
        <h3>字符频率统计</h3>
        <div class="frequency-chart">
          <div
            v-for="(item, index) in charFrequency.slice(0, 20)"
            :key="index"
            class="frequency-item"
          >
            <span class="freq-char">{{ item.char }}</span>
            <div class="freq-bar-container">
              <div
                class="freq-bar"
                :style="{ width: (item.count / charFrequency[0].count * 100) + '%' }"
              ></div>
            </div>
            <span class="freq-count">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const stats = ref(null)
const charFrequency = ref([])

function analyze() {
  if (!text.value) {
    stats.value = null
    charFrequency.value = []
    return
  }

  const characters = text.value.length
  const charactersNoSpaces = text.value.replace(/\s/g, '').length

  const chineseChars = (text.value.match(/[\u4e00-\u9fa5]/g) || []).length

  const englishChars = (text.value.match(/[a-zA-Z]/g) || []).length

  const numbers = (text.value.match(/[0-9]/g) || []).length

  const words = text.value.match(/[a-zA-Z]+/g) || []
  const wordCount = words.length

  const sentences = text.value.split(/[.!?。！？]+/).filter(s => s.trim()).length

  const paragraphs = text.value.split(/\n\n+/).filter(p => p.trim()).length

  const readingSpeed = 400
  const speakingSpeed = 200
  const readingTime = Math.ceil(charactersNoSpaces / readingSpeed)
  const speakingTime = Math.ceil(charactersNoSpaces / speakingSpeed)

  stats.value = {
    characters,
    charactersNoSpaces,
    words: wordCount,
    chineseChars,
    englishChars,
    numbers,
    sentences,
    paragraphs,
    readingTime,
    speakingTime
  }

  const charMap = {}
  for (const char of text.value) {
    if (/\s/.test(char)) continue
    charMap[char] = (charMap[char] || 0) + 1
  }

  charFrequency.value = Object.entries(charMap)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
}

function loadSample() {
  text.value = `这是一段示例文本，用于演示字数统计功能。

This is a sample text in English to demonstrate the word counting feature.

中英文混合文本也可以轻松统计。
The quick brown fox jumps over the lazy dog.

1234567890 - Numbers are also counted!

欢迎使用字数统计工具，这是一个非常实用的在线工具，可以帮助您快速了解文本的各种统计信息。`
  analyze()
}

function clearAll() {
  text.value = ''
  stats.value = null
  charFrequency.value = []
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

.analyzer-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
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

.stats-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.stats-section h3 {
  margin: 0 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2563eb;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.reading-info {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  flex: 1;
  background: #eff6ff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 600;
  color: #2563eb;
}

.frequency-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.frequency-section h3 {
  margin: 0 0 1rem;
}

.frequency-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.frequency-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.freq-char {
  min-width: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

.freq-bar-container {
  flex: 1;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.freq-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.freq-count {
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .analyzer-card {
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

.dark .stat-card {
  background: #1a1a1a;
}

.dark .info-item {
  background: #1e3a5f;
}

.dark .freq-bar-container {
  background: #333;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reading-info {
    flex-direction: column;
  }
}
</style>
