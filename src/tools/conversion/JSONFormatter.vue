<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">JSON 格式化</h1>
      <p class="text-gray-600 dark:text-gray-300">将您的 JSON 字符串格式化为友好的、人类可读的格式。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入 JSON</label>
        <textarea 
          v-model="inputJson" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="6"
          placeholder="输入要格式化的 JSON..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <button 
          @click="formatJson" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          格式化 JSON
        </button>
      </div>
      
      <div v-if="outputJson" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">格式化后的 JSON</label>
        <div class="flex">
          <textarea 
            v-model="outputJson" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            rows="6"
            readonly
          ></textarea>
          <button 
            @click="copyOutput" 
            class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 flex items-center"
          >
            复制
          </button>
        </div>
      </div>
      
      <div v-if="error" class="mb-4">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'JSONFormatter',
  setup() {
    const inputJson = ref('')
    const outputJson = ref('')
    const error = ref('')
    
    const formatJson = () => {
      if (!inputJson.value) return
      
      try {
        const parsed = JSON.parse(inputJson.value)
        outputJson.value = JSON.stringify(parsed, null, 2)
        error.value = ''
      } catch (err) {
        error.value = 'Invalid JSON: ' + err.message
        outputJson.value = ''
      }
    }
    
    const copyOutput = () => {
      if (!outputJson.value) return
      
      navigator.clipboard.writeText(outputJson.value)
        .then(() => {
          alert('格式化后的 JSON 已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制输出失败:', err)
        })
    }
    
    return {
      inputJson,
      outputJson,
      error,
      formatJson,
      copyOutput
    }
  }
}
</script>