'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache'; // <-- This clears the cache!

export async function createOrder(orderData: any, cartItems: any[]) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  try {
    // 1. Insert the main order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw new Error(`Order Error: ${orderError.message}`);

    // 2. Format and insert the individual cart items
    const itemsToInsert = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw new Error(`Items Error: ${itemsError.message}`);

    // 3. Force Next.js to refresh the admin dashboard immediately
    revalidatePath('/admin/orders');

    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
// Add this to the bottom of app/actions/orders.ts

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); } } }
  );

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) throw new Error(error.message);

    // Refresh the admin page cache so the new status shows instantly
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}