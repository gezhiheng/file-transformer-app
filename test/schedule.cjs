const { scheduleJob } = require('node-schedule')

let task
for (let i = 0; i < 10; i++) {
   task = scheduleJob('0 5 0 ? * *', () => {
  })
}
