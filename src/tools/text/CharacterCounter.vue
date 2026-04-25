<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">字符统计工具</h1>
      <p class="text-gray-600 dark:text-gray-300">统计文本的各种字符数量和信息。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入文本</label>
        <textarea 
          v-model="inputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="6"
          placeholder="输入要统计的文本..."
        ></textarea>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.charCount }}</div>
          <div class="text-sm text-gray-500">总字符数</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.charCountNoSpaces }}</div>
          <div class="text-sm text-gray-500">字符数(去空格)</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.wordCount }}</div>
          <div class="text-sm text-gray-500">单词数</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.lineCount }}</div>
          <div class="text-sm text-gray-500">行数</div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.chineseCount }}</div>
          <div class="text-sm text-gray-500">中文字符</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.englishCount }}</div>
          <div class="text-sm text-gray-500">英文字母</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.numberCount }}</div>
          <div class="text-sm text-gray-500">数字字符</div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <div class="text-3xl font-bold text-gray-800 dark:text-dark-text">{{ stats.specialCount }}</div>
          <div class="text-sm text-gray-500">特殊字符</div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 mb-2">字符占比</div>
          <div class="space-y-2">
            <div>
              <div class="flex justify-between text-sm">
                <span>中文</span>
                <span>{{ stats.chineseRatio }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" :style="{ width: stats.chineseRatio + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm">
                <span>英文</span>
                <span>{{ stats.englishRatio }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" :style="{ width: stats.englishRatio + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm">
                <span>数字</span>
                <span>{{ stats.numberRatio }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: stats.numberRatio + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm">
                <span>特殊字符</span>
                <span>{{ stats.specialRatio }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" :style="{ width: stats.specialRatio + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-500 mb-2">字符分布（前10）</div>
          <div class="space-y-1">
            <div v-for="(item, index) in charFrequency" :key="index" class="flex justify-between text-sm">
              <span class="font-mono">{{ item.char === ' ' ? '空格' : item.char }}</span>
              <span class="text-gray-500">{{ item.count }} 次</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="stats.lineCount > 1" class="mb-6">
        <div class="text-sm text-gray-500 mb-2">行长度统计</div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div class="text-lg font-bold text-gray-800 dark:text-dark-text">{{ stats.shortestLine }}</div>
            <div class="text-xs text-gray-500">最短行</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div class="text-lg font-bold text-gray-800 dark:text-dark-text">{{ stats.longestLine }}</div>
            <div class="text-xs text-gray-500">最长行</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div class="text-lg font-bold text-gray-800 dark:text-dark-text">{{ stats.averageLineLength }}</div>
            <div class="text-xs text-gray-500">平均行长度</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CharacterCounter',
  setup() {
    const inputText = ref('')
    
    const stats = computed(() => {
      if (!inputText.value) {
        return {
          charCount: 0,
          charCountNoSpaces: 0,
          wordCount: 0,
          lineCount: 0,
          chineseCount: 0,
          englishCount: 0,
          numberCount: 0,
          specialCount: 0,
          chineseRatio: 0,
          englishRatio: 0,
          numberRatio: 0,
          specialRatio: 0,
          shortestLine: 0,
          longestLine: 0,
          averageLineLength: 0
        }
      }
      
      const text = inputText.value
      const charCount = text.length
      const charCountNoSpaces = text.replace(/\s/g, '').length
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
      const lineCount = text.split('\n').length
      
      // Count character types
      let chineseCount = 0
      let englishCount = 0
      let numberCount = 0
      let specialCount = 0
      
      for (const char of text) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          chineseCount++
        } else if (/[a-zA-Z]/.test(char)) {
          englishCount++
        } else if (/[0-9]/.test(char)) {
          numberCount++
        } else if (/\S/.test(char)) {
          specialCount++
        }
      }
      
      // Calculate ratios
      const chineseRatio = charCount > 0 ? ((chineseCount / charCount) * 100).toFixed(1) : 0
      const englishRatio = charCount > 0 ? ((englishCount / charCount) * 100).toFixed(1) : 0
      const numberRatio = charCount > 0 ? ((numberCount / charCount) * 100).toFixed(1) : 0
      const specialRatio = charCount > 0 ? ((specialCount / charCount) * 100).toFixed(1) : 0
      
      // Line statistics
      const lines = text.split('\n')
      const lineLengths = lines.map(l => l.length)
      const shortestLine = lineLengths.length > 0 ? Math.min(...lineLengths) : 0
      const longestLine = lineLengths.length > 0 ? Math.max(...lineLengths) : 0
      const averageLineLength = lineLengths.length > 0 ? Math.round(lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length) : 0
      
      return {
        charCount,
        charCountNoSpaces,
        wordCount,
        lineCount,
        chineseCount,
        englishCount,
        numberCount,
        specialCount,
        chineseRatio,
        englishRatio,
        numberRatio,
        specialRatio,
        shortestLine,
        longestLine,
        averageLineLength
      }
    })
    
    const charFrequency = computed(() => {
      if (!inputText.value) return []
      
      const freq = {}
      for (const char of inputText.value) {
        if (/\S/.test(char)) {
          freq[char] = (freq[char] || 0) + 1
        }
      }
      
      return Object.entries(freq)
        .map(([char, count]) => ({ char, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    })
    
    return {
      inputText,
      stats,
      charFrequency
    }
  }
}
</script>