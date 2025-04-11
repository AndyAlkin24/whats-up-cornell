
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, TagType } from '@/types/post';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface PostContextType {
  posts: Post[];
  addPost: (message: string, location?: string, tags?: TagType[]) => void;
  incrementPullingUp: (postId: string) => void;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Load posts from localStorage on mount
  useEffect(() => {
    const loadPosts = () => {
      try {
        const savedPosts = localStorage.getItem('cornellPosts');
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts) as Post[];
          
          // Filter out expired posts (older than 12 hours)
          const currentTime = Date.now();
          const twelveHoursMs = 12 * 60 * 60 * 1000;
          const validPosts = parsedPosts.filter(
            post => currentTime - post.timestamp < twelveHoursMs
          );
          
          setPosts(validPosts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        toast({
          title: "Error loading posts",
          description: "There was a problem loading saved posts.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
    
    // Set up interval to check for expired posts
    const interval = setInterval(() => {
      setPosts(currentPosts => {
        const currentTime = Date.now();
        const twelveHoursMs = 12 * 60 * 60 * 1000;
        return currentPosts.filter(
          post => currentTime - post.timestamp < twelveHoursMs
        );
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cornellPosts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (message: string, location?: string, tags: TagType[] = []) => {
    const newPost: Post = {
      id: uuidv4(),
      message,
      location,
      tags,
      timestamp: Date.now(),
      pullingUp: 0
    };
    
    setPosts(prev => [newPost, ...prev]);
    toast({
      title: "Post created",
      description: "Your post is now live!",
    });
  };

  const incrementPullingUp = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, pullingUp: post.pullingUp + 1 } 
          : post
      )
    );
  };

  return (
    <PostContext.Provider value={{ posts, addPost, incrementPullingUp, loading }}>
      {children}
    </PostContext.Provider>
  );
};
