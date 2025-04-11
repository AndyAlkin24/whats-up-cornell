
import { createClient } from '@supabase/supabase-js';
import { Post } from '@/types/post';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// We'll use the Supabase client that's automatically configured by Lovable
export const supabase = supabaseClient;

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
  try {
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
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePullingUp = async (postId: string, currentCount: number): Promise<Post> => {
  try {
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
  } catch (error) {
    console.error('Error updating pulling up count:', error);
    throw error;
  }
};
