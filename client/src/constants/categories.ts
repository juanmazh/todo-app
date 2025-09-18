export const CATEGORIES = [
  'general',
  'trabajo',
  'personal',
  'estudio',
  'salud',
  'compras',
  'hogar',
  'proyectos',
  'fitness',
  'viajes',
  'finanzas',
  'hobbies'
] as const;

export const PRIORITIES = [
  { value: 'low', label: 'Baja', color: '#10b981' },
  { value: 'medium', label: 'Media', color: '#f59e0b' },
  { value: 'high', label: 'Alta', color: '#ef4444' }
] as const;
