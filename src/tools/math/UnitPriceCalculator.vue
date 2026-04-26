<template>
  <div class="unit-price-calculator">
    <h2>单位价格计算器</h2>
    <p class="subtitle">比较不同商品的单价，找出性价比最高的选择</p>

    <div class="calculator-container">
      <div class="input-section">
        <h3>添加商品</h3>

        <div class="product-inputs">
          <div class="input-group">
            <label>商品名称 (可选)</label>
            <input type="text" v-model="newProduct.name" placeholder="如: 洗发水 A" />
          </div>
          <div class="input-row">
            <div class="input-group">
              <label>总价</label>
              <input type="number" v-model.number="newProduct.price" min="0" step="0.01" placeholder="0.00" />
            </div>
            <div class="input-group">
              <label>数量</label>
              <input type="number" v-model.number="newProduct.quantity" min="0.001" step="0.001" placeholder="0" />
            </div>
          </div>
          <div class="unit-select">
            <div class="input-group">
              <label>单位</label>
              <select v-model="newProduct.unit">
                <option value="pcs">个/件/瓶</option>
                <option value="g">克 (g)</option>
                <option value="kg">千克 (kg)</option>
                <option value="ml">毫升 (ml)</option>
                <option value="L">升 (L)</option>
                <option value="m">米 (m)</option>
                <option value="cm">厘米 (cm)</option>
                <option value="mm">毫米 (mm)</option>
                <option value="m2">平方米 (m²)</option>
                <option value="cm2">平方厘米 (cm²)</option>
              </select>
            </div>
          </div>
          <button @click="addProduct" class="add-btn">添加商品</button>
        </div>
      </div>

      <div class="products-section" v-if="products.length > 0">
        <h3>商品列表</h3>
        <div class="products-table">
          <table>
            <thead>
              <tr>
                <th>商品</th>
                <th>总价</th>
                <th>数量</th>
                <th>单位</th>
                <th>单价</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(product, index) in products"
                :key="index"
                :class="{ best: isBestPrice(product), worst: isWorstPrice(product) }"
              >
                <td>{{ product.name || `商品 ${index + 1}` }}</td>
                <td>¥{{ product.price.toFixed(2) }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ getUnitLabel(product.unit) }}</td>
                <td class="unit-price">
                  ¥{{ product.unitPrice.toFixed(4) }}/{{ getUnitLabel(product.unit) }}
                  <span v-if="isBestPrice(product)" class="best-badge">最低</span>
                </td>
                <td>
                  <button @click="removeProduct(index)" class="delete-btn">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="analysis-section" v-if="products.length >= 2">
          <h4>分析结果</h4>
          <div class="analysis-grid">
            <div class="analysis-item best">
              <span class="label">最划算</span>
              <span class="value">{{ bestProduct.name || `商品 ${products.indexOf(bestProduct) + 1}` }}</span>
              <span class="price">¥{{ bestProduct.unitPrice.toFixed(4) }}/{{ getUnitLabel(bestProduct.unit) }}</span>
            </div>
            <div class="analysis-item worst">
              <span class="label">最昂贵</span>
              <span class="value">{{ worstProduct.name || `商品 ${products.indexOf(worstProduct) + 1}` }}</span>
              <span class="price">¥{{ worstProduct.unitPrice.toFixed(4) }}/{{ getUnitLabel(worstProduct.unit) }}</span>
            </div>
            <div class="analysis-item saving">
              <span class="label">节省比例</span>
              <span class="value">{{ savingsPercentage.toFixed(1) }}%</span>
              <span class="desc">选择最划算vs最贵</span>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <h4>单价对比图</h4>
          <div class="chart">
            <div
              v-for="(product, index) in sortedProducts"
              :key="index"
              class="chart-bar-container"
            >
              <div class="chart-label">{{ product.name || `商品 ${index + 1}` }}</div>
              <div class="chart-bar-wrapper">
                <div
                  class="chart-bar"
                  :class="{ best: isBestPrice(product) }"
                  :style="{ width: getBarWidth(product) + '%' }"
                ></div>
              </div>
              <div class="chart-value">¥{{ product.unitPrice.toFixed(4) }}</div>
            </div>
          </div>
        </div>

        <button @click="clearAll" class="clear-btn">清空所有</button>
      </div>

      <div class="empty-state" v-else>
        <p>添加至少两个商品进行对比</p>
      </div>
    </div>

    <div class="tips-section">
      <h3>使用提示</h3>
      <ul>
        <li>确保比较的商品使用相同的单位 (如都是按克或都是按千克)</li>
        <li>如果单位不同，可以先手动转换再输入</li>
        <li>数量支持小数，方便输入非整数</li>
        <li>最低单价标绿的商品是最划算的选择</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const newProduct = ref({
  name: '',
  price: null,
  quantity: null,
  unit: 'pcs'
})

const products = ref([])

const unitLabels = {
  'pcs': '个',
  'g': '克',
  'kg': '千克',
  'ml': '毫升',
  'L': '升',
  'm': '米',
  'cm': '厘米',
  'mm': '毫米',
  'm2': '平方米',
  'cm2': '平方厘米'
}

const getUnitLabel = (unit) => unitLabels[unit] || unit

const addProduct = () => {
  if (newProduct.value.price > 0 && newProduct.value.quantity > 0) {
    const product = {
      name: newProduct.value.name,
      price: newProduct.value.price,
      quantity: newProduct.value.quantity,
      unit: newProduct.value.unit,
      unitPrice: newProduct.value.price / newProduct.value.quantity
    }
    products.value.push(product)
    newProduct.value = { name: '', price: null, quantity: null, unit: 'pcs' }
  }
}

const removeProduct = (index) => {
  products.value.splice(index, 1)
}

const clearAll = () => {
  products.value = []
}

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.unitPrice - b.unitPrice)
})

const bestProduct = computed(() => {
  if (products.value.length === 0) return null
  return sortedProducts.value[0]
})

const worstProduct = computed(() => {
  if (products.value.length === 0) return null
  return sortedProducts.value[sortedProducts.value.length - 1]
})

const savingsPercentage = computed(() => {
  if (!bestProduct.value || !worstProduct.value || worstProduct.value.unitPrice === 0) return 0
  return ((worstProduct.value.unitPrice - bestProduct.value.unitPrice) / worstProduct.value.unitPrice) * 100
})

const isBestPrice = (product) => {
  return bestProduct.value && product.unitPrice === bestProduct.value.unitPrice
}

const isWorstPrice = (product) => {
  return worstProduct.value && product.unitPrice === worstProduct.value.unitPrice
}

const getBarWidth = (product) => {
  if (worstProduct.value.unitPrice === 0) return 100
  return (product.unitPrice / worstProduct.value.unitPrice) * 100
}
</script>

<style scoped>
.unit-price-calculator {
  padding: 20px;
}
.subtitle {
  color: var(--text-secondary);
  margin-top: 0;
  margin-bottom: 20px;
}
.calculator-container {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  margin-bottom: 20px;
}
.input-section,
.products-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
h3 {
  margin-top: 0;
  margin-bottom: 15px;
}
.product-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-group label {
  font-weight: 500;
  font-size: 14px;
}
.input-group input,
.input-group select {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}
.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.add-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.products-table {
  overflow-x: auto;
  margin-bottom: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}
th {
  background: var(--bg-secondary);
  font-weight: 500;
  font-size: 13px;
}
tr.best {
  background: rgba(76, 175, 80, 0.1);
}
tr.worst {
  background: rgba(244, 67, 54, 0.1);
}
.unit-price {
  font-weight: bold;
  color: var(--primary-color);
}
.best-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 5px;
}
.delete-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}
.delete-btn:hover {
  background: #FFEBEE;
  border-color: #F44336;
  color: #F44336;
}
.analysis-section {
  margin-bottom: 20px;
}
.analysis-section h4 {
  margin: 0 0 15px 0;
}
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.analysis-item {
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}
.analysis-item.best {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
}
.analysis-item.worst {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid #F44336;
}
.analysis-item.saving {
  background: var(--bg-secondary);
}
.analysis-item .label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}
.analysis-item .value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}
.analysis-item .price {
  font-size: 14px;
  color: var(--primary-color);
}
.analysis-item.saving .value {
  color: #4CAF50;
}
.analysis-item .desc {
  font-size: 12px;
  color: var(--text-secondary);
}
.chart-section h4 {
  margin: 0 0 15px 0;
}
.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.chart-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chart-label {
  width: 80px;
  font-size: 12px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chart-bar-wrapper {
  flex: 1;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}
.chart-bar {
  height: 100%;
  background: #2196F3;
  border-radius: 4px;
  transition: width 0.3s;
  min-width: 2px;
}
.chart-bar.best {
  background: #4CAF50;
}
.chart-value {
  width: 100px;
  font-size: 12px;
  font-family: monospace;
}
.clear-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--card-bg);
  border-radius: 8px;
}
.tips-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
}
.tips-section h3 {
  margin-bottom: 10px;
}
.tips-section ul {
  margin: 0;
  padding-left: 20px;
}
.tips-section li {
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--text-secondary);
}
@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
  }
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>
