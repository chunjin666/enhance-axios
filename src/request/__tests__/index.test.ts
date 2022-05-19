import { clientError, serverError } from '../../api/error'
import { createGoods, deleteGoods, editGoods, goodsDetail, goodsList } from '../../api/goods'

async function testCreate() {
  return await createGoods({ goodsName: 'test', unitPrice: 2.33, count: 9999 })
}

async function testEdit() {
  return await editGoods({ id: '1', goodsName: 'test2', unitPrice: 2.33, count: 9999, shelf: true })
}

async function testDelete() {
  return await deleteGoods({ id: '1' })
}

async function testDetail() {
  return await goodsDetail({ id: '1' })
}

async function testList() {
  return await goodsList({ shelf: true })
}

async function testClientError() {
  return await clientError()
}

async function testServerError() {
  return await serverError()
}

test('post', async () => {
  await testCreate()
  expect(1).toBe(1)
})

test('put', async () => {
  await testEdit()
  expect(1).toBe(1)
})

test('delete', async () => {
  await testDelete()
  expect(1).toBe(1)
})

test('get', async () => {
  const res = await testDetail()
  expect(res).toHaveProperty('id')
})

test('get list', async () => {
  const res = await testList()
  expect(res.list.length).toBeGreaterThan(0)
})

test('client error', async () => {
  try {
    await testClientError()
  } catch (e) {
    expect(e).toBeInstanceOf(Error)
  }
})

test('server error', async () => {
  try {
    await testServerError()
  } catch (e) {
    expect(e).toBeInstanceOf(Error)
  }
})