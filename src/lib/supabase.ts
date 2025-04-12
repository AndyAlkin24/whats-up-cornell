
import { createClient } from '@supabase/supabase-js';
import { Post } from '@/types/post';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Reply } from '@/types/reply';

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

export const updateFade = async (postId: string, currentCount: number): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ fade: currentCount + 1 })
      .eq('id', postId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fade count:', error);
      throw error;
    }
    
    return data as Post;
  } catch (error) {
    console.error('Error updating fade count:', error);
    throw error;
  }
};

export const getReplies = async (postId: string): Promise<Reply[]> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .select('*')
      .eq('post_id', postId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
    
    return data as Reply[] || [];
  } catch (error) {
    console.error('Failed to fetch replies:', error);
    return [];
  }
};

export const createReply = async (reply: Omit<Reply, 'id'>): Promise<Reply> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .insert(reply)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
    
    return data as Reply;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

export const updateReplyPullingUp = async (replyId: string, currentCount: number): Promise<Reply> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .update({ pullingup: currentCount + 1 })
      .eq('id', replyId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating reply pulling up count:', error);
      throw error;
    }
    
    return data as Reply;
  } catch (error) {
    console.error('Error updating reply pulling up count:', error);
    throw error;
  }
};

export const updateReplyFade = async (replyId: string, currentCount: number): Promise<Reply> => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .update({ fade: currentCount + 1 })
      .eq('id', replyId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating reply fade count:', error);
      throw error;
    }
    
    return data as Reply;
  } catch (error) {
    console.error('Error updating reply fade count:', error);
    throw error;
  }
};
