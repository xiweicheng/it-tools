<template>
  <div class="tool-container">
    <h1 class="title">注释生成工具</h1>
    <p class="description">为代码生成各种风格的注释，支持多种编程语言和注释格式。</p>

    <div class="comment-card">
      <div class="form-group">
        <label>选择编程语言：</label>
        <select v-model="language" class="select-input" @change="updateCommentStyle">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C/C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
        </select>
      </div>

      <div class="form-group">
        <label>注释类型：</label>
        <select v-model="commentType" class="select-input" @change="generateComment">
          <option value="single">单行注释</option>
          <option value="multi">多行注释</option>
          <option value="function">函数注释</option>
          <option value="class">类注释</option>
          <option value="block">区块注释</option>
          <option value="header">文件头部注释</option>
        </select>
      </div>

      <div v-if="commentType === 'function'" class="form-group">
        <label>函数名称：</label>
        <input
          v-model="functionName"
          type="text"
          class="text-input"
          placeholder="输入函数名称"
          @input="generateComment"
        />
      </div>

      <div v-if="commentType === 'function'" class="form-group">
        <label>参数（每行一个，格式: 参数名: 类型: 描述）：</label>
        <textarea
          v-model="parameters"
          class="text-input"
          placeholder="param1: string: 描述\nparam2: number: 描述"
          @input="generateComment"
        ></textarea>
      </div>

      <div v-if="commentType === 'function' || commentType === 'class'" class="form-group">
        <label>描述：</label>
        <textarea
          v-model="description"
          class="text-input"
          placeholder="输入描述"
          @input="generateComment"
        ></textarea>
      </div>

      <div v-if="commentType === 'header'" class="form-group">
        <label>文件名称：</label>
        <input
          v-model="fileName"
          type="text"
          class="text-input"
          placeholder="输入文件名称"
          @input="generateComment"
        />
      </div>

      <div v-if="commentType === 'header'" class="form-group">
        <label>作者：</label>
        <input
          v-model="author"
          type="text"
          class="text-input"
          placeholder="输入作者姓名"
          @input="generateComment"
        />
      </div>

      <div v-if="commentType === 'header'" class="form-group">
        <label>版本：</label>
        <input
          v-model="version"
          type="text"
          class="text-input"
          placeholder="输入版本号"
          @input="generateComment"
        />
      </div>

      <div class="form-group">
        <label>生成的注释：</label>
        <textarea
          :value="generatedComment"
          class="text-input result"
          readonly
          rows="10"
        ></textarea>
      </div>

      <div class="action-buttons">
        <button @click="copyComment" class="btn-primary">复制注释</button>
        <button @click="resetForm" class="btn-secondary">重置</button>
      </div>
    </div>

    <div class="examples-section">
      <h3>示例</h3>
      <div class="example-grid">
        <div class="example-card">
          <h4>JavaScript 函数注释</h4>
          <pre>/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b;
}</pre>
        </div>
        <div class="example-card">
          <h4>Python 多行注释</h4>
          <pre>"""
这是一个多行注释
可以包含多行内容
用于详细说明代码的功能
"""
</pre>
        </div>
        <div class="example-card">
          <h4>Java 类注释</h4>
          <pre>/**
 * 用户类
 * 表示系统中的用户对象
 */
public class User {
  // 类成员
}
</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const language = ref('javascript')
const commentType = ref('single')
const functionName = ref('')
const parameters = ref('')
const description = ref('')
const fileName = ref('')
const author = ref('')
const version = ref('1.0.0')

const commentStyles = {
  javascript: {
    single: '//',
    multi: ['/**', ' * ', ' */'],
    function: ['/**', ' * ', ' */'],
    class: ['/**', ' * ', ' */'],
    block: ['/**', ' * ', ' */'],
    header: ['/**', ' * ', ' */']
  },
  python: {
    single: '#',
    multi: ['"""', '', '"""'],
    function: ['"""', '', '"""'],
    class: ['"""', '', '"""'],
    block: ['"""', '', '"""'],
    header: ['"""', '', '"""']
  },
  java: {
    single: '//',
    multi: ['/*', ' * ', ' */'],
    function: ['/**', ' * ', ' */'],
    class: ['/**', ' * ', ' */'],
    block: ['/*', ' * ', ' */'],
    header: ['/**', ' * ', ' */']
  },
  c: {
    single: '//',
    multi: ['/*', ' * ', ' */'],
    function: ['/**', ' * ', ' */'],
    class: ['/**', ' * ', ' */'],
    block: ['/*', ' * ', ' */'],
    header: ['/**', ' * ', ' */']
  },
  html: {
    single: '<!--',
    multi: ['<!--', '', '-->'],
    function: ['<!--', '', '-->'],
    class: ['<!--', '', '-->'],
    block: ['<!--', '', '-->'],
    header: ['<!--', '', '-->']
  },
  css: {
    single: '/*',
    multi: ['/*', '', '*/'],
    function: ['/*', '', '*/'],
    class: ['/*', '', '*/'],
    block: ['/*', '', '*/'],
    header: ['/*', '', '*/']
  },
  php: {
    single: '//',
    multi: ['/*', ' * ', ' */'],
    function: ['/**', ' * ', ' */'],
    class: ['/**', ' * ', ' */'],
    block: ['/*', ' * ', ' */'],
    header: ['/**', ' * ', ' */']
  },
  go: {
    single: '//',
    multi: ['/*', '', '*/'],
    function: ['//', '', ''],
    class: ['//', '', ''],
    block: ['/*', '', '*/'],
    header: ['/*', '', '*/']
  }
}

const generatedComment = computed(() => {
  const style = commentStyles[language.value][commentType.value]
  
  switch (commentType.value) {
    case 'single':
      return `${style} ${description.value || '注释内容'}`
    
    case 'multi':
      if (Array.isArray(style)) {
        const lines = description.value.split('\n')
        const commentLines = [style[0]]
        lines.forEach(line => {
          commentLines.push(`${style[1]}${line}`)
        })
        commentLines.push(style[2])
        return commentLines.join('\n')
      }
      return `${style} ${description.value} ${style}`
    
    case 'function':
      if (Array.isArray(style)) {
        const commentLines = [style[0]]
        if (description.value) {
          commentLines.push(`${style[1]}${description.value}`)
        } else {
          commentLines.push(`${style[1]}${functionName.value || '函数'} 功能描述`)
        }
        
        if (parameters.value) {
          const paramLines = parameters.value.split('\n')
          paramLines.forEach(line => {
            const [name, type, desc] = line.split(':').map(p => p.trim())
            if (name) {
              if (language.value === 'javascript' || language.value === 'java' || language.value === 'php') {
                commentLines.push(`${style[1]}@param {${type || 'type'}} ${name} - ${desc || '描述'}`)
              } else {
                commentLines.push(`${style[1]}@param ${name} ${desc || '描述'}`)
              }
            }
          })
        }
        
        commentLines.push(`${style[1]}@returns {type} 返回值描述`)
        commentLines.push(style[2])
        return commentLines.join('\n')
      }
      return ''
    
    case 'class':
      if (Array.isArray(style)) {
        const commentLines = [style[0]]
        if (description.value) {
          commentLines.push(`${style[1]}${description.value}`)
        } else {
          commentLines.push(`${style[1]}类的功能描述`)
        }
        commentLines.push(style[2])
        return commentLines.join('\n')
      }
      return ''
    
    case 'header':
      if (Array.isArray(style)) {
        const commentLines = [style[0]]
        commentLines.push(`${style[1]}${fileName.value || '文件名'}`)
        if (description.value) {
          commentLines.push(`${style[1]}${description.value}`)
        }
        if (author.value) {
          commentLines.push(`${style[1]}作者: ${author.value}`)
        }
        commentLines.push(`${style[1]}版本: ${version.value}`)
        commentLines.push(`${style[1]}创建时间: ${new Date().toLocaleString()}`)
        commentLines.push(style[2])
        return commentLines.join('\n')
      }
      return ''
    
    case 'block':
      if (Array.isArray(style)) {
        const lines = description.value.split('\n')
        const commentLines = [style[0]]
        lines.forEach(line => {
          commentLines.push(`${style[1]}${line}`)
        })
        commentLines.push(style[2])
        return commentLines.join('\n')
      }
      return `${style} ${description.value} ${style}`
    
    default:
      return ''
  }
})

function updateCommentStyle() {
  // 风格更新时重新生成注释
}

function generateComment() {
  // 生成注释
}

function copyComment() {
  navigator.clipboard.writeText(generatedComment.value)
}

function resetForm() {
  functionName.value = ''
  parameters.value = ''
  description.value = ''
  fileName.value = ''
  author.value = ''
  version.value = '1.0.0'
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.comment-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input,
.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.text-input.result {
  background: #fafafa;
  font-family: monospace;
  white-space: pre-wrap;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e5e5;
  color: #333;
}

.btn-secondary:hover {
  background: #d4d4d4;
}

.examples-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.examples-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.example-card {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eee;
}

.example-card h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #666;
}

.example-card pre {
  margin: 0;
  padding: 0.75rem;
  background: #f8f8f8;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  white-space: pre-wrap;
  line-height: 1.4;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .comment-card,
.dark .examples-section {
  background: #262626;
}

.dark .select-input,
.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .text-input.result {
  background: #1a1a1a;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .example-card {
  background: #1a1a1a;
  border-color: #333;
}

.dark .example-card h4 {
  color: #a3a3a3;
}

.dark .example-card pre {
  background: #262626;
  color: #e5e5e5;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .example-grid {
    grid-template-columns: 1fr;
  }
}
</style>
