<template>
  <div class="tool-container">
    <h1 class="title">DNS 查找工具</h1>
    <p class="description">查询域名的各种 DNS 记录，包括 A、AAAA、CNAME、MX、TXT 等记录类型。</p>

    <div class="dns-card">
      <div class="form-group">
        <label>域名：</label>
        <input
          v-model="domain"
          type="text"
          class="text-input"
          placeholder="输入域名，例如: example.com"
        />
      </div>

      <div class="form-group">
        <label>记录类型：</label>
        <select v-model="recordType" class="select-input">
          <option value="A">A (IPv4 地址)</option>
          <option value="AAAA">AAAA (IPv6 地址)</option>
          <option value="CNAME">CNAME (别名)</option>
          <option value="MX">MX (邮件服务器)</option>
          <option value="TXT">TXT (文本记录)</option>
          <option value="NS">NS (域名服务器)</option>
          <option value="SOA">SOA (起始授权记录)</option>
          <option value="SRV">SRV (服务记录)</option>
          <option value="ALL">ALL (所有记录)</option>
        </select>
      </div>

      <button @click="lookupDNS" class="btn-primary">查询 DNS</button>

      <div v-if="loading" class="loading">查询中...</div>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="records.length > 0" class="results-section">
        <h3>查询结果</h3>
        <div class="records-list">
          <div
            v-for="(record, index) in records"
            :key="index"
            class="record-card"
          >
            <div class="record-header">
              <span class="record-type">{{ record.type }}</span>
              <span class="record-ttl">TTL: {{ record.ttl }}s</span>
            </div>
            <div class="record-content">
              <pre>{{ record.value }}</pre>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && domain" class="no-results">
        未找到 DNS 记录
      </div>
    </div>

    <div class="info-section">
      <h3>DNS 记录类型说明</h3>
      <div class="record-types-grid">
        <div class="record-type-info">
          <h4>A 记录</h4>
          <p>将域名映射到 IPv4 地址</p>
        </div>
        <div class="record-type-info">
          <h4>AAAA 记录</h4>
          <p>将域名映射到 IPv6 地址</p>
        </div>
        <div class="record-type-info">
          <h4>CNAME 记录</h4>
          <p>将域名映射到另一个域名</p>
        </div>
        <div class="record-type-info">
          <h4>MX 记录</h4>
          <p>指定邮件服务器</p>
        </div>
        <div class="record-type-info">
          <h4>TXT 记录</h4>
          <p>存储文本信息，常用于验证</p>
        </div>
        <div class="record-type-info">
          <h4>NS 记录</h4>
          <p>指定域名服务器</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const domain = ref('example.com')
const recordType = ref('A')
const records = ref([])
const loading = ref(false)
const error = ref('')

function lookupDNS() {
  if (!domain.value) {
    error.value = '请输入域名'
    return
  }

  loading.value = true
  error.value = ''
  records.value = []

  // 模拟 DNS 查询结果
  setTimeout(() => {
    loading.value = false
    
    // 模拟不同记录类型的响应
    const mockRecords = {
      A: [
        { type: 'A', ttl: 3600, value: '93.184.216.34' }
      ],
      AAAA: [
        { type: 'AAAA', ttl: 3600, value: '2606:2800:220:1:248:1893:25c8:1946' }
      ],
      CNAME: [
        { type: 'CNAME', ttl: 3600, value: 'example.com' }
      ],
      MX: [
        { type: 'MX', ttl: 3600, value: '10 mail.example.com' }
      ],
      TXT: [
        { type: 'TXT', ttl: 3600, value: 'v=spf1 include:spf.example.com ~all' },
        { type: 'TXT', ttl: 3600, value: 'google-site-verification=abc123' }
      ],
      NS: [
        { type: 'NS', ttl: 86400, value: 'ns1.example.com' },
        { type: 'NS', ttl: 86400, value: 'ns2.example.com' }
      ],
      SOA: [
        { type: 'SOA', ttl: 86400, value: 'ns1.example.com admin.example.com 2024010101 3600 600 604800 3600' }
      ],
      SRV: [
        { type: 'SRV', ttl: 3600, value: '0 5 5060 sip.example.com' }
      ],
      ALL: [
        { type: 'A', ttl: 3600, value: '93.184.216.34' },
        { type: 'AAAA', ttl: 3600, value: '2606:2800:220:1:248:1893:25c8:1946' },
        { type: 'MX', ttl: 3600, value: '10 mail.example.com' },
        { type: 'NS', ttl: 86400, value: 'ns1.example.com' },
        { type: 'NS', ttl: 86400, value: 'ns2.example.com' }
      ]
    }

    records.value = mockRecords[recordType.value] || []
  }, 1000)
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

.dns-card {
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

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  margin-top: 1rem;
}

.error {
  text-align: center;
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  margin-top: 1rem;
}

.results-section {
  margin-top: 2rem;
}

.results-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-card {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eee;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.record-type {
  font-weight: 600;
  color: #2563eb;
}

.record-ttl {
  font-size: 0.85rem;
  color: #666;
}

.record-content {
  background: #f8f8f8;
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.4;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 1rem;
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

.record-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.record-type-info {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eee;
}

.record-type-info h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #333;
}

.record-type-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .dns-card,
.dark .info-section {
  background: #262626;
}

.dark .select-input,
.dark .text-input {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .loading {
  color: #a3a3a3;
}

.dark .error {
  background: #7f1d1d;
  color: #fecaca;
}

.dark .record-card,
.dark .record-type-info {
  background: #1a1a1a;
  border-color: #333;
}

.dark .record-content {
  background: #262626;
  color: #e5e5e5;
}

.dark .no-results {
  background: #1a1a1a;
  color: #a3a3a3;
}

.dark .record-type {
  color: #60a5fa;
}

.dark .record-ttl {
  color: #a3a3a3;
}

.dark .record-type-info h4 {
  color: #e5e5e5;
}

.dark .record-type-info p {
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .record-types-grid {
    grid-template-columns: 1fr;
  }
}
</style>
