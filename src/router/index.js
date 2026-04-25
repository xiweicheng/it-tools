import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AllTools from '../views/AllTools.vue'
import Category from '../views/Category.vue'
import TokenGenerator from '../tools/security/TokenGenerator.vue'
import HashText from '../tools/security/HashText.vue'
import Bcrypt from '../tools/security/Bcrypt.vue'
import UUIDGenerator from '../tools/security/UUIDGenerator.vue'
import ULIDGenerator from '../tools/security/ULIDGenerator.vue'
import Base64Encoder from '../tools/conversion/Base64Encoder.vue'
import JSONFormatter from '../tools/conversion/JSONFormatter.vue'
import ColorConverter from '../tools/conversion/ColorConverter.vue'
import IPSubnetCalculator from '../tools/network/IPSubnetCalculator.vue'
import MACAddressLookup from '../tools/network/MACAddressLookup.vue'
import GitCheatsheet from '../tools/development/GitCheatsheet.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/all-tools',
    name: 'AllTools',
    component: AllTools
  },
  {
    path: '/category/:category',
    name: 'Category',
    component: Category
  },
  {
    path: '/tool/token-generator',
    name: 'TokenGenerator',
    component: TokenGenerator
  },
  {
    path: '/tool/hash-text',
    name: 'HashText',
    component: HashText
  },
  {
    path: '/tool/bcrypt',
    name: 'Bcrypt',
    component: Bcrypt
  },
  {
    path: '/tool/uuid-generator',
    name: 'UUIDGenerator',
    component: UUIDGenerator
  },
  {
    path: '/tool/ulid-generator',
    name: 'ULIDGenerator',
    component: ULIDGenerator
  },
  {
    path: '/tool/base64-encoder',
    name: 'Base64Encoder',
    component: Base64Encoder
  },
  {
    path: '/tool/json-formatter',
    name: 'JSONFormatter',
    component: JSONFormatter
  },
  {
    path: '/tool/color-converter',
    name: 'ColorConverter',
    component: ColorConverter
  },
  {
    path: '/tool/ip-subnet-calculator',
    name: 'IPSubnetCalculator',
    component: IPSubnetCalculator
  },
  {
    path: '/tool/mac-address-lookup',
    name: 'MACAddressLookup',
    component: MACAddressLookup
  },
  {
    path: '/tool/git-cheatsheet',
    name: 'GitCheatsheet',
    component: GitCheatsheet
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router