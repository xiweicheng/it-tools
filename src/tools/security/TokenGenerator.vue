<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">令牌生成器</h1>
      <p class="text-gray-600 dark:text-gray-300">生成包含您需要的字符的随机字符串，包括大写或小写字母、数字和/或符号。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">令牌长度</label>
        <input 
          v-model.number="length" 
          type="number" 
          min="1" 
          max="100" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">字符集</label>
        <div class="space-y-2">
          <div class="flex items-center">
            <input 
              v-model="options.uppercase" 
              type="checkbox" 
              id="uppercase" 
              class="mr-2"
            >
            <label for="uppercase" class="text-gray-700 dark:text-gray-300">大写字母 (A-Z)</label>
          </div>
          <div class="flex items-center">
            <input 
              v-model="options.lowercase" 
              type="checkbox" 
              id="lowercase" 
              class="mr-2"
            >
            <label for="lowercase" class="text-gray-700 dark:text-gray-300">小写字母 (a-z)</label>
          </div>
          <div class="flex items-center">
            <input 
              v-model="options.numbers" 
              type="checkbox" 
              id="numbers" 
              class="mr-2"
            >
            <label for="numbers" class="text-gray-700 dark:text-gray-300">数字 (0-9)</label>
          </div>
          <div class="flex items-center">
            <input 
              v-model="options.symbols" 
              type="checkbox" 
              id="symbols" 
              class="mr-2"
            >
            <label for="symbols" class="text-gray-700 dark:text-gray-300">符号 (!@#$%^&*)</label>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <button 
          @click="generateToken" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          生成令牌
        </button>
      </div>
      
      <div v-if="token" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">生成的令牌</label>
        <div class="flex">
          <input 
            v-model="token" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            readonly
          >
          <button 
            @click="copyToken" 
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
          >
            复制
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TokenGenerator',
  setup() {
    const length = ref(16)
    const token = ref('')
    const options = ref({
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    })
    
    const generateToken = () => {
      const chars = []
      if (options.value.uppercase) chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      if (options.value.lowercase) chars.push('abcdefghijklmnopqrstuvwxyz')
      if (options.value.numbers) chars.push('0123456789')
      if (options.value.symbols) chars.push('!@#$%^&*()_+-=[]{}|;:,.<>?')
      
      const charSet = chars.join('')
      let result = ''
      
      for (let i = 0; i < length.value; i++) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length))
      }
      
      token.value = result
    }
    
    const copyToken = () => {
      navigator.clipboard.writeText(token.value)
        .then(() => {
          alert('令牌已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制令牌失败:', err)
        })
    }
    
    onMounted(() => {
      // Generate initial token
      generateToken()
    })
    
    return {
      length,
      token,
      options,
      generateToken,
      copyToken
    }
  }
}
</script>