import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import Label from '#models/label'
import User from '#models/user'

export default class TodosController {
  /**
   * GET /todos/data
   * Returns all todos belonging to the authenticated user.
   */
  async index({ response, jwtUser }: HttpContext) {
    const [todos, labels, user] = await Promise.all([
      Todo.query().where('userId', jwtUser.userId).preload('labels').orderBy('created_at', 'desc'),
      Label.all(),
      User.findOrFail(jwtUser.userId),
    ])

    const serialized = todos.map((todo) => ({
      ...todo.serialize(),
      isCompleted: Boolean(todo.isCompleted),
    }))

    return response.ok({
      todos: serialized,
      labels,
      user: {
        fullName: user.fullName,
        email: user.email,
        initials: user.initials,
      },
    })
  }

  /**
   * GET /todos/:id
   * Returns one todo — only if it belongs to the authenticated user.
   */
  async show({ params, response, jwtUser }: HttpContext) {
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()

    if (!todo) return response.notFound({ message: 'Todo not found' })

    return response.json(todo)
  }

  /**
   * POST /todos
   * Creates a new todo owned by the authenticated user.
   */
  async store({ request, response, jwtUser }: HttpContext) {
    const data = request.only(['title', 'description', 'isCompleted'])
    const labelIds: number[] = request.input('labelIds', [])

    const todo = await Todo.create({ ...data, userId: jwtUser.userId })

    if (labelIds.length > 0) {
      await todo.related('labels').attach(labelIds)
    }

    await todo.load('labels')

    return response.created({
      ...todo.serialize(),
      isCompleted: Boolean(todo.isCompleted),
    })
  }

  /**
   * PUT /todos/:id
   * Updates a todo — only if it belongs to the authenticated user.
   */
  async update({ params, request, response, jwtUser }: HttpContext) {
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()

    if (!todo) return response.notFound({ message: 'Todo not found' })

    const data = request.only(['title', 'description', 'isCompleted'])
    const labelIds: number[] = request.input('labelIds', [])

    await todo.merge(data).save()
    await todo.related('labels').sync(labelIds)
    await todo.load('labels')

    return response.ok({
      ...todo.serialize(),
      isCompleted: Boolean(todo.isCompleted),
    })
  }

  /**
   * DELETE /todos/:id
   * Deletes a todo — only if it belongs to the authenticated user.
   */
  async destroy({ params, response, jwtUser }: HttpContext) {
    const todo = await Todo.query().where('id', params.id).where('userId', jwtUser.userId).first()

    if (!todo) return response.notFound({ message: 'Todo not found' })

    await todo.delete()
    return response.ok({ message: 'Todo deleted' })
  }
}
