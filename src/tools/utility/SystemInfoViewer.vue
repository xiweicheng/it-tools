<template>
  <div class="tool-container">
    <h1 class="title">系统信息查看器</h1>
    <p class="description">展示设备的系统信息，如 CPU、内存、操作系统版本等。</p>

    <div class="viewer-card">
      <div class="device-section">
        <div class="section-header">
          <span class="section-icon">📱</span>
          <h3>设备信息</h3>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">设备类型</span>
            <span class="info-value">{{ deviceInfo.type }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">操作系统</span>
            <span class="info-value">{{ deviceInfo.os }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">平台</span>
            <span class="info-value">{{ deviceInfo.platform }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">浏览器</span>
            <span class="info-value">{{ deviceInfo.browser }}</span>
          </div>
        </div>
      </div>

      <div class="screen-section">
        <div class="section-header">
          <span class="section-icon">🖥️</span>
          <h3>屏幕信息</h3>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">屏幕宽度</span>
            <span class="info-value">{{ screenInfo.width }} px</span>
          </div>
          <div class="info-card">
            <span class="info-label">屏幕高度</span>
            <span class="info-value">{{ screenInfo.height }} px</span>
          </div>
          <div class="info-card">
            <span class="info-label">可用宽度</span>
            <span class="info-value">{{ screenInfo.availWidth }} px</span>
          </div>
          <div class="info-card">
            <span class="info-label">可用高度</span>
            <span class="info-value">{{ screenInfo.availHeight }} px</span>
          </div>
          <div class="info-card">
            <span class="info-label">颜色深度</span>
            <span class="info-value">{{ screenInfo.colorDepth }} 位</span>
          </div>
          <div class="info-card">
            <span class="info-label">像素比例</span>
            <span class="info-value">{{ screenInfo.pixelRatio }}</span>
          </div>
        </div>
      </div>

      <div class="browser-section">
        <div class="section-header">
          <span class="section-icon">🌐</span>
          <h3>浏览器信息</h3>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">用户代理</span>
            <span class="info-value mono">{{ browserInfo.userAgent }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">语言</span>
            <span class="info-value">{{ browserInfo.language }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">时区</span>
            <span class="info-value">{{ browserInfo.timezone }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Cookie 启用</span>
            <span class="info-value">{{ browserInfo.cookieEnabled ? '是' : '否' }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">JavaScript 启用</span>
            <span class="info-value">{{ browserInfo.javaEnabled ? '是' : '否' }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">在线状态</span>
            <span class="info-value" :class="browserInfo.online ? 'online' : 'offline'">
              {{ browserInfo.online ? '在线' : '离线' }}
            </span>
          </div>
        </div>
      </div>

      <div class="battery-section" v-if="batteryInfo">
        <div class="section-header">
          <span class="section-icon">🔋</span>
          <h3>电池信息</h3>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">电池状态</span>
            <span class="info-value">{{ batteryInfo.charging ? '充电中' : '未充电' }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">电池电量</span>
            <span class="info-value">{{ batteryInfo.level }}%</span>
          </div>
          <div class="info-card">
            <span class="info-label">预计充满时间</span>
            <span class="info-value">{{ batteryInfo.chargingTime }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">预计可用时间</span>
            <span class="info-value">{{ batteryInfo.dischargingTime }}</span>
          </div>
        </div>
        <div class="battery-bar">
          <div class="battery-fill" :style="{ width: batteryInfo.level + '%' }"></div>
        </div>
      </div>

      <div class="connection-section" v-if="connectionInfo">
        <div class="section-header">
          <span class="section-icon">📶</span>
          <h3>网络连接</h3>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">连接类型</span>
            <span class="info-value">{{ connectionInfo.type }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">有效带宽</span>
            <span class="info-value">{{ connectionInfo.downlink }} Mbps</span>
          </div>
          <div class="info-card">
            <span class="info-label">往返延迟</span>
            <span class="info-value">{{ connectionInfo.rtt }} ms</span>
          </div>
          <div class="info-card">
            <span class="info-label">节省流量</span>
            <span class="info-value">{{ connectionInfo.saveData ? '是' : '否' }}</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="refreshInfo" class="btn-primary">刷新信息</button>
        <button @click="copyAllInfo" class="btn-secondary">复制全部信息</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const deviceInfo = ref({
  type: '未知',
  os: '未知',
  platform: '未知',
  browser: '未知'
})

const screenInfo = ref({
  width: 0,
  height: 0,
  availWidth: 0,
  availHeight: 0,
  colorDepth: 0,
  pixelRatio: 0
})

const browserInfo = ref({
  userAgent: '',
  language: '',
  timezone: '',
  cookieEnabled: false,
  javaEnabled: false,
  online: true
})

const batteryInfo = ref(null)
const connectionInfo = ref(null)

function getDeviceType() {
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return '平板电脑'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|windows phone/i.test(ua)) return '手机'
  return '桌面电脑'
}

function getOS() {
  const ua = navigator.userAgent
  if (ua.indexOf('Win') !== -1) return 'Windows'
  if (ua.indexOf('Mac') !== -1) return 'macOS'
  if (ua.indexOf('Linux') !== -1) return 'Linux'
  if (ua.indexOf('Android') !== -1) return 'Android'
  if (ua.indexOf('iOS') !== -1) return 'iOS'
  return '未知'
}

function getBrowser() {
  const ua = navigator.userAgent
  if (ua.indexOf('Firefox') !== -1) return 'Firefox'
  if (ua.indexOf('Chrome') !== -1) return 'Chrome'
  if (ua.indexOf('Safari') !== -1) return 'Safari'
  if (ua.indexOf('Edge') !== -1) return 'Edge'
  if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) return 'Internet Explorer'
  return '未知'
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function collectInfo() {
  deviceInfo.value = {
    type: getDeviceType(),
    os: getOS(),
    platform: navigator.platform,
    browser: getBrowser()
  }

  screenInfo.value = {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio
  }

  browserInfo.value = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: getTimezone(),
    cookieEnabled: navigator.cookieEnabled,
    javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
    online: navigator.onLine
  }

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      batteryInfo.value = {
        charging: battery.charging,
        level: Math.round(battery.level * 100),
        chargingTime: battery.chargingTime === Infinity ? 'N/A' : `${Math.round(battery.chargingTime / 60)} 分钟`,
        dischargingTime: battery.dischargingTime === Infinity ? 'N/A' : `${Math.round(battery.dischargingTime / 60)} 分钟`
      }
    })
  }

  if ('connection' in navigator) {
    const conn = navigator.connection
    connectionInfo.value = {
      type: conn.effectiveType || '未知',
      downlink: conn.downlink || 'N/A',
      rtt: conn.rtt || 'N/A',
      saveData: conn.saveData || false
    }
  }
}

function refreshInfo() {
  collectInfo()
}

function copyAllInfo() {
  const info = `
设备类型: ${deviceInfo.value.type}
操作系统: ${deviceInfo.value.os}
平台: ${deviceInfo.value.platform}
浏览器: ${deviceInfo.value.browser}

屏幕宽度: ${screenInfo.value.width} px
屏幕高度: ${screenInfo.value.height} px
可用宽度: ${screenInfo.value.availWidth} px
可用高度: ${screenInfo.value.availHeight} px
颜色深度: ${screenInfo.value.colorDepth} 位
像素比例: ${screenInfo.value.pixelRatio}

用户代理: ${browserInfo.value.userAgent}
语言: ${browserInfo.value.language}
时区: ${browserInfo.value.timezone}
Cookie 启用: ${browserInfo.value.cookieEnabled ? '是' : '否'}
在线状态: ${browserInfo.value.online ? '在线' : '离线'}
  `.trim()

  navigator.clipboard.writeText(info)
}

onMounted(() => {
  collectInfo()
})
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

.viewer-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 1.5rem;
}

.device-section,
.screen-section,
.browser-section,
.battery-section,
.connection-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 1.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.info-value.mono {
  font-family: monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

.info-value.online {
  color: #10b981;
}

.info-value.offline {
  color: #ef4444;
}

.battery-bar {
  height: 20px;
  background: #e5e5e5;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1rem;
}

.battery-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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

.dark .viewer-card {
  background: #262626;
}

.dark .device-section,
.dark .screen-section,
.dark .browser-section,
.dark .battery-section,
.dark .connection-section {
  background: #1a1a1a;
}

.dark .info-card {
  background: #262626;
}

.dark .btn-secondary {
  background: #404040;
  color: #e5e5e5;
}

.dark .btn-secondary:hover {
  background: #525252;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
