<template>
  <div class="tool-container">
    <h1 class="title">CSS 代码生成器</h1>
    <p class="description">生成常用 CSS 效果代码，包括阴影、圆角、渐变、动画等。</p>

    <div class="css-card">
      <div class="effects-section">
        <h3>选择 CSS 效果</h3>
        <div class="effects-grid">
          <button
            v-for="effect in effects"
            :key="effect.id"
            :class="{ active: selectedEffect === effect.id }"
            class="effect-button"
            @click="selectedEffect = effect.id; generateCode()"
          >
            <span class="effect-icon">{{ effect.icon }}</span>
            <span class="effect-name">{{ effect.name }}</span>
          </button>
        </div>
      </div>

      <div class="controls-section" v-if="selectedEffect === 'box-shadow'">
        <h3>阴影效果参数</h3>
        <div class="control-grid">
          <div class="control-item">
            <label>X 偏移</label>
            <input v-model.number="shadow.x" type="range" min="-50" max="50" @input="generateCode" />
            <span>{{ shadow.x }}px</span>
          </div>
          <div class="control-item">
            <label>Y 偏移</label>
            <input v-model.number="shadow.y" type="range" min="-50" max="50" @input="generateCode" />
            <span>{{ shadow.y }}px</span>
          </div>
          <div class="control-item">
            <label>模糊半径</label>
            <input v-model.number="shadow.blur" type="range" min="0" max="100" @input="generateCode" />
            <span>{{ shadow.blur }}px</span>
          </div>
          <div class="control-item">
            <label>扩展半径</label>
            <input v-model.number="shadow.spread" type="range" min="-50" max="50" @input="generateCode" />
            <span>{{ shadow.spread }}px</span>
          </div>
          <div class="control-item">
            <label>阴影颜色</label>
            <input v-model="shadow.color" type="color" @input="generateCode" />
          </div>
        </div>
        <div class="preview-box" :style="{ boxShadow: generatedCode }"></div>
      </div>

      <div class="controls-section" v-if="selectedEffect === 'border-radius'">
        <h3>圆角参数</h3>
        <div class="control-grid">
          <div class="control-item">
            <label>圆角大小</label>
            <input v-model.number="borderRadius.radius" type="range" min="0" max="100" @input="generateCode" />
            <span>{{ borderRadius.radius }}px</span>
          </div>
          <div class="control-item">
            <label>圆角位置</label>
            <select v-model="borderRadius.position" @change="generateCode">
              <option value="all">全部角</option>
              <option value="top-left">左上角</option>
              <option value="top-right">右上角</option>
              <option value="bottom-left">左下角</option>
              <option value="bottom-right">右下角</option>
            </select>
          </div>
        </div>
        <div class="preview-box" :style="{ borderRadius: borderRadiusPreview }"></div>
      </div>

      <div class="controls-section" v-if="selectedEffect === 'gradient'">
        <h3>渐变参数</h3>
        <div class="control-grid">
          <div class="control-item">
            <label>起始颜色</label>
            <input v-model="gradient.startColor" type="color" @input="generateCode" />
          </div>
          <div class="control-item">
            <label>结束颜色</label>
            <input v-model="gradient.endColor" type="color" @input="generateCode" />
          </div>
          <div class="control-item">
            <label>渐变方向</label>
            <select v-model="gradient.direction" @change="generateCode">
              <option value="to right">从左到右</option>
              <option value="to left">从右到左</option>
              <option value="to bottom">从上到下</option>
              <option value="to top">从下到上</option>
              <option value="to bottom right">左上到右下</option>
              <option value="to bottom left">右上到左下</option>
            </select>
          </div>
        </div>
        <div class="preview-box gradient-preview" :style="{ background: generatedCode }"></div>
      </div>

      <div class="controls-section" v-if="selectedEffect === 'text-shadow'">
        <h3>文字阴影参数</h3>
        <div class="control-grid">
          <div class="control-item">
            <label>X 偏移</label>
            <input v-model.number="textShadow.x" type="range" min="-10" max="10" @input="generateCode" />
            <span>{{ textShadow.x }}px</span>
          </div>
          <div class="control-item">
            <label>Y 偏移</label>
            <input v-model.number="textShadow.y" type="range" min="-10" max="10" @input="generateCode" />
            <span>{{ textShadow.y }}px</span>
          </div>
          <div class="control-item">
            <label>模糊半径</label>
            <input v-model.number="textShadow.blur" type="range" min="0" max="20" @input="generateCode" />
            <span>{{ textShadow.blur }}px</span>
          </div>
          <div class="control-item">
            <label>阴影颜色</label>
            <input v-model="textShadow.color" type="color" @input="generateCode" />
          </div>
        </div>
        <div class="preview-text" :style="{ textShadow: generatedCode }">示例文字</div>
      </div>

      <div class="controls-section" v-if="selectedEffect === 'animation'">
        <h3>动画参数</h3>
        <div class="control-grid">
          <div class="control-item">
            <label>动画类型</label>
            <select v-model="animation.type" @change="generateCode">
              <option value="fadeIn">淡入</option>
              <option value="slideIn">滑入</option>
              <option value="bounce">弹跳</option>
              <option value="pulse">脉冲</option>
              <option value="rotate">旋转</option>
            </select>
          </div>
          <div class="control-item">
            <label>动画时长</label>
            <input v-model.number="animation.duration" type="range" min="0.1" max="3" step="0.1" @input="generateCode" />
            <span>{{ animation.duration }}s</span>
          </div>
          <div class="control-item">
            <label>循环次数</label>
            <select v-model="animation.iteration" @change="generateCode">
              <option value="1">1次</option>
              <option value="2">2次</option>
              <option value="3">3次</option>
              <option value="infinite">无限</option>
            </select>
          </div>
        </div>
        <div class="preview-animation">
          <div class="animation-box" :style="{ animation: animationPreview }"></div>
        </div>
      </div>

      <div class="code-section">
        <h3>生成的代码</h3>
        <div class="code-tabs">
          <button :class="{ active: codeTab === 'css' }" @click="codeTab = 'css'">CSS</button>
          <button :class="{ active: codeTab === 'scss' }" @click="codeTab = 'scss'">SCSS</button>
        </div>
        <textarea :value="generatedCode" class="code-input" readonly rows="6"></textarea>
        <button @click="copyCode" class="btn-copy">复制代码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedEffect = ref('box-shadow')
const codeTab = ref('css')

const effects = [
  { id: 'box-shadow', name: '盒子阴影', icon: '⬜' },
  { id: 'border-radius', name: '圆角', icon: '🔲' },
  { id: 'gradient', name: '渐变', icon: '🌈' },
  { id: 'text-shadow', name: '文字阴影', icon: '🔤' },
  { id: 'animation', name: '动画', icon: '▶️' }
]

const shadow = ref({ x: 5, y: 5, blur: 10, spread: 0, color: '#000000' })
const borderRadius = ref({ radius: 20, position: 'all' })
const gradient = ref({ startColor: '#667eea', endColor: '#764ba2', direction: 'to right' })
const textShadow = ref({ x: 2, y: 2, blur: 4, color: '#000000' })
const animation = ref({ type: 'fadeIn', duration: 1, iteration: 'infinite' })

const generatedCode = ref('')

function generateCode() {
  switch (selectedEffect.value) {
    case 'box-shadow':
      generatedCode.value = `${shadow.value.x}px ${shadow.value.y}px ${shadow.value.blur}px ${shadow.value.spread}px ${shadow.value.color}`
      break
    case 'border-radius':
      const r = borderRadius.value.radius
      if (borderRadius.value.position === 'all') {
        generatedCode.value = `${r}px`
      } else {
        const positions = {
          'top-left': `${r}px 0 0 0`,
          'top-right': `0 ${r}px 0 0`,
          'bottom-left': `0 0 0 ${r}px`,
          'bottom-right': `0 0 ${r}px 0`
        }
        generatedCode.value = positions[borderRadius.value.position]
      }
      break
    case 'gradient':
      generatedCode.value = `linear-gradient(${gradient.value.direction}, ${gradient.value.startColor}, ${gradient.value.endColor})`
      break
    case 'text-shadow':
      generatedCode.value = `${textShadow.value.x}px ${textShadow.value.y}px ${textShadow.value.blur}px ${textShadow.value.color}`
      break
    case 'animation':
      generatedCode.value = `${animation.value.type} ${animation.value.duration}s ease-in-out ${animation.value.iteration}`
      break
  }
}

const borderRadiusPreview = computed(() => {
  const r = borderRadius.value.radius
  const pos = borderRadius.value.position
  if (pos === 'all') return `${r}px`
  const positions = {
    'top-left': `${r}px 0 0 0`,
    'top-right': `0 ${r}px 0 0`,
    'bottom-left': `0 0 0 ${r}px`,
    'bottom-right': `0 0 ${r}px 0`
  }
  return positions[pos]
})

const animationPreview = computed(() => {
  return `${animation.value.type} ${animation.value.duration}s ease-in-out ${animation.value.iteration}`
})

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value)
}

generateCode()
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

.css-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.effects-section,
.controls-section,
.code-section {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.effect-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.effect-button:hover {
  border-color: #2563eb;
}

.effect-button.active {
  border-color: #2563eb;
  background: #e3f2fd;
}

.effect-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.effect-name {
  font-size: 0.85rem;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.control-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.control-item input[type="range"] {
  width: 100%;
  margin-bottom: 0.25rem;
}

.control-item span {
  font-size: 0.9rem;
  font-weight: 500;
}

.control-item input[type="color"] {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-item select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-box {
  width: 150px;
  height: 150px;
  background: #fff;
  margin: 0 auto 2rem;
  border: 1px solid #eee;
}

.preview-text {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.preview-animation {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
}

.animation-box {
  width: 80px;
  height: 80px;
  background: #2563eb;
  border-radius: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100px); }
  to { transform: translateX(0); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.code-tabs button.active {
  background: #2563eb;
  color: white;
}

.code-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  background: #fafafa;
  box-sizing: border-box;
}

.btn-copy {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: #10b981;
  color: white;
  cursor: pointer;
  font-size: 1rem;
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

.dark .css-card {
  background: #262626;
}

.dark .effect-button {
  background: #1a1a1a;
}

.dark .effect-button.active {
  background: #1e3a8a;
}

.dark .control-item {
  background: #1a1a1a;
}

.dark .control-item select {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .preview-box,
.dark .preview-text,
.dark .preview-animation {
  background: #1a1a1a;
}

.dark .code-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

@media (max-width: 768px) {
  .effects-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .control-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
