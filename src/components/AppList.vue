<script setup lang="ts">
const appList = [
  {
    id: 'chat-bot',
    name: '聊天机器人',
  },
  {
    id: 'prompt',
    name: '提示词 API',
  },
]
</script>
<template>
  <div class="grid-box">
    <div
      v-for="app in appList"
      :key="app.id"
      class="app-cell">
      <router-link :to="`/${app.id}`">{{ app.name }}</router-link>
    </div>
  </div>
</template>
<style scoped>
.grid-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  padding: 10px;
}
.app-cell {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px;
  cursor: pointer;
  height: fit-content;
}
</style>
