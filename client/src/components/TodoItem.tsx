import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit, Trash2, Calendar, Tag, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import type { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="priority-icon high" />;
      case 'medium':
        return <AlertCircle className="priority-icon medium" />;
      case 'low':
        return <CheckCircle className="priority-icon low" />;
      default:
        return <AlertCircle className="priority-icon medium" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="todo-content">
        <div className="todo-main">
          <motion.button
            className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              backgroundColor: todo.completed ? getPriorityColor(todo.priority) : 'transparent',
              borderColor: getPriorityColor(todo.priority)
            }}
          >
            {todo.completed && <Check size={16} />}
          </motion.button>

          <div className="todo-info">
            <motion.h3 
              className={`todo-title ${todo.completed ? 'completed' : ''}`}
              initial={false}
              animate={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1
              }}
            >
              {todo.title}
            </motion.h3>
            
            {todo.description && (
              <p className={`todo-description ${todo.completed ? 'completed' : ''}`}>
                {todo.description}
              </p>
            )}

            <div className="todo-meta">
              <div className="todo-priority">
                {getPriorityIcon(todo.priority)}
                <span className={`priority-text ${todo.priority}`}>
                  {todo.priority === 'high' ? 'Alta' : 
                   todo.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>

              {todo.category && (
                <div className="todo-category">
                  <Tag size={14} />
                  <span>{todo.category}</span>
                </div>
              )}

              <div className="todo-date">
                <Calendar size={14} />
                <span>{formatDate(todo.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="todo-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="action-btn edit-btn"
            onClick={() => onEdit(todo)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit size={16} />
          </motion.button>

          <motion.button
            className="action-btn delete-btn"
            onClick={() => onDelete(todo.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
