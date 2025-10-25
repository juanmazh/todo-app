import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import Auth from './components/Auth';
import type { Todo } from './types/Todo';
import { todoService } from './services/todoService';
import './App.css';

function App() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState({
    status: 'all' as 'all' | 'completed' | 'pending',
    priority: 'all' as 'all' | 'low' | 'medium' | 'high',
    category: 'all',
    search: ''
  });

  // Cargar tareas al montar el componente
  useEffect(() => {
    // Cargar sesión si existe
    const rawUser = localStorage.getItem('user');
    const rawToken = localStorage.getItem('token');
    if (rawUser && rawToken) {
      try {
        setUser(JSON.parse(rawUser));
        setToken(rawToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    loadTodos();
  }, []);

  // Filtrar tareas cuando cambien los filtros o las tareas
  useEffect(() => {
    filterTodos();
  }, [todos, filter]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTodos = () => {
    let filtered = [...todos];

    // Filtrar por estado
    if (filter.status !== 'all') {
      filtered = filtered.filter(todo => 
        filter.status === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Filtrar por prioridad
    if (filter.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filter.priority);
    }

    // Filtrar por categoría
    if (filter.category !== 'all') {
      filtered = filtered.filter(todo => todo.category === filter.category);
    }

    // Filtrar por búsqueda
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTodos(filtered);
  };

  const handleCreateTodo = async (todoData: { title: string; description: string; priority: 'low' | 'medium' | 'high'; category: string }) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const handleAuth = (userObj: { id: string; username: string }, tok: string) => {
    setUser(userObj);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setTodos([]);
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed });
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const openEditForm = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (!user) {
    return (
      <div className="app">
        <Auth onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="app">
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <motion.h1 
            className="app-title"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            📝 Mi Lista de Tareas
          </motion.h1>
          <p className="app-subtitle">
            Tu herramienta personal para la productividad — <small>usuario: {user.username}</small>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </motion.header>

      <main className="app-main">
        <div className="container">
          <motion.div 
            className="controls-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="controls-row">
              <motion.button
                className="btn btn-primary add-btn"
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Nueva Tarea
              </motion.button>

              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="search-input"
                />
              </div>
            </div>

            <FilterBar 
              filter={filter}
              onFilterChange={setFilter}
              todos={todos}
            />
          </motion.div>

          <AnimatePresence>
            {showForm && (
              <TodoForm
                todo={editingTodo}
                onSubmit={editingTodo ? 
                  (data) => handleUpdateTodo(editingTodo.id, data) : 
                  handleCreateTodo
                }
                onClose={closeForm}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <TodoList
              todos={filteredTodos}
              loading={loading}
              onToggleComplete={handleToggleComplete}
              onEdit={openEditForm}
              onDelete={handleDeleteTodo}
            />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;