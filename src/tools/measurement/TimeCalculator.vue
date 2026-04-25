<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">时间计算器</h1>
      <p class="text-gray-600 dark:text-gray-300">计算日期时间之间的差值，或在某个日期上加减时间。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">计算时差</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-2">开始时间</label>
            <input 
              v-model="startDateTime" 
              type="datetime-local" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-2">结束时间</label>
            <input 
              v-model="endDateTime" 
              type="datetime-local" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            >
          </div>
        </div>
        
        <button 
          @click="calculateDiff" 
          class="mb-4 px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          计算时差
        </button>
        
        <div v-if="timeDiff" class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">时差结果</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ timeDiff.days }}</div>
              <div class="text-sm text-gray-500">天</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ timeDiff.hours }}</div>
              <div class="text-sm text-gray-500">小时</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ timeDiff.minutes }}</div>
              <div class="text-sm text-gray-500">分钟</div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ timeDiff.seconds }}</div>
              <div class="text-sm text-gray-500">秒</div>
            </div>
          </div>
          <div class="mt-3 text-center text-blue-700 dark:text-blue-300">
            共 {{ timeDiff.totalDays }} 天 或 {{ timeDiff.totalHours }} 小时 或 {{ timeDiff.totalMinutes }} 分钟
          </div>
        </div>
      </div>
      
      <hr class="my-6 border-gray-300 dark:border-gray-600">
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">日期加减</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-2">基准日期</label>
            <input 
              v-model="baseDate" 
              type="date" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-2">加减天数</label>
            <input 
              v-model.number="addDays" 
              type="number" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              placeholder="正数加，负数减"
            >
          </div>
        </div>
        
        <button 
          @click="calculateDate" 
          class="mb-4 px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          计算日期
        </button>
        
        <div v-if="resultDate" class="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div class="text-lg font-semibold text-green-800 dark:text-green-200">
            结果日期：{{ resultDate }}
          </div>
          <div class="text-sm text-green-700 dark:text-green-300 mt-1">
            星期{{ resultWeekday }}
          </div>
        </div>
      </div>
      
      <hr class="my-6 border-gray-300 dark:border-gray-600">
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">常用日期快捷操作</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button 
            @click="setToday"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            今天
          </button>
          <button 
            @click="setTomorrow"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            明天
          </button>
          <button 
            @click="setNextWeek"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            一周后
          </button>
          <button 
            @click="setNextMonth"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            一个月后
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TimeCalculator',
  setup() {
    const startDateTime = ref('')
    const endDateTime = ref('')
    const baseDate = ref('')
    const addDays = ref(0)
    const timeDiff = ref(null)
    const resultDate = ref('')
    const resultWeekday = ref('')
    
    const calculateDiff = () => {
      if (!startDateTime.value || !endDateTime.value) return
      
      const start = new Date(startDateTime.value)
      const end = new Date(endDateTime.value)
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return
      
      const diff = Math.abs(end - start)
      const diffSeconds = Math.floor(diff / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      timeDiff.value = {
        days: diffDays,
        hours: diffHours % 24,
        minutes: diffMinutes % 60,
        seconds: diffSeconds % 60,
        totalDays: (diff / (1000 * 60 * 60 * 24)).toFixed(2),
        totalHours: (diff / (1000 * 60 * 60)).toFixed(2),
        totalMinutes: (diff / (1000 * 60)).toFixed(2)
      }
    }
    
    const calculateDate = () => {
      if (!baseDate.value) return
      
      const date = new Date(baseDate.value)
      if (isNaN(date.getTime())) return
      
      date.setDate(date.getDate() + (addDays.value || 0))
      
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      resultDate.value = `${year}-${month}-${day}`
      
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      resultWeekday.value = weekdays[date.getDay()]
    }
    
    const setToday = () => {
      const today = new Date()
      baseDate.value = today.toISOString().split('T')[0]
      addDays.value = 0
      calculateDate()
    }
    
    const setTomorrow = () => {
      const today = new Date()
      today.setDate(today.getDate() + 1)
      baseDate.value = today.toISOString().split('T')[0]
      addDays.value = 0
      calculateDate()
    }
    
    const setNextWeek = () => {
      const today = new Date()
      today.setDate(today.getDate() + 7)
      baseDate.value = today.toISOString().split('T')[0]
      addDays.value = 0
      calculateDate()
    }
    
    const setNextMonth = () => {
      const today = new Date()
      today.setMonth(today.getMonth() + 1)
      baseDate.value = today.toISOString().split('T')[0]
      addDays.value = 0
      calculateDate()
    }
    
    return {
      startDateTime,
      endDateTime,
      baseDate,
      addDays,
      timeDiff,
      resultDate,
      resultWeekday,
      calculateDiff,
      calculateDate,
      setToday,
      setTomorrow,
      setNextWeek,
      setNextMonth
    }
  }
}
</script>