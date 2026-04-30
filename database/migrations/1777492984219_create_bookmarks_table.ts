import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // ── Owner ───────────────────────────────────────────────────────────────
      // Links to the users table — same pattern as notes
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // When user is deleted, their bookmarks go too

      // ── The URL the user saved ───────────────────────────────────────────────
      table.string('url', 2048).notNullable()

      // ── Open Graph metadata (fetched from the URL automatically) ────────────
      // These are nullable because some pages don't have OG tags
      table.string('title', 500).nullable()
      table.text('description').nullable()
      table.string('image_url', 2048).nullable()
      table.string('site_name', 255).nullable()

      // ── AI-generated fields (from Google Gemini) ────────────────────────────
      // ai_label: short category tag, e.g. "Technology", "Design", "Finance"
      table.string('ai_label', 100).nullable()

      // tldr: on-demand summary — null until the user clicks the TL;DR button
      table.text('tldr').nullable()

      // ── Timestamps ──────────────────────────────────────────────────────────
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
