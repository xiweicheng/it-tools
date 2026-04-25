<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">颜色转换器</h1>
      <p class="text-gray-600 dark:text-gray-300">在不同格式之间转换颜色（十六进制、RGB、HSL 和 CSS 名称）</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">颜色输入</label>
        <input 
          v-model="colorInput" 
          type="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入颜色（十六进制、RGB、HSL 或 CSS 名称）"
        >
      </div>
      
      <div class="mb-6">
        <button 
          @click="convertColor" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          转换
        </button>
      </div>
      
      <div v-if="convertedColors" class="space-y-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full mr-4" :style="{ backgroundColor: convertedColors.hex }"></div>
          <div class="flex-1">
            <div class="mb-2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">十六进制</label>
              <div class="flex">
                <input 
                  v-model="convertedColors.hex" 
                  type="text" 
                  class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyColor(convertedColors.hex)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
                >
                  复制
                </button>
              </div>
            </div>
            <div class="mb-2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">RGB</label>
              <div class="flex">
                <input 
                  v-model="convertedColors.rgb" 
                  type="text" 
                  class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyColor(convertedColors.rgb)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
                >
                  复制
                </button>
              </div>
            </div>
            <div class="mb-2">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">HSL</label>
              <div class="flex">
                <input 
                  v-model="convertedColors.hsl" 
                  type="text" 
                  class="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
                  readonly
                >
                <button 
                  @click="copyColor(convertedColors.hsl)" 
                  class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="error" class="mb-4">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ColorConverter',
  setup() {
    const colorInput = ref('')
    const convertedColors = ref(null)
    const error = ref('')
    
    const convertColor = () => {
      if (!colorInput.value) return
      
      try {
        // Create a temporary element to test color
        const tempEl = document.createElement('div')
        tempEl.style.color = colorInput.value
        
        if (!tempEl.style.color) {
          throw new Error('Invalid color format')
        }
        
        // Get computed color
        document.body.appendChild(tempEl)
        const computedColor = getComputedStyle(tempEl).color
        document.body.removeChild(tempEl)
        
        // Parse RGB
        const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (!rgbMatch) {
          throw new Error('Failed to parse color')
        }
        
        const r = parseInt(rgbMatch[1])
        const g = parseInt(rgbMatch[2])
        const b = parseInt(rgbMatch[3])
        
        // Convert to hex
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        
        // Convert to HSL
        const hsl = rgbToHsl(r, g, b)
        
        convertedColors.value = {
          hex: hex,
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
        }
        
        error.value = ''
      } catch (err) {
        error.value = 'Invalid color: ' + err.message
        convertedColors.value = null
      }
    }
    
    const rgbToHsl = (r, g, b) => {
      r /= 255
      g /= 255
      b /= 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        
        h /= 6
      }
      
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      }
    }
    
    const copyColor = (color) => {
      navigator.clipboard.writeText(color)
        .then(() => {
          alert('颜色已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制颜色失败:', err)
        })
    }
    
    return {
      colorInput,
      convertedColors,
      error,
      convertColor,
      copyColor
    }
  }
}
</script>