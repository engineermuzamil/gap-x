import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'
import type { JwtHttpContext, JwtUser } from '../types/jwt.js'

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const jwtCtx = ctx as JwtHttpContext
    const authHeader = jwtCtx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jwtCtx.response.unauthorized({ message: 'Missing or malformed Authorization header' })
    }

    const token = authHeader.replace('Bearer ', '').trim()

    try {
      const payload = jwt.verify(token, env.get('JWT_SECRET')) as JwtUser

      const user = await User.find(payload.userId)

      if (!user) {
        return jwtCtx.response.unauthorized({ message: 'Invalid or expired token' })
      }

      // Attach decoded payload so controllers can read ctx.jwtUser.userId.
      // We also confirm the user still exists so stale tokens redirect cleanly.
      jwtCtx.jwtUser = payload
    } catch {
      return jwtCtx.response.unauthorized({ message: 'Invalid or expired token' })
    }

    await next()
  }
}
