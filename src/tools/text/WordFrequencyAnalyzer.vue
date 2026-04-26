<template>
  <div class="tool-container">
    <h1 class="title">词频分析器</h1>
    <p class="description">分析文本中词语的出现频率，并提供可视化统计。</p>

    <div class="analyzer-card">
      <div class="form-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入需要分析的文本..."
          rows="8"
        ></textarea>
      </div>

      <div class="options-row">
        <div class="option-group">
          <label>分析类型：</label>
          <select v-model="analysisType" class="select-input">
            <option value="word">词语统计</option>
            <option value="char">字符统计</option>
            <option value="both">全部统计</option>
          </select>
        </div>
        <div class="option-group">
          <label>显示数量：</label>
          <select v-model="topCount" class="select-input">
            <option :value="10">前 10 个</option>
            <option :value="20">前 20 个</option>
            <option :value="50">前 50 个</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="analyzeText" class="btn-primary">开始分析</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div v-if="results.words.length > 0" class="results-section">
        <h3>词频统计结果</h3>

        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-value">{{ results.totalWords }}</span>
            <span class="stat-label">总词数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ results.uniqueWords }}</span>
            <span class="stat-label">不重复词数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ results.totalChars }}</span>
            <span class="stat-label">总字符数</span>
          </div>
        </div>

        <div class="chart-section">
          <h4>词频图表</h4>
          <div class="bar-chart">
            <div
              v-for="(item, index) in results.words.slice(0, topCount)"
              :key="index"
              class="bar-item"
            >
              <div class="bar-label">{{ item.word }}</div>
              <div class="bar-container">
                <div
                  class="bar-fill"
                  :style="{ width: (item.count / results.words[0].count * 100) + '%' }"
                ></div>
              </div>
              <div class="bar-count">{{ item.count }}</div>
            </div>
          </div>
        </div>

        <div class="list-section">
          <h4>完整词频列表</h4>
          <div class="frequency-list">
            <div
              v-for="(item, index) in results.words"
              :key="index"
              class="frequency-item"
            >
              <span class="freq-rank">#{{ index + 1 }}</span>
              <span class="freq-word">{{ item.word }}</span>
              <span class="freq-count">{{ item.count }} 次</span>
              <span class="freq-percent">{{ ((item.count / results.totalWords) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="results.chars.length > 0" class="results-section">
        <h3>字符统计结果</h3>

        <div class="chart-section">
          <h4>字符频率图表</h4>
          <div class="bar-chart">
            <div
              v-for="(item, index) in results.chars.slice(0, topCount)"
              :key="index"
              class="bar-item"
            >
              <div class="bar-label">{{ item.char === ' ' ? '空格' : item.char }}</div>
              <div class="bar-container">
                <div
                  class="bar-fill char-bar"
                  :style="{ width: (item.count / results.chars[0].count * 100) + '%' }"
                ></div>
              </div>
              <div class="bar-count">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputText = ref('')
const analysisType = ref('word')
const topCount = ref(10)

const results = reactive({
  words: [],
  chars: [],
  totalWords: 0,
  uniqueWords: 0,
  totalChars: 0
})

function analyzeText() {
  if (!inputText.value.trim()) {
    results.words = []
    results.chars = []
    return
  }

  if (analysisType.value === 'word' || analysisType.value === 'both') {
    analyzeWords()
  }

  if (analysisType.value === 'char' || analysisType.value === 'both') {
    analyzeChars()
  }
}

function analyzeWords() {
  const text = inputText.value.toLowerCase()
  const words = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z0-9]+/g) || []

  const wordMap = {}
  words.forEach(word => {
    wordMap[word] = (wordMap[word] || 0) + 1
  })

  results.words = Object.entries(wordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)

  results.totalWords = words.length
  results.uniqueWords = results.words.length
}

function analyzeChars() {
  const text = inputText.value
  const charMap = {}

  for (const char of text) {
    charMap[char] = (charMap[char] || 0) + 1
  }

  results.chars = Object.entries(charMap)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)

  results.totalChars = text.length
}

function clearAll() {
  inputText.value = ''
  results.words = []
  results.chars = []
  results.totalWords = 0
  results.uniqueWords = 0
  results.totalChars = 0
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

.analyzer-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}

.options-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-group {
  flex: 1;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
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

.results-section {
  margin-top: 2rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.results-section h4 {
  margin: 1.5rem 0 1rem;
  font-size: 1rem;
  color: #666;
}

.stats-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  flex: 1;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.bar-chart {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.bar-label {
  min-width: 80px;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}

.bar-container {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-fill.char-bar {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.bar-count {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #666;
}

.list-section {
  margin-top: 2rem;
}

.frequency-list {
  background: #fff;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.frequency-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.frequency-item:last-child {
  border-bottom: none;
}

.freq-rank {
  min-width: 40px;
  color: #666;
  font-size: 0.9rem;
}

.freq-word {
  flex: 1;
  font-weight: 500;
}

.freq-count {
  min-width: 60px;
  text-align: right;
  color: #2563eb;
  font-weight: 600;
}

.freq-percent {
  min-width: 60px;
  text-align: right;
  color: #999;
  font-size: 0.9rem;
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

.dark .text-input,
.dark .select-input {
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

.dark .stat-item,
.dark .bar-chart,
.dark .frequency-list {
  background: #1a1a1a;
}

.dark .bar-container {
  background: #333;
}

@media (max-width: 768px) {
  .options-row {
    flex-direction: column;
  }

  .stats-summary {
    flex-direction: column;
  }

  .bar-item {
    flex-wrap: wrap;
  }

  .bar-label {
    min-width: 100%;
    text-align: left;
    margin-bottom: 0.25rem;
  }
}
</style>
