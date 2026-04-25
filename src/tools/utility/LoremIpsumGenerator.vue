<template>
  <div class="tool-container">
    <h1 class="title">Lorem Ipsum 生成器</h1>
    <p class="description">生成 Lorem Ipsum 占位文本，常用于排版和设计中的示例内容。</p>

    <div class="lorem-card">
      <div class="controls-section">
        <div class="control-group">
          <label>段落数量：</label>
          <input
            v-model.number="paragraphs"
            type="number"
            min="1"
            max="20"
            class="number-input"
            @change="generateText"
          />
        </div>

        <div class="control-group">
          <label>每段句子数：</label>
          <input
            v-model.number="sentencesPerParagraph"
            type="number"
            min="1"
            max="15"
            class="number-input"
            @change="generateText"
          />
        </div>

        <div class="control-group">
          <label>包含 HTML 标签：</label>
          <label class="toggle">
            <input type="checkbox" v-model="includeHtml" @change="generateText" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="generateText" class="btn-primary">生成文本</button>
        <button @click="copyText" class="btn-secondary">复制文本</button>
        <button @click="clearText" class="btn-secondary">清空</button>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h3>生成的文本</h3>
          <div class="word-count">字数：{{ wordCount }}</div>
        </div>
        <div class="output-content" v-html="formattedText"></div>
      </div>
    </div>

    <div class="info-section">
      <h3>关于 Lorem Ipsum</h3>
      <p>
        Lorem Ipsum 是从公元前 45 年罗马哲学家西塞罗的作品中提取的占位文本。
        它自 1500 年代以来一直被使用，是印刷行业的标准占位文本。
      </p>
      <p>
        Lorem Ipsum 的优势在于它具有相对正常的字母分布，与英语字母分布相近，
        因此看起来像是可读的文本。这使其成为网页设计和排版的理想选择。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const paragraphs = ref(3)
const sentencesPerParagraph = ref(4)
const includeHtml = ref(true)
const generatedText = ref('')

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'pellentesque', 'habitant',
  'morbi', 'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'ac', 'turpis',
  'egestas', 'proin', 'sagittis', 'nisl', 'rhoncus', 'mattis', 'massa', 'vitae',
  'tortor', 'condimentum', 'lacinia', 'quis', 'vel', 'eros', 'donec', 'odio',
  'quisque', 'volutpat', 'ligula', 'nec', 'diam', 'vulputate', 'ut', 'pharetra',
  'sit', 'amet', 'nisl', 'nunc', 'mi', 'ipsum', 'faucibus', 'vitae', 'aliquet',
  'nec', 'ullamcorper', 'sit', 'amet', 'risus', 'nulla', 'ac', 'est', 'lacinia',
  'nisl', 'vel', 'auctor', 'proin', 'sodales', 'pulvinar', 'tempor', 'civibus',
  'porta', 'lorem', 'eget', 'nulla', 'facilisi', 'etiam', 'dignissim', 'diam',
  'quis', 'turpis', 'adipiscing', 'pretium', 'varius', 'metus', 'dictum',
  'tincidunt', 'interdum', 'magna', 'quisque', 'arcu', 'libero', 'rutrum',
  'aliquet', 'massa', 'id', 'potenti', 'habitant', 'morbi', 'tristique'
]

const traditionalChinese = [
  'Lorem Ipsum', '只是', '一个', '虚拟', '文本', '用于', '排版', '设计',
  '它', '帮助', '设计师', '和', '开发者', '更好', '地', '展示', '布局',
  '效果', '无论', '是', '网站', '还是', '应用', '界面', '都可以', '使用',
  '它来', '填充', '空白', '区域', '让', '整体', '效果', '更加', '直观',
  '这是', '一个', '非常', '实用', '的', '工具', '可以', '大大', '提高',
  '工作效率', '特别', '是在', '项目', '初期', '需要', '快速', '搭建',
  '原型', '的', '时候', '它', '的作用', '尤为', '突出', '不需要', '花费',
  '太多', '时间', '去', '编写', '真实', '的', '内容', '只需要', '一键',
  '生成', '即可', '拥有', '大量', '的', '示例', '文本', '使用', '简单',
  '方便', '快捷', '高效', '是', '它', '最大', '的', '特点', '相信', '大家',
  '会', '喜欢', '这个', '工具', '无论', '是', '前端', '开发', '还是', '后端',
  '设计', '或者', '是', '产品', '经理', '撰写', '文档', '都', '可以', '用到'
]

const sentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
  'Nulla facilisi morbi tempus iaculis urna id volutpat lacus.',
  'Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque.',
  'Bibendum neque egestas congue quisque egestas diam in arcu.',
  'Amet nisl suscipit adipiscing bibendum est ultricies integer quis.',
  'Cursus turpis massa tincidunt dui ut ornare lectus sit amet.',
  'Eget nulla facilisi etiam dignissim diam quis enim lobortis.',
  'Feugiat pretium nibh ipsum consequat nisl vel pretium lectus.',
  'Quam id leo in vitae turpis massa sed elementum tempus.',
  'Bibendum est ultricies integer quis auctor elit sed vulputate.',
  'Facilisis volutpat est velit egestas dui id ornare arcu odio.'
]

function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)]
}

function generateParagraph() {
  const paragraphSentences = []
  for (let i = 0; i < sentencesPerParagraph.value; i++) {
    paragraphSentences.push(getRandomSentence())
  }
  return paragraphSentences.join(' ')
}

const formattedText = computed(() => {
  if (!generatedText.value) return ''

  if (includeHtml.value) {
    return generatedText.value
      .split('\n\n')
      .map(p => `<p>${p}</p>`)
      .join('')
  }
  return generatedText.value.replace(/\n\n/g, '<br><br>')
})

const wordCount = computed(() => {
  if (!generatedText.value) return 0
  return generatedText.value.replace(/\n/g, ' ').split(/\s+/).filter(w => w).length
})

function generateText() {
  const textArray = []
  for (let i = 0; i < paragraphs.value; i++) {
    textArray.push(generateParagraph())
  }
  generatedText.value = textArray.join('\n\n')
}

function copyText() {
  navigator.clipboard.writeText(generatedText.value)
}

function clearText() {
  generatedText.value = ''
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

.lorem-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.controls-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.control-group label {
  font-weight: 500;
  white-space: nowrap;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #2563eb;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.output-section {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.output-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.word-count {
  font-size: 0.9rem;
  color: #666;
}

.output-content {
  line-height: 1.8;
  color: #333;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 6px;
}

.output-content p {
  margin: 0 0 1rem 0;
}

.output-content p:last-child {
  margin-bottom: 0;
}

.info-section {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-section p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.info-section p:last-child {
  margin-bottom: 0;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .lorem-card,
.dark .info-section {
  background: #262626;
}

.dark .number-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

.dark .output-section {
  background: #1a1a1a;
}

.dark .output-content {
  background: #262626;
  color: #e5e5e5;
}

.dark .word-count {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .controls-section {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
