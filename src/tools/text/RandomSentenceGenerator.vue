<template>
  <div class="random-sentence-generator">
    <h2>随机句子生成器</h2>

    <div class="generator-container">
      <div class="controls-section">
        <div class="control-group">
          <label>句子数量</label>
          <input type="number" v-model.number="sentenceCount" min="1" max="20" />
        </div>

        <div class="control-group">
          <label>语言</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="language" value="zh" />
              <span>中文</span>
            </label>
            <label>
              <input type="radio" v-model="language" value="en" />
              <span>英文</span>
            </label>
            <label>
              <input type="radio" v-model="language" value="mixed" />
              <span>混合</span>
            </label>
          </div>
        </div>

        <div class="control-group">
          <label>句子长度</label>
          <div class="range-inputs">
            <input type="number" v-model.number="minLength" min="5" max="50" placeholder="最短" />
            <span>至</span>
            <input type="number" v-model.number="maxLength" min="10" max="100" placeholder="最长" />
          </div>
        </div>

        <div class="control-group">
          <label>句子类型</label>
          <div class="checkbox-group">
            <label><input type="checkbox" v-model="sentenceTypes.declarative" /> 陈述句</label>
            <label><input type="checkbox" v-model="sentenceTypes.interrogative" /> 疑问句</label>
            <label><input type="checkbox" v-model="sentenceTypes.exclamatory" /> 感叹句</label>
          </div>
        </div>

        <button @click="generateSentences" class="generate-btn">生成句子</button>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h3>生成结果</h3>
          <span class="count-badge">{{ sentences.length }} 句</span>
        </div>
        <div class="sentences-list" v-if="sentences.length > 0">
          <div v-for="(sentence, index) in sentences" :key="index" class="sentence-item">
            <span class="sentence-number">{{ index + 1 }}.</span>
            <span class="sentence-text">{{ sentence }}</span>
          </div>
        </div>
        <div class="empty-state" v-else>
          点击"生成句子"按钮开始
        </div>
        <div class="output-actions" v-if="sentences.length > 0">
          <button @click="copyAll" class="action-btn">{{ copied ? '已复制!' : '复制全部' }}</button>
          <button @click="copyAsList" class="action-btn">复制为列表</button>
          <button @click="downloadTxt" class="action-btn">下载 TXT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sentenceCount = ref(5)
const language = ref('zh')
const minLength = ref(10)
const maxLength = ref(30)
const sentences = ref([])
const copied = ref(false)

const sentenceTypes = ref({
  declarative: true,
  interrogative: true,
  exclamatory: true
})

const zhSubjects = ['我', '你', '他', '她', '它', '我们', '他们', '她们', '大家', '这个人', '那个人', '某个人', '小王', '小明', '老板', '老师', '学生', '朋友', '家人', '公司']
const zhVerbs = ['是', '有', '做', '说', '想', '看', '听', '来', '去', '知道', '觉得', '喜欢', '需要', '想要', '希望', '相信', '告诉', '问', '给', '让']
const zhObjects = ['一个苹果', '一本书', '一个问题', '一件衣服', '一台电脑', '一部手机', '一封信', '一顿饭', '一个机会', '一些时间', '一个办法', '一种感觉', '一点钱', '一份工作', '一种生活', '一个梦想', '一点帮助', '一些朋友', '一个好主意', '一个项目']
const zhAdjectives = ['好的', '大的', '小的', '新的', '旧的', '热的', '冷的', '快的', '慢的', '容易的', '困难的', '重要的', '有趣的', '无聊的', '美丽的', '丑的', '年轻的', '老的', '高的', '矮的']
const zhAdverbs = ['很', '非常', '特别', '相当', '十分', '极其', '略微', '稍微', '不太', '不']
const zhPlaces = ['家里', '学校', '公司', '办公室', '商店', '餐厅', '医院', '图书馆', '公园', '超市', '电影院', '机场', '车站', '酒店', '咖啡馆']

const enSubjects = ['I', 'You', 'He', 'She', 'It', 'We', 'They', 'The boy', 'The girl', 'The man', 'The woman', 'My friend', 'Our team', 'The company', 'This person', 'Everyone', 'Someone', 'Nobody']
const enVerbs = ['is', 'are', 'was', 'were', 'have', 'has', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'need', 'want', 'like', 'know']
const enObjects = ['a book', 'an idea', 'a problem', 'a question', 'a solution', 'a plan', 'a project', 'a task', 'some time', 'some money', 'a chance', 'an opportunity', 'a friend', 'a job', 'a meeting', 'dinner', 'lunch', 'breakfast', 'coffee']
const enAdjectives = ['good', 'bad', 'big', 'small', 'new', 'old', 'young', 'beautiful', 'ugly', 'easy', 'difficult', 'important', 'interesting', 'boring', 'happy', 'sad', 'angry', 'calm', 'busy', 'free']
const enAdverbs = ['very', 'really', 'extremely', 'quite', 'fairly', 'pretty', 'somewhat', 'not very', 'too', 'also']

const zhQuestionWords = ['什么', '为什么', '怎么', '如何', '哪里', '谁', '多少', '几']
const enQuestionWords = ['what', 'why', 'how', 'where', 'who', 'which', 'when', 'how many', 'how much']

const zhExclamations = ['真棒!', '太好了!', '太棒了!', '太神奇了!', '哇!', '哇哦!', '太酷了!', '难以置信!', '完美!', '太厉害了!']
const enExclamations = ['Great!', 'Amazing!', 'Wonderful!', 'Fantastic!', 'Wow!', 'Awesome!', 'Incredible!', 'Perfect!', 'Excellent!', 'Brilliant!']

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const generateZhSentence = (type) => {
  const templates = [
    () => `${pick(zhSubjects)}${pick(zhAdverbs)}${pick(zhVerbs)}${pick(zhObjects)}`,
    () => `${pick(zhSubjects)}${pick(zhVerbs)}${pick(zhAdjectives)}${pick(zhObjects)}`,
    () => `${pick(zhPlaces)}${pick(zhSubjects)}${pick(zhVerbs)}${pick(zhObjects)}`,
    () => `${pick(zhSubjects)}把${pick(zhObjects)}给${pick(zhSubjects)}${pick(zhVerbs)}`,
    () => `今天${pick(zhSubjects)}${pick(zhVerbs)}${pick(zhObjects)}`,
    () => `${pick(zhSubjects)}觉得${pick(zhObjects)}${pick(zhAdverbs)}${pick(zhAdjectives)}`
  ]

  let sentence = pick(templates)()

  if (type === 'interrogative') {
    const patterns = [
      () => `${pick(zhQuestionWords)}${pick(zhSubjects)}${pick(zhVerbs)}${pick(zhObjects)}?`,
      () => `${pick(zhSubjects)}${pick(zhVerbs)}${pick(zhQuestionWords)}${pick(zhObjects)}?`,
      () => `难道${sentence}吗?`,
      () => `不是${sentence}吗?`
    ]
    sentence = pick(patterns)()
  } else if (type === 'exclamatory') {
    sentence = sentence.replace(/[。.!]$/, '') + pick(zhExclamations)
  } else {
    sentence += '。'
  }

  return sentence
}

const generateEnSentence = (type) => {
  const templates = [
    () => `${pick(enSubjects)} ${pick(enVerbs)} ${pick(enAdjectives)} ${pick(enObjects)}.`,
    () => `${pick(enSubjects)} ${pick(enVerbs)} ${pick(enObjects)}.`,
    () => `The ${pick(['man', 'woman', 'boy', 'girl', 'student', 'teacher', 'boss', 'friend'])} ${pick(['is', 'was', 'will be'])} ${pick(enAdjectives)}.`,
    () => `${pick(enSubjects)} ${pick(enAdverbs)} ${pick(enVerbs)} ${pick(enObjects)}.`,
    () => `I think ${pick(enSubjects.toLowerCase())} ${pick(enVerbs)} ${pick(enAdjectives)} ${pick(enObjects)}.`
  ]

  let sentence = pick(templates)()

  if (type === 'interrogative') {
    const patterns = [
      () => `${pick(enQuestionWords)} ${sentence.replace('.', '?').replace('!', '?')}`,
      () => `Does ${sentence.replace('.', '?')}`,
      () => `Is ${sentence.replace('.', '?')}`,
      () => `Can ${sentence.replace('.', '?')}`
    ]
    sentence = pick(patterns)()
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1)
  } else if (type === 'exclamatory') {
    sentence = sentence.replace(/[.!]$/, '') + ' ' + pick(enExclamations)
  }

  return sentence
}

const generateSentence = () => {
  const types = Object.entries(sentenceTypes.value)
    .filter(([_, v]) => v)
    .map(([k]) => k)

  if (types.length === 0) {
    types.push('declarative')
  }

  const type = pick(types)

  if (language.value === 'zh') {
    return generateZhSentence(type)
  } else if (language.value === 'en') {
    return generateEnSentence(type)
  } else {
    return Math.random() > 0.5 ? generateZhSentence(type) : generateEnSentence(type)
  }
}

const generateSentences = () => {
  sentences.value = []
  for (let i = 0; i < sentenceCount.value; i++) {
    let sentence = generateSentence()
    sentences.value.push(sentence)
  }
}

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(sentences.value.join('\n'))
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const copyAsList = async () => {
  try {
    const list = sentences.value.map((s, i) => `${i + 1}. ${s}`).join('\n')
    await navigator.clipboard.writeText(list)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const downloadTxt = () => {
  const content = sentences.value.join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'random-sentences.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.random-sentence-generator {
  padding: 20px;
}
.generator-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}
.controls-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.control-group {
  margin-bottom: 20px;
}
.control-group > label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
.control-group input[type="number"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.radio-group label,
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}
.range-inputs input {
  width: 80px;
}
.range-inputs span {
  color: var(--text-secondary);
}
.generate-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.generate-btn:hover {
  opacity: 0.9;
}
.output-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.output-header h3 {
  margin: 0;
}
.count-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
.sentences-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}
.sentence-item {
  display: flex;
  gap: 10px;
  padding: 12px 15px;
  background: var(--bg-secondary);
  border-radius: 4px;
}
.sentence-number {
  color: var(--text-secondary);
  flex-shrink: 0;
}
.sentence-text {
  line-height: 1.6;
}
.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}
.output-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.action-btn {
  flex: 1;
  padding: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}
.action-btn:hover {
  background: var(--border-color);
}
@media (max-width: 768px) {
  .generator-container {
    grid-template-columns: 1fr;
  }
}
</style>
