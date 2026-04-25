import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddGoogleFieldsToUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id').nullable().unique()

      // Profile picture URL returned by Google.
      table.string('avatar_url').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id')
      table.dropColumn('avatar_url')
    })
  }
}
