import { clientError, serverError } from '../api/error'
import { createGoods, deleteGoods, editGoods, goodsDetail, goodsList } from '../api/goods'

async function testCreate() {
  await createGoods({ goodsName: 'test', unitPrice: 2.33, count: 9999 })
  console.log('createGoods ok')
}

async function testEdit() {
  await editGoods({ id: '1', goodsName: 'test2', unitPrice: 2.33, count: 9999, shelf: true })
  console.log('editGoods ok')
}

async function testDelete() {
  await deleteGoods({ id: '1' })
  console.log('deleteGoods ok')
}

async function testDetail() {
  const detail = await goodsDetail({ id: '1' })
  console.log('goodsDetail ok', detail)
}

async function testList() {
  const res = await goodsList({ shelf: true })
  console.log('goodsList ok', res)
}

async function testClientError() {
  await clientError()
}

async function testServerError() {
  await serverError()
}

async function test() {
  await testCreate()
  await testEdit()
  await testDelete()
  await testDetail()
  await testList()
  await testClientError().catch(() => {})
  await testServerError().catch(() => {})
}

export default test
