<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <nav class="bg-white dark:bg-dark-card shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-primary">IT 工具</router-link>
        <div class="flex items-center space-x-4">
          <router-link to="/all-tools" class="text-gray-600 dark:text-gray-300 hover:text-primary">全部工具</router-link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <footer class="bg-white dark:bg-dark-card shadow-inner mt-12 py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-600 dark:text-gray-300">IT 工具 - 开发者的在线工具</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">使用 Vue 3 + JavaScript 开发</p>
      </div>
    </footer>
  </div>
</template>

<script>
import ThemeToggle from './components/ThemeToggle.vue'

export default {
  name: 'App',
  components: {
    ThemeToggle
  }
}
</script>