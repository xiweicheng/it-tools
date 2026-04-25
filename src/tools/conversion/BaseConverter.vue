<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">进制转换器</h1>
      <p class="text-gray-600 dark:text-gray-300">在二进制、八进制、十进制和十六进制之间转换数字。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入数字</label>
        <input 
          v-model="inputValue"
          type="text"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入数字，例如：255, 0xFF, 0b11111111, 0377"
          @input="convertNumber"
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">自动检测格式</label>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          支持的格式：十进制 (255)、十六进制 (0xFF)、二进制 (0b11111111)、八进制 (0377)
        </p>
      </div>
      
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <span class="w-24 text-gray-700 dark:text-gray-300 font-medium">二进制</span>
          <div class="flex-1 flex">
            <input 
              :value="results.binary" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyToClipboard(results.binary)" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
            >
              复制
            </button>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <span class="w-24 text-gray-700 dark:text-gray-300 font-medium">八进制</span>
          <div class="flex-1 flex">
            <input 
              :value="results.octal" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyToClipboard(results.octal)" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
            >
              复制
            </button>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <span class="w-24 text-gray-700 dark:text-gray-300 font-medium">十进制</span>
          <div class="flex-1 flex">
            <input 
              :value="results.decimal" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyToClipboard(results.decimal)" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
            >
              复制
            </button>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <span class="w-24 text-gray-700 dark:text-gray-300 font-medium">十六进制</span>
          <div class="flex-1 flex">
            <input 
              :value="results.hexadecimal" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyToClipboard(results.hexadecimal)" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 text-sm"
            >
              复制
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
        {{ error }}
      </div>
      
      <div class="mt-6">
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
  name: 'BaseConverter',
  setup() {
    const inputValue = ref('')
    const error = ref('')
    
    const results = computed(() => {
      if (!inputValue.value) {
        return {
          binary: '-',
          octal: '-',
          decimal: '-',
          hexadecimal: '-'
        }
      }
      
      try {
        let decimalValue = 0
        const input = inputValue.value.trim()
        
        // Detect input format
        if (input.toLowerCase().startsWith('0x')) {
          // Hexadecimal
          decimalValue = parseInt(input, 16)
        } else if (input.toLowerCase().startsWith('0b')) {
          // Binary
          decimalValue = parseInt(input, 2)
        } else if (input.startsWith('0') && input.length > 1 && /^[0-7]+$/.test(input)) {
          // Octal (starts with 0, only contains 0-7)
          decimalValue = parseInt(input, 8)
        } else if (/^[0-9]+$/.test(input)) {
          // Decimal
          decimalValue = parseInt(input, 10)
        } else {
          throw new Error('无效的数字格式')
        }
        
        if (isNaN(decimalValue)) {
          throw new Error('无效的数字')
        }
        
        error.value = ''
        
        return {
          binary: '0b' + decimalValue.toString(2),
          octal: '0' + decimalValue.toString(8),
          decimal: decimalValue.toString(10),
          hexadecimal: '0x' + decimalValue.toString(16).toUpperCase()
        }
      } catch (e) {
        error.value = e.message
        return {
          binary: '-',
          octal: '-',
          decimal: '-',
          hexadecimal: '-'
        }
      }
    })
    
    const convertNumber = () => {
      // Results are computed automatically
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
    
    const clearAll = () => {
      inputValue.value = ''
      error.value = ''
    }
    
    return {
      inputValue,
      error,
      results,
      convertNumber,
      copyToClipboard,
      clearAll
    }
  }
}
</script>