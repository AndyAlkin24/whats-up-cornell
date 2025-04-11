
import React from 'react';
import { usePostContext } from '@/contexts/PostContext';
import PostCard from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

const PostFeed = () => {
  const { posts, loading } = usePostContext();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 mb-4">No posts yet.</p>
        <p className="text-gray-500">Be the first to share what's happening at Cornell!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
