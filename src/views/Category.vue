<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-12">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">{{ categoryName }}</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">{{ categoryDescription }}</p>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ToolCard 
        v-for="tool in categoryTools" 
        :key="tool.id" 
        :tool="tool"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToolCard from '../components/ToolCard.vue'
import { useToolsStore } from '../store/modules/tools'

export default {
  name: 'Category',
  components: {
    ToolCard
  },
  setup() {
    const route = useRoute()
    const toolsStore = useToolsStore()
    
    const categoryId = computed(() => route.params.category)
    
    const categoryName = computed(() => {
      const category = toolsStore.categories.find(cat => cat.id === categoryId.value)
      return category ? category.name : 'Category'
    })
    
    const categoryDescription = computed(() => {
      const descriptions = {
        security: '加密、哈希和安全相关任务的工具',
        conversion: '不同格式之间转换的工具',
        network: '网络相关任务和信息的工具',
        development: '软件开发工具',
        utility: '通用实用工具'
      }
      return descriptions[categoryId.value] || '此分类中的工具'
    })
    
    const categoryTools = computed(() => {
      return toolsStore.getToolsByCategory(categoryId.value)
    })
    
    return {
      categoryName,
      categoryDescription,
      categoryTools
    }
  }
}
</script>