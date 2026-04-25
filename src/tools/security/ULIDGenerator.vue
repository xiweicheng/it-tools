<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">ULID 生成器</h1>
      <p class="text-gray-600 dark:text-gray-300">生成随机的通用唯一字典序可排序标识符 (ULID)。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">ULID 数量</label>
        <input 
          v-model.number="count" 
          type="number" 
          min="1" 
          max="100" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
        >
      </div>
      
      <div class="mb-6">
        <button 
          @click="generateULIDs" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          生成 ULID
        </button>
      </div>
      
      <div v-if="ulids.length > 0" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">生成的 ULID</label>
        <div class="space-y-2">
          <div v-for="(ulid, index) in ulids" :key="index" class="flex">
            <input 
              :value="ulid" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyULID(ulid)" 
              class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
            >
              复制
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ULIDGenerator',
  setup() {
    const count = ref(5)
    const ulids = ref([])
    
    const generateULIDs = () => {
      ulids.value = []
      for (let i = 0; i < count.value; i++) {
        ulids.value.push(generateULID())
      }
    }
    
    const generateULID = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 281474976710656) // 128 bits
      
      const encodeTime = (time) => {
        const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
        let result = ''
        for (let i = 10; i >= 0; i--) {
          const bit = (time >> (i * 5)) & 0x1f
          result += chars[bit]
        }
        return result
      }
      
      const encodeRandom = (random) => {
        const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
        let result = ''
        for (let i = 15; i >= 0; i--) {
          const bit = (random >> (i * 5)) & 0x1f
          result += chars[bit]
        }
        return result
      }
      
      return encodeTime(timestamp) + encodeRandom(random)
    }
    
    const copyULID = (ulid) => {
      navigator.clipboard.writeText(ulid)
        .then(() => {
          alert('ULID已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制ULID失败:', err)
        })
    }
    
    // Generate initial ULIDs
    generateULIDs()
    
    return {
      count,
      ulids,
      generateULIDs,
      copyULID
    }
  }
}
</script>