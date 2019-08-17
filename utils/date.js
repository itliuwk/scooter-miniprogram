let moment = require('../lib/moment.min.js')


export function formatYYYY(date) {
  return moment(date).format('YYYY-MM-DD')
}


export function formatYYYYSS(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}


export function formatHHMM(date) {
  console.log(date)
  return moment(date).format('HH:mm')
}


export function formatValue(date) {
  return moment(date).valueOf(); // 
}