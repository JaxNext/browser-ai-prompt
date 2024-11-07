let session = null
async function checkUsability() {
  let obj = {
    available: false,
    apiPath: '',
    createFuncName: '',
  }
  if (ai?.languageModel?.capabilities) {
    const res = await ai.languageModel?.capabilities()
    obj.available = res?.available === 'readily'
    obj.apiPath = ['ai', 'languageModel']
    obj.createFuncName = 'create'
    console.log('ai.languageModel', res)
  } else if (ai?.assistant?.capabilities) {
    const res = await ai.assistant.capabilities()
    obj.available = res?.available === 'readily'
    obj.apiPath = ['ai', 'assistant']
    obj.createFuncName = 'create'
    console.log('ai.assistant', res)
  }
  return obj
}
export async function genSession(params) {
  const { available, apiPath, createFuncName } = await checkUsability()
  if (!available) throw new Error(`当前浏览器不支持 ${apiPath}`)
  let apiRoot = window
  for (let i = 0; i < apiPath.length; i++) {
    const path = apiPath[i]
    apiRoot = apiRoot[path]
  }
  return await apiRoot[createFuncName](params)
}
export async function promptStreaming(text) {
  session = session || (await genSession())

  const stream = await session.promptStreaming(text)
  return stream
}

export const checkPromptUsability = checkUsability
