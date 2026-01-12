/**
 * SUPABASE CLIENT CONFIGURATION
 * Cấu hình kết nối Supabase cho dự án Finsmart
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Lấy biến môi trường từ Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra biến môi trường
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file:\n' +
        '- VITE_SUPABASE_URL\n' +
        '- VITE_SUPABASE_ANON_KEY'
    );
}

// Tạo Supabase client với type-safe database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Export types cho sử dụng trong toàn bộ app
export type { Database };
