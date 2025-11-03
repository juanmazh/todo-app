const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fancsoppdoiruxtxrrth.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbmNzb3BwZG9pcnV4dHhycnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODA1MjEsImV4cCI6MjA3Nzc1NjUyMX0.WpijWYmkC9rkal5mRZppv74zLL4wUztt8Wk3NDtElGw'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

module.exports = supabase
