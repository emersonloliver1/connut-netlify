import { supabase } from './lib/supabase';

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'welysongomes15@gmail.com',
    password: 'wgs@9898',
    options: {
      data: {
        full_name: 'Welison Gomes'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully:', data);
}

createUser();