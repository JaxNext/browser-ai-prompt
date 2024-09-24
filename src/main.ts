import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ChatRoom from './components/ChatRoom.vue'
import NotSupportTip from './components/NotSupportTip.vue'
import AppList from './components/AppList.vue'
import Prompt from './components/Prompt.vue'
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

// const productionPathPrefix = '/chrome-ai-ui/'
router.beforeEach(async (to, from, next) => {
  console.log('from', from)
  // if in production, remove prefix
  // if (import.meta.env.PROD) {
  //   to.path = to.path.replace(productionPathPrefix, '/')
  // }

  if (to.path === '/not-support') {
    next()
    return
  }
  const isSupport = await detectSupport()
  
  if (!isSupport) {
    next('/not-support')
  } else {
    next()
  }
})

async function detectSupport() {
  const ai = window?.ai
  const assistant = await ai?.assistant
  const capabilities = await assistant?.capabilities()
  return capabilities?.available === 'readily'
}

createApp(App).use(router).mount('#app')
