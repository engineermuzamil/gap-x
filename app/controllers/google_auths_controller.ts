import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class GoogleAuthController {
  async authPage({ inertia }: HttpContext) {
    return inertia.render('projects/auth', {})
  }

  async redirect({ ally, session }: HttpContext) {
    session.put('redirect.previousUrl', '/projects')
    return ally.use('google').redirect()
  }

  async callback({ ally, auth, session, response }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      session.flash('error', 'Access was denied. Please try again.')
      return response.redirect('/projects/auth')
    }

    if (google.stateMisMatch()) {
      session.flash('error', 'State mismatch. Please try again.')
      return response.redirect('/projects/auth')
    }

    if (google.hasError()) {
      session.flash('error', 'An error occurred during sign-in. Please try again.')
      return response.redirect('/projects/auth')
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate(
      { email: googleUser.email! },
      {
        fullName: googleUser.name,
        googleId: googleUser.id,
        avatarUrl: googleUser.avatarUrl,

        password: crypto.randomUUID(),
      }
    )

    if (!user.googleId || user.avatarUrl !== googleUser.avatarUrl) {
      user.googleId = googleUser.id
      user.avatarUrl = googleUser.avatarUrl
      await user.save()
    }

    await auth.use('web').login(user)

    return response.redirect().toIntended('/projects')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/projects/auth')
  }
}
