import { ServerResponseNormal } from './types'
import type { AxiosError } from './enhanceAxios'
import axios from 'axios'
import { enhanceAxios } from './enhanceAxios'
import { createError, handleError } from './handleError'
import { BaseURL } from './config'
import { getResponseData, replaceUrlParams, ResponseValidatorMap } from './utils'

const request = enhanceAxios<ServerResponseNormal<any>>(axios).create({
  baseURL: BaseURL,
  handleError: true,
  showLoading: true,
  extractResponse: true,
})

request.interceptors.request.use((config) => {
  console.log(`[NET][${config.method?.toUpperCase()}] >>>`, config.url, config.params)
  replaceUrlParams(config)
  if (config.showLoading) {
    console.log('loading start ...')
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    console.log(
      `[NET][${response.config.method?.toUpperCase()}][${response.status}] %c<<<`,
      'color: green;',
      response.config.url,
      response.data
    )
    if (response.config.showLoading) {
      console.log('loading end ~~~')
    }

    if (Object.keys(ResponseValidatorMap).includes(response.config.responseType || '')) {
      const errorMsg = ResponseValidatorMap[response.config.responseType || ''](response)
      if (errorMsg) return handleError(createError(response), errorMsg, !!response.config.handleError)
      return getResponseData(response)
    }

    if ((response.data as ServerResponseNormal<any>)?.code !== 0) {
      return handleError(
        createError(response),
        (response.data as ServerResponseNormal<any>)?.msg || '其他错误',
        !!response.config.handleError
      )
    }

    return getResponseData(response)
  },
  (error: AxiosError<ServerResponseNormal, any>) => {
    console.log(
      `[NET][${error.config.method?.toUpperCase()}][${error.response?.data}] %c<<<`,
      'color: red;',
      error.config.url,
      error.response?.data
    )
    if (error.config.showLoading) {
      console.log('loading end ~~~')
    }
    return handleError(error, '', !!error.config.handleError)
  }
)

export default request
