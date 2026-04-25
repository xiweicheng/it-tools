<template>
  <div class="tool-container">
    <h1 class="title">Chmod 计算器</h1>
    <p class="description">在线计算 Unix/Linux 文件权限，轻松设置 chmod 权限命令。</p>

    <div class="chmod-card">
      <div class="permission-section">
        <h3>选择权限</h3>
        <div class="permission-grid">
          <div class="perm-category">
            <h4>所有者 (Owner)</h4>
            <div class="perm-options">
              <label class="perm-checkbox">
                <input type="checkbox" v-model="owner.read" @change="calculate" />
                <span>读取 (r)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="owner.write" @change="calculate" />
                <span>写入 (w)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="owner.execute" @change="calculate" />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>

          <div class="perm-category">
            <h4>群组 (Group)</h4>
            <div class="perm-options">
              <label class="perm-checkbox">
                <input type="checkbox" v-model="group.read" @change="calculate" />
                <span>读取 (r)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="group.write" @change="calculate" />
                <span>写入 (w)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="group.execute" @change="calculate" />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>

          <div class="perm-category">
            <h4>其他用户 (Others)</h4>
            <div class="perm-options">
              <label class="perm-checkbox">
                <input type="checkbox" v-model="others.read" @change="calculate" />
                <span>读取 (r)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="others.write" @change="calculate" />
                <span>写入 (w)</span>
              </label>
              <label class="perm-checkbox">
                <input type="checkbox" v-model="others.execute" @change="calculate" />
                <span>执行 (x)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3>计算结果</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="result-label">符号表示</div>
            <div class="result-value symbolic">{{ symbolic }}</div>
          </div>
          <div class="result-item">
            <div class="result-label">数字表示</div>
            <div class="result-value numeric">{{ numeric }}</div>
          </div>
        </div>

        <div class="command-section">
          <div class="command-label">Chmod 命令：</div>
          <div class="command-box">
            <code>{{ chmodCommand }}</code>
            <button @click="copyCommand" class="btn-copy">复制</button>
          </div>
        </div>
      </div>

      <div class="quick-permissions">
        <h3>常用权限</h3>
        <div class="quick-grid">
          <button
            v-for="preset in presets"
            :key="preset.numeric"
            class="preset-btn"
            @click="applyPreset(preset)"
          >
            <span class="preset-num">{{ preset.numeric }}</span>
            <span class="preset-name">{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <div class="permission-bits">
        <h3>权限位说明</h3>
        <table class="bits-table">
          <thead>
            <tr>
              <th>数字</th>
              <th>权限</th>
              <th>符号</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4</td>
              <td>读取</td>
              <td>r</td>
              <td>可以查看文件内容</td>
            </tr>
            <tr>
              <td>2</td>
              <td>写入</td>
              <td>w</td>
              <td>可以修改文件内容</td>
            </tr>
            <tr>
              <td>1</td>
              <td>执行</td>
              <td>x</td>
              <td>可以执行文件或进入目录</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const owner = ref({
  read: true,
  write: true,
  execute: false
})

const group = ref({
  read: true,
  write: false,
  execute: false
})

const others = ref({
  read: true,
  write: false,
  execute: false
})

const presets = [
  { numeric: '755', name: '常用', symbolic: 'rwxr-xr-x' },
  { numeric: '644', name: '文件', symbolic: 'rw-r--r--' },
  { numeric: '700', name: '私有', symbolic: 'rwx------' },
  { numeric: '777', name: '完全', symbolic: 'rwxrwxrwx' },
  { numeric: '644', name: '只读', symbolic: 'rw-r--r--' },
  { numeric: '600', name: '私密', symbolic: 'rw-------' },
  { numeric: '666', name: '共享', symbolic: 'rw-rw-rw-' },
  { numeric: '555', name: '只执行', symbolic: 'r-xr-xr-x' }
]

const symbolic = computed(() => {
  const o = (owner.value.read ? 'r' : '-') + (owner.value.write ? 'w' : '-') + (owner.value.execute ? 'x' : '-')
  const g = (group.value.read ? 'r' : '-') + (group.value.write ? 'w' : '-') + (group.value.execute ? 'x' : '-')
  const t = (others.value.read ? 'r' : '-') + (others.value.write ? 'w' : '-') + (others.value.execute ? 'x' : '-')
  return o + g + t
})

const numeric = computed(() => {
  const o = (owner.value.read ? 4 : 0) + (owner.value.write ? 2 : 0) + (owner.value.execute ? 1 : 0)
  const g = (group.value.read ? 4 : 0) + (group.value.write ? 2 : 0) + (group.value.execute ? 1 : 0)
  const t = (others.value.read ? 4 : 0) + (others.value.write ? 2 : 0) + (others.value.execute ? 1 : 0)
  return `${o}${g}${t}`
})

const chmodCommand = computed(() => {
  return `chmod ${numeric.value} filename`
})

function calculate() {
  // 计算权限
}

function applyPreset(preset) {
  const [o, g, t] = preset.numeric.split('').map(Number)

  owner.value.read = (o & 4) !== 0
  owner.value.write = (o & 2) !== 0
  owner.value.execute = (o & 1) !== 0

  group.value.read = (g & 4) !== 0
  group.value.write = (g & 2) !== 0
  group.value.execute = (g & 1) !== 0

  others.value.read = (t & 4) !== 0
  others.value.write = (t & 2) !== 0
  others.value.execute = (t & 1) !== 0
}

function copyCommand() {
  navigator.clipboard.writeText(`chmod ${numeric.value} filename`)
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

.chmod-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.permission-section,
.result-section,
.quick-permissions,
.permission-bits {
  margin-bottom: 2rem;
}

h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.perm-category h4 {
  margin-bottom: 0.75rem;
  color: #333;
  font-size: 1rem;
}

.perm-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.perm-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  background: #fff;
  border-radius: 6px;
  transition: all 0.2s;
}

.perm-checkbox:hover {
  background: #e3f2fd;
}

.perm-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.perm-checkbox span {
  font-family: monospace;
  font-size: 0.95rem;
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.result-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: monospace;
}

.result-value.symbolic {
  color: #2563eb;
  letter-spacing: 2px;
}

.result-value.numeric {
  color: #059669;
}

.command-section {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

.command-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.command-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a1a;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.command-box code {
  color: #10b981;
  font-family: monospace;
  font-size: 1rem;
}

.btn-copy {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #2563eb;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #e3f2fd;
  border-color: #2563eb;
}

.preset-num {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.preset-name {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.bits-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.bits-table th,
.bits-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.bits-table th {
  background: #f0f0f0;
  font-weight: 500;
}

.bits-table td:first-child {
  font-family: monospace;
  font-weight: 600;
  color: #2563eb;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .chmod-card {
  background: #262626;
}

.dark .perm-checkbox {
  background: #1a1a1a;
  color: #e5e5e5;
}

.dark .perm-checkbox:hover {
  background: #1e3a8a;
}

.dark .result-item,
.dark .command-section,
.dark .preset-btn {
  background: #1a1a1a;
}

.dark .bits-table {
  background: #1a1a1a;
}

.dark .bits-table th {
  background: #333;
}

.dark .bits-table td {
  border-bottom-color: #333;
}

@media (max-width: 768px) {
  .permission-grid {
    grid-template-columns: 1fr;
  }

  .result-grid,
  .quick-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
