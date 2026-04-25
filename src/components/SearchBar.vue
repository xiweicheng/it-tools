<template>
  <div class="relative w-full max-w-md">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索工具... (Cmd+K)"
      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
      @keyup.enter="handleSearch"
    />
    <div 
      v-if="searchResults.length > 0" 
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 max-h-60 overflow-y-auto"
    >
      <div
        v-for="result in searchResults"
        :key="result.id"
        class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        @click="navigateToTool(result)"
      >
        <div class="font-medium text-gray-800 dark:text-dark-text">{{ result.name }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">{{ result.category }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolsStore } from '../store/modules/tools'

export default {
  name: 'SearchBar',
  setup() {
    const router = useRouter()
    const toolsStore = useToolsStore()
    const searchQuery = ref('')
    
    const searchResults = computed(() => {
      return toolsStore.searchTools(searchQuery.value)
    })
    
    const handleSearch = () => {
      if (searchResults.value.length > 0) {
        navigateToTool(searchResults.value[0])
      }
    }
    
    const navigateToTool = (tool) => {
      router.push(`/tool/${tool.id}`)
      searchQuery.value = ''
    }
    
    // 处理 Cmd+K 快捷键
    const handleKeydown = (event) => {
      // Cmd+K (Mac) 或 Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const input = document.querySelector('input[placeholder*="搜索工具"]')
        if (input) {
          input.focus()
        }
      }
    }
    
    onMounted(() => {
      // Add event listener
      window.addEventListener('keydown', handleKeydown)
    })
    
    onUnmounted(() => {
      // Cleanup event listener
      window.removeEventListener('keydown', handleKeydown)
    })
    
    return {
      searchQuery,
      searchResults,
      handleSearch,
      navigateToTool
    }
  }
}
</script>