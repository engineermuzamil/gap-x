import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Label from '#models/label'
import User from '#models/user'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare pinned: boolean

  @column()
  declare imageUrl: string | null

  @column()
  declare shareToken: string | null

  @column()
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Label, {
    pivotTable: 'note_labels',
  })
  declare labels: ManyToMany<typeof Label>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
