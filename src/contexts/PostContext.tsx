
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, TagType } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { getPosts, createPost, updatePullingUp, updateFade } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PostContextType {
  posts: Post[];
  addPost: (message: string, location?: string, tags?: TagType[]) => void;
  incrementPullingUp: (postId: string) => void;
  incrementFade: (postId: string) => void;
  loading: boolean;
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

  // Query to fetch posts
  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    refetchInterval: 60000, // Refetch every minute to check for expired posts
  });

  // Mutation to add a new post
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

  // Mutation to increment pullingUp count
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

  // Mutation to increment fade count
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

  return (
    <PostContext.Provider value={{ 
      posts, 
      addPost, 
      incrementPullingUp,
      incrementFade, 
      loading: loading || addPostMutation.isPending || updatePullingUpMutation.isPending || updateFadeMutation.isPending
    }}>
      {children}
    </PostContext.Provider>
  );
};
