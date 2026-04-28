import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // 'high' | 'medium' | 'low'
      table.string('priority').notNullable().defaultTo('medium')
      // 'pending' | 'in_progress' | 'completed'
      table.string('status').notNullable().defaultTo('pending')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('priority')
      table.dropColumn('status')
    })
  }
}
