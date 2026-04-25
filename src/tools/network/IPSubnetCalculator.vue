<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">IPv4 子网计算器</h1>
      <p class="text-gray-600 dark:text-gray-300">解析您的 IPv4 CIDR 块并获取有关您的子网的所有信息。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">带 CIDR 的 IPv4 地址</label>
        <input 
          v-model="ipInput" 
          type="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="输入带 CIDR 的 IPv4 地址（例如，192.168.1.1/24）"
        >
      </div>
      
      <div class="mb-6">
        <button 
          @click="calculateSubnet" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          计算
        </button>
      </div>
      
      <div v-if="subnetInfo" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">网络地址</label>
            <input 
              v-model="subnetInfo.networkAddress" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">广播地址</label>
            <input 
              v-model="subnetInfo.broadcastAddress" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">子网掩码</label>
            <input 
              v-model="subnetInfo.subnetMask" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">CIDR 前缀</label>
            <input 
              v-model="subnetInfo.cidr" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">主机数量</label>
            <input 
              v-model="subnetInfo.hostsCount" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">第一个主机</label>
            <input 
              v-model="subnetInfo.firstHost" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
              readonly
            >
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">最后一个主机</label>
            <input 
              v-model="subnetInfo.lastHost" 
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
  name: 'IPSubnetCalculator',
  setup() {
    const ipInput = ref('')
    const subnetInfo = ref(null)
    const error = ref('')
    
    const calculateSubnet = () => {
      if (!ipInput.value) return
      
      try {
        const [ip, cidr] = ipInput.value.split('/')
        const prefix = parseInt(cidr)
        
        if (prefix < 0 || prefix > 32) {
          throw new Error('CIDR prefix must be between 0 and 32')
        }
        
        // Convert IP to binary
        const ipParts = ip.split('.').map(Number)
        if (ipParts.length !== 4 || ipParts.some(part => part < 0 || part > 255)) {
          throw new Error('Invalid IPv4 address')
        }
        
        // Calculate subnet mask
        const subnetMaskParts = []
        for (let i = 0; i < 4; i++) {
          if (prefix >= 8) {
            subnetMaskParts.push(255)
            prefix -= 8
          } else {
            subnetMaskParts.push(255 << (8 - prefix) & 255)
            prefix = 0
          }
        }
        const subnetMask = subnetMaskParts.join('.')
        
        // Calculate network address
        const networkAddressParts = ipParts.map((part, index) => part & subnetMaskParts[index])
        const networkAddress = networkAddressParts.join('.')
        
        // Calculate broadcast address
        const broadcastAddressParts = networkAddressParts.map((part, index) => part | (255 ^ subnetMaskParts[index]))
        const broadcastAddress = broadcastAddressParts.join('.')
        
        // Calculate number of hosts
        const hostsCount = Math.pow(2, 32 - parseInt(cidr)) - 2
        
        // Calculate first and last host
        const firstHostParts = [...networkAddressParts]
        firstHostParts[3] += 1
        const firstHost = firstHostParts.join('.')
        
        const lastHostParts = [...broadcastAddressParts]
        lastHostParts[3] -= 1
        const lastHost = lastHostParts.join('.')
        
        subnetInfo.value = {
          networkAddress,
          broadcastAddress,
          subnetMask,
          cidr: `/${cidr}`,
          hostsCount,
          firstHost,
          lastHost
        }
        
        error.value = ''
      } catch (err) {
        error.value = 'Invalid input: ' + err.message
        subnetInfo.value = null
      }
    }
    
    return {
      ipInput,
      subnetInfo,
      error,
      calculateSubnet
    }
  }
}
</script>