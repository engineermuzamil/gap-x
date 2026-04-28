import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Label from '#models/label'

// Typed constants
export const TODO_PRIORITIES = ['high', 'medium', 'low'] as const
export const TODO_STATUSES = ['pending', 'in_progress', 'completed'] as const

export type TodoPriority = (typeof TODO_PRIORITIES)[number]
export type TodoStatus = (typeof TODO_STATUSES)[number]

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare isCompleted: boolean

  @column()
  declare priority: TodoPriority

  @column()
  declare status: TodoStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Label, {
    pivotTable: 'todo_labels',
  })
  declare labels: ManyToMany<typeof Label>
}
