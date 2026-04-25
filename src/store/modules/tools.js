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
      {
        id: 'password-strength-checker',
        name: '密码强度检查器',
        category: 'security',
        description: '检查密码强度并获取改进建议。'
      },
      {
        id: 'hash-comparator',
        name: '哈希值对比工具',
        category: 'security',
        description: '比较两个哈希值是否相同，常用于验证文件完整性。'
      },
      {
        id: 'jwt-decoder',
        name: 'JWT 解码器',
        category: 'security',
        description: '解码 JSON Web Tokens，查看 Header、Payload 和签名信息。'
      },
      {
        id: 'file-hash-calculator',
        name: '文件哈希计算器',
        category: 'security',
        description: '计算文件的 MD5、SHA1、SHA256 等哈希值。'
      },
      {
        id: 'xml-formatter',
        name: 'XML 格式化工具',
        category: 'development',
        description: '对 XML 进行格式化和压缩。'
      },
      {
        id: 'text-case-converter',
        name: '文本大小写转换器',
        category: 'text',
        description: '将文本转换为各种大小写格式，包括驼峰命名、蛇形命名等。'
      },
      {
        id: 'text-deduplicator',
        name: '文本去重工具',
        category: 'text',
        description: '对文本进行去重、去除空格、去除空行等操作。'
      },
      {
        id: 'character-counter',
        name: '字符统计工具',
        category: 'text',
        description: '统计文本的字符数、单词数、行数等信息。'
      },
      {
        id: 'chinese-converter',
        name: '简体繁体转换器',
        category: 'conversion',
        description: '在简体中文和繁体中文之间相互转换。'
      },
      {
        id: 'scientific-calculator',
        name: '科学计算器',
        category: 'math',
        description: '功能强大的科学计算器，支持三角函数、对数、幂运算等。'
      },
      {
        id: 'storage-converter',
        name: '存储单位换算',
        category: 'measurement',
        description: '在不同的存储单位之间进行换算，如字节、KB、MB、GB、TB 等。'
      },
      {
        id: 'time-calculator',
        name: '时间计算器',
        category: 'measurement',
        description: '计算时区之间的时间差，日期加减运算。'
      },
      {
        id: 'text-diff',
        name: '文本对比差异工具',
        category: 'text',
        description: '比较两段文本的差异，高亮显示新增、删除和修改的内容。'
      },
      {
        id: 'text-sorter',
        name: '文本排序工具',
        category: 'text',
        description: '对文本进行升序或降序排序，支持按行、字母、数字等方式排序。'
      },
      {
        id: 'text-splitter',
        name: '文本分割合并工具',
        category: 'text',
        description: '将大文本按指定规则分割，或将多个小文本片段合并成一个。'
      },
      {
        id: 'random-number-generator',
        name: '随机数生成器',
        category: 'math',
        description: '生成指定范围内的随机整数或小数，支持批量生成和去重。'
      },
      {
        id: 'prime-checker',
        name: '质数检测/生成工具',
        category: 'math',
        description: '检测一个数是否为质数，或生成指定范围内的所有质数。'
      },
      {
        id: 'variable-converter',
        name: '变量命名转换器',
        category: 'development',
        description: '在不同命名风格之间转换变量名，如驼峰命名、蛇形命名、帕斯卡命名等。'
      },
      {
        id: 'code-formatter',
        name: '代码格式化工具',
        category: 'development',
        description: '对代码进行格式化（美化）和压缩处理，支持多种编程语言。'
      },
      {
        id: 'version-comparator',
        name: '版本号对比工具',
        category: 'development',
        description: '比较两个版本号的大小，支持语义化版本（SemVer）格式。'
      },
      {
        id: 'url-parser',
        name: 'URL 解析器',
        category: 'web',
        description: '解析 URL 的各个组成部分，包括协议、主机名、端口、路径、查询参数等。'
      },
      {
        id: 'user-agent-parser',
        name: 'User-Agent 解析器',
        category: 'web',
        description: '解析浏览器的 User-Agent 字符串，获取浏览器类型、操作系统、设备信息等。'
      },
      {
        id: 'qrcode-generator',
        name: '二维码生成器',
        category: 'web',
        description: '生成二维码，支持自定义尺寸、颜色和纠错级别。'
      },
      {
        id: 'cors-tester',
        name: 'CORS 测试工具',
        category: 'web',
        description: '测试跨域资源共享（CORS）策略，检测 API 的跨域访问权限。'
      },
      {
        id: 'port-scanner',
        name: '端口检测工具',
        category: 'network',
        description: '检测目标主机的端口开放状态，支持单端口和端口范围检测。'
      },
      {
        id: 'image-base64',
        name: '图片 Base64 互转工具',
        category: 'image',
        description: '将图片转换为 Base64 编码，或将 Base64 还原为图片。'
      },
      {
        id: 'pixel-converter',
        name: '像素/尺寸单位换算',
        category: 'measurement',
        description: '在不同屏幕尺寸单位之间进行换算，如 px、em、rem、vw、vh 等。'
      },
      {
        id: 'angle-converter',
        name: '角度/弧度转换器',
        category: 'measurement',
        description: '在不同角度单位之间进行换算，支持度（°）、弧度（rad）、梯度（grad）和圈数。'
      },
      {
        id: 'data-rate-converter',
        name: '数据速率换算',
        category: 'measurement',
        description: '在不同数据速率单位之间进行换算，如 bps、Kbps、Mbps、Gbps 等。'
      },
      {
        id: 'unit-converter',
        name: '单位换算工具',
        category: 'measurement',
        description: '支持长度、重量、体积、温度等多种单位之间的相互转换。'
      },
      {
        id: 'geometry-calculator',
        name: '几何面积体积计算',
        category: 'math',
        description: '计算各种几何图形的面积、体积和周长，支持圆形、矩形、三角形等。'
      },
      {
        id: 'linux-cheatsheet',
        name: 'Linux 命令速查',
        category: 'development',
        description: '常用 Linux 命令速查，包含系统管理、文件操作、网络配置等命令。'
      },
      {
        id: 'cookie-parser',
        name: 'Cookie 解析格式化',
        category: 'web',
        description: '解析、编辑和生成 Cookie 字符串，支持可视化编辑界面。'
      },
      {
        id: 'http-status-codes',
        name: 'HTTP 状态码查询',
        category: 'web',
        description: '查询 HTTP 状态码的含义和分类，支持按类别和关键词搜索。'
      },
      {
        id: 'meta-generator',
        name: 'Meta 标签生成器',
        category: 'web',
        description: '生成 HTML Meta 标签，支持 SEO、社交媒体和响应式设计标签。'
      },
      {
        id: 'comment-generator',
        name: '注释生成工具',
        category: 'development',
        description: '为代码生成各种风格的注释，支持多种编程语言和注释格式。'
      },
      {
        id: 'api-parameter-builder',
        name: '接口参数拼装工具',
        category: 'development',
        description: '快速拼装和格式化 API 请求参数，支持 URL 查询字符串和 JSON 格式。'
      },
      {
        id: 'env-formatter',
        name: '环境变量格式化工具',
        category: 'development',
        description: '格式化和验证环境变量，支持多种格式的转换和导出。'
      },
      {
        id: 'sequence-calculator',
        name: '数列计算工具',
        category: 'math',
        description: '计算各种数列的项值和总和，支持等差数列、等比数列和斐波那契数列等。'
      },
      {
        id: 'chmod-calculator',
        name: 'Chmod 计算器',
        category: 'development',
        description: '使用此在线 chmod 计算器计算您的 chmod 权限和命令。'
      },
      {
        id: 'lorem-ipsum-generator',
        name: 'Lorem Ipsum 生成器',
        category: 'utility',
        description: '生成 Lorem Ipsum 占位文本，常用于排版和设计中的示例内容。'
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
      {
        id: 'timestamp-converter',
        name: '时间戳转换器',
        category: 'conversion',
        description: '将 Unix 时间戳和日期时间相互转换的工具。'
      },
      {
        id: 'url-encoder',
        name: 'URL 编码/解码器',
        category: 'conversion',
        description: '对 URL 进行编码和解码处理的工具。'
      },
      {
        id: 'base-converter',
        name: '进制转换器',
        category: 'conversion',
        description: '在二进制、八进制、十进制和十六进制之间转换数字。'
      },
      {
        id: 'json-yaml-converter',
        name: 'JSON ↔ YAML 转换器',
        category: 'conversion',
        description: '在 JSON 和 YAML 格式之间相互转换。'
      },
      {
        id: 'html-encoder',
        name: 'HTML 实体编码/解码器',
        category: 'conversion',
        description: '对 HTML 特殊字符进行编码和解码的工具。'
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
      {
        id: 'ip-address-lookup',
        name: 'IP 地址查询',
        category: 'network',
        description: '查询 IP 地址的地理位置和详细信息。'
      },
      // Development tools
      {
        id: 'git-cheatsheet',
        name: 'Git 备忘单',
        category: 'development',
        description: 'Git 是一个去中心化的版本管理软件。通过此备忘单，您可以快速访问最常用的 git 命令。'
      },
      {
        id: 'cron-generator',
        name: 'Cron 表达式生成器',
        category: 'development',
        description: '生成和验证 Cron 表达式的可视化工具。'
      },
      {
        id: 'regex-tester',
        name: '正则表达式测试器',
        category: 'development',
        description: '在线测试正则表达式，实时匹配高亮显示。'
      }
    ],
    categories: [
      { id: 'security', name: '安全' },
      { id: 'conversion', name: '转换' },
      { id: 'network', name: '网络' },
      { id: 'development', name: '开发' },
      { id: 'web', name: '网页' },
      { id: 'text', name: '文本' },
      { id: 'math', name: '数学' },
      { id: 'measurement', name: '度量' },
      { id: 'image', name: '图片' },
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
