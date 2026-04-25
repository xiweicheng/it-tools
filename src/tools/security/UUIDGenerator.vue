<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">UUID 生成器</h1>
      <p class="text-gray-600 dark:text-gray-300">通用唯一标识符 (UUID) 是一个 128 位数字，用于在计算机系统中标识信息。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">UUID 数量</label>
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
          @click="generateUUIDs" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          生成 UUID
        </button>
      </div>
      
      <div v-if="uuids.length > 0" class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">生成的 UUID</label>
        <div class="space-y-2">
          <div v-for="(uuid, index) in uuids" :key="index" class="flex">
            <input 
              :value="uuid" 
              type="text" 
              class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
            <button 
              @click="copyUUID(uuid)" 
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
  name: 'UUIDGenerator',
  setup() {
    const count = ref(5)
    const uuids = ref([])
    
    const generateUUIDs = () => {
      uuids.value = []
      for (let i = 0; i < count.value; i++) {
        uuids.value.push(generateUUID())
      }
    }
    
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    
    const copyUUID = (uuid) => {
      navigator.clipboard.writeText(uuid)
        .then(() => {
          alert('UUID已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制UUID失败:', err)
        })
    }
    
    // Generate initial UUIDs
    generateUUIDs()
    
    return {
      count,
      uuids,
      generateUUIDs,
      copyUUID
    }
  }
}
</script>