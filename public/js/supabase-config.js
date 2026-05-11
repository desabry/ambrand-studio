/**
 * Supabase Configuration for Ambrand Studio
 * This file initializes the Supabase client and is shared across all pages.
 * Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 */

const SUPABASE_URL = 'https://ytmdxuxzxjcfenrzkxut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bWR4dXh6eGpjZmVucnpreHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDA3NTQsImV4cCI6MjA5MzY3Njc1NH0.m494bYf60wx6rfZqU7O68yseYY4FDeZYzlVGvvNwmNk';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');
