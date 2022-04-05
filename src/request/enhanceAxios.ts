import type {
  AxiosDefaults,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponseHeaders,
  AxiosStatic,
  CancelStatic,
  CancelTokenStatic,
} from 'axios'
import type { CustomRequestConfig, ServerResponseNormal } from './types'

export interface AxiosResponse<ServerResponse = any, ParamsData = any> {
  data: ServerResponse
  status: number
  statusText: string
  headers: AxiosResponseHeaders
  config: CustomRequestConfig<ParamsData>
  request?: any
}

export interface AxiosError<ServerResponse = any, RequestData = any> extends Error {
  config: CustomRequestConfig<RequestData>
  code?: string
  request?: any
  response?: AxiosResponse<ServerResponse | Blob | ArrayBuffer | string, RequestData>
  isAxiosError: boolean
  toJSON: () => object
}

/** 如果是特殊类型 `Blob | ArrayBuffer | string`，则不进行转换，否则包装到 `ServerResponseNormal<ResponseData>` 中 */
type GetServerResponse<ResponseData> = ResponseData extends Blob | ArrayBuffer | string ? ResponseData : ServerResponseNormal<ResponseData>

/**
 * 加强封装后的 `axios` 实例类型定义
 */
export interface AxiosEnhanced<ServerResponse = any> {
  new (config?: CustomRequestConfig): AxiosEnhanced<ServerResponse>
  defaults: AxiosDefaults
  interceptors: {
    request: AxiosInterceptorManager<CustomRequestConfig<any>>
    response: AxiosInterceptorManager<AxiosResponse<ServerResponse | Blob | ArrayBuffer | string, any>>
  }
  getUri(config?: CustomRequestConfig): string
  request<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    config: Config
  ): Promise<ResponseData>
  request<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    config: Config
  ): Promise<GetServerResponse<ResponseData>>

  get<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    config?: Config
  ): Promise<ResponseData>
  get<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  delete<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    config?: Config
  ): Promise<ResponseData>
  delete<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  head<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    config?: Config
  ): Promise<ResponseData>
  head<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  options<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    config?: Config
  ): Promise<ResponseData>
  options<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  post<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<ResponseData>
  post<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  put<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<ResponseData>
  put<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  patch<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, never | true>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<ResponseData>
  patch<ResponseData = any, ParamsData = any, Config = CustomRequestConfig<ParamsData, false>>(
    url: string,
    data?: ParamsData,
    config?: Config
  ): Promise<GetServerResponse<ResponseData>>

  // ------------------------------ 以下为自定义方法 ------------------------------
  // 使用时需要定义参数和返回值类型，并根据 `onlyResponseExtractedData` 参数对返回数据进行处理和类型转换
  // `onlyResponseExtractedData` 参数值不同，返回类型不同是通过方法重载实现的
  // ------------------------------ 以下为自定义方法 ------------------------------

  getWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<Params, never | true>>(
    url: string,
    configDefault?: Config
  ): (params?: Params, config?: Config) => Promise<ResponseData>
  getWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<Params, false>>(
    url: string,
    configDefault?: Config
  ): (params?: Params, config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  deleteWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<Params, never | true>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ResponseData>
  deleteWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<Params, false>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  headWrap<ResponseData = any, Config = CustomRequestConfig<any, never | true>>(
    url: string,
    config?: Config
  ): (config?: Config) => Promise<ResponseData>
  headWrap<ResponseData = any, Config = CustomRequestConfig<any, false>>(
    url: string,
    config?: Config
  ): (config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  optionsWrap<ResponseData = any, Config = CustomRequestConfig<any, never | true>>(
    url: string,
    config?: Config
  ): (config?: Config) => Promise<ResponseData>
  optionsWrap<ResponseData = any, Config = CustomRequestConfig<any, false>>(
    url: string,
    config?: Config
  ): (config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  postWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, never | true>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ResponseData>
  postWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, false>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  putWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, never | true>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ResponseData>
  putWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, false>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ServerResponseNormal<ResponseData>>

  patchWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, never | true>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ResponseData>
  patchWrap<Params = any, ResponseData = any, Config = CustomRequestConfig<any, false>>(
    url: string,
    config?: Config
  ): (params?: Params, config?: Config) => Promise<ServerResponseNormal<ResponseData>>
}

export interface AxiosInstanceEnhanced<ServerResponse = any> extends AxiosEnhanced<ServerResponse> {
  (config: AxiosRequestConfig): AxiosPromise
  (url: string, config?: AxiosRequestConfig): AxiosPromise
}

export interface AxiosStaticEnhanced<ServerResponse = any> extends AxiosInstanceEnhanced<ServerResponse> {
  create(config?: CustomRequestConfig<any>): AxiosInstanceEnhanced<ServerResponse>
  Cancel: CancelStatic
  CancelToken: CancelTokenStatic
  Axios: AxiosEnhanced
  readonly VERSION: string
  isCancel(value: any): boolean
  all<T>(values: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
  isAxiosError(payload: any): payload is AxiosError
}

export function enhanceAxios<ServerResponse = any>(axios: AxiosStatic): AxiosStaticEnhanced<ServerResponse> {
  const axiosProto = (axios as any).Axios.prototype as AxiosInstanceEnhanced<any>

  axiosProto.getWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (params?: any, config?: CustomRequestConfig<any>) => this.get(url, Object.assign({ ..._config }, config, { params })) as any
  }
  axiosProto.deleteWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (params?: any, config?: CustomRequestConfig<any>) => this.delete(url, Object.assign({ ..._config }, config, { params })) as any
  }
  axiosProto.headWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (config?: CustomRequestConfig<any>) => this.head(url, Object.assign({ ..._config }, config)) as any
  }
  axiosProto.optionsWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (config?: CustomRequestConfig<any>) => this.options(url, Object.assign({ ..._config }, config)) as any
  }
  axiosProto.postWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (data?: any, config?: CustomRequestConfig<any>) => this.post(url, data, Object.assign({ ..._config }, config)) as any
  }
  axiosProto.putWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (data?: any, config?: CustomRequestConfig<any>) => this.put(url, data, Object.assign({ ..._config }, config)) as any
  }
  axiosProto.patchWrap = function (url: string, config?: AxiosRequestConfig) {
    const _config = config
    return (data?: any, config?: CustomRequestConfig<any>) => this.patch(url, data, Object.assign({ ..._config }, config)) as any
  }
  return axios as AxiosStaticEnhanced<ServerResponse>
}
