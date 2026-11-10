<template>
  <!-- eslint-disable -->
  <div class="homepage-root">
    <div v-if="loading" class="loading-overlay">
      <div class="planet-loader">
        <div class="planet-sphere"></div>
        <div class="planet-ring ring-1"></div>
        <div class="planet-ring ring-2"></div>
        <div class="planet-ring ring-3"></div>
        <div class="loading-text">
          <span class="loading-dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
    <template v-else>
    <div class="fixed inset-0 z-0 bg-stars opacity-70"></div>
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div class="absolute w-[1400px] h-[1400px] rounded-full bg-fuchsia-500/10 blur-3xl top-[-400px] -right-10 animate-nebula-flow"></div>
      <div class="absolute w-[1200px] h-[1200px] rounded-full bg-cyan-500/10 blur-3xl bottom-[-300px] -left-10 animate-nebula-flow" style="animation-delay:1s"></div>
      <div class="meteor top-20 right-40" style="animation-delay:0s;"></div>
      <div class="meteor top-40 right-20" style="animation-delay:2s;"></div>
      <div class="satellite top-1/4 right-1/4"></div>
    </div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-15 planet-3d">
      <div class="w-[1200px] h-[1200px] rounded-full border border-purple-400/10 animate-spin-3d"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-cyan-400/5 animate-spin-3d" style="animation-duration: 30s; animation-direction: reverse;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-fuchsia-400/5 animate-spin-3d" style="animation-duration: 35s;"></div>
    </div>
    <canvas id="homepage-three-canvas"></canvas>

    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 glass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center space-x-2">
            <img class="text-cyan-400 text-2xl animate-twinkle" style="width:100px" :src="siteConfig.logo_nav_url || '/login_logo.png'" />
            <span class="text-xl from-blue-400 via-cyan-400 to-blue-500 font-bold tracking-wider">{{ siteConfig.site_name || 'StellarTrace' }}</span>
          </div>
          <div class="hidden md:flex items-center space-x-6 relative">
            <div id="hp-rocket" class="absolute -bottom-6 text-xl transition-all duration-500 opacity-0">🚀</div>
            <a v-for="link in navLinks" :key="link.section" href="javascript:void(0)"
              class="nav-link text-white hover:text-cyan-400 transition-colors" :data-section="link.section"
              @click.prevent="scrollToSection(link.section)">
              {{ link.label }}
            </a>
            <button @click="aiChatVisible = true" class="nav-link px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm">
              <i class="fa fa-robot mr-1"></i> 星际AI
            </button>
          </div>
          <button class="md:hidden text-white" @click="mobileMenuOpen = !mobileMenuOpen">
            <i class="fa fa-bars text-xl"></i>
          </button>
        </div>
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-2">
          <a v-for="link in navLinks" :key="'m-' + link.section" href="javascript:void(0)"
            class="block text-white hover:text-cyan-400 transition-colors py-1"
            @click.prevent="scrollToSection(link.section); mobileMenuOpen = false">
            {{ link.label }}
          </a>
        </div>
      </div>
    </nav>

    <section id="home" class="relative min-h-screen flex items-center justify-center z-10 overflow-hidden perspective-3d">
      <div class="absolute inset-0 scan-line opacity-40"></div>
      <div class="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div class="animate-float animate-fade-in">
          <h1 class="text-6xl md:text-8xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-gradient">{{ currentBanner.title || '星溯智能' }}</span>
          </h1>
          <p v-if="currentBanner.subtitle" class="text-2xl md:text-4xl text-gray-200 mb-4 opacity-90">{{ currentBanner.subtitle }}</p>
          <p v-if="currentBanner.description" class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed" v-html="currentBanner.description"></p>
          <p v-else class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            追溯宇宙的起源，探索智能的边界<br />
            构建首个AI与人脑融合的未来智能生态
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-5 justify-center mt-10 animate-fade-in" style="animation-delay:0.5s">
          <a v-if="currentBanner.btn_text_1" href="javascript:void(0)"
            @click.prevent="handleBannerClick(currentBanner.btn_link_1 || '#ai-capability')"
            class="px-10 py-4 from-cyan-500 to-fuchsia-500 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
            {{ currentBanner.btn_text_1 }}
          </a>
          <a v-else href="javascript:void(0)" @click.prevent="scrollToSection('ai-capability')"
            class="px-10 py-4 from-cyan-500 to-fuchsia-500 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
            探索星际AI
          </a>
          <a v-if="currentBanner.btn_text_2" href="javascript:void(0)"
            @click.prevent="handleBannerClick(currentBanner.btn_link_2 || '#contact')"
            class="px-10 py-4 glass rounded-full font-medium hover:border-cyan-400 transition-all">
            <i class="fa fa-comments mr-2"></i>{{ currentBanner.btn_text_2 }}
          </a>
          <a v-else href="javascript:void(0)" @click.prevent="scrollToSection('contact')"
            class="px-10 py-4 glass rounded-full font-medium hover:border-cyan-400 transition-all">
            <i class="fa fa-comments mr-2"></i>联系我们
          </a>
        </div>
      </div>
    </section>

    <section id="founder" class="relative py-28 z-10 glass mx-4 md:mx-10 rounded-3xl glow-nebula perspective-3d">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient">创始人寄语</h2>
          <p class="text-gray-400 mt-3">星际代码的领航员</p>
        </div>
        <div v-for="founder in founders" :key="founder.id" class="grid md:grid-cols-5 gap-10 items-center">
          <div class="md:col-span-2 flex justify-center">
            <a :href="founder.profile_link || '#'" target="_blank" rel="noopener noreferrer" class="block">
              <div class="w-60 h-60 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-600 p-1 animate-spin-3d card-3d">
                <div class="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img v-if="founder.avatar" :src="founder.avatar" :alt="founder.name" class="w-full h-full object-cover" style="border-radius: 50%;" />
                  <span v-else class="text-8xl text-cyan-300">{{ founder.name ? founder.name[0] : '?' }}</span>
                </div>
              </div>
            </a>
          </div>
          <div class="md:col-span-3 text-lg text-white leading-loose space-y-3">
            <h3 class="text-2xl font-bold text-cyan-300 mb-4">{{ founder.name }}<span v-if="founder.title"> | {{ founder.title }}</span></h3>
            <p v-for="(line, i) in (founder.intro || '').split('\n')" :key="i">{{ line }}</p>
            <p v-if="founder.mission" class="font-semibold text-cyan-400 mt-6">{{ founder.mission }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="tech" class="relative py-24 z-10">
      <div class="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 class="text-4xl font-bold">核心技术栈</h2>
        <p class="text-gray-400 mt-3">我们用宇宙的语言，重新诠释技术的本质</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-3d">
        <div v-for="tech in coreTechs" :key="tech.id" class="glass rounded-2xl p-8 card-3d transition-all duration-300">
          <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
            :style="{ background: `linear-gradient(135deg, ${getColor(tech.color_from, '#f97316')}, ${getColor(tech.color_to, '#dc2626')})` }">
            <i class="fa text-white text-2xl" :class="tech.icon || 'fa-cogs'"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">{{ tech.name }}</h3>
          <p class="text-gray-400 text-sm">{{ tech.description }}</p>
        </div>
      </div>
    </section>

    <section id="ai-capability" class="relative py-24 z-10">
      <div class="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient">星际AI 5.0 能力</h2>
        <p class="text-gray-400 mt-3">AI与宇宙的终极融合，探索无限可能</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-5 gap-6 perspective-3d">
        <div v-for="cap in aiCapabilities" :key="cap.id" class="glass rounded-2xl p-6 card-3d text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            :style="{ background: `linear-gradient(135deg, ${getColor(cap.color_from, '#3b82f6')}, ${getColor(cap.color_to, '#06b6d4')})` }">
            <i class="fa text-2xl text-white" :class="cap.icon || 'fa-code'"></i>
          </div>
          <h3 class="font-bold mb-2">{{ cap.name }}</h3>
          <p class="text-gray-400 text-sm">{{ cap.description }}</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 mt-16 grid md:grid-cols-5 gap-6">
        <div v-for="metric in dashboardMetrics" :key="metric.label" class="glass rounded-xl p-6 text-center card-3d">
          <div class="text-3xl font-bold" :style="{ color: getColor(metric.color, '#38bdf8') }">{{ metric.value }}</div>
          <p class="text-gray-400 text-sm">{{ metric.label }}</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 mt-16">
        <div class="glass rounded-2xl p-8 card-3d">
          <h3 class="text-2xl font-bold mb-6 text-center">🚀 AI代码助手 · 宇宙主题代码生成</h3>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <label class="block text-sm text-gray-300 mb-2">输入你的需求</label>
              <textarea v-model="codeInput" rows="6" class="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white" placeholder="比如：帮我写一个计算行星轨道的JavaScript函数..."></textarea>
              <button @click="generateCode" class="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <i class="fa fa-magic mr-2"></i>AI生成代码
              </button>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">AI生成的代码</label>
              <pre class="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-green-400 text-sm h-[200px] overflow-auto">{{ codeOutput }}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="metaphor" class="relative py-24 z-10 glass mx-4 md:mx-10 rounded-3xl perspective-3d">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold">宇宙意象解析</h2>
          <p class="text-gray-400 mt-3">每一个宇宙符号，都是技术的浪漫隐喻</p>
        </div>
        <div class="grid md:grid-cols-3 gap-10">
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-cyan-300">宇宙元素 ↔ 技术映射</h3>
            <div v-for="m in metaphors" :key="m.id" class="p-3 glass rounded-lg">
              <span>{{ m.cosmic_element }} → {{ m.tech_mapping }}</span>
            </div>
          </div>
          <div class="md:col-span-2 glass p-8 rounded-2xl card-3d">
            <h3 class="text-2xl font-bold text-cyan-300 mb-4">设计意图</h3>
            <p class="text-gray-300 leading-relaxed">{{ designIntent.content || '我们相信，技术不应该是冰冷的代码和枯燥的参数，它应该是人类探索未知的浪漫诗篇。通过将日常的工程问题，映射到宏大的宇宙意象中，我们希望：让工程师在解决问题时，感受到探索宇宙的浪漫与使命感，让用户在使用产品时，能够直观地理解技术背后的宏大愿景。而AI，就是我们探索宇宙边界的最强工具。' }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="philosophy" class="relative py-24 z-10">
      <div class="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 class="text-4xl font-bold">技术哲学</h2>
        <p class="text-gray-400 mt-3">从宇宙的规律中，寻找技术的终极答案</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 perspective-3d">
        <div v-for="phil in philosophies" :key="phil.id" class="text-center p-8 glass rounded-2xl card-3d">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            :style="{ background: `linear-gradient(135deg, ${getColor(phil.color_from, '#0ea5e9')}, ${getColor(phil.color_to, '#2563eb')})` }">
            <i class="fa text-3xl text-white" :class="phil.icon || 'fa-infinity'"></i>
          </div>
          <h3 class="text-xl font-bold mb-4">{{ phil.title }}</h3>
          <p class="text-gray-300">{{ phil.description }}</p>
        </div>
      </div>
    </section>

    <section id="milestone" class="relative py-24 z-10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient">AI宇宙探索里程碑</h2>
          <p class="text-gray-400 mt-2">我们的AI，一步步探索宇宙的边界</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-fuchsia-500"></div>
          <div class="space-y-12">
            <div v-for="(ms, idx) in milestones" :key="ms.id" class="relative flex items-center">
              <div class="w-1/2" :class="idx % 2 === 0 ? 'pr-12 text-right' : ''">
                <div v-if="idx % 2 === 0" class="glass rounded-xl p-6 card-3d">
                  <h4 class="font-bold" :style="{ color: getColor(ms.color, '#38bdf8') }">{{ ms.year }}</h4>
                  <p class="text-white">{{ ms.description }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full z-10 flex items-center justify-center" :style="{ background: getColor(ms.color, '#38bdf8') }">
                <i class="fa text-white text-xs" :class="ms.icon || 'fa-star'"></i>
              </div>
              <div class="w-1/2" :class="idx % 2 !== 0 ? 'pl-12' : ''">
                <div v-if="idx % 2 !== 0" class="glass rounded-xl p-6 card-3d">
                  <h4 class="font-bold" :style="{ color: getColor(ms.color, '#38bdf8') }">{{ ms.year }}</h4>
                  <p class="text-white">{{ ms.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="ecosystem" class="relative py-24 z-10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient">跨宇宙终端生态</h2>
          <p class="text-gray-400 mt-3">一个AI，连接所有终端，让智能无处不在</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-3d">
          <div v-for="eco in ecosystems" :key="eco.id" class="glass rounded-2xl p-6 card-3d text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              :style="{ background: `linear-gradient(135deg, ${getColor(eco.color_from, '#3b82f6')}, ${getColor(eco.color_to, '#4f46e5')})` }">
              <i class="fa text-2xl text-white" :class="eco.icon || 'fa-rocket'"></i>
            </div>
            <h3 class="font-bold mb-2">{{ eco.name }}</h3>
            <p class="text-gray-400 text-sm">{{ eco.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="relative py-24 z-10 glass mx-4 md:mx-10 rounded-3xl">
      <div class="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 class="text-4xl font-bold">联系我们</h2>
        <p class="text-gray-400 mt-3">一起探索智能的宇宙边界</p>
      </div>
      <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div class="space-y-6">
          <div v-for="info in contactInfo" :key="info.id" class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center text-2xl">
              <span v-if="info.icon && !info.icon.startsWith('fa-')">{{ info.icon }}</span>
              <i v-else class="fa text-cyan-400 text-xl" :class="info.icon || 'fa-map-marker'"></i>
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-1">{{ info.label }}</h3>
              <p class="text-gray-400">{{ info.value }}</p>
            </div>
          </div>
        </div>
        <div class="glass rounded-2xl p-8">
          <form class="space-y-6" @submit.prevent="submitContact">
            <div>
              <label class="block text-sm text-gray-300 mb-2">您的姓名</label>
              <input v-model="contactForm.name" type="text" class="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white" placeholder="请输入您的姓名" />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">电子邮箱</label>
              <input v-model="contactForm.email" type="email" class="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white" placeholder="请输入您的邮箱" />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">留言内容</label>
              <textarea v-model="contactForm.message" rows="4" class="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white" placeholder="请告诉我们您的想法..."></textarea>
            </div>
            <button type="submit" :disabled="submitting" class="w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? '发送中...' : '发送留言' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <div class="fixed bottom-6 right-6 w-16 h-16 z-50">
      <button @click="aiChatVisible = true" class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-pulse-slow">
        <span class="text-2xl">🌍</span>
      </button>
    </div>

    <div v-if="aiChatVisible" class="fixed bottom-24 right-6 w-80 md:w-96 z-50 glass rounded-2xl p-6 glow-nebula">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold"><i class="fa fa-star text-cyan-400 mr-2"></i>星际AI 5.0</h3>
        <button @click="aiChatVisible = false" class="text-gray-400 hover:text-white"><i class="fa fa-times"></i></button>
      </div>
      <div ref="aiMessagesRef" class="h-64 overflow-y-auto mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div v-for="(msg, idx) in aiMessages" :key="idx" class="flex items-start gap-2 mb-2" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
          <i class="text-xs w-6 h-6 rounded-full flex items-center justify-center text-white"
            :class="msg.role === 'user' ? 'fa fa-user bg-purple-600' : 'fa fa-robot bg-cyan-600'"></i>
          <span class="inline-block px-3 py-2 rounded-lg text-sm"
            :class="msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'">
            {{ msg.text }}
          </span>
        </div>
      </div>
      <div class="flex gap-2">
        <input v-model="aiInputText" type="text" placeholder="输入消息..." class="flex-1 p-3 rounded-lg bg-gray-700 border border-purple-500/30 text-white text-sm" @keypress.enter="sendAiMessage" />
        <button @click="sendAiMessage" class="px-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg">发送</button>
      </div>
    </div>

    <footer class="relative py-12 z-10 border-t border-white/10 mt-20">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center space-x-2">
          <img style="width:120px" :src="siteConfig.logo_footer_url || '/login_logo2.png'" />
          <span class="font-bold text-4xl bg-gradient-to-r from-blue-400 to-cyan-400 text-gradient">{{ siteConfig.site_name || '星溯智能' }}</span>
        </div>
        <p class="text-gray-500 text-sm mt-4 md:mt-2">
          <a :href="siteConfig.footer_icp_link || 'https://beian.miit.gov.cn/'" target="_blank">工信部备案号： {{ siteConfig.footer_icp || '黔ICP备2024018724号-1' }}</a>
        </p>
        <p class="text-gray-500 text-sm mt-4 md:mt-0">{{ siteConfig.copyright || '© 2026 All Rights Reserved' }}</p>
      </div>
    </footer>
    </template>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import request from '@/utils/request'
import { getSiteConfig } from '@/api/siteConfig'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const navLinks = [
      { section: 'home', label: '首页' },
      { section: 'founder', label: '创始人' },
      { section: 'tech', label: '核心技术' },
      { section: 'ai-capability', label: '星际AI' },
      { section: 'metaphor', label: '意象解析' },
      { section: 'philosophy', label: '技术哲学' },
      { section: 'milestone', label: '探索里程碑' },
      { section: 'ecosystem', label: '跨生态' },
      { section: 'contact', label: '联系我们' }
    ]

    const mobileMenuOpen = ref(false)
    const aiChatVisible = ref(false)
    const loading = ref(true)
    const aiInputText = ref('')
    const aiMessagesRef = ref<HTMLElement | null>(null)
    const aiMessages = reactive([
      { role: 'ai', text: '你好，领航员。我是星溯AI 5.0，很高兴为你服务！' }
    ])

    const coreTechs = ref<any[]>([])
    const aiCapabilities = ref<any[]>([])
    const dashboardMetrics = ref<any[]>([])
    const metaphors = ref<any[]>([])
    const designIntent = ref<any>({})
    const philosophies = ref<any[]>([])
    const milestones = ref<any[]>([])
    const ecosystems = ref<any[]>([])
    const founders = ref<any[]>([])
    const aiReplyTemplates = ref<any[]>([])
    const contactInfo = ref<any[]>([])
    const siteConfig = ref<Record<string, string>>({})
    const banners = ref<any[]>([])
    const currentBanner = computed(() => banners.value[0] || {})

    const contactForm = reactive({ name: '', email: '', message: '' })
    const submitting = ref(false)

    const codeInput = ref('')
    const codeOutput = ref('点击左侧生成，AI会为你生成宇宙主题的代码哦~')

    const generateCode = () => {
      const input = codeInput.value.trim()
      if (!input) {
        codeOutput.value = '请输入你的需求哦，比如：帮我写一个计算行星轨道的函数~'
        return
      }
      let code = `// 星溯AI 5.0为你生成的宇宙主题代码
function calculatePlanetOrbit(mass, radius) {
    // 根据开普勒定律计算行星轨道周期
    const G = 6.67430e-11; // 引力常数
    const period = 2 * Math.PI * Math.sqrt(Math.pow(radius, 3) / (G * mass));

    console.log(\`行星轨道周期: \${period.toFixed(2)} 秒\`);
    return period;
}

// 测试：地球绕太阳的轨道
const sunMass = 1.989e30;
const earthRadius = 1.496e11;
calculatePlanetOrbit(sunMass, earthRadius);`

      if (input.includes('黑洞')) {
        code = `// 星溯AI 5.0为你生成的黑洞轨道代码
function blackHoleOrbit(mass, distance) {
    // 计算黑洞的史瓦西半径
    const G = 6.67430e-11;
    const c = 299792458;
    const schwarzschild = 2 * G * mass / Math.pow(c, 2);

    // 计算轨道速度
    const orbitSpeed = Math.sqrt(G * mass / distance);

    console.log(\`史瓦西半径: \${schwarzschild} m\`);
    console.log(\`轨道速度: \${orbitSpeed} m/s\`);
    return { schwarzschild, orbitSpeed };
}`
      } else if (input.includes('引力波')) {
        code = `// 星溯AI 5.0为你生成的引力波通信代码
function gravitationalWaveComm(data, distance) {
    // 模拟引力波通信的延迟计算
    const c = 299792458;
    const delay = distance / c;

    // 引力波信号编码
    const encoded = data.map(d => d * Math.sin(Date.now() * 0.001));

    console.log(\`通信延迟: \${delay.toFixed(2)} 秒\`);
    return encoded;
}`
      }
      codeOutput.value = code
    }

    let scene: any
    let camera: any
    let renderer: any
    let sphere: any
    let ring: any
    let ring2: any
    let animId = 0
    let tailwindEl: HTMLScriptElement | null = null
    let fontAwesomeEl: HTMLLinkElement | null = null
    let meteorTimer: ReturnType<typeof setInterval> | null = null

    const tailwindColorMap: Record<string, string> = {
      'orange-500': '#f97316', 'orange-400': '#fb923c', 'orange-600': '#ea580c',
      'red-500': '#ef4444', 'red-600': '#dc2626',
      'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb',
      'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4', 'cyan-600': '#0891b2',
      'indigo-500': '#6366f1', 'indigo-600': '#4f46e5',
      'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce',
      'violet-500': '#8b5cf6', 'violet-600': '#7c3aed',
      'pink-400': '#f472b6', 'pink-500': '#ec4899', 'pink-600': '#db2777',
      'rose-500': '#f43f5e', 'rose-600': '#e11d48',
      'teal-500': '#14b8a6', 'teal-600': '#0d9488',
      'emerald-500': '#10b981', 'emerald-600': '#059669',
      'yellow-500': '#eab308', 'yellow-600': '#ca8a04',
      'fuchsia-400': '#e879f9', 'fuchsia-500': '#d946ef', 'fuchsia-600': '#c026d3',
      'stardust-400': '#38bdf8', 'stardust-500': '#0ea5e9',
      'nebula-400': '#e879f9', 'nebula-500': '#d946ef'
    }

    const getColor = (colorName: string | undefined, fallback: string): string => {
      if (!colorName) return fallback
      return tailwindColorMap[colorName] || colorName
    }

    const loadCDN = () => {
      tailwindEl = document.createElement('script')
      tailwindEl.src = 'https://cdn.tailwindcss.com'
      document.head.appendChild(tailwindEl)

      fontAwesomeEl = document.createElement('link')
      fontAwesomeEl.rel = 'stylesheet'
      fontAwesomeEl.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'
      document.head.appendChild(fontAwesomeEl)
    }

    const removeCDN = () => {
      tailwindEl?.remove()
      fontAwesomeEl?.remove()
    }

    const initThree = () => {
      const canvas = document.getElementById('homepage-three-canvas') as HTMLCanvasElement
      if (!canvas) {
        console.warn('Three.js canvas not found')
        return
      }
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      const geometry = new THREE.SphereGeometry(5, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.5 })
      sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      const ringGeometry = new THREE.TorusGeometry(7, 0.05, 16, 100)
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.6 })
      ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      scene.add(ring)

      const ring2Geometry = new THREE.TorusGeometry(9, 0.05, 16, 100)
      const ring2Material = new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.4 })
      ring2 = new THREE.Mesh(ring2Geometry, ring2Material)
      ring2.rotation.x = Math.PI / 3
      scene.add(ring2)

      camera.position.z = 15

      const animate = () => {
        animId = requestAnimationFrame(animate)
        sphere.rotation.y += 0.001
        ring.rotation.z += 0.001
        ring2.rotation.z -= 0.0005
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)
      console.log('Three.js Earth initialized')
    }

    const fetchData = async () => {
      try {
        const [bannerRes, techRes, capRes, dashRes, metaRes, designRes, philRes, msRes, ecoRes, founderRes, replyRes, contactRes, siteConfigRes] = await Promise.all([
          request.get('/home-banner/list').catch(() => ({ data: [] })),
          request.get('/core-tech').catch(() => ({ data: [] })),
          request.get('/ai-capability').catch(() => ({ data: [] })),
          request.get('/ai-dashboard').catch(() => ({ data: [] })),
          request.get('/metaphor').catch(() => ({ data: [] })),
          request.get('/metaphor-design').catch(() => ({ data: {} })),
          request.get('/philosophy').catch(() => ({ data: [] })),
          request.get('/milestone').catch(() => ({ data: [] })),
          request.get('/ecosystem').catch(() => ({ data: [] })),
          request.get('/founder/list').catch(() => ({ data: [] })),
          request.get('/ai-reply-template').catch(() => ({ data: [] })),
          request.get('/contact-info').catch(() => ({ data: [] })),
          getSiteConfig().catch(() => ({ data: {} }))
        ])
        banners.value = (bannerRes.data || []).filter((b: any) => b.status === 1).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        coreTechs.value = techRes.data || []
        aiCapabilities.value = capRes.data || []
        dashboardMetrics.value = dashRes.data || []
        metaphors.value = metaRes.data || []
        designIntent.value = designRes.data || {}
        philosophies.value = philRes.data || []
        milestones.value = msRes.data || []
        ecosystems.value = ecoRes.data || []
        founders.value = (founderRes.data || []).filter((f: any) => f.status === 1)
        aiReplyTemplates.value = replyRes.data || []
        contactInfo.value = contactRes.data || []
        siteConfig.value = siteConfigRes.data || {}
      } catch {
        /* ignore */
      } finally {
        loading.value = false
      }
    }

    const scrollToSection = (section: string) => {
      const el = document.getElementById(section)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const handleBannerClick = (link: string) => {
      if (link.startsWith('#')) {
        scrollToSection(link.slice(1))
      } else if (link) {
        window.open(link, '_blank')
      }
    }

    const submitContact = async () => {
      if (!contactForm.name || !contactForm.message) {
        ElMessage.warning('请填写姓名和留言内容')
        return
      }
      submitting.value = true
      try {
        await request.post('/contact-message', {
          name: contactForm.name,
          email: contactForm.email,
          subject: '官网留言',
          message: contactForm.message
        })
        contactForm.name = ''
        contactForm.email = ''
        contactForm.message = ''
        ElMessage.success('消息已发送，感谢您的留言！')
      } catch {
        ElMessage.error('发送失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }

    const sendAiMessage = () => {
      const text = aiInputText.value.trim()
      if (!text) return
      aiMessages.push({ role: 'user', text })
      aiInputText.value = ''
      nextTick(() => {
        if (aiMessagesRef.value) aiMessagesRef.value.scrollTop = aiMessagesRef.value.scrollHeight
      })
      setTimeout(() => {
        let reply = '我是星溯AI 5.0，很高兴为你服务！'
        for (const tpl of aiReplyTemplates.value) {
          if (tpl.keyword && text.includes(tpl.keyword)) {
            reply = tpl.reply
            break
          }
        }
        if (!reply && aiReplyTemplates.value.length > 0) {
          const defaultTpl = aiReplyTemplates.value.find((t: any) => !t.keyword)
          if (defaultTpl) reply = defaultTpl.reply
        }
        aiMessages.push({ role: 'ai', text: reply })
        nextTick(() => {
          if (aiMessagesRef.value) aiMessagesRef.value.scrollTop = aiMessagesRef.value.scrollHeight
        })
      }, 800)
    }

    const onScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const navLinksEls = document.querySelectorAll('.nav-link')
      const rocket = document.getElementById('hp-rocket')
      let currentSection = 'home'
      sections.forEach((section) => {
        const el = section as HTMLElement
        if (window.scrollY >= el.offsetTop - 200) {
          currentSection = el.getAttribute('id') || 'home'
        }
      })
      navLinksEls.forEach((link) => {
        const section = link.getAttribute('data-section')
        if (section === currentSection) {
          link.classList.add('text-cyan-400', 'font-bold')
          if (rocket) {
            const linkRect = link.getBoundingClientRect()
            const navRect = link.parentElement!.getBoundingClientRect()
            rocket.style.left = linkRect.left - navRect.left + 'px'
            rocket.style.opacity = '1'
          }
        } else {
          link.classList.remove('text-cyan-400', 'font-bold')
        }
      })
    }

    const startMeteors = () => {
      meteorTimer = setInterval(() => {
        const container = document.querySelector('.fixed.inset-0.z-0.overflow-hidden')
        if (!container) return
        const meteor = document.createElement('div')
        meteor.className = 'meteor'
        meteor.style.top = Math.random() * 50 + '%'
        meteor.style.right = Math.random() * 100 + '%'
        container.appendChild(meteor)
        setTimeout(() => meteor.remove(), 3000)
      }, 2000)
    }

    const initSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          const href = a.getAttribute('href')
          if (href && href !== '#') {
            const target = document.querySelector(href)
            if (target) target.scrollIntoView({ behavior: 'smooth' })
          }
        })
      })
    }

    onMounted(() => {
      loadCDN()
      fetchData()
      setTimeout(() => {
        initThree()
        startMeteors()
        initSmoothScroll()
        window.addEventListener('scroll', onScroll)
      }, 100)
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(animId)
      renderer?.dispose()
      removeCDN()
      if (meteorTimer) clearInterval(meteorTimer)
      window.removeEventListener('scroll', onScroll)
    })

    return {
      navLinks,
      mobileMenuOpen,
      aiChatVisible,
      loading,
      aiInputText,
      aiMessagesRef,
      aiMessages,
      coreTechs,
      aiCapabilities,
      dashboardMetrics,
      metaphors,
      designIntent,
      philosophies,
      milestones,
      ecosystems,
      founders,
      aiReplyTemplates,
      contactInfo,
      siteConfig,
      banners,
      currentBanner,
      contactForm,
      submitting,
      submitContact,
      scrollToSection,
      handleBannerClick,
      sendAiMessage,
      getColor,
      codeInput,
      codeOutput,
      generateCode
    }
  }
})
</script>

<style scoped>
.homepage-root {
  font-family: 'Inter', system-ui, sans-serif;
  background: #111827;
  color: #fff;
  overflow-x: hidden;
  min-height: 100vh;
}
#homepage-three-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  opacity: 0.8;
  pointer-events: none;
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
.planet-sphere::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 15%;
  width: 30%;
  height: 20%;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.2);
  filter: blur(4px);
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes planet-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5), inset 0 0 30px rgba(99, 102, 241, 0.2); }
}
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>

<style>
.homepage-root .text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.homepage-root .bg-stars {
  background-image:
    radial-gradient(2px 2px at 20px 30px, #fff, transparent),
    radial-gradient(2px 2px at 60px 70px, #fff, transparent),
    radial-gradient(1px 1px at 50px 50px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, #fff, transparent),
    radial-gradient(2px 2px at 90px 10px, #fff, transparent);
  background-size: 200px 200px;
  animation: hp-parallax 20s ease-in-out infinite;
}
.homepage-root .glow-nebula {
  box-shadow: 0 0 80px rgba(139, 92, 246, 0.25);
}
.homepage-root .glass {
  background: rgba(15, 15, 30, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.homepage-root .planet-3d {
  transform-style: preserve-3d;
  perspective: 1200px;
}
.homepage-root .scan-line {
  position: relative;
}
.homepage-root .scan-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  animation: hp-scan 3s linear infinite;
}
.homepage-root .perspective-3d {
  perspective: 1000px;
}
.homepage-root .card-3d {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.homepage-root .card-3d:hover {
  transform: rotateX(5deg) rotateY(5deg) translateZ(20px);
  box-shadow: 0 20px 50px rgba(14, 165, 233, 0.3);
  border-color: rgba(14, 165, 233, 0.5);
}
.homepage-root .satellite {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #0ea5e9;
  border-radius: 50%;
  animation: hp-orbit 30s linear infinite;
}
.homepage-root .meteor {
  position: absolute;
  width: 2px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  animation: hp-meteor 3s linear infinite;
}
.homepage-root .animate-float {
  animation: hp-float 6s ease-in-out infinite;
}
.homepage-root .animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.homepage-root .animate-twinkle {
  animation: hp-twinkle 5s ease-in-out infinite;
}
.homepage-root .animate-spin-3d {
  animation: hp-spin3d 25s linear infinite;
}
.homepage-root .animate-nebula-flow {
  animation: hp-nebula 18s ease-in-out infinite alternate;
}
.homepage-root .animate-fade-in {
  animation: hp-fadeIn 1.2s ease-out forwards;
}

@keyframes hp-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes hp-twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
@keyframes hp-spin3d {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes hp-nebula {
  0% { transform: translateX(-20px) scale(1); }
  100% { transform: translateX(20px) scale(1.08); }
}
@keyframes hp-fadeIn {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes hp-scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes hp-parallax {
  0%, 100% { transform: translateZ(0px); }
  50% { transform: translateZ(50px); }
}
@keyframes hp-orbit {
  0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
}
@keyframes hp-meteor {
  0% { transform: translateX(0) translateY(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateX(-500px) translateY(500px); opacity: 0; }
}
</style>
