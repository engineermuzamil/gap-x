import type { HttpContext } from '@adonisjs/core/http'

export type JwtUser = {
  userId: number
  email: string
}

export type JwtHttpContext = HttpContext & {
  jwtUser: JwtUser
}
