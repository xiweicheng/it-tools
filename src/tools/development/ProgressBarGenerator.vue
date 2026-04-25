<template>
  <div class="tool-container">
    <h1 class="title">进度条生成工具</h1>
    <p class="description">生成各种风格的进度条代码，支持 CSS、Bootstrap、Tailwind CSS 等多种实现方式。</p>

    <div class="progress-card">
      <div class="form-group">
        <label>进度值：</label>
        <input
          v-model.number="progressValue"
          type="range"
          min="0"
          max="100"
          class="range-input"
          @input="updateProgress"
        />
        <div class="range-value">{{ progressValue }}%</div>
      </div>

      <div class="form-group">
        <label>进度条类型：</label>
        <select v-model="progressType" class="select-input" @change="updateProgress">
          <option value="css">纯 CSS</option>
          <option value="bootstrap">Bootstrap</option>
          <option value="tailwind">Tailwind CSS</option>
          <option value="material">Material Design</option>
        </select>
      </div>

      <div class="form-group">
        <label>样式：</label>
        <select v-model="progressStyle" class="select-input" @change="updateProgress">
          <option value="default">默认</option>
          <option value="striped">条纹</option>
          <option value="animated">动画</option>
          <option value="rounded">圆角</option>
        </select>
      </div>

      <div class="form-group">
        <label>颜色：</label>
        <div class="color-options">
          <button
            v-for="color in colors"
            :key="color.value"
            :class="{ active: selectedColor === color.value }"
            class="color-button"
            :style="{ backgroundColor: color.value }"
            @click="selectedColor = color.value; updateProgress()"
          ></button>
        </div>
      </div>

      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-container">
          <div v-if="progressType === 'css'" class="progress-preview">
            <div class="progress-bar css-progress" :style="cssProgressStyle"></div>
          </div>
          <div v-else-if="progressType === 'bootstrap'" class="progress-preview bootstrap-preview">
            <div class="progress">
              <div 
                class="progress-bar" 
                :class="bootstrapClasses"
                :style="{ width: progressValue + '%' }"
                role="progressbar"
                :aria-valuenow="progressValue"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ progressValue }}%
              </div>
            </div>
          </div>
          <div v-else-if="progressType === 'tailwind'" class="progress-preview tailwind-preview">
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div 
                class="h-4 rounded-full" 
                :class="tailwindClasses"
                :style="{ width: progressValue + '%' }"
              ></div>
            </div>
          </div>
          <div v-else-if="progressType === 'material'" class="progress-preview material-preview">
            <div class="md-progress">
              <div class="md-progress-bar" :style="materialProgressStyle"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <h3>生成的代码</h3>
        <div class="code-tabs">
          <button
            :class="{ active: codeTab === 'html' }"
            @click="codeTab = 'html'"
          >
            HTML
          </button>
          <button
            :class="{ active: codeTab === 'css' && progressType === 'css' }"
            @click="codeTab = 'css'"
            :disabled="progressType !== 'css'"
          >
            CSS
          </button>
        </div>
        <textarea
          :value="generatedCode"
          class="code-input"
          readonly
          rows="10"
        ></textarea>
        <button @click="copyCode" class="btn-copy">复制代码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const progressValue = ref(50)
const progressType = ref('css')
const progressStyle = ref('default')
const selectedColor = ref('#3b82f6')
const codeTab = ref('html')

const colors = [
  { name: '蓝色', value: '#3b82f6' },
  { name: '绿色', value: '#10b981' },
  { name: '红色', value: '#ef4444' },
  { name: '黄色', value: '#f59e0b' },
  { name: '紫色', value: '#8b5cf6' },
  { name: '青色', value: '#06b6d4' }
]

const cssProgressStyle = computed(() => {
  let style = {
    width: `${progressValue.value}%`,
    backgroundColor: selectedColor.value
  }
  
  if (progressStyle.value === 'striped') {
    style.backgroundImage = 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
    style.backgroundSize = '1rem 1rem'
  }
  
  if (progressStyle.value === 'animated') {
    style.animation = 'progress-bar-stripes 1s linear infinite'
  }
  
  if (progressStyle.value === 'rounded') {
    style.borderRadius = '0.25rem'
  }
  
  return style
})

const bootstrapClasses = computed(() => {
  let classes = ['progress-bar']
  
  if (progressStyle.value === 'striped') {
    classes.push('progress-bar-striped')
  }
  
  if (progressStyle.value === 'animated') {
    classes.push('progress-bar-striped', 'progress-bar-animated')
  }
  
  if (selectedColor === '#3b82f6') classes.push('bg-primary')
  else if (selectedColor === '#10b981') classes.push('bg-success')
  else if (selectedColor === '#ef4444') classes.push('bg-danger')
  else if (selectedColor === '#f59e0b') classes.push('bg-warning')
  else if (selectedColor === '#8b5cf6') classes.push('bg-info')
  else if (selectedColor === '#06b6d4') classes.push('bg-secondary')
  
  return classes
})

const tailwindClasses = computed(() => {
  let classes = []
  
  if (selectedColor === '#3b82f6') classes.push('bg-blue-500')
  else if (selectedColor === '#10b981') classes.push('bg-green-500')
  else if (selectedColor === '#ef4444') classes.push('bg-red-500')
  else if (selectedColor === '#f59e0b') classes.push('bg-yellow-500')
  else if (selectedColor === '#8b5cf6') classes.push('bg-purple-500')
  else if (selectedColor === '#06b6d4') classes.push('bg-cyan-500')
  
  if (progressStyle.value === 'rounded') {
    classes.push('rounded-full')
  }
  
  if (progressStyle.value === 'animated') {
    classes.push('animate-pulse')
  }
  
  return classes.join(' ')
})

const materialProgressStyle = computed(() => {
  return {
    width: `${progressValue.value}%`,
    backgroundColor: selectedColor.value,
    height: '4px',
    borderRadius: '2px'
  }
})

const generatedCode = computed(() => {
  if (codeTab.value === 'html') {
    return generateHtmlCode()
  } else if (codeTab.value === 'css' && progressType.value === 'css') {
    return generateCssCode()
  }
  return ''
})

function generateHtmlCode() {
  switch (progressType.value) {
    case 'css':
      return `<div class="progress-bar-container">
  <div class="progress-bar" style="width: ${progressValue.value}%; background-color: ${selectedColor.value}; ${progressStyle.value === 'striped' ? 'background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent); background-size: 1rem 1rem;' : ''} ${progressStyle.value === 'animated' ? 'animation: progress-bar-stripes 1s linear infinite;' : ''} ${progressStyle.value === 'rounded' ? 'border-radius: 0.25rem;' : ''}"></div>
</div>`
    
    case 'bootstrap':
      return `<div class="progress" style="height: 20px;">
  <div class="${bootstrapClasses.value.join(' ')}" style="width: ${progressValue.value}%" role="progressbar" aria-valuenow="${progressValue.value}" aria-valuemin="0" aria-valuemax="100">
    ${progressValue.value}%
  </div>
</div>`
    
    case 'tailwind':
      return `<div class="w-full bg-gray-200 rounded-full h-4">
  <div class="h-4 ${tailwindClasses.value}" style="width: ${progressValue.value}%"></div>
</div>`
    
    case 'material':
      return `<div class="md-progress">
  <div class="md-progress-bar" style="width: ${progressValue.value}%; background-color: ${selectedColor.value};"></div>
</div>`
    
    default:
      return ''
  }
}

function generateCssCode() {
  return `.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

${progressStyle.value === 'animated' ? `@keyframes progress-bar-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}` : ''}`
}

function updateProgress() {
  // 自动更新进度
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value)
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 800px;
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

.progress-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.range-input {
  width: 100%;
  margin: 0.5rem 0;
}

.range-value {
  text-align: center;
  font-weight: 600;
  color: #2563eb;
}

.color-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-button {
  width: 40px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.color-button.active {
  border-color: #333;
  transform: scale(1.1);
}

.preview-section {
  margin: 2rem 0;
}

.preview-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.preview-container {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.progress-preview {
  width: 100%;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.css-progress {
  height: 100%;
  transition: width 0.3s ease;
}

.bootstrap-preview .progress {
  height: 20px;
}

.tailwind-preview {
  background: transparent !important;
  border: none !important;
}

.md-progress {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.md-progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.code-section {
  margin-top: 2rem;
}

.code-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.code-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.code-tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.code-tabs button.active {
  background: #2563eb;
  color: white;
}

.code-tabs button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.code-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  background: #fafafa;
  white-space: pre-wrap;
  box-sizing: border-box;
}

.btn-copy {
  margin-top: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: #10b981;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  width: 100%;
}

.btn-copy:hover {
  background: #059669;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .progress-card {
  background: #262626;
}

.dark .select-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .preview-container {
  background: #1a1a1a;
  border-color: #333;
}

.dark .progress-preview {
  background-color: #333;
}

.dark .md-progress {
  background-color: #333;
}

.dark .code-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .code-tabs {
  background: #333;
}

.dark .color-button.active {
  border-color: #e5e5e5;
}

@media (max-width: 768px) {
  .color-options {
    justify-content: center;
  }
}
</style>
