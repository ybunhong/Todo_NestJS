import { useState, useEffect } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo } from './api'
import type { Todo } from './api'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const todo = await createTodo({ title: newTodo, status: 'To Do' })
      setTodos([...todos, todo])
      setNewTodo('')
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const updated = await updateTodo(id, { status: newStatus })
      setTodos(todos.map(t => t.id === id ? updated : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const handleSaveEdit = async (id: number) => {
    if (!editText.trim()) return
    try {
      const updated = await updateTodo(id, { title: editText })
      setTodos(todos.map(t => t.id === id ? updated : t))
      setEditingId(null)
      setEditText('')
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleSelectTodo = (id: number) => {
    const newSelected = new Set(selectedTodos)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTodos(newSelected)
  }

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedTodos) {
        await deleteTodo(id)
      }
      setTodos(todos.filter(t => !selectedTodos.has(t.id)))
      setSelectedTodos(new Set())
    } catch (error) {
      console.error('Error bulk deleting todos:', error)
    }
  }

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      for (const id of selectedTodos) {
        await updateTodo(id, { status: newStatus })
      }
      setTodos(todos.map(t => selectedTodos.has(t.id) ? { ...t, status: newStatus } : t))
      setSelectedTodos(new Set())
    } catch (error) {
      console.error('Error bulk updating todos:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesStatus = filterStatus === 'All' || todo.status === filterStatus
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-wine p-4 md:p-8">
      <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Todo App</h1>
            <p className="text-white/80">Manage your tasks efficiently</p>
          </div>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <span className="text-white font-medium">ybunhong</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <form onSubmit={handleAddTodo} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-wine-light"
          />
          <button type="submit" className="backdrop-blur-md bg-wine hover:bg-wine-light border border-white/20 rounded-xl px-6 py-3 text-white font-medium transition-colors">Add</button>
        </form>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search todos..."
            className="flex-1 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-wine-light"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-wine-light [&_option]:bg-wine [&_option]:text-white"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {selectedTodos.size > 0 && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 mb-6 flex gap-3 items-center">
            <span className="text-white">Selected: {selectedTodos.size}</span>
            <button onClick={handleBulkDelete} className="backdrop-blur-md bg-red-600 hover:bg-red-700 border border-white/20 rounded-xl px-4 py-2 text-white font-medium transition-colors">Delete Selected</button>
            <select
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wine-light [&_option]:bg-wine [&_option]:text-white"
              defaultValue=""
            >
              <option value="" disabled>Change Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        )}

        <ul className="space-y-3">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 flex gap-3 items-center ${todo.status === 'Done' ? 'opacity-60' : ''}`}>
              <input
                type="checkbox"
                checked={selectedTodos.has(todo.id)}
                onChange={() => handleSelectTodo(todo.id)}
                className="w-5 h-5 rounded accent-wine"
              />
              <select
                value={todo.status}
                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                className="backdrop-blur-md bg-wine border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-wine-light [&_option]:bg-wine [&_option]:text-white"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 backdrop-blur-md bg-white/20 border-2 border-wine rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-wine-light"
                />
              ) : (
                <span className={`flex-1 text-white ${todo.status === 'Done' ? 'line-through' : ''}`}>{todo.title}</span>
              )}
              {editingId === todo.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(todo.id)}
                    className="backdrop-blur-md bg-green-600 hover:bg-green-700 border border-white/20 rounded-lg px-4 py-2 text-white font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="backdrop-blur-md bg-gray-600 hover:bg-gray-700 border border-white/20 rounded-lg px-4 py-2 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="backdrop-blur-md bg-green-600 hover:bg-green-700 border border-white/20 rounded-lg px-4 py-2 text-white font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="backdrop-blur-md bg-red-600 hover:bg-red-700 border border-white/20 rounded-lg px-4 py-2 text-white font-medium transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <p className="text-center text-white/80 py-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl">No todos found. Add one above!</p>
        )}
      </main>
    </div>
  )
}

export default App
