<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">MAC 地址查询</h1>
      <p class="text-gray-600 dark:text-gray-300">通过设备的 MAC 地址查找供应商和制造商。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">MAC 地址</label>
        <input 
          v-model="macAddress" 
          type="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入 MAC 地址（例如，00:1B:44:11:3A:B7）"
        >
      </div>
      
      <div class="mb-6">
        <button 
          @click="lookupMAC" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          查询
        </button>
      </div>
      
      <div v-if="vendorInfo" class="mb-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">供应商信息</h3>
        <div class="space-y-2">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">MAC 地址</label>
            <input 
              v-model="vendorInfo.mac" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">OUI</label>
            <input 
              v-model="vendorInfo.oui" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">供应商</label>
            <input 
              v-model="vendorInfo.vendor" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
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
  name: 'MACAddressLookup',
  setup() {
    const macAddress = ref('')
    const vendorInfo = ref(null)
    const error = ref('')
    
    // Sample OUI database (limited for demonstration)
    const ouiDatabase = {
      '00:1B:44': 'Apple, Inc.',
      '00:00:0C': 'Cisco Systems, Inc.',
      '00:50:56': 'VMware, Inc.',
      '00:15:5D': 'Microsoft Corporation',
      '00:0D:3A': 'Intel Corporation',
      '00:1A:4B': 'Hewlett-Packard',
      '00:1E:4F': 'Dell Inc.',
      '00:25:90': 'Super Micro Computer, Inc.',
      '00:22:48': 'HUAWEI TECHNOLOGIES CO., LTD',
      '00:1F:5B': 'Netgear Inc.'
    }
    
    const lookupMAC = () => {
      if (!macAddress.value) return
      
      try {
        // Validate MAC address format
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/i
        if (!macRegex.test(macAddress.value)) {
          throw new Error('Invalid MAC address format')
        }
        
        // Extract OUI (first 6 characters)
        const oui = macAddress.value.substring(0, 8).toUpperCase()
        const vendor = ouiDatabase[oui] || 'Unknown Vendor'
        
        vendorInfo.value = {
          mac: macAddress.value,
          oui: oui,
          vendor: vendor
        }
        
        error.value = ''
      } catch (err) {
        error.value = 'Error: ' + err.message
        vendorInfo.value = null
      }
    }
    
    return {
      macAddress,
      vendorInfo,
      error,
      lookupMAC
    }
  }
}
</script>