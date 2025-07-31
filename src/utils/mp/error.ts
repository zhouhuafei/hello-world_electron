export const setErrorInfo = (options: any = {}) => {
  return {
    date: Date.now(),
    error: {
      errMsg: undefined,
      errCode: undefined,
      errno: undefined,
      ...options.error
    },
    customError: {
      errMsg: undefined,
      errCode: undefined,
      ...options.customError
    }
  }
}

export const getErrorInfo = async (mayBePromiseError) => {
  const error = await getError(mayBePromiseError) || new Error('未知错误')
  const errorInfo: any = {
    date: Date.now(),
    error: {
      errMsg: await getErrorMessage(error),
      errCode: undefined,
      errno: undefined,
      stack: error.stack
    }
  }
  if (error.errCode) {
    errorInfo.error.errCode = error.errCode
  }
  if (error.errno) {
    errorInfo.error.errCode = error.errno
  }
  if (error.customError) {
    errorInfo.customError = error.customError
  }
  return errorInfo
}

export const getError = async (mayBePromiseError) => {
  let error
  try {
    error = await mayBePromiseError
  } catch (catchPromiseErrorResult) {
    error = catchPromiseErrorResult
  }
  return error || new Error('未知错误')
}

export const getErrorMessage = async (mayBePromiseError = {}) => {
  const error = await getError(mayBePromiseError) || new Error('未知错误')
  let errMsg
  if (error.customError && error.customError.errMsg) {
    errMsg = error.customError.errMsg
  } else if (error.errMsg) {
    errMsg = error.errMsg
  } else if (error.message) {
    errMsg = error.message
  } else {
    errMsg = error
  }
  return errMsg
}
