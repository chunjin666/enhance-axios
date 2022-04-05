import request from '../request'

export const clientError = request.getWrap('/api/client/error')

export const serverError = request.getWrap('/api/server/error')
