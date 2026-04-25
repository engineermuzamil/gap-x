import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserIdToTodos extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_id')
    })
  }
}
