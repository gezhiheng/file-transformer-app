function getYesterdayDate(connect) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const year = yesterday.getFullYear()
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0') // 补齐前导零
  return `${year}${connect}${month}${connect}${day}`
}

module.exports = {
  getYesterdayDate,
}
