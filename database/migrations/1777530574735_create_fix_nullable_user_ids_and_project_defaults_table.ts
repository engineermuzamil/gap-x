import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery('DELETE FROM notes WHERE user_id IS NULL')
    await this.db.rawQuery('DELETE FROM todos WHERE user_id IS NULL')

    this.schema.alterTable('notes', (table) => {
      table.integer('user_id').unsigned().notNullable().alter()
    })

    this.schema.alterTable('todos', (table) => {
      table.integer('user_id').unsigned().notNullable().alter()
    })

    this.schema.alterTable('projects', (table) => {
      table.integer('user_id').unsigned().notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable('notes', (table) => {
      table.integer('user_id').unsigned().nullable().alter()
    })

    this.schema.alterTable('todos', (table) => {
      table.integer('user_id').unsigned().nullable().alter()
    })

    this.schema.alterTable('projects', (table) => {
      table.integer('user_id').unsigned().notNullable().defaultTo(1).alter()
    })
  }
}
