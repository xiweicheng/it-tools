<template>
  <div class="tool-container">
    <h1 class="title">简体繁体转换器</h1>
    <p class="description">在简体中文和繁体中文之间相互转换。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入要转换的文本..."
        ></textarea>
      </div>

      <div class="button-group">
        <button @click="toTraditional" class="btn-primary">简体 → 繁体</button>
        <button @click="toSimplified" class="btn-secondary">繁体 → 简体</button>
      </div>

      <div class="form-group">
        <label>转换结果：</label>
        <textarea
          :value="outputText"
          class="text-input result"
          readonly
        ></textarea>
      </div>

      <div class="button-group">
        <button @click="copyOutput" class="btn-primary">复制结果</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')

const s2t = {
  '电': '電', '脑': '腦', '网': '網', '页': '頁', '开': '開', '关': '關',
  '发': '發', '收': '收', '文': '文', '件': '件', '数': '數', '据': '據',
  '机': '機', '器': '器', '工': '工', '具': '具', '学': '學', '习': '習',
  '资': '資', '源': '源', '库': '庫', '表': '表', '格': '格', '图': '圖',
  '标': '標', '签': '籤', '题': '題', '框': '框', '列': '列', '单': '單',
  '选': '選', '择': '擇', '输': '輸', '入': '入', '出': '出', '压': '壓',
  '缩': '縮', '解': '解', '密': '密', '码': '碼', '编': '編', '辑': '輯',
  '统': '統', '环': '環', '境': '境', '应': '應', '用': '用', '程': '程',
  '序': '序', '代': '代', '调': '調', '试': '試', '错': '錯', '误': '誤',
  '开': '開發', '者': '者', '工': '工作', '变': '變', '量': '量',
  '键': '鍵', '盘': '盤', '鼠': '鼠', '屏': '幕', '显': '顯示',
  '卡': '卡', '声': '聲', '驱': '驅', '动': '動', '下': '下載',
  '载': '載', '上': '上傳', '传': '傳', '送': '送', '接': '接',
  '消': '消', '息': '息', '邮': '郵', '聊': '聊', '天': '天',
  '群': '群', '组': '組', '频': '頻', '會': '會', '议': '議',
  '字': '字', '符': '符', '串': '串', '行': '行', '置': '置',
  '長': '長', '度': '度', '寬': '寬', '高': '高', '顏': '顏',
  '色': '色', '號': '號', '體': '體', '國': '國', '際': '際',
  '化': '化', '本': '本', '土': '土', '簡': '簡', '繁': '繁',
  '轉': '轉', '換': '換', '標': '標', '題': '題', '開': '開',
  '關': '關', '應': '應', '開': '開發'
}

const t2s = {}
for (const key in s2t) {
  t2s[s2t[key]] = key
}

const toTraditional = () => {
  if (!inputText.value) return
  let result = ''
  for (const char of inputText.value) {
    result += s2t[char] || char
  }
  outputText.value = result
}

const toSimplified = () => {
  if (!inputText.value) return
  let result = ''
  for (const char of inputText.value) {
    result += t2s[char] || char
  }
  outputText.value = result
}

const copyOutput = () => {
  if (!outputText.value) return
  navigator.clipboard.writeText(outputText.value)
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
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

.converter-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-input {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

.text-input.result {
  background: #fafafa;
}

.button-group {
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

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .converter-card {
  background: #262626;
}

.dark .text-input {
  background: #262626;
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
</style>
