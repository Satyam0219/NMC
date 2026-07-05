'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// 1. Function to submit a new message (used by the Contact Page)
export async function submitContactMessage(data: {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([data]);

    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error: any) {
    console.error('Contact error:', error);
    return { success: false, error: error.message };
  }
}

// 2. Function to update read/unread status (used by the Admin Dashboard)
export async function updateMessageStatus(messageId: string, newStatus: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: newStatus })
      .eq('id', messageId);

    if (error) throw new Error(error.message);

    // Refresh the admin page so the UI updates instantly
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}