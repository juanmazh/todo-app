const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

async function testAuth() {
  try {
    console.log('🧪 Iniciando pruebas de autenticación...');

    // Test 1: Registrar usuario
    const testUser = {
      username: `test_user_${Date.now()}`,
      password: 'test123'
    };
    console.log('\n📝 Intentando registrar usuario:', testUser.username);

    const passwordHash = await bcrypt.hash(testUser.password, 10);
    
    const { data: user, error: registerError } = await supabase
      .from('users')
      .insert([{ 
        username: testUser.username, 
        password_hash: passwordHash 
      }])
      .select()
      .single();

    if (registerError) {
      throw new Error(`Error en registro: ${registerError.message}`);
    }

    console.log('✅ Usuario registrado correctamente:', user.id);

    // Test 2: Crear una tarea para el usuario
    console.log('\n📝 Intentando crear una tarea para el usuario');
    
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .insert([{
        title: 'Tarea de prueba',
        description: 'Esta es una tarea de prueba',
        user_id: user.id
      }])
      .select()
      .single();

    if (todoError) {
      throw new Error(`Error creando tarea: ${todoError.message}`);
    }

    console.log('✅ Tarea creada correctamente:', todo.id);

    // Test 3: Obtener las tareas del usuario
    console.log('\n🔍 Intentando obtener las tareas del usuario');
    
    const { data: todos, error: todosError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id);

    if (todosError) {
      throw new Error(`Error obteniendo tareas: ${todosError.message}`);
    }

    console.log('✅ Tareas obtenidas correctamente:', todos.length, 'tareas encontradas');

    // Test 4: Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    
    await supabase
      .from('todos')
      .delete()
      .eq('user_id', user.id);
      
    await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    console.log('✅ Datos de prueba eliminados correctamente');
    console.log('\n✨ Todas las pruebas completadas con éxito');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testAuth();