import { AxiosError } from './request/enhanceAxios'
import request from './request/index'

/**
 * 接口参数类型
 */
interface TestParams {
  b: number
}

/** 接口返回值类型 */
interface TestResponse {
  a: string
}

// ------------------------------ 常规使用 ------------------------------

// 常规使用1：默认返回提取过的数据
request.get<TestResponse>('/api/test').then((res) => {
  console.log(res.a)
})
// 常规使用2：返回服务器端原始数据
request.get<TestResponse>('/api/test', { extractResponse: false }).then((res) => {
  console.log(res.data.a)
})

// ------------------------------ 先封装再使用 ------------------------------

const params = { b: 1 }
// 封装1：默认返回提取过的数据
const getMethod1 = request.getWrap<TestParams, TestResponse>('/api/test')
// 使用
getMethod1(params).then((res) => {
  console.log(res.a)
})
// 封装2：封装为返回服务器端原始数据
const getMethod2 = request.getWrap<TestParams, TestResponse>('/api/test', { extractResponse: false })
// 使用
getMethod2(params).then((res) => {
  console.log(res.data.a)
})

// 封装3：封装为默认返回提取过的数据
const getMethod3 = request.getWrap<TestParams, TestResponse>('/api/test')
// 使用时设置返回服务器端原始数据
getMethod3(params, {
  extractResponse: true,
}).then((res) => {
  console.log(res.a)
})

// 封装4：封装 POST 请求
const postMethod4 = request.postWrap<TestParams, TestResponse>('/api/test')
// 使用
postMethod4(params).then((res) => {
  console.log(res.a)
})

// 封装5：封装 url参数
const getMethod5 = request.getWrap<TestParams & { id: string }, TestResponse>('/api/test/{id}')
// 使用
getMethod5({ id: '1', b: 1 }).then((res) => {
  console.log(res.a)
})

// 封装6：不统一处理错误，由调用者处理。以及其他参数设置
const getMethod6 = request.getWrap<TestParams, TestResponse>('/api/test', { handleError: false, showLoading: false })
// 使用
getMethod6(params).then((res) => {
  console.log(res.a)
}).catch((err: AxiosError) => {
  console.log(err)
})
