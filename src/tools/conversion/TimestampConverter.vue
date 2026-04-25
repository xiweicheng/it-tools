<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">时间戳转换器</h1>
      <p class="text-gray-600 dark:text-gray-300">将 Unix 时间戳和日期时间相互转换的工具。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2">Unix 时间戳（秒）</label>
          <input 
            v-model="unixTimestamp"
            type="number"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            placeholder="例如：1716672000"
            @input="convertFromUnix"
          >
          <p class="text-sm text-gray-500 mt-1">当前时间戳：{{ currentTimestamp }}</p>
        </div>
        
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-2">日期时间</label>
          <input 
            v-model="dateTime"
            type="datetime-local"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            @input="convertFromDateTime"
          >
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">转换结果</h3>
        <div class="space-y-2">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">Unix 时间戳（秒）</label>
              <div class="flex">
                <input 
                  :value="results.unix" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.unix)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">Unix 时间戳（毫秒）</label>
              <div class="flex">
                <input 
                  :value="results.unixMs" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.unixMs)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 mt-3">
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">ISO 8601</label>
              <div class="flex">
                <input 
                  :value="results.iso8601" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.iso8601)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">UTC</label>
              <div class="flex">
                <input 
                  :value="results.utc" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.utc)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 mt-3">
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">本地日期时间</label>
              <div class="flex">
                <input 
                  :value="results.local" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.local)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <label class="text-sm text-gray-600 dark:text-gray-400">相对时间</label>
              <div class="flex">
                <input 
                  :value="results.relative" 
                  type="text" 
                  class="flex-1 px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyToClipboard(results.relative)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex gap-4">
        <button 
          @click="setNow" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          设为当前时间
        </button>
        <button 
          @click="clearAll" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TimestampConverter',
  setup() {
    const unixTimestamp = ref('')
    const dateTime = ref('')
    const currentTimestamp = ref('')
    let timer = null
    
    const results = computed(() => {
      let date = null
      
      if (unixTimestamp.value) {
        const ts = parseInt(unixTimestamp.value)
        if (ts > 10000000000) {
          date = new Date(ts)
        } else {
          date = new Date(ts * 1000)
        }
      } else if (dateTime.value) {
        date = new Date(dateTime.value)
      }
      
      if (!date || isNaN(date.getTime())) {
        return {
          unix: '-',
          unixMs: '-',
          iso8601: '-',
          utc: '-',
          local: '-',
          relative: '-'
        }
      }
      
      return {
        unix: Math.floor(date.getTime() / 1000).toString(),
        unixMs: date.getTime().toString(),
        iso8601: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString('zh-CN'),
        relative: getRelativeTime(date)
      }
    })
    
    const getRelativeTime = (date) => {
      const now = new Date()
      const diff = now - date
      const absDiff = Math.abs(diff)
      
      const seconds = Math.floor(absDiff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const months = Math.floor(days / 30)
      const years = Math.floor(days / 365)
      
      const suffix = diff > 0 ? '前' : '后'
      
      if (seconds < 60) return `刚刚${suffix}`
      if (minutes < 60) return `${minutes}分钟${suffix}`
      if (hours < 24) return `${hours}小时${suffix}`
      if (days < 30) return `${days}天${suffix}`
      if (months < 12) return `${months}个月${suffix}`
      return `${years}年${suffix}`
    }
    
    const convertFromUnix = () => {
      if (unixTimestamp.value) {
        const ts = parseInt(unixTimestamp.value)
        const date = ts > 10000000000 ? new Date(ts) : new Date(ts * 1000)
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          dateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
        }
      }
    }
    
    const convertFromDateTime = () => {
      if (dateTime.value) {
        const date = new Date(dateTime.value)
        if (!isNaN(date.getTime())) {
          unixTimestamp.value = Math.floor(date.getTime() / 1000).toString()
        }
      }
    }
    
    const setNow = () => {
      const now = new Date()
      unixTimestamp.value = Math.floor(now.getTime() / 1000).toString()
      convertFromUnix()
    }
    
    const clearAll = () => {
      unixTimestamp.value = ''
      dateTime.value = ''
    }
    
    const copyToClipboard = (text) => {
      if (text === '-') return
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    const updateCurrentTimestamp = () => {
      currentTimestamp.value = Math.floor(Date.now() / 1000).toString()
    }
    
    onMounted(() => {
      updateCurrentTimestamp()
      timer = setInterval(updateCurrentTimestamp, 1000)
    })
    
    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })
    
    return {
      unixTimestamp,
      dateTime,
      currentTimestamp,
      results,
      convertFromUnix,
      convertFromDateTime,
      setNow,
      clearAll,
      copyToClipboard
    }
  }
}
</script>