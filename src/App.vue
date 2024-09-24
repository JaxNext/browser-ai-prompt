<template>
  <NotSupportTip v-if="!isSuport" />
  <ChatRoom v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotSupportTip from './components/NotSupportTip.vue'
import ChatRoom from './components/ChatRoom.vue'
declare global {
  interface Window {
    ai: any;
  }
}
const isSuport = ref(false)

async function detectSupport() {
  const ai = window?.ai
  const assistant = await ai?.assistant
  const capabilities = await assistant?.capabilities()
  return capabilities?.available === 'readily'
}

onMounted(async () => {
  isSuport.value = await detectSupport()
})
</script>

<style scoped>

</style>