export default function formatDate (date){
  const timezoneOffset = date.getTimezoneOffset() * 60000
  const adjustedDate = new Date(date.getTime() - timezoneOffset)
  return adjustedDate.toISOString().split('T')[0]
}