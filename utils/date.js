let monment = require('../lib/moment.min.js')


export function formatYYYY(date) {
  return monment(date).format('YYYY-MM-DD')
}


export function formatYYYYSS(date) {
  return monment(date).format('YYYY-MM-DD HH:mm:ss')
}


export function formatHHMM(date) {
  return monment(date).format('HH:mm')
}