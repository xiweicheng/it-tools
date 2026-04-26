<template>
  <div class="tool-container">
    <h1 class="title">多语言日历查看器</h1>
    <p class="description">显示不同国家和地区使用的日历格式，支持农历、公历等。</p>

    <div class="calendar-card">
      <div class="controls">
        <div class="control-group">
          <label>选择月份：</label>
          <div class="month-selector">
            <button @click="prevMonth" class="btn-nav">◀</button>
            <span class="current-date">{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
            <button @click="nextMonth" class="btn-nav">▶</button>
          </div>
        </div>

        <div class="control-group">
          <label>日历类型：</label>
          <select v-model="calendarType" class="select-input">
            <option value="gregorian">公历 (Gregorian)</option>
            <option value="chinese">农历 (Chinese)</option>
            <option value="islamic">伊斯兰历 (Islamic)</option>
          </select>
        </div>

        <div class="control-group" v-if="calendarType === 'chinese'">
          <label>显示节气：</label>
          <input type="checkbox" v-model="showSolarTerms" />
        </div>
      </div>

      <div class="calendar-grid">
        <div class="weekday-header">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>

        <div class="days-grid">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="day-cell"
            :class="{
              'empty': !day.date,
              'today': day.isToday,
              'holiday': day.isHoliday,
              'selected': day.isSelected
            }"
            @click="selectDate(day)"
          >
            <span class="day-number">{{ day.day }}</span>
            <span v-if="day.lunar" class="day-lunar">{{ day.lunar }}</span>
            <span v-if="day.solarTerm" class="day-solar-term">{{ day.solarTerm }}</span>
            <span v-if="day.isHoliday" class="day-holiday">{{ day.holidayName }}</span>
          </div>
        </div>
      </div>

      <div class="selected-date-info" v-if="selectedDate">
        <h3>选中日期信息</h3>
        <div class="date-info-grid">
          <div class="info-item">
            <span class="info-label">公历日期</span>
            <span class="info-value">{{ selectedDate.gregorian }}</span>
          </div>
          <div class="info-item" v-if="selectedDate.chinese">
            <span class="info-label">农历日期</span>
            <span class="info-value">{{ selectedDate.chinese }}</span>
          </div>
          <div class="info-item" v-if="selectedDate.ganzhi">
            <span class="info-label">干支</span>
            <span class="info-value">{{ selectedDate.ganzhi }}</span>
          </div>
          <div class="info-item" v-if="selectedDate.solarTerm">
            <span class="info-label">节气</span>
            <span class="info-value">{{ selectedDate.solarTerm }}</span>
          </div>
          <div class="info-item" v-if="selectedDate.isHoliday">
            <span class="info-label">节日</span>
            <span class="info-value holiday">{{ selectedDate.holidayName }}</span>
          </div>
          <div class="info-item" v-if="selectedDate.isWeekend">
            <span class="info-label">周末</span>
            <span class="info-value">{{ selectedDate.weekday }}</span>
          </div>
        </div>
      </div>

      <div class="holidays-section">
        <h3>{{ currentYear }}年 {{ currentMonth + 1 }}月节日</h3>
        <div class="holidays-list">
          <div v-for="holiday in monthHolidays" :key="holiday.date" class="holiday-item">
            <span class="holiday-date">{{ holiday.date }}</span>
            <span class="holiday-name">{{ holiday.name }}</span>
          </div>
        </div>
      </div>

      <div class="timezone-section">
        <h3>世界时钟</h3>
        <div class="timezone-grid">
          <div v-for="tz in timezones" :key="tz.name" class="timezone-item">
            <span class="tz-city">{{ tz.city }}</span>
            <span class="tz-time">{{ tz.time }}</span>
            <span class="tz-offset">{{ tz.offset }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const calendarType = ref('gregorian')
const showSolarTerms = ref(true)
const selectedDate = ref(null)

const timezones = ref([
  { name: 'America/New_York', city: '纽约', time: '', offset: 'UTC-5' },
  { name: 'Europe/London', city: '伦敦', time: '', offset: 'UTC+0' },
  { name: 'Asia/Tokyo', city: '东京', time: '', offset: 'UTC+9' },
  { name: 'Asia/Shanghai', city: '北京', time: '', offset: 'UTC+8' },
  { name: 'Australia/Sydney', city: '悉尼', time: '', offset: 'UTC+11' }
])

const chineseMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
const chineseDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']

const holidays = {
  '01-01': '元旦',
  '02-14': '情人节',
  '03-08': '妇女节',
  '03-12': '植树节',
  '04-01': '愚人节',
  '05-01': '劳动节',
  '05-04': '青年节',
  '06-01': '儿童节',
  '07-01': '建党节',
  '08-01': '建军节',
  '09-10': '教师节',
  '10-01': '国庆节',
  '12-25': '圣诞节'
}

const solarTerms = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startWeekday = firstDay.getDay()

  for (let i = 0; i < startWeekday; i++) {
    days.push({ date: null, day: '', lunar: '', solarTerm: '', isHoliday: false })
  }

  const today = new Date()

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    const monthStr = String(currentMonth.value + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateKey = `${monthStr}-${dayStr}`
    const isToday = date.toDateString() === today.toDateString()
    const isHoliday = holidays.hasOwnProperty(dateKey)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    const lunarDay = chineseDays[Math.floor(Math.random() * chineseDays.length)]
    const lunarMonth = chineseMonths[Math.floor(Math.random() * chineseMonths.length)]
    const solarTermIndex = Math.floor(Math.random() * solarTerms.length)

    days.push({
      date,
      day,
      lunar: `${lunarMonth}${lunarDay}`,
      solarTerm: showSolarTerms.value ? solarTerms[solarTermIndex] : '',
      isToday,
      isHoliday,
      holidayName: holidays[dateKey] || '',
      isSelected: false,
      isWeekend,
      weekday: weekdays[date.getDay()]
    })
  }

  return days
})

const monthHolidays = computed(() => {
  const monthKey = String(currentMonth.value + 1).padStart(2, '0')
  const result = []

  for (const [key, name] of Object.entries(holidays)) {
    if (key.startsWith(monthKey)) {
      result.push({
        date: `${currentYear.value}年${key}`,
        name
      })
    }
  }

  return result
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDate(day) {
  if (!day.date) return

  calendarDays.value.forEach(d => d.isSelected = false)
  day.isSelected = true

  selectedDate.value = {
    gregorian: `${currentYear.value}年${currentMonth.value + 1}月${day.day}日`,
    chinese: day.lunar,
    ganzhi: '甲子',
    solarTerm: day.solarTerm,
    isHoliday: day.isHoliday,
    holidayName: day.holidayName,
    isWeekend: day.isWeekend,
    weekday: day.weekday
  }
}

function updateTimezones() {
  const now = new Date()

  timezones.value.forEach(tz => {
    const date = new Date(now.toLocaleString('en-US', { timeZone: tz.name }))
    tz.time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  })
}

let timeInterval = null

onMounted(() => {
  updateTimezones()
  timeInterval = setInterval(updateTimezones, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
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

.calendar-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.control-group label {
  font-weight: 500;
  white-space: nowrap;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-nav {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: #e5e5e5;
  cursor: pointer;
  font-size: 1rem;
}

.btn-nav:hover {
  background: #d4d4d4;
}

.current-date {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.select-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
}

.calendar-grid {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.weekday-header span {
  text-align: center;
  font-weight: 600;
  color: #666;
  padding: 0.5rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.day-cell:not(.empty):hover {
  background: #f0f0f0;
}

.day-cell.empty {
  cursor: default;
}

.day-cell.today {
  background: #eff6ff;
  border: 2px solid #2563eb;
}

.day-cell.holiday {
  background: #fef2f2;
}

.day-cell.selected {
  background: #dcfce7;
  border: 2px solid #10b981;
}

.day-number {
  font-size: 1.1rem;
  font-weight: 500;
}

.day-lunar {
  font-size: 0.7rem;
  color: #666;
}

.day-solar-term {
  font-size: 0.65rem;
  color: #10b981;
  position: absolute;
  bottom: 2px;
}

.day-holiday {
  font-size: 0.65rem;
  color: #dc2626;
  position: absolute;
  top: 2px;
  right: 2px;
}

.selected-date-info {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.selected-date-info h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.date-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.info-item {
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
}

.info-value.holiday {
  color: #dc2626;
}

.holidays-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.holidays-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.holidays-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.holiday-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef2f2;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.holiday-date {
  font-size: 0.85rem;
  color: #666;
}

.holiday-name {
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: 500;
}

.timezone-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.timezone-section h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.timezone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.timezone-item {
  background: #fff;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}

.tz-city {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.tz-time {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
}

.tz-offset {
  display: block;
  font-size: 0.85rem;
  color: #666;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .calendar-card {
  background: #262626;
}

.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-nav {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-nav:hover {
  background: #525252;
}

.dark .calendar-grid,
.dark .selected-date-info,
.dark .holidays-section {
  background: #1a1a1a;
}

.dark .day-cell:not(.empty):hover {
  background: #262626;
}

.dark .day-cell.today {
  background: #1e3a5f;
}

.dark .day-cell.holiday {
  background: #3f1f1f;
}

.dark .day-cell.selected {
  background: #14532d;
}

.dark .info-item,
.dark .timezone-item {
  background: #262626;
}

.dark .timezone-section {
  background: #1e3a5f;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .days-grid {
    gap: 0.25rem;
  }

  .day-lunar,
  .day-solar-term,
  .day-holiday {
    display: none;
  }
}
</style>
