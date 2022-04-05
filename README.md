# enhance-axios

#### 介绍

`enhance-axios` 提供一种使用 `typescript` 对 `axios` 进行二次封装的方案。

本方案有以下特点：

- 封装后不改变 `axios` 本身提供的使用方式
- 基于 `typescript` ，增强了 `axios` 在使用过程中的类型的支持的完善度，并最大程度发挥 `typescript` 的类型推断能力，让使用者
- 新增了 `getWrap` / `postWrap` / `putWrap` / `deleteWrap` / `patchWrap` 等封装 API 的方法，使用非常简单，并保留了调用封装后函数后设置 config 的类型提示能力
- 新增了以下配置项：
  - **handleError**：是否统一处理错误，默认为 `true`。具体的错误处理方式需要根据自身业务需求完善。
  - **showLoading**：是否显示 loading 状态，默认为 `true`。具体的显示方式需要根据自身业务需求完善。
  - **extract**：返回的数据是否进行提取处理，默认为 `true`。具体的提取方式需要根据后端接口格式修改。
- 添加了常见错误情况的处理。

### 代码目录及文件说明

```text
src
├── api
│   ├── error.ts        // 模拟错误接口
│   └── goods.ts        // 商品接口
├── example.ts          // 用法示例
├── index.ts
├── request             // axios 封装
│   ├── config.ts       // 配置
│   ├── enhanceAxios.ts // 封装 axios 对象
│   ├── handleError.ts  // 错误处理
│   ├── index.ts        // request入口
│   ├── types.ts        // 类型定义
│   └── utils.ts        // 工具方法
└── test
    └── index.ts        // 测试代码
```

### 使用说明

#### 常规使用

```ts
// 常规使用1：默认返回提取过的数据
request.get<TestResponse>('/api/test').then((res) => {
  console.log(res.a)
})
// 常规使用2：返回服务器端原始数据
request.get<TestResponse>('/api/test', { extract: false }).then((res) => {
  console.log(res.data.a)
})
```

#### 封装API使用

```ts
const params = { b: 1 }
// 封装1：默认返回提取过的数据
const getMethod1 = request.getWrap<TestParams, TestResponse>('/api/test')
// 使用
getMethod1(params).then((res) => {
  console.log(res.a)
})
// 封装2：封装为返回服务器端原始数据
const getMethod2 = request.getWrap<TestParams, TestResponse>('/api/test', { extract: false })
// 使用
getMethod2(params).then((res) => {
  console.log(res.data.a)
})

// 封装3：封装为默认返回提取过的数据
const getMethod3 = request.getWrap<TestParams, TestResponse>('/api/test')
// 使用时设置返回服务器端原始数据
getMethod3(params, {
  extract: true,
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
getMethod6(params).catch((err: AxiosError) => {
  console.log(err)
})
```

### 开发调试

1. 使用 `npm run dev` 命令可以即时编译 ts 文件。
2. 使用 `npm run test` 命令可以运行测试代码。
