<template>
  <div class="age-calculator">
    <h2>年龄计算器</h2>

    <div class="calculator-container">
      <div class="input-section">
        <h3>输入日期</h3>
        <div class="control-group">
          <label>出生日期</label>
          <input type="date" v-model="birthDate" @change="calculate" />
        </div>

        <div class="control-group">
          <label>计算到日期 (可选)</label>
          <input type="date" v-model="targetDate" @change="calculate" />
          <button @click="setToday" class="today-btn">设置为今天</button>
        </div>
      </div>

      <div class="result-section" v-if="result">
        <h3>计算结果</h3>
        <div class="result-grid">
          <div class="result-card primary">
            <span class="result-label">年龄</span>
            <span class="result-value">{{ result.years }} 岁</span>
          </div>
          <div class="result-card">
            <span class="result-label">详细年龄</span>
            <span class="result-value">{{ result.totalYears }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">月数</span>
            <span class="result-value">{{ result.months }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">天数</span>
            <span class="result-value">{{ result.days }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">周数</span>
            <span class="result-value">{{ result.weeks }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">小时</span>
            <span class="result-value">{{ result.hours }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">分钟</span>
            <span class="result-value">{{ result.minutes }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">秒数</span>
            <span class="result-value">{{ result.seconds }}</span>
          </div>
        </div>

        <div class="next-birthday" v-if="result.nextBirthday">
          <h4>下一个生日</h4>
          <p>{{ result.nextBirthday.date }} ({{ result.nextBirthday.dayOfWeek }})</p>
          <p class="birthday-info">还有 {{ result.nextBirthday.daysLeft }} 天</p>
        </div>
      </div>

      <div class="empty-state" v-else>
        <p>请选择出生日期开始计算</p>
      </div>
    </div>

    <div class="zodiac-section" v-if="result">
      <h3>属相与星座</h3>
      <div class="zodiac-grid">
        <div class="zodiac-item">
          <span class="zodiac-icon">{{ result.chineseZodiac.animal }}</span>
          <span class="zodiac-label">属相</span>
          <span class="zodiac-value">{{ result.chineseZodiac.name }}</span>
        </div>
        <div class="zodiac-item">
          <span class="zodiac-icon">{{ result.zodiac.sign }}</span>
          <span class="zodiac-label">星座</span>
          <span class="zodiac-value">{{ result.zodiac.name }}</span>
        </div>
      </div>
    </div>

    <div class="milestones" v-if="result && result.years > 0">
      <h3>人生里程碑</h3>
      <div class="milestones-list">
        <div
          v-for="milestone in milestones"
          :key="milestone.age"
          class="milestone-item"
          :class="{ passed: result.years >= milestone.age }"
        >
          <span class="milestone-age">{{ milestone.age }}岁</span>
          <span class="milestone-name">{{ milestone.name }}</span>
          <span class="milestone-status">{{ result.years >= milestone.age ? '✓' : '○' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const birthDate = ref('')
const targetDate = ref('')

const result = ref(null)

const milestones = [
  { age: 1, name: '周岁' },
  { age: 6, name: '入学' },
  { age: 12, name: '少年' },
  { age: 18, name: '成年' },
  { age: 25, name: '青年' },
  { age: 30, name: '而立' },
  { age: 40, name: '不惑' },
  { age: 50, name: '知天命' },
  { age: 60, name: '花甲' },
  { age: 70, name: '古稀' },
  { age: 80, name: '杖朝' },
  { age: 90, name: '鲐背' },
  { age: 100, name: '期颐' }
]

const chineseZodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const zodiacSigns = [
  { name: '白羊座', sign: '♈', start: [3, 21], end: [4, 19] },
  { name: '金牛座', sign: '♉', start: [4, 20], end: [5, 20] },
  { name: '双子座', sign: '♊', start: [5, 21], end: [6, 21] },
  { name: '巨蟹座', sign: '♋', start: [6, 22], end: [7, 22] },
  { name: '狮子座', sign: '♌', start: [7, 23], end: [8, 22] },
  { name: '处女座', sign: '♍', start: [8, 23], end: [9, 22] },
  { name: '天秤座', sign: '♎', start: [9, 23], end: [10, 23] },
  { name: '天蝎座', sign: '♏', start: [10, 24], end: [11, 22] },
  { name: '射手座', sign: '♐', start: [11, 23], end: [12, 21] },
  { name: '摩羯座', sign: '♑', start: [12, 22], end: [1, 19] },
  { name: '水瓶座', sign: '♒', start: [1, 20], end: [2, 18] },
  { name: '双鱼座', sign: '♓', start: [2, 19], end: [3, 20] }
]

const setToday = () => {
  targetDate.value = new Date().toISOString().split('T')[0]
  calculate()
}

const getChineseZodiac = (date) => {
  const year = date.getFullYear()
  const startYear = 1900
  const zodiacIndex = (year - startYear) % 12
  return {
    name: chineseZodiacAnimals[zodiacIndex],
    animal: ['🐭', '🐮', '🐯', '🐰', '🐉', '🐍', '🐴', '🐑', '🐵', '🐔', '�狗', '🐷'][zodiacIndex]
  }
}

const getZodiac = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  for (const sign of zodiacSigns) {
    if (
      (month === sign.start[0] && day >= sign.start[1]) ||
      (month === sign.end[0] && day <= sign.end[1])
    ) {
      return { name: sign.name, sign: sign.sign }
    }
  }
  return { name: '未知', sign: '?' }
}

const calculate = () => {
  if (!birthDate.value) {
    result.value = null
    return
  }

  const birth = new Date(birthDate.value)
  const today = targetDate.value ? new Date(targetDate.value) : new Date()

  if (birth > today) {
    result.value = null
    return
  }

  const diffMs = today - birth
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalSeconds = Math.floor(diffMs / 1000)

  const years = today.getFullYear() - birth.getFullYear()
  const months = (today.getMonth() - birth.getMonth()) + (years * 12)
  const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24)) % 30

  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24))

  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  result.value = {
    years,
    totalYears: `${years} 年 ${months % 12} 月 ${days} 天`,
    months,
    days: totalDays,
    weeks: totalWeeks,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
    chineseZodiac: getChineseZodiac(birth),
    zodiac: getZodiac(birth),
    nextBirthday: {
      date: nextBirthday.toLocaleDateString('zh-CN'),
      dayOfWeek: weekdays[nextBirthday.getDay()],
      daysLeft: daysToBirthday
    }
  }
}
</script>

<style scoped>
.age-calculator {
  padding: 20px;
}
.calculator-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section,
.result-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.control-group {
  margin-bottom: 20px;
}
.control-group > label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.control-group input[type="date"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}
.today-btn {
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}
.result-card {
  background: var(--bg-secondary);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}
.result-card.primary {
  background: var(--primary-color);
  color: white;
}
.result-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}
.result-card.primary .result-label {
  color: rgba(255, 255, 255, 0.8);
}
.result-value {
  font-size: 20px;
  font-weight: bold;
}
.next-birthday {
  margin-top: 20px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 8px;
  text-align: center;
}
.next-birthday h4 {
  margin: 0 0 10px 0;
}
.birthday-info {
  color: var(--primary-color);
  font-weight: bold;
}
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-secondary);
}
.zodiac-section,
.milestones {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.zodiac-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.zodiac-item {
  text-align: center;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
}
.zodiac-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}
.zodiac-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}
.zodiac-value {
  font-size: 18px;
  font-weight: bold;
}
.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.milestone-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.milestone-item.passed {
  background: rgba(76, 175, 80, 0.1);
}
.milestone-age {
  font-weight: bold;
  color: var(--primary-color);
  width: 50px;
}
.milestone-name {
  flex: 1;
}
.milestone-status {
  font-size: 18px;
}
.milestone-item.passed .milestone-status {
  color: var(--primary-color);
}
@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
  }
  .zodiac-grid {
    grid-template-columns: 1fr;
  }
}
</style>
