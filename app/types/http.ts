import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    jwtUser: {
      userId: number
      email: string
    }
  }
}
