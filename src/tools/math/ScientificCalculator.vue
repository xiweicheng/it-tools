<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">科学计算器</h1>
      <p class="text-gray-600 dark:text-gray-300">支持基本运算、三角函数、对数、幂运算等的科学计算器。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md max-w-lg mx-auto">
      <div class="mb-4">
        <input 
          v-model="expression" 
          type="text" 
          class="w-full px-4 py-3 text-right text-2xl rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text font-mono"
          placeholder="0"
          readonly
        >
      </div>
      
      <div class="mb-2">
        <input 
          v-model="result" 
          type="text" 
          class="w-full px-4 py-2 text-right text-xl rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono"
          placeholder="="
          readonly
        >
      </div>
      
      <div class="grid grid-cols-5 gap-2">
        <button @click="clear" class="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">C</button>
        <button @click="backspace" class="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors">⌫</button>
        <button @click="input='('" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">(</button>
        <button @click="input=')'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">)</button>
        <button @click="input='%'" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">%</button>
        
        <button @click="input='sin'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">sin</button>
        <button @click="input='cos'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">cos</button>
        <button @click="input='tan'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">tan</button>
        <button @click="input='log'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">log</button>
        <button @click="input='ln'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">ln</button>
        
        <button @click="input='√'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">√</button>
        <button @click="input='^'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">x^y</button>
        <button @click="input='π'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">π</button>
        <button @click="input='e'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">e</button>
        <button @click="input='!'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">n!</button>
        
        <button @click="input='7'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">7</button>
        <button @click="input='8'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">8</button>
        <button @click="input='9'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">9</button>
        <button @click="input='÷'" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">÷</button>
        <button @click="input='1/x'" class="px-4 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">1/x</button>
        
        <button @click="input='4'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">4</button>
        <button @click="input='5'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">5</button>
        <button @click="input='6'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">6</button>
        <button @click="input='×'" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">×</button>
        <button @click="calculate" class="px-4 py-3 row-span-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors">=</button>
        
        <button @click="input='1'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">1</button>
        <button @click="input='2'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">2</button>
        <button @click="input='3'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">3</button>
        <button @click="input='-'" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">−</button>
        
        <button @click="input='0'" class="px-4 py-3 col-span-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors text-left pl-4">0</button>
        <button @click="input='.'" class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors">.</button>
        <button @click="input='+'" class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors">+</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ScientificCalculator',
  setup() {
    const expression = ref('')
    const result = ref('')
    
    const input = (value) => {
      expression.value += value
    }
    
    const clear = () => {
      expression.value = ''
      result.value = ''
    }
    
    const backspace = () => {
      expression.value = expression.value.slice(0, -1)
    }
    
    const factorial = (n) => {
      if (n < 0) return NaN
      if (n === 0 || n === 1) return 1
      let res = 1
      for (let i = 2; i <= n; i++) res *= i
      return res
    }
    
    const calculate = () => {
      try {
        let expr = expression.value
        
        // Replace display symbols with evaluable ones
        expr = expr.replace(/×/g, '*')
        expr = expr.replace(/÷/g, '/')
        expr = expr.replace(/−/g, '-')
        expr = expr.replace(/π/g, `(${Math.PI})`)
        expr = expr.replace(/e(?![x])/g, `(${Math.E})`)
        expr = expr.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        expr = expr.replace(/√/g, 'Math.sqrt')
        expr = expr.replace(/\^/g, '**')
        expr = expr.replace(/sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)')
        expr = expr.replace(/cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)')
        expr = expr.replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)')
        expr = expr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
        expr = expr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
        expr = expr.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)))
        expr = expr.replace(/1\/x/g, '1/x')
        
        // Handle factorial with parentheses edge case
        expr = expr.replace(/\(([^)]+)!\)/g, (match, content) => {
          return factorial(eval(content))
        })
        
        // Use Function for safer evaluation
        const evalFunc = new Function(`return (${expr})`)
        const res = evalFunc()
        
        if (isNaN(res) || !isFinite(res)) {
          result.value = 'Error'
        } else {
          result.value = Number.isInteger(res) ? res.toString() : res.toFixed(10).replace(/\.?0+$/, '')
        }
      } catch (e) {
        result.value = 'Error'
      }
    }
    
    return {
      expression,
      result,
      input,
      clear,
      backspace,
      calculate
    }
  }
}
</script>