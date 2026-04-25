import { defineStore } from 'pinia'

export const useToolsStore = defineStore('tools', {
  state: () => ({
    tools: [
      // Security tools
      {
        id: 'token-generator',
        name: '令牌生成器',
        category: 'security',
        description: '生成包含您需要的字符的随机字符串，包括大写或小写字母、数字和/或符号。'
      },
      {
        id: 'hash-text',
        name: '文本哈希',
        category: 'security',
        description: '使用您需要的函数对文本字符串进行哈希处理：MD5、SHA1、SHA256、SHA224、SHA512、SHA384、SHA3 或 RIPEMD160'
      },
      {
        id: 'bcrypt',
        name: 'Bcrypt 哈希',
        category: 'security',
        description: '使用 bcrypt 对文本字符串进行哈希和比较。Bcrypt 是基于 Blowfish 密码的密码哈希函数。'
      },
      {
        id: 'uuid-generator',
        name: 'UUID 生成器',
        category: 'security',
        description: '通用唯一标识符 (UUID) 是一个 128 位数字，用于在计算机系统中标识信息。'
      },
      {
        id: 'ulid-generator',
        name: 'ULID 生成器',
        category: 'security',
        description: '生成随机的通用唯一字典序可排序标识符 (ULID)。'
      },
      // Conversion tools
      {
        id: 'base64-encoder',
        name: 'Base64 编码/解码器',
        category: 'conversion',
        description: '简单地将字符串编码和解码为其 base64 表示形式。'
      },
      {
        id: 'json-formatter',
        name: 'JSON 格式化',
        category: 'conversion',
        description: '将您的 JSON 字符串格式化为友好的、人类可读的格式。'
      },
      {
        id: 'color-converter',
        name: '颜色转换器',
        category: 'conversion',
        description: '在不同格式之间转换颜色（十六进制、RGB、HSL 和 CSS 名称）'
      },
      // Network tools
      {
        id: 'ip-subnet-calculator',
        name: 'IPv4 子网计算器',
        category: 'network',
        description: '解析您的 IPv4 CIDR 块并获取有关您的子网的所有信息。'
      },
      {
        id: 'mac-address-lookup',
        name: 'MAC 地址查询',
        category: 'network',
        description: '通过设备的 MAC 地址查找供应商和制造商。'
      },
      // Development tools
      {
        id: 'git-cheatsheet',
        name: 'Git 备忘单',
        category: 'development',
        description: 'Git 是一个去中心化的版本管理软件。通过此备忘单，您可以快速访问最常用的 git 命令。'
      },
      {
        id: 'chmod-calculator',
        name: 'Chmod 计算器',
        category: 'development',
        description: '使用此在线 chmod 计算器计算您的 chmod 权限和命令。'
      },
      // Utility tools
      {
        id: 'qr-code-generator',
        name: '二维码生成器',
        category: 'utility',
        description: '为 URL（或纯文本）生成和下载二维码，并自定义背景和前景颜色。'
      },
      {
        id: 'lorem-ipsum-generator',
        name: 'Lorem Ipsum 生成器',
        category: 'utility',
        description: 'Lorem Ipsum 是一种占位文本，通常用于在不依赖有意义内容的情况下展示文档或字体的视觉形式。'
      }
    ],
    categories: [
      { id: 'security', name: '安全' },
      { id: 'conversion', name: '转换' },
      { id: 'network', name: '网络' },
      { id: 'development', name: '开发' },
      { id: 'utility', name: '实用工具' }
    ],
    theme: 'light'
  }),
  getters: {
    getToolsByCategory: (state) => (category) => {
      return state.tools.filter(tool => tool.category === category)
    },
    searchTools: (state) => (query) => {
      if (!query) return []
      return state.tools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      )
    }
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark')
    }
  }
})