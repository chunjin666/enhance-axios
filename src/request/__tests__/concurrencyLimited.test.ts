import request from '../index'
import { concurrencyLimited } from '../concurrencyLimited'
import { successRequest, failRequest, noop, successOrFailRequest } from './utils'
import axios from 'axios'

test('concurrencyLimited will success', () => {
  const request = concurrencyLimited(successRequest, 5)
  const p1 = request(1)
  const t = Date.now()
  p1.then((result) => {
    expect(result).toBe(1)
    const spend = Date.now() - t
    expect(spend).toBeGreaterThanOrEqual(16)
  })
})

test('concurrencyLimited will fail', () => {
  const request = concurrencyLimited(failRequest, 5)
  const p1 = request(1)
  const t = Date.now()
  p1.catch((err) => {
    expect(err).toBe(1)
    const spend = Date.now() - t
    expect(spend).toBeGreaterThanOrEqual(16)
  })
})

test('concurrencyLimited success limit', () => {
  const request = concurrencyLimited(successRequest, 5)
  const p1 = request(1)
  const p2 = request(2)
  const p3 = request(3)
  const p4 = request(4)
  const p5 = request(5)
  const p6 = request(6)
  let t = Date.now()
  p1.then((result) => {
    expect(result).toBe(1)
    t = Date.now()
  })
  p6.then((result) => {
    expect(result).toBe(6)
    const spend = Date.now() - t
    expect(spend).toBeGreaterThanOrEqual(16)
  })
})

test('concurrencyLimited fail limit', () => {
  const request = concurrencyLimited(failRequest, 5)
  const p1 = request(1)
  const p2 = request(2).catch(noop)
  const p3 = request(3).catch(noop)
  const p4 = request(4).catch(noop)
  const p5 = request(5).catch(noop)
  const p6 = request(6)
  let t = Date.now()
  p1.catch((err) => {
    expect(err).toBe(1)
    t = Date.now()
  })
  p6.catch((err) => {
    expect(err).toBe(6)
    const spend = Date.now() - t
    expect(spend).toBeGreaterThanOrEqual(16)
  })
})

test('concurrencyLimited success or fail', () => {
  const request = concurrencyLimited(successOrFailRequest, 5)
  const p1 = request(1).catch(noop)
  const p2 = request(2).catch(noop)
  const p3 = request(3).catch(noop)
  const p4 = request(4).catch(noop)
  const p5 = request(5).catch(noop)
  const p6 = request(6).catch(noop)
  let t = Date.now()
  p1.finally(() => {
    t = Date.now()
  })
  p6.finally(() => {
    const spend = Date.now() - t
    expect(spend).toBeGreaterThanOrEqual(16)
  })
})

test('concurrencyLimited axios get', async () => {
  const _request = axios.Axios.prototype.request
  // @ts-ignore
  axios.Axios.prototype.request = concurrencyLimited(axios.Axios.prototype.request, 5)
  const p1 = request.get('/api/goods/1').catch(noop)
  const p2 = request.get('/api/goods/2').catch(noop)
  const p3 = request.get('/api/goods/3').catch(noop)
  const p4 = request.get('/api/goods/4').catch(noop)
  const p5 = request.get('/api/goods/5').catch(noop)
  const p6 = request.get('/api/goods/6').catch(noop)
  let t = Date.now()
  p1.then(() => {
    t = Date.now()
  })
  p6.finally(() => {
    const spend = Date.now() - t
    expect(spend).toBeGreaterThan(16)
    // @ts-ignore
    axios.Axios.prototype.request = _request
  })
})
