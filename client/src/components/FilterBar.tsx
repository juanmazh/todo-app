import React from 'react';
import { motion } from 'framer-motion';
import { Filter, CheckCircle, Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FilterState, Todo } from '../types/Todo';
import { CATEGORIES } from '../constants/categories';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  todos: Todo[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange, todos }) => {
  const getAllCategories = () => {
    const usedCategories = todos.map(todo => todo.category).filter(Boolean);
    const allCategories = [...new Set([...CATEGORIES, ...usedCategories])];
    return allCategories;
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filter.status !== 'all' || 
                          filter.priority !== 'all' || 
                          filter.category !== 'all' || 
                          filter.search !== '';

  return (
    <motion.div 
      className="filter-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="filter-header">
        <Filter size={18} />
        <span>Filtros</span>
        {hasActiveFilters && (
          <motion.button
            className="clear-filters-btn"
            onClick={clearFilters}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Limpiar
          </motion.button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <div className="filter-options">
            <motion.button
              className={`filter-option ${filter.status === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('status', 'all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle2 size={14} />
              Todas
            </motion.button>
            <motion.button
              className={`filter-option ${filter.status === 'pending' ? 'active' : ''}`}
              onClick={() => handleFilterChange('status', 'pending')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock size={14} />
              Pendientes
            </motion.button>
            <motion.button
              className={`filter-option ${filter.status === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('status', 'completed')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={14} />
              Completadas
            </motion.button>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Prioridad</label>
          <div className="filter-options">
            <motion.button
              className={`filter-option ${filter.priority === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('priority', 'all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Todas
            </motion.button>
            <motion.button
              className={`filter-option priority-high ${filter.priority === 'high' ? 'active' : ''}`}
              onClick={() => handleFilterChange('priority', 'high')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertTriangle size={14} />
              Alta
            </motion.button>
            <motion.button
              className={`filter-option priority-medium ${filter.priority === 'medium' ? 'active' : ''}`}
              onClick={() => handleFilterChange('priority', 'medium')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertCircle size={14} />
              Media
            </motion.button>
            <motion.button
              className={`filter-option priority-low ${filter.priority === 'low' ? 'active' : ''}`}
              onClick={() => handleFilterChange('priority', 'low')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle2 size={14} />
              Baja
            </motion.button>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Categoría</label>
          <select
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las categorías</option>
            {getAllCategories().map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
