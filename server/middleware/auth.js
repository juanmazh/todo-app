const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Configurar el token para esta petición
    supabase.auth.setSession(token);

    // Verificar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Obtener datos del usuario de nuestra tabla
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ error: 'Error de autenticación' });
  }
};

module.exports = { authenticateToken };