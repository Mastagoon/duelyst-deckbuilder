const timePassedFormat = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  )
  if (!diffInMinutes) return `just now.`
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago.`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago.`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago.`
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  const diffInYears = Math.floor(diffInMonths)
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
}

export default timePassedFormat
