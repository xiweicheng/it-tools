<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">IT 工具</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">为开发者提供的便捷在线工具</p>
    </header>
    
    <div class="flex justify-center mb-8">
      <SearchBar />
    </div>
    
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">热门工具</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard 
          v-for="tool in popularTools" 
          :key="tool.id" 
          :tool="tool"
        />
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">分类</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link 
          v-for="category in categories" 
          :key="category.id" 
          :to="`/category/${category.id}`"
          class="bg-white dark:bg-dark-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text">{{ category.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ getToolsCount(category.id) }} 工具</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import ToolCard from '../components/ToolCard.vue'
import { useToolsStore } from '../store/modules/tools'

export default {
  name: 'Home',
  components: {
    SearchBar,
    ToolCard
  },
  setup() {
    const toolsStore = useToolsStore()
    
    const categories = computed(() => toolsStore.categories)
    
    const popularTools = computed(() => {
      // Return first 6 tools as popular
      return toolsStore.tools.slice(0, 6)
    })
    
    const getToolsCount = (categoryId) => {
      return toolsStore.tools.filter(tool => tool.category === categoryId).length
    }
    
    return {
      categories,
      popularTools,
      getToolsCount
    }
  }
}
</script>