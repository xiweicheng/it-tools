<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">哈希值对比工具</h1>
      <p class="text-gray-600 dark:text-gray-300">比较两个哈希值是否相同，常用于验证文件完整性。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">哈希值 1</label>
        <textarea 
          v-model="hash1" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono"
          rows="2"
          placeholder="输入第一个哈希值..."
          @input="compareHashes"
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">哈希值 2</label>
        <textarea 
          v-model="hash2" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono"
          rows="2"
          placeholder="输入第二个哈希值..."
          @input="compareHashes"
        ></textarea>
      </div>
      
      <div v-if="comparisonResult !== null" class="mb-6 p-4 rounded-lg" :class="comparisonResult ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ comparisonResult ? '✓' : '✗' }}</span>
          <div>
            <p class="font-semibold" :class="comparisonResult ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
              {{ comparisonResult ? '哈希值匹配！' : '哈希值不匹配！' }}
            </p>
            <p class="text-sm" :class="comparisonResult ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'">
              {{ comparisonResult ? '两个哈希值完全相同' : '两个哈希值不同，请检查原始数据' }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">哈希信息</h3>
        <div class="space-y-2 text-sm">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px] p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">哈希值 1 长度</div>
              <div class="text-lg font-semibold text-gray-800 dark:text-dark-text">{{ hash1Length }}</div>
            </div>
            <div class="flex-1 min-w-[200px] p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">哈希值 2 长度</div>
              <div class="text-lg font-semibold text-gray-800 dark:text-dark-text">{{ hash2Length }}</div>
            </div>
          </div>
          
          <div v-if="hashType" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-gray-500 dark:text-gray-400">可能的哈希算法</div>
            <div class="text-lg font-semibold text-gray-800 dark:text-dark-text">{{ hashType }}</div>
          </div>
          
          <div v-if="hash1Difference" class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <div class="text-yellow-700 dark:text-yellow-200">注意：哈希值长度不同</div>
            <div class="text-sm text-yellow-600 dark:text-yellow-300">可能的原因：大小写不同、前后有空格、哈希算法不同</div>
          </div>
        </div>
      </div>
      
      <div class="flex gap-4">
        <button 
          @click="pasteFromClipboard(1)" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          粘贴值 1
        </button>
        <button 
          @click="pasteFromClipboard(2)" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          粘贴值 2
        </button>
        <button 
          @click="swapHashes" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ↑ 交换 ↑
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
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">常见哈希算法</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div class="font-medium">MD5</div>
          <div class="text-gray-500">128 位 / 32 字符</div>
        </div>
        <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div class="font-medium">SHA-1</div>
          <div class="text-gray-500">160 位 / 40 字符</div>
        </div>
        <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div class="font-medium">SHA-256</div>
          <div class="text-gray-500">256 位 / 64 字符</div>
        </div>
        <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div class="font-medium">SHA-512</div>
          <div class="text-gray-500">512 位 / 128 字符</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'HashComparator',
  setup() {
    const hash1 = ref('')
    const hash2 = ref('')
    const comparisonResult = ref(null)
    
    const hash1Length = computed(() => hash1.value.trim().length)
    const hash2Length = computed(() => hash2.value.trim().length)
    
    const hashType = computed(() => {
      const len = hash1.value.trim().length
      if (len === 32) return 'MD5'
      if (len === 40) return 'SHA-1'
      if (len === 64) return 'SHA-256'
      if (len === 128) return 'SHA-512'
      return ''
    })
    
    const hash1Difference = computed(() => {
      return hash1.value.trim().length !== hash2.value.trim().length
    })
    
    const compareHashes = () => {
      if (!hash1.value.trim() || !hash2.value.trim()) {
        comparisonResult.value = null
        return
      }
      
      const normalized1 = hash1.value.trim().toLowerCase()
      const normalized2 = hash2.value.trim().toLowerCase()
      
      comparisonResult.value = normalized1 === normalized2
    }
    
    const pasteFromClipboard = async (which) => {
      try {
        const text = await navigator.clipboard.readText()
        if (which === 1) {
          hash1.value = text.trim()
        } else {
          hash2.value = text.trim()
        }
        compareHashes()
      } catch (err) {
        console.error('粘贴失败:', err)
        alert('粘贴失败，请手动粘贴')
      }
    }
    
    const swapHashes = () => {
      const temp = hash1.value
      hash1.value = hash2.value
      hash2.value = temp
      compareHashes()
    }
    
    const clearAll = () => {
      hash1.value = ''
      hash2.value = ''
      comparisonResult.value = null
    }
    
    return {
      hash1,
      hash2,
      comparisonResult,
      hash1Length,
      hash2Length,
      hashType,
      hash1Difference,
      compareHashes,
      pasteFromClipboard,
      swapHashes,
      clearAll
    }
  }
}
</script>