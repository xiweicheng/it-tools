<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">JWT 解码器</h1>
      <p class="text-gray-600 dark:text-gray-300">解码 JSON Web Tokens，查看 Header、Payload 和签名信息。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">JWT Token</label>
        <textarea 
          v-model="jwtToken" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono text-sm"
          rows="4"
          placeholder="粘贴 JWT Token..."
          @input="decodeJWT"
        ></textarea>
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
      
      <div v-if="decoded" class="space-y-6">
        <div class="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">🔒</span>
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">Header (头部)</h3>
          </div>
          <div class="bg-white dark:bg-gray-100 p-3 rounded-lg">
            <pre class="text-sm font-mono text-gray-800 overflow-x-auto">{{ headerPretty }}</pre>
          </div>
        </div>
        
        <div class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">📦</span>
            <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200">Payload (载荷)</h3>
          </div>
          <div class="bg-white dark:bg-gray-100 p-3 rounded-lg">
            <pre class="text-sm font-mono text-gray-800 overflow-x-auto">{{ payloadPretty }}</pre>
          </div>
          
          <div v-if="payload.exp" class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <div class="flex items-center gap-2">
              <span class="text-yellow-600">⏰</span>
              <span class="text-sm text-yellow-800 dark:text-yellow-200">
                过期时间：{{ formatTimestamp(payload.exp) }}
                <span v-if="isExpired" class="text-red-600 font-semibold">(已过期)</span>
                <span v-else class="text-green-600 font-semibold">(有效)</span>
              </span>
            </div>
          </div>
          
          <div v-if="payload.iat" class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              签发时间：{{ formatTimestamp(payload.iat) }}
            </span>
          </div>
          
          <div v-if="payload.nbf" class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              生效时间：{{ formatTimestamp(payload.nbf) }}
            </span>
          </div>
        </div>
        
        <div class="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">✍️</span>
            <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">Signature (签名)</h3>
          </div>
          <div class="bg-white dark:bg-gray-100 p-3 rounded-lg">
            <p class="text-sm font-mono text-gray-800 break-all">{{ signature }}</p>
          </div>
          <p class="mt-2 text-sm text-green-700 dark:text-green-300">
            注意：此工具只解码 JWT，不验证签名。生产环境中应始终验证签名。
          </p>
        </div>
      </div>
      
      <div class="mt-6 flex gap-4">
        <button 
          @click="pasteFromClipboard" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          从剪贴板粘贴
        </button>
        <button 
          @click="clearAll" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
    </div>
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">JWT 格式说明</h3>
      <div class="space-y-3 text-gray-600 dark:text-gray-300">
        <p>JWT (JSON Web Token) 由三部分组成，用点号分隔：</p>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
          <div>xxxxx.yyyyy.zzzzz</div>
          <div class="flex mt-2">
            <span class="text-red-600 mr-2">Header</span>
            <span class="text-blue-600 mr-2">Payload</span>
            <span class="text-green-600">Signature</span>
          </div>
        </div>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>Header：</strong>包含令牌类型和签名算法</li>
          <li><strong>Payload：</strong>包含声明（claims）信息</li>
          <li><strong>Signature：</strong>用于验证消息的完整性</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'JWTDecoder',
  setup() {
    const jwtToken = ref('')
    const header = ref(null)
    const payload = ref(null)
    const signature = ref('')
    const error = ref('')
    
    const headerPretty = computed(() => {
      if (!header.value) return ''
      return JSON.stringify(header.value, null, 2)
    })
    
    const payloadPretty = computed(() => {
      if (!payload.value) return ''
      return JSON.stringify(payload.value, null, 2)
    })
    
    const isExpired = computed(() => {
      if (!payload.value || !payload.value.exp) return false
      return Date.now() / 1000 > payload.value.exp
    })
    
    const decodeBase64Url = (str) => {
      str = str.replace(/-/g, '+').replace(/_/g, '/')
      while (str.length % 4) {
        str += '='
      }
      return atob(str)
    }
    
    const decodeJWT = () => {
      error.value = ''
      header.value = null
      payload.value = null
      signature.value = ''
      
      if (!jwtToken.value.trim()) return
      
      try {
        const parts = jwtToken.value.trim().split('.')
        if (parts.length !== 3) {
          error.value = '无效的 JWT 格式，JWT 应该包含 3 个部分'
          return
        }
        
        const [headerPart, payloadPart, signaturePart] = parts
        
        // Decode header
        const headerJson = decodeBase64Url(headerPart)
        header.value = JSON.parse(headerJson)
        
        // Decode payload
        const payloadJson = decodeBase64Url(payloadPart)
        payload.value = JSON.parse(payloadJson)
        
        // Store signature
        signature.value = signaturePart
        
      } catch (e) {
        error.value = '解码失败: ' + e.message
      }
    }
    
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp * 1000)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
    
    const pasteFromClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        jwtToken.value = text.trim()
        decodeJWT()
      } catch (err) {
        console.error('粘贴失败:', err)
        alert('粘贴失败，请手动粘贴')
      }
    }
    
    const clearAll = () => {
      jwtToken.value = ''
      header.value = null
      payload.value = null
      signature.value = ''
      error.value = ''
    }
    
    return {
      jwtToken,
      header,
      payload,
      signature,
      error,
      headerPretty,
      payloadPretty,
      isExpired,
      decodeJWT,
      formatTimestamp,
      pasteFromClipboard,
      clearAll
    }
  }
}
</script>