<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">{{ category.name }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ToolCard 
        v-for="tool in tools" 
        :key="tool.id" 
        :tool="tool"
      />
    </div>
  </div>
</template>

<script>
import ToolCard from './ToolCard.vue'

export default {
  name: 'ToolCategory',
  components: {
    ToolCard
  },
  props: {
    category: {
      type: Object,
      required: true
    },
    tools: {
      type: Array,
      required: true
    }
  }
}
</script>