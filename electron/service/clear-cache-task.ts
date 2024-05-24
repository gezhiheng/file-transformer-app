import { scheduleJob } from 'node-schedule'
import { getTodayDate, clearCache } from '../utils'

function runClearCacheTask() {
  scheduleJob('5 0 * * *', () => {
    const executionDate = getTodayDate('')
    clearCache(executionDate)
  }).invoke()
}

export default runClearCacheTask
