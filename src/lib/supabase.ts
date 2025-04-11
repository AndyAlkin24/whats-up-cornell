
import { createClient } from '@supabase/supabase-js';
import { Post } from '@/types/post';

// These environment variables are automatically injected by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPosts = async (): Promise<Post[]> => {
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
  
  return data as Post[];
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
