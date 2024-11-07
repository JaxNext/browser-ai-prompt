import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ChatRoom from './components/ChatRoom.vue'
import NotSupportTip from './components/NotSupportTip.vue'
import AppList from './components/AppList.vue'
import Prompt from './components/Prompt.vue'
import { checkPromptUsability } from './prompt'

declare global {
  interface Window {
    ai: any;
  }
}
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: AppList },
    { path: '/not-support', component: NotSupportTip },
    { path: '/app-list', component: AppList },
    { path: '/chat-bot', component: ChatRoom },
    { path: '/prompt', component: Prompt },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/not-support') {
    next()
    return
  }
  const checkRes = await checkPromptUsability()
  const isSupport = checkRes?.available
  
  if (!isSupport) {
    next('/not-support')
  } else {
    next()
  }
})

createApp(App).use(router).mount('#app')
