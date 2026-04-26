<template>
  <div class="tool-container">
    <h1 class="title">字符编码转换器</h1>
    <p class="description">支持多种字符编码之间的转换，如 UTF-8、GBK、ISO-8859-1 等。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入需要转换的文本..."
          rows="6"
        ></textarea>
      </div>

      <div class="encoding-selects">
        <div class="select-group">
          <label>源编码：</label>
          <select v-model="sourceEncoding" class="select-input">
            <option value="utf-8">UTF-8</option>
            <option value="gbk">GBK</option>
            <option value="gb2312">GB2312</option>
            <option value="gb18030">GB18030</option>
            <option value="iso-8859-1">ISO-8859-1 (Latin-1)</option>
            <option value="windows-1252">Windows-1252</option>
            <option value="big5">Big5</option>
            <option value="shift-jis">Shift-JIS</option>
            <option value="euc-kr">EUC-KR</option>
          </select>
        </div>

        <div class="arrow-icon">→</div>

        <div class="select-group">
          <label>目标编码：</label>
          <select v-model="targetEncoding" class="select-input">
            <option value="utf-8">UTF-8</option>
            <option value="gbk">GBK</option>
            <option value="gb2312">GB2312</option>
            <option value="gb18030">GB18030</option>
            <option value="iso-8859-1">ISO-8859-1 (Latin-1)</option>
            <option value="windows-1252">Windows-1252</option>
            <option value="big5">Big5</option>
            <option value="shift-jis">Shift-JIS</option>
            <option value="euc-kr">EUC-KR</option>
          </select>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="convertEncoding" class="btn-primary">转换</button>
        <button @click="swapEncodings" class="btn-secondary">交换</button>
        <button @click="copyResult" class="btn-secondary">复制</button>
        <button @click="clearAll" class="btn-secondary">清空</button>
      </div>

      <div class="result-section">
        <label>转换结果：</label>
        <div class="result-box">
          <textarea
            :value="outputText"
            class="text-input"
            readonly
            rows="6"
          ></textarea>
        </div>
      </div>

      <div class="info-box">
        <h4>编码说明</h4>
        <ul>
          <li><strong>UTF-8</strong>: 全球最通用的编码，支持所有 Unicode 字符</li>
          <li><strong>GBK/GB2312/GB18030</strong>: 中文编码，GB18030 支持更多汉字</li>
          <li><strong>ISO-8859-1</strong>: 西欧语言编码，不支持中文</li>
          <li><strong>Big5</strong>: 繁体中文编码</li>
          <li><strong>Shift-JIS</strong>: 日文编码</li>
          <li><strong>EUC-KR</strong>: 韩文编码</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const sourceEncoding = ref('utf-8')
const targetEncoding = ref('gbk')

function convertEncoding() {
  if (!inputText.value) {
    outputText.value = ''
    return
  }

  try {
    const encoder = new TextEncoder(sourceEncoding.value)
    const decoder = new TextDecoder(targetEncoding.value)

    const bytes = encoder.encode(inputText.value)
    const uint8Array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
    outputText.value = decoder.decode(uint8Array)
  } catch (error) {
    outputText.value = '转换错误: ' + error.message
  }
}

function swapEncodings() {
  const temp = sourceEncoding.value
  sourceEncoding.value = targetEncoding.value
  targetEncoding.value = temp

  if (outputText.value) {
    inputText.value = outputText.value
    convertEncoding()
  }
}

function copyResult() {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value)
  }
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
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

.converter-card {
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

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: monospace;
  box-sizing: border-box;
  resize: vertical;
}

.encoding-selects {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.select-group {
  flex: 1;
}

.select-group label {
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
  background: #fff;
  cursor: pointer;
}

.arrow-icon {
  font-size: 1.5rem;
  color: #666;
  padding-top: 1.5rem;
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

.result-section {
  margin-bottom: 1.5rem;
}

.result-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.result-box {
  border: 2px solid #10b981;
  border-radius: 8px;
  overflow: hidden;
}

.result-box .text-input {
  border: none;
  background: #fff;
}

.info-box {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 1rem;
}

.info-box h4 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.info-box ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-box li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #666;
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
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .select-input {
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

.dark .result-box {
  border-color: #10b981;
}

.dark .result-box .text-input {
  background: #1a1a1a;
}

.dark .info-box {
  background: #1e3a5f;
}

.dark .info-box li {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .encoding-selects {
    flex-direction: column;
  }

  .arrow-icon {
    transform: rotate(90deg);
    padding: 0;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    min-width: calc(50% - 0.5rem);
  }
}
</style>
