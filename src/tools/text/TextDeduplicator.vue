<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">文本去重/去空格工具</h1>
      <p class="text-gray-600 dark:text-gray-300">去除文本中的重复行、空格、换行等。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入文本</label>
        <textarea 
          v-model="inputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="8"
          placeholder="输入要处理的文本，每行一个..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">处理选项</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button 
            @click="removeDuplicateLines" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除重复行</div>
            <div class="text-xs text-gray-500">保留首次出现的行</div>
          </button>
          <button 
            @click="removeEmptyLines" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除空行</div>
            <div class="text-xs text-gray-500">删除空白行</div>
          </button>
          <button 
            @click="removeAllSpaces" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除所有空格</div>
            <div class="text-xs text-gray-500">删除所有空格</div>
          </button>
          <button 
            @click="removeExtraSpaces" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除多余空格</div>
            <div class="text-xs text-gray-500">保留单个空格</div>
          </button>
          <button 
            @click="removeDuplicateSpaces" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除重复空格</div>
            <div class="text-xs text-gray-500">多个空格变一个</div>
          </button>
          <button 
            @click="trimLines" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除首尾空白</div>
            <div class="text-xs text-gray-500">trim 每行</div>
          </button>
          <button 
            @click="removeDuplicateWords" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除重复单词</div>
            <div class="text-xs text-gray-500">去除重复的词语</div>
          </button>
          <button 
            @click="sortLines" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">行排序</div>
            <div class="text-xs text-gray-500">按字母顺序排列</div>
          </button>
          <button 
            @click="reverseLines" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">反转行顺序</div>
            <div class="text-xs text-gray-500">最后一行变第一行</div>
          </button>
          <button 
            @click="addLineNumbers" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">添加行号</div>
            <div class="text-xs text-gray-500">每行前加行号</div>
          </button>
          <button 
            @click="removeLineNumbers" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除行号</div>
            <div class="text-xs text-gray-500">移除行号</div>
          </button>
          <button 
            @click="removeLeadingNumbers" 
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div class="font-medium">去除开头的行号</div>
            <div class="text-xs text-gray-500">如 1. 2. 格式</div>
          </button>
        </div>
      </div>
      
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-gray-700 dark:text-gray-300">处理结果</label>
          <span class="text-sm text-gray-500">{{ lineCount }} 行</span>
        </div>
        <textarea 
          :value="outputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
          rows="8"
          readonly
        ></textarea>
      </div>
      
      <div class="flex gap-4">
        <button 
          @click="copyOutput" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          复制结果
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
import { ref, computed } from 'vue'

export default {
  name: 'TextDeduplicator',
  setup() {
    const inputText = ref('')
    
    const outputText = computed(() => {
      return inputText.value
    })
    
    const lineCount = computed(() => {
      if (!inputText.value) return 0
      return inputText.value.split('\n').length
    })
    
    const removeDuplicateLines = () => {
      const lines = inputText.value.split('\n')
      const uniqueLines = [...new Set(lines)]
      inputText.value = uniqueLines.join('\n')
    }
    
    const removeEmptyLines = () => {
      const lines = inputText.value.split('\n')
      const nonEmptyLines = lines.filter(line => line.trim() !== '')
      inputText.value = nonEmptyLines.join('\n')
    }
    
    const removeAllSpaces = () => {
      inputText.value = inputText.value.replace(/\s+/g, '')
    }
    
    const removeExtraSpaces = () => {
      inputText.value = inputText.value.replace(/\s+/g, ' ')
    }
    
    const removeDuplicateSpaces = () => {
      inputText.value = inputText.value.replace(/  +/g, ' ')
    }
    
    const trimLines = () => {
      const lines = inputText.value.split('\n')
      const trimmedLines = lines.map(line => line.trim())
      inputText.value = trimmedLines.join('\n')
    }
    
    const removeDuplicateWords = () => {
      const words = inputText.value.split(/\s+/)
      const uniqueWords = [...new Set(words)]
      inputText.value = uniqueWords.join(' ')
    }
    
    const sortLines = () => {
      const lines = inputText.value.split('\n')
      const sortedLines = lines.sort((a, b) => a.localeCompare(b))
      inputText.value = sortedLines.join('\n')
    }
    
    const reverseLines = () => {
      const lines = inputText.value.split('\n')
      const reversedLines = lines.reverse()
      inputText.value = reversedLines.join('\n')
    }
    
    const addLineNumbers = () => {
      const lines = inputText.value.split('\n')
      const numberedLines = lines.map((line, index) => `${index + 1}. ${line}`)
      inputText.value = numberedLines.join('\n')
    }
    
    const removeLineNumbers = () => {
      const lines = inputText.value.split('\n')
      const denumberedLines = lines.map(line => line.replace(/^\d+\.\s*/, ''))
      inputText.value = denumberedLines.join('\n')
    }
    
    const removeLeadingNumbers = () => {
      const lines = inputText.value.split('\n')
      const cleanedLines = lines.map(line => line.replace(/^\d+[\.\)]\s*/, ''))
      inputText.value = cleanedLines.join('\n')
    }
    
    const copyOutput = () => {
      if (!outputText.value) return
      navigator.clipboard.writeText(outputText.value)
        .then(() => {
          alert('已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    const clearAll = () => {
      inputText.value = ''
    }
    
    return {
      inputText,
      outputText,
      lineCount,
      removeDuplicateLines,
      removeEmptyLines,
      removeAllSpaces,
      removeExtraSpaces,
      removeDuplicateSpaces,
      trimLines,
      removeDuplicateWords,
      sortLines,
      reverseLines,
      addLineNumbers,
      removeLineNumbers,
      removeLeadingNumbers,
      copyOutput,
      clearAll
    }
  }
}
</script>