<template>
  <div class="tool-container">
    <h1 class="title">秒表 / 计时器</h1>
    <p class="description">精确的在线秒表和倒计时计时器，支持毫秒级精度。</p>

    <div class="timer-card">
      <div class="timer-mode-tabs">
        <button :class="{ active: timerMode === 'stopwatch' }" @click="timerMode = 'stopwatch'">
          秒表
        </button>
        <button :class="{ active: timerMode === 'countdown' }" @click="timerMode = 'countdown'">
          倒计时
        </button>
      </div>

      <div class="display-section">
        <div class="time-display">
          <span class="time-value">{{ formattedTime }}</span>
          <span class="time-unit">.{{ milliseconds.toString().padStart(3, '0') }}</span>
        </div>
      </div>

      <div class="stopwatch-section" v-if="timerMode === 'stopwatch'">
        <div class="laps-list" v-if="laps.length > 0">
          <div class="lap-header">计次</div>
          <div v-for="(lap, index) in laps" :key="index" class="lap-item">
            <span class="lap-number">第 {{ lap.number }} 次</span>
            <span class="lap-time">{{ lap.time }}</span>
            <span class="lap-diff" v-if="index > 0">+{{ lap.diff }}</span>
          </div>
        </div>
      </div>

      <div class="countdown-section" v-if="timerMode === 'countdown'">
        <div class="countdown-inputs">
          <div class="input-group">
            <label>小时</label>
            <input v-model.number="countdownHours" type="number" min="0" max="99" />
          </div>
          <div class="input-group">
            <label>分钟</label>
            <input v-model.number="countdownMinutes" type="number" min="0" max="59" />
          </div>
          <div class="input-group">
            <label>秒</label>
            <input v-model.number="countdownSeconds" type="number" min="0" max="59" />
          </div>
        </div>
      </div>

      <div class="controls-section">
        <button
          v-if="!isRunning && timerMode === 'stopwatch'"
          @click="startStopwatch"
          class="btn-start"
        >
          开始
        </button>
        <button
          v-if="isRunning && timerMode === 'stopwatch'"
          @click="stopStopwatch"
          class="btn-stop"
        >
          停止
        </button>
        <button
          v-if="timerMode === 'stopwatch'"
          @click="recordLap"
          class="btn-lap"
          :disabled="!isRunning"
        >
          计次
        </button>
        <button
          v-if="timerMode === 'countdown'"
          @click="startCountdown"
          class="btn-start"
          :disabled="isRunning"
        >
          开始
        </button>
        <button
          v-if="timerMode === 'countdown'"
          @click="pauseCountdown"
          class="btn-stop"
          :disabled="!isRunning"
        >
          暂停
        </button>
        <button @click="resetTimer" class="btn-reset">重置</button>
      </div>

      <div v-if="timerMode === 'countdown' && isFinished" class="alarm-section">
        <div class="alarm-message">⏰ 时间到！</div>
        <button @click="playAlarm" class="btn-alarm">响铃</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const timerMode = ref('stopwatch')
const elapsedTime = ref(0)
const milliseconds = ref(0)
const isRunning = ref(false)
const laps = ref([])
let timerInterval = null

const countdownHours = ref(0)
const countdownMinutes = ref(5)
const countdownSeconds = ref(0)
const countdownRemaining = ref(0)
const isFinished = ref(false)

const formattedTime = computed(() => {
  if (timerMode.value === 'stopwatch') {
    const totalSeconds = Math.floor(elapsedTime.value / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  } else {
    const totalSeconds = Math.floor(countdownRemaining.value / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
})

function pad(num) {
  return num.toString().padStart(2, '0')
}

function startStopwatch() {
  isRunning.value = true
  timerInterval = setInterval(() => {
    elapsedTime.value += 10
    milliseconds.value = (elapsedTime.value % 1000)
  }, 10)
}

function stopStopwatch() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function recordLap() {
  if (!isRunning.value) return
  const totalSeconds = Math.floor(elapsedTime.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const lapTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milliseconds.value.toString().padStart(3, '0')}`

  let diff = lapTime
  if (laps.value.length > 0) {
    const lastLap = laps.value[laps.value.length - 1]
    const lastTotal = timeToMs(lastLap.time)
    const currentTotal = elapsedTime.value
    diff = formatDiff(currentTotal - lastTotal)
  }

  laps.value.push({
    number: laps.value.length + 1,
    time: lapTime,
    diff: diff
  })
}

function timeToMs(timeStr) {
  const match = timeStr.match(/(\d+):(\d+):(\d+)\.(\d+)/)
  if (!match) return 0
  const [, h, m, s, ms] = match.map(Number)
  return (h * 3600 + m * 60 + s) * 1000 + ms
}

function formatDiff(diffMs) {
  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = diffMs % 1000
  return `${pad(minutes)}:${pad(seconds)}.${ms.toString().padStart(3, '0')}`
}

function startCountdown() {
  isFinished.value = false
  countdownRemaining.value = (countdownHours.value * 3600 + countdownMinutes.value * 60 + countdownSeconds.value) * 1000
  isRunning.value = true
  timerInterval = setInterval(() => {
    countdownRemaining.value -= 10
    milliseconds.value = (countdownRemaining.value % 1000)
    if (countdownRemaining.value <= 0) {
      countdownRemaining.value = 0
      isRunning.value = false
      isFinished.value = true
      clearInterval(timerInterval)
      timerInterval = null
    }
  }, 10)
}

function pauseCountdown() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  stopStopwatch()
  elapsedTime.value = 0
  milliseconds.value = 0
  laps.value = []
  countdownRemaining.value = 0
  isFinished.value = false
}

function playAlarm() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 880
  oscillator.type = 'sine'
  gainNode.gain.value = 0.3

  oscillator.start()
  setTimeout(() => {
    oscillator.stop()
    audioContext.close()
  }, 500)
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 600px;
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

.timer-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 2rem;
}

.timer-mode-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e5e5;
}

.timer-mode-tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.timer-mode-tabs button.active {
  background: #2563eb;
  color: white;
}

.display-section {
  text-align: center;
  margin-bottom: 2rem;
}

.time-display {
  font-size: 4rem;
  font-weight: 700;
  font-family: monospace;
  color: #333;
  letter-spacing: 2px;
}

.time-unit {
  font-size: 2rem;
  color: #666;
}

.laps-list {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.lap-header {
  font-weight: 600;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.lap-number {
  color: #666;
  font-size: 0.9rem;
}

.lap-time {
  font-family: monospace;
  font-weight: 600;
}

.lap-diff {
  color: #10b981;
  font-family: monospace;
  font-size: 0.9rem;
}

.countdown-inputs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 80px;
  padding: 0.75rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
}

.controls-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.controls-section button {
  min-width: 100px;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-start {
  background: #10b981;
  color: white;
}

.btn-start:hover:not(:disabled) {
  background: #059669;
}

.btn-stop {
  background: #ef4444;
  color: white;
}

.btn-stop:hover:not(:disabled) {
  background: #dc2626;
}

.btn-lap {
  background: #f59e0b;
  color: white;
}

.btn-lap:hover:not(:disabled) {
  background: #d97706;
}

.btn-lap:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  background: #6b7280;
  color: white;
}

.btn-reset:hover {
  background: #4b5563;
}

.alarm-section {
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
}

.alarm-message {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.btn-alarm {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #f59e0b;
  color: white;
  cursor: pointer;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .timer-card {
  background: #262626;
}

.dark .timer-mode-tabs {
  background: #404040;
}

.dark .time-display {
  color: #e5e5e5;
}

.dark .laps-list {
  background: #1a1a1a;
}

.dark .lap-item {
  border-bottom-color: #333;
}

.dark .input-group input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .alarm-section {
  background: #451a03;
}
</style>
