<template>
  <div @keyup.enter="send">
    <h2>What does the <input v-model="userPrompt" class="animal-name" /> say?</h2>
    
    <h1>{{ answer }}</h1>

    <div class="token-counter">
      <span class="token-counter-item">Max: {{ tokenMax }}</span>
      <span class="token-counter-item">Used: {{ tokenUsed }}</span>
      <span class="token-counter-item">Left: {{ tokenLeft }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { promptStreaming, genSession } from '../prompt'

const userPrompt = ref('')
const answer = ref('')
const session = ref<any>(null)
const tokenMax = ref(0)
const tokenUsed = ref(0)
const tokenLeft = ref(0)

async function send() {
  if (!userPrompt.value) return
  if (!session.value) {
    await createSession()
  }
  const stream = await promptStreaming(userPrompt.value)
  answer.value = ''
  for await (const chunk of stream) {
    answer.value += chunk
  }
  countToken()
}

async function createSession() {
  session.value = await genSession({
    initialPrompts: [
      {
        role: 'system',
        content: 'You are a animal expert, user will give you a name of animal, you return the sound of the animal. If the name is not an animal, you return "go away". Return less than 3 words.'
      },
      {
        role: 'user',
        content: 'dog'
      },
      {
        role: 'assistant',
        content: 'woof',
      },
      {
        role: 'user',
        content: 'table'
      },
      {
        role: 'assistant',
        content: 'go away',
      }
    ],
  })
}

async function countToken() {
  tokenMax.value = session.value?.maxTokens
  tokenUsed.value = session.value?.tokensSoFar
  tokenLeft.value = session.value?.tokensLeft
}
</script>
<style scoped>
.animal-name {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.token-counter {
  display: flex;
  gap: 10px;
  justify-content: center;
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>