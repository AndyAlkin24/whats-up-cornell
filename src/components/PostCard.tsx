
import React from 'react';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { MapPin, ThumbsUp } from 'lucide-react';
import Tag from '@/components/Tag';
import { usePostContext } from '@/contexts/PostContext';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { incrementPullingUp } = usePostContext();
  
  const handlePullingUp = () => {
    incrementPullingUp(post.id);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(post.timestamp, { addSuffix: true })}
        </div>
      </div>
      
      <p className="text-lg font-medium mb-2">{post.message}</p>
      
      {post.location && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{post.location}</span>
        </div>
      )}
      
      {post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map(tag => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="border-cornell-red text-cornell-red hover:bg-cornell-red/10 flex items-center gap-1"
          onClick={handlePullingUp}
        >
          <ThumbsUp className="h-4 w-4" />
          I'm Pulling Up
          {post.pullingUp > 0 && (
            <span className="ml-1 bg-cornell-red text-white px-2 py-0.5 rounded-full text-xs">
              {post.pullingUp}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
