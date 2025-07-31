export const setClipboardData = async (options: any = {}) => {
  const val = options.data || ''
  try {
    await navigator.clipboard.writeText(val)
  } catch (error) {
    console.log('navigator.clipboard.writeText - error：', error)
    const input = document.createElement('textarea')
    input.value = val
    document.body.appendChild(input)
    input.select && input.select() // Android
    input.setSelectionRange && input.setSelectionRange(0, val.length) // IOS
    document.execCommand('Copy')
    document.body.removeChild(input)
  }
}

export const getClipboardData = async () => {
  try {
    return await navigator.clipboard.readText()
  } catch (error) {
    console.log('navigator.clipboard.readText - error：', error)
    return ''
  }
}
