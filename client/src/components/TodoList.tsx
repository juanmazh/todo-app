import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <motion.div 
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-spinner"></div>
        <p>Cargando tareas...</p>
      </motion.div>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div 
        className="empty-state"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-icon">📝</div>
        <h3>No hay tareas</h3>
        <p>¡Crea tu primera tarea para comenzar a organizarte!</p>
      </motion.div>
    );
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="todo-list-container">
      <motion.div 
        className="todo-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat-item">
          <CheckCircle className="stat-icon completed" />
          <span>{completedCount} completadas</span>
        </div>
        <div className="stat-item">
          <Clock className="stat-icon pending" />
          <span>{pendingCount} pendientes</span>
        </div>
        <div className="stat-item">
          <AlertCircle className="stat-icon total" />
          <span>{todos.length} total</span>
        </div>
      </motion.div>

      <motion.div 
        className="todo-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence>
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.3,
                type: "spring",
                stiffness: 100
              }}
              layout
            >
              <TodoItem
                todo={todo}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TodoList;
