function getYesterdayDate(connect) {
  return getDate(connect, 'yesterday')
}

function getTodayDate(connect) {
  return getDate(connect, 'today')
}

function getDate(connect, flag) {
  const today = new Date()
  let year
  let month
  let day
  if (flag === 'today') {
    year = today.getFullYear()
    month = String(today.getMonth() + 1).padStart(2, '0')
    day = String(today.getDate()).padStart(2, '0') // 补齐前导零
  } else {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    year = yesterday.getFullYear()
    month = String(yesterday.getMonth() + 1).padStart(2, '0')
    day = String(yesterday.getDate()).padStart(2, '0') // 补齐前导零
  }
  return `${year}${connect}${month}${connect}${day}`
}

export { getYesterdayDate, getTodayDate }
