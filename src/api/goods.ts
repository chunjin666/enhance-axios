import type { PaginationParams, PaginationData } from '../request/types';
import request from '../request'

interface CreateGoodsParams {
  goodsName: string
  unitPrice: number
  count: number
}

interface EditGoodsParams extends CreateGoodsParams {
  id: string
  /** 是否上架 */
  shelf: boolean
}

interface GoodsDetailResponse extends CreateGoodsParams {
  id: string
  /** 是否上架 */
  shelf: boolean
}

interface GoodsListParams extends PaginationParams {
  /** 是否上架 */
  shelf: boolean
}

interface GoodsListResponseItem extends CreateGoodsParams {
  id: string
  /** 是否上架 */
  shelf: boolean
}

export const createGoods = request.postWrap<CreateGoodsParams, null>('/api/goods')

export const editGoods = request.putWrap<EditGoodsParams, null>('/api/goods')

export const deleteGoods = request.deleteWrap<{ id: string }, null>('/api/goods/{id}')

export const goodsDetail = request.getWrap<{ id: string }, GoodsDetailResponse>('/api/goods/{id}')

export const goodsList = request.getWrap<GoodsListParams, PaginationData<GoodsListResponseItem>>('/api/goods')
