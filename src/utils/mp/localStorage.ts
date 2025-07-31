const suffix = '--hongshanpintu_desktop'

export const setStorageSync = (key, data, expires?) => {
  const myKey = key + suffix
  if (expires !== undefined) { // expires多少秒后失效
    expires = new Date().getTime() + expires * 1000
  }
  return localStorage.setItem(myKey, JSON.stringify({ data, expires }))
}

export const getStorageSync = (key) => {
  const myKey = key + suffix
  let item: any = localStorage.getItem(myKey)
  if (!item) return ''
  item = JSON.parse(item)
  let { data, expires } = item
  if (expires !== undefined && new Date().getTime() - expires >= 0) {
    removeStorageSync(key)
    data = getStorageSync(key)
  }
  return data
}

export const removeStorageSync = (key) => {
  const myKey = key + suffix
  return localStorage.removeItem(myKey)
}

export const clearStorageSync = () => {
  return localStorage.clear()
}
