<template>
  <div class="room-wrapper" @keyup.enter="send">
    <div class="chat-box orange-border">
      <div
        v-for="(item, index) in chatList"
        :key="index"
        :class="['chat-row', {'mine': item.mine}]">
        <div class="chat-item">{{ item.content }}</div>
      </div>
    </div>
    <textarea v-model="input" class="input-area orange-border"></textarea>
    <button class="send-btn" @click="send">发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { promptStreaming } from '../prompt'
interface ChatItem {
  content: string
  mine: boolean
}
const input = ref('')
const chatList = useStorage('ai_api_text_history', [] as ChatItem[] )

async function sendToLLM(text: string) {
  if (!text) return
  const stream = await promptStreaming(text)
  chatList.value.unshift({
    content: '',
    mine: false,
  })
  for await (const chunk of stream) {
    chatList.value[0].content = chunk
  }
}
function send() {
  if (!input.value) return
  chatList.value.unshift({
    content: input.value,
    mine: true,
  })
  sendToLLM(input.value)
  input.value = ''
}
</script>

<style scoped>
.room-wrapper {
  width: 600px;
  height: 100vh;
  background-color: rgba(127, 255, 212, 0.3);
  box-shadow: 0 0 100px 100px rgba(127, 255, 212, 0.3);
  background-image: none;
  color: #000;
}
.chat-box {
  width: 100%;
  height: 60vh;
  margin: 18px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: none;
  display: flex;
  flex-direction: column-reverse;
  .chat-item {
    padding: 4px 8px;
    background-color: skyblue;
    border-radius: 8px;
    width: fit-content;
  }
  .chat-row {
    margin: 16px;
    display: flex;
    justify-content: flex-start;
    text-align: left;
    padding-right: 40px;
    &.mine {
      justify-content: flex-end;
      padding-right: 0;
      padding-left: 40px;
      .chat-item {
        background-color: orange;
      }
    }
  }
}
.orange-border {
  border: 4px solid skyblue;
  border-radius: 20px;
}
.input-area {
  width: 100%;
  height: 25%;
  resize: none;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 12px;
  background-color: transparent;
  &:focus {
    outline: none;
  }
}
.send-btn {
  background-color: skyblue;
  margin-top: 8px;
  float: right;
  padding: 4px 8px;
  border-radius: 4px;
  color: #000;
}
</style>