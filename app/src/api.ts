const API_URL = 'http://localhost:3000'

export type Todo = {
  id: number
  title: string
  status: string
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}/todo`)
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  })
  if (!response.ok) throw new Error('Failed to create todo')
  return response.json()
}

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) throw new Error('Failed to update todo')
  return response.json()
}

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/todo/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete todo')
}
