import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ message: 'Missing or malformed Authorization header' })
    }

    const token = authHeader.replace('Bearer ', '').trim()

    try {
      const payload = jwt.verify(token, env.get('JWT_SECRET')) as unknown as {
        userId: number
        email: string
      }

      const user = await User.find(payload.userId)

      if (!user) {
        return ctx.response.unauthorized({ message: 'Invalid or expired token' })
      }

      // Attach decoded payload so controllers can read ctx.jwtUser.userId.
      // We also confirm the user still exists so stale tokens redirect cleanly.
      ctx.jwtUser = payload
    } catch {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }

    await next()
  }
}
