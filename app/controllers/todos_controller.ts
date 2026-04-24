import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import Label from '#models/label'

export default class TodosController {
  async index({ inertia }: HttpContext) {
    const [todos, labels] = await Promise.all([
      Todo.query().preload('labels').orderBy('created_at', 'desc'),
      Label.all(),
    ])

    const serialized = todos.map((todo) => ({
      ...todo.serialize(),
      isCompleted: Boolean(todo.isCompleted),
    }))

    return inertia.render('todos/index', { todos: serialized, labels } as never)
  }

  async show({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }
    return response.json(todo)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'isCompleted'])
    const labelIds: number[] = request.input('labelIds', [])

    const todo = await Todo.create(data)

    // Attach the selected labels to the todo via the pivot table
    if (labelIds.length > 0) {
      await todo.related('labels').attach(labelIds)
    }

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    const data = request.only(['title', 'description', 'isCompleted'])
    const labelIds: number[] = request.input('labelIds', [])

    await todo.merge(data).save()

    // sync() replaces all existing pivot records with the new set
    await todo.related('labels').sync(labelIds)

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }
    await todo.delete()
    return response.redirect().back()
  }
}
