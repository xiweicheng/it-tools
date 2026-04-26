# IT Tools

一款为开发者打造的便捷在线工具集合，基于 Vue 3 + Composition API 构建，支持中文界面。

## 功能特性

- **60+ 实用工具**：涵盖开发、网络、文本、转换、安全、数学、度量等多个领域
- **响应式设计**：适配桌面端和移动端
- **深色模式**：支持浅色/深色主题切换
- **中文界面**：全中文操作界面
- **即用即查**：无需安装，直接在浏览器中使用

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **路由管理**：Vue Router 4 (Hash 模式)
- **状态管理**：Pinia
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **开发语言**：JavaScript

## 工具分类

### 安全类 (Security)
- 令牌生成器
- 文本哈希 (MD5/SHA1/SHA256/SHA384/SHA512/SHA3/RIPEMD160)
- Bcrypt 哈希
- UUID 生成器 / ULID 生成器
- 密码强度检查器
- 哈希值对比工具
- JWT 解码器
- 文件哈希计算器

### 转换类 (Conversion)
- Base64 编码/解码器
- JSON 格式化
- 颜色转换器 (HEX/RGB/HSL)
- 时间戳转换器
- URL 编码/解码器
- 进制转换器 (2/8/10/16进制)
- JSON ↔ YAML 转换器
- HTML 实体编码/解码器
- 简体繁体转换器

### 网络类 (Network)
- IPv4 子网计算器
- MAC 地址查询
- IP 地址查询
- DNS 查找工具
- 端口检测工具

### 开发类 (Development)
- Git 备忘单
- Cron 表达式生成器
- 正则表达式测试器
- 正则表达式生成器
- XML 格式化工具
- 变量命名转换器
- 代码格式化工具
- 版本号对比工具
- Linux 命令速查
- 注释生成工具
- 接口参数拼装工具
- API 文档生成器
- 环境变量格式化工具
- Chmod 计算器
- 进度条生成工具
- UUID 格式转换工具
- 色板生成工具

### 网页类 (Web)
- URL 解析器
- User-Agent 解析器
- 二维码生成器
- CORS 测试工具
- Cookie 解析格式化
- HTTP 状态码查询
- Meta 标签生成器

### 文本类 (Text)
- 文本大小写转换器
- 文本去重工具
- 字符统计工具
- 文本对比差异工具
- 文本排序工具
- 文本分割合并工具

### 数学类 (Math)
- 科学计算器
- 随机数生成器
- 质数检测/生成工具
- 几何面积体积计算
- 数列计算工具 (等差/等比/斐波那契)

### 度量类 (Measurement)
- 存储单位换算
- 时间计算器
- 像素/尺寸单位换算
- 角度/弧度转换器
- 数据速率换算
- 单位换算工具

### 图片类 (Image)
- 图片 Base64 互转工具

### 实用工具类 (Utility)
- Lorem Ipsum 生成器

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 或 http://localhost:5176（取决于端口占用情况）

### 构建生产版本

```bash
npm run build
```

### 部署

```bash
npm run deploy
```

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── SearchBar.vue    # 搜索栏
│   ├── ThemeToggle.vue  # 主题切换
│   ├── ToolCard.vue     # 工具卡片
│   └── ToolCategory.vue # 工具分类
├── router/
│   └── index.js         # 路由配置
├── store/
│   └── modules/
│       └── tools.js     # 工具数据状态
├── tools/               # 工具组件
│   ├── conversion/      # 转换类工具
│   ├── development/     # 开发类工具
│   ├── image/          # 图片类工具
│   ├── math/           # 数学类工具
│   ├── measurement/     # 度量类工具
│   ├── network/         # 网络类工具
│   ├── security/       # 安全类工具
│   ├── text/           # 文本类工具
│   ├── utility/        # 实用工具
│   └── web/            # 网页类工具
├── views/
│   ├── AllTools.vue    # 全部工具页面
│   ├── Category.vue    # 分类页面
│   └── Home.vue        # 首页
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 添加新工具

1. 在 `src/tools/` 下对应分类目录中创建工具组件
2. 在 `src/router/index.js` 中添加路由
3. 在 `src/store/modules/tools.js` 的 `tools` 数组中添加工具信息

## 许可证

MIT License
