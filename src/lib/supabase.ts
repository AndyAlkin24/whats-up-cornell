
import { createClient } from '@supabase/supabase-js';
import { Post } from '@/types/post';

// Check if environment variables are available
// These environment variables are automatically injected by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

// Handle potential missing values
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure you have connected to Supabase properly.');
}

// Create a dummy client if credentials are missing
// This allows the app to at least load without crashing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') }),
          }),
          gte: () => ({
            order: async () => ({ data: [], error: new Error('Supabase not configured') }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: new Error('Supabase not configured') }),
            }),
          }),
        }),
      }),
    };

export const getPosts = async (): Promise<Post[]> => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .gte('timestamp', twelveHoursAgo.getTime())
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return data as Post[] || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  
  return data as Post;
};

export const updatePullingUp = async (postId: string, currentCount: number): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .update({ pullingUp: currentCount + 1 })
    .eq('id', postId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating pulling up count:', error);
    throw error;
  }
  
  return data as Post;
};
