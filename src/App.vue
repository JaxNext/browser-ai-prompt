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

function detectSupport() {
  return window?.ai?.createTextSession
}

onMounted(() => {
  isSuport.value = detectSupport()
})
</script>

<style scoped>

</style>