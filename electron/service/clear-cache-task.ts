import { scheduleJob } from 'node-schedule'
import { getTodayDate, clearCache } from '../utils'

let isFirstRun = true

function runClearCacheTask() {
  if (isFirstRun) {
    let task = scheduleJob('5 0 * * *', () => {
      const executionDate = getTodayDate('')
      clearCache(executionDate)
    }).invoke()
  }
}

export default runClearCacheTask
