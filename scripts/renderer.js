window.api.receive('fromMain', (data) => {
  console.log(`Received ${data} from main process`)
})

// Send a message to the main process
window.api.send('toMain', 'some data')
