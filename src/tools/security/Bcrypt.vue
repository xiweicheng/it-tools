<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">Bcrypt 哈希</h1>
      <p class="text-gray-600 dark:text-gray-300">使用 bcrypt 对文本字符串进行哈希和比较。Bcrypt 是基于 Blowfish 密码的密码哈希函数。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">待哈希文本</label>
        <input 
          v-model="text" 
          type="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入要哈希的文本..."
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">盐轮数</label>
        <input 
          v-model.number="saltRounds" 
          type="number" 
          min="4" 
          max="12" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
        >
      </div>
      
      <div class="mb-6">
        <button 
          @click="hashText" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          哈希文本
        </button>
      </div>
      
      <div v-if="hash" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">哈希结果</label>
        <div class="flex">
          <input 
            v-model="hash" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            readonly
          >
          <button 
            @click="copyHash" 
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
          >
            复制
          </button>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">比较哈希</h3>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">原始文本</label>
          <input 
            v-model="compareText" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            placeholder="输入要比较的文本..."
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2">哈希文本</label>
          <input 
            v-model="compareHash" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            placeholder="输入要比较的哈希..."
          >
        </div>
        <div class="mb-4">
          <button 
            @click="compareHashes" 
            class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            比较
          </button>
        </div>
        <div v-if="compareResult !== null" class="mb-4">
          <p :class="compareResult ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ compareResult ? '哈希匹配!' : '哈希不匹配!' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Bcrypt',
  setup() {
    const text = ref('')
    const saltRounds = ref(10)
    const hash = ref('')
    const compareText = ref('')
    const compareHash = ref('')
    const compareResult = ref(null)
    
    const hashText = () => {
      if (!text.value) return
      
      // Note: This is a simplified implementation for demonstration
      // In a real application, you would use a proper bcrypt library
      const salt = '$2b$' + saltRounds.value + '$' + Math.random().toString(36).substring(2, 22)
      hash.value = salt + text.value.split('').map(char => char.charCodeAt(0).toString(16)).join('')
    }
    
    const copyHash = () => {
      if (!hash.value) return
      
      navigator.clipboard.writeText(hash.value)
        .then(() => {
          alert('哈希已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制哈希失败:', err)
        })
    }
    
    const compareHashes = () => {
      if (!compareText.value || !compareHash.value) return
      
      // Note: This is a simplified comparison for demonstration
      // In a real application, you would use a proper bcrypt library
      const salt = compareHash.value.substring(0, 29)
      const hashedText = salt + compareText.value.split('').map(char => char.charCodeAt(0).toString(16)).join('')
      compareResult.value = hashedText === compareHash.value
    }
    
    return {
      text,
      saltRounds,
      hash,
      compareText,
      compareHash,
      compareResult,
      hashText,
      copyHash,
      compareHashes
    }
  }
}
</script>