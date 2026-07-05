'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Helper to securely verify identity and return an Admin database client
async function getAdminClient() {
  const cookieStore = await cookies();
  
  // 1. Check who is making the request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Double-check email against environment variables
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized action. Admin privileges required.');
  }

  // 3. Return a powerful admin client (using the secret Service Role Key)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function deleteProductAction(id: string) {
  const adminDb = await getAdminClient();
  const { error } = await adminDb.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/'); // Force the homepage to update
  revalidatePath('/admin/products');
}

export async function updateProductAction(id: string, updateData: any) {
  const adminDb = await getAdminClient();
  const { error } = await adminDb.from('products').update(updateData).eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/');
  revalidatePath('/admin/products');
}
