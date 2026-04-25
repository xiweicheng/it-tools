<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">Cron 表达式生成器</h1>
      <p class="text-gray-600 dark:text-gray-300">生成和验证 Cron 表达式的可视化工具。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Cron 表达式</label>
        <div class="flex">
          <input 
            v-model="cronExpression" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono text-lg"
            placeholder="* * * * *"
            @input="parseCron"
          >
          <button 
            @click="copyExpression" 
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
          >
            复制
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-5 gap-2 mb-6">
        <div class="text-center">
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">分钟</label>
          <input 
            v-model="minutes" 
            type="text" 
            class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text text-center font-mono"
            placeholder="*"
            @input="updateCron"
          >
          <span class="text-xs text-gray-500">0-59</span>
        </div>
        <div class="text-center">
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">小时</label>
          <input 
            v-model="hours" 
            type="text" 
            class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text text-center font-mono"
            placeholder="*"
            @input="updateCron"
          >
          <span class="text-xs text-gray-500">0-23</span>
        </div>
        <div class="text-center">
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">日期</label>
          <input 
            v-model="dayOfMonth" 
            type="text" 
            class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text text-center font-mono"
            placeholder="*"
            @input="updateCron"
          >
          <span class="text-xs text-gray-500">1-31</span>
        </div>
        <div class="text-center">
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">月份</label>
          <input 
            v-model="month" 
            type="text" 
            class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text text-center font-mono"
            placeholder="*"
            @input="updateCron"
          >
          <span class="text-xs text-gray-500">1-12</span>
        </div>
        <div class="text-center">
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">星期</label>
          <input 
            v-model="dayOfWeek" 
            type="text" 
            class="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text text-center font-mono"
            placeholder="*"
            @input="updateCron"
          >
          <span class="text-xs text-gray-500">0-6</span>
        </div>
      </div>
      
      <div v-if="cronDescription" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p class="text-blue-800 dark:text-blue-200">{{ cronDescription }}</p>
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">常用表达式</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button 
            v-for="preset in presets" 
            :key="preset.expression"
            @click="applyPreset(preset.expression)"
            class="p-2 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="font-mono text-sm text-gray-800 dark:text-dark-text">{{ preset.expression }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
          </button>
        </div>
      </div>
      
      <div v-if="nextExecutions.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">接下来 5 次执行时间</h3>
        <ul class="space-y-2">
          <li 
            v-for="(time, index) in nextExecutions" 
            :key="index"
            class="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span class="text-gray-600 dark:text-gray-400">#{{ index + 1 }}:</span>
            <span class="ml-2 text-gray-800 dark:text-dark-text">{{ time }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">Cron 表达式格式说明</h3>
      <div class="space-y-2 text-gray-600 dark:text-gray-300">
        <div><strong>语法：</strong>分 时 日 月 周</div>
        <div><strong>特殊字符：</strong></div>
        <ul class="ml-4 space-y-1">
          <li><code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">*</code> - 任意值</li>
          <li><code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">,</code> - 值列表 (1,3,5)</li>
          <li><code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">-</code> - 范围 (1-5)</li>
          <li><code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">/</code> - 步长 (*/5)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CronGenerator',
  setup() {
    const cronExpression = ref('* * * * *')
    const minutes = ref('*')
    const hours = ref('*')
    const dayOfMonth = ref('*')
    const month = ref('*')
    const dayOfWeek = ref('*')
    const error = ref('')
    const nextExecutions = ref([])
    
    const presets = [
      { expression: '* * * * *', description: '每分钟' },
      { expression: '0 * * * *', description: '每小时整点' },
      { expression: '0 0 * * *', description: '每天午夜' },
      { expression: '0 0 * * 0', description: '每周日午夜' },
      { expression: '0 0 1 * *', description: '每月第一天的午夜' },
      { expression: '*/5 * * * *', description: '每 5 分钟' },
      { expression: '0 */2 * * *', description: '每 2 小时' },
      { expression: '0 9-17 * * 1-5', description: '工作日 9 点到 17 点每整点' }
    ]
    
    const cronDescription = computed(() => {
      if (!cronExpression.value) return ''
      
      const parts = cronExpression.value.trim().split(/\s+/)
      if (parts.length !== 5) return ''
      
      const [min, hr, dom, mon, dow] = parts
      
      let desc = ''
      
      // Minutes
      if (min === '*') desc += '每分钟'
      else if (min.includes('/')) desc += `每 ${min.split('/')[1]} 分钟`
      else desc += `在第 ${min} 分钟`
      
      // Hours
      if (hr === '*') desc += '、每小时'
      else if (hr.includes('/')) desc += `、每 ${hr.split('/')[1]} 小时`
      else desc += `、第 ${hr} 小时`
      
      // Day of month
      if (dom !== '*') {
        if (dom.includes('/')) desc += `、每 ${dom.split('/')[1]} 天`
        else desc += `、第 ${dom} 天`
      }
      
      // Month
      if (mon !== '*') {
        if (mon.includes('/')) desc += `、每 ${mon.split('/')[1]} 个月`
        else desc += `、${mon} 月`
      }
      
      // Day of week
      if (dow !== '*') {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        if (dow.includes(',')) {
          const dayList = dow.split(',').map(d => days[parseInt(d)]).join('、')
          desc += `、${dayList}`
        } else if (dow.includes('-')) {
          const [start, end] = dow.split('-').map(Number)
          desc += `、${days[start]}到${days[end]}`
        } else {
          desc += `、${days[parseInt(dow)]}`
        }
      }
      
      return desc || '无效的表达式'
    })
    
    const updateCron = () => {
      cronExpression.value = `${minutes.value} ${hours.value} ${dayOfMonth.value} ${month.value} ${dayOfWeek.value}`
      parseCron()
    }
    
    const parseCron = () => {
      error.value = ''
      nextExecutions.value = []
      
      const parts = cronExpression.value.trim().split(/\s+/)
      if (parts.length !== 5) {
        error.value = 'Cron 表达式必须包含 5 个字段：分 时 日 月 周'
        return
      }
      
      const [min, hr, dom, mon, dow] = parts
      
      // Basic validation
      if (!isValidField(min, 0, 59)) {
        error.value = '分钟字段无效（有效范围：0-59）'
        return
      }
      if (!isValidField(hr, 0, 23)) {
        error.value = '小时字段无效（有效范围：0-23）'
        return
      }
      if (!isValidField(dom, 1, 31)) {
        error.value = '日期字段无效（有效范围：1-31）'
        return
      }
      if (!isValidField(mon, 1, 12)) {
        error.value = '月份字段无效（有效范围：1-12）'
        return
      }
      if (!isValidField(dow, 0, 6)) {
        error.value = '星期字段无效（有效范围：0-6，0 表示周日）'
        return
      }
      
      // Update individual fields
      minutes.value = min
      hours.value = hr
      dayOfMonth.value = dom
      month.value = mon
      dayOfWeek.value = dow
      
      // Calculate next executions
      calculateNextExecutions()
    }
    
    const isValidField = (value, min, max) => {
      if (value === '*') return true
      if (value.includes('/')) {
        const [range, step] = value.split('/')
        if (!isValidField(range, min, max)) return false
        if (isNaN(parseInt(step)) || parseInt(step) < 1) return false
        return true
      }
      if (value.includes(',')) {
        return value.split(',').every(v => isValidField(v, min, max))
      }
      if (value.includes('-')) {
        const [start, end] = value.split('-').map(Number)
        if (isNaN(start) || isNaN(end)) return false
        return start >= min && end <= max && start <= end
      }
      const num = parseInt(value)
      return !isNaN(num) && num >= min && num <= max
    }
    
    const calculateNextExecutions = () => {
      const executions = []
      const now = new Date()
      let current = new Date(now)
      current.setSeconds(0)
      current.setMilliseconds(0)
      
      const parts = cronExpression.value.trim().split(/\s+/)
      const [min, hr, dom, mon, dow] = parts
      
      for (let i = 0; i < 10 && executions.length < 5; i++) {
        current.setMinutes(current.getMinutes() + 1)
        
        if (matchesCron(current, min, hr, dom, mon, dow)) {
          executions.push(formatDate(current))
        }
      }
      
      nextExecutions.value = executions
    }
    
    const matchesCron = (date, min, hr, dom, mon, dow) => {
      return matchesField(date.getMinutes(), min, 0, 59) &&
             matchesField(date.getHours(), hr, 0, 23) &&
             matchesField(date.getDate(), dom, 1, 31) &&
             matchesField(date.getMonth() + 1, mon, 1, 12) &&
             matchesField(date.getDay(), dow, 0, 6)
    }
    
    const matchesField = (value, field, min, max) => {
      if (field === '*') return true
      
      if (field.includes('/')) {
        const [range, step] = field.split('/')
        const stepNum = parseInt(step)
        if (range === '*') {
          return value % stepNum === 0
        }
        const [start, end] = range.split('-').map(Number)
        return value >= start && value <= end && (value - start) % stepNum === 0
      }
      
      if (field.includes(',')) {
        return field.split(',').some(f => matchesField(value, f, min, max))
      }
      
      if (field.includes('-')) {
        const [start, end] = field.split('-').map(Number)
        return value >= start && value <= end
      }
      
      return parseInt(field) === value
    }
    
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
    
    const applyPreset = (expression) => {
      cronExpression.value = expression
      parseCron()
    }
    
    const copyExpression = () => {
      if (!cronExpression.value) return
      navigator.clipboard.writeText(cronExpression.value)
        .then(() => {
          alert('Cron 表达式已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    // Initialize
    parseCron()
    
    return {
      cronExpression,
      minutes,
      hours,
      dayOfMonth,
      month,
      dayOfWeek,
      error,
      nextExecutions,
      presets,
      cronDescription,
      updateCron,
      parseCron,
      applyPreset,
      copyExpression
    }
  }
}
</script>