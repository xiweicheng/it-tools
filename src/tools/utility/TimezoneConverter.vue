<template>
  <div class="tool-container">
    <h1 class="title">时区转换器</h1>
    <p class="description">在全球不同时区之间转换时间，支持多个城市同时查看。</p>

    <div class="converter-card">
      <div class="base-time-section">
        <h3>基准时间</h3>
        <div class="time-input-group">
          <input
            v-model="baseDate"
            type="date"
            class="date-input"
          />
          <input
            v-model="baseTime"
            type="time"
            class="time-input"
          />
          <select v-model="baseTimezone" class="timezone-select">
            <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">
              {{ tz.label }}
            </option>
          </select>
        </div>
        <button @click="setNow" class="btn-now">使用当前时间</button>
      </div>

      <div class="conversions-section">
        <h3>转换结果</h3>
        <div class="timezone-list">
          <div
            v-for="tz in commonTimezones"
            :key="tz.value"
            class="timezone-item"
            :class="{ active: tz.value === baseTimezone }"
          >
            <div class="tz-info">
              <span class="tz-city">{{ tz.label }}</span>
              <span class="tz-offset">{{ getTimezoneOffset(tz.value) }}</span>
            </div>
            <div class="tz-time">
              {{ convertTime(tz.value) }}
            </div>
          </div>
        </div>
      </div>

      <div class="quick-add">
        <button @click="addCustomTimezone" class="btn-add">+ 添加时区</button>
      </div>
    </div>

    <div class="info-section">
      <h3>常用时区参考</h3>
      <div class="timezone-grid">
        <div class="tz-card">
          <span class="tz-label">北京</span>
          <span class="tz-value">UTC+8</span>
        </div>
        <div class="tz-card">
          <span class="tz-label">东京</span>
          <span class="tz-value">UTC+9</span>
        </div>
        <div class="tz-card">
          <span class="tz-label">纽约</span>
          <span class="tz-value">UTC-5</span>
        </div>
        <div class="tz-card">
          <span class="tz-label">伦敦</span>
          <span class="tz-value">UTC+0</span>
        </div>
        <div class="tz-card">
          <span class="tz-label">洛杉矶</span>
          <span class="tz-value">UTC-8</span>
        </div>
        <div class="tz-card">
          <span class="tz-label">悉尼</span>
          <span class="tz-value">UTC+11</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const baseDate = ref(new Date().toISOString().split('T')[0])
const baseTime = ref(new Date().toTimeString().slice(0, 5))
const baseTimezone = ref('Asia/Shanghai')

const commonTimezones = [
  { value: 'Asia/Shanghai', label: '北京' },
  { value: 'Asia/Tokyo', label: '东京' },
  { value: 'Asia/Seoul', label: '首尔' },
  { value: 'Asia/Singapore', label: '新加坡' },
  { value: 'Asia/Dubai', label: '迪拜' },
  { value: 'Europe/London', label: '伦敦' },
  { value: 'Europe/Paris', label: '巴黎' },
  { value: 'Europe/Berlin', label: '柏林' },
  { value: 'America/New_York', label: '纽约' },
  { value: 'America/Los_Angeles', label: '洛杉矶' },
  { value: 'America/Chicago', label: '芝加哥' },
  { value: 'Australia/Sydney', label: '悉尼' },
  { value: 'Australia/Melbourne', label: '墨尔本' },
  { value: 'Pacific/Auckland', label: '奥克兰' }
]

function setNow() {
  const now = new Date()
  baseDate.value = now.toISOString().split('T')[0]
  baseTime.value = now.toTimeString().slice(0, 5)
}

function convertTime(targetTimezone) {
  try {
    const baseDateTime = new Date(`${baseDate.value}T${baseTime.value}`)

    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

    return formatter.format(baseDateTime)
  } catch (e) {
    return '无效时区'
  }
}

function getTimezoneOffset(tz) {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset'
    })
    const parts = formatter.formatToParts(now)
    const tzPart = parts.find(p => p.type === 'timeZoneName')
    return tzPart ? tzPart.value : ''
  } catch {
    return ''
  }
}

function addCustomTimezone() {
  // Placeholder for adding custom timezone
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
  margin-bottom: 1.5rem;
}

.base-time-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.base-time-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.time-input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.date-input,
.time-input,
.timezone-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.date-input {
  width: 150px;
}

.time-input {
  width: 120px;
}

.timezone-select {
  flex: 1;
}

.btn-now {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-now:hover {
  background: #1d4ed8;
}

.conversions-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.timezone-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timezone-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  transition: all 0.2s;
}

.timezone-item.active {
  background: #eff6ff;
  border: 2px solid #2563eb;
}

.tz-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tz-city {
  font-weight: 600;
}

.tz-offset {
  font-size: 0.85rem;
  color: #666;
}

.tz-time {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.quick-add {
  margin-top: 1rem;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-add:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin: 0 0 1rem;
}

.timezone-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.tz-card {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tz-label {
  font-weight: 500;
}

.tz-value {
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card,
.dark .info-section {
  background: #262626;
}

.dark .base-time-section,
.dark .timezone-item,
.dark .tz-card {
  background: #1a1a1a;
}

.dark .date-input,
.dark .time-input,
.dark .timezone-select {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .time-input-group {
    flex-wrap: wrap;
  }

  .date-input,
  .time-input,
  .timezone-select {
    width: 100%;
  }

  .timezone-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
