<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">所有工具</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">浏览所有可用工具</p>
    </header>
    
    <div class="flex justify-center mb-8">
      <SearchBar />
    </div>
    
    <div v-for="category in categories" :key="category.id" class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">{{ category.name }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard 
          v-for="tool in getToolsByCategory(category.id)" 
          :key="tool.id" 
          :tool="tool"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import ToolCard from '../components/ToolCard.vue'
import { useToolsStore } from '../store/modules/tools'

export default {
  name: 'AllTools',
  components: {
    SearchBar,
    ToolCard
  },
  setup() {
    const toolsStore = useToolsStore()
    
    const categories = computed(() => toolsStore.categories)
    
    const getToolsByCategory = (categoryId) => {
      return toolsStore.getToolsByCategory(categoryId)
    }
    
    return {
      categories,
      getToolsByCategory
    }
  }
}
</script>