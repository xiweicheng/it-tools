<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">XML 格式化</h1>
      <p class="text-gray-600 dark:text-gray-300">格式化 XML 字符串，检测语法错误。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输入 XML</label>
        <textarea 
          v-model="inputXml" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text font-mono text-sm"
          rows="8"
          placeholder="输入 XML 内容..."
        ></textarea>
      </div>
      
      <div class="mb-6 flex flex-wrap gap-2">
        <button 
          @click="formatXml" 
          class="px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          格式化 XML
        </button>
        <button 
          @click="minifyXml" 
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
        >
          压缩 XML
        </button>
        <button 
          @click="validateXml" 
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          验证 XML
        </button>
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-red-500 text-xl">✗</span>
          <span class="text-red-800 dark:text-red-200">{{ error }}</span>
        </div>
      </div>
      
      <div v-if="isValid" class="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <div class="flex items-center gap-2">
          <span class="text-green-500 text-xl">✓</span>
          <span class="text-green-800 dark:text-green-200">XML 格式有效！</span>
        </div>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">输出结果</label>
        <textarea 
          :value="outputXml" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-dark-text font-mono text-sm"
          rows="12"
          readonly
        ></textarea>
      </div>
      
      <div class="flex gap-4">
        <button 
          @click="copyOutput" 
          class="px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          复制结果
        </button>
        <button 
          @click="clearAll" 
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'XMLFormatter',
  setup() {
    const inputXml = ref('')
    const outputXml = ref('')
    const error = ref('')
    const isValid = ref(false)
    
    const formatXml = () => {
      error.value = ''
      isValid.value = false
      
      if (!inputXml.value.trim()) {
        outputXml.value = ''
        return
      }
      
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(inputXml.value, 'text/xml')
        
        const parserError = doc.querySelector('parsererror')
        if (parserError) {
          error.value = 'XML 解析错误: ' + parserError.textContent.split('\n')[0]
          outputXml.value = ''
          return
        }
        
        isValid.value = true
        outputXml.value = formatNode(doc.documentElement, 0)
      } catch (e) {
        error.value = '格式化错误: ' + e.message
        outputXml.value = ''
      }
    }
    
    const formatNode = (node, indent) => {
      if (node.nodeType === 3) { // Text node
        const text = node.textContent.trim()
        return text ? ' '.repeat(indent) + text : ''
      }
      
      if (node.nodeType === 7) { // Processing instruction
        return ' '.repeat(indent) + '<?' + node.target + ' ' + node.data + '?>'
      }
      
      if (node.nodeType === 8) { // Comment
        return ' '.repeat(indent) + '<!--' + node.textContent + '-->'
      }
      
      const children = Array.from(node.childNodes).filter(n => 
        n.nodeType !== 3 || n.textContent.trim()
      )
      
      if (children.length === 0) {
        return ' '.repeat(indent) + `<${node.tagName}${formatAttributes(node)}/>`
      }
      
      const hasTextChild = children.some(c => c.nodeType === 3)
      if (children.length === 1 && hasTextChild) {
        const text = children[0].textContent.trim()
        return ' '.repeat(indent) + `<${node.tagName}${formatAttributes(node)}>${text}</${node.tagName}>`
      }
      
      let result = ' '.repeat(indent) + `<${node.tagName}${formatAttributes(node)}>\n`
      for (const child of children) {
        result += formatNode(child, indent + 2) + '\n'
      }
      result += ' '.repeat(indent) + `</${node.tagName}>`
      
      return result
    }
    
    const formatAttributes = (node) => {
      if (!node.attributes || node.attributes.length === 0) return ''
      
      let attrs = ''
      for (const attr of node.attributes) {
        attrs += ` ${attr.name}="${attr.value}"`
      }
      return attrs
    }
    
    const minifyXml = () => {
      error.value = ''
      isValid.value = false
      
      if (!inputXml.value.trim()) {
        outputXml.value = ''
        return
      }
      
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(inputXml.value, 'text/xml')
        
        const parserError = doc.querySelector('parsererror')
        if (parserError) {
          error.value = 'XML 解析错误: ' + parserError.textContent.split('\n')[0]
          outputXml.value = ''
          return
        }
        
        isValid.value = true
        outputXml.value = minifyNode(doc.documentElement)
      } catch (e) {
        error.value = '压缩错误: ' + e.message
        outputXml.value = ''
      }
    }
    
    const minifyNode = (node) => {
      if (node.nodeType === 3) {
        const text = node.textContent.trim()
        return text || ''
      }
      
      if (node.nodeType === 7 || node.nodeType === 8) {
        return ''
      }
      
      const children = Array.from(node.childNodes).filter(n => 
        n.nodeType !== 3 || n.textContent.trim()
      )
      
      if (children.length === 0) {
        return `<${node.tagName}${formatAttributes(node)}/>`
      }
      
      const hasTextChild = children.some(c => c.nodeType === 3)
      if (children.length === 1 && hasTextChild) {
        const text = children[0].textContent.trim()
        return `<${node.tagName}${formatAttributes(node)}>${text}</${node.tagName}>`
      }
      
      let result = `<${node.tagName}${formatAttributes(node)}>`
      for (const child of children) {
        result += minifyNode(child)
      }
      result += `</${node.tagName}>`
      
      return result
    }
    
    const validateXml = () => {
      error.value = ''
      isValid.value = false
      
      if (!inputXml.value.trim()) return
      
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(inputXml.value, 'text/xml')
        
        const parserError = doc.querySelector('parsererror')
        if (parserError) {
          error.value = 'XML 解析错误: ' + parserError.textContent.split('\n')[0]
          return
        }
        
        isValid.value = true
        outputXml.value = inputXml.value
      } catch (e) {
        error.value = '验证错误: ' + e.message
      }
    }
    
    const copyOutput = () => {
      if (!outputXml.value) return
      navigator.clipboard.writeText(outputXml.value)
        .then(() => {
          alert('已复制到剪贴板!')
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
    
    const clearAll = () => {
      inputXml.value = ''
      outputXml.value = ''
      error.value = ''
      isValid.value = false
    }
    
    return {
      inputXml,
      outputXml,
      error,
      isValid,
      formatXml,
      minifyXml,
      validateXml,
      copyOutput,
      clearAll
    }
  }
}
</script>