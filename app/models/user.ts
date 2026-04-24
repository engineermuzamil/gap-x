import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Todo from '#models/todo'
import Note from '#models/note'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @hasMany(() => Todo)
  declare todos: HasMany<typeof Todo>

  @hasMany(() => Note)
  declare notes: HasMany<typeof Note>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')

    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }

    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
