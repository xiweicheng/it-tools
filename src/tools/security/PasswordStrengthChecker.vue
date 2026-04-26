<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">密码强度检查器</h1>
      <p class="text-gray-600 dark:text-gray-300">检查密码强度并获取改进建议。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入密码</label>
        <div class="password-input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text pr-12"
            placeholder="输入密码进行检测..."
            @input="checkStrength"
          >
          <button
            type="button"
            class="toggle-visibility-btn"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>
      
      <div class="mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-700 dark:text-gray-300">密码强度</span>
          <span :class="strengthClass">{{ strengthText }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            class="h-2.5 rounded-full transition-all duration-300"
            :class="strengthBarClass"
            :style="{ width: strengthPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">密码要求</h3>
        <div class="space-y-2">
          <div 
            v-for="(requirement, index) in requirements" 
            :key="index"
            class="flex items-center"
          >
            <span 
              class="w-6 h-6 mr-2 rounded-full flex items-center justify-center text-white text-sm"
              :class="requirement.met ? 'bg-green-500' : 'bg-gray-400'"
            >
              {{ requirement.met ? '✓' : '✗' }}
            </span>
            <span :class="requirement.met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'">
              {{ requirement.text }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="password" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">密码统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400">长度</div>
            <div class="text-xl font-semibold text-gray-800 dark:text-dark-text">{{ password.length }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400">字符类型</div>
            <div class="text-xl font-semibold text-gray-800 dark:text-dark-text">{{ charTypesCount }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400">唯一字符</div>
            <div class="text-xl font-semibold text-gray-800 dark:text-dark-text">{{ uniqueCharsCount }}</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400">强度分数</div>
            <div class="text-xl font-semibold text-gray-800 dark:text-dark-text">{{ strengthScore }}/100</div>
          </div>
        </div>
      </div>
      
      <div v-if="suggestions.length > 0" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">改进建议</h3>
        <ul class="space-y-2">
          <li 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            class="flex items-start"
          >
            <span class="text-yellow-500 mr-2">💡</span>
            <span class="text-gray-600 dark:text-gray-300">{{ suggestion }}</span>
          </li>
        </ul>
      </div>
      
      <div class="flex gap-4">
        <button 
          @click="generatePassword" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          生成强密码
        </button>
        <button 
          @click="clearAll" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PasswordStrengthChecker',
  setup() {
    const password = ref('')
    const showPassword = ref(false)
    
    const requirements = computed(() => [
      { text: '至少 8 个字符', met: password.value.length >= 8 },
      { text: '包含大写字母 (A-Z)', met: /[A-Z]/.test(password.value) },
      { text: '包含小写字母 (a-z)', met: /[a-z]/.test(password.value) },
      { text: '包含数字 (0-9)', met: /[0-9]/.test(password.value) },
      { text: '包含特殊字符 (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value) }
    ])
    
    const charTypesCount = computed(() => {
      let count = 0
      if (/[a-z]/.test(password.value)) count++
      if (/[A-Z]/.test(password.value)) count++
      if (/[0-9]/.test(password.value)) count++
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) count++
      return count
    })
    
    const uniqueCharsCount = computed(() => {
      return new Set(password.value).size
    })
    
    const strengthScore = computed(() => {
      if (!password.value) return 0
      let score = 0
      
      // Length scoring
      if (password.value.length >= 8) score += 20
      if (password.value.length >= 12) score += 10
      if (password.value.length >= 16) score += 10
      
      // Character type scoring
      score += charTypesCount.value * 15
      
      // Unique character ratio
      const uniqueRatio = uniqueCharsCount.value / password.value.length
      score += Math.round(uniqueRatio * 20)
      
      return Math.min(score, 100)
    })
    
    const strengthPercentage = computed(() => strengthScore.value)
    
    const strengthText = computed(() => {
      if (!password.value) return ''
      if (strengthScore.value < 40) return '弱'
      if (strengthScore.value < 60) return '中等'
      if (strengthScore.value < 80) return '良好'
      return '强'
    })
    
    const strengthClass = computed(() => {
      if (!password.value) return ''
      if (strengthScore.value < 40) return 'text-red-600 dark:text-red-400'
      if (strengthScore.value < 60) return 'text-yellow-600 dark:text-yellow-400'
      if (strengthScore.value < 80) return 'text-blue-600 dark:text-blue-400'
      return 'text-green-600 dark:text-green-400'
    })
    
    const strengthBarClass = computed(() => {
      if (!password.value) return 'bg-gray-400'
      if (strengthScore.value < 40) return 'bg-red-500'
      if (strengthScore.value < 60) return 'bg-yellow-500'
      if (strengthScore.value < 80) return 'bg-blue-500'
      return 'bg-green-500'
    })
    
    const suggestions = computed(() => {
      const sug = []
      if (password.value.length < 8) sug.push('密码长度至少为 8 个字符')
      if (!/[A-Z]/.test(password.value)) sug.push('添加大写字母以提高强度')
      if (!/[a-z]/.test(password.value)) sug.push('添加小写字母以提高强度')
      if (!/[0-9]/.test(password.value)) sug.push('添加数字以提高强度')
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) sug.push('添加特殊字符 (!@#$%^&*) 以提高强度')
      if (password.value.length < 12) sug.push('考虑使用 12 位或更长的密码')
      return sug
    })
    
    const checkStrength = () => {
      // Results are computed automatically
    }
    
    const generatePassword = () => {
      const chars = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      }
      
      let generated = ''
      generated += chars.lower[Math.floor(Math.random() * chars.lower.length)]
      generated += chars.upper[Math.floor(Math.random() * chars.upper.length)]
      generated += chars.numbers[Math.floor(Math.random() * chars.numbers.length)]
      generated += chars.symbols[Math.floor(Math.random() * chars.symbols.length)]
      
      const allChars = chars.lower + chars.upper + chars.numbers + chars.symbols
      for (let i = 4; i < 16; i++) {
        generated += allChars[Math.floor(Math.random() * allChars.length)]
      }
      
      // Shuffle the password
      generated = generated.split('').sort(() => Math.random() - 0.5).join('')
      password.value = generated
    }
    
    const clearAll = () => {
      password.value = ''
    }
    
    return {
      password,
      showPassword,
      requirements,
      charTypesCount,
      uniqueCharsCount,
      strengthScore,
      strengthPercentage,
      strengthText,
      strengthClass,
      strengthBarClass,
      suggestions,
      checkStrength,
      generatePassword,
      clearAll
    }
  }
}
</script>

<style scoped>
.password-input-wrapper {
  position: relative;
}
.toggle-visibility-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
}
</style>