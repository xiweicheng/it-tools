<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">正则表达式测试器</h1>
      <p class="text-gray-600 dark:text-gray-300">在线测试正则表达式，实时匹配高亮显示。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">正则表达式</label>
        <div class="flex">
          <input 
            v-model="pattern" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono"
            placeholder="输入正则表达式，例如：\d+"
            @input="testRegex"
          >
          <div class="flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <input 
              v-model="flags" 
              type="text" 
              class="w-16 bg-transparent text-gray-800 dark:text-dark-text text-center font-mono"
              placeholder="gim"
              @input="testRegex"
            >
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-1">标志: g=全局, i=忽略大小写, m=多行</p>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">测试文本</label>
        <textarea 
          v-model="testText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="6"
          placeholder="输入要测试的文本..."
          @input="testRegex"
        ></textarea>
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">匹配结果</h3>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div v-if="matches.length === 0 && testText && pattern && !error" class="text-gray-500 dark:text-gray-400">
            没有匹配项
          </div>
          <div v-else-if="highlightedText" v-html="highlightedText" class="font-mono text-sm whitespace-pre-wrap break-all"></div>
          <div v-else class="text-gray-500 dark:text-gray-400">
            输入正则表达式和测试文本查看匹配结果
          </div>
        </div>
      </div>
      
      <div v-if="matches.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">匹配详情</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            v-for="(match, index) in matches" 
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-gray-800 dark:text-dark-text">匹配 #{{ index + 1 }}</span>
              <button 
                @click="copyMatch(match)" 
                class="text-sm text-primary hover:underline"
              >
                复制
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">匹配值:</span>
                <span class="ml-2 font-mono text-green-600 dark:text-green-400">"{{ match.value }}"</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">索引:</span>
                <span class="ml-2">{{ match.index }}</span>
              </div>
            </div>
            <div v-if="match.groups && Object.keys(match.groups).length > 0" class="mt-2">
              <span class="text-gray-500 dark:text-gray-400">捕获组:</span>
              <div class="mt-1 space-y-1">
                <div v-for="(value, key) in match.groups" :key="key" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">{{ key }}:</span>
                  <span class="ml-2 font-mono text-blue-600 dark:text-blue-400">"{{ value }}"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">常用正则表达式</h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="preset in presets" 
            :key="preset.name"
            @click="applyPreset(preset)"
            class="p-2 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="font-mono text-sm text-gray-800 dark:text-dark-text">{{ preset.pattern }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.name }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'RegexTester',
  setup() {
    const pattern = ref('')
    const flags = ref('g')
    const testText = ref('')
    const error = ref('')
    const matches = ref([])
    
    const presets = [
      { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
      { name: '手机号(中国)', pattern: '1[3-9]\\d{9}' },
      { name: 'URL', pattern: 'https?:\\/\\/[^\\s]+' },
      { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
      { name: '日期(YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
      { name: '时间(HH:MM:SS)', pattern: '\\d{2}:\\d{2}:\\d{2}' },
      { name: '中文姓名', pattern: '[\\u4e00-\\u9fa5]{2,4}' },
      { name: '身份证号', pattern: '\\d{17}[\\dXx]' }
    ]
    
    const highlightedText = computed(() => {
      if (!testText.value || !pattern.value || error.value) return ''
      
      try {
        const flagStr = flags.value || 'g'
        const regex = new RegExp(pattern.value, flagStr)
        
        // Get highlighted HTML with proper escaping
        let result = ''
        let lastIndex = 0
        
        if (flagStr.includes('g')) {
          const text = testText.value
          let match
          regex.lastIndex = 0
          
          while ((match = regex.exec(text)) !== null) {
            // Add text before match
            result += escapeHtml(text.slice(lastIndex, match.index))
            // Add highlighted match
            result += `<mark class="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded">${escapeHtml(match[0])}</mark>`
            lastIndex = regex.lastIndex
            
            // Prevent infinite loop for zero-length matches
            if (match[0].length === 0) {
              regex.lastIndex++
            }
          }
          // Add remaining text
          result += escapeHtml(text.slice(lastIndex))
        } else {
          result = escapeHtml(testText.value).replace(
            new RegExp(escapeRegex(pattern.value), 'i'),
            `<mark class="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded">$&</mark>`
          )
        }
        
        return result
      } catch (e) {
        return ''
      }
    })
    
    const escapeHtml = (text) => {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }
    
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    
    const testRegex = () => {
      error.value = ''
      matches.value = []
      
      if (!pattern.value) return
      if (!testText.value) return
      
      try {
        const flagStr = flags.value || 'g'
        const regex = new RegExp(pattern.value, flagStr)
        
        if (flagStr.includes('g')) {
          regex.lastIndex = 0
          let match
          while ((match = regex.exec(testText.value)) !== null) {
            matches.value.push({
              value: match[0],
              index: match.index,
              groups: match.groups || {}
            })
            
            // Prevent infinite loop for zero-length matches
            if (match[0].length === 0) {
              regex.lastIndex++
            }
          }
        } else {
          const match = regex.exec(testText.value)
          if (match) {
            matches.value.push({
              value: match[0],
              index: match.index,
              groups: match.groups || {}
            })
          }
        }
      } catch (e) {
        error.value = '正则表达式错误: ' + e.message
      }
    }
    
    const applyPreset = (preset) => {
      pattern.value = preset.pattern
      testRegex()
    }
    
    const copyMatch = (match) => {
      navigator.clipboard.writeText(match.value)
        .then(() => {
          alert('已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    return {
      pattern,
      flags,
      testText,
      error,
      matches,
      presets,
      highlightedText,
      testRegex,
      applyPreset,
      copyMatch
    }
  }
}
</script>