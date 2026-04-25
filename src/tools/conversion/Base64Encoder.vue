<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">Base64 编码/解码器</h1>
      <p class="text-gray-600 dark:text-gray-300">简单地将字符串编码和解码为其 base64 表示形式。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入文本</label>
        <textarea 
          v-model="inputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="4"
          placeholder="输入要编码或解码的文本..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <button 
          @click="encode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mr-2"
        >
          编码
        </button>
        <button 
          @click="decode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          解码
        </button>
      </div>
      
      <div v-if="outputText" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输出</label>
        <div class="flex">
          <input 
            v-model="outputText" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            readonly
          >
          <button 
            @click="copyOutput" 
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
import { ref } from 'vue'

export default {
  name: 'Base64Encoder',
  setup() {
    const inputText = ref('')
    const outputText = ref('')
    
    const encode = () => {
      if (!inputText.value) return
      outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
    }
    
    const decode = () => {
      if (!inputText.value) return
      try {
        outputText.value = decodeURIComponent(escape(atob(inputText.value)))
      } catch (error) {
        outputText.value = 'Invalid Base64 string'
      }
    }
    
    const copyOutput = () => {
      if (!outputText.value) return
      
      navigator.clipboard.writeText(outputText.value)
        .then(() => {
          alert('输出已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制输出失败:', err)
        })
    }
    
    return {
      inputText,
      outputText,
      encode,
      decode,
      copyOutput
    }
  }
}
</script>