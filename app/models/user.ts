import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Todo from '#models/todo'
import Note from '#models/note'
import Project from '#models/project'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @column()
  declare googleId: string | null

  @column()
  declare avatarUrl: string | null

  // ─── Relations ─────────────────────────────────────────────────────────────

  @hasMany(() => Todo)
  declare todos: HasMany<typeof Todo>

  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>

  @hasMany(() => Project)
  declare projects: HasMany<typeof Project>

  // ─── Helpers ───────────────────────────────────────────────────────────────

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')

    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }

    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
