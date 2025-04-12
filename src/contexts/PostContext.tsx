
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, TagType } from '@/types/post';
import { Reply } from '@/types/reply';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { 
  getPosts, 
  createPost, 
  updatePullingUp, 
  updateFade,
  getReplies,
  createReply,
  updateReplyPullingUp,
  updateReplyFade,
  supabase
} from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PostContextType {
  posts: Post[];
  addPost: (message: string, location?: string, tags?: TagType[]) => void;
  incrementPullingUp: (postId: string) => void;
  incrementFade: (postId: string) => void;
  loading: boolean;
  getRepliesForPost: (postId: string) => Promise<Reply[]>;
  addReplyToPost: (postId: string, message: string) => void;
  incrementReplyPullingUp: (replyId: string) => void;
  incrementReplyFade: (replyId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    refetchInterval: 60000,
  });

  const addPostMutation = useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => createPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created",
        description: "Your post is now live!",
      });
    },
    onError: (error) => {
      console.error('Error adding post:', error);
      toast({
        title: "Error creating post",
        description: "There was a problem creating your post.",
        variant: "destructive"
      });
    },
  });

  const updatePullingUpMutation = useMutation({
    mutationFn: ({ postId, currentCount }: { postId: string; currentCount: number }) => 
      updatePullingUp(postId, currentCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error updating pulling up count:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the count.",
        variant: "destructive"
      });
    },
  });

  const updateFadeMutation = useMutation({
    mutationFn: ({ postId, currentCount }: { postId: string; currentCount: number }) => 
      updateFade(postId, currentCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error updating fade count:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the count.",
        variant: "destructive"
      });
    },
  });

  const addReplyMutation = useMutation({
    mutationFn: (newReply: Omit<Reply, 'id'>) => createReply(newReply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['replies', variables.post_id] });
      toast({
        title: "Reply added",
        description: "Your reply has been posted!",
      });
    },
    onError: (error) => {
      console.error('Error adding reply:', error);
      toast({
        title: "Error adding reply",
        description: "There was a problem posting your reply.",
        variant: "destructive"
      });
    },
  });

  const updateReplyPullingUpMutation = useMutation({
    mutationFn: ({ replyId, currentCount }: { replyId: string; currentCount: number }) => 
      updateReplyPullingUp(replyId, currentCount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['replies', data.post_id] });
    },
    onError: (error) => {
      console.error('Error updating reply pulling up count:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the count.",
        variant: "destructive"
      });
    },
  });

  const updateReplyFadeMutation = useMutation({
    mutationFn: ({ replyId, currentCount }: { replyId: string; currentCount: number }) => 
      updateReplyFade(replyId, currentCount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['replies', data.post_id] });
    },
    onError: (error) => {
      console.error('Error updating reply fade count:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the count.",
        variant: "destructive"
      });
    },
  });

  const addPost = (message: string, location?: string, tags: TagType[] = []) => {
    const newPost: Omit<Post, 'id'> = {
      message,
      location,
      tags,
      timestamp: Date.now(),
      pullingUp: 0,
      fade: 0
    };
    
    addPostMutation.mutate(newPost);
  };

  const incrementPullingUp = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    updatePullingUpMutation.mutate({ 
      postId, 
      currentCount: post.pullingUp 
    });
  };

  const incrementFade = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    updateFadeMutation.mutate({ 
      postId, 
      currentCount: post.fade 
    });
  };

  const getRepliesForPost = async (postId: string): Promise<Reply[]> => {
    try {
      return await getReplies(postId);
    } catch (error) {
      console.error('Error fetching replies for post:', error);
      return [];
    }
  };

  const addReplyToPost = (postId: string, message: string) => {
    const newReply: Omit<Reply, 'id'> = {
      post_id: postId,
      message,
      timestamp: Date.now(),
      pullingup: 0,
      fade: 0
    };
    
    addReplyMutation.mutate(newReply);
  };

  const incrementReplyPullingUp = (replyId: string) => {
    queryClient.fetchQuery({
      queryKey: ['reply', replyId],
      queryFn: async () => {
        const { data } = await supabase
          .from('replies')
          .select('pullingup')
          .eq('id', replyId)
          .single();
        return data;
      }
    }).then(data => {
      if (data) {
        updateReplyPullingUpMutation.mutate({ 
          replyId, 
          currentCount: data.pullingup || 0
        });
      }
    });
  };

  const incrementReplyFade = (replyId: string) => {
    queryClient.fetchQuery({
      queryKey: ['reply', replyId],
      queryFn: async () => {
        const { data } = await supabase
          .from('replies')
          .select('fade')
          .eq('id', replyId)
          .single();
        return data;
      }
    }).then(data => {
      if (data) {
        updateReplyFadeMutation.mutate({ 
          replyId, 
          currentCount: data.fade || 0
        });
      }
    });
  };

  const isRepliesLoading = 
    addReplyMutation.isPending || 
    updateReplyPullingUpMutation.isPending || 
    updateReplyFadeMutation.isPending;

  return (
    <PostContext.Provider value={{ 
      posts, 
      addPost, 
      incrementPullingUp,
      incrementFade, 
      loading: loading || addPostMutation.isPending || 
              updatePullingUpMutation.isPending || 
              updateFadeMutation.isPending ||
              isRepliesLoading,
      getRepliesForPost,
      addReplyToPost,
      incrementReplyPullingUp,
      incrementReplyFade
    }}>
      {children}
    </PostContext.Provider>
  );
};
