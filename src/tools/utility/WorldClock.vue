<template>
  <div class="tool-container">
    <h1 class="title">世界时钟</h1>
    <p class="description">显示全球多个时区的当前时间，方便跨时区工作参考。</p>

    <div class="clock-card">
      <div class="local-time">
        <h3>本地时间</h3>
        <div class="time-display">
          <span class="time-value">{{ localTime }}</span>
          <span class="time-date">{{ localDate }}</span>
        </div>
        <div class="timezone-name">{{ localTimezone }}</div>
      </div>

      <div class="world-clocks-section">
        <h3>世界时区</h3>
        <div class="clocks-grid">
          <div
            v-for="clock in worldClocks"
            :key="clock.timezone"
            class="clock-item"
            :class="{ 'highlighted': clock.highlighted }"
            @click="toggleHighlight(clock.timezone)"
          >
            <div class="clock-city">{{ clock.city }}</div>
            <div class="clock-time">{{ getClockTime(clock.timezone) }}</div>
            <div class="clock-date">{{ getClockDate(clock.timezone) }}</div>
            <div class="clock-offset">{{ getTimeOffset(clock.timezone) }}</div>
            <span v-if="clock.highlighted" class="highlight-badge">已关注</span>
          </div>
        </div>
      </div>

      <div class="add-clock-section">
        <h3>添加时区</h3>
        <div class="timezone-select">
          <select v-model="selectedTimezone" class="select-input">
            <option v-for="tz in availableTimezones" :key="tz.value" :value="tz.value">
              {{ tz.label }}
            </option>
          </select>
          <button @click="addClock" class="btn-add">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const localTime = ref('')
const localDate = ref('')
const localTimezone = ref('')
const selectedTimezone = ref('')
const worldClocks = ref([
  { timezone: 'America/New_York', city: '纽约', highlighted: false },
  { timezone: 'Europe/London', city: '伦敦', highlighted: false },
  { timezone: 'Asia/Tokyo', city: '东京', highlighted: false },
  { timezone: 'Asia/Shanghai', city: '上海', highlighted: false },
  { timezone: 'Australia/Sydney', city: '悉尼', highlighted: false }
])

const availableTimezones = [
  { value: 'Pacific/Honolulu', label: '太平洋-檀香山 (HST)' },
  { value: 'America/Anchorage', label: '阿拉斯加-安克雷奇 (AKST)' },
  { value: 'America/Los_Angeles', label: '太平洋-洛杉矶 (PST)' },
  { value: 'America/Denver', label: '山地-丹佛 (MST)' },
  { value: 'America/Chicago', label: '中部-芝加哥 (CST)' },
  { value: 'America/New_York', label: '东部-纽约 (EST)' },
  { value: 'America/Sao_Paulo', label: '南美-圣保罗 (BRT)' },
  { value: 'Europe/London', label: '欧洲-伦敦 (GMT)' },
  { value: 'Europe/Paris', label: '欧洲-巴黎 (CET)' },
  { value: 'Europe/Moscow', label: '欧洲-莫斯科 (MSK)' },
  { value: 'Asia/Dubai', label: '亚洲-迪拜 (GST)' },
  { value: 'Asia/Kolkata', label: '亚洲-孟买 (IST)' },
  { value: 'Asia/Bangkok', label: '亚洲-曼谷 (ICT)' },
  { value: 'Asia/Shanghai', label: '亚洲-上海 (CST)' },
  { value: 'Asia/Tokyo', label: '亚洲-东京 (JST)' },
  { value: 'Asia/Seoul', label: '亚洲-首尔 (KST)' },
  { value: 'Australia/Sydney', label: '澳洲-悉尼 (AEDT)' },
  { value: 'Pacific/Auckland', label: '太平洋-奥克兰 (NZDT)' }
]

let updateInterval = null

function updateTime() {
  const now = new Date()

  localTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  localDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  localTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone

  worldClocks.value.forEach(clock => {
    clock.time = getClockTime(clock.timezone)
  })
}

function getClockTime(timezone) {
  return new Date().toLocaleTimeString('zh-CN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

function getClockDate(timezone) {
  return new Date().toLocaleDateString('zh-CN', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })
}

function getTimeOffset(timezone) {
  const now = new Date()
  const localOffset = -now.getTimezoneOffset() / 60
  const targetOffset = -new Date(now.toLocaleString('en-US', { timeZone: timezone })).getTimezoneOffset() / 60
  const diff = targetOffset - localOffset
  const sign = diff >= 0 ? '+' : ''
  return `UTC${sign}${diff}`
}

function toggleHighlight(timezone) {
  const clock = worldClocks.value.find(c => c.timezone === timezone)
  if (clock) {
    clock.highlighted = !clock.highlighted
  }
}

function addClock() {
  if (!selectedTimezone.value) return

  const exists = worldClocks.value.find(c => c.timezone === selectedTimezone.value)
  if (exists) return

  const tzInfo = availableTimezones.find(tz => tz.value === selectedTimezone.value)
  const cityName = tzInfo ? tzInfo.label.split('-')[0].trim() : selectedTimezone.value

  worldClocks.value.push({
    timezone: selectedTimezone.value,
    city: cityName,
    highlighted: false
  })
}

onMounted(() => {
  updateTime()
  updateInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
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

.clock-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.local-time {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.local-time h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  opacity: 0.9;
}

.time-display {
  margin-bottom: 0.5rem;
}

.time-value {
  font-size: 3rem;
  font-weight: 700;
  font-family: monospace;
}

.time-date {
  display: block;
  font-size: 1rem;
  opacity: 0.9;
}

.timezone-name {
  font-size: 0.85rem;
  opacity: 0.8;
}

.world-clocks-section h3,
.add-clock-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.clocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.clock-item {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
}

.clock-item:hover {
  border-color: #667eea;
}

.clock-item.highlighted {
  border-color: #10b981;
  background: #f0fdf4;
}

.clock-city {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.clock-time {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: monospace;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.clock-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.clock-offset {
  font-size: 0.8rem;
  color: #999;
}

.highlight-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
}

.add-clock-section {
  border-top: 1px solid #ddd;
  padding-top: 1.5rem;
}

.timezone-select {
  display: flex;
  gap: 1rem;
}

.select-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #5a6fd6;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .clock-card {
  background: #262626;
}

.dark .clock-item {
  background: #1a1a1a;
}

.dark .clock-item.highlighted {
  background: #14532d;
}

.dark .clock-city {
  color: #e5e5e5;
}

.dark .clock-date {
  color: #a3a3a3;
}

.dark .local-time {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .clocks-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .timezone-select {
    flex-direction: column;
  }
}
</style>
