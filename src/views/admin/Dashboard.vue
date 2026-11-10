<template>
  <div class="dashboard">
    <h2 class="page-title">控制台</h2>
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6" v-for="item in statCards" :key="item.label">
        <div class="stat-card" :style="{ borderLeftColor: item.color }">
          <div class="stat-icon" :style="{ background: item.color }">
            <i class="fa" :class="item.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="quick-actions">
      <el-col :span="24">
        <div class="action-card">
          <h3>快捷操作</h3>
          <div class="action-grid">
            <el-button
              v-for="action in quickActions"
              :key="action.path"
              @click="$router.push(action.path)"
              class="action-btn"
            >
              {{ action.label }}
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="recent-section">
      <el-col :span="12">
        <div class="info-card">
          <h3>系统信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统名称">星溯智能后台管理系统</el-descriptions-item>
            <el-descriptions-item label="版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="Vue版本">3.x</el-descriptions-item>
            <el-descriptions-item label="UI框架">Element Plus</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="info-card">
          <h3>当前用户</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userInfo.username || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">{{ userInfo.nickname || '-' }}</el-descriptions-item>
            <el-descriptions-item label="角色">
              {{ roleMap[userInfo.role] || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { getDashboardStats } from '@/api/dashboard'

  export default defineComponent({
    name: 'Dashboard',
    setup() {
      const store = useStore()
      const userInfo = computed(() => store.getters.userInfo)

      const roleMap: Record<string, string> = {
        admin: '系统管理员',
        editor: '内容编辑',
        viewer: '访客'
      }

      const statCards = ref([
        { label: '内容模块', value: '9', color: '#38bdf8', icon: 'fa-th-large' },
        { label: '留言消息', value: '0', color: '#d946ef', icon: 'fa-envelope' },
        { label: '技术项', value: '6', color: '#22c55e', icon: 'fa-microchip' },
        { label: '里程碑', value: '4', color: '#f97316', icon: 'fa-flag' }
      ])

      const loadStats = async () => {
        try {
          const res: any = await getDashboardStats()
          const stats = res.data
          if (stats) {
            statCards.value[1].value = String(stats.totalMessages || 0)
            statCards.value[2].value = String(stats.techItems || 0)
            statCards.value[3].value = String(stats.milestones || 0)
          }
        } catch {
          // keep default values
        }
      }

      const quickActions = ref([
        { label: '首页管理', path: '/admin/home' },
        { label: '创始人管理', path: '/admin/founder' },
        { label: '核心技术', path: '/admin/core-tech' },
        { label: '星际AI', path: '/admin/ai-capability' },
        { label: '意象解析', path: '/admin/metaphor' },
        { label: '技术哲学', path: '/admin/philosophy' },
        { label: '里程碑', path: '/admin/milestone' },
        { label: '跨生态', path: '/admin/ecosystem' },
        { label: '联系信息', path: '/admin/contact' },
        { label: '留言管理', path: '/admin/messages' }
      ])

      onMounted(() => {
        loadStats()
      })

      return { userInfo, roleMap, statCards, quickActions }
    }
  })
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 4px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #e1e1ff;
    margin-bottom: 24px;
  }

  .stat-cards {
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, rgba(15, 15, 30, 0.9), rgba(20, 20, 50, 0.8));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 4px solid;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(14, 165, 233, 0.2);
      border-color: rgba(56, 189, 248, 0.4);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      i {
        font-size: 20px;
        color: #fff;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      }
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: #a8a8ff;
      margin-top: 6px;
    }
  }

  .action-card,
  .info-card {
    background: rgba(15, 15, 30, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #e1e1ff;
      margin-bottom: 16px;
    }
  }

  .action-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .action-btn {
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      &:hover {
        background: rgba(56, 189, 248, 0.2);
      }
    }
  }

  .recent-section {
    margin-top: 24px;
  }

  :deep(.el-descriptions) {
    --el-descriptions-item-bordered-label-background: rgba(15, 15, 30, 0.6);
    --el-descriptions-table-border: rgba(255, 255, 255, 0.1);
    --el-text-color-regular: #a8a8ff;
    --el-fill-color-blank: transparent;
  }
</style>
