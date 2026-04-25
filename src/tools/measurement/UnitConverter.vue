<template>
  <div class="tool-container">
    <h1 class="title">单位换算工具</h1>
    <p class="description">在不同单位之间进行换算，支持长度、重量、体积、温度等多种单位。</p>

    <div class="converter-card">
      <div class="form-group">
        <label>选择类别：</label>
        <select v-model="category" class="select-input" @change="resetUnits">
          <option value="length">长度</option>
          <option value="weight">重量</option>
          <option value="volume">体积</option>
          <option value="temperature">温度</option>
          <option value="area">面积</option>
          <option value="speed">速度</option>
          <option value="time">时间</option>
          <option value="energy">能量</option>
        </select>
      </div>

      <div class="input-group">
        <div class="form-group">
          <label>从：</label>
          <div class="input-with-unit">
            <input
              v-model.number="inputValue"
              type="number"
              class="number-input"
              @input="convert"
            />
            <select v-model="fromUnit" class="unit-select" @change="convert">
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="conversion-arrow">⇄</div>

        <div class="form-group">
          <label>到：</label>
          <div class="input-with-unit">
            <input
              :value="outputValue"
              class="number-input result"
              readonly
            />
            <select v-model="toUnit" class="unit-select" @change="convert">
              <option v-for="unit in units" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="result-display">
        <div class="result-text">
          {{ inputValue }} {{ getUnitLabel(fromUnit) }} = {{ outputValue.toFixed(6) }} {{ getUnitLabel(toUnit) }}
        </div>
      </div>

      <div class="favorites-section">
        <h3>常用换算</h3>
        <div class="favorites-grid">
          <button
            v-for="favorite in favorites"
            :key="favorite.id"
            @click="applyFavorite(favorite)"
            class="favorite-btn"
          >
            {{ favorite.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const category = ref('length')
const inputValue = ref(1)
const fromUnit = ref('meter')
const toUnit = ref('kilometer')

const unitDefinitions = {
  length: {
    meter: { label: '米 (m)', factor: 1 },
    kilometer: { label: '千米 (km)', factor: 0.001 },
    centimeter: { label: '厘米 (cm)', factor: 100 },
    millimeter: { label: '毫米 (mm)', factor: 1000 },
    mile: { label: '英里 (mi)', factor: 0.000621371 },
    foot: { label: '英尺 (ft)', factor: 3.28084 },
    inch: { label: '英寸 (in)', factor: 39.3701 }
  },
  weight: {
    kilogram: { label: '千克 (kg)', factor: 1 },
    gram: { label: '克 (g)', factor: 1000 },
    ton: { label: '吨 (t)', factor: 0.001 },
    pound: { label: '磅 (lb)', factor: 2.20462 },
    ounce: { label: '盎司 (oz)', factor: 35.274 }
  },
  volume: {
    liter: { label: '升 (L)', factor: 1 },
    milliliter: { label: '毫升 (mL)', factor: 1000 },
    cubicMeter: { label: '立方米 (m³)', factor: 0.001 },
    gallon: { label: '加仑 (gal)', factor: 0.264172 },
    quart: { label: '夸脱 (qt)', factor: 1.05669 },
    pint: { label: '品脱 (pt)', factor: 2.11338 }
  },
  temperature: {
    celsius: { label: '摄氏度 (°C)', convert: (val) => val },
    fahrenheit: { label: '华氏度 (°F)', convert: (val) => (val * 9/5) + 32 },
    kelvin: { label: '开尔文 (K)', convert: (val) => val + 273.15 }
  },
  area: {
    squareMeter: { label: '平方米 (m²)', factor: 1 },
    squareKilometer: { label: '平方千米 (km²)', factor: 0.000001 },
    squareCentimeter: { label: '平方厘米 (cm²)', factor: 10000 },
    squareMile: { label: '平方英里 (mi²)', factor: 3.86102e-7 },
    acre: { label: '英亩 (acre)', factor: 0.000247105 },
    hectare: { label: '公顷 (ha)', factor: 0.0001 }
  },
  speed: {
    meterPerSecond: { label: '米/秒 (m/s)', factor: 1 },
    kilometerPerHour: { label: '千米/小时 (km/h)', factor: 3.6 },
    milePerHour: { label: '英里/小时 (mph)', factor: 2.23694 },
    knot: { label: '节 (kt)', factor: 1.94384 }
  },
  time: {
    second: { label: '秒 (s)', factor: 1 },
    minute: { label: '分钟 (min)', factor: 1/60 },
    hour: { label: '小时 (h)', factor: 1/3600 },
    day: { label: '天 (d)', factor: 1/86400 },
    week: { label: '周 (wk)', factor: 1/604800 },
    year: { label: '年 (yr)', factor: 1/31536000 }
  },
  energy: {
    joule: { label: '焦耳 (J)', factor: 1 },
    kilojoule: { label: '千焦 (kJ)', factor: 0.001 },
    calorie: { label: '卡路里 (cal)', factor: 0.239006 },
    kilocalorie: { label: '千卡 (kcal)', factor: 0.000239006 },
    wattHour: { label: '瓦时 (Wh)', factor: 0.000277778 }
  }
}

const units = computed(() => {
  return Object.entries(unitDefinitions[category.value]).map(([value, unit]) => ({
    value,
    label: unit.label
  }))
})

const outputValue = computed(() => {
  if (!inputValue.value) return 0
  return convertUnit(inputValue.value, fromUnit.value, toUnit.value)
})

const favorites = [
  { id: 1, name: '米 → 千米', category: 'length', from: 'meter', to: 'kilometer' },
  { id: 2, name: '千克 → 磅', category: 'weight', from: 'kilogram', to: 'pound' },
  { id: 3, name: '升 → 加仑', category: 'volume', from: 'liter', to: 'gallon' },
  { id: 4, name: '摄氏度 → 华氏度', category: 'temperature', from: 'celsius', to: 'fahrenheit' },
  { id: 5, name: '米/秒 → 千米/小时', category: 'speed', from: 'meterPerSecond', to: 'kilometerPerHour' },
  { id: 6, name: '平方米 → 公顷', category: 'area', from: 'squareMeter', to: 'hectare' }
]

function resetUnits() {
  const unitKeys = Object.keys(unitDefinitions[category.value])
  fromUnit.value = unitKeys[0]
  toUnit.value = unitKeys[1] || unitKeys[0]
}

function convert() {
}

function convertUnit(value, from, to) {
  if (category.value === 'temperature') {
    const tempInCelsius = unitDefinitions.temperature[from].convert(value)
    const celsiusToTarget = (val) => {
      if (to === 'celsius') return val
      if (to === 'fahrenheit') return (val * 9/5) + 32
      if (to === 'kelvin') return val + 273.15
      return val
    }
    return celsiusToTarget(tempInCelsius)
  }

  const fromFactor = unitDefinitions[category.value][from].factor
  const toFactor = unitDefinitions[category.value][to].factor
  return (value / fromFactor) * toFactor
}

function getUnitLabel(unit) {
  return unitDefinitions[category.value][unit]?.label || unit
}

function applyFavorite(favorite) {
  category.value = favorite.category
  fromUnit.value = favorite.from
  toUnit.value = favorite.to
  inputValue.value = 1
}

watch(category, resetUnits)
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

.select-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group .form-group {
  flex: 1;
  margin-bottom: 0;
}

.input-with-unit {
  display: flex;
  gap: 0.5rem;
}

.number-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.number-input.result {
  background: #fafafa;
}

.unit-select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  min-width: 120px;
}

.conversion-arrow {
  font-size: 1.5rem;
  color: #2563eb;
  font-weight: bold;
}

.result-display {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.result-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2563eb;
}

.favorites-section {
  margin-top: 2rem;
}

.favorites-section h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.favorite-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: #f0f0f0;
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

.dark .select-input,
.dark .number-input,
.dark .unit-select,
.dark .favorite-btn {
  background: #1a1a1a;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .number-input.result {
  background: #1a1a1a;
}

.dark .result-display {
  background: #1a1a1a;
}

.dark .favorite-btn:hover {
  background: #404040;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-with-unit {
    flex-direction: column;
  }

  .unit-select {
    width: 100%;
  }

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
