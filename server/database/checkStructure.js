const supabase = require('../config/supabase');

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estructura de tablas...\n');

    // Obtener estructura de users
    const { data: usersColumns, error: usersError } = await supabase
      .rpc('check_table_structure', { table_name: 'users' });

    if (usersError) throw usersError;

    console.log('📋 Estructura de tabla users:');
    console.log(JSON.stringify(usersColumns, null, 2));

    // Obtener estructura de todos
    const { data: todosColumns, error: todosError } = await supabase
      .rpc('check_table_structure', { table_name: 'todos' });

    if (todosError) throw todosError;

    console.log('\n📋 Estructura de tabla todos:');
    console.log(JSON.stringify(todosColumns, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nEjecuta esta función en el SQL Editor de Supabase:');
    console.log(`
CREATE OR REPLACE FUNCTION check_table_structure(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'column_name', column_name,
      'data_type', data_type,
      'is_nullable', is_nullable,
      'column_default', column_default
    )
  )
  INTO result
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = $1;
  
  RETURN result;
END;
$$;
`);
  }
}

checkTableStructure();