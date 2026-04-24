import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'label_pivots'

  async up() {
    this.schema.createTable('todo_labels', (table) => {
      table.increments('id')
      table.integer('todo_id').unsigned().references('id').inTable('todos').onDelete('CASCADE')
      table.integer('label_id').unsigned().references('id').inTable('labels').onDelete('CASCADE')
      table.unique(['todo_id', 'label_id'])
    })

    this.schema.createTable('note_labels', (table) => {
      table.increments('id')
      table.integer('note_id').unsigned().references('id').inTable('notes').onDelete('CASCADE')
      table.integer('label_id').unsigned().references('id').inTable('labels').onDelete('CASCADE')
      table.unique(['note_id', 'label_id'])
    })
  }

  async down() {
    this.schema.dropTable('todo_labels')
    this.schema.dropTable('note_labels')
  }
}
