import type { AxiosResponse } from './enhanceAxios'
import { CustomRequestConfig, ServerResponseNormal } from "./types"

/**
 * 替换 url 中的动态路径：
 *
 * `{ url: '/order/{id}', params: { id: 123 } }`
 *
 * `{ url: '/order/{id}', data: { id: 123 } }`
 *
 * ==>
 *
 * `{ url: '/order/123', ... }`
 *
 * @param options
 */
export function replaceUrlParams(options: CustomRequestConfig): void {
  options.url = options.url?.replace(/({\w+})/g, function (substring: string) {
    const key = substring.replace(/[{}]/g, '')
    let value = options.params?.[key]
    if (value != null) {
      delete options.params[key]
      return value
    }
    value = options.data?.[key]
    if (value != null) {
      delete options.data[key]
      return value
    }
  })
}

export function getResponseData(
  response: AxiosResponse<ServerResponseNormal<any> | Blob | ArrayBuffer | string, any>
): Blob | ArrayBuffer | string | any | typeof response {
  if (response.config.extractResponse) {
    if (['text', 'blob', 'arraybuffer'].includes(response.config.responseType || '')) return response.data
    return (response.data as ServerResponseNormal<any>).data
  } else {
    return response
  }
}

export const ResponseValidatorMap: Record<
  'text' | 'blob' | 'arraybuffer',
  (response: AxiosResponse<ServerResponseNormal<any> | Blob | ArrayBuffer | string, any>) => string | undefined
> = {
  text: (response) => (typeof response.data === 'string' ? undefined : '返回数据类型错误'),
  blob: (response) => (response.data instanceof Blob ? undefined : '返回数据类型错误'),
  arraybuffer: (response) => (response.data instanceof ArrayBuffer ? undefined : '返回数据类型错误'),
}
