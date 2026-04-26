<template>
  <div class="tool-container">
    <h1 class="title">打字速度测试</h1>
    <p class="description">测试您的打字速度和准确率，练习提升打字技能。</p>

    <div class="tester-card">
      <div v-if="!started" class="start-section">
        <h2>准备开始</h2>
        <p>点击下方按钮开始测试，系统会显示一段文字，您需要在最短时间内准确输入。</p>
        <div class="difficulty-select">
          <label>选择难度：</label>
          <select v-model="difficulty" class="select-input">
            <option value="easy">简单 (常用词汇)</option>
            <option value="medium">中等 (技术词汇)</option>
            <option value="hard">困难 (专业术语)</option>
          </select>
        </div>
        <button @click="startTest" class="btn-start">开始测试</button>
      </div>

      <div v-else-if="finished" class="result-section">
        <h2>测试完成!</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ wpm }}</span>
            <span class="stat-label">每分钟字数 (WPM)</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ accuracy }}%</span>
            <span class="stat-label">准确率</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ timeSpent }}s</span>
            <span class="stat-label">用时</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ correctChars }}/{{ totalChars }}</span>
            <span class="stat-label">正确/总字符</span>
          </div>
        </div>
        <div class="grade-section">
          <span class="grade" :class="getGradeClass(wpm)">{{ getGrade(wpm) }}</span>
        </div>
        <button @click="resetTest" class="btn-restart">重新测试</button>
      </div>

      <div v-else class="typing-section">
        <div class="stats-bar">
          <span>用时: {{ formatTime(elapsedTime) }}</span>
          <span>正确: {{ correctChars }}</span>
          <span>错误: {{ errorCount }}</span>
        </div>

        <div class="text-display">
          <span
            v-for="(char, index) in displayText"
            :key="index"
            :class="getCharClass(index)"
          >{{ char }}</span>
        </div>

        <div class="input-area">
          <textarea
            ref="inputField"
            v-model="userInput"
            @input="checkInput"
            @keydown="handleKeyDown"
            class="text-input"
            rows="3"
            placeholder="请在这里输入..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>评分标准</h3>
      <div class="grade-scale">
        <div class="grade-item">
          <span class="grade-label">初级</span>
          <span class="grade-range">0-30 WPM</span>
        </div>
        <div class="grade-item">
          <span class="grade-label">及格</span>
          <span class="grade-range">30-60 WPM</span>
        </div>
        <div class="grade-item">
          <span class="grade-label">良好</span>
          <span class="grade-range">60-90 WPM</span>
        </div>
        <div class="grade-item">
          <span class="grade-label">优秀</span>
          <span class="grade-range">90-120 WPM</span>
        </div>
        <div class="grade-item">
          <span class="grade-label">专业</span>
          <span class="grade-range">120+ WPM</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const difficulty = ref('easy')
const started = ref(false)
const finished = ref(false)
const userInput = ref('')
const displayText = ref('')
const currentIndex = ref(0)
const correctChars = ref(0)
const errorCount = ref(0)
const elapsedTime = ref(0)
const timeSpent = ref(0)
const totalChars = ref(0)
const inputField = ref(null)
let timerInterval = null

const texts = {
  easy: [
    'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
    'A journey of a thousand miles begins with a single step. Keep moving forward.',
    'Practice makes perfect. The more you practice, the better you become at typing.',
    'Time flies when you are having fun. Enjoy every moment of your typing practice.'
  ],
  medium: [
    'JavaScript is a versatile programming language used for web development, mobile apps, and server-side applications.',
    'Git is a distributed version control system for tracking changes in source code during software development.',
    'API endpoints allow different software applications to communicate with each other over a network.',
    'Responsive design ensures websites look good on all devices, from mobile phones to desktop computers.'
  ],
  hard: [
    'Asynchronous programming in JavaScript uses promises and async/await to handle operations without blocking the main thread.',
    'Machine learning algorithms enable computers to learn from data and make predictions without explicit programming.',
    'Container orchestration with Kubernetes automates deployment, scaling, and management of containerized applications.',
    'Blockchain technology provides a decentralized ledger for recording transactions across multiple computers.'
  ]
}

const wpm = computed(() => {
  if (timeSpent.value === 0) return 0
  const minutes = timeSpent.value / 60
  return Math.round(correctChars.value / 5 / minutes)
})

const accuracy = computed(() => {
  if (totalChars.value === 0) return 100
  return Math.round((correctChars.value / totalChars.value) * 100)
})

function startTest() {
  const textArray = texts[difficulty.value]
  displayText.value = textArray[Math.floor(Math.random() * textArray.length)].split('')
  totalChars.value = displayText.value.length
  started.value = true
  finished.value = false
  currentIndex.value = 0
  correctChars.value = 0
  errorCount.value = 0
  elapsedTime.value = 0
  userInput.value = ''

  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)

  nextTick(() => {
    inputField.value?.focus()
  })
}

function checkInput() {
  if (!started.value || finished.value) return

  const input = userInput.value
  const targetLength = displayText.value.length

  if (input.length > targetLength) {
    userInput.value = input.substring(0, targetLength)
    return
  }

  correctChars.value = 0
  errorCount.value = 0

  for (let i = 0; i < input.length; i++) {
    if (input[i] === displayText.value[i]) {
      correctChars.value++
    } else {
      errorCount.value++
    }
  }

  if (input.length === displayText.value.length) {
    finishTest()
  }
}

function handleKeyDown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

function finishTest() {
  finished.value = true
  timeSpent.value = elapsedTime.value
  clearInterval(timerInterval)
}

function resetTest() {
  started.value = false
  finished.value = false
  userInput.value = ''
  clearInterval(timerInterval)
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getCharClass(index) {
  if (index >= userInput.value.length) {
    return ''
  }
  if (userInput.value[index] === displayText.value[index]) {
    return 'correct'
  }
  return 'incorrect'
}

function getGrade(wpm) {
  if (wpm < 30) return '初级'
  if (wpm < 60) return '及格'
  if (wpm < 90) return '良好'
  if (wpm < 120) return '优秀'
  return '专业'
}

function getGradeClass(wpm) {
  if (wpm < 30) return 'grade-beginner'
  if (wpm < 60) return 'grade-pass'
  if (wpm < 90) return 'grade-good'
  if (wpm < 120) return 'grade-excellent'
  return 'grade-pro'
}

onMounted(() => {
  displayText.value = texts.easy[0].split('')
})
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

.tester-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.start-section,
.result-section,
.typing-section {
  text-align: center;
}

.start-section h2,
.result-section h2 {
  margin-bottom: 1rem;
}

.start-section p {
  color: #666;
  margin-bottom: 1.5rem;
}

.difficulty-select {
  margin-bottom: 1.5rem;
}

.difficulty-select label {
  margin-right: 0.5rem;
  font-weight: 500;
}

.select-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-start,
.btn-restart {
  padding: 1rem 3rem;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover,
.btn-restart:hover {
  background: #1d4ed8;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #e5e5e5;
  border-radius: 8px;
  font-weight: 500;
}

.text-display {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.3rem;
  font-family: monospace;
  line-height: 2;
  text-align: left;
  margin-bottom: 1.5rem;
  min-height: 100px;
}

.text-display span {
  transition: color 0.1s;
}

.text-display span.correct {
  color: #10b981;
}

.text-display span.incorrect {
  color: #dc2626;
  background: #fee2e2;
}

.input-area {
  margin-bottom: 1rem;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-family: monospace;
  box-sizing: border-box;
  resize: none;
}

.text-input:focus {
  outline: none;
  border-color: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
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
  font-size: 0.85rem;
  color: #666;
}

.grade-section {
  margin: 2rem 0;
}

.grade {
  display: inline-block;
  padding: 1rem 3rem;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: 700;
}

.grade-beginner { background: #fef3c7; color: #92400e; }
.grade-pass { background: #dbeafe; color: #1e40af; }
.grade-good { background: #dcfce7; color: #166534; }
.grade-excellent { background: #a78bfa; color: #5b21b6; }
.grade-pro { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
}

.grade-scale {
  display: flex;
  justify-content: space-between;
}

.grade-item {
  text-align: center;
}

.grade-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.grade-range {
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .tester-card,
.dark .info-section {
  background: #262626;
}

.dark .text-display {
  background: #1a1a1a;
}

.dark .stats-bar {
  background: #333;
}

.dark .stat-card {
  background: #1a1a1a;
}

.dark .select-input,
.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .grade-scale {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
