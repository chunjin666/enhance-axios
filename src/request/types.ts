import type { AxiosRequestConfig } from 'axios'

export interface CustomRequestConfig<RequestData = any, ExtractResponse extends boolean = boolean> extends AxiosRequestConfig<RequestData> {
  /** 是否使用统一错误处理 */
  handleError?: boolean
  /** 是否显示 loading 状态 */
  showLoading?: boolean
  /** 是否只返回提取过的数据 */
  extract?: ExtractResponse
}

/**
 * 服务器端API统一数据格式
 *
 * TODO 根据实际情况修改
 */
export interface ServerResponseNormal<Data = any> {
  /** 状态码，0：正常 */
  code: number
  data: Data
  /** 错误信息 */
  msg: string
}

/** 分页查询参数 */
export interface PaginationParams {
  page?: number
  size?: number
}

/** 列表数据统一数据结构 */
export interface PaginationData<Item extends any = any> {
  page: number
  size: number
  total: number
  totalPage: number
  list: Item[]
}
