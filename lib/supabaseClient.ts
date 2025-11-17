


import { createClient } from '@supabase/supabase-js';
import { Car, MenuItem, CompletedTransaction, Expense, BillingConfig } from '../types';

// =================================================================================
// Supabase Client Configuration
// =================================================================================
// The values below have been configured with the credentials you provided.
// If you still experience connection issues, please double-check them.
// You can find your credentials in your Supabase project dashboard under Settings > API.

// Sử dụng biến môi trường chuẩn Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define a type for your database schema.
// This helps with type safety when querying.
export interface Database {
  public: {
    Tables: {
      cars: {
        Row: Car;
        Insert: Car;
        // FIX: The Update type should not include the primary key.
        Update: Partial<Omit<Car, 'id'>>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, 'id'>;
        // FIX: The Update type should not include the primary key.
        Update: Partial<Omit<MenuItem, 'id'>>;
      };
      completed_transactions: {
        Row: CompletedTransaction;
        Insert: CompletedTransaction;
        // FIX: The Update type should not include the primary key.
        Update: Partial<Omit<CompletedTransaction, 'id'>>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id'>;
        // FIX: The Update type should not include the primary key.
        Update: Partial<Omit<Expense, 'id'>>;
      };
      billing_config: {
        Row: { id: number, config: BillingConfig };
        Insert: { id?: number, config: BillingConfig };
        Update: { config?: BillingConfig };
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);