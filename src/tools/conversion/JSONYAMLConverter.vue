<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">JSON ↔ YAML 转换器</h1>
      <p class="text-gray-600 dark:text-gray-300">在 JSON 和 YAML 格式之间相互转换。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6 flex flex-wrap gap-4">
        <button 
          @click="convertToYAML" 
          class="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          :disabled="!jsonInput"
        >
          JSON → YAML
        </button>
        <button 
          @click="convertToJSON" 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          :disabled="!yamlInput"
        >
          YAML → JSON
        </button>
        <button 
          @click="swapInputs" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ↑ 交换 ↑
        </button>
        <button 
          @click="clearAll" 
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-700 dark:text-gray-300 font-medium">JSON 输入</label>
            <button 
              v-if="jsonInput"
              @click="formatJSON"
              class="text-sm text-primary hover:underline"
            >
              格式化
            </button>
          </div>
          <textarea 
            v-model="jsonInput" 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono text-sm"
            rows="12"
            placeholder='{"name": "example", "value": 123}'
          ></textarea>
        </div>
        
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-gray-700 dark:text-gray-300 font-medium">YAML 输出</label>
            <button 
              v-if="yamlOutput"
              @click="copyOutput"
              class="text-sm text-primary hover:underline"
            >
              复制
            </button>
          </div>
          <textarea 
            v-model="yamlOutput" 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text font-mono text-sm"
            rows="12"
            placeholder="转换后的 YAML 将显示在这里..."
            readonly
          ></textarea>
        </div>
      </div>
      
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
    </div>
    
    <div class="mt-6 bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">格式说明</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-dark-text mb-2">JSON 格式</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，易于机器解析和生成。
          </p>
          <ul class="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>使用大括号 {} 表示对象</li>
            <li>使用方括号 [] 表示数组</li>
            <li>键值对用冒号 : 分隔</li>
            <li>字符串必须用双引号</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-800 dark:text-dark-text mb-2">YAML 格式</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            YAML (YAML Ain't Markup Language) 是一种人类可读的数据序列化格式。
          </p>
          <ul class="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>使用缩进表示层级结构</li>
            <li>键值对用冒号 : 分隔</li>
            <li>字符串可不用引号</li>
            <li>支持注释（以 # 开头）</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'JSONYAMLConverter',
  setup() {
    const jsonInput = ref('')
    const yamlOutput = ref('')
    const error = ref('')
    
    const jsonToYaml = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent)
      let result = ''
      
      if (Array.isArray(obj)) {
        for (const item of obj) {
          if (typeof item === 'object' && item !== null) {
            result += `${spaces}- ${jsonToYaml(item, indent + 1).trim()}\n`
          } else {
            result += `${spaces}- ${formatYamlValue(item)}\n`
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              result += `${spaces}${key}:\n`
              result += jsonToYaml(value, indent + 1)
            } else {
              result += `${spaces}${key}: ${jsonToYaml(value, indent).trim()}\n`
            }
          } else {
            result += `${spaces}${key}: ${formatYamlValue(value)}\n`
          }
        }
      } else {
        result += formatYamlValue(obj)
      }
      
      return result
    }
    
    const formatYamlValue = (value) => {
      if (value === null) return 'null'
      if (value === true) return 'true'
      if (value === false) return 'false'
      if (typeof value === 'number') return value.toString()
      if (typeof value === 'string') {
        if (value.includes('\n') || value.includes(':') || value.includes('#')) {
          return `"${value.replace(/"/g, '\\"')}"`
        }
        return value
      }
      return value.toString()
    }
    
    const yamlToJson = (yaml) => {
      const lines = yaml.split('\n')
      let index = 0
      let result = {}
      
      const parseValue = (line, currentIndent) => {
        line = line.replace(/\s+$/, '')
        if (!line || line.trim().startsWith('#')) return undefined
        
        const lineIndent = line.search(/\S/)
        if (lineIndent < currentIndent) return undefined
        
        line = line.substring(lineIndent)
        
        if (line.includes(':')) {
          const colonIndex = line.indexOf(':')
          const key = line.substring(0, colonIndex).trim()
          const rest = line.substring(colonIndex + 1).trim()
          
          if (!rest) {
            const obj = {}
            let nextLine = lines[++index]
            while (nextLine !== undefined) {
              const nextIndent = nextLine.search(/\S/)
              if (nextIndent <= currentIndent) break
              
              const parsed = parseValue(nextLine, nextIndent)
              if (parsed === undefined) break
              
              if (Array.isArray(parsed)) {
                obj[key] = parsed
              } else if (typeof parsed === 'object') {
                obj[key] = parsed
              } else {
                const [k, v] = Object.entries(parsed)[0]
                if (!obj[key]) obj[key] = {}
                obj[key][k] = v
              }
              
              nextLine = lines[++index]
            }
            if (nextLine !== undefined) index--
            return { [key]: obj[key] }
          }
          
          if (rest === 'null' || rest === '~') return { [key]: null }
          if (rest === 'true') return { [key]: true }
          if (rest === 'false') return { [key]: false }
          if (/^-?\d+$/.test(rest)) return { [key]: parseInt(rest) }
          if (/^-?\d+\.\d+$/.test(rest)) return { [key]: parseFloat(rest) }
          if ((rest.startsWith('"') && rest.endsWith('"')) || 
              (rest.startsWith("'") && rest.endsWith("'"))) {
            return { [key]: rest.slice(1, -1) }
          }
          
          return { [key]: rest }
        }
        
        if (line.trim().startsWith('-')) {
          const arr = []
          while (line && line.trim().startsWith('-')) {
            const value = line.trim().substring(1).trim()
            if (value) {
              if (value === 'null' || value === '~') arr.push(null)
              else if (value === 'true') arr.push(true)
              else if (value === 'false') arr.push(false)
              else if (/^-?\d+$/.test(value)) arr.push(parseInt(value))
              else if (/^-?\d+\.\d+$/.test(value)) arr.push(parseFloat(value))
              else if ((value.startsWith('"') && value.endsWith('"')) ||
                       (value.startsWith("'") && value.endsWith("'"))) {
                arr.push(value.slice(1, -1))
              } else {
                arr.push(value)
              }
            }
            line = lines[++index]
          }
          index--
          return arr
        }
        
        return undefined
      }
      
      while (index < lines.length) {
        const line = lines[index]
        const parsed = parseValue(line, -1)
        if (parsed !== undefined) {
          result = { ...result, ...parsed }
        }
        index++
      }
      
      return result
    }
    
    const convertToYAML = () => {
      if (!jsonInput.value) return
      
      error.value = ''
      try {
        const jsonObj = JSON.parse(jsonInput.value)
        yamlOutput.value = jsonToYaml(jsonObj).trim()
      } catch (e) {
        error.value = 'JSON 解析错误: ' + e.message
        yamlOutput.value = ''
      }
    }
    
    const convertToJSON = () => {
      if (!jsonInput.value) return
      
      error.value = ''
      try {
        const yamlObj = yamlToJson(jsonInput.value)
        yamlOutput.value = JSON.stringify(yamlObj, null, 2)
      } catch (e) {
        error.value = 'YAML 解析错误: ' + e.message
        yamlOutput.value = ''
      }
    }
    
    const swapInputs = () => {
      const temp = jsonInput.value
      jsonInput.value = yamlOutput.value
      yamlOutput.value = temp
    }
    
    const clearAll = () => {
      jsonInput.value = ''
      yamlOutput.value = ''
      error.value = ''
    }
    
    const formatJSON = () => {
      try {
        const obj = JSON.parse(jsonInput.value)
        jsonInput.value = JSON.stringify(obj, null, 2)
      } catch (e) {
        error.value = '格式化错误: ' + e.message
      }
    }
    
    const copyOutput = () => {
      if (!yamlOutput.value) return
      navigator.clipboard.writeText(yamlOutput.value)
        .then(() => {
          alert('已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    return {
      jsonInput,
      yamlOutput,
      error,
      convertToYAML,
      convertToJSON,
      swapInputs,
      clearAll,
      formatJSON,
      copyOutput
    }
  }
}
</script>