import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('badgeNum', () => {
  const badgeNum = ref(0)
  // 获取和修改
  const setBadgeNum = (num: number) => (badgeNum.value = num)

  return { badgeNum,setBadgeNum }
})
