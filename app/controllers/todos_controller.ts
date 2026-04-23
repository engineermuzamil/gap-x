import { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

export default class TodosController {
  /**
   * Display a list of todos
   */

  async index({ inertia }: HttpContext) {
    const todos = await Todo.all()

    const serialized = todos.map((todo) => ({
      ...todo.serialize(),
      isCompleted: Boolean(todo.isCompleted),
    }))

    return inertia.render('todos/index', { todos: serialized } as never)
  }

  /**
   * Get a specific todo
   */
  async show({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }
    return response.json(todo)
  }

  /**
   * Store a new todo
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'isCompleted'])
    await Todo.create(data)
    return response.redirect().back()
  }

  /**
   * Update a todo
   */
  async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    const data = request.only(['title', 'description', 'isCompleted'])
    await todo.merge(data).save()
    return response.redirect().back()
  }

  /**
   * Delete a todo
   */
  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.notFound({ message: 'Todo not found' })
    }

    await todo.delete()
    return response.redirect().back()
  }
}
