import { defineStore } from 'pinia'
import { ref } from 'vue'

const authorizationStore = defineStore('authorization', () => {
  const isAuthorization = ref(false)

  function setAuthorization(value: boolean) {
    isAuthorization.value = value
  }

  return { isAuthorization, setAuthorization }
})

export default authorizationStore
