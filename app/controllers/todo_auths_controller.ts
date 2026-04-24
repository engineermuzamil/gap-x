import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'
import vine from '@vinejs/vine'

// ─── Validation schemas ───────────────────────────────────────────────────────

const signupSchema = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    passwordConfirmation: vine.string(),
  })
)

const loginSchema = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(1),
  })
)

// ─── Helper ───────────────────────────────────────────────────────────────────

function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, env.get('JWT_SECRET'), { expiresIn: '7d' })
}

// ─── Controller ───────────────────────────────────────────────────────────────

export default class TodoAuthController {
  /**
   * POST /todo-auth/signup
   *
   * Validates input, checks email is free, hashes the password,
   * creates the user, then returns a JWT so the user is immediately logged in.
   */
  async signup({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupSchema)

    if (data.password !== data.passwordConfirmation) {
      return response.unprocessableEntity({ message: 'Passwords do not match' })
    }

    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.conflict({ message: 'Email is already taken' })
    }

    // Always hash passwords before storing — never plain text
    const hashedPassword = await hash.make(data.password)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    })

    const token = generateToken(user.id, user.email)

    return response.created({
      message: 'Account created successfully',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    })
  }

  /**
   * POST /todo-auth/login
   *
   * Uses verifyCredentials from the withAuthFinder mixin already on the User model.
   * It handles both "user not found" and "wrong password" in one call,
   * always throwing the same error so email existence is never leaked.
   */
  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginSchema)

    try {
      const user = await User.verifyCredentials(data.email, data.password)
      const token = generateToken(user.id, user.email)

      return response.ok({
        message: 'Logged in successfully',
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
      })
    } catch {
      return response.unauthorized({ message: 'Invalid email or password' })
    }
  }

  /**
   * POST /todo-auth/logout
   *
   * JWTs are stateless — the server has nothing to invalidate.
   * The client must delete its stored token. This endpoint exists
   * so the frontend has a consistent logout pattern to call.
   */
  async logout({ response }: HttpContext) {
    return response.ok({ message: 'Logged out. Please delete your token on the client.' })
  }
}
