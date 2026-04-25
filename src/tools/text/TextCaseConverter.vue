<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">大小写文本转换</h1>
      <p class="text-gray-600 dark:text-gray-300">将文本在不同大小写格式之间转换。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入文本</label>
        <textarea 
          v-model="inputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="6"
          placeholder="输入要转换的文本..."
        ></textarea>
      </div>
      
      <div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
        <button 
          @click="toUpperCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          大写 (UPPERCASE)
        </button>
        <button 
          @click="toLowerCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          小写 (lowercase)
        </button>
        <button 
          @click="toTitleCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          首字母大写 (Title Case)
        </button>
        <button 
          @click="toSentenceCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          句首大写 (Sentence case)
        </button>
        <button 
          @click="toAlternatingCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          交替大小写 (aLtErNaTiNg)
        </button>
        <button 
          @click="toInverseCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          反转大小写 (iNVERSE)
        </button>
        <button 
          @click="toCamelCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          驼峰命名 (camelCase)
        </button>
        <button 
          @click="toPascalCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          帕斯卡命名 (PascalCase)
        </button>
        <button 
          @click="toSnakeCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          下划线命名 (snake_case)
        </button>
        <button 
          @click="toKebabCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          短横线命名 (kebab-case)
        </button>
        <button 
          @click="toConstantCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          常量命名 (CONSTANT_CASE)
        </button>
        <button 
          @click="swapCase" 
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          大小写互换 (Swap Case)
        </button>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">转换结果</label>
        <textarea 
          :value="outputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text"
          rows="6"
          readonly
          placeholder="转换后的结果将显示在这里..."
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
  name: 'TextCaseConverter',
  setup() {
    const inputText = ref('')
    
    const outputText = computed(() => {
      return inputText.value
    })
    
    const toUpperCase = () => {
      inputText.value = inputText.value.toUpperCase()
    }
    
    const toLowerCase = () => {
      inputText.value = inputText.value.toLowerCase()
    }
    
    const toTitleCase = () => {
      inputText.value = inputText.value.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    }
    
    const toSentenceCase = () => {
      inputText.value = inputText.value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
    }
    
    const toAlternatingCase = () => {
      inputText.value = inputText.value.split('').map((char, i) => 
        i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    }
    
    const toInverseCase = () => {
      inputText.value = inputText.value.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      ).join('')
    }
    
    const toCamelCase = () => {
      inputText.value = inputText.value
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[A-Z]/, chr => chr.toLowerCase())
        .replace(/[^a-zA-Z0-9]/g, '')
    }
    
    const toPascalCase = () => {
      inputText.value = inputText.value
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, chr => chr.toUpperCase())
    }
    
    const toSnakeCase = () => {
      inputText.value = inputText.value
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase()
    }
    
    const toKebabCase = () => {
      inputText.value = inputText.value
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-zA-Z0-9\-]/g, '')
        .toLowerCase()
    }
    
    const toConstantCase = () => {
      inputText.value = inputText.value
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toUpperCase()
    }
    
    const swapCase = () => {
      toInverseCase()
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
      toUpperCase,
      toLowerCase,
      toTitleCase,
      toSentenceCase,
      toAlternatingCase,
      toInverseCase,
      toCamelCase,
      toPascalCase,
      toSnakeCase,
      toKebabCase,
      toConstantCase,
      swapCase,
      copyOutput,
      clearAll
    }
  }
}
</script>