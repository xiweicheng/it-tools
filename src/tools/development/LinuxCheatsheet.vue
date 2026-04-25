<template>
  <div class="tool-container">
    <h1 class="title">Linux 命令速查</h1>
    <p class="description">常用 Linux 命令的快速参考，包括文件操作、系统管理、网络等常用命令。</p>

    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索命令..."
      />
      <select v-model="category" class="category-select">
        <option value="all">全部分类</option>
        <option value="file">文件操作</option>
        <option value="system">系统管理</option>
        <option value="network">网络命令</option>
        <option value="user">用户管理</option>
        <option value="process">进程管理</option>
        <option value="disk">磁盘管理</option>
        <option value="package">包管理</option>
        <option value="network">网络工具</option>
      </select>
    </div>

    <div class="commands-grid">
      <div
        v-for="command in filteredCommands"
        :key="command.name"
        class="command-card"
      >
        <div class="command-header">
          <span class="command-name">{{ command.name }}</span>
          <span class="command-category">{{ getCategoryName(command.category) }}</span>
        </div>
        <div class="command-syntax">{{ command.syntax }}</div>
        <div class="command-description">{{ command.description }}</div>
        <div v-if="command.examples" class="command-examples">
          <div class="examples-title">示例：</div>
          <div
            v-for="(example, index) in command.examples"
            :key="index"
            class="example"
          >
            <code>{{ example }}</code>
          </div>
        </div>
        <button @click="copyCommand(command.name)" class="btn-copy">复制命令</button>
      </div>
    </div>

    <div v-if="filteredCommands.length === 0" class="no-results">
      未找到匹配的命令
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const category = ref('all')

const commands = [
  // 文件操作
  {
    name: 'ls',
    category: 'file',
    syntax: 'ls [选项] [目录]',
    description: '列出目录内容',
    examples: [
      'ls -la',
      'ls -lh /home'
    ]
  },
  {
    name: 'cd',
    category: 'file',
    syntax: 'cd [目录]',
    description: '切换目录',
    examples: [
      'cd /home/user',
      'cd ..'
    ]
  },
  {
    name: 'mkdir',
    category: 'file',
    syntax: 'mkdir [选项] 目录',
    description: '创建目录',
    examples: [
      'mkdir newdir',
      'mkdir -p dir1/dir2'
    ]
  },
  {
    name: 'rm',
    category: 'file',
    syntax: 'rm [选项] 文件/目录',
    description: '删除文件或目录',
    examples: [
      'rm file.txt',
      'rm -rf directory'
    ]
  },
  {
    name: 'cp',
    category: 'file',
    syntax: 'cp [选项] 源文件 目标文件',
    description: '复制文件或目录',
    examples: [
      'cp file.txt newfile.txt',
      'cp -r dir1 dir2'
    ]
  },
  {
    name: 'mv',
    category: 'file',
    syntax: 'mv [选项] 源文件 目标文件',
    description: '移动或重命名文件',
    examples: [
      'mv oldname.txt newname.txt',
      'mv file.txt /home/user/'
    ]
  },
  {
    name: 'cat',
    category: 'file',
    syntax: 'cat [选项] 文件',
    description: '查看文件内容',
    examples: [
      'cat file.txt',
      'cat file1.txt file2.txt > combined.txt'
    ]
  },
  {
    name: 'grep',
    category: 'file',
    syntax: 'grep [选项] 模式 文件',
    description: '在文件中搜索内容',
    examples: [
      'grep "error" log.txt',
      'grep -r "pattern" /var/log'
    ]
  },
  // 系统管理
  {
    name: 'ps',
    category: 'system',
    syntax: 'ps [选项]',
    description: '查看进程状态',
    examples: [
      'ps aux',
      'ps -ef | grep ssh'
    ]
  },
  {
    name: 'top',
    category: 'system',
    syntax: 'top',
    description: '实时查看系统资源使用情况',
    examples: [
      'top',
      'top -u username'
    ]
  },
  {
    name: 'df',
    category: 'system',
    syntax: 'df [选项]',
    description: '查看磁盘空间使用情况',
    examples: [
      'df -h',
      'df -T'
    ]
  },
  {
    name: 'free',
    category: 'system',
    syntax: 'free [选项]',
    description: '查看内存使用情况',
    examples: [
      'free -h',
      'free -m'
    ]
  },
  {
    name: 'uname',
    category: 'system',
    syntax: 'uname [选项]',
    description: '查看系统信息',
    examples: [
      'uname -a',
      'uname -r'
    ]
  },
  // 网络命令
  {
    name: 'ping',
    category: 'network',
    syntax: 'ping [选项] 主机',
    description: '测试网络连通性',
    examples: [
      'ping google.com',
      'ping -c 4 192.168.1.1'
    ]
  },
  {
    name: 'ifconfig',
    category: 'network',
    syntax: 'ifconfig [接口]',
    description: '查看网络接口信息',
    examples: [
      'ifconfig',
      'ifconfig eth0'
    ]
  },
  {
    name: 'netstat',
    category: 'network',
    syntax: 'netstat [选项]',
    description: '查看网络连接状态',
    examples: [
      'netstat -tulpn',
      'netstat -an'
    ]
  },
  {
    name: 'ss',
    category: 'network',
    syntax: 'ss [选项]',
    description: '查看网络连接状态（替代 netstat）',
    examples: [
      'ss -tulpn',
      'ss -s'
    ]
  },
  // 用户管理
  {
    name: 'useradd',
    category: 'user',
    syntax: 'useradd [选项] 用户名',
    description: '创建用户',
    examples: [
      'useradd newuser',
      'useradd -m -s /bin/bash newuser'
    ]
  },
  {
    name: 'passwd',
    category: 'user',
    syntax: 'passwd [用户名]',
    description: '设置用户密码',
    examples: [
      'passwd',
      'passwd username'
    ]
  },
  {
    name: 'usermod',
    category: 'user',
    syntax: 'usermod [选项] 用户名',
    description: '修改用户属性',
    examples: [
      'usermod -aG sudo username',
      'usermod -l newname oldname'
    ]
  },
  // 包管理
  {
    name: 'apt',
    category: 'package',
    syntax: 'apt [命令]',
    description: 'Debian/Ubuntu 包管理',
    examples: [
      'apt update',
      'apt install package',
      'apt remove package'
    ]
  },
  {
    name: 'yum',
    category: 'package',
    syntax: 'yum [命令]',
    description: 'CentOS/RHEL 包管理',
    examples: [
      'yum update',
      'yum install package',
      'yum remove package'
    ]
  },
  // 磁盘管理
  {
    name: 'fdisk',
    category: 'disk',
    syntax: 'fdisk [选项] 设备',
    description: '磁盘分区管理',
    examples: [
      'fdisk -l',
      'fdisk /dev/sda'
    ]
  },
  {
    name: 'mount',
    category: 'disk',
    syntax: 'mount [选项] 设备 挂载点',
    description: '挂载文件系统',
    examples: [
      'mount /dev/sdb1 /mnt',
      'mount -t ntfs /dev/sda1 /mnt/windows'
    ]
  },
  // 进程管理
  {
    name: 'kill',
    category: 'process',
    syntax: 'kill [信号] 进程ID',
    description: '终止进程',
    examples: [
      'kill 1234',
      'kill -9 1234'
    ]
  },
  {
    name: 'pkill',
    category: 'process',
    syntax: 'pkill [选项] 进程名',
    description: '按名称终止进程',
    examples: [
      'pkill firefox',
      'pkill -f process_name'
    ]
  }
]

const filteredCommands = computed(() => {
  let filtered = commands

  if (category.value !== 'all') {
    filtered = filtered.filter(cmd => cmd.category === category.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cmd => 
      cmd.name.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const categoryNames = {
  file: '文件操作',
  system: '系统管理',
  network: '网络命令',
  user: '用户管理',
  process: '进程管理',
  disk: '磁盘管理',
  package: '包管理'
}

function getCategoryName(cat) {
  return categoryNames[cat] || cat
}

function copyCommand(command) {
  navigator.clipboard.writeText(command)
}
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1000px;
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

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.category-select {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.command-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #2563eb;
}

.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.command-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  font-family: monospace;
}

.command-category {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  background: #e0e0e0;
  border-radius: 4px;
  color: #666;
}

.command-syntax {
  font-family: monospace;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.command-description {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #666;
  line-height: 1.4;
}

.command-examples {
  margin-bottom: 1rem;
}

.examples-title {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.example {
  font-family: monospace;
  font-size: 0.85rem;
  background: #f0f0f0;
  padding: 0.4rem;
  border-radius: 4px;
  margin-bottom: 0.3rem;
  overflow-x: auto;
}

.btn-copy {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #1d4ed8;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 1rem;
}

.dark .tool-container {
  color: #e5e5e5;
}

.dark .description {
  color: #a3a3a3;
}

.dark .search-input,
.dark .category-select {
  background: #262626;
  color: #e5e5e5;
  border-color: #404040;
}

.dark .command-card {
  background: #262626;
}

.dark .command-category {
  background: #404040;
  color: #a3a3a3;
}

.dark .command-syntax {
  color: #e5e5e5;
}

.dark .command-description {
  color: #a3a3a3;
}

.dark .example {
  background: #1a1a1a;
  color: #e5e5e5;
}

.dark .no-results {
  background: #262626;
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
  }

  .commands-grid {
    grid-template-columns: 1fr;
  }
}
</style>
