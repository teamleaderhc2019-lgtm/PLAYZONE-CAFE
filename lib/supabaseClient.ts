


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
        Insert: any; // Using any to allow flexible payload (camelCase vs snake_case)
        Update: any;
      };
      menu_items: {
        Row: MenuItem;
        Insert: any;
        Update: any;
      };
      completed_transactions: {
        Row: CompletedTransaction;
        Insert: any;
        Update: any;
      };
      expenses: {
        Row: Expense;
        Insert: any;
        Update: any;
      };
      billing_config: {
        Row: { id: number, config: BillingConfig };
        Insert: { id?: number, config: BillingConfig };
        Update: { config?: BillingConfig };
      };
      active_sessions: {
        Row: any; // Using any to avoid strict type checking for now, as we are mixing camelCase and snake_case
        Insert: any;
        Update: any;
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);