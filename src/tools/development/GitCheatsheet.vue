<template>
  <div class="container mx-auto px-4 py-8">
    <header class="mb-8">
      <router-link to="/" class="text-primary hover:underline mb-4 inline-block">← 返回首页</router-link>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">Git 备忘单</h1>
      <p class="text-gray-600 dark:text-gray-300">Git 是一个去中心化的版本管理软件。通过此备忘单，您可以快速访问最常用的 git 命令。</p>
    </header>
    
    <div class="bg-white dark:bg-dark-card rounded-lg p-6 shadow-md">
      <div class="mb-6">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text"
          placeholder="搜索 git 命令..."
        >
      </div>
      
      <div class="space-y-6">
        <div v-for="category in filteredCategories" :key="category.name" class="mb-6">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">{{ category.name }}</h3>
          <div class="space-y-4">
            <div v-for="command in category.commands" :key="command.command" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div class="font-mono text-sm mb-2">{{ command.command }}</div>
              <div class="text-gray-600 dark:text-gray-300">{{ command.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'GitCheatsheet',
  setup() {
    const searchQuery = ref('')
    
    const gitCommands = [
      {
        name: '基本命令',
        commands: [
          { command: 'git init', description: '初始化一个新的 git 仓库' },
          { command: 'git clone <url>', description: '克隆一个现有的仓库' },
          { command: 'git add <file>', description: '将文件添加到暂存区' },
          { command: 'git commit -m "message"', description: '用消息提交更改' },
          { command: 'git status', description: '检查工作目录的状态' }
        ]
      },
      {
        name: '分支管理',
        commands: [
          { command: 'git branch', description: '列出所有分支' },
          { command: 'git branch <name>', description: '创建一个新分支' },
          { command: 'git checkout <branch>', description: '切换到一个分支' },
          { command: 'git merge <branch>', description: '将一个分支合并到当前分支' },
          { command: 'git branch -d <branch>', description: '删除一个分支' }
        ]
      },
      {
        name: '远程仓库',
        commands: [
          { command: 'git remote -v', description: '列出远程仓库' },
          { command: 'git remote add <name> <url>', description: '添加一个远程仓库' },
          { command: 'git push <remote> <branch>', description: '推送更改到远程' },
          { command: 'git pull', description: '从远程拉取更改' },
          { command: 'git fetch', description: '从远程获取更改' }
        ]
      },
      {
        name: '历史和日志',
        commands: [
          { command: 'git log', description: '查看提交历史' },
          { command: 'git log --oneline', description: '查看简洁的提交历史' },
          { command: 'git log --graph', description: '以图形方式查看提交历史' },
          { command: 'git show <commit>', description: '显示提交的详细信息' },
          { command: 'git blame <file>', description: '显示文件每一行的修改者' }
        ]
      },
      {
        name: '撤销更改',
        commands: [
          { command: 'git checkout -- <file>', description: '丢弃工作目录中的更改' },
          { command: 'git reset HEAD <file>', description: '取消暂存文件' },
          { command: 'git reset --hard <commit>', description: '重置到特定提交' },
          { command: 'git revert <commit>', description: '创建一个新提交来撤销之前的提交' },
          { command: 'git stash', description: '暂时存储更改' }
        ]
      }
    ]
    
    const filteredCategories = computed(() => {
      if (!searchQuery.value) return gitCommands
      
      const query = searchQuery.value.toLowerCase()
      return gitCommands.map(category => {
        const filteredCommands = category.commands.filter(command => 
          command.command.toLowerCase().includes(query) || 
          command.description.toLowerCase().includes(query)
        )
        return { ...category, commands: filteredCommands }
      }).filter(category => category.commands.length > 0)
    })
    
    return {
      searchQuery,
      filteredCategories
    }
  }
}
</script>