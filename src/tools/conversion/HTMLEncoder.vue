<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">HTML 实体编码/解码器</h1>
      <p class="text-gray-600 dark:text-gray-300">对 HTML 特殊字符进行编码和解码的工具。</p>
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
      
      <div class="mb-6 flex flex-wrap gap-4">
        <button 
          @click="encode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          HTML 编码
        </button>
        <button 
          @click="decode" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          HTML 解码
        </button>
        <button 
          @click="encodeAttribute" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          属性编码
        </button>
        <button 
          @click="encodeAll" 
          class="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          完整编码
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
          <strong>HTML 编码：</strong>将特殊字符转换为 HTML 实体，防止 XSS 攻击
        </div>
        <div>
          <strong>HTML 解码：</strong>将 HTML 实体还原为原始字符
        </div>
        <div>
          <strong>属性编码：</strong>适用于 HTML 属性值的编码
        </div>
        <div>
          <strong>完整编码：</strong>对所有非 ASCII 字符进行编码
        </div>
      </div>
      
      <div class="mt-4">
        <h4 class="font-medium text-gray-800 dark:text-dark-text mb-2">常用 HTML 实体</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">&amp;</code> → &amp;amp;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">&lt;</code> → &amp;lt;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">&gt;</code> → &amp;gt;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">"</code> → &amp;quot;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">'</code> → &amp;apos;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">空格</code> → &amp;nbsp;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">©</code> → &amp;copy;
          </div>
          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <code class="text-red-600">®</code> → &amp;reg;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HTMLEncoder',
  setup() {
    const inputText = ref('')
    const outputText = ref('')
    
    const encode = () => {
      if (!inputText.value) return
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }
      outputText.value = inputText.value.replace(/[&<>"']/g, char => map[char])
    }
    
    const decode = () => {
      if (!inputText.value) return
      const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
        '&nbsp;': ' '
      }
      outputText.value = inputText.value.replace(/&(amp|lt|gt|quot|apos|nbsp);/g, match => map[match])
    }
    
    const encodeAttribute = () => {
      if (!inputText.value) return
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        ' ': '&nbsp;'
      }
      outputText.value = inputText.value.replace(/[&<>"' ]/g, char => map[char])
    }
    
    const encodeAll = () => {
      if (!inputText.value) return
      outputText.value = inputText.value.split('').map(char => {
        const code = char.charCodeAt(0)
        if (code > 127) {
          return `&#${code};`
        }
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }
        return map[char] || char
      }).join('')
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
      encodeAttribute,
      encodeAll,
      swapInputOutput,
      copyOutput,
      clearAll
    }
  }
}
</script>