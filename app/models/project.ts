// app/models/project.ts
// ─────────────────────────────────────────────────────────────────────────────
// Changes from original:
//   - Added @belongsTo(() => User) — was missing entirely
//   - Added belongsTo import
//   - Added BelongsTo type import
// ─────────────────────────────────────────────────────────────────────────────

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // ── Owner ─────────────────────────────────────────────────────────────────
  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // ── Fields ────────────────────────────────────────────────────────────────
  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare status: 'pending' | 'in-progress' | 'completed'

  // ── Timestamps ────────────────────────────────────────────────────────────
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
