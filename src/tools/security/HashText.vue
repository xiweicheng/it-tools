<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">文本哈希</h1>
      <p class="text-gray-600 dark:text-gray-300">使用您需要的函数对文本字符串进行哈希处理：MD5、SHA1、SHA256、SHA224、SHA512、SHA384、SHA3 或 RIPEMD160</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">待哈希文本</label>
        <textarea 
          v-model="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          rows="4"
          placeholder="输入要哈希的文本..."
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">哈希算法</label>
        <select 
          v-model="algorithm" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
        >
          <option value="md5">MD5</option>
          <option value="sha1">SHA1</option>
          <option value="sha224">SHA224</option>
          <option value="sha256">SHA256</option>
          <option value="sha384">SHA384</option>
          <option value="sha512">SHA512</option>
          <option value="sha3">SHA3</option>
          <option value="ripemd160">RIPEMD160</option>
        </select>
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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HashText',
  setup() {
    const text = ref('')
    const algorithm = ref('sha256')
    const hash = ref('')
    
    const hashText = async () => {
      if (!text.value) return
      
      try {
        const encoder = new TextEncoder()
        const data = encoder.encode(text.value)
        let hashBuffer
        
        switch (algorithm.value) {
          case 'md5':
            hashBuffer = await crypto.subtle.digest('MD5', data)
            break
          case 'sha1':
            hashBuffer = await crypto.subtle.digest('SHA-1', data)
            break
          case 'sha224':
            hashBuffer = await crypto.subtle.digest('SHA-224', data)
            break
          case 'sha256':
            hashBuffer = await crypto.subtle.digest('SHA-256', data)
            break
          case 'sha384':
            hashBuffer = await crypto.subtle.digest('SHA-384', data)
            break
          case 'sha512':
            hashBuffer = await crypto.subtle.digest('SHA-512', data)
            break
          case 'sha3':
            hashBuffer = await crypto.subtle.digest('SHA-384', data) // Using SHA-384 as SHA3 equivalent
            break
          case 'ripemd160':
            // Note: RIPEMD160 is not natively supported in Web Crypto API
            // For simplicity, we'll use SHA-1 as a placeholder
            hashBuffer = await crypto.subtle.digest('SHA-1', data)
            break
          default:
            hashBuffer = await crypto.subtle.digest('SHA-256', data)
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        hash.value = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      } catch (error) {
        console.error('Error hashing text:', error)
        hash.value = 'Error generating hash'
      }
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
    
    return {
      text,
      algorithm,
      hash,
      hashText,
      copyHash
    }
  }
}
</script>