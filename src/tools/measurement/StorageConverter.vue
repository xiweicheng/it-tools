<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">存储单位换算</h1>
      <p class="text-gray-600 dark:text-gray-300">在不同的存储单位之间进行换算。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入数值</label>
        <input 
          v-model.number="inputValue" 
          type="number" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入数值..."
          @input="convert"
        >
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">源单位</label>
        <select 
          v-model="fromUnit" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          @change="convert"
        >
          <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
        </select>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">目标单位</label>
        <select 
          v-model="toUnit" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          @change="convert"
        >
          <option v-for="unit in units" :key="unit.value" :value="unit.value">{{ unit.label }}</option>
        </select>
      </div>
      
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">换算结果</div>
        <div class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ result }}</div>
        <div class="text-sm text-blue-700 dark:text-blue-300 mt-1">{{ inputValue }} {{ getUnitLabel(fromUnit) }} = {{ result }} {{ getUnitLabel(toUnit) }}</div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">所有单位换算</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div 
            v-for="unit in allConversions" 
            :key="unit.unit"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="text-sm text-gray-500">{{ unit.label }}</div>
            <div class="font-semibold text-gray-800 dark:text-dark-text">{{ unit.value }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">存储单位说明</h3>
      <div class="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
        <div><strong>Bit (位)</strong> - 最小存储单位，只有 0 和 1 两种状态</div>
        <div><strong>Byte (字节)</strong> = 8 bits，最基本的数据存储单位</div>
        <div><strong>KB (千字节)</strong> = 1024 Bytes</div>
        <div><strong>MB (兆字节)</strong> = 1024 KB</div>
        <div><strong>GB (吉字节)</strong> = 1024 MB</div>
        <div><strong>TB (太字节)</strong> = 1024 GB</div>
        <div><strong>PB (拍字节)</strong> = 1024 TB</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'StorageConverter',
  setup() {
    const inputValue = ref(1)
    const fromUnit = ref('B')
    const toUnit = ref('KB')
    
    const units = [
      { value: 'B', label: 'Bytes (B)', factor: 1 },
      { value: 'KB', label: 'Kilobytes (KB)', factor: 1024 },
      { value: 'MB', label: 'Megabytes (MB)', factor: 1024 * 1024 },
      { value: 'GB', label: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      { value: 'TB', label: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
      { value: 'PB', label: 'Petabytes (PB)', factor: 1024 * 1024 * 1024 * 1024 * 1024 },
      { value: 'KBit', label: 'Kilobits (KBit)', factor: 1024 / 8 },
      { value: 'MBit', label: 'Megabits (MBit)', factor: (1024 * 1024) / 8 },
      { value: 'GBit', label: 'Gigabits (GBit)', factor: (1024 * 1024 * 1024) / 8 }
    ]
    
    const getUnitLabel = (value) => {
      const unit = units.find(u => u.value === value)
      return unit ? unit.label : value
    }
    
    const result = computed(() => {
      if (!inputValue.value && inputValue.value !== 0) return '-'
      
      const fromFactor = units.find(u => u.value === fromUnit.value)?.factor || 1
      const toFactor = units.find(u => u.value === toUnit.value)?.factor || 1
      
      const bytes = inputValue.value * fromFactor
      const converted = bytes / toFactor
      
      if (converted === 0) return '0'
      if (converted < 0.0001) return converted.toExponential(4)
      if (Number.isInteger(converted)) return converted.toString()
      return converted.toFixed(6).replace(/\.?0+$/, '')
    })
    
    const allConversions = computed(() => {
      if (!inputValue.value && inputValue.value !== 0) {
        return units.map(u => ({ unit: u.value, label: u.label, value: '-' }))
      }
      
      const fromFactor = units.find(u => u.value === fromUnit.value)?.factor || 1
      const bytes = inputValue.value * fromFactor
      
      return units.map(unit => {
        const converted = bytes / unit.factor
        let value
        if (converted === 0) value = '0'
        else if (converted < 0.0001) value = converted.toExponential(4)
        else if (Number.isInteger(converted)) value = converted.toString()
        else value = converted.toFixed(6).replace(/\.?0+$/, '')
        
        return { unit: unit.value, label: unit.label, value }
      })
    })
    
    const convert = () => {
      // Computed will auto-update
    }
    
    return {
      inputValue,
      fromUnit,
      toUnit,
      units,
      result,
      allConversions,
      getUnitLabel,
      convert
    }
  }
}
</script>