const supabase = require('../config/supabase');

async function testSupabaseConfig() {
  try {
    console.log('🔍 Iniciando pruebas de Supabase...\n');

    // Test 1: Registrar usuario
    const username = `test_user_${Date.now()}`;
    const password = 'test123';
    console.log('📝 Registrando usuario de prueba:', username);

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: `${username}@gmail.com`,
      password: password
    });

    if (signUpError) throw signUpError;
    console.log('✅ Usuario registrado en Auth:', user.id);

    // Test 2: Insertar en tabla users
    console.log('\n📝 Creando registro en tabla users');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        username: username,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('✅ Usuario creado en tabla users:', newUser.id);

    // Test 3: Crear una tarea
    console.log('\n📝 Creando tarea de prueba');
    const { data: todo, error: todoError } = await supabase
      .from('todos')
      .insert([{
        title: 'Tarea de prueba',
        description: 'Esta es una tarea de prueba',
        user_id: user.id
      }])
      .select()
      .single();

    if (todoError) throw todoError;
    console.log('✅ Tarea creada:', todo.id);

    // Test 4: Obtener la tarea
    console.log('\n🔍 Obteniendo tareas del usuario');
    const { data: todos, error: listError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id);

    if (listError) throw listError;
    console.log('✅ Tareas obtenidas:', todos.length, 'encontradas');

    // Test 5: Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await supabase.from('todos').delete().eq('user_id', user.id);
    await supabase.from('users').delete().eq('id', user.id);
    await supabase.auth.admin.deleteUser(user.id);
    console.log('✅ Datos de prueba eliminados');

    console.log('\n✨ Todas las pruebas completadas con éxito');
  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.message);
    console.error('Detalles:', error);
  }
}

testSupabaseConfig();
