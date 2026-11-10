<template>
  <el-container class="admin-layout">
    <div v-if="pageLoading" class="loading-overlay">
      <div class="planet-loader">
        <div class="planet-sphere"></div>
        <div class="planet-ring ring-1"></div>
        <div class="planet-ring ring-2"></div>
        <div class="planet-ring ring-3"></div>
        <div class="loading-text">
          <span class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </div>
    <el-aside :width="isCollapse ? '64px' : '220px'" class="admin-aside">
      <div class="aside-header">
        <img
          src="@/assets/images/login_logo.png"
          alt="logo"
          class="aside-logo"
          v-if="!isCollapse"
        />
        <span class="aside-title" v-if="!isCollapse">星溯后台</span>
        <span class="aside-title-mini" v-else>ST</span>
      </div>
      <el-menu
        :default-active="currentRoute"
        :collapse="isCollapse"
        router
        background-color="#0a0a1f"
        text-color="#a8a8ff"
        active-text-color="#38bdf8"
        class="aside-menu"
      >
        <el-menu-item index="/admin/dashboard">
          <i class="fa fa-home"></i>
          <template #title>控制台</template>
        </el-menu-item>
        <el-sub-menu index="content">
          <template #title>
            <i class="fa fa-th-large"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/admin/home">首页横幅</el-menu-item>
          <el-menu-item index="/admin/founder">创始人</el-menu-item>
          <el-menu-item index="/admin/core-tech">核心技术</el-menu-item>
          <el-menu-item index="/admin/ai-capability">星际AI</el-menu-item>
          <el-menu-item index="/admin/metaphor">意象解析</el-menu-item>
          <el-menu-item index="/admin/philosophy">技术哲学</el-menu-item>
          <el-menu-item index="/admin/milestone">里程碑</el-menu-item>
          <el-menu-item index="/admin/ecosystem">跨生态</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="interaction">
          <template #title>
            <i class="fa fa-comments"></i>
            <span>互动管理</span>
          </template>
          <el-menu-item index="/admin/contact">联系信息</el-menu-item>
          <el-menu-item index="/admin/messages">留言管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <i
            :class="isCollapse ? 'fa fa-indent' : 'fa fa-outdent'"
            class="collapse-btn"
            @click="isCollapse = !isCollapse"
          ></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">
              {{ $route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="user-name">{{ userInfo.nickname || userInfo.username || '管理员' }}</span>
          <el-dropdown @command="handleCommand">
            <i class="fa fa-cog setting-btn"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  export default defineComponent({
    name: 'AdminLayout',
    setup() {
      const route = useRoute()
      const router = useRouter()
      const store = useStore()
      const isCollapse = ref(false)
      const pageLoading = ref(true)

      const currentRoute = computed(() => route.path)
      const userInfo = computed(() => store.getters.userInfo)

      const handleCommand = (command: string) => {
        if (command === 'logout') {
          store.dispatch('logout')
          router.push('/yeharn')
        }
      }

      onMounted(() => {
        setTimeout(() => {
          pageLoading.value = false
        }, 800)
      })

      return {
        isCollapse,
        pageLoading,
        currentRoute,
        userInfo,
        handleCommand
      }
    }
  })
</script>

<style lang="scss" scoped>
  .admin-layout {
    height: 100vh;
    background: #050510;
  }

  .admin-aside {
    background: linear-gradient(180deg, #0a0a1f 0%, #0d0d28 60%, #0a0a1f 100%);
    border-right: 1px solid rgba(56, 189, 248, 0.15);
    box-shadow: 4px 0 24px rgba(14, 165, 233, 0.08);
    transition: width 0.3s;
    overflow: hidden;
    position: relative;

    // 侧边栏星空装饰
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: radial-gradient(1px 1px at 30px 60px, rgba(255, 255, 255, 0.4), transparent),
        radial-gradient(1px 1px at 120px 180px, rgba(56, 189, 248, 0.5), transparent),
        radial-gradient(1px 1px at 80px 320px, rgba(255, 255, 255, 0.3), transparent),
        radial-gradient(1px 1px at 160px 450px, rgba(217, 70, 239, 0.4), transparent);
      background-size: 220px 500px;
    }

    .aside-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      border-bottom: 1px solid rgba(56, 189, 248, 0.15);

      .aside-logo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
      }

      .aside-title {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(to right, #60a5fa, #22d3ee);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-left: 8px;
        white-space: nowrap;
        letter-spacing: 2px;
      }

      .aside-title-mini {
        font-size: 16px;
        font-weight: 700;
        color: #38bdf8;
        text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
      }
    }

    .aside-menu {
      border-right: none;
      height: calc(100% - 60px);
      overflow-y: auto;
      position: relative;
      z-index: 1;

      i {
        margin-right: 8px;
        width: 16px;
        text-align: center;
      }

      .el-menu-item,
      :deep(.el-sub-menu__title) {
        transition: all 0.3s;
        &:hover {
          background: rgba(56, 189, 248, 0.08);
        }
      }

      :deep(.el-menu-item.is-active) {
        box-shadow: inset 3px 0 0 #38bdf8;
        text-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
      }
    }
  }

  .admin-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: rgba(10, 10, 31, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(56, 189, 248, 0.15);

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .collapse-btn {
        font-size: 18px;
        cursor: pointer;
        color: #a8a8ff;
        transition: all 0.3s;
        &:hover {
          color: #38bdf8;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-name {
        color: #a8a8ff;
        font-size: 14px;
      }

      .setting-btn {
        font-size: 18px;
        cursor: pointer;
        color: #a8a8ff;
        transition: all 0.3s;
        &:hover {
          color: #38bdf8;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
        }
      }
    }
  }

  .admin-main {
    background: radial-gradient(2px 2px at 10% 20%, rgba(255, 255, 255, 0.25), transparent),
      radial-gradient(1px 1px at 30% 60%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(2px 2px at 70% 30%, rgba(56, 189, 248, 0.25), transparent),
      radial-gradient(1px 1px at 85% 70%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(ellipse at 80% 110%, rgba(217, 70, 239, 0.06), transparent 50%),
      radial-gradient(ellipse at 10% -10%, rgba(56, 189, 248, 0.06), transparent 50%), #050510;
    background-attachment: fixed;
    overflow-y: auto;
  }

  :deep(.el-breadcrumb__inner) {
    color: #a8a8ff !important;
  }

  :deep(.el-menu-item.is-active) {
    background: rgba(56, 189, 248, 0.1) !important;
  }

  :deep(.el-sub-menu__title) {
    color: #a8a8ff !important;
  }

  :deep(.el-switch.is-checked .el-switch__core) {
    background-color: #0ea5e9 !important;
    border-color: #0ea5e9 !important;
  }
  :deep(.el-switch__core) {
    width: 44px !important;
    height: 22px !important;
    border-radius: 11px !important;
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  :deep(.el-switch__action) {
    width: 18px !important;
    height: 18px !important;
  }

  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #050510;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .planet-loader {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .planet-sphere {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid rgba(99, 102, 241, 0.6);
    background: radial-gradient(circle at 35% 35%, rgba(99, 102, 241, 0.15), transparent 70%);
    animation: planet-pulse 3s ease-in-out infinite;
  }
  .planet-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid transparent;
  }
  .planet-ring.ring-1 {
    width: 160px;
    height: 160px;
    border-top-color: rgba(6, 182, 212, 0.7);
    border-right-color: rgba(6, 182, 212, 0.3);
    animation: planet-spin 2s linear infinite;
  }
  .planet-ring.ring-2 {
    width: 180px;
    height: 180px;
    border-bottom-color: rgba(217, 70, 239, 0.6);
    border-left-color: rgba(217, 70, 239, 0.2);
    animation: planet-spin 3s linear infinite reverse;
  }
  .planet-ring.ring-3 {
    width: 200px;
    height: 200px;
    border-top-color: rgba(56, 189, 248, 0.4);
    border-bottom-color: rgba(56, 189, 248, 0.4);
    animation: planet-spin 4s linear infinite;
  }
  .loading-text {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .loading-dots {
    display: flex;
    gap: 6px;
  }
  .loading-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38bdf8;
    animation: dot-bounce 1.4s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes planet-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes planet-pulse {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.5), inset 0 0 30px rgba(99, 102, 241, 0.2);
    }
  }
  @keyframes dot-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.4);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
