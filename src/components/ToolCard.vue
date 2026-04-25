<template>
  <div class="bg-white dark:bg-dark-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-2">{{ tool.name }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ tool.description }}</p>
    <router-link 
      :to="`/tool/${tool.id}`" 
      class="text-primary hover:underline text-sm font-medium"
    >
      使用工具
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ToolCard',
  props: {
    tool: {
      type: Object,
      required: true
    }
  }
}
</script>