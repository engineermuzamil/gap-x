import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import Label from '#models/label'
import User from '#models/user'
import type { JwtHttpContext } from '../types/jwt.js'

export default class TodosController {
  // async index(ctx: HttpContext) {
  //   const { response, jwtUser } = ctx as JwtHttpContext
  //   const [todos, labels, user] = await Promise.all([
  //     Todo.query().where('userId', jwtUser.userId).preload('labels').orderBy('created_at', 'desc'),
  //     Label.all(),
  //     User.findOrFail(jwtUser.userId),
  //   ])

  //   return response.ok({
  //     todos: todos.map((t) => t.serialize()),
  //     labels,
  //     user: {
  //       fullName: user.fullName,
  //       email: user.email,
  //       initials: user.initials,
  //     },
  //   })
  // }

  async index(ctx: HttpContext) {
    const { response, jwtUser } = ctx as JwtHttpContext
    const [todos, labels, user] = await Promise.all([
      Todo.query().where('userId', jwtUser.userId).preload('labels').orderBy('created_at', 'desc'),
      Label.all(),
      User.findOrFail(jwtUser.userId),
    ])

    return response.ok({
      todos: todos.map((t) => t.serialize()),
      labels,
      user: {
        fullName: user.fullName,
        email: user.email,
        initials: user.initials,
      },
    })
  }

  async show(ctx: HttpContext) {
    const { params, response, jwtUser } = ctx as JwtHttpContext
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()
    if (!todo) return response.notFound({ message: 'Todo not found' })
    return response.json(todo)
  }

  async store(ctx: HttpContext) {
    const { request, response, jwtUser } = ctx as JwtHttpContext
    const data = request.only(['title', 'description', 'priority', 'status'])
    const labelIds: number[] = request.input('labelIds', [])

    const todo = await Todo.create({
      ...data,
      priority: data.priority ?? 'medium',
      status: data.status ?? 'pending',
      userId: jwtUser.userId,
    })

    if (labelIds.length > 0) {
      await todo.related('labels').attach(labelIds)
    }

    await todo.load('labels')
    return response.created(todo.serialize())
  }

  async update(ctx: HttpContext) {
    const { params, request, response, jwtUser } = ctx as JwtHttpContext
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()
    if (!todo) return response.notFound({ message: 'Todo not found' })

    const data = request.only(['title', 'description', 'priority', 'status'])
    const labelIds: number[] = request.input('labelIds', [])

    await todo.merge(data).save()
    await todo.related('labels').sync(labelIds)
    await todo.load('labels')

    return response.ok(todo.serialize())
  }

  async destroy(ctx: HttpContext) {
    const { params, response, jwtUser } = ctx as JwtHttpContext
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()
    if (!todo) return response.notFound({ message: 'Todo not found' })
    await todo.delete()
    return response.ok({ message: 'Todo deleted' })
  }
}
