import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { authHeaders, getToken, logoutFromTodos } from './todo-auth'
import type { Todo, Label } from './types'

export const TODOS_KEY = ['todos'] as const

type TodoUser = { fullName: string | null; email: string; initials: string }

type TodosResponse = { todos: Todo[]; labels: Label[]; user: TodoUser }

type TodoInput = {
  title: string
  description: string
  labelIds: number[]
  priority: string
  status: string
}

async function handle401(err: any) {
  if (err.response?.status === 401) {
    await logoutFromTodos()
    router.visit('/todo-auth/login')
  }
}

export function useTodos() {
  const queryClient = useQueryClient()
  const token = getToken()
  const hasToken = token !== null

  useEffect(() => {
    if (!hasToken) {
      router.visit('/todo-auth/login')
    }
  }, [hasToken])

  const query = useQuery<TodosResponse>({
    queryKey: [...TODOS_KEY, token],
    enabled: hasToken,
    queryFn: async () => {
      const response = await axios.get('/todos/data', { headers: authHeaders() })
      return response.data
    },
  })

  useEffect(() => {
    if (query.error) {
      void handle401(query.error)
    }
  }, [query.error])

  const createTodo = useMutation({
    mutationFn: (input: TodoInput) => axios.post('/todos', input, { headers: authHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    onError: handle401,
  })

  const updateTodo = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<TodoInput> }) =>
      axios.put(`/todos/${id}`, input, { headers: authHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    onError: handle401,
  })

  const deleteTodo = useMutation({
    mutationFn: (id: number) => axios.delete(`/todos/${id}`, { headers: authHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    onError: handle401,
  })

  // Clicking the circle toggles completed ↔ pending
  const toggleComplete = (todo: Todo) => {
    const isDone = todo.status === 'completed'
    updateTodo.mutate({
      id: todo.id,
      input: {
        title: todo.title,
        description: todo.description ?? '',
        labelIds: todo.labels.map((l) => l.id),
        priority: todo.priority,
        status: isDone ? 'pending' : 'completed',
      },
    })
  }

  return {
    todos: query.data?.todos ?? [],
    labels: query.data?.labels ?? [],
    user: query.data?.user ?? null,
    loading: !hasToken || query.isLoading,
    error: query.isError ? 'Failed to load todos.' : null,
    submitting: createTodo.isPending || updateTodo.isPending,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  }
}
