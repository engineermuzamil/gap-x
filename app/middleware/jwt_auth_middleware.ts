import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'
import type { JwtHttpContext, JwtUser } from '../types/jwt.js'

export default class JwtAuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      redirectTo?: string
    } = {}
  ) {
    const jwtCtx = ctx as JwtHttpContext
    const redirectTo = options.redirectTo
    const authHeader = jwtCtx.request.header('Authorization')
    const cookieToken = jwtCtx.request.cookie('todo_jwt_token')
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : cookieToken

    if (!token) {
      return this.rejectRequest(jwtCtx, redirectTo, 'Missing authentication token')
    }

    try {
      const payload = jwt.verify(token, env.get('JWT_SECRET')) as JwtUser

      const user = await User.find(payload.userId)

      if (!user) {
        return this.rejectRequest(jwtCtx, redirectTo, 'Invalid or expired token')
      }

      jwtCtx.jwtUser = payload
    } catch {
      return this.rejectRequest(jwtCtx, redirectTo, 'Invalid or expired token')
    }

    await next()
  }

  protected rejectRequest(ctx: JwtHttpContext, redirectTo: string | undefined, message: string) {
    if (redirectTo) {
      return ctx.response.redirect(redirectTo, true)
    }

    return ctx.response.unauthorized({ message })
  }
}
