<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">IP 地址查询</h1>
      <p class="text-gray-600 dark:text-gray-300">查询 IP 地址的地理位置和详细信息。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">IP 地址（留空查询本机 IP）</label>
        <div class="flex gap-4">
          <input 
            v-model="ipAddress" 
            type="text" 
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
            placeholder="例如：8.8.8.8"
            @keyup.enter="lookupIP"
          >
          <button 
            @click="lookupIP" 
            class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            :disabled="loading"
          >
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </div>
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
      
      <div v-if="ipInfo" class="space-y-6">
        <div class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="flex items-center gap-4">
            <div class="text-4xl">🌐</div>
            <div>
              <div class="text-2xl font-bold text-gray-800 dark:text-dark-text">{{ ipInfo.ip }}</div>
              <div class="text-gray-600 dark:text-gray-300">{{ ipInfo.isp }}</div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-800 dark:text-dark-text mb-3">位置信息</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">国家/地区：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.country }} {{ ipInfo.countryCode }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">省份/州：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.regionName || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">城市：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.city || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">时区：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.timezone || '-' }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-800 dark:text-dark-text mb-3">其他信息</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">组织/运营商：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.org || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">AS 编号：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.as || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">经度：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.lon || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">纬度：</span>
                <span class="text-gray-800 dark:text-dark-text">{{ ipInfo.lat || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="ipInfo.lat && ipInfo.lon" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-800 dark:text-dark-text mb-3">地图位置</h3>
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
            <p class="text-gray-500">经度: {{ ipInfo.lon }}, 纬度: {{ ipInfo.lat }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">IP 地址类型</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="space-y-2">
          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="font-medium text-gray-800 dark:text-dark-text">IPv4</div>
            <div class="text-gray-500">例如：192.168.1.1</div>
            <div class="text-gray-400 mt-1">32 位地址，约 42 亿个地址</div>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="font-medium text-gray-800 dark:text-dark-text">IPv6</div>
            <div class="text-gray-500">例如：2001:0db8:85a3::8a2e:0370:7334</div>
            <div class="text-gray-400 mt-1">128 位地址，几乎无限</div>
          </div>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="font-medium text-gray-800 dark:text-dark-text mb-2">私有 IP 地址范围</div>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>10.0.0.0 - 10.255.255.255</li>
            <li>172.16.0.0 - 172.31.255.255</li>
            <li>192.168.0.0 - 192.168.255.255</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'IPAddressLookup',
  setup() {
    const ipAddress = ref('')
    const ipInfo = ref(null)
    const error = ref('')
    const loading = ref(false)
    
    const lookupIP = async () => {
      loading.value = true
      error.value = ''
      ipInfo.value = null
      
      try {
        let url = 'http://ip-api.com/json'
        if (ipAddress.value) {
          url += `/${ipAddress.value}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.status === 'fail') {
          error.value = data.message || '查询失败，请检查 IP 地址格式'
          return
        }
        
        ipInfo.value = data
      } catch (e) {
        error.value = '网络请求失败: ' + e.message
      } finally {
        loading.value = false
      }
    }
    
    return {
      ipAddress,
      ipInfo,
      error,
      loading,
      lookupIP
    }
  }
}
</script>