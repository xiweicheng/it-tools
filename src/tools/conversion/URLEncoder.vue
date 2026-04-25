<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">URL 编码/解码器</h1>
      <p class="text-gray-600 dark:text-gray-300">对 URL 进行编码和解码处理的工具。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入 URL</label>
        <textarea 
          v-model="inputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="4"
          placeholder="输入要编码或解码的 URL..."
        ></textarea>
      </div>
      
      <div class="mb-6 flex flex-wrap gap-4">
        <button 
          @click="encode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          URL 编码
        </button>
        <button 
          @click="decode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          URL 解码
        </button>
        <button 
          @click="encodeComponent" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          编码组件
        </button>
        <button 
          @click="decodeComponent" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          解码组件
        </button>
        <button 
          @click="swapInputOutput" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ↑ 交换 ↑
        </button>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输出结果</label>
        <textarea 
          v-model="outputText" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="4"
          readonly
          placeholder="编码或解码后的结果将显示在这里..."
        ></textarea>
      </div>
      
      <div class="flex gap-4">
        <button 
          @click="copyOutput" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
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
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">说明</h3>
      <div class="space-y-3 text-gray-600 dark:text-gray-300">
        <div>
          <strong>URL 编码：</strong>将字符串转换为 URL 安全的格式（使用 %XX 转义序列）
        </div>
        <div>
          <strong>URL 解码：</strong>将 URL 编码的字符串还原为原始字符串
        </div>
        <div>
          <strong>编码组件 vs 编码：</strong>
          <ul class="ml-4 mt-1">
            <li><strong>encodeURIComponent：</strong>编码整个 URL 的查询参数部分，会转义 ?, &, =, / 等特殊字符</li>
            <li><strong>encodeURI：</strong>编码整个 URL，但保留 URL 特殊字符（如 :, /, ?, #）不被转义</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'URLEncoder',
  setup() {
    const inputText = ref('')
    const outputText = ref('')
    
    const encode = () => {
      if (!inputText.value) return
      try {
        outputText.value = encodeURI(inputText.value)
      } catch (error) {
        outputText.value = '编码错误: ' + error.message
      }
    }
    
    const decode = () => {
      if (!inputText.value) return
      try {
        outputText.value = decodeURI(inputText.value)
      } catch (error) {
        outputText.value = '解码错误: ' + error.message
      }
    }
    
    const encodeComponent = () => {
      if (!inputText.value) return
      try {
        outputText.value = encodeURIComponent(inputText.value)
      } catch (error) {
        outputText.value = '编码错误: ' + error.message
      }
    }
    
    const decodeComponent = () => {
      if (!inputText.value) return
      try {
        outputText.value = decodeURIComponent(inputText.value)
      } catch (error) {
        outputText.value = '解码错误: ' + error.message
      }
    }
    
    const swapInputOutput = () => {
      const temp = inputText.value
      inputText.value = outputText.value
      outputText.value = temp
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
      outputText.value = ''
    }
    
    return {
      inputText,
      outputText,
      encode,
      decode,
      encodeComponent,
      decodeComponent,
      swapInputOutput,
      copyOutput,
      clearAll
    }
  }
}
</script>