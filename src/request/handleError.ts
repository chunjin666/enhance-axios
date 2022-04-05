import type { AxiosResponse, AxiosError } from './enhanceAxios'
import { ServerResponseNormal } from "./types"

const ChineseCharactersRegExp = /[\u4e00-\u9fa5]/

const HttpStatusCodeToErrorMsg = {
  400: '请求错误',
  401: '登录过期，请重新登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  409: '服务器处理请求时遇到冲突',
  410: '请求的资源不见了',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持',
}

function resolveErrorMsgFromAxiosError(error: AxiosError<ServerResponseNormal<any>, any>): string {
  if (error.message === 'Network Error') {
    return '网络错误'
  } else if (error.message.startsWith('timeout of')) {
    return '请求超时'
  } else if (error.response) {
    let msg = (error.response.data as ServerResponseNormal<any>)?.msg
    if (typeof msg === 'string' && msg.length > 0 && msg.match(ChineseCharactersRegExp)) return msg

    msg = HttpStatusCodeToErrorMsg[error.response.status]
    if (msg) return msg
    if (error.response.status >= 500) return '服务器错误'
    return '其他错误'
  }

  return '未知错误'
}

export function createError(
  response: AxiosResponse
): AxiosError {
  const error = new Error() as AxiosError
  error.config = response.config
  error.response = response
  error.request = response.request
  error.isAxiosError = true
  error.toJSON = () => ({
    // Standard
    message: error.message,
    name: error.name,
    // Microsoft
    description: (error as any).description,
    number: (error as any).number,
    // Mozilla
    fileName: (error as any).fileName,
    lineNumber: (error as any).lineNumber,
    columnNumber: (error as any).columnNumber,
    stack: error.stack,
    // Axios
    config: error.config,
    code: error.code,
    status: error.response?.status,
  })
  return error
}

export function handleError(
  error: AxiosError<ServerResponseNormal<any>, any>,
  msg?: string,
  handleError?: boolean
): Promise<never> {
  if (!msg) {
    msg = resolveErrorMsgFromAxiosError(error)
  }
  error.message = msg

  if (handleError) {
    // TODO
    console.log('error handled', error.response?.status, error.message)
  }
  return Promise.reject(error)
}
